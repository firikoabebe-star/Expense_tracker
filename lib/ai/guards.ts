import "server-only";

import { createHash } from "node:crypto";

/**
 * Shared guardrails for every AI feature: per-user rate limits, a global
 * budget, a small TTL cache, stable error mapping and the `withAiGuards`
 * wrapper. No network calls happen here — feature code supplies the Gemini
 * call and receives either `{ ok: true, data }` or `{ ok: false, code,
 * message }`.
 *
 * IN-MEMORY ONLY: every counter and cache entry lives in a module-level map.
 * On Vercel (or any serverless host) each instance and region has its own
 * copy, cold starts reset them and concurrent instances may each allow the
 * full quota, so the limits are approximate rather than globally exact. The
 * storage is hidden behind the `CounterStore` / `CacheStore` interfaces below;
 * swap `counterStore` and `cacheStore` for a database- or Redis-backed
 * implementation when exact limiting is required.
 *
 * Default budgets sit below the free-tier Gemini limits verified for this
 * project (`gemini-3.8-flash` ≈ 5 RPM / 20 RPD, flash-lite ≈ 10+ RPM / 500
 * RPD) and leave headroom for one retry plus manual testing. Google does not
 * publish guaranteed numbers — check the project's quota in AI Studio.
 */

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;
const AI_RATE_KEY = "ai";

const DEFAULT_USER_RPM = 5;
const DEFAULT_USER_RPD = 20;
const DEFAULT_GLOBAL_RPM = 4;
const DEFAULT_GLOBAL_RPD = 15;
const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_CACHE_TTL_MS = 5 * MINUTE_MS;
const MAX_CACHE_ENTRIES = 200;
const COUNTER_SWEEP_EVERY = 256;
const RETRY_BACKOFF_MS = 300;

/* -------------------------------------------------------------------------- */
/* Swappable storage                                                          */
/* -------------------------------------------------------------------------- */

export interface CounterEntry {
  count: number;
  resetAt: number;
}

export interface CounterStore {
  /** Increments the fixed-window counter for `key` and returns its state. */
  consume(key: string, windowMs: number, now: number): CounterEntry;
  readonly size: number;
  reset(): void;
}

export interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number;
}

export interface CacheStore {
  get(key: string): CacheEntry | undefined;
  set(key: string, entry: CacheEntry): void;
  delete(key: string): void;
  readonly size: number;
  reset(): void;
}

class MemoryCounterStore implements CounterStore {
  private entries = new Map<string, CounterEntry>();
  private hits = 0;

  consume(key: string, windowMs: number, now: number): CounterEntry {
    let entry = this.entries.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      this.entries.set(key, entry);
    }
    entry.count += 1;

    // Periodically drop expired windows so the map cannot grow forever.
    this.hits += 1;
    if (this.hits % COUNTER_SWEEP_EVERY === 0) {
      for (const [entryKey, value] of this.entries) {
        if (value.resetAt <= now) this.entries.delete(entryKey);
      }
    }

    return entry;
  }

  get size(): number {
    return this.entries.size;
  }

  reset(): void {
    this.entries.clear();
    this.hits = 0;
  }
}

class MemoryCacheStore implements CacheStore {
  private entries = new Map<string, CacheEntry>();

  constructor(private readonly maxEntries = MAX_CACHE_ENTRIES) {}

  get(key: string): CacheEntry | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }

  set(key: string, entry: CacheEntry): void {
    // Re-inserting moves the key to the end of the Map's insertion order.
    this.entries.delete(key);
    this.entries.set(key, entry);

    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next();
      if (oldest.done) break;
      this.entries.delete(oldest.value);
    }
  }

  delete(key: string): void {
    this.entries.delete(key);
  }

  get size(): number {
    return this.entries.size;
  }

  reset(): void {
    this.entries.clear();
  }
}

/** Swap these two instances to move limiting/caching to Redis or Postgres. */
const counterStore: CounterStore = new MemoryCounterStore();
const cacheStore: CacheStore = new MemoryCacheStore();
const inFlight = new Map<string, Promise<unknown>>();

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

function readPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export interface AiLimits {
  userRpm: number;
  userRpd: number;
  globalRpm: number;
  globalRpd: number;
}

export function aiLimits(): AiLimits {
  return {
    userRpm: readPositiveInt("AI_USER_RPM", DEFAULT_USER_RPM),
    userRpd: readPositiveInt("AI_USER_RPD", DEFAULT_USER_RPD),
    globalRpm: readPositiveInt("AI_GLOBAL_RPM", DEFAULT_GLOBAL_RPM),
    globalRpd: readPositiveInt("AI_GLOBAL_RPD", DEFAULT_GLOBAL_RPD),
  };
}

/* -------------------------------------------------------------------------- */
/* Rate limiting / global budget                                              */
/* -------------------------------------------------------------------------- */

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterSec: number;
}

function consumeLimit(scope: string, key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowMs = Math.max(1, Math.trunc(options.windowMs));
  const max = Math.max(1, Math.trunc(options.max));
  const entry = counterStore.consume(`${scope}:${key}:${windowMs}`, windowMs, now);
  const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  return { ok: entry.count <= max, retryAfterSec };
}

/** Per-user fixed-window limit. `key` namespaces independent buckets. */
export function rateLimit(
  userId: string,
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  return consumeLimit(`user:${userId}`, key, options);
}

/** Same as `rateLimit`, but shared by every user to protect the API key. */
export function globalRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  return consumeLimit("global", key, options);
}

/* -------------------------------------------------------------------------- */
/* Cache                                                                      */
/* -------------------------------------------------------------------------- */

function stableStringify(value: unknown): string {
  const seen = new WeakSet<object>();

  const normalize = (input: unknown): unknown => {
    if (input === null || typeof input !== "object") {
      return typeof input === "bigint" ? input.toString() : input;
    }
    if (seen.has(input)) return "[circular]";
    seen.add(input);

    if (Array.isArray(input)) return input.map(normalize);
    if (input instanceof Date) return input.toISOString();

    const record = input as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) sorted[key] = normalize(record[key]);
    return sorted;
  };

  return JSON.stringify(normalize(value)) ?? "null";
}

/**
 * Namespaced cache key: the feature, the owning user and a hash of the input.
 * Including the user id guarantees one user's result is never served to
 * another; hashing keeps the key short and safe for arbitrary input.
 */
export function buildCacheKey(userId: string, feature: string, input: unknown): string {
  const inputHash = createHash("sha256")
    .update(stableStringify(input))
    .digest("hex")
    .slice(0, 40);
  return `${feature}:${userId}:${inputHash}`;
}

/**
 * Returns the cached value or runs `producer` once. Simultaneous callers with
 * the same key share the in-flight promise, so they trigger a single Gemini
 * call. Errors are never cached. Expired entries are removed on read and the
 * oldest entries are evicted once `MAX_CACHE_ENTRIES` is exceeded.
 */
export async function getOrSet<T>(
  key: string,
  ttlMs: number = DEFAULT_CACHE_TTL_MS,
  producer: () => Promise<T>
): Promise<T> {
  const cached = cacheStore.get(key);
  if (cached) return cached.value as T;

  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;

  const ttl = Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : 0;
  const task = (async () => {
    try {
      const value = await producer();
      if (ttl > 0) cacheStore.set(key, { value, expiresAt: Date.now() + ttl });
      return value;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, task);
  return task;
}

/* -------------------------------------------------------------------------- */
/* Error mapping                                                              */
/* -------------------------------------------------------------------------- */

export type AiErrorCode =
  | "rate_limited"
  | "unauthorized"
  | "timeout"
  | "safety_blocked"
  | "invalid_output"
  | "unavailable"
  | "unknown";

export interface MappedAiError {
  code: AiErrorCode;
  userMessage: string;
}

/**
 * Friendly, provider-agnostic text. Never include keys, stack traces or raw
 * provider messages here.
 */
const USER_MESSAGES: Record<AiErrorCode, string> = {
  rate_limited:
    "The AI assistant is receiving too many requests right now. Please try again in a moment.",
  unauthorized:
    "The AI assistant isn't available right now. Please try again later.",
  timeout: "The AI assistant took too long to respond. Please try again.",
  safety_blocked:
    "That request couldn't be completed. Please rephrase it and try again.",
  invalid_output:
    "The AI assistant returned an unexpected response. Please try again.",
  unavailable:
    "The AI assistant is temporarily unavailable. Please try again in a moment.",
  unknown: "Something went wrong with the AI assistant. Please try again.",
};

/** Friendly text for a stable error code (safe to show to end users). */
export function aiErrorUserMessage(code: AiErrorCode): string {
  return USER_MESSAGES[code];
}

export class AiTimeoutError extends Error {
  constructor() {
    super("AI request timed out");
    this.name = "AiTimeoutError";
  }
}

/** Throw from feature code when Gemini reports a safety/finish block. */
export class AiSafetyBlockedError extends Error {
  constructor() {
    super("AI response was blocked by safety filters");
    this.name = "AiSafetyBlockedError";
  }
}

/** Throw from feature code when a response cannot be parsed as expected. */
export class AiInvalidOutputError extends Error {
  constructor() {
    super("AI response could not be parsed");
    this.name = "AiInvalidOutputError";
  }
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : "";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "";
}

function errorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const record = error as Record<string, unknown>;
  const candidates = [
    record.status,
    record.statusCode,
    record.code,
    (record.response as Record<string, unknown> | undefined)?.status,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "number" && candidate >= 100 && candidate < 600) {
      return candidate;
    }
  }
  return undefined;
}

function errorCode(error: unknown): string {
  if (!error || typeof error !== "object") return "";
  const code = (error as Record<string, unknown>).code;
  return typeof code === "string" ? code.toUpperCase() : "";
}

function isTimeoutError(error: unknown): boolean {
  if (error instanceof AiTimeoutError) return true;
  const name = errorName(error);
  return name === "AbortError" || name === "TimeoutError";
}

/**
 * Only 5xx and network failures are worth retrying. Timeouts and client
 * errors (including 429) are never retried by `withAiGuards`.
 */
export function isTransientAiError(error: unknown): boolean {
  if (isTimeoutError(error)) return false;

  const status = errorStatus(error);
  if (status !== undefined) return status >= 500 && status <= 599;

  const code = errorCode(error);
  if (
    ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "EAI_AGAIN", "EPIPE", "UND_ERR_SOCKET"].includes(
      code
    )
  ) {
    return true;
  }

  const name = errorName(error);
  if (name === "FetchError" || name === "NetworkError") return true;

  return /fetch failed|network error|socket hang up|connection reset|connect etimedout/i.test(
    errorMessage(error)
  );
}

export function mapAiError(error: unknown): MappedAiError {
  const status = errorStatus(error);
  const code = errorCode(error);
  const name = errorName(error);
  const message = errorMessage(error);

  if (isTimeoutError(error)) return { code: "timeout", userMessage: USER_MESSAGES.timeout };

  if (
    status === 429 ||
    code === "RESOURCE_EXHAUSTED" ||
    /rate limit|quota exceeded|too many requests/i.test(message)
  ) {
    return { code: "rate_limited", userMessage: USER_MESSAGES.rate_limited };
  }

  if (
    status === 401 ||
    status === 403 ||
    ["UNAUTHENTICATED", "PERMISSION_DENIED", "API_KEY_INVALID"].includes(code) ||
    /invalid api key|api key not valid|permission denied|unauthenticated|unauthorized/i.test(
      message
    )
  ) {
    return { code: "unauthorized", userMessage: USER_MESSAGES.unauthorized };
  }

  if (
    error instanceof AiSafetyBlockedError ||
    name === "AiSafetyBlockedError" ||
    /safety|responsible ai|prohibited|blocked by.*filter|recitation/i.test(message)
  ) {
    return { code: "safety_blocked", userMessage: USER_MESSAGES.safety_blocked };
  }

  if (
    error instanceof AiInvalidOutputError ||
    name === "AiInvalidOutputError" ||
    error instanceof SyntaxError ||
    /unexpected token|unexpected end of json|invalid json/i.test(message)
  ) {
    return { code: "invalid_output", userMessage: USER_MESSAGES.invalid_output };
  }

  if (isTransientAiError(error)) {
    return { code: "unavailable", userMessage: USER_MESSAGES.unavailable };
  }

  return { code: "unknown", userMessage: USER_MESSAGES.unknown };
}

/* -------------------------------------------------------------------------- */
/* Guarded execution                                                          */
/* -------------------------------------------------------------------------- */

export interface AiGuardOptions {
  /** Budget for all attempts combined. Defaults to 20 seconds. */
  timeoutMs?: number;
  /** Set to false to skip the single transient retry. */
  retryTransient?: boolean;
}

export type AiGuardResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: AiErrorCode; message: string };

export interface AiGuardContext {
  /** Aborted when the timeout is reached; pass to the SDK as `abortSignal`. */
  signal: AbortSignal;
}

function limitMessage(retryAfterSec: number, global: boolean): string {
  const prefix = global
    ? "The AI assistant is busy right now."
    : "You've reached the AI usage limit.";
  if (retryAfterSec >= 3600) return `${prefix} Please try again later.`;
  if (retryAfterSec >= 120) {
    return `${prefix} Please try again in ${Math.ceil(retryAfterSec / 60)} minutes.`;
  }
  return `${prefix} Please try again in ${retryAfterSec} second${
    retryAfterSec === 1 ? "" : "s"
  }.`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runWithTimeout<T>(
  fn: (context: AiGuardContext) => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new AiTimeoutError());
    }, timeoutMs);
  });

  const work = Promise.resolve().then(() => fn({ signal: controller.signal }));

  return Promise.race([work, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

/**
 * Runs one AI feature call behind the shared guardrails. The caller is
 * responsible for authenticating and resolving `userId` first. Never throws:
 * quota, timeout and provider failures all come back as `{ ok: false }`.
 *
 * A rejected global budget still consumes one per-user unit; that is
 * intentional, because the user's own budget is the less scarce resource.
 */
export async function withAiGuards<T>(
  userId: string,
  feature: string,
  fn: (context: AiGuardContext) => Promise<T>,
  options: AiGuardOptions = {}
): Promise<AiGuardResult<T>> {
  if (!userId || !userId.trim()) {
    return { ok: false, code: "unauthorized", message: USER_MESSAGES.unauthorized };
  }

  const limits = aiLimits();

  const userMinute = rateLimit(userId, AI_RATE_KEY, {
    max: limits.userRpm,
    windowMs: MINUTE_MS,
  });
  if (!userMinute.ok) {
    return {
      ok: false,
      code: "rate_limited",
      message: limitMessage(userMinute.retryAfterSec, false),
    };
  }

  const userDay = rateLimit(userId, AI_RATE_KEY, {
    max: limits.userRpd,
    windowMs: DAY_MS,
  });
  if (!userDay.ok) {
    return {
      ok: false,
      code: "rate_limited",
      message: limitMessage(userDay.retryAfterSec, false),
    };
  }

  const globalMinute = globalRateLimit(AI_RATE_KEY, {
    max: limits.globalRpm,
    windowMs: MINUTE_MS,
  });
  if (!globalMinute.ok) {
    return {
      ok: false,
      code: "rate_limited",
      message: limitMessage(globalMinute.retryAfterSec, true),
    };
  }

  const globalDay = globalRateLimit(AI_RATE_KEY, {
    max: limits.globalRpd,
    windowMs: DAY_MS,
  });
  if (!globalDay.ok) {
    return {
      ok: false,
      code: "rate_limited",
      message: limitMessage(globalDay.retryAfterSec, true),
    };
  }

  const timeoutMs = Math.max(1, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const deadline = Date.now() + timeoutMs;
  const maxAttempts = options.retryTransient === false ? 1 : 2;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      lastError = new AiTimeoutError();
      break;
    }

    try {
      const data = await runWithTimeout(fn, remaining);
      return { ok: true, data };
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts || !isTransientAiError(error)) break;
      await delay(Math.min(RETRY_BACKOFF_MS, Math.max(0, deadline - Date.now())));
    }
  }

  const mapped = mapAiError(lastError);
  if (mapped.code === "unknown") {
    // Never log raw provider text: it can contain keys or stack traces.
    console.error("[ai] unexpected failure", {
      feature,
      error: errorName(lastError) || typeof lastError,
    });
  }
  return { ok: false, code: mapped.code, message: mapped.userMessage };
}

/* -------------------------------------------------------------------------- */
/* Diagnostics                                                                */
/* -------------------------------------------------------------------------- */

export function getAiGuardStats(): {
  counterKeys: number;
  cacheEntries: number;
  inFlight: number;
} {
  return {
    counterKeys: counterStore.size,
    cacheEntries: cacheStore.size,
    inFlight: inFlight.size,
  };
}

/** Clears all in-memory state. Intended for tests and local scripts. */
export function resetAiGuards(): void {
  counterStore.reset();
  cacheStore.reset();
  inFlight.clear();
}

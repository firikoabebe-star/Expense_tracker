import "server-only";

import { createHash } from "node:crypto";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import {
  AiInvalidOutputError,
  AiSafetyBlockedError,
  aiErrorUserMessage,
  buildCacheKey,
  getOrSet,
  mapAiError,
  withAiGuards,
  type AiErrorCode,
  type AiGuardResult,
} from "./guards";

/**
 * Thin, guarded wrapper around the Gemini SDK for JSON-producing features.
 *
 * Credentials and the client are created lazily inside `generateJson`, so
 * importing this module (or building the app) never requires GEMINI_API_KEY.
 * Every call goes through `withAiGuards` for the per-user/global rate limits,
 * 20s timeout, single transient retry and friendly error mapping; successful
 * results are cached per user + input hash.
 *
 * Only `models.generateContent` is used (not the Interactions API). The SDK's
 * `responseJsonSchema` is fed from the caller's zod schema when it can be
 * converted, and the parsed JSON is always re-validated with zod.
 */

/** Default verified to work on the project's free tier. */
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const DEFAULT_FEATURE = "gemini-json";
const DEFAULT_CACHE_TTL_MS = 5 * 60_000;
const SAFETY_FINISH_REASONS = new Set([
  "SAFETY",
  "RECITATION",
  "BLOCKLIST",
  "PROHIBITED_CONTENT",
  "SPII",
]);

export interface GenerateJsonImage {
  /** Base64 string; a leading `data:<mime>;base64,` prefix is stripped. */
  data: string;
  /** IANA type, e.g. `image/jpeg` or `image/png`. */
  mimeType: string;
}

export interface GenerateJsonOptions {
  /** Signed-in user id (better-auth `session.user.id`); scopes limits + cache. */
  userId: string;
  /** Logical feature name used in cache keys and logs. */
  feature?: string;
  /** Optional image part (receipts), sent inline. */
  image?: GenerateJsonImage;
  /** Cache lifetime in ms; `0` disables reading/writing the cache. */
  cacheTtlMs?: number;
  /** Extra material mixed into the cache key, e.g. an aggregate fingerprint. */
  cacheKeyExtra?: string;
  /** Total budget for the call across retries; defaults to 20s. */
  timeoutMs?: number;
}

export type GenerateJsonResult<T> = AiGuardResult<T>;

type AiFailure = { ok: false; code: AiErrorCode; message: string };

/** Carries a guard failure out of `getOrSet` so errors are never cached. */
class FailedResultError extends Error {
  constructor(readonly failure: AiFailure) {
    super("AI request failed");
    this.name = "FailedResultError";
  }
}

/** Mapped to `unauthorized` by the 401 status. */
class MissingApiKeyError extends Error {
  readonly status = 401;

  constructor() {
    super("GEMINI_API_KEY is not configured");
    this.name = "MissingApiKeyError";
  }
}

function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 40);
}

function normalizeImage(image: GenerateJsonImage): { mimeType: string; data: string } {
  return {
    mimeType: image.mimeType?.trim().toLowerCase() || "image/jpeg",
    data: image.data.replace(/^data:[^;]+;base64,/, "").trim(),
  };
}

/**
 * Converts a zod schema to the JSON Schema dialect Gemini accepts. The
 * `$schema` marker is not in Gemini's supported subset, so it is removed.
 * Returns undefined (falling back to JSON mode + zod validation) when the
 * schema cannot be represented.
 */
function toGeminiJsonSchema(schema: z.ZodType): Record<string, unknown> | undefined {
  try {
    const json = z.toJSONSchema(schema) as unknown as Record<string, unknown>;
    delete json.$schema;
    return json;
  } catch {
    return undefined;
  }
}

function cacheKeyFor(
  userId: string,
  feature: string,
  model: string,
  prompt: string,
  jsonSchema: Record<string, unknown> | undefined,
  image: { mimeType: string; data: string } | undefined,
  cacheKeyExtra: string | undefined
): string {
  return buildCacheKey(userId, feature, {
    model,
    prompt,
    schema: jsonSchema ?? null,
    image: image ? { mimeType: image.mimeType, sha256: sha256(image.data) } : null,
    extra: cacheKeyExtra ?? null,
  });
}

function failure(code: AiErrorCode, message = aiErrorUserMessage(code)): AiFailure {
  return { ok: false, code, message };
}

function assertNotBlocked(response: {
  promptFeedback?: { blockReason?: string };
  candidates?: Array<{ finishReason?: string }>;
}): void {
  const blockReason = response.promptFeedback?.blockReason;
  if (blockReason && blockReason !== "BLOCKED_REASON_UNSPECIFIED") {
    throw new AiSafetyBlockedError();
  }

  for (const candidate of response.candidates ?? []) {
    if (candidate.finishReason && SAFETY_FINISH_REASONS.has(candidate.finishReason)) {
      throw new AiSafetyBlockedError();
    }
  }
}

async function runModel<T>(
  model: string,
  prompt: string,
  schema: z.ZodType<T>,
  jsonSchema: Record<string, unknown> | undefined,
  image: { mimeType: string; data: string } | undefined,
  signal: AbortSignal
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new MissingApiKeyError();

  const client = new GoogleGenAI({ apiKey });
  const contents = image
    ? [{ inlineData: { mimeType: image.mimeType, data: image.data } }, { text: prompt }]
    : prompt;

  const response = await client.models.generateContent({
    model,
    contents,
    config: {
      temperature: 0,
      responseMimeType: "application/json",
      ...(jsonSchema ? { responseJsonSchema: jsonSchema } : {}),
      abortSignal: signal,
    },
  });

  assertNotBlocked(response);

  // `text` is a getter on GenerateContentResponse, not a method.
  const text = response.text;
  if (!text || !text.trim()) throw new AiInvalidOutputError();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new AiInvalidOutputError();
  }

  const validated = schema.safeParse(parsed);
  if (!validated.success) throw new AiInvalidOutputError();

  return validated.data;
}

/**
 * Generates a JSON response and validates it against `schema`.
 *
 * Never throws: quota, timeout, blocked output, bad credentials and parse
 * failures all come back as `{ ok: false, code, message }` with friendly text.
 * Concurrent identical requests share one Gemini call, and successful results
 * are cached for `cacheTtlMs` (5 minutes by default) per user. The cache key
 * includes the model, the converted schema and a hash of the image, and cached
 * values are validated again before they are returned.
 */
export async function generateJson<T>(
  prompt: string,
  schema: z.ZodType<T>,
  options: GenerateJsonOptions
): Promise<GenerateJsonResult<T>> {
  const userId = options.userId?.trim();
  if (!userId) return failure("unauthorized");

  const feature = options.feature?.trim() || DEFAULT_FEATURE;
  const model = getModel();
  const image = options.image ? normalizeImage(options.image) : undefined;
  const jsonSchema = toGeminiJsonSchema(schema);
  const ttlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;

  const runGuarded = (): Promise<GenerateJsonResult<T>> =>
    withAiGuards(
      userId,
      feature,
      ({ signal }) => runModel(model, prompt, schema, jsonSchema, image, signal),
      options.timeoutMs === undefined ? {} : { timeoutMs: options.timeoutMs }
    );

  if (!Number.isFinite(ttlMs) || ttlMs <= 0) return runGuarded();

  const key = cacheKeyFor(
    userId,
    feature,
    model,
    prompt,
    jsonSchema,
    image,
    options.cacheKeyExtra
  );

  try {
    const data = await getOrSet(key, ttlMs, async () => {
      const result = await runGuarded();
      if (!result.ok) throw new FailedResultError(result);
      return result.data;
    });

    // Re-validate even cached values, so a stale/foreign entry can never
    // reach a caller with a different schema.
    const validated = schema.safeParse(data);
    if (!validated.success) return failure("invalid_output");
    return { ok: true, data: validated.data };
  } catch (error) {
    if (error instanceof FailedResultError) return error.failure;
    const mapped = mapAiError(error);
    return { ok: false, code: mapped.code, message: mapped.userMessage };
  }
}

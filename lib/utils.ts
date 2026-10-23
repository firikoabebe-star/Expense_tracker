import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  return `ETB${num.toLocaleString("en-US")}`;
}

/** Amounts at or above this are abbreviated where space is tight (cards, tables). */
export const COMPACT_CURRENCY_THRESHOLD = 1_000_000;

/**
 * Compact variant of formatCurrency for cards, stat cards, table cells and
 * chart axis labels, where a long amount would otherwise break the layout.
 * Below the threshold the full value with separators is kept (ETB999,999);
 * from 1,000,000 the value is abbreviated with up to two decimals and the
 * trailing zeros trimmed: ETB 1.43M, ETB 94.34M, ETB 100M, ETB 1.2B.
 * Always pair this with a title/tooltip holding formatCurrency() so the exact
 * number stays reachable.
 */
export function formatCompactCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(num) || Math.abs(num) < COMPACT_CURRENCY_THRESHOLD) {
    return formatCurrency(Number.isFinite(num) ? num : 0);
  }
  const compact = num.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  });
  return `ETB ${compact}`;
}

export const MAX_BUDGET_AMOUNT = 100_000_000;
export const MAX_EXPENSE_AMOUNT = 100_000_000;
export const MAX_BUDGET_NAME_LENGTH = 40;
export const MAX_EXPENSE_NAME_LENGTH = 80;

const AMOUNT_FORMAT_MESSAGE = "Enter a number like 2500, 250k or 1.43m";
const AMOUNT_MULTIPLIERS: Record<string, number> = {
  k: 1_000,
  m: 1_000_000,
  b: 1_000_000_000,
};

export type ParsedAmount =
  | { valid: true; value: number }
  | { valid: false; message: string };

export interface MoneyAmountOptions {
  max: number;
}

export type MoneyAmountValidation =
  | { valid: true; message: ""; value: number }
  | { valid: false; message: string; value: null };

function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Parses what a user types into a number. Accepts an optional leading "ETB",
 * spaces and thousands separators, and a single k/m/b suffix ("1.5m"). The
 * multiplication is rounded to two decimals so 1.43m is exactly 1430000.
 */
export function parseAmountInput(raw: string): ParsedAmount {
  if (typeof raw !== "string") {
    return { valid: false, message: AMOUNT_FORMAT_MESSAGE };
  }

  const compact = raw
    .trim()
    .replace(/[\s,]/g, "")
    .replace(/^etb/i, "");
  const match = /^(\d+(?:\.\d+)?)([kmb])?$/i.exec(compact);
  if (!match) {
    return { valid: false, message: AMOUNT_FORMAT_MESSAGE };
  }

  const suffix = match[2]?.toLowerCase();
  const multiplier = suffix ? AMOUNT_MULTIPLIERS[suffix] : 1;
  const value = roundToTwoDecimals(Number(match[1]) * multiplier);
  if (!Number.isFinite(value)) {
    return { valid: false, message: AMOUNT_FORMAT_MESSAGE };
  }

  return { valid: true, value };
}

function formatAmountLimit(max: number): string {
  if (max >= 1_000_000 && max % 1_000_000 === 0) return `${max / 1_000_000}M`;
  if (max >= 1_000 && max % 1_000 === 0) return `${max / 1_000}k`;
  return max.toLocaleString("en-US");
}

/**
 * Shared client/server validation for money fields, which are stored as
 * numeric strings. Builds on parseAmountInput and additionally requires a
 * positive value, at most two decimal places after conversion and <= max.
 */
export function validateMoneyAmount(
  raw: string | number,
  { max }: MoneyAmountOptions
): MoneyAmountValidation {
  const parsed = parseAmountInput(typeof raw === "number" ? String(raw) : raw);
  if (!parsed.valid) {
    return { valid: false, message: parsed.message, value: null };
  }
  if (parsed.value <= 0) {
    return { valid: false, message: "Enter an amount greater than 0", value: null };
  }
  if (parsed.value > max) {
    return {
      valid: false,
      message: `Amount can't be more than ETB ${formatAmountLimit(max)}`,
      value: null,
    };
  }

  const scaled = parsed.value * 100;
  if (Math.abs(scaled - Math.round(scaled)) > 1e-6) {
    return {
      valid: false,
      message: "Amount can have at most 2 decimal places",
      value: null,
    };
  }

  return { valid: true, message: "", value: parsed.value };
}

/**
 * Expenses keep their date in a DD/MM/YYYY varchar, so it has to be parsed
 * explicitly before it can be compared chronologically (a plain string
 * compare would sort "15/03/2024" before "01/05/2024").
 * Returns null when the value is not a valid date.
 */
export function parseExpenseDate(value: string): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(value ?? "").trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  // Reject rolled-over dates such as 31/02/2024.
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    return null;
  }
  return date;
}

/** Chronological comparator for the DD/MM/YYYY dates kept in expenses.createdAt. */
export function compareExpenseDates(a: string, b: string): number {
  const aTime = parseExpenseDate(a)?.getTime() ?? 0;
  const bTime = parseExpenseDate(b)?.getTime() ?? 0;
  return aTime - bTime;
}

/**
 * Parses a YYYY-MM-DD day key as a local date. `new Date("2024-05-03")` is
 * interpreted as UTC midnight, which renders as the previous day in negative
 * UTC offsets, so the parts are read explicitly instead.
 * Returns null when the value is not a valid day key.
 */
export function parseDayKey(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? "").trim());
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return null;
  if (date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3])) {
    return null;
  }
  return date;
}

/**
 * Quotes a CSV value when it contains a comma, quote, or line break and
 * doubles any embedded quote (RFC 4180).
 */
export function escapeCsvValue(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? "" : String(value);
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * Builds a CSV document from a header row and its data rows. The UTF-8 BOM
 * is prepended so Excel detects the encoding and opens the file correctly.
 */
export function toCsv(rows: Array<Array<string | number | null | undefined>>): string {
  const body = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
  return `\uFEFF${body}`;
}

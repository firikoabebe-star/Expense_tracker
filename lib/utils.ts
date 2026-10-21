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

import { parseDayKey, parseExpenseDate } from '/lib/utils'

const SHORT_DATE = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
} as const

/**
 * Series keys are `YYYY-MM-DD` for daily ranges and `YYYY-MM` for monthly
 * ones. Both are rendered as a compact axis label.
 */
export function formatSeriesKey(key: string): string {
  if (/^\d{4}-\d{2}$/.test(key)) {
    const [year, month] = key.split('-')
    const date = new Date(Number(year), Number(month) - 1, 1)
    if (Number.isNaN(date.getTime())) return key
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  const day = parseDayKey(key)
  return day
    ? day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : key
}

/** Full label for tooltips: always unambiguous about the period. */
export function formatSeriesKeyLong(key: string): string {
  if (/^\d{4}-\d{2}$/.test(key)) {
    const [year, month] = key.split('-')
    const date = new Date(Number(year), Number(month) - 1, 1)
    if (Number.isNaN(date.getTime())) return key
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const day = parseDayKey(key)
  return day
    ? day.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : key
}

/** Formats an ISO timestamp or Date, falling back to an em dash. */
export function formatDateValue(value: Date | string | null | undefined) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', SHORT_DATE)
}

/**
 * Activity rows carry an ISO `expenseDate` when the stored DD/MM/YYYY value
 * parsed cleanly, and the raw DD/MM/YYYY string otherwise. Both are handled
 * here so the feed never mis-reads "03/05/2026" as March 5th.
 */
export function parseActivityDate(item: {
  expenseDate?: string
  createdAt?: string
  date?: string
}): Date | null {
  const iso = item.expenseDate
  if (iso) {
    const parsed = new Date(iso)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return (
    parseExpenseDate(item.createdAt ?? '') ?? parseExpenseDate(item.date ?? '')
  )
}

/** Preformatted date cell for the activity feed. */
export function formatActivityDate(item: {
  expenseDate?: string
  createdAt?: string
  date?: string
}): string {
  return formatDateValue(parseActivityDate(item))
}

/** Initials for the avatar chips in the activity feed. */
export function initialsOf(
  name?: string | null,
  email?: string | null
): string {
  const source = (name ?? '').trim() || (email ?? '').trim()
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  const initials = parts
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join('')
  return initials ? initials.toLocaleUpperCase() : '•'
}

/** Percentage helper for the gauges and legend shares. */
export function toPercent(part: number, whole: number): number {
  if (!Number.isFinite(whole) || whole <= 0) return 0
  return Math.round((part / whole) * 1000) / 10
}

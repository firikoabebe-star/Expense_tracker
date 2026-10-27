import {
  addDays,
  addMonths,
  aggregateBuckets,
  buildDayBuckets,
  buildMonthBuckets,
  roundMoney,
} from '/lib/analytics'
import { parseExpenseDate } from '/lib/utils'
import type { ExpenseSummary } from '/types'
import type { DashboardRange } from '../../analytics-actions'

const RANGE_KIND: Record<DashboardRange, 'day' | 'month'> = {
  '7d': 'day',
  '30d': 'day',
  '6m': 'month',
  '12m': 'month',
}

const RANGE_COUNT: Record<DashboardRange, number> = {
  '7d': 7,
  '30d': 30,
  '6m': 6,
  '12m': 12,
}

export interface DateAmount {
  date: Date
  amount: number
}

/** Turns the DD/MM/YYYY expense rows into dated amounts, dropping bad dates. */
export function toDateAmounts(expenses: ExpenseSummary[]): DateAmount[] {
  const entries: DateAmount[] = []
  for (const expense of expenses) {
    const date = parseExpenseDate(expense.createdAt)
    if (!date) continue
    const amount = Number(expense.amount)
    entries.push({ date, amount: Number.isFinite(amount) ? amount : 0 })
  }
  return entries
}

export interface PreviousPeriodSummary {
  /** One value per bucket, aligned with the current period's series. */
  values: number[]
  total: number
  count: number
  average: number
}

/**
 * Rebuilds the range window that ended the period before the current one and
 * totals the expenses that fall inside it. The buckets mirror the server's
 * `getDashboardOverview` windows exactly, so the dashed comparison line and
 * the trend badges describe the same period.
 */
export function summarizePreviousPeriod(
  range: DashboardRange,
  expenses: ExpenseSummary[]
): PreviousPeriodSummary {
  const kind = RANGE_KIND[range]
  const count = RANGE_COUNT[range]
  const now = new Date()
  const currentBuckets =
    kind === 'day'
      ? buildDayBuckets(now, count)
      : buildMonthBuckets(now, count)

  const currentStart = currentBuckets[0].start
  const buckets =
    kind === 'day'
      ? buildDayBuckets(addDays(currentStart, -1), count)
      : buildMonthBuckets(addMonths(currentStart, -1), count)

  const entries = toDateAmounts(expenses)
  const windowStart = buckets[0].start
  const windowEnd = buckets[buckets.length - 1].end

  const windowed = entries.filter(
    (entry) => entry.date >= windowStart && entry.date < windowEnd
  )

  const values = aggregateBuckets(buckets, windowed).values.map(roundMoney)
  const total = roundMoney(
    values.reduce((sum, value) => sum + value, 0)
  )

  return {
    values,
    total,
    count: windowed.length,
    average: windowed.length ? roundMoney(total / windowed.length) : 0,
  }
}

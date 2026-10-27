'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CalendarRange,
  Calculator,
  Download,
  ReceiptText,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '/components/ui/button'
import { Card } from '/components/ui/card'
import {
  aggregateBuckets,
  buildMonthBuckets,
  findBucketIndex,
  roundMoney,
} from '/lib/analytics'
import { authClient } from '/lib/auth-client'
import {
  formatCompactCurrency,
  parseExpenseDate,
  toCsv,
} from '/lib/utils'
import type { ExpenseSummary } from '/types'

import { getAllExpenses } from '../actions'
import {
  getExpenseBudgetTags,
  getExpenseStats,
  type ExpenseStats,
} from '../analytics-actions'
import { DashboardErrorCard } from '../_components/DashboardErrorCard'
import { PageHeader } from '../_components/PageHeader'
import { StatCard } from '../_components/StatCard'
import ExpenseListTable from './_components/ExpenseListTable'
import { toDateAmounts } from '../analytics/_lib/previous-period'

type QuickFilter = 'all' | 'week' | 'month' | 'large'
type StatsState = 'loading' | 'ready' | 'error'

/** Quick filter that surfaces unusually large single expenses. */
const LARGE_EXPENSE_THRESHOLD = 1_000

const FILTERS: { value: QuickFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'large', label: 'Over ETB 1,000' },
]

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 1000) / 10
}

function InfoChip({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className='inline-flex max-w-[9rem] items-center rounded-full bg-accent px-2 py-1 text-xs font-medium text-muted-foreground'
    >
      <span className='truncate'>{children}</span>
    </span>
  )
}

function ExpenseList() {
  const { data: session } = authClient.useSession()
  const user = session?.user
  const router = useRouter()

  const [expensesList, setExpensesList] = React.useState<ExpenseSummary[]>([])
  const [stats, setStats] = React.useState<ExpenseStats | null>(null)
  const [statsState, setStatsState] = React.useState<StatsState>('loading')
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState<QuickFilter>('all')
  const [budgetNames, setBudgetNames] = React.useState<Record<number, string>>({})

  const loadAll = React.useCallback(async () => {
    setLoading(true)
    setStatsState('loading')

    const [expenseResult, statsResult, tagResult] = await Promise.allSettled([
      getAllExpenses(),
      getExpenseStats(),
      getExpenseBudgetTags(),
    ])

    if (expenseResult.status === 'fulfilled') {
      setExpensesList(expenseResult.value)
    } else {
      toast.error('Failed to load expenses')
    }
    setLoading(false)

    if (statsResult.status === 'fulfilled' && statsResult.value.ok) {
      setStats(statsResult.value.data)
      setStatsState('ready')
    } else {
      setStats(null)
      setStatsState('error')
    }

    if (tagResult.status === 'fulfilled' && tagResult.value.ok) {
      const names: Record<number, string> = {}
      for (const tag of tagResult.value.data) names[tag.id] = tag.budgetName
      setBudgetNames(names)
    }
  }, [])

  React.useEffect(() => {
    if (user) loadAll()
  }, [user, loadAll])

  const counts = React.useMemo(() => {
    const now = new Date()
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6
    )
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const dayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    )

    const result = { all: expensesList.length, week: 0, month: 0, large: 0 }
    for (const expense of expensesList) {
      const amount = Number(expense.amount) || 0
      if (amount > LARGE_EXPENSE_THRESHOLD) result.large += 1

      const date = parseExpenseDate(expense.createdAt)
      if (!date) continue
      if (date >= weekStart && date <= dayEnd) result.week += 1
      if (date >= monthStart && date <= dayEnd) result.month += 1
    }
    return result
  }, [expensesList])

  const filtered = React.useMemo(() => {
    if (filter === 'all') return expensesList

    const now = new Date()
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6
    )
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const dayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    )

    return expensesList.filter((expense) => {
      if (filter === 'large') {
        return Number(expense.amount) > LARGE_EXPENSE_THRESHOLD
      }
      const date = parseExpenseDate(expense.createdAt)
      if (!date || date > dayEnd) return false
      return date >= (filter === 'week' ? weekStart : monthStart)
    })
  }, [expensesList, filter])

  const monthly = React.useMemo(() => {
    const buckets = buildMonthBuckets(new Date(), 12)
    const entries = toDateAmounts(expensesList)
    const spend = aggregateBuckets(buckets, entries).values.map(roundMoney)
    const countsByMonth = aggregateBuckets(
      buckets,
      entries.map((entry) => ({ date: entry.date, amount: 1 }))
    ).values
    const largest = buckets.map(() => 0)
    for (const entry of entries) {
      const index = findBucketIndex(buckets, entry.date)
      if (index !== -1 && entry.amount > largest[index]) {
        largest[index] = entry.amount
      }
    }
    return {
      spend,
      average: spend.map((value, index) =>
        countsByMonth[index] ? roundMoney(value / countsByMonth[index]) : 0
      ),
      largest,
    }
  }, [expensesList])

  const monthTotals = React.useMemo(() => {
    const now = new Date()
    const thisStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const nextStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    let thisSpend = 0
    let lastSpend = 0
    let thisCount = 0
    let lastCount = 0

    for (const expense of expensesList) {
      const date = parseExpenseDate(expense.createdAt)
      if (!date) continue
      const amount = Number(expense.amount) || 0
      if (date >= thisStart && date < nextStart) {
        thisSpend += amount
        thisCount += 1
      } else if (date >= lastStart && date < thisStart) {
        lastSpend += amount
        lastCount += 1
      }
    }

    return {
      thisSpend: roundMoney(thisSpend),
      lastSpend: roundMoney(lastSpend),
      thisCount,
      lastCount,
    }
  }, [expensesList])

  const thisAverage =
    monthTotals.thisCount > 0
      ? roundMoney(monthTotals.thisSpend / monthTotals.thisCount)
      : 0
  const lastAverage =
    monthTotals.lastCount > 0
      ? roundMoney(monthTotals.lastSpend / monthTotals.lastCount)
      : 0

  const exportCsv = () => {
    const rows = filtered.map((expense) => [
      expense.name,
      expense.amount,
      expense.createdAt,
    ])
    const csv = toCsv([['Name', 'Amount', 'Date'], ...rows])
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'expenses.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const largest = stats?.largestExpense ?? null

  return (
    <div>
      <PageHeader
        title='Expenses'
        subtitle='Every expense across your budgets, in one place.'
        actions={
          <>
            <Button
              variant='outline'
              size='icon'
              onClick={() => router.back()}
              aria-label='Go back'
              title='Back'
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              onClick={exportCsv}
              disabled={filtered.length === 0}
            >
              <Download className='h-4 w-4' />
              CSV
            </Button>
          </>
        }
      />

      <div className='mt-6 grid grid-cols-12 gap-5'>
        {statsState === 'error' ? (
          <div className='col-span-12'>
            <DashboardErrorCard
              message="We couldn't load your expense summary. The list below is unaffected."
              onRetry={loadAll}
            />
          </div>
        ) : (
          <>
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Total spent'
              icon={ReceiptText}
              value={stats?.total ?? 0}
              badge={<InfoChip>{stats?.count ?? 0} expenses</InfoChip>}
              caption='All budgets and months'
              sparkline={monthly.spend}
              color='var(--chart-1)'
              loading={statsState === 'loading'}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Average expense'
              icon={Calculator}
              value={stats?.averagePerExpense ?? 0}
              changePct={percentChange(thisAverage, lastAverage)}
              caption={`Last month: ${formatCompactCurrency(lastAverage)}`}
              sparkline={monthly.average}
              color='var(--chart-2)'
              loading={statsState === 'loading'}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Largest expense'
              icon={TrendingUp}
              value={largest?.amount ?? 0}
              badge={
                largest ? (
                  <InfoChip title={largest.budgetName}>
                    {largest.budgetName}
                  </InfoChip>
                ) : (
                  <InfoChip>None yet</InfoChip>
                )
              }
              caption={largest?.name ?? 'No expenses recorded yet'}
              sparkline={monthly.largest}
              color='var(--chart-3)'
              loading={statsState === 'loading'}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='This month'
              icon={CalendarRange}
              value={monthTotals.thisSpend}
              changePct={percentChange(
                monthTotals.thisSpend,
                monthTotals.lastSpend
              )}
              caption={`Last month: ${formatCompactCurrency(
                monthTotals.lastSpend
              )} · ${monthTotals.lastCount} ${
                monthTotals.lastCount === 1 ? 'expense' : 'expenses'
              }`}
              sparkline={monthly.spend}
              color='var(--chart-4)'
              loading={statsState === 'loading'}
            />
          </>
        )}
      </div>

      <div
        className='mt-6 flex flex-wrap items-center gap-2'
        role='group'
        aria-label='Filter expenses'
      >
        {FILTERS.map((option) => {
          const active = filter === option.value
          return (
            <button
              key={option.value}
              type='button'
              onClick={() => setFilter(option.value)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {option.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                  active
                    ? 'bg-background/20 text-background'
                    : 'bg-accent text-muted-foreground'
                }`}
              >
                {counts[option.value]}
              </span>
            </button>
          )
        })}
      </div>

      <Card className='mt-5 border-border bg-card p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-base font-semibold text-foreground'>
            {filter === 'all' ? 'All expenses' : 'Filtered expenses'}
          </h2>
          <p className='text-sm text-muted-foreground'>
            {filtered.length.toLocaleString('en-US')} of{' '}
            {expensesList.length.toLocaleString('en-US')} expenses
          </p>
        </div>

        <ExpenseListTable
          expensesList={filtered}
          refreshData={loadAll}
          loading={loading}
          showTitle={false}
          showExport={false}
          budgetNames={budgetNames}
          emptyMessage={
            filter === 'all' ? undefined : 'No expenses match this filter.'
          }
        />
      </Card>
    </div>
  )
}

export default ExpenseList

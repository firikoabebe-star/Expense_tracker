'use client'

import * as React from 'react'
import { Calculator, Hash, ReceiptText, Target } from 'lucide-react'

import { roundMoney } from '/lib/analytics'
import { authClient } from '/lib/auth-client'
import { formatCompactCurrency } from '/lib/utils'
import type { ExpenseSummary } from '/types'

import { getAllExpenses } from '../actions'
import {
  getDashboardOverview,
  type DashboardOverview,
  type DashboardRange,
} from '../analytics-actions'
import { BudgetBreakdownCard } from '../_components/BudgetBreakdownCard'
import { DashboardErrorCard } from '../_components/DashboardErrorCard'
import { PageHeader } from '../_components/PageHeader'
import { StatCard } from '../_components/StatCard'
import { TopExpensesCard } from '../_components/TopExpensesCard'
import { BudgetVsSpentCard } from './_components/BudgetVsSpentCard'
import {
  SpendingTrendCard,
  type TrendPoint,
} from './_components/SpendingTrendCard'
import { summarizePreviousPeriod } from './_lib/previous-period'

type LoadState = 'loading' | 'ready' | 'error'

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 1000) / 10
}

function AnalyticsPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [range, setRange] = React.useState<DashboardRange>('30d')
  const [overview, setOverview] = React.useState<DashboardOverview | null>(null)
  const [expenses, setExpenses] = React.useState<ExpenseSummary[]>([])
  const [state, setState] = React.useState<LoadState>('loading')
  const request = React.useRef(0)

  const load = React.useCallback(async (nextRange: DashboardRange) => {
    const requestId = request.current + 1
    request.current = requestId
    setState('loading')

    try {
      const [result, expenseRows] = await Promise.all([
        getDashboardOverview(nextRange),
        getAllExpenses(),
      ])
      if (request.current !== requestId) return

      if (!result.ok) {
        setOverview(null)
        setExpenses([])
        setState('error')
        return
      }

      setOverview(result.data)
      setExpenses(expenseRows)
      setState('ready')
    } catch {
      if (request.current !== requestId) return
      setOverview(null)
      setExpenses([])
      setState('error')
    }
  }, [])

  React.useEffect(() => {
    if (!user) return
    load(range)
  }, [user, range, load])

  const previous = React.useMemo(
    () => summarizePreviousPeriod(range, expenses),
    [range, expenses]
  )

  const series = React.useMemo<TrendPoint[]>(
    () =>
      (overview?.series ?? []).map((point, index) => ({
        ...point,
        previous: previous.values[index] ?? 0,
      })),
    [overview, previous]
  )

  const totalSpent = overview?.totals.totalSpent.current ?? 0
  const expenseCount = overview?.totals.expenseCount.current ?? 0
  const budgetTotal = overview?.totals.totalBudget.current ?? 0
  const average = expenseCount > 0 ? roundMoney(totalSpent / expenseCount) : 0
  const usedPct =
    budgetTotal > 0 ? roundMoney((totalSpent / budgetTotal) * 100) : 0
  const previousUsedPct =
    budgetTotal > 0 ? roundMoney((previous.total / budgetTotal) * 100) : 0

  const averageSparkline = React.useMemo(() => {
    const spent = overview?.sparklines.spent ?? []
    const counts = overview?.sparklines.expenseCount ?? []
    return spent.map((value, index) =>
      counts[index] ? roundMoney(value / counts[index]) : 0
    )
  }, [overview])

  const usedSparkline = React.useMemo(() => {
    if (budgetTotal <= 0) return []
    return (overview?.sparklines.spent ?? []).map((value) =>
      roundMoney((value / budgetTotal) * 100)
    )
  }, [overview, budgetTotal])

  const loading = state === 'loading'

  return (
    <div>
      <PageHeader
        title='Analytics'
        subtitle='See where your money goes and how this period compares.'
      />

      {state === 'error' ? (
        <div className='mt-6'>
          <DashboardErrorCard
            message="We couldn't load your analytics. Your budgets and expenses are still available."
            onRetry={() => load(range)}
          />
        </div>
      ) : (
        <>
          <div className='mt-6 grid grid-cols-12 gap-5'>
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Total spent'
              icon={ReceiptText}
              value={totalSpent}
              changePct={overview?.totals.totalSpent.changePct ?? null}
              caption={`Across ${expenseCount.toLocaleString('en-US')} ${
                expenseCount === 1 ? 'expense' : 'expenses'
              }`}
              sparkline={overview?.sparklines.spent ?? []}
              color='var(--chart-1)'
              loading={loading}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Average expense'
              icon={Calculator}
              value={average}
              changePct={percentChange(average, previous.average)}
              caption={`Previous: ${formatCompactCurrency(previous.average)}`}
              sparkline={averageSparkline}
              color='var(--chart-2)'
              loading={loading}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Expense count'
              icon={Hash}
              value={expenseCount}
              format='count'
              changePct={overview?.totals.expenseCount.changePct ?? null}
              caption={`Previous period: ${previous.count.toLocaleString(
                'en-US'
              )}`}
              sparkline={overview?.sparklines.expenseCount ?? []}
              color='var(--chart-3)'
              loading={loading}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Budget used'
              icon={Target}
              value={usedPct}
              format='percent'
              changePct={percentChange(usedPct, previousUsedPct)}
              caption={`${formatCompactCurrency(
                totalSpent
              )} of ${formatCompactCurrency(budgetTotal)}`}
              sparkline={usedSparkline}
              color='var(--chart-4)'
              loading={loading}
            />
          </div>

          <div className='mt-5 grid grid-cols-12 gap-5'>
            <SpendingTrendCard
              className='col-span-12 lg:col-span-8'
              data={series}
              range={range}
              onRangeChange={setRange}
              loading={loading}
            />
            <BudgetBreakdownCard
              className='col-span-12 lg:col-span-4'
              title='Where your money goes'
              description='Share of this period’s spending per budget.'
              byBudget={overview?.byBudget ?? []}
              totalSpent={totalSpent}
              loading={loading}
            />
          </div>

          <div className='mt-5 grid grid-cols-12 gap-5'>
            <BudgetVsSpentCard
              className='col-span-12 lg:col-span-7'
              byBudget={overview?.byBudget ?? []}
              loading={loading}
            />
            <TopExpensesCard
              className='col-span-12 lg:col-span-5'
              expenses={overview?.topExpenses ?? []}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default AnalyticsPage

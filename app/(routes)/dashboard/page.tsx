"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown, PiggyBank, ReceiptText, Wallet } from 'lucide-react'

import { authClient } from '/lib/auth-client'
import { getFirstName } from '/lib/name'
import { parseExpenseDate } from '/lib/utils'
import { Card } from '/components/ui/card'
import type { ExpenseSummary } from '/types'

import AIInsights from './_components/AIInsights'
import { BudgetBreakdownCard } from './_components/BudgetBreakdownCard'
import { BudgetUsageCard } from './_components/BudgetUsageCard'
import { DashboardErrorCard } from './_components/DashboardErrorCard'
import ExpenseTableSkeleton from './_components/ExpenseTableSkeleton'
import { MonthlyTargetCard } from './_components/MonthlyTargetCard'
import { PageHeader } from './_components/PageHeader'
import { QuickLinksCard } from './_components/QuickLinksCard'
import { SpendingOverviewCard } from './_components/SpendingOverviewCard'
import { StatCard } from './_components/StatCard'
import { TopExpensesCard } from './_components/TopExpensesCard'
import ExpenseListTable from './expenses/_components/ExpenseListTable'
import { getAllExpenses } from './actions'
import {
  getDashboardOverview,
  type DashboardOverview,
  type DashboardRange,
} from './analytics-actions'

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '6m', label: 'Last 6 months' },
  { value: '12m', label: 'Last 12 months' },
]

type ExpenseFilter = 'all' | 'week' | 'month'

const EXPENSE_FILTERS: { value: ExpenseFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
]

type LoadState = 'loading' | 'ready' | 'error'

/** Mount fade-in that collapses to a plain wrapper when motion is reduced. */
function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function DashboardPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [range, setRange] = useState<DashboardRange>('30d')
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [overviewState, setOverviewState] = useState<LoadState>('loading')
  const [expenses, setExpenses] = useState<ExpenseSummary[]>([])
  const [expensesState, setExpensesState] = useState<LoadState>('loading')
  const [expenseFilter, setExpenseFilter] = useState<ExpenseFilter>('all')
  const overviewRequest = useRef(0)

  const loadOverview = useCallback(async (nextRange: DashboardRange) => {
    const requestId = overviewRequest.current + 1
    overviewRequest.current = requestId
    setOverviewState('loading')

    try {
      const result = await getDashboardOverview(nextRange)
      if (overviewRequest.current !== requestId) return

      if (!result.ok) {
        setOverview(null)
        setOverviewState('error')
        return
      }

      setOverview(result.data)
      setOverviewState('ready')
    } catch {
      if (overviewRequest.current !== requestId) return
      setOverview(null)
      setOverviewState('error')
    }
  }, [])

  const loadExpenses = useCallback(async () => {
    setExpensesState('loading')
    try {
      const rows = await getAllExpenses()
      setExpenses(rows)
      setExpensesState('ready')
    } catch {
      setExpensesState('error')
    }
  }, [])

  useEffect(() => {
    if (!user) return
    loadOverview(range)
  }, [user, range, loadOverview])

  useEffect(() => {
    if (!user) return
    loadExpenses()
  }, [user, loadExpenses])

  const refreshAll = useCallback(async () => {
    await Promise.all([loadOverview(range), loadExpenses()])
  }, [loadOverview, loadExpenses, range])

  const filteredExpenses = useMemo(() => {
    if (expenseFilter === 'all') return expenses

    const now = new Date()
    const start =
      expenseFilter === 'week'
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
        : new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    )

    return expenses.filter((expense) => {
      const date = parseExpenseDate(expense.createdAt)
      if (!date) return false
      return date >= start && date <= end
    })
  }, [expenses, expenseFilter])

  const remainingSparkline = useMemo(() => {
    if (!overview) return []
    const { budget, spent } = overview.sparklines
    let spentSoFar = 0
    return budget.map((budgetTotal, index) => {
      spentSoFar += spent[index] ?? 0
      return Math.max(0, budgetTotal - spentSoFar)
    })
  }, [overview])

  const totals = overview?.totals
  const sparklines = overview?.sparklines
  const overviewLoading = overviewState === 'loading'
  const totalSpent = overview?.totals.totalSpent.current ?? 0

  return (
    <div>
      <PageHeader
        title={`Hi, ${getFirstName(user?.name)}✌️`}
        subtitle="Your money, simplified. See where this period is heading."
        actions={
          <div className='relative'>
            <label htmlFor='dashboard-range' className='sr-only'>
              Date range
            </label>
            <select
              id='dashboard-range'
              value={range}
              onChange={(event) =>
                setRange(event.target.value as DashboardRange)
              }
              className='h-10 w-full appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
              aria-hidden
            />
          </div>
        }
      />

      {overviewState === 'error' ? (
        <FadeIn className='mt-6'>
          <DashboardErrorCard
            message="We couldn't load your overview. Your expenses and AI insights are still available."
            onRetry={() => loadOverview(range)}
          />
        </FadeIn>
      ) : (
        <>
          <FadeIn className='mt-6 grid grid-cols-12 gap-5'>
            <StatCard
              className='col-span-12 md:col-span-4'
              label='Total budget'
              icon={PiggyBank}
              value={totals?.totalBudget.current ?? 0}
              changePct={totals?.totalBudget.changePct ?? null}
              sparkline={sparklines?.budget ?? []}
              color='var(--chart-1)'
              loading={overviewLoading}
            />
            <StatCard
              className='col-span-12 md:col-span-4'
              label='Total spent'
              icon={ReceiptText}
              value={totals?.totalSpent.current ?? 0}
              changePct={totals?.totalSpent.changePct ?? null}
              sparkline={sparklines?.spent ?? []}
              color='var(--chart-2)'
              loading={overviewLoading}
            />
            <StatCard
              className='col-span-12 md:col-span-4'
              label='Remaining'
              icon={Wallet}
              value={totals?.remaining.current ?? 0}
              changePct={totals?.remaining.changePct ?? null}
              sparkline={remainingSparkline}
              color='var(--chart-3)'
              loading={overviewLoading}
            />
          </FadeIn>

          <FadeIn className='mt-5 grid grid-cols-12 gap-5' delay={0.05}>
            <SpendingOverviewCard
              className='col-span-12 lg:col-span-8'
              series={overview?.series ?? []}
              loading={overviewLoading}
            />
            <MonthlyTargetCard
              className='col-span-12 lg:col-span-4'
              target={overview?.monthTarget ?? null}
              loading={overviewLoading}
            />
          </FadeIn>

          <FadeIn className='mt-5 grid grid-cols-12 gap-5' delay={0.1}>
            <BudgetBreakdownCard
              className='col-span-12 md:col-span-6 lg:col-span-4'
              byBudget={overview?.byBudget ?? []}
              totalSpent={totalSpent}
              loading={overviewLoading}
            />
            <BudgetUsageCard
              className='col-span-12 md:col-span-6 lg:col-span-4'
              byBudget={overview?.byBudget ?? []}
              loading={overviewLoading}
            />
            <TopExpensesCard
              className='col-span-12 md:col-span-6 lg:col-span-4'
              expenses={overview?.topExpenses ?? []}
              loading={overviewLoading}
            />
          </FadeIn>
        </>
      )}

      <FadeIn className='mt-5 grid grid-cols-12 gap-5' delay={0.15}>
        <div className='col-span-12 lg:col-span-8'>
          <AIInsights enabled={!!user && overviewState !== 'loading'} />
        </div>
        <QuickLinksCard className='col-span-12 lg:col-span-4' />
      </FadeIn>

      <FadeIn className='mt-5' delay={0.2}>
        <Card className='border-border bg-card p-5 shadow-sm'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='min-w-0'>
              <h2 className='text-base font-semibold text-foreground'>
                Recent expenses
              </h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Search, filter and clean up your latest entries.
              </p>
            </div>

            <div
              className='inline-flex w-fit shrink-0 items-center rounded-full border border-border bg-background p-1'
              role='group'
              aria-label='Filter expenses by date'
            >
              {EXPENSE_FILTERS.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => setExpenseFilter(option.value)}
                  aria-pressed={expenseFilter === option.value}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    expenseFilter === option.value
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-3'>
            {expensesState === 'loading' ? (
              <div className='overflow-x-auto'>
                <div className='min-w-[520px] sm:min-w-0'>
                  <ExpenseTableSkeleton />
                </div>
              </div>
            ) : expensesState === 'error' ? (
              <DashboardErrorCard
                message="We couldn't load your expenses. The rest of the dashboard is unaffected."
                onRetry={loadExpenses}
              />
            ) : (
              <div className='overflow-x-auto'>
                <div className='min-w-[520px] sm:min-w-0'>
                  <ExpenseListTable
                    expensesList={filteredExpenses}
                    refreshData={refreshAll}
                    showTitle={false}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}

export default DashboardPage

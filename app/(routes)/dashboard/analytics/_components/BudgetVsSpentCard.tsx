'use client'

import * as React from 'react'
import Link from 'next/link'
import { PiggyBank } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '/components/ui/chart'
import { cn, formatCompactCurrency, formatCurrency } from '/lib/utils'
import type { BudgetBreakdown } from '../../analytics-actions'

const chartConfig = {
  budget: { label: 'Budget', color: 'var(--chart-2)' },
  spent: { label: 'Spent', color: 'var(--chart-1)' },
} satisfies ChartConfig

const MAX_BARS = 8

interface BudgetBar {
  name: string
  budget: number
  spent: number
}

function shorten(name: string, max = 16): string {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name
}

function BudgetTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const row = payload[0]?.payload as BudgetBar | undefined
  if (!row) return null

  const pct = row.budget > 0 ? Math.round((row.spent / row.budget) * 100) : 0

  return (
    <div className='min-w-[10rem] rounded-xl border border-border bg-[var(--block-charcoal)] px-3 py-2 text-[var(--clr-text-on-dark)] shadow-lg animate-in fade-in-0 duration-150'>
      <p className='truncate text-[11px] uppercase tracking-wide text-on-inverse-muted'>
        {row.name}
      </p>
      <div className='mt-1.5 space-y-1 text-xs tabular-nums'>
        <div className='flex items-center justify-between gap-3'>
          <span className='text-on-inverse-muted'>Budget</span>
          <span className='font-mono'>{formatCurrency(row.budget)}</span>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <span className='text-on-inverse-muted'>Spent</span>
          <span className='font-mono'>{formatCurrency(row.spent)}</span>
        </div>
      </div>
      <p className='mt-1.5 text-[11px] text-on-inverse-muted tabular-nums'>
        {pct}% of budget used
      </p>
    </div>
  )
}

interface BudgetVsSpentCardProps {
  byBudget: BudgetBreakdown[]
  loading?: boolean
  className?: string
}

/** Grouped bars comparing each budget limit with what was actually spent. */
export function BudgetVsSpentCard({
  byBudget,
  loading = false,
  className,
}: BudgetVsSpentCardProps) {
  const rows = React.useMemo<BudgetBar[]>(
    () =>
      [...byBudget]
        .filter((budget) => budget.amount > 0 || budget.spent > 0)
        .sort((a, b) => b.amount - a.amount || b.spent - a.spent)
        .slice(0, MAX_BARS)
        .map((budget) => ({
          name: budget.name,
          budget: budget.amount,
          spent: budget.spent,
        })),
    [byBudget]
  )

  const truncated = rows.length > 0 && byBudget.length > rows.length
  const hasActivity = rows.some((row) => row.budget > 0 || row.spent > 0)
  const chartHeight = Math.max(240, rows.length * 52 + 32)

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='space-y-1 p-5'>
        <CardTitle className='text-base font-semibold'>Budget vs spent</CardTitle>
        <CardDescription>
          {truncated
            ? `Your ${MAX_BARS} largest budgets, limit against spending.`
            : 'Each limit next to what was actually spent.'}
        </CardDescription>
      </CardHeader>

      <CardContent className='p-5 pt-0'>
        {loading ? (
          <div
            role='status'
            aria-label='Loading budget comparison'
            className='space-y-3'
          >
            <div className='h-4 w-36 animate-pulse rounded bg-accent' />
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className='h-8 w-full animate-pulse rounded-lg bg-accent'
              />
            ))}
          </div>
        ) : !hasActivity ? (
          <div className='flex h-[240px] flex-col items-center justify-center gap-2 text-center'>
            <PiggyBank className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>No budgets yet</p>
            <p className='max-w-[15rem] text-xs text-muted-foreground'>
              Create a budget with a limit to compare it with your spending.
            </p>
            <Link
              href='/dashboard/budgets'
              className='mt-1 text-xs font-medium text-primary underline underline-offset-4 hover:opacity-80'
            >
              Create a budget
            </Link>
          </div>
        ) : (
          <>
            <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
              <span className='inline-flex items-center gap-1.5'>
                <span
                  aria-hidden
                  className='h-2.5 w-2.5 rounded-sm bg-[var(--chart-2)]'
                />
                Budget
              </span>
              <span className='inline-flex items-center gap-1.5'>
                <span
                  aria-hidden
                  className='h-2.5 w-2.5 rounded-sm bg-[var(--chart-1)]'
                />
                Spent
              </span>
            </div>

            <ChartContainer
              config={chartConfig}
              className='mt-3 aspect-auto w-full'
              style={{ height: chartHeight }}
            >
              <BarChart
                data={rows}
                layout='vertical'
                margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
                barGap={4}
                barCategoryGap='24%'
              >
                <CartesianGrid
                  horizontal={false}
                  stroke='var(--border)'
                  strokeDasharray='2 6'
                  strokeLinecap='round'
                />
                <XAxis
                  type='number'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value: number) =>
                    formatCompactCurrency(value)
                  }
                />
                <YAxis
                  type='category'
                  dataKey='name'
                  width={104}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value: string) => shorten(value)}
                />
                <ChartTooltip
                  cursor={{ fill: 'var(--accent)', radius: 6 }}
                  content={<BudgetTooltip />}
                />
                <Bar
                  dataKey='budget'
                  fill='var(--chart-2)'
                  radius={[0, 6, 6, 0]}
                  maxBarSize={14}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey='spent'
                  fill='var(--chart-1)'
                  radius={[0, 6, 6, 0]}
                  maxBarSize={14}
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

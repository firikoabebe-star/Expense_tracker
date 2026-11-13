'use client'

import { Inbox } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '/components/ui/chart'
import { cn, formatCompactCurrency, formatCurrency } from '/lib/utils'
import type { MonthlyReportMonth } from '../../analytics-actions'

const chartConfig = {
  total: { label: 'Spent', color: 'var(--chart-1)' },
} satisfies ChartConfig

function MonthTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const month = payload[0]?.payload as MonthlyReportMonth | undefined
  if (!month) return null

  return (
    <div className='min-w-[9rem] rounded-xl border border-border bg-[var(--block-charcoal)] px-3 py-2 text-[var(--clr-text-on-dark)] shadow-lg animate-in fade-in-0 duration-150'>
      <p className='text-[11px] uppercase tracking-wide text-on-inverse-muted'>
        {month.label}
      </p>
      <p className='mt-1 font-mono text-sm font-medium tabular-nums'>
        {formatCurrency(month.total)}
      </p>
      <p className='mt-0.5 text-[11px] text-on-inverse-muted'>
        {month.count} {month.count === 1 ? 'expense' : 'expenses'}
      </p>
    </div>
  )
}

interface MonthlyTotalsChartProps {
  months: MonthlyReportMonth[]
  year: number
  loading?: boolean
  className?: string
}

/** Monthly spend for one year as a single-series bar chart. */
export function MonthlyTotalsChart({
  months,
  year,
  loading = false,
  className,
}: MonthlyTotalsChartProps) {
  const hasSpending = months.some((month) => month.total > 0)

  if (loading) {
    return (
      <div
        role='status'
        aria-label='Loading monthly totals'
        className={cn('h-[280px] w-full animate-pulse rounded-2xl bg-accent', className)}
      />
    )
  }

  if (!hasSpending) {
    return (
      <div
        className={cn(
          'flex h-[280px] flex-col items-center justify-center gap-2 text-center',
          className
        )}
      >
        <Inbox className='h-8 w-8 text-muted-foreground' aria-hidden />
        <p className='text-sm font-medium text-foreground'>
          No spending recorded in {year}
        </p>
        <p className='max-w-[16rem] text-xs text-muted-foreground'>
          Pick another year or add an expense to see the monthly totals.
        </p>
      </div>
    )
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('aspect-auto h-[280px] w-full', className)}
    >
      <BarChart data={months} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid
          vertical={false}
          stroke='var(--border)'
          strokeDasharray='2 6'
          strokeLinecap='round'
        />
        <XAxis
          dataKey='label'
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          width={68}
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          tick={{ fontSize: 11 }}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
        />
        <ChartTooltip
          cursor={{ fill: 'var(--accent)', radius: 6 }}
          content={<MonthTooltip />}
        />
        <Bar
          dataKey='total'
          fill='var(--chart-1)'
          radius={[6, 6, 0, 0]}
          maxBarSize={36}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  )
}

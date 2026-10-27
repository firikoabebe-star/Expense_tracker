"use client"

import * as React from 'react'
import { Inbox } from 'lucide-react'
import {
  Area,
  AreaChart,
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
import type { SpendingPoint } from '../analytics-actions'

const chartConfig = {
  value: { label: 'Daily spend', color: 'var(--chart-1)' },
  cumulative: { label: 'Cumulative spend', color: 'var(--chart-1)' },
} satisfies ChartConfig

type Mode = 'daily' | 'cumulative'

interface OverviewTooltipProps extends TooltipProps<number, string> {
  mode: Mode
}

/** Rich dark hover card for the spending area chart. */
function OverviewTooltip({ active, payload, mode }: OverviewTooltipProps) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload as SpendingPoint | undefined
  if (!point) return null

  const value = mode === 'cumulative' ? point.cumulative : point.value

  return (
    <div className='min-w-[9.5rem] rounded-xl border border-border bg-[var(--block-charcoal)] px-3 py-2 text-[var(--clr-text-on-dark)] shadow-lg animate-in fade-in-0 duration-150'>
      <p className='text-[11px] uppercase tracking-wide text-on-inverse-muted'>
        {point.label}
      </p>
      <p className='mt-1 font-mono text-sm font-medium tabular-nums'>
        {formatCurrency(value)}
      </p>
      <p className='mt-0.5 text-[11px] text-on-inverse-muted'>
        {mode === 'cumulative' ? 'Cumulative spend' : 'Daily spend'}
      </p>
    </div>
  )
}

interface SpendingOverviewCardProps {
  series: SpendingPoint[]
  loading?: boolean
  className?: string
}

/** Smooth area chart with a gradient fill and a daily/cumulative toggle. */
export function SpendingOverviewCard({
  series,
  loading = false,
  className,
}: SpendingOverviewCardProps) {
  const [mode, setMode] = React.useState<Mode>('daily')
  const gradientId = `overview-${React.useId().replace(/:/g, '')}`
  const hasSpending = series.some(
    (point) => point.value > 0 || point.cumulative > 0
  )

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='flex flex-col gap-3 space-y-0 p-5 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <CardTitle className='text-base font-semibold'>
            Spending overview
          </CardTitle>
          <CardDescription>
            How your spending moved across the selected period.
          </CardDescription>
        </div>

        <div
          className='inline-flex shrink-0 items-center rounded-full border border-border bg-background p-1'
          role='group'
          aria-label='Spending chart mode'
        >
          {(['daily', 'cumulative'] as const).map((option) => (
            <button
              key={option}
              type='button'
              onClick={() => setMode(option)}
              aria-pressed={mode === option}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                mode === option
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className='p-5 pt-0'>
        {loading ? (
          <div
            role='status'
            aria-label='Loading spending overview'
            className='h-[280px] w-full animate-pulse rounded-2xl bg-accent'
          />
        ) : !hasSpending ? (
          <div className='flex h-[280px] flex-col items-center justify-center gap-2 text-center'>
            <Inbox className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>
              No spending in this period
            </p>
            <p className='max-w-[16rem] text-xs text-muted-foreground'>
              Add an expense or try a longer date range to see the trend.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[280px] w-full'
          >
            <AreaChart
              data={series}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='0%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.32}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
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
                minTickGap={24}
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
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                content={<OverviewTooltip mode={mode} />}
              />
              <Area
                type='monotone'
                dataKey={mode === 'cumulative' ? 'cumulative' : 'value'}
                stroke='var(--chart-1)'
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--background)' }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

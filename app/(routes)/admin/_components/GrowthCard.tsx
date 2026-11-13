'use client'

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

import { formatSeriesKey, formatSeriesKeyLong } from './format'

const chartConfig = {
  value: { label: 'Growth', color: 'var(--chart-1)' },
} satisfies ChartConfig

type GrowthMode = 'signups' | 'expenses'

interface GrowthPoint {
  key: string
  label: string
  value: number
}

interface GrowthTooltipProps extends TooltipProps<number, string> {
  mode: GrowthMode
}

/** Floating dark hover card for the growth area chart. */
function GrowthTooltip({ active, payload, mode }: GrowthTooltipProps) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload as GrowthPoint | undefined
  if (!point) return null

  return (
    <div className='min-w-[9.5rem] rounded-xl border border-border bg-[var(--block-charcoal)] px-3 py-2 text-[var(--clr-text-on-dark)] shadow-lg animate-in fade-in-0 duration-150'>
      <p className='text-[11px] uppercase tracking-wide text-on-inverse-muted'>
        {formatSeriesKeyLong(point.key)}
      </p>
      <p className='mt-1 font-mono text-sm font-medium tabular-nums'>
        {mode === 'expenses'
          ? formatCurrency(point.value)
          : `${point.value.toLocaleString('en-US')} ${
              point.value === 1 ? 'signup' : 'signups'
            }`}
      </p>
      <p className='mt-0.5 text-[11px] text-on-inverse-muted'>
        {mode === 'expenses' ? 'Expense volume' : 'New accounts'}
      </p>
    </div>
  )
}

interface GrowthCardProps {
  signupsSeries: { key: string; count: number }[]
  expensesTotalSeries: { key: string; total: number }[]
  loading?: boolean
  className?: string
}

/** Signups and expense volume for the selected range, one at a time. */
export function GrowthCard({
  signupsSeries,
  expensesTotalSeries,
  loading = false,
  className,
}: GrowthCardProps) {
  const [mode, setMode] = React.useState<GrowthMode>('signups')
  const gradientId = `growth-${React.useId().replace(/:/g, '')}`

  const series = React.useMemo<GrowthPoint[]>(() => {
    if (mode === 'signups') {
      return signupsSeries.map((point) => ({
        key: point.key,
        label: formatSeriesKey(point.key),
        value: point.count,
      }))
    }
    return expensesTotalSeries.map((point) => ({
      key: point.key,
      label: formatSeriesKey(point.key),
      value: point.total,
    }))
  }, [mode, signupsSeries, expensesTotalSeries])

  const stroke = mode === 'signups' ? 'var(--chart-1)' : 'var(--chart-3)'
  const hasActivity = series.some((point) => point.value > 0)

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='flex flex-col gap-3 space-y-0 p-5 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <CardTitle className='text-base font-semibold'>Growth</CardTitle>
          <CardDescription>
            {mode === 'signups'
              ? 'New accounts per period.'
              : 'Total expense volume per period.'}
          </CardDescription>
        </div>

        <div
          className='inline-flex shrink-0 items-center rounded-full border border-border bg-background p-1'
          role='group'
          aria-label='Growth chart metric'
        >
          {(
            [
              { value: 'signups', label: 'Signups' },
              { value: 'expenses', label: 'Expenses' },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type='button'
              onClick={() => setMode(option.value)}
              aria-pressed={mode === option.value}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                mode === option.value
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className='p-5 pt-0'>
        {loading ? (
          <div
            role='status'
            aria-label='Loading growth chart'
            className='h-[280px] w-full animate-pulse rounded-2xl bg-accent'
          />
        ) : series.length === 0 || !hasActivity ? (
          <div className='flex h-[280px] flex-col items-center justify-center gap-2 text-center'>
            <Inbox className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>
              No {mode === 'signups' ? 'signups' : 'expenses'} yet
            </p>
            <p className='max-w-[17rem] text-xs text-muted-foreground'>
              {mode === 'signups'
                ? 'New accounts in this range will appear here.'
                : 'Expenses logged in this range will appear here.'}
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
                  <stop offset='0%' stopColor={stroke} stopOpacity={0.3} />
                  <stop offset='100%' stopColor={stroke} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke='var(--border)' />
              <XAxis
                dataKey='label'
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={24}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                width={70}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                allowDecimals={mode === 'expenses'}
                tick={{ fontSize: 11 }}
                tickFormatter={(value: number) =>
                  mode === 'expenses'
                    ? formatCompactCurrency(value)
                    : value.toLocaleString('en-US')
                }
              />
              <ChartTooltip
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                content={<GrowthTooltip mode={mode} />}
              />
              <Area
                type='monotone'
                dataKey='value'
                stroke={stroke}
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

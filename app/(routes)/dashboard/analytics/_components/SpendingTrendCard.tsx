'use client'

import * as React from 'react'
import { ChevronDown, Inbox } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
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
import type { DashboardRange, SpendingPoint } from '../../analytics-actions'

const chartConfig = {
  value: { label: 'This period', color: 'var(--chart-1)' },
  previous: { label: 'Previous period', color: 'var(--chart-2)' },
} satisfies ChartConfig

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '6m', label: '6 months' },
  { value: '12m', label: '12 months' },
]

/** A current bucket plus the matching bucket from the previous period. */
export interface TrendPoint extends SpendingPoint {
  previous: number
}

function TrendTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload as TrendPoint | undefined
  if (!point) return null

  const changePct =
    point.previous > 0
      ? Math.round(((point.value - point.previous) / point.previous) * 1000) /
        10
      : null

  return (
    <div className='min-w-[10.5rem] rounded-xl border border-border bg-[var(--block-charcoal)] px-3 py-2 text-[var(--clr-text-on-dark)] shadow-lg animate-in fade-in-0 duration-150'>
      <p className='text-[11px] uppercase tracking-wide text-on-inverse-muted'>
        {point.label}
      </p>
      <p className='mt-1 font-mono text-sm font-medium tabular-nums'>
        {formatCurrency(point.value)}
      </p>
      <p className='mt-0.5 text-[11px] text-on-inverse-muted'>This period</p>

      <div className='mt-2 flex items-center justify-between gap-3 border-t border-on-inverse pt-2 text-[11px] text-on-inverse-muted'>
        <span>Previous</span>
        <span className='font-mono tabular-nums'>
          {formatCurrency(point.previous)}
        </span>
      </div>

      {changePct !== null ? (
        <p
          className={cn(
            'mt-1 text-[11px] tabular-nums',
            changePct > 0
              ? 'text-warning'
              : changePct < 0
                ? 'text-success'
                : 'text-on-inverse-muted'
          )}
        >
          {`${changePct > 0 ? '+' : ''}${changePct}% vs previous`}
        </p>
      ) : null}
    </div>
  )
}

function Legend() {
  return (
    <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
      <span className='inline-flex items-center gap-1.5'>
        <span
          aria-hidden
          className='h-2.5 w-2.5 rounded-full bg-[var(--chart-1)]'
        />
        This period
      </span>
      <span className='inline-flex items-center gap-1.5'>
        <span
          aria-hidden
          className='h-0 w-4 border-t-2 border-dashed border-[var(--chart-2)]'
        />
        Previous period
      </span>
    </div>
  )
}

interface SpendingTrendCardProps {
  data: TrendPoint[]
  range: DashboardRange
  onRangeChange: (range: DashboardRange) => void
  loading?: boolean
  className?: string
}

/**
 * Large area chart with the previous period overlaid as a dashed line and a
 * hover crosshair (vertical marker + horizontal value guide).
 */
export function SpendingTrendCard({
  data,
  range,
  onRangeChange,
  loading = false,
  className,
}: SpendingTrendCardProps) {
  const gradientId = `trend-${React.useId().replace(/:/g, '')}`
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const hoverPoint =
    hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null
  const hasSpending = data.some(
    (point) => point.value > 0 || point.previous > 0
  )

  const handleMouseMove = (state: unknown) => {
    const index = (state as { activeTooltipIndex?: number | null } | null)
      ?.activeTooltipIndex
    setHoverIndex(typeof index === 'number' ? index : null)
  }

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='flex flex-col gap-3 space-y-0 p-5 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <CardTitle className='text-base font-semibold'>Spending trend</CardTitle>
          <CardDescription>
            Totals for each bucket, compared with the period before it.
          </CardDescription>
        </div>

        <div className='relative shrink-0'>
          <label htmlFor='analytics-range' className='sr-only'>
            Spending trend range
          </label>
          <select
            id='analytics-range'
            value={range}
            onChange={(event) =>
              onRangeChange(event.target.value as DashboardRange)
            }
            className='h-9 w-full appearance-none rounded-full border border-border bg-background pl-3.5 pr-8 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className='pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground'
            aria-hidden
          />
        </div>
      </CardHeader>

      <CardContent className='p-5 pt-0'>
        {loading ? (
          <div
            role='status'
            aria-label='Loading spending trend'
            className='space-y-4'
          >
            <div className='h-4 w-40 animate-pulse rounded bg-accent' />
            <div className='h-[280px] w-full animate-pulse rounded-2xl bg-accent sm:h-[320px]' />
          </div>
        ) : !hasSpending ? (
          <div className='flex h-[280px] flex-col items-center justify-center gap-2 text-center sm:h-[320px]'>
            <Inbox className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>
              No spending in this period
            </p>
            <p className='max-w-[17rem] text-xs text-muted-foreground'>
              Add an expense or choose a longer range to see how this period
              compares with the one before.
            </p>
          </div>
        ) : (
          <>
            <Legend />
            <ChartContainer
              config={chartConfig}
              className='mt-3 aspect-auto h-[280px] w-full sm:h-[320px]'
            >
              <AreaChart
                data={data}
                margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIndex(null)}
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
                      stopOpacity={0.3}
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
                  tickFormatter={(value: number) =>
                    formatCompactCurrency(value)
                  }
                />
                <ChartTooltip cursor={false} content={<TrendTooltip />} />

                {/* Recharts only renders chart children one level deep, so the
                    crosshair guides are siblings rather than a fragment. */}
                {hoverPoint ? (
                  <ReferenceLine
                    x={hoverPoint.label}
                    stroke='var(--muted-foreground)'
                    strokeDasharray='3 3'
                    strokeOpacity={0.7}
                  />
                ) : null}
                {hoverPoint ? (
                  <ReferenceLine
                    y={hoverPoint.value}
                    stroke='var(--muted-foreground)'
                    strokeDasharray='3 3'
                    strokeOpacity={0.7}
                    ifOverflow='hidden'
                  />
                ) : null}

                <Area
                  type='monotone'
                  dataKey='previous'
                  stroke='var(--chart-2)'
                  strokeWidth={2}
                  strokeDasharray='5 4'
                  fill='transparent'
                  fillOpacity={0}
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='var(--chart-1)'
                  strokeWidth={2.5}
                  fill={`url(#${gradientId})`}
                  activeDot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: 'var(--background)',
                  }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

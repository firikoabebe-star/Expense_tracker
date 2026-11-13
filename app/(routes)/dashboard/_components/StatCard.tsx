"use client"

import * as React from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  type LucideIcon,
} from 'lucide-react'
import { Area, AreaChart, YAxis } from 'recharts'

import { Card } from '/components/ui/card'
import { ChartContainer } from '/components/ui/chart'
import { cn, formatCompactCurrency, formatCurrency } from '/lib/utils'

interface SparklineProps {
  values: number[]
  color: string
}

function Sparkline({ values, color }: SparklineProps) {
  const gradientId = React.useId().replace(/:/g, '')
  const data = values.map((value, index) => ({ index, value }))
  const hasActivity = values.length > 1 && values.some((value) => value !== 0)

  if (!hasActivity) {
    return (
      <div className='flex h-10 items-center text-[11px] text-muted-foreground'>
        No activity yet
      </div>
    )
  }

  return (
    <ChartContainer
      config={{ value: { label: 'Trend', color } }}
      className='aspect-auto h-10 w-full'
    >
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient
            id={`spark-${gradientId}`}
            x1='0'
            y1='0'
            x2='0'
            y2='1'
          >
            <stop offset='0%' stopColor={color} stopOpacity={0.35} />
            <stop offset='100%' stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Area
          type='monotone'
          dataKey='value'
          stroke={color}
          strokeWidth={1.75}
          fill={`url(#spark-${gradientId})`}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function TrendBadge({ changePct }: { changePct: number | null }) {
  if (changePct === null) {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-medium text-muted-foreground'>
        No prior data
      </span>
    )
  }

  const rounded = Math.round(changePct * 10) / 10
  const flat = rounded === 0
  const positive = rounded > 0
  const Icon = flat ? Minus : positive ? ArrowUpRight : ArrowDownRight

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-medium tabular-nums',
        flat
          ? 'text-muted-foreground'
          : positive
            ? 'text-success'
            : 'text-destructive'
      )}
      title={`${rounded}% vs previous period`}
    >
      <Icon className='h-3 w-3' aria-hidden />
      {`${positive ? '+' : ''}${rounded}%`}
      <span className='sr-only'> versus previous period</span>
    </span>
  )
}

/** How a stat's number is rendered: money, a percentage or a plain count. */
export type StatValueFormat = 'currency' | 'percent' | 'count'

function formatValue(value: number, format: StatValueFormat): string {
  if (format === 'percent') return `${Math.round(value * 10) / 10}%`
  if (format === 'count') return value.toLocaleString('en-US')
  return formatCompactCurrency(value)
}

function formatValueTitle(value: number, format: StatValueFormat): string {
  if (format === 'percent') return `${Math.round(value * 10) / 10}%`
  if (format === 'count') return `${value.toLocaleString('en-US')} expenses`
  return formatCurrency(value)
}

interface StatCardProps {
  label: string
  icon: LucideIcon
  value: number
  changePct?: number | null
  /** Replaces the trend badge (e.g. a count or the largest expense's budget). */
  badge?: React.ReactNode
  /** Omit for cards where a trend line adds no information. */
  sparkline?: number[]
  color: string
  format?: StatValueFormat
  /** Optional supporting line under the value (e.g. the comparison amount). */
  caption?: React.ReactNode
  loading?: boolean
  className?: string
}

/** Total / spent / remaining summary card with trend and sparkline. */
export function StatCard({
  label,
  icon: Icon,
  value,
  changePct = null,
  badge,
  sparkline,
  color,
  format = 'currency',
  caption,
  loading = false,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('border-border bg-card p-5 shadow-sm', className)}>
        <div role='status' aria-label={`Loading ${label}`}>
          <div className='flex items-start justify-between gap-3'>
            <div className='h-10 w-10 animate-pulse rounded-xl bg-accent' />
            <div className='h-6 w-16 animate-pulse rounded-full bg-accent' />
          </div>
          <div className='mt-4 h-7 w-28 animate-pulse rounded-md bg-accent' />
          <div className='mt-3 h-10 w-full animate-pulse rounded-lg bg-accent' />
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-2.5'>
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary'>
            <Icon className='h-5 w-5' aria-hidden />
          </span>
          <p className='truncate text-sm text-muted-foreground'>{label}</p>
        </div>
        {badge ?? <TrendBadge changePct={changePct} />}
      </div>

      <p
        className='mt-4 truncate text-2xl font-bold tracking-tight text-foreground'
        title={formatValueTitle(value, format)}
      >
        {formatValue(value, format)}
      </p>

      {caption ? (
        <p className='mt-1 truncate text-xs text-muted-foreground'>{caption}</p>
      ) : null}

      {sparkline && sparkline.length > 1 ? (
        <div className='mt-3'>
          <Sparkline values={sparkline} color={color} />
        </div>
      ) : null}
    </Card>
  )
}

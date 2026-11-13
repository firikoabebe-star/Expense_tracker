"use client"

import Link from 'next/link'
import { PiggyBank } from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'

import { Card } from '/components/ui/card'
import { ChartContainer } from '/components/ui/chart'
import { cn, formatCompactCurrency, formatCurrency } from '/lib/utils'
import {
  USAGE_CHART_FILL,
  USAGE_LABEL,
  USAGE_TONE,
  usageLevel,
} from './usage-levels'
import type { MonthTarget } from '../analytics-actions'

interface MonthlyTargetCardProps {
  target: MonthTarget | null
  loading?: boolean
  className?: string
}

/**
 * Always-dark monthly target card. It uses the charcoal block token rather
 * than an inverted theme surface so the card stays dark in both themes.
 */
export function MonthlyTargetCard({
  target,
  loading,
  className,
}: MonthlyTargetCardProps) {
  const pct = target ? Math.round(target.pct * 10) / 10 : 0
  const level = usageLevel(pct)
  const hasBudget = !!target && target.budget > 0
  const gaugePct = Math.min(100, Math.max(0, pct))

  const slices = [
    {
      name: 'Spent',
      value: gaugePct,
      fill: USAGE_CHART_FILL[level],
      opacity: 1,
    },
    {
      name: 'Remaining',
      value: 100 - gaugePct,
      fill: 'var(--clr-text-on-dark)',
      opacity: 0.14,
    },
  ]

  return (
    <Card
      className={cn(
        'border-on-inverse bg-[var(--block-charcoal)] text-[var(--clr-text-on-dark)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div className='p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h2 className='text-base font-semibold text-[var(--clr-text-on-dark)]'>
              Monthly target
            </h2>
            <p className='mt-1 text-xs text-on-inverse-muted'>
              This month against your total budget
            </p>
          </div>
          <PiggyBank className='h-4 w-4 shrink-0 text-on-inverse-muted' aria-hidden />
        </div>

        {loading ? (
          <div role='status' aria-label='Loading monthly target'>
            <div className='mx-auto mt-6 h-40 w-40 animate-pulse rounded-full bg-[var(--clr-text-on-dark)] opacity-10' />
            <div className='mt-6 h-4 w-full animate-pulse rounded bg-[var(--clr-text-on-dark)] opacity-10' />
            <div className='mt-2 h-4 w-2/3 animate-pulse rounded bg-[var(--clr-text-on-dark)] opacity-10' />
          </div>
        ) : !hasBudget ? (
          <div className='flex flex-col items-center justify-center gap-2 py-10 text-center'>
            <PiggyBank className='h-7 w-7 text-on-inverse-muted' aria-hidden />
            <p className='text-sm font-medium'>No monthly target yet</p>
            <p className='max-w-[15rem] text-xs text-on-inverse-muted'>
              Create a budget to track this month against a limit.
            </p>
            <Link
              href='/dashboard/budgets'
              className='mt-1 text-xs font-medium underline underline-offset-4 text-on-inverse-accent hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clr-text-on-dark)]'
            >
              Create a budget
            </Link>
          </div>
        ) : (
          <>
            <div className='relative mx-auto mt-4 h-40 w-40'>
              <ChartContainer config={{}} className='aspect-auto h-full w-full'>
                <PieChart>
                  <Pie
                    data={slices}
                    dataKey='value'
                    startAngle={90}
                    endAngle={-270}
                    innerRadius='78%'
                    outerRadius='100%'
                    strokeWidth={0}
                    cornerRadius={999}
                    isAnimationActive={false}
                  >
                    {slices.map((slice) => (
                      <Cell
                        key={slice.name}
                        fill={slice.fill}
                        fillOpacity={slice.opacity}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
                <span className='text-2xl font-bold tabular-nums'>
                  {pct}%
                </span>
                <span className='text-[11px] text-on-inverse-muted'>
                  of budget
                </span>
              </div>
            </div>

            <div className='mt-6 space-y-2 text-sm'>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-on-inverse-muted'>Spent</span>
                <span
                  className='font-medium tabular-nums'
                  title={formatCurrency(target.spent)}
                >
                  {formatCompactCurrency(target.spent)}
                </span>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-on-inverse-muted'>Budget</span>
                <span
                  className='font-medium tabular-nums'
                  title={formatCurrency(target.budget)}
                >
                  {formatCompactCurrency(target.budget)}
                </span>
              </div>
            </div>

            <div className='mt-4 flex items-center gap-2 border-t border-on-inverse pt-4 text-xs font-medium'>
              <span
                className={cn('h-2 w-2 rounded-full', USAGE_TONE[level])}
                aria-hidden
              />
              {USAGE_LABEL[level]}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

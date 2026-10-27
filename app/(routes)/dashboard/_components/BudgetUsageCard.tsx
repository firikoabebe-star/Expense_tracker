"use client"

import Link from 'next/link'
import { ArrowRight, PiggyBank } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '/components/ui/card'
import { cn, formatCompactCurrency, formatCurrency } from '/lib/utils'
import { USAGE_TONE, usageLevel } from './usage-levels'
import type { BudgetBreakdown } from '../analytics-actions'

interface BudgetUsageCardProps {
  byBudget: BudgetBreakdown[]
  loading?: boolean
  className?: string
}

/** Top five budgets by usage, coloured with the shared health thresholds. */
export function BudgetUsageCard({
  byBudget,
  loading = false,
  className,
}: BudgetUsageCardProps) {
  const rows = [...byBudget].sort((a, b) => b.pct - a.pct).slice(0, 5)

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='flex flex-row items-start justify-between gap-3 space-y-0 p-5'>
        <div className='min-w-0'>
          <CardTitle className='text-base font-semibold'>Budget usage</CardTitle>
          <CardDescription>Spent against each budget limit.</CardDescription>
        </div>
        <Link
          href='/dashboard/budgets'
          className='inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          View all
          <ArrowRight className='h-3 w-3' aria-hidden />
        </Link>
      </CardHeader>

      <CardContent className='p-5 pt-0'>
        {loading ? (
          <div
            role='status'
            aria-label='Loading budget usage'
            className='space-y-4'
          >
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='space-y-2'>
                <div className='h-4 w-full animate-pulse rounded bg-accent' />
                <div className='h-2 w-full animate-pulse rounded-full bg-accent' />
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className='flex h-[240px] flex-col items-center justify-center gap-2 text-center'>
            <PiggyBank className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>No budgets yet</p>
            <p className='max-w-[15rem] text-xs text-muted-foreground'>
              Create a budget to track spending against a limit.
            </p>
            <Link
              href='/dashboard/budgets'
              className='mt-1 text-xs font-medium text-primary underline underline-offset-4 hover:opacity-80'
            >
              Create a budget
            </Link>
          </div>
        ) : (
          <ul className='space-y-4'>
            {rows.map((budget) => {
              const pct = Math.max(0, budget.pct)
              const tone = USAGE_TONE[usageLevel(pct)]
              return (
                <li key={budget.id} className='min-w-0'>
                  <div className='flex items-baseline justify-between gap-2'>
                    <span
                      className='min-w-0 truncate text-sm font-medium text-foreground'
                      title={budget.name}
                    >
                      {budget.name}
                    </span>
                    <span
                      className='shrink-0 text-xs tabular-nums text-muted-foreground'
                      title={`${formatCurrency(budget.spent)} of ${formatCurrency(budget.amount)}`}
                    >
                      {formatCompactCurrency(budget.spent)} /{' '}
                      {formatCompactCurrency(budget.amount)}
                    </span>
                  </div>
                  <div className='mt-2 flex items-center gap-2'>
                    <div className='h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-accent'>
                      <div
                        className={cn('h-2 rounded-full', tone)}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <span className='w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground'>
                      {Math.round(pct)}%
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import Link from 'next/link'
import { ArrowRight, ReceiptText } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '/components/ui/card'
import { cn, formatCompactCurrency, formatCurrency } from '/lib/utils'
import type { TopExpense } from '../analytics-actions'

interface TopExpensesCardProps {
  expenses: TopExpense[]
  loading?: boolean
  className?: string
}

function initialOf(name: string): string {
  const first = Array.from(name.trim())[0]
  return first ? first.toLocaleUpperCase() : '•'
}

/** Largest expenses in the selected range. */
export function TopExpensesCard({
  expenses,
  loading = false,
  className,
}: TopExpensesCardProps) {
  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='flex flex-row items-start justify-between gap-3 space-y-0 p-5'>
        <div className='min-w-0'>
          <CardTitle className='text-base font-semibold'>Top expenses</CardTitle>
          <CardDescription>Your largest spends this period.</CardDescription>
        </div>
        <Link
          href='/dashboard/expenses'
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
            aria-label='Loading top expenses'
            className='space-y-3'
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className='flex items-center gap-3'>
                <div className='h-9 w-9 animate-pulse rounded-full bg-accent' />
                <div className='flex-1 space-y-1.5'>
                  <div className='h-3.5 w-2/3 animate-pulse rounded bg-accent' />
                  <div className='h-3 w-1/3 animate-pulse rounded bg-accent' />
                </div>
                <div className='h-3.5 w-16 animate-pulse rounded bg-accent' />
              </div>
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className='flex h-[240px] flex-col items-center justify-center gap-2 text-center'>
            <ReceiptText
              className='h-8 w-8 text-muted-foreground'
              aria-hidden
            />
            <p className='text-sm font-medium text-foreground'>
              No expenses yet
            </p>
            <p className='max-w-[15rem] text-xs text-muted-foreground'>
              Add an expense inside a budget to see your biggest spends here.
            </p>
          </div>
        ) : (
          <ul className='space-y-3'>
            {expenses.map((expense) => (
              <li key={expense.id} className='flex min-w-0 items-center gap-3'>
                <span
                  aria-hidden
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary'
                >
                  {initialOf(expense.name)}
                </span>
                <div className='min-w-0 flex-1'>
                  <p
                    className='truncate text-sm font-medium text-foreground'
                    title={expense.name}
                  >
                    {expense.name}
                  </p>
                  <p
                    className='truncate text-xs text-muted-foreground'
                    title={expense.budgetName}
                  >
                    {expense.budgetName}
                  </p>
                </div>
                <span
                  className='shrink-0 text-sm font-medium tabular-nums text-foreground'
                  title={formatCurrency(expense.amount)}
                >
                  {formatCompactCurrency(expense.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

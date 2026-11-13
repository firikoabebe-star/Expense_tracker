'use client'

import Link from 'next/link'
import { ArrowRight, Inbox } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '/components/ui/card'
import {
  cn,
  formatCompactCurrency,
  formatCurrency,
} from '/lib/utils'

import { formatActivityDate, initialsOf } from './format'
import type { ActivityItem } from './types'

interface RecentActivityCardProps {
  items: ActivityItem[]
  loading?: boolean
  className?: string
}

/** Latest expenses across every user, with who and which budget. */
export function RecentActivityCard({
  items,
  loading = false,
  className,
}: RecentActivityCardProps) {
  return (
    <Card
      className={cn('border-border bg-card shadow-sm', className)}
    >
      <CardHeader className='flex flex-row items-start justify-between gap-3 space-y-0 p-5'>
        <div className='min-w-0'>
          <CardTitle className='text-base font-semibold'>
            Recent activity
          </CardTitle>
          <CardDescription>
            The latest expenses logged on the platform.
          </CardDescription>
        </div>
        <Link
          href='/admin/activity'
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
            aria-label='Loading recent activity'
            className='space-y-3'
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
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
        ) : items.length === 0 ? (
          <div className='flex h-[240px] flex-col items-center justify-center gap-2 text-center'>
            <Inbox className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>
              No activity yet
            </p>
            <p className='max-w-[17rem] text-xs text-muted-foreground'>
              Expenses logged by any user will show up here.
            </p>
          </div>
        ) : (
          <ul className='divide-y divide-border'>
            {items.map((item, index) => (
              <li
                key={`${item.type}-${item.id}-${index}`}
                className='flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0'
              >
                <span
                  aria-hidden
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary'
                >
                  {initialsOf(item.userName, item.userEmail)}
                </span>

                <div className='min-w-0 flex-1'>
                  <p
                    className='truncate text-sm font-medium text-foreground'
                    title={item.userName || item.userEmail}
                  >
                    {item.userName || item.userEmail || 'Unknown user'}
                  </p>
                  <p
                    className='truncate text-xs text-muted-foreground'
                    title={`${item.name} · ${item.budgetName}`}
                  >
                    {item.name}
                    {item.budgetName ? ` · ${item.budgetName}` : ''}
                  </p>
                </div>

                <div className='shrink-0 text-right'>
                  <p
                    className='text-sm font-medium tabular-nums text-foreground'
                    title={formatCurrency(Number(item.amount) || 0)}
                  >
                    {formatCompactCurrency(Number(item.amount) || 0)}
                  </p>
                  <p className='text-[11px] tabular-nums text-muted-foreground'>
                    {formatActivityDate(item)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

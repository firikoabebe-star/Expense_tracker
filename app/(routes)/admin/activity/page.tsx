'use client'

import * as React from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Landmark,
  ReceiptText,
} from 'lucide-react'

import { Button } from '/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '/components/ui/card'
import { authClient } from '/lib/auth-client'
import {
  cn,
  formatCompactCurrency,
  formatCurrency,
} from '/lib/utils'

import { DashboardErrorCard } from '../../dashboard/_components/DashboardErrorCard'
import { PageHeader } from '../../dashboard/_components/PageHeader'
import { getRecentActivity } from '../actions'
import { FadeIn } from '../_components/FadeIn'
import {
  formatActivityDate,
  initialsOf,
  parseActivityDate,
} from '../_components/format'
import type { ActivityItem } from '../_components/types'

type LoadState = 'loading' | 'ready' | 'error'
type TypeFilter = 'all' | 'expense' | 'budget'
type RangeFilter = '7d' | '30d' | '90d' | 'all'

const PAGE_SIZE = 12
const FEED_LIMIT = 200

const RANGE_OPTIONS: { value: RangeFilter; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
]

function rangeStart(range: RangeFilter): Date | null {
  if (range === 'all') return null
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1))
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const isExpense = item.type === 'expense'

  return (
    <li className='flex min-w-0 flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-3'>
      <div className='flex min-w-0 flex-1 items-center gap-3'>
        <span
          aria-hidden
          className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary'
        >
          {initialsOf(item.userName, item.userEmail)}
        </span>

        <div className='min-w-0 flex-1'>
          <div className='flex min-w-0 items-center gap-2'>
            <p
              className='truncate text-sm font-medium text-foreground'
              title={item.userName || item.userEmail}
            >
              {item.userName || item.userEmail || 'Unknown user'}
            </p>
            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium capitalize',
                isExpense ? 'text-destructive' : 'text-success'
              )}
            >
              {isExpense ? (
                <ReceiptText className='h-3 w-3' aria-hidden />
              ) : (
                <Landmark className='h-3 w-3' aria-hidden />
              )}
              {item.type}
            </span>
          </div>
          <p
            className='truncate text-xs text-muted-foreground'
            title={`${item.name} · ${item.budgetName}`}
          >
            {item.name}
            {item.budgetName ? ` · ${item.budgetName}` : ''}
          </p>
        </div>
      </div>

      <div className='flex shrink-0 items-baseline justify-between gap-4 pl-12 sm:block sm:pl-0 sm:text-right'>
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
  )
}

function ActivityPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [items, setItems] = React.useState<ActivityItem[]>([])
  const [state, setState] = React.useState<LoadState>('loading')
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>('all')
  const [range, setRange] = React.useState<RangeFilter>('30d')
  const [page, setPage] = React.useState(1)
  const request = React.useRef(0)

  const load = React.useCallback(async () => {
    const requestId = request.current + 1
    request.current = requestId
    setState('loading')

    try {
      const rows = await getRecentActivity(FEED_LIMIT)
      if (request.current !== requestId) return
      setItems(rows)
      setState('ready')
    } catch {
      if (request.current !== requestId) return
      setItems([])
      setState('error')
    }
  }, [])

  React.useEffect(() => {
    if (!user) return
    load()
  }, [user, load])

  const inRange = React.useMemo(() => {
    const start = rangeStart(range)
    if (!start) return items
    return items.filter((item) => {
      const date = parseActivityDate(item)
      return !!date && date >= start
    })
  }, [items, range])

  const counts = React.useMemo(
    () => ({
      all: inRange.length,
      expense: inRange.filter((item) => item.type === 'expense').length,
      budget: inRange.filter((item) => item.type === 'budget').length,
    }),
    [inRange]
  )

  const filtered = React.useMemo(() => {
    if (typeFilter === 'all') return inRange
    return inRange.filter((item) => item.type === typeFilter)
  }, [inRange, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const rows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )
  const loading = state === 'loading'

  const CHIPS: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: 'All activity' },
    { value: 'expense', label: 'Expenses' },
    { value: 'budget', label: 'Budgets' },
  ]

  return (
    <div>
      <PageHeader
        title='Activity'
        subtitle='Everything happening across budgets and expenses.'
        actions={
          <div className='relative'>
            <label htmlFor='admin-activity-range' className='sr-only'>
              Activity date range
            </label>
            <select
              id='admin-activity-range'
              value={range}
              onChange={(event) => {
                setRange(event.target.value as RangeFilter)
                setPage(1)
              }}
              className='h-10 w-full appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
              aria-hidden
            />
          </div>
        }
      />

      <div
        className='mt-6 flex flex-wrap items-center gap-2'
        role='group'
        aria-label='Filter activity by type'
      >
        {CHIPS.map((option) => {
          const active = typeFilter === option.value
          return (
            <button
              key={option.value}
              type='button'
              onClick={() => {
                setTypeFilter(option.value)
                setPage(1)
              }}
              aria-pressed={active}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {option.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[11px] tabular-nums',
                  active
                    ? 'bg-background/20 text-background'
                    : 'bg-accent text-muted-foreground'
                )}
              >
                {counts[option.value]}
              </span>
            </button>
          )
        })}
      </div>

      {state === 'error' ? (
        <FadeIn className='mt-5'>
          <DashboardErrorCard
            message="We couldn't load platform activity."
            onRetry={load}
          />
        </FadeIn>
      ) : (
        <FadeIn className='mt-5' delay={0.05}>
          <Card className='border-border bg-card shadow-sm'>
            <CardHeader className='flex flex-row items-start justify-between gap-3 space-y-0 p-5'>
              <div className='min-w-0'>
                <CardTitle className='text-base font-semibold'>
                  {typeFilter === 'budget'
                    ? 'Budget activity'
                    : typeFilter === 'expense'
                      ? 'Expense activity'
                      : 'All activity'}
                </CardTitle>
                <CardDescription>
                  {loading
                    ? 'Loading activity…'
                    : `${filtered.length.toLocaleString('en-US')} ${
                        filtered.length === 1 ? 'entry' : 'entries'
                      } in this range`}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className='p-5 pt-0'>
              {loading ? (
                <div
                  role='status'
                  aria-label='Loading activity feed'
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
              ) : rows.length === 0 ? (
                <div className='flex h-[260px] flex-col items-center justify-center gap-2 text-center'>
                  <Inbox className='h-8 w-8 text-muted-foreground' aria-hidden />
                  <p className='text-sm font-medium text-foreground'>
                    {typeFilter === 'budget'
                      ? 'No budget activity yet'
                      : 'No activity in this range'}
                  </p>
                  <p className='max-w-[22rem] text-xs text-muted-foreground'>
                    {typeFilter === 'budget'
                      ? 'Budget changes are not recorded in the activity feed yet. Expense activity is listed under Expenses.'
                      : 'Expenses logged by any user in this range will appear here.'}
                  </p>
                  {typeFilter !== 'all' || range !== 'all' ? (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='mt-2'
                      onClick={() => {
                        setTypeFilter('all')
                        setRange('all')
                        setPage(1)
                      }}
                    >
                      Show all activity
                    </Button>
                  ) : null}
                </div>
              ) : (
                <ul className='divide-y divide-border'>
                  {rows.map((item, index) => (
                    <ActivityRow
                      key={`${item.type}-${item.id}-${index}`}
                      item={item}
                    />
                  ))}
                </ul>
              )}

              <div className='mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between'>
                <p className='text-xs text-muted-foreground'>
                  {loading
                    ? 'Loading…'
                    : filtered.length === 0
                      ? 'No entries to show'
                      : `Page ${safePage} of ${totalPages}`}
                </p>

                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={loading || safePage <= 1}
                  >
                    <ChevronLeft className='h-4 w-4' aria-hidden />
                    Previous
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setPage(Math.min(totalPages, safePage + 1))
                    }
                    disabled={loading || safePage >= totalPages}
                  >
                    Next
                    <ChevronRight className='h-4 w-4' aria-hidden />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  )
}

export default ActivityPage

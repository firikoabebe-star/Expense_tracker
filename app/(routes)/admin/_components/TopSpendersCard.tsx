'use client'

import { Users } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

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
  ChartTooltipContent,
  type ChartConfig,
} from '/components/ui/chart'
import { cn, formatCompactCurrency, formatCurrency } from '/lib/utils'

import type { TopUser } from './types'

const chartConfig = {
  total: { label: 'Spent', color: 'var(--chart-2)' },
} satisfies ChartConfig

/** Truncated label; non-breaking spaces stop Recharts wrapping it mid-name. */
function truncate(value: string, max = 13): string {
  const trimmed = (value ?? '').trim()
  if (!trimmed) return 'Unknown'
  const label =
    trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed
  return label.replace(/ /g, '\u00A0')
}

interface TopSpendersCardProps {
  users: TopUser[]
  loading?: boolean
  className?: string
}

/** The biggest spenders across every budget on the platform. */
export function TopSpendersCard({
  users,
  loading = false,
  className,
}: TopSpendersCardProps) {
  const rows = users.filter((user) => user.total > 0)

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='space-y-1 p-5'>
        <CardTitle className='text-base font-semibold'>
          Top users by spending
        </CardTitle>
        <CardDescription>Largest totals across all budgets.</CardDescription>
      </CardHeader>

      <CardContent className='p-5 pt-0'>
        {loading ? (
          <div role='status' aria-label='Loading top spenders'>
            <div className='space-y-3'>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className='flex items-center gap-2'>
                  <div className='h-3 w-20 animate-pulse rounded bg-accent' />
                  <div
                    className='h-3 animate-pulse rounded bg-accent'
                    style={{ width: `${88 - item * 12}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className='flex h-[240px] flex-col items-center justify-center gap-2 text-center'>
            <Users className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>
              No spending recorded
            </p>
            <p className='max-w-[15rem] text-xs text-muted-foreground'>
              Users appear here once they log expenses.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[240px] w-full'
          >
            <BarChart
              data={rows}
              layout='vertical'
              margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
              barCategoryGap='28%'
            >
              <XAxis
                type='number'
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tick={{ fontSize: 11 }}
                tickFormatter={(value: number) => formatCompactCurrency(value)}
              />
              <YAxis
                type='category'
                dataKey='name'
                width={104}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                tickFormatter={(value: string) => truncate(value)}
              />
              <ChartTooltip
                cursor={{ fill: 'var(--muted)' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => (
                      <span className='text-xs font-medium text-foreground'>
                        {String(label)}
                      </span>
                    )}
                    formatter={(value) => (
                      <div className='flex w-full items-center justify-between gap-3'>
                        <span className='text-muted-foreground'>Spent</span>
                        <span className='font-mono text-xs font-medium tabular-nums text-foreground'>
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey='total'
                fill='var(--color-total)'
                radius={[0, 4, 4, 0]}
                barSize={14}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}


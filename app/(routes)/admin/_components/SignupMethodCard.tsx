'use client'

import { Inbox } from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'

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
import { cn } from '/lib/utils'

import { toPercent } from './format'

const chartConfig = {
  Google: { label: 'Google', color: 'var(--chart-1)' },
  Email: { label: 'Email', color: 'var(--chart-3)' },
} satisfies ChartConfig

interface SignupMethodCardProps {
  sources: { google: number; email: number }
  loading?: boolean
  className?: string
}

/** Where new accounts come from: Google sign-in versus email/password. */
export function SignupMethodCard({
  sources,
  loading = false,
  className,
}: SignupMethodCardProps) {
  const rows = [
    { name: 'Google', value: sources.google, fill: 'var(--chart-1)' },
    { name: 'Email', value: sources.email, fill: 'var(--chart-3)' },
  ]
  const total = sources.google + sources.email
  const plotted = rows.filter((row) => row.value > 0)

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='space-y-1 p-5'>
        <CardTitle className='text-base font-semibold'>Signup method</CardTitle>
        <CardDescription>How accounts were created.</CardDescription>
      </CardHeader>

      <CardContent className='p-5 pt-0'>
        {loading ? (
          <div role='status' aria-label='Loading signup methods'>
            <div className='mx-auto h-40 w-40 animate-pulse rounded-full bg-accent' />
            <div className='mt-4 space-y-2'>
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className='h-4 w-full animate-pulse rounded bg-accent'
                />
              ))}
            </div>
          </div>
        ) : total === 0 ? (
          <div className='flex h-[240px] flex-col items-center justify-center gap-2 text-center'>
            <Inbox className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>No signups yet</p>
            <p className='max-w-[15rem] text-xs text-muted-foreground'>
              Account sources appear here once people sign up.
            </p>
          </div>
        ) : (
          <>
            <div className='relative mx-auto h-40 w-40'>
              <ChartContainer
                config={chartConfig}
                className='aspect-auto h-full w-full'
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name) => (
                          <div className='flex w-full items-center justify-between gap-3'>
                            <span className='text-muted-foreground'>
                              {name}
                            </span>
                            <span className='font-mono text-xs font-medium tabular-nums text-foreground'>
                              {Number(value).toLocaleString('en-US')} (
                              {toPercent(Number(value), total)}%)
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={plotted}
                    dataKey='value'
                    nameKey='name'
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                    strokeWidth={0}
                    isAnimationActive={false}
                  >
                    {plotted.map((row) => (
                      <Cell key={row.name} fill={row.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
                <span className='text-[11px] text-muted-foreground'>Users</span>
                <span className='text-lg font-bold tabular-nums text-foreground'>
                  {total.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            <ul className='mt-4 space-y-2'>
              {rows.map((row) => (
                <li key={row.name} className='flex items-center gap-2 text-sm'>
                  <span
                    className='h-2.5 w-2.5 shrink-0 rounded-full'
                    style={{ backgroundColor: row.fill }}
                    aria-hidden
                  />
                  <span className='min-w-0 flex-1 truncate text-foreground'>
                    {row.name}
                  </span>
                  <span className='shrink-0 text-xs tabular-nums text-muted-foreground'>
                    {row.value.toLocaleString('en-US')} ·{' '}
                    {toPercent(row.value, total)}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}

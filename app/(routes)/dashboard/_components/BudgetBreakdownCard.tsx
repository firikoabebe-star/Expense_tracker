"use client"

import * as React from 'react'
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
import { cn, formatCompactCurrency, formatCurrency } from '/lib/utils'
import type { BudgetBreakdown } from '../analytics-actions'

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

interface BreakdownSlice {
  name: string
  value: number
  fill: string
  share: number
}

function buildSlices(byBudget: BudgetBreakdown[]): BreakdownSlice[] {
  const spending = byBudget.filter((budget) => budget.spent > 0)
  const total = spending.reduce((sum, budget) => sum + budget.spent, 0)
  if (total <= 0) return []

  const sorted = [...spending].sort((a, b) => b.spent - a.spent)
  const head = sorted.slice(0, 4)
  const tail = sorted.slice(4)
  const other = tail.reduce((sum, budget) => sum + budget.spent, 0)

  const toSlice = (name: string, value: number, index: number) => ({
    name,
    value,
    fill: CHART_COLORS[index],
    share: Math.round((value / total) * 100),
  })

  const slices = head.map((budget, index) =>
    toSlice(budget.name, budget.spent, index)
  )
  if (other > 0) {
    slices.push(toSlice('Other', other, head.length))
  }
  return slices
}

interface BudgetBreakdownCardProps {
  byBudget: BudgetBreakdown[]
  totalSpent: number
  title?: string
  description?: string
  loading?: boolean
  className?: string
}

/** Donut of spending by budget with a matching legend list. */
export function BudgetBreakdownCard({
  byBudget,
  totalSpent,
  title = 'Budget breakdown',
  description = "Where this period's spending went.",
  loading = false,
  className,
}: BudgetBreakdownCardProps) {
  const slices = React.useMemo(() => buildSlices(byBudget), [byBudget])

  const chartConfig = React.useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        slices.map((slice) => [
          slice.name,
          { label: slice.name, color: slice.fill },
        ])
      ),
    [slices]
  )

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='space-y-1 p-5'>
        <CardTitle className='text-base font-semibold'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className='p-5 pt-0'>
        {loading ? (
          <div role='status' aria-label='Loading budget breakdown'>
            <div className='mx-auto h-44 w-44 animate-pulse rounded-full bg-accent' />
            <div className='mt-4 space-y-2'>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className='h-4 w-full animate-pulse rounded bg-accent'
                />
              ))}
            </div>
          </div>
        ) : slices.length === 0 ? (
          <div className='flex h-[290px] flex-col items-center justify-center gap-2 text-center'>
            <Inbox className='h-8 w-8 text-muted-foreground' aria-hidden />
            <p className='text-sm font-medium text-foreground'>
              No spending to break down
            </p>
            <p className='max-w-[15rem] text-xs text-muted-foreground'>
              Expenses added to a budget will show up here.
            </p>
          </div>
        ) : (
          <>
            <div className='relative mx-auto h-44 w-44'>
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
                              {formatCurrency(Number(value))}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={slices}
                    dataKey='value'
                    nameKey='name'
                    innerRadius={56}
                    outerRadius={84}
                    paddingAngle={2}
                    strokeWidth={0}
                    isAnimationActive={false}
                  >
                    {slices.map((slice) => (
                      <Cell key={slice.name} fill={slice.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
                <span className='text-[11px] text-muted-foreground'>Spent</span>
                <span
                  className='text-lg font-bold tabular-nums text-foreground'
                  title={formatCurrency(totalSpent)}
                >
                  {formatCompactCurrency(totalSpent)}
                </span>
              </div>
            </div>

            <ul className='mt-4 space-y-2'>
              {slices.map((slice) => (
                <li
                  key={slice.name}
                  className='flex items-center gap-2 text-sm'
                >
                  <span
                    className='h-2.5 w-2.5 shrink-0 rounded-full'
                    style={{ backgroundColor: slice.fill }}
                    aria-hidden
                  />
                  <span
                    className='min-w-0 flex-1 truncate text-foreground'
                    title={slice.name}
                  >
                    {slice.name}
                  </span>
                  <span className='shrink-0 tabular-nums text-muted-foreground'>
                    {slice.share}%
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

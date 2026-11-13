'use client'

import * as React from 'react'
import { ChevronDown, Download, Inbox, Printer } from 'lucide-react'

import { Button } from '/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '/components/ui/card'
import { authClient } from '/lib/auth-client'
import { formatCompactCurrency, formatCurrency, toCsv } from '/lib/utils'

import { getMonthlyReport, type MonthlyReport } from '../analytics-actions'
import { DashboardErrorCard } from '../_components/DashboardErrorCard'
import { PageHeader } from '../_components/PageHeader'
import { USAGE_TONE, usageLevel } from '../_components/usage-levels'
import { MonthlyTotalsChart } from './_components/MonthlyTotalsChart'

type LoadState = 'loading' | 'ready' | 'error'

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - index)

function ReportsPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [year, setYear] = React.useState(CURRENT_YEAR)
  const [report, setReport] = React.useState<MonthlyReport | null>(null)
  const [state, setState] = React.useState<LoadState>('loading')
  const request = React.useRef(0)

  const load = React.useCallback(async (nextYear: number) => {
    const requestId = request.current + 1
    request.current = requestId
    setState('loading')

    try {
      const result = await getMonthlyReport(nextYear)
      if (request.current !== requestId) return

      if (!result.ok) {
        setReport(null)
        setState('error')
        return
      }

      setReport(result.data)
      setState('ready')
    } catch {
      if (request.current !== requestId) return
      setReport(null)
      setState('error')
    }
  }, [])

  React.useEffect(() => {
    if (!user) return
    load(year)
  }, [user, year, load])

  const months = report?.months ?? []
  const byBudget = report?.byBudget ?? []
  const loading = state === 'loading'

  const exportCsv = () => {
    if (!report) return

    const rows: Array<Array<string | number>> = [
      ['Month', 'Expenses', 'Total (ETB)'],
      ...report.months.map((month) => [month.label, month.count, month.total]),
      ['Total', report.count, report.total],
    ]

    const csv = toCsv(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `montra-report-${report.year}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <div>
      <PageHeader
        title='Reports'
        subtitle='Monthly summaries you can review, export or print.'
        actions={
          <div
            data-print-hide
            className='flex flex-wrap items-center gap-2'
          >
            <div className='relative'>
              <label htmlFor='report-year' className='sr-only'>
                Report year
              </label>
              <select
                id='report-year'
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                className='h-10 w-full appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              >
                {YEAR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
                aria-hidden
              />
            </div>

            <Button
              variant='outline'
              onClick={exportCsv}
              disabled={!report || report.count === 0}
            >
              <Download className='h-4 w-4' />
              Export CSV
            </Button>
            <Button
              variant='outline'
              onClick={() => window.print()}
              disabled={!report}
            >
              <Printer className='h-4 w-4' />
              Print
            </Button>
          </div>
        }
      />

      {state === 'error' ? (
        <div className='mt-6'>
          <DashboardErrorCard
            message={`We couldn't load the ${year} report. Try again or pick another year.`}
            onRetry={() => load(year)}
          />
        </div>
      ) : (
        <>
          <Card className='print-flat print-avoid-break mt-6 border-border bg-card shadow-sm'>
            <CardHeader className='flex flex-col gap-3 space-y-0 p-5 sm:flex-row sm:items-start sm:justify-between'>
              <div className='min-w-0'>
                <CardTitle className='text-base font-semibold'>
                  Spending by month
                </CardTitle>
                <CardDescription>
                  Monthly totals across {year}.
                </CardDescription>
              </div>

              <div className='shrink-0 text-left sm:text-right'>
                <p
                  className='text-xl font-bold tabular-nums text-foreground'
                  title={formatCurrency(report?.total ?? 0)}
                >
                  {loading ? '—' : formatCompactCurrency(report?.total ?? 0)}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {loading
                    ? 'Loading'
                    : `${(report?.count ?? 0).toLocaleString('en-US')} ${
                        report?.count === 1 ? 'expense' : 'expenses'
                      }`}
                </p>
              </div>
            </CardHeader>

            <CardContent className='p-5 pt-0'>
              <MonthlyTotalsChart
                months={months}
                year={year}
                loading={loading}
              />
            </CardContent>
          </Card>

          <div className='mt-5 grid grid-cols-12 gap-5'>
            <Card className='print-flat print-avoid-break col-span-12 border-border bg-card shadow-sm lg:col-span-7'>
              <CardHeader className='space-y-1 p-5'>
                <CardTitle className='text-base font-semibold'>
                  Monthly breakdown
                </CardTitle>
                <CardDescription>
                  Expense count and total for each month of {year}.
                </CardDescription>
              </CardHeader>

              <CardContent className='p-5 pt-0'>
                {loading ? (
                  <div
                    role='status'
                    aria-label='Loading monthly breakdown'
                    className='space-y-2'
                  >
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                      <div
                        key={row}
                        className='h-8 w-full animate-pulse rounded bg-accent'
                      />
                    ))}
                  </div>
                ) : report && report.count > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className='w-full min-w-[420px] text-sm'>
                      <caption className='sr-only'>
                        Monthly spending totals for {year}
                      </caption>
                      <thead>
                        <tr className='border-b border-border text-xs uppercase tracking-wide text-muted-foreground'>
                          <th scope='col' className='py-2 pr-3 text-left font-medium'>
                            Month
                          </th>
                          <th scope='col' className='px-3 py-2 text-right font-medium'>
                            Expenses
                          </th>
                          <th scope='col' className='px-3 py-2 text-right font-medium'>
                            Total
                          </th>
                          <th scope='col' className='py-2 pl-3 text-right font-medium'>
                            Share
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {months.map((month) => {
                          const share =
                            report.total > 0
                              ? Math.round((month.total / report.total) * 100)
                              : 0
                          return (
                            <tr
                              key={month.key}
                              className='border-b border-border last:border-0'
                            >
                              <th
                                scope='row'
                                className='py-2 pr-3 text-left font-normal text-foreground'
                              >
                                {month.label}
                              </th>
                              <td className='px-3 py-2 text-right tabular-nums text-muted-foreground'>
                                {month.count.toLocaleString('en-US')}
                              </td>
                              <td
                                className='px-3 py-2 text-right tabular-nums text-foreground'
                                title={formatCurrency(month.total)}
                              >
                                {formatCompactCurrency(month.total)}
                              </td>
                              <td className='py-2 pl-3 text-right tabular-nums text-muted-foreground'>
                                {share}%
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot>
                        <tr className='bg-accent font-medium'>
                          <th
                            scope='row'
                            className='rounded-l-md py-2 pl-2 pr-3 text-left text-foreground'
                          >
                            Total
                          </th>
                          <td className='px-3 py-2 text-right tabular-nums text-foreground'>
                            {report.count.toLocaleString('en-US')}
                          </td>
                          <td
                            className='px-3 py-2 text-right tabular-nums text-foreground'
                            title={formatCurrency(report.total)}
                          >
                            {formatCompactCurrency(report.total)}
                          </td>
                          <td className='rounded-r-md py-2 pl-3 pr-2 text-right tabular-nums text-foreground'>
                            100%
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className='flex h-[220px] flex-col items-center justify-center gap-2 text-center'>
                    <Inbox
                      className='h-8 w-8 text-muted-foreground'
                      aria-hidden
                    />
                    <p className='text-sm font-medium text-foreground'>
                      No expenses in {year}
                    </p>
                    <p className='max-w-[16rem] text-xs text-muted-foreground'>
                      Choose a different year to see its monthly breakdown.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className='print-flat print-avoid-break col-span-12 border-border bg-card shadow-sm lg:col-span-5'>
              <CardHeader className='space-y-1 p-5'>
                <CardTitle className='text-base font-semibold'>
                  Budgets in {year}
                </CardTitle>
                <CardDescription>
                  {report
                    ? `${byBudget.length.toLocaleString('en-US')} budgets · spent against each limit`
                    : 'Spent against each limit'}
                </CardDescription>
              </CardHeader>

              <CardContent className='p-5 pt-0'>
                {loading ? (
                  <div
                    role='status'
                    aria-label='Loading budget totals'
                    className='space-y-4'
                  >
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className='space-y-2'>
                        <div className='h-4 w-full animate-pulse rounded bg-accent' />
                        <div className='h-2 w-full animate-pulse rounded-full bg-accent' />
                      </div>
                    ))}
                  </div>
                ) : byBudget.length === 0 ? (
                  <div className='flex h-[220px] flex-col items-center justify-center gap-2 text-center'>
                    <Inbox
                      className='h-8 w-8 text-muted-foreground'
                      aria-hidden
                    />
                    <p className='text-sm font-medium text-foreground'>
                      No budgets yet
                    </p>
                    <p className='max-w-[15rem] text-xs text-muted-foreground'>
                      Create a budget to see yearly totals per budget.
                    </p>
                  </div>
                ) : (
                  <ul className='space-y-4'>
                    {byBudget.slice(0, 8).map((budget) => (
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
                            {formatCompactCurrency(budget.spent)}
                          </span>
                        </div>
                        <div className='mt-2 flex items-center gap-2'>
                          <div className='h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-accent'>
                            <div
                              className={`h-2 rounded-full ${
                                USAGE_TONE[usageLevel(budget.pct)]
                              }`}
                              style={{
                                width: `${Math.min(100, Math.max(0, budget.pct))}%`,
                              }}
                            />
                          </div>
                          <span className='w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground'>
                            {Math.round(budget.pct)}%
                          </span>
                        </div>
                        <p className='mt-1 text-[11px] text-muted-foreground'>
                          {budget.count.toLocaleString('en-US')}{' '}
                          {budget.count === 1 ? 'expense' : 'expenses'} ·{' '}
                          {formatCompactCurrency(budget.amount)} budget
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default ReportsPage

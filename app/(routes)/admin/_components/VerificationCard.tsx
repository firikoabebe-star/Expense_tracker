'use client'

import { ShieldCheck, ShieldOff } from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'

import { Card } from '/components/ui/card'
import { ChartContainer } from '/components/ui/chart'
import { cn } from '/lib/utils'

import { toPercent } from './format'

interface VerificationCardProps {
  /** Ratio between 0 and 1. */
  verifiedRate: number
  totalUsers: number
  loading?: boolean
  className?: string
}

/**
 * Always-dark verification panel. Like the monthly target card it uses the
 * charcoal block token, so it stays dark in both themes.
 */
export function VerificationCard({
  verifiedRate,
  totalUsers,
  loading = false,
  className,
}: VerificationCardProps) {
  const pct = Math.min(100, Math.max(0, toPercent(verifiedRate, 1)))
  const verifiedCount = Math.round(verifiedRate * totalUsers)
  const unverifiedCount = Math.max(0, totalUsers - verifiedCount)
  const hasUsers = totalUsers > 0

  const slices = [
    { name: 'Verified', value: pct, fill: 'var(--success)', opacity: 1 },
    {
      name: 'Unverified',
      value: Math.max(0, 100 - pct),
      fill: 'var(--clr-text-on-dark)',
      opacity: 0.14,
    },
  ]

  return (
    <Card
      className={cn(
        'border-on-inverse bg-[var(--block-charcoal)] text-[var(--clr-text-on-dark)] shadow-sm transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <div className='p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h2 className='text-base font-semibold text-[var(--clr-text-on-dark)]'>
              Verification
            </h2>
            <p className='mt-1 text-xs text-on-inverse-muted'>
              Email verification across all accounts
            </p>
          </div>
          <ShieldCheck
            className='h-4 w-4 shrink-0 text-on-inverse-muted'
            aria-hidden
          />
        </div>

        {loading ? (
          <div role='status' aria-label='Loading verification rate'>
            <div className='mx-auto mt-6 h-40 w-40 animate-pulse rounded-full bg-[var(--clr-text-on-dark)] opacity-10' />
            <div className='mt-6 h-4 w-full animate-pulse rounded bg-[var(--clr-text-on-dark)] opacity-10' />
            <div className='mt-2 h-4 w-2/3 animate-pulse rounded bg-[var(--clr-text-on-dark)] opacity-10' />
          </div>
        ) : !hasUsers ? (
          <div className='flex flex-col items-center justify-center gap-2 py-12 text-center'>
            <ShieldOff className='h-7 w-7 text-on-inverse-muted' aria-hidden />
            <p className='text-sm font-medium'>No users yet</p>
            <p className='max-w-[15rem] text-xs text-on-inverse-muted'>
              Verification rates appear once accounts are created.
            </p>
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
                <span className='text-2xl font-bold tabular-nums'>{pct}%</span>
                <span className='text-[11px] text-on-inverse-muted'>
                  verified
                </span>
              </div>
            </div>

            <div className='mt-6 space-y-2 text-sm'>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-on-inverse-muted'>Verified</span>
                <span className='font-medium tabular-nums'>
                  {verifiedCount.toLocaleString('en-US')}
                </span>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-on-inverse-muted'>Unverified</span>
                <span className='font-medium tabular-nums'>
                  {unverifiedCount.toLocaleString('en-US')}
                </span>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-on-inverse-muted'>Total users</span>
                <span className='font-medium tabular-nums'>
                  {totalUsers.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            <div className='mt-4 flex items-center gap-2 border-t border-on-inverse pt-4 text-xs font-medium'>
              <span
                className='h-2 w-2 rounded-full bg-[var(--success)]'
                aria-hidden
              />
              {pct >= 75
                ? 'Healthy verification rate'
                : 'Verification needs attention'}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

'use client'

import * as React from 'react'
import { ChevronDown, ReceiptText, UserPlus, Users, Activity } from 'lucide-react'

import { authClient } from '/lib/auth-client'
import { formatCompactCurrency } from '/lib/utils'

import { DashboardErrorCard } from '../dashboard/_components/DashboardErrorCard'
import { PageHeader } from '../dashboard/_components/PageHeader'
import { StatCard } from '../dashboard/_components/StatCard'
import { getAdminOverview, getRecentActivity, getTopUsers } from './actions'
import { FadeIn } from './_components/FadeIn'
import { GrowthCard } from './_components/GrowthCard'
import { RecentActivityCard } from './_components/RecentActivityCard'
import { RolesCard } from './_components/RolesCard'
import { SignupMethodCard } from './_components/SignupMethodCard'
import { TopSpendersCard } from './_components/TopSpendersCard'
import { VerificationCard } from './_components/VerificationCard'
import type { ActivityItem, AdminOverview, AdminRange, TopUser } from './_components/types'

type LoadState = 'loading' | 'ready' | 'error'

const RANGE_OPTIONS: { value: AdminRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '6m', label: 'Last 6 months' },
  { value: '12m', label: 'Last 12 months' },
]

function AdminOverviewPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [range, setRange] = React.useState<AdminRange>('30d')
  const [overview, setOverview] = React.useState<AdminOverview | null>(null)
  const [topUsers, setTopUsers] = React.useState<TopUser[]>([])
  const [activity, setActivity] = React.useState<ActivityItem[]>([])
  const [state, setState] = React.useState<LoadState>('loading')
  const request = React.useRef(0)

  const load = React.useCallback(async (nextRange: AdminRange) => {
    const requestId = request.current + 1
    request.current = requestId
    setState('loading')

    try {
      const [overviewResult, userRows, activityRows] = await Promise.all([
        getAdminOverview(nextRange),
        getTopUsers(5),
        getRecentActivity(6),
      ])
      if (request.current !== requestId) return

      setTopUsers(userRows)
      setActivity(activityRows)

      if (!overviewResult.ok || !overviewResult.data) {
        setOverview(null)
        setState('error')
        return
      }

      setOverview(overviewResult.data)
      setState('ready')
    } catch {
      if (request.current !== requestId) return
      setOverview(null)
      setState('error')
    }
  }, [])

  React.useEffect(() => {
    if (!user) return
    load(range)
  }, [user, range, load])

  const totals = overview?.totals
  const sparklines = overview?.sparklines
  const loading = state === 'loading'

  /** Cumulative accounts make the total-users sparkline read as growth. */
  const usersSparkline = React.useMemo(() => {
    let running = 0
    return (sparklines?.users ?? []).map((value) => {
      running += value
      return running
    })
  }, [sparklines])

  return (
    <div>
      <PageHeader
        title='Overview'
        subtitle='Platform health, growth and spending at a glance.'
        actions={
          <div className='relative'>
            <label htmlFor='admin-range' className='sr-only'>
              Date range
            </label>
            <select
              id='admin-range'
              value={range}
              onChange={(event) => setRange(event.target.value as AdminRange)}
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

      {state === 'error' ? (
        <FadeIn className='mt-6'>
          <DashboardErrorCard
            message="We couldn't load the admin overview. Recent activity is still available below."
            onRetry={() => load(range)}
          />
        </FadeIn>
      ) : (
        <>
          <FadeIn className='mt-6 grid grid-cols-12 gap-5'>
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Total users'
              icon={Users}
              value={totals?.users.current ?? 0}
              format='count'
              changePct={totals?.users.change ?? null}
              caption='All registered accounts'
              sparkline={usersSparkline}
              color='var(--chart-1)'
              loading={loading}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='New signups'
              icon={UserPlus}
              value={totals?.newUsers.current ?? 0}
              format='count'
              changePct={totals?.newUsers.change ?? null}
              caption={`${(totals?.newUsers.previous ?? 0).toLocaleString(
                'en-US'
              )} in the previous period`}
              sparkline={sparklines?.users ?? []}
              color='var(--chart-2)'
              loading={loading}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Active users'
              icon={Activity}
              value={totals?.activeUsers.current ?? 0}
              format='count'
              changePct={totals?.activeUsers.change ?? null}
              caption={`${(totals?.expenses.current ?? 0).toLocaleString(
                'en-US'
              )} expenses logged`}
              sparkline={sparklines?.expenses ?? []}
              color='var(--chart-3)'
              loading={loading}
            />
            <StatCard
              className='col-span-12 sm:col-span-6 xl:col-span-3'
              label='Total spent'
              icon={ReceiptText}
              value={totals?.totalSpent.current ?? 0}
              changePct={totals?.totalSpent.change ?? null}
              caption={
                totals ? (
                  <>
                    Previous:{' '}
                    {formatCompactCurrency(totals.totalSpent.previous)}
                  </>
                ) : undefined
              }
              sparkline={sparklines?.spent ?? []}
              color='var(--chart-4)'
              loading={loading}
            />
          </FadeIn>

          <FadeIn className='mt-5 grid grid-cols-12 gap-5' delay={0.05}>
            <GrowthCard
              className='col-span-12 lg:col-span-8'
              signupsSeries={overview?.signupsSeries ?? []}
              expensesTotalSeries={overview?.expensesTotalSeries ?? []}
              loading={loading}
            />
            <VerificationCard
              className='col-span-12 lg:col-span-4'
              verifiedRate={overview?.verifiedRate ?? 0}
              totalUsers={overview?.totals.users.current ?? 0}
              loading={loading}
            />
          </FadeIn>

          <FadeIn className='mt-5 grid grid-cols-12 gap-5' delay={0.1}>
            <SignupMethodCard
              className='col-span-12 md:col-span-6 lg:col-span-4'
              sources={
                overview?.signupSources ?? { google: 0, email: 0 }
              }
              loading={loading}
            />
            <TopSpendersCard
              className='col-span-12 md:col-span-6 lg:col-span-4'
              users={topUsers}
              loading={loading}
            />
            <RolesCard
              className='col-span-12 md:col-span-6 lg:col-span-4'
              roleSplit={overview?.roleSplit ?? { admins: 0, users: 0 }}
              loading={loading}
            />
          </FadeIn>
        </>
      )}

      <FadeIn className='mt-5' delay={0.15}>
        <RecentActivityCard items={activity} loading={loading} />
      </FadeIn>
    </div>
  )
}

export default AdminOverviewPage

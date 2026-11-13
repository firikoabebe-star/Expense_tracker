'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '/components/ui/card'
import { authClient } from '/lib/auth-client'
import { cn } from '/lib/utils'

import { DashboardErrorCard } from '../../dashboard/_components/DashboardErrorCard'
import { PageHeader } from '../../dashboard/_components/PageHeader'
import { getUsersPage, updateUserRole } from '../actions'
import { FadeIn } from '../_components/FadeIn'
import { UsersTable } from '../_components/UsersTable'
import type {
  AdminUserRow,
  UsersPageResult,
} from '../_components/types'

type LoadState = 'loading' | 'ready' | 'error'

const PAGE_SIZE = 10

const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'admin', label: 'Admins' },
  { value: 'user', label: 'Users' },
] as const

const VERIFIED_OPTIONS = [
  { value: 'all', label: 'Any status' },
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' },
] as const

const selectClass =
  'h-10 w-full appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function UsersPageContent() {
  const { data: session } = authClient.useSession()
  const user = session?.user
  const currentUserId = (user as Record<string, unknown> | undefined)?.id as
    | string
    | undefined

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const search = searchParams.get('q') ?? ''
  const role = searchParams.get('role') ?? 'all'
  const verified = searchParams.get('verified') ?? 'all'
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)

  const [searchInput, setSearchInput] = React.useState(search)
  const [result, setResult] = React.useState<
    Extract<UsersPageResult, { ok: true }>['data'] | null
  >(null)
  const [state, setState] = React.useState<LoadState>('loading')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [adminTotal, setAdminTotal] = React.useState<number | null>(null)
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [roleError, setRoleError] = React.useState<{
    message: string
    retry: () => void
  } | null>(null)
  const request = React.useRef(0)

  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') params.delete(key)
        else params.set(key, value)
      }
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router, searchParams]
  )

  // Keep the field in sync with back/forward navigation and "clear filters".
  React.useEffect(() => {
    setSearchInput(search)
  }, [search])

  // Debounce typing into the URL so every keystroke does not hit the server.
  React.useEffect(() => {
    if (searchInput.trim() === search) return
    const timeout = setTimeout(() => {
      updateParams({ q: searchInput.trim() || null, page: null })
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput, search, updateParams])

  const load = React.useCallback(async () => {
    const requestId = request.current + 1
    request.current = requestId
    setState('loading')

    try {
      const response = await getUsersPage({
        page,
        pageSize: PAGE_SIZE,
        search: search.trim() || undefined,
        role: role === 'all' ? undefined : role,
        verified: verified === 'all' ? undefined : verified === 'verified',
      })
      if (request.current !== requestId) return

      if (!response.ok || !response.data) {
        setResult(null)
        setErrorMessage(response.message || "We couldn't load the user list.")
        setState('error')
        return
      }

      setResult(response.data)
      setState('ready')
    } catch {
      if (request.current !== requestId) return
      setResult(null)
      setErrorMessage("We couldn't load the user list.")
      setState('error')
    }
  }, [page, role, verified, search])

  React.useEffect(() => {
    if (!user) return
    load()
  }, [user, load])

  const loadAdminTotal = React.useCallback(async () => {
    try {
      const response = await getUsersPage({
        page: 1,
        pageSize: 1,
        role: 'admin',
      })
      if (response.ok && response.data) setAdminTotal(response.data.total)
    } catch {
      // The guard is best effort; the server still enforces it.
    }
  }, [])

  React.useEffect(() => {
    if (!user) return
    loadAdminTotal()
  }, [user, loadAdminTotal])

  const changeRole = React.useCallback(
    async (row: AdminUserRow, nextRole: 'admin' | 'user') => {
      setUpdatingId(row.id)
      setRoleError(null)

      try {
        await updateUserRole(row.id, nextRole)
        toast.success(
          `${row.name || row.email} is now ${
            nextRole === 'admin' ? 'an admin' : 'a user'
          }`
        )
        await Promise.all([load(), loadAdminTotal()])
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : 'Failed to update the user role.'
        setRoleError({ message, retry: () => changeRole(row, nextRole) })
      } finally {
        setUpdatingId(null)
      }
    },
    [load, loadAdminTotal]
  )

  const blockedReason = React.useCallback(
    (row: AdminUserRow): string | null => {
      if (row.role === 'admin') {
        if (currentUserId && row.id === currentUserId) {
          return 'You cannot remove admin access from your own account.'
        }
        if (adminTotal !== null && adminTotal <= 1) {
          return 'This is the last admin. Promote someone else first.'
        }
      }
      return null
    },
    [adminTotal, currentUserId]
  )

  const hasFilters = !!(search || role !== 'all' || verified !== 'all')
  const total = result?.total ?? 0
  const totalPages = result?.totalPages ?? 1
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)
  const loading = state === 'loading'

  const clearFilters = () =>
    updateParams({ q: null, role: null, verified: null, page: null })

  return (
    <div>
      <PageHeader
        title='Users'
        subtitle='Search, filter and manage every account on the platform.'
      />

      {roleError ? (
        <FadeIn className='mt-6'>
          <DashboardErrorCard
            message={roleError.message}
            onRetry={roleError.retry}
          />
        </FadeIn>
      ) : null}

      <FadeIn className='mt-6' delay={0.05}>
        <Card className='border-border bg-card shadow-sm'>
          <CardHeader className='gap-4 space-y-0 p-5'>
            <div className='flex flex-col gap-1'>
              <CardTitle className='text-base font-semibold'>
                All users
              </CardTitle>
              <CardDescription>
                {loading
                  ? 'Loading accounts…'
                  : `${total.toLocaleString('en-US')} ${
                      total === 1 ? 'account' : 'accounts'
                    }`}
              </CardDescription>
            </div>

            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
              <div className='relative min-w-0 flex-1'>
                <label htmlFor='admin-user-search' className='sr-only'>
                  Search users
                </label>
                <Search
                  className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
                  aria-hidden
                />
                <input
                  id='admin-user-search'
                  type='search'
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder='Search by name or email'
                  className='h-10 w-full rounded-full border border-border bg-background pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'
                />
                {searchInput ? (
                  <button
                    type='button'
                    onClick={() => setSearchInput('')}
                    aria-label='Clear search'
                    className='absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  >
                    <X className='h-3.5 w-3.5' aria-hidden />
                  </button>
                ) : null}
              </div>

              <div className='relative sm:w-40'>
                <label htmlFor='admin-role-filter' className='sr-only'>
                  Filter by role
                </label>
                <select
                  id='admin-role-filter'
                  value={role}
                  onChange={(event) =>
                    updateParams({ role: event.target.value, page: null })
                  }
                  className={selectClass}
                >
                  {ROLE_OPTIONS.map((option) => (
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

              <div className='relative sm:w-44'>
                <label htmlFor='admin-verified-filter' className='sr-only'>
                  Filter by verification
                </label>
                <select
                  id='admin-verified-filter'
                  value={verified}
                  onChange={(event) =>
                    updateParams({ verified: event.target.value, page: null })
                  }
                  className={selectClass}
                >
                  {VERIFIED_OPTIONS.map((option) => (
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

              {hasFilters ? (
                <Button
                  type='button'
                  variant='ghost'
                  onClick={clearFilters}
                  className='shrink-0 rounded-full'
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </CardHeader>

          <CardContent className='p-0 pb-2'>
            {state === 'error' ? (
              <div className='p-5'>
                <DashboardErrorCard
                  message={errorMessage || "We couldn't load the user list."}
                  onRetry={load}
                />
              </div>
            ) : (
              <UsersTable
                rows={result?.users ?? []}
                loading={loading}
                currentUserId={currentUserId}
                updatingId={updatingId}
                hasFilters={hasFilters}
                onClearFilters={clearFilters}
                onChangeRole={changeRole}
                blockedReason={blockedReason}
              />
            )}

            <div className='flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <p className='text-xs text-muted-foreground'>
                {loading
                  ? 'Loading…'
                  : total === 0
                    ? 'No users to show'
                    : `Showing ${from.toLocaleString(
                        'en-US'
                      )}–${to.toLocaleString('en-US')} of ${total.toLocaleString(
                        'en-US'
                      )}`}
              </p>

              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    updateParams({ page: String(Math.max(1, page - 1)) })
                  }
                  disabled={loading || page <= 1}
                >
                  <ChevronLeft className='h-4 w-4' aria-hidden />
                  Previous
                </Button>
                <span
                  className={cn(
                    'min-w-[5.5rem] text-center text-xs tabular-nums text-muted-foreground'
                  )}
                >
                  Page {page} of {totalPages}
                </span>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    updateParams({ page: String(Math.min(totalPages, page + 1)) })
                  }
                  disabled={loading || page >= totalPages}
                >
                  Next
                  <ChevronRight className='h-4 w-4' aria-hidden />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}

export default function UsersPage() {
  return (
    <React.Suspense
      fallback={
        <div role='status' aria-label='Loading users'>
          <div className='h-8 w-40 animate-pulse rounded bg-accent' />
          <div className='mt-2 h-4 w-64 animate-pulse rounded bg-accent' />
          <div className='mt-6 h-[440px] w-full animate-pulse rounded-2xl bg-card' />
        </div>
      }
    >
      <UsersPageContent />
    </React.Suspense>
  )
}

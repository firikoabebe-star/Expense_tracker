'use client'

import * as React from 'react'
import {
  CheckCircle2,
  SearchX,
  ShieldCheck,
  ShieldOff,
  XCircle,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '/components/ui/alert-dialog'
import { Button } from '/components/ui/button'
import { cn } from '/lib/utils'

import { formatDateValue, initialsOf } from './format'
import type { AdminUserRow } from './types'

const COLUMNS = 7

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === 'admin'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        isAdmin
          ? 'bg-primary text-primary-foreground'
          : 'bg-accent text-muted-foreground'
      )}
    >
      {role}
    </span>
  )
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  const Icon = verified ? CheckCircle2 : XCircle
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium',
        verified ? 'text-success' : 'text-muted-foreground'
      )}
    >
      <Icon className='h-3 w-3' aria-hidden />
      {verified ? 'Verified' : 'Unverified'}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className='border-b border-border last:border-0'>
      <td className='px-4 py-3'>
        <div className='flex items-center gap-3'>
          <div className='h-9 w-9 animate-pulse rounded-full bg-accent' />
          <div className='space-y-1.5'>
            <div className='h-3.5 w-32 animate-pulse rounded bg-accent' />
            <div className='h-3 w-44 animate-pulse rounded bg-accent' />
          </div>
        </div>
      </td>
      {[1, 2, 3, 4, 5, 6].map((cell) => (
        <td key={cell} className='px-4 py-3'>
          <div className='h-3.5 w-16 animate-pulse rounded bg-accent' />
        </td>
      ))}
    </tr>
  )
}

interface UsersTableProps {
  rows: AdminUserRow[]
  loading: boolean
  currentUserId?: string | null
  updatingId: string | null
  hasFilters: boolean
  onClearFilters: () => void
  onChangeRole: (row: AdminUserRow, nextRole: 'admin' | 'user') => void
  /** Reason the role action is blocked for this row, if any. */
  blockedReason: (row: AdminUserRow) => string | null
}

export function UsersTable({
  rows,
  loading,
  currentUserId,
  updatingId,
  hasFilters,
  onClearFilters,
  onChangeRole,
  blockedReason,
}: UsersTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[880px] border-collapse text-left'>
        <thead>
          <tr className='border-b border-border bg-accent/60'>
            <th
              scope='col'
              className='px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            >
              User
            </th>
            <th
              scope='col'
              className='px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            >
              Role
            </th>
            <th
              scope='col'
              className='px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            >
              Verified
            </th>
            <th
              scope='col'
              className='px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            >
              Budgets
            </th>
            <th
              scope='col'
              className='px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            >
              Expenses
            </th>
            <th
              scope='col'
              className='px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            >
              Joined
            </th>
            <th
              scope='col'
              className='px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground'
            >
              <span className='sr-only'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((row) => <SkeletonRow key={row} />)
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS} className='px-4 py-16'>
                <div className='flex flex-col items-center justify-center gap-2 text-center'>
                  <SearchX
                    className='h-8 w-8 text-muted-foreground'
                    aria-hidden
                  />
                  <p className='text-sm font-medium text-foreground'>
                    {hasFilters ? 'No users match these filters' : 'No users yet'}
                  </p>
                  <p className='max-w-[20rem] text-xs text-muted-foreground'>
                    {hasFilters
                      ? 'Try a different search term, role or verification status.'
                      : 'Accounts will appear here as people sign up.'}
                  </p>
                  {hasFilters ? (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='mt-2'
                      onClick={onClearFilters}
                    >
                      Clear filters
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const isSelf = !!currentUserId && row.id === currentUserId
              const nextRole = row.role === 'admin' ? 'user' : 'admin'
              const blocked = isSelf ? null : blockedReason(row)
              const pending = updatingId === row.id

              return (
                <tr
                  key={row.id}
                  className='border-b border-border transition-colors last:border-0 hover:bg-accent/40'
                >
                  <td className='px-4 py-3'>
                    <div className='flex min-w-0 items-center gap-3'>
                      <span
                        aria-hidden
                        className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary'
                      >
                        {initialsOf(row.name, row.email)}
                      </span>
                      <div className='min-w-0'>
                        <p
                          className='truncate text-sm font-medium text-foreground'
                          title={row.name}
                        >
                          {row.name || 'Unnamed user'}
                        </p>
                        <p
                          className='truncate text-xs text-muted-foreground'
                          title={row.email}
                        >
                          {row.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <RoleBadge role={row.role} />
                  </td>
                  <td className='px-4 py-3'>
                    <VerifiedBadge verified={row.emailVerified} />
                  </td>
                  <td className='px-4 py-3 text-right text-sm tabular-nums text-foreground'>
                    {row.budgetCount.toLocaleString('en-US')}
                  </td>
                  <td className='px-4 py-3 text-right text-sm tabular-nums text-foreground'>
                    {row.expenseCount.toLocaleString('en-US')}
                  </td>
                  <td className='px-4 py-3 text-sm tabular-nums text-muted-foreground'>
                    {formatDateValue(row.createdAt)}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex justify-end'>
                      {isSelf ? (
                        <span className='text-xs text-muted-foreground'>
                          You
                        </span>
                      ) : blocked ? (
                        <span
                          title={blocked}
                          className='inline-flex cursor-not-allowed'
                        >
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            disabled
                            className='cursor-not-allowed gap-1.5'
                          >
                            {nextRole === 'admin' ? (
                              <ShieldCheck
                                className='h-3.5 w-3.5 text-primary'
                                aria-hidden
                              />
                            ) : (
                              <ShieldOff
                                className='h-3.5 w-3.5 text-warning'
                                aria-hidden
                              />
                            )}
                            {nextRole === 'admin' ? 'Promote' : 'Demote'}
                          </Button>
                        </span>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              disabled={pending}
                              className='gap-1.5'
                            >
                              {nextRole === 'admin' ? (
                                <ShieldCheck
                                  className='h-3.5 w-3.5 text-primary'
                                  aria-hidden
                                />
                              ) : (
                                <ShieldOff
                                  className='h-3.5 w-3.5 text-warning'
                                  aria-hidden
                                />
                              )}
                              {nextRole === 'admin' ? 'Promote' : 'Demote'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className='rounded-2xl border-border bg-card'>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {nextRole === 'admin'
                                  ? 'Promote to admin?'
                                  : 'Demote to user?'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {nextRole === 'admin'
                                  ? `${row.name || row.email} will gain full access to this admin area.`
                                  : `${row.name || row.email} will lose access to this admin area.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onChangeRole(row, nextRole)}
                              >
                                {nextRole === 'admin' ? 'Promote' : 'Demote'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import * as React from 'react'
import { ShieldCheck } from 'lucide-react'

import DashboardHeader from '../dashboard/_components/DashboardHeader'
import { ADMIN_NAV_ITEMS } from './_components/nav'

/**
 * Admin shell. It renders the exact same sticky header, top pill navigation
 * and max-w-7xl container as the customer dashboard, with the admin
 * destinations swapped in and an "Admin" badge next to the wordmark.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <DashboardHeader
        navItems={ADMIN_NAV_ITEMS}
        badge={
          <span className='inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-[11px]'>
            <ShieldCheck className='h-3 w-3' aria-hidden />
            Admin
          </span>
        }
      />

      <main className='mx-auto w-full max-w-7xl p-6'>{children}</main>
    </div>
  )
}

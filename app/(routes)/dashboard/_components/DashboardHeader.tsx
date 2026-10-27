"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CircleHelp, LogOut, Menu, Settings, ShieldCheck } from 'lucide-react'

import { authClient } from '/lib/auth-client'
import { ModeToggle } from '/components/ModeToggle'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '/components/ui/sheet'
import { cn } from '/lib/utils'
import {
  DASHBOARD_NAV_ITEMS,
  isDashboardNavItemActive,
  topNavActiveClass,
  topNavIconButtonClass,
  topNavInactiveClass,
  type DashboardNavItem,
} from './nav'
import { DashboardSearch } from './DashboardSearch'
import { NotificationBell } from './NotificationBell'
import { UserMenu } from './UserMenu'

interface DashboardHeaderProps {
  /**
   * Override the primary destinations. Defaults to the customer dashboard nav
   * so the admin layout can keep rendering this header unchanged.
   */
  navItems?: DashboardNavItem[]
}

function Brand({
  onClick,
  showName = false,
}: {
  onClick?: () => void
  /** Drawer has room for the wordmark even on narrow viewports. */
  showName?: boolean
}) {
  return (
    <Link
      href='/dashboard'
      onClick={onClick}
      aria-label='Montra dashboard'
      className='flex shrink-0 items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    >
      <span
        aria-hidden
        className='flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground'
      >
        M
      </span>
      <span
        className={cn(
          'text-base font-semibold tracking-tight text-foreground',
          showName ? 'block' : 'hidden sm:block'
        )}
      >
        Montra
      </span>
    </Link>
  )
}

function MobileNav({ navItems }: { navItems: DashboardNavItem[] }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type='button'
          className={cn(topNavIconButtonClass, 'lg:hidden')}
          aria-label='Open navigation'
        >
          <Menu className='h-[18px] w-[18px]' aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-[min(18rem,85vw)] border-r border-border bg-background p-5'
      >
        <SheetHeader className='space-y-1'>
          <SheetTitle className='text-left'>
            <Brand showName />
          </SheetTitle>
          <SheetDescription>Quick navigation links</SheetDescription>
        </SheetHeader>

        <nav aria-label='Dashboard' className='mt-6 flex flex-col gap-1'>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isDashboardNavItemActive(pathname, item.path)
            return (
              <SheetClose asChild key={item.path}>
                <Link
                  href={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active ? topNavActiveClass : topNavInactiveClass
                  )}
                >
                  <Icon className='h-4 w-4 shrink-0' aria-hidden />
                  {item.name}
                </Link>
              </SheetClose>
            )
          })}
        </nav>

        <div className='mt-6 border-t border-border pt-4'>
          <SheetClose asChild>
            <button
              type='button'
              onClick={() => authClient.signOut().then(() => router.push('/'))}
              className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <LogOut className='h-4 w-4 shrink-0' aria-hidden />
              Sign out
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DashboardHeader({ navItems = DASHBOARD_NAV_ITEMS }: DashboardHeaderProps) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const user = session?.user
  const isAdmin =
    (user as Record<string, unknown> | undefined)?.role === 'admin'

  const searchItems = React.useMemo<DashboardNavItem[]>(() => {
    const items = [...navItems]
    if (isAdmin) {
      items.push({ name: 'Admin', path: '/admin', icon: ShieldCheck })
    }
    items.push({ name: 'Settings', path: '/dashboard/settings', icon: Settings })
    return items
  }, [navItems, isAdmin])

  return (
    <header className='sticky top-0 z-40 border-b border-border bg-background'>
      <div className='mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]'>
        <div className='flex min-w-0 items-center gap-2 lg:justify-self-start'>
          <MobileNav navItems={navItems} />
          <Brand />
        </div>

        <nav
          aria-label='Primary'
          className='hidden items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm lg:flex lg:justify-self-center'
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isDashboardNavItemActive(pathname, item.path)
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active ? topNavActiveClass : topNavInactiveClass
                )}
              >
                {active ? (
                  <Icon className='h-4 w-4 shrink-0' aria-hidden />
                ) : null}
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className='ml-auto flex items-center gap-0.5 sm:gap-1 lg:ml-0 lg:justify-self-end'>
          <DashboardSearch items={searchItems} />
          <ModeToggle />
          <NotificationBell />
          <Link
            href='/help'
            className={topNavIconButtonClass}
            aria-label='Help and support'
            title='Help'
          >
            <CircleHelp className='h-[18px] w-[18px]' aria-hidden />
          </Link>
          <UserMenu
            name={user?.name}
            email={user?.email}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader

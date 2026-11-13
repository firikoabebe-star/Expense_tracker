import type { LucideIcon } from 'lucide-react'
import { BarChart3, FileText, LayoutGrid, PiggyBank, ReceiptText, Settings } from 'lucide-react'

export interface DashboardNavItem {
  name: string
  path: string
  icon: LucideIcon
}

/**
 * Primary customer navigation, shared by the desktop pill nav, the mobile
 * drawer, the search palette and the legacy admin sidebar so every surface
 * points at the same destinations.
 */
export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
  { name: 'Budgets', path: '/dashboard/budgets', icon: PiggyBank },
  { name: 'Expenses', path: '/dashboard/expenses', icon: ReceiptText },
  { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Reports', path: '/dashboard/reports', icon: FileText },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
]

/** Section roots only match themselves; nested routes match their own path. */
const NAV_ROOT_PATHS = new Set(['/dashboard', '/admin'])

export function isDashboardNavItemActive(
  pathname: string | null | undefined,
  path: string
): boolean {
  if (!pathname) return false
  if (NAV_ROOT_PATHS.has(path)) return pathname === path
  return pathname === path || pathname.startsWith(`${path}/`)
}

/** Shared shape for the round icon buttons in the top bar. */
export const topNavIconButtonClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/** Active destination in the top bar: a filled pill with its icon. */
export const topNavActiveClass =
  'bg-foreground text-background shadow-sm hover:bg-foreground hover:text-background'

/** Inactive destination: plain text with a hover pill. */
export const topNavInactiveClass =
  'text-muted-foreground hover:bg-accent hover:text-foreground'

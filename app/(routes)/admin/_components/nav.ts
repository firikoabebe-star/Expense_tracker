import {
  Activity,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'

import type { DashboardNavItem } from '../../dashboard/_components/nav'

/**
 * Admin destinations rendered in the same top pill navigation as the customer
 * dashboard. The last item hands the user back to their own workspace.
 */
export const ADMIN_NAV_ITEMS: DashboardNavItem[] = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Activity', path: '/admin/activity', icon: Activity },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
]


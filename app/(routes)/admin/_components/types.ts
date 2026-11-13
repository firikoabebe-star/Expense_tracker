/** Date ranges supported by the admin overview action. */
export type AdminRange = '7d' | '30d' | '6m' | '12m'

export interface Metric {
  current: number
  previous: number
  /** Percent change against the previous period, null when there is no base. */
  change: number | null
}

export interface AdminOverview {
  range: AdminRange
  totals: {
    users: Metric
    newUsers: Metric
    budgets: Metric
    expenses: Metric
    totalSpent: Metric
    activeUsers: Metric
  }
  sparklines: {
    users: number[]
    expenses: number[]
    spent: number[]
  }
  signupsSeries: { key: string; count: number }[]
  expensesTotalSeries: { key: string; total: number }[]
  /** Ratio between 0 and 1. */
  verifiedRate: number
  roleSplit: { admins: number; users: number }
  signupSources: { google: number; email: number }
}

export interface TopUser {
  name: string
  email: string
  expenseCount: number
  total: number
}

export interface ActivityItem {
  id: number
  name: string
  amount: string
  createdAt: string
  expenseDate: string
  date: string
  budgetName: string
  budgetId: number | null
  userName: string
  userEmail: string
  type: string
}

export interface AdminUserRow {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: string
  createdAt: Date | string
  budgetCount: number
  expenseCount: number
}

export type UsersPageResult =
  | {
      ok: true
      data: {
        users: AdminUserRow[]
        total: number
        page: number
        pageSize: number
        totalPages: number
      }
    }
  | { ok: false; message: string }

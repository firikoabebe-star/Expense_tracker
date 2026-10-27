import Link from 'next/link'
import {
  BarChart3,
  ChevronRight,
  FileText,
  PiggyBank,
  ReceiptText,
} from 'lucide-react'

import { Card } from '/components/ui/card'
import { cn } from '/lib/utils'

const LINKS = [
  { href: '/dashboard/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/dashboard/expenses', label: 'Expenses', icon: ReceiptText },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
]

/** Shortcut list for the pieces of the dashboard used most often. */
export function QuickLinksCard({ className }: { className?: string }) {
  return (
    <Card className={cn('border-border bg-card p-5 shadow-sm', className)}>
      <h2 className='text-base font-semibold text-foreground'>Quick links</h2>
      <p className='mt-1 text-sm text-muted-foreground'>
        Jump to the rest of your workspace.
      </p>

      <ul className='mt-4 grid gap-2 sm:grid-cols-2'>
        {LINKS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className='group flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary group-hover:bg-card'>
                <Icon className='h-4 w-4' aria-hidden />
              </span>
              <span className='min-w-0 flex-1 truncate'>{label}</span>
              <ChevronRight
                className='h-4 w-4 shrink-0 text-muted-foreground'
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '/components/ui/dropdown-menu'
import { authClient } from '/lib/auth-client'

interface UserMenuProps {
  name?: string | null
  email?: string | null
  isAdmin?: boolean
}

function getInitials(name?: string | null, email?: string | null): string {
  const source = (name ?? '').trim() || (email ?? '').trim()
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  const initials = parts
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join('')
  return initials ? initials.toLocaleUpperCase() : 'M'
}

const menuItemClass =
  'rounded-xl px-2 py-2 text-sm text-foreground focus:bg-accent focus:text-foreground'

/**
 * Account dropdown: identity, the account/admin switch, settings and sign out.
 * Unlike the old flat bar it keeps the same sign-out behaviour.
 */
export function UserMenu({ name, email, isAdmin }: UserMenuProps) {
  const router = useRouter()
  const displayName = (name ?? '').trim() || 'Montra member'
  const displayEmail = (email ?? '').trim() || 'Signed in'

  const handleSignOut = () => {
    authClient.signOut().then(() => router.push('/'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label='Account menu'
          className='ml-1 flex items-center gap-2 rounded-full border border-border bg-card p-1 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:pr-2'
        >
          <span
            aria-hidden
            className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background'
          >
            {getInitials(name, email)}
          </span>
          <span className='hidden max-w-[8rem] truncate text-sm font-medium text-foreground md:block'>
            {displayName}
          </span>
          <ChevronDown
            aria-hidden
            className='hidden h-4 w-4 shrink-0 text-muted-foreground md:block'
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='w-64 rounded-2xl border-border bg-card p-2 shadow-lg'
      >
        <DropdownMenuLabel className='px-2 py-1.5 font-normal'>
          <span className='block truncate text-sm font-semibold text-foreground'>
            {displayName}
          </span>
          <span className='mt-0.5 block truncate text-xs text-muted-foreground'>
            {displayEmail}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='my-1 bg-border' />

        {isAdmin ? (
          <DropdownMenuItem asChild className={menuItemClass}>
            <Link href='/admin'>
              <ShieldCheck aria-hidden />
              Admin dashboard
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild className={menuItemClass}>
            <Link href='/dashboard/settings'>
              <UserRound aria-hidden />
              My Account
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild className={menuItemClass}>
          <Link href='/dashboard/settings'>
            <Settings aria-hidden />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className='my-1 bg-border' />

        <DropdownMenuItem
          onSelect={handleSignOut}
          className='rounded-xl px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive'
        >
          <LogOut aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

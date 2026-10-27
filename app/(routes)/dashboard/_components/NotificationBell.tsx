"use client"

import * as React from 'react'
import { Bell } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '/components/ui/dropdown-menu'
import { cn } from '/lib/utils'
import { topNavIconButtonClass } from './nav'

/**
 * Notification bell for the top bar. The badge marks unread activity and
 * clears once the menu has been opened.
 */
export function NotificationBell() {
  const [hasUnread, setHasUnread] = React.useState(true)

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) setHasUnread(false)
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className={cn(topNavIconButtonClass, 'relative')}
          aria-label={hasUnread ? 'Notifications, unread' : 'Notifications'}
          title='Notifications'
        >
          <Bell className='h-[18px] w-[18px]' aria-hidden />
          {hasUnread ? (
            <span
              aria-hidden
              className='absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background'
            />
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='w-72 rounded-2xl border-border bg-card p-2 shadow-lg'
      >
        <DropdownMenuLabel className='px-2 py-1.5 text-sm font-semibold text-foreground'>
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='my-1 bg-border' />
        <div className='px-2 py-6 text-center'>
          <p className='text-sm font-medium text-foreground'>
            You&apos;re all caught up
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Budget alerts and reminders will show up here.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

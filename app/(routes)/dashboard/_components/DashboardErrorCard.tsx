"use client"

import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '/components/ui/button'
import { cn } from '/lib/utils'

interface DashboardErrorCardProps {
  message: string
  onRetry: () => void
  retrying?: boolean
  className?: string
}

/**
 * Small inline error shown when a dashboard action fails. It never replaces
 * the whole page — the rest of the dashboard keeps working.
 */
export function DashboardErrorCard({
  message,
  onRetry,
  retrying,
  className,
}: DashboardErrorCardProps) {
  return (
    <div
      role='alert'
      className={cn(
        'flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className='flex min-w-0 items-start gap-2'>
        <AlertCircle
          className='mt-0.5 h-4 w-4 shrink-0 text-destructive'
          aria-hidden
        />
        <p className='text-sm text-muted-foreground'>{message}</p>
      </div>
      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={onRetry}
        disabled={retrying}
        className='shrink-0'
      >
        <RefreshCw
          className={cn('h-4 w-4', retrying && 'animate-spin')}
          aria-hidden
        />
        {retrying ? 'Retrying…' : 'Retry'}
      </Button>
    </div>
  )
}

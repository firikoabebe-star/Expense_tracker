"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '/components/ui/dialog'
import { topNavIconButtonClass, type DashboardNavItem } from './nav'

interface DashboardSearchProps {
  items: DashboardNavItem[]
}

/**
 * Search icon in the top bar. There is no global expense search endpoint yet,
 * so this is an honest quick-jump palette over the dashboard destinations
 * instead of a field that silently returns nothing.
 */
export function DashboardSearch({ items }: DashboardSearchProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const results = React.useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return items
    return items.filter((item) => item.name.toLowerCase().includes(term))
  }, [items, query])

  const go = (path: string) => {
    setOpen(false)
    setQuery('')
    router.push(path)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery('')
      }}
    >
      <DialogTrigger asChild>
        <button
          type='button'
          className={topNavIconButtonClass}
          aria-label='Search dashboard'
          title='Search'
        >
          <Search className='h-[18px] w-[18px]' aria-hidden />
        </button>
      </DialogTrigger>
      <DialogContent className='gap-0 overflow-hidden rounded-2xl border-border bg-card p-0 shadow-xl sm:max-w-md'>
        <DialogTitle className='sr-only'>Search dashboard</DialogTitle>
        <DialogDescription className='sr-only'>
          Jump to a page in your dashboard.
        </DialogDescription>
        <div className='flex items-center gap-2 border-b border-border px-4'>
          <Search
            className='h-4 w-4 shrink-0 text-muted-foreground'
            aria-hidden
          />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Where do you want to go?'
            aria-label='Search pages'
            className='h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground'
          />
        </div>
        <div className='max-h-72 overflow-y-auto p-2'>
          {results.length > 0 ? (
            results.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  type='button'
                  onClick={() => go(item.path)}
                  className='flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                >
                  <Icon
                    className='h-4 w-4 shrink-0 text-muted-foreground'
                    aria-hidden
                  />
                  {item.name}
                </button>
              )
            })
          ) : (
            <p className='px-3 py-6 text-center text-sm text-muted-foreground'>
              No pages match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

import React from 'react'
import { cn } from '/lib/utils'

interface ExpenseTableSkeletonProps {
  rows?: number;
  className?: string;
}

/**
 * Placeholder for the expense table (Name / Amount / Date / Action).
 * Uses the same animate-pulse block pattern as the other dashboard skeletons.
 */
function ExpenseTableSkeleton({ rows = 5, className }: ExpenseTableSkeletonProps) {
  return (
    <div className={cn('w-full', className)} role="status" aria-label="Loading expenses">
      <div className='grid grid-cols-4 gap-3 bg-accent p-2 rounded-t-md'>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className='h-4 w-16 max-w-full bg-card rounded animate-pulse' />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className='grid grid-cols-4 gap-3 border-b border-border p-2'>
          <div className='h-4 w-full max-w-[140px] bg-accent rounded animate-pulse' />
          <div className='h-4 w-16 max-w-full bg-accent rounded animate-pulse' />
          <div className='h-4 w-20 max-w-full bg-accent rounded animate-pulse' />
          <div className='h-4 w-4 bg-accent rounded animate-pulse' />
        </div>
      ))}
    </div>
  )
}

export default ExpenseTableSkeleton

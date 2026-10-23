import React from 'react'
import Link from "next/link";
import type { BudgetSummary } from '/types';
import { formatCompactCurrency, formatCurrency } from '/lib/utils';

interface BudgetItemProps {
  budget: BudgetSummary;
}

function getHealthColor(perc: number): string {
  if (perc > 90) return 'bg-red-500';
  if (perc >= 70) return 'bg-yellow-500';
  return 'bg-primary';
}

function Budgetitem({budget}: BudgetItemProps) {

  const calculateProgressPerc = () => {
  if (!budget?.amount || Number(budget.amount) <= 0) return 0;
  const perc = (budget.totalSpend / Number(budget.amount)) * 100;
  return Math.min(100, perc);
};

  const pct = calculateProgressPerc();
  const barColor = getHealthColor(pct);
  const totalSpend = budget?.totalSpend ? budget.totalSpend : 0;
  const remaining = Math.max(0, Number(budget.amount) - (budget.totalSpend || 0));

  return (
    <Link href={'/dashboard/expenses/'+budget?.id} className='block h-full min-w-0 overflow-hidden'>
      <div className='p-5 border border-border bg-card rounded-lg hover:shadow-md cursor-pointer h-full min-h-[170px] min-w-0 overflow-hidden'>
      <div className='flex gap-2 items-center justify-between min-w-0'>
        <div className='flex gap-2 items-center min-w-0 flex-1'>
            <h2 className='text-2xl p-3 px-4
            bg-accent rounded-full shrink-0'>
                {budget?.icon}</h2>
                <div className='min-w-0'>
                    <h2 className='font-bold truncate' title={budget?.name}>{budget?.name}</h2>
                    <h2 className='text-sm text-muted-foreground truncate' title={`${budget?.totalItem} Item`}>{budget?.totalItem} Item</h2>
                </div>
        </div>
        <h2 className='font-bold text-primary text-lg text-right shrink-0 truncate'
          title={formatCurrency(budget?.amount)}>{formatCompactCurrency(budget?.amount)}</h2>
        </div>
        <div className='mt-5 min-w-0'>
            <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-3'>
             <h2 className='text-xs text-muted-foreground min-w-0 truncate'
               title={`${formatCurrency(totalSpend)} Spend`}>
             {formatCompactCurrency(totalSpend)} Spend</h2>
             <h2 className='text-xs text-muted-foreground min-w-0 truncate'
               title={`${formatCurrency(remaining)} Remaining`}>
             {formatCompactCurrency(remaining)} Remaining</h2>
            </div>
            <div className='flex items-center gap-2 min-w-0'>
              <div className='w-full min-w-0 bg-accent h-2 rounded-full'>
                <div className={`${barColor} h-2 rounded-full transition-colors`}
                style={{
                  width:`${pct}%`
                }}>
                </div>
              </div>
              <span className='text-xs text-muted-foreground whitespace-nowrap shrink-0'>{pct.toFixed(0)}%</span>
            </div>
        </div>
        </div>
    </Link>
  )  
}

export default Budgetitem

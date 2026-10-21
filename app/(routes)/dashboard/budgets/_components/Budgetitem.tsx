import React from 'react'
import Link from "next/link";
import type { BudgetSummary } from '/types';
import { formatCurrency } from '/lib/utils';

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

  return (
    <Link href={'/dashboard/expenses/'+budget?.id} >
      <div className='p-5 border border-border bg-card rounded-lg hover:shadow-md cursor-pointer h-[170px] '>
      <div className='flex gap-2 items-center justify-between'>
        <div className='flex gap-2 items-center'>
            <h2 className='text-2xl p-3 px-4
            bg-accent rounded-full'>
                {budget?.icon}</h2>
                <div>
                    <h2 className='font-bold'>{budget?.name}</h2>
                    <h2 className='text-sm text-muted-foreground'>{budget?.totalItem} Item</h2>
                </div>
        </div>
        <h2 className='font-bold text-primary text-lg whitespace-nowrap 
  max-w-[120px] sm:max-w-[100px] xs:max-w-[80px]'>{formatCurrency(budget?.amount)}</h2>
        </div>
        <div className='mt-5'>
            <div className='flex items-center justify-between mb-3'>
             <h2 className='text-xs text-muted-foreground'>
             {formatCurrency(budget?.totalSpend ? budget.totalSpend : 0)} Spend</h2>
             <h2 className='text-xs text-muted-foreground'>
             {formatCurrency(Math.max(0, Number(budget.amount) - (budget.totalSpend || 0)))} Remaining</h2>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-full bg-accent h-2 rounded-full'>
                <div className={`${barColor} h-2 rounded-full transition-colors`}
                style={{
                  width:`${pct}%`
                }}>
                </div>
              </div>
              <span className='text-xs text-muted-foreground whitespace-nowrap'>{pct.toFixed(0)}%</span>
            </div>
        </div>
        </div>
    </Link>
  )  
}

export default Budgetitem

import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useMemo } from 'react'
import type { BudgetSummary } from '/types'
import { formatCompactCurrency, formatCurrency } from '/lib/utils'

interface CardInfoProps {
  budgetList: BudgetSummary[];
}

function CardInfo({budgetList}: CardInfoProps) {

  const { totalBudget, totalSpend } = useMemo(() => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    if (budgetList) {
      budgetList.forEach((element) => {
        totalBudget_ = totalBudget_ + Number(element.amount);
        totalSpend_ = totalSpend_ + element.totalSpend;
      });
    }
    return { totalBudget: totalBudget_, totalSpend: totalSpend_ };
  }, [budgetList]);

  return (
    <div>
    {budgetList?.length>0?
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'> 
      
      <div className='p-7 border border-border bg-card rounded-lg flex items-center justify-between gap-3 min-w-0 overflow-hidden'>
        <div className='min-w-0'>
        <h2 className='text-sm truncate'>Total Budget</h2>
        <h2 className='font-bold text-2xl truncate' title={formatCurrency(totalBudget)}>{formatCompactCurrency(totalBudget)}</h2>
        </div>
        <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white shrink-0'/>
      </div>
      <div className='p-7 border border-border bg-card rounded-lg flex items-center justify-between gap-3 min-w-0 overflow-hidden'>
        <div className='min-w-0'>
        <h2 className='text-sm truncate'>Total Spending</h2>
        <h2 className='font-bold text-2xl truncate' title={formatCurrency(totalSpend)}>{formatCompactCurrency(totalSpend)}</h2>
        </div>
        <ReceiptText  className='bg-primary p-3 h-12 w-12 rounded-full text-white shrink-0'/>
      </div>
      <div className='p-7 border border-border bg-card rounded-lg flex items-center justify-between gap-3 min-w-0 overflow-hidden'>
        <div className='min-w-0'>
        <h2 className='text-sm truncate'>Total Budgets</h2>
        <h2 className='font-bold text-2xl truncate' title={String(budgetList?.length)}>{budgetList?.length}</h2>
        </div>
        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white shrink-0'/>
      </div>
     </div>
    :
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      {[1,2,3].map((item,index)=>(
        <div key={index} className='h-[110px] w-full bg-accent animate-pulse rounded-lg'>
        </div>
      ))}
    </div>
      }
    </div>
  )
}

export default CardInfo

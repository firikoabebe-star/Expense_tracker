"use client"
import React, { useEffect, useState } from 'react'
import { authClient } from '/lib/auth-client';
import { getFirstName } from '/lib/name';
import CardInfo from './_components/CardInfo'
import BarChartDashboard from './_components/BarChartDashboard'
import PieChartDashboard from './_components/PieChartDashboard'
import Budgetitem from './budgets/_components/Budgetitem'
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import ExpenseTableSkeleton from './_components/ExpenseTableSkeleton';
import type { BudgetSummary, ExpenseSummary } from '/types';
import { getBudgetList, getAllExpenses } from './actions';
import { toast } from 'sonner';

function page() {
  const [budgetList,setBudgetList]=useState<BudgetSummary[]>([]);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [expensesList,setExpensesList]=useState<ExpenseSummary[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
        user&&getBudgetListAction();
    },[user]) 

    const getBudgetListAction=async()=>{
      try {
        setLoading(true);
        const [result, expenses] = await Promise.all([getBudgetList(), getAllExpenses()]);
        setBudgetList(result);
        setExpensesList(expenses);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    
  return (
    <div className='p-6'>
      <h2 className='font-bold text-3xl'>Hi, {getFirstName(user?.name)}✌️</h2>
      <p className='text-muted-foreground'>Your money, simplified. Let's manage your expenses smarter.</p>

      <CardInfo budgetList={budgetList}/>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          {loading ? (
            <div className="h-[400px] bg-accent animate-pulse rounded-lg"></div>
          ) : (
            <BarChartDashboard budgetList={budgetList}/>
          )}
          {loading ? (
            <div className="mt-5 h-[400px] bg-accent animate-pulse rounded-lg"></div>
          ) : (
            <div className='mt-5'>
              <PieChartDashboard budgetList={budgetList}/>
            </div>
          )}
          {loading ? (
            <ExpenseTableSkeleton className="mt-3" />
          ) : (
            <ExpenseListTable
              expensesList={expensesList}
              refreshData={()=>getBudgetListAction()}/>
          )}
        </div>
        <div className='grid gap-5 content-start'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {loading ? (
            [1, 2, 3].map((item) => (
              <div key={item} className='h-[170px] w-full bg-accent rounded-lg animate-pulse' />
            ))
          ) : budgetList.length > 0 ? (
            budgetList.map((budget)=>(
              <Budgetitem budget={budget} key={budget.id}/>
            ))
          ) : (
            <p className='text-muted-foreground'>
              No budgets yet. Create one to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default page

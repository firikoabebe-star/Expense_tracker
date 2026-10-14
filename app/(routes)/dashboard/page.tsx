"use client"
import React, { useEffect, useState } from 'react'
import { authClient } from '/lib/auth-client';
import CardInfo from './_components/CardInfo'
import BarChartDashboard from './_components/BarChartDashboard'
import PieChartDashboard from './_components/PieChartDashboard'
import Budgetitem from './budgets/_components/Budgetitem'
import ExpenseListTable from './expenses/_components/ExpenseListTable';
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
      <h2 className='font-bold text-3xl'>Hi, {user?.name}✌️</h2>
      <p className='text-gray-500'>Your money, simplified. Let's manage your expenses smarter.</p>

      <CardInfo budgetList={budgetList}/>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          {loading ? (
            <div className="h-[400px] bg-slate-200 animate-pulse rounded-lg"></div>
          ) : (
            <BarChartDashboard budgetList={budgetList}/>
          )}
          {loading ? (
            <div className="mt-5 h-[400px] bg-slate-200 animate-pulse rounded-lg"></div>
          ) : (
            <div className='mt-5'>
              <PieChartDashboard budgetList={budgetList}/>
            </div>
          )}
          {loading ? (
            <div className="mt-3 h-[200px] bg-slate-200 animate-pulse rounded-lg"></div>
          ) : (
            <ExpenseListTable
              expensesList={expensesList}
              refreshData={()=>getBudgetListAction()}/>
          )}
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget)=>(
            <Budgetitem budget={budget} key={budget.id}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page

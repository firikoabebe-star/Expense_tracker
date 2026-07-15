"use client"
import React, { useEffect, useState } from 'react'
import { authClient } from '/lib/auth-client';
import CardInfo from './_components/CardInfo'
import BarChartDashboard from './_components/BarChartDashboard'
import Budgetitem from './budgets/_components/Budgetitem'
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import type { BudgetSummary, ExpenseSummary } from '/types';
import { getBudgetList, getAllExpenses } from './actions';

function page() {
  const [budgetList,setBudgetList]=useState<BudgetSummary[]>([]);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [expensesList,setExpensesList]=useState<ExpenseSummary[]>([]);

  useEffect(()=>{
        user&&getBudgetListAction();
    },[user]) 

    const getBudgetListAction=async()=>{
       const result=await getBudgetList();
       setBudgetList(result)
       const expenses=await getAllExpenses();
       setExpensesList(expenses);
    }
    
  return (
    <div className='p-8 dark:bg-[#1B1B1F]'>
      <h2 className='font-bold text-3xl'>Hi, {user?.name}✌️</h2>
      <p className='text-gray-500'>Your money, simplified. Let's manage your expenses smarter.</p>

      <CardInfo budgetList={budgetList}/>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <BarChartDashboard
          budgetList={budgetList}/>
          <ExpenseListTable
          expensesList={expensesList}
          refreshData={()=>getBudgetListAction()}/>
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget,index)=>(
            <Budgetitem budget={budget} key={index}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page

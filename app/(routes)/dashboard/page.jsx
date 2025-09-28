"use client"
import React, { useEffect, useState } from 'react'
import {UserButton, useUser} from '@clerk/nextjs';
import CardInfo from './_components/CardInfo'
import BarChartDashboard from './_components/BarChartDashboard'
import { db } from '../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
function page() {
  const [budgetList,setBudgetList]=useState([]);
  const {user}=useUser();
  useEffect(()=>{
        user&&getBudgetList();
    },[user]) 
    /**
     * Used to get budget list
     */
    const getBudgetList=async()=>{
       const result=await db.select({
         ...getTableColumns(Budgets),
          
         totalSpend:sql `sum(${Expenses.amount})` .mapWith(Number),
         totalItem:sql `count(${Expenses.id})` .mapWith(Number)
       }).from(Budgets)
       .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
       .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
       .groupBy(Budgets.id)
       .orderBy(desc(Budgets.id))
       ;
       setBudgetList(result)
       
    }
  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hi, {user?.firstName}✌️</h2>
      <p className='text-gray-500'>Here's what's happenning with your money, Lets manage your expense</p>

      <CardInfo budgetList={budgetList}/>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6'>
        <div className='md:col-span-2'>
          <BarChartDashboard
          budgetList={budgetList}/>
        </div>
        <div>
          Other Content
        </div>
      </div>
    </div>
  )
}

export default page

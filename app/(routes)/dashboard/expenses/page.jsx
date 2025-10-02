"use client"
import { ArrowLeft, Router, Trash } from 'lucide-react'
import React, { useState ,useEffect} from 'react'
import { db } from '/utils/dbConfig'
import { Expenses } from '/utils/schema'
import { eq,desc } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs';
import { Budgets } from '/utils/schema'
import { Button } from '/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
function ExpenseList() {
const [expensesList,setExpensesList]=useState([]);
const {user}=useUser();
const router=useRouter();
  useEffect(()=>{
        user&&getAllExpenses();
    },[user])
/**
     * Used to get All Expenses that belong to users
     */
    const getAllExpenses=async()=>{
      const result=await db.select({
        id:Expenses.id,
        name:Expenses.name,
        amount:Expenses.amount,
        createdAt:Expenses.createdAt
      }).from(Budgets)
      .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
    .orderBy(desc(Expenses.id));
    setExpensesList(result);
   
    }
    const deleteExpense=async(expense)=>{
        const result=await db.delete(Expenses)
        .where(eq(Expenses.id,expense.id))
        .returning();
        if(result){
            toast('Expense Deleted!');
            getAllExpenses();
     }
    }
  return (
    <div className=' p-5 dark:bg-[#1B1B1F] h-screen'>
      <h2 className='font-bold text-lg mb-2 flex gap-2 items-center '><Button className="dark:hover:bg-[#05766c] hover:bg-[#05766c]" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>Latest Expenses</h2>
      <div className='grid grid-cols-4 bg-slate-200 dark:bg-black p-2'>
        <h2 className='font-bold'>Name</h2>
        <h2 className='font-bold'>Amount</h2>
        <h2 className='font-bold'>Date</h2>
        <h2 className='font-bold'>Action</h2>
      </div>
      {expensesList.map((expenses,index) => (
        <div key={index} className='grid grid-cols-4 bg-slate-50 dark:bg-inherit p-2 dark:bg-[#26262e] dark:hover:shadow-[0_1px_1px_white]'>
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2>
            <Trash className=' hover:text-red-700 text-red-500 cursor pointer' 
            onClick={()=>deleteExpense(expenses)}/>
          </h2>
        </div>
      ))}
    </div>
  )
}

export default ExpenseList

"use client"
import { ArrowLeft, Trash } from 'lucide-react'
import React, { useState ,useEffect} from 'react'
import { authClient } from '/lib/auth-client';
import { Button } from '/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { ExpenseSummary } from '/types'
import { getAllExpenses, deleteExpense } from '../actions';

function ExpenseList() {
const [expensesList,setExpensesList]=useState<ExpenseSummary[]>([]);
const { data: session } = authClient.useSession();
const user = session?.user;
const router=useRouter();
  useEffect(()=>{
        user&&getAllExpensesAction();
    },[user])

    const getAllExpensesAction=async()=>{
      const result=await getAllExpenses();
      setExpensesList(result);
    }

    const handleDeleteExpense=async(expense: { id: number })=>{
        const result=await deleteExpense(expense.id);
        if(result){
            toast('Expense Deleted!');
            getAllExpensesAction();
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
        <div key={index} className='grid grid-cols-4 bg-slate-50 dark:bg-inherit p-2 dark:bg-[#38383a] dark:hover:shadow-[0_1px_1px_white]'>
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2>
            <Trash className=' hover:text-red-700 text-red-500 cursor pointer' 
            onClick={()=>handleDeleteExpense(expenses)}/>
          </h2>
        </div>
      ))}
    </div>
  )
}

export default ExpenseList

"use client"
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import type { ExpenseSummary, RefreshData } from '/types'
import { deleteExpense } from '../../actions';

interface ExpenseListTableProps {
  expensesList: ExpenseSummary[];
  refreshData: RefreshData;
}

function ExpenseListTable({expensesList, refreshData}: ExpenseListTableProps) {
     const handleDeleteExpense=async(expense: { id: number })=>{
        const result=await deleteExpense(expense.id);
        if(result){
            toast('Expense Deleted!');
            refreshData()
     }
    }
  return (
    <div className='mt-3'>
      <h2 className='font-bold text-lg mb-2'>Latest Expenses</h2>
      <div className='grid grid-cols-4 bg-slate-200 dark:bg-inherit p-2'>
        <h2 className='font-bold'>Name</h2>
        <h2 className='font-bold'>Amount</h2>
        <h2 className='font-bold'>Date</h2>
        <h2 className='font-bold'>Action</h2>
      </div>
      {expensesList.map((expenses,index) => (
        <div key={index} className='grid grid-cols-4 bg-slate-50 dark:bg-inherit p-2 items-center gap-3 md:gap-4'>
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2>
            <Trash className=' hover:text-red-700 text-red-600 cursor pointer text-center' 
            onClick={()=>handleDeleteExpense(expenses)}/>
          </h2>
        </div>
      ))}
    </div>
  )
}

export default ExpenseListTable

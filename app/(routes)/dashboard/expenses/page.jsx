"use client"
import React, { useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable'
import { Button } from '../../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

function page() {
    const[expensesList,setExpensesList]=useState([]);
    /**
       * Get Latest Expenses
       */
      const getExpensesList=async()=>{
       const result=await db.select().from(Expenses)
       .where(eq(Expenses.budgetId,unwrappedParams.id))
       .orderBy(desc(Expenses.id))
       setExpensesList(result)
       console.log(result)
      }
      const router=useRouter();

      
  return (
    <div className='p-6'>
        <Button onClick={()=>router.back()}><ArrowLeft className="w-5 h-5" /></Button>
      <ExpenseListTable expensesList={expensesList}
         refreshData={()=>getBudgetInfo()} />
    </div>
  )
}

export default page

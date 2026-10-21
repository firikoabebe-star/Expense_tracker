"use client"
import React from 'react'
import BudgetList from './_components/BudgetList'
import { useRouter } from 'next/navigation'
import { Button } from '/components/ui/button';
import { ArrowLeft } from 'lucide-react';


function Budgets() {
  const router=useRouter();
  return (
    <div className='p-6'>
      <div className='flex gap-2 items-center'>
        <Button onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>
        <h2 className='font-bold text-3xl '>My Budgets</h2>
      </div>
      <BudgetList/>
    </div>
  )
}

export default Budgets

"use client"
import React from 'react'
import BudgetList from './_components/BudgetList'
import { useRouter } from 'next/navigation'
import { Button } from '/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../_components/PageHeader';


function Budgets() {
  const router=useRouter();
  return (
    <div>
      <PageHeader
        title='Budgets'
        subtitle='Plan what each part of your money is allowed to spend.'
        actions={
          <Button
            variant='outline'
            size='icon'
            onClick={() => router.back()}
            aria-label='Go back'
            title='Back'
          >
            <ArrowLeft className='w-4 h-4' />
          </Button>
        }
      />
      <BudgetList/>
    </div>
  )
}

export default Budgets

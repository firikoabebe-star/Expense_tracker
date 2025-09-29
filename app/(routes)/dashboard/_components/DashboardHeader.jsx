import { UserButton } from '@clerk/nextjs'
import React from 'react'
import {ModeToggle}  from "/components/ModeToggle"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "/components/ui/sheet"
import { Menu } from 'lucide-react'
import Link from 'next/link'
function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between items-center'>

      <div>
        <Sheet>
  <SheetTrigger>
    <Menu/>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Where are you headed?</SheetTitle>
      <SheetDescription>
        
      </SheetDescription>
    </SheetHeader>

    <div className="flex flex-col items-center gap-4">
     
      <Link  href='/dashboard'>Dashboard</Link>
      <Link  href='/dashboard/budgets'>Budget</Link>
      <Link  href='/dashboard/expenses'>Expense</Link>
      
    </div>
  </SheetContent>
</Sheet>
      </div>
      <div className='flex items-center gap-4'>  
        <ModeToggle/>
        <UserButton/>
      </div>
    </div>
  )
}

export default DashboardHeader

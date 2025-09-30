import { UserButton } from '@clerk/nextjs'
import React from 'react'
import {ModeToggle}  from "/components/ModeToggle"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "/components/ui/sheet"
import { Menu } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between items-center dark:bg-[#1B1B1F]'>

      <div>
      <Sheet>
        <SheetTrigger>
          <Menu className="cursor-pointer dark:hover:text-gray-400" />
        </SheetTrigger>

        <SheetContent side="left"
  className="
    w-64 
    data-[state=open]:animate-in 
    data-[state=open]:slide-in-from-left 
    data-[state=open]:duration-300 
    data-[state=open]:ease-out 
    data-[state=closed]:animate-out 
    data-[state=closed]:slide-out-to-left 
    data-[state=closed]:duration-300 
    data-[state=closed]:ease-in
  ">
          <SheetHeader>
            <SheetTitle>
              <h2 className='flex flex-col gap-6'>
              <Image src='/logoipsum-247.svg' alt='logo' width={50} height={50} /> 
               Where are you headed?
              </h2>
              </SheetTitle>
            <SheetDescription>
              Quick navigation links
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col items-start gap-4 mt-6">
            <SheetClose asChild>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/dashboard/budgets" className="hover:underline">
                Budget
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/dashboard/expenses" className="hover:underline">
                Expense
              </Link>
            </SheetClose>
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

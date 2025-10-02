"use client"
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { ModeToggle }  from "/components/ModeToggle"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "/components/ui/sheet"
import { Menu, LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from "next/navigation";

function DashboardHeader() {
  const pathname = usePathname();

  return (
    <div className=' p-5 shadow-sm border-b flex justify-between items-center dark:bg-[#1B1B1F]'>

      <div>
        <Sheet>
          <SheetTrigger>
            <Menu className="cursor-pointer dark:hover:text-gray-400 flex lg:hidden" />
          </SheetTrigger>

          <SheetContent
            side="left"
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
            "
          >
            <SheetHeader>
              <SheetTitle>
                <div className='flex flex-col gap-6'>
                  <Link href='/'><Image src='/logoipsum-247.svg' alt='logo' width={50} height={50} /></Link>
                  Where are you headed?
                </div>
              </SheetTitle>
              <SheetDescription>
                Quick navigation links
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col items-start gap-4 mt-6">
              <SheetClose asChild>
                <Link
                  href="/dashboard"
                  className={`hover:text-primary w-full p-3 px-10 rounded-sm  dark:hover:bg-green-100 hover:bg-green-100 flex items-center gap-2 ${
                    pathname === "/dashboard" ? 'text-primary bg-green-100 dark:text-primary dark:bg-green-100' : ""
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" /> Dashboard
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/dashboard/budgets"
                  className={` hover:text-primary w-full p-3 px-10 rounded-sm  dark:hover:bg-green-100 hover:bg-green-100 flex items-center gap-2 ${
                    pathname === "/dashboard/budgets" ? "text-primary bg-green-100 dark:text-primary dark:bg-green-100" : ""
                  }`}
                >
                  <PiggyBank className="w-5 h-5" /> Budget
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/dashboard/expenses"
                  className={`hover:text-primary w-full p-3 px-10 rounded-sm  dark:hover:bg-green-100 hover:bg-green-100 flex items-center gap-2 ${
                    pathname === "/dashboard/expenses" ? "text-primary bg-green-100 dark:text-primary dark:bg-green-100" : ""
                  }`}
                >
                  <ReceiptText className="w-5 h-5" /> Expenses
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

"use client"
import React from 'react'
import { authClient } from '/lib/auth-client'
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
import { Menu, LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from "next/navigation";

function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userRole = (user as Record<string, unknown> | undefined)?.role as string | undefined;

  return (
    <div className=' p-5 shadow-sm border-b border-border flex justify-between items-center bg-background'>

      <div>
        <Sheet>
          <SheetTrigger>
            <Menu className="cursor-pointer hover:text-primary flex lg:hidden" />
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
                  className={`hover:text-primary w-full p-3 px-10 rounded-sm hover:bg-accent flex items-center gap-2 ${
                    pathname === "/dashboard" ? 'text-primary bg-accent' : ""
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" /> Dashboard
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/dashboard/budgets"
                  className={` hover:text-primary w-full p-3 px-10 rounded-sm hover:bg-accent flex items-center gap-2 ${
                    pathname === "/dashboard/budgets" ? "text-primary bg-accent" : ""
                  }`}
                >
                  <PiggyBank className="w-5 h-5" /> Budget
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/dashboard/expenses"
                  className={`hover:text-primary w-full p-3 px-10 rounded-sm hover:bg-accent flex items-center gap-2 ${
                    pathname === "/dashboard/expenses" ? "text-primary bg-accent" : ""
                  }`}
                >
                  <ReceiptText className="w-5 h-5" /> Expenses
                </Link>
              </SheetClose>

              {userRole === 'admin' && (
                <SheetClose asChild>
                  <Link
                    href="/admin"
                    className={`hover:text-primary w-full p-3 px-10 rounded-sm hover:bg-accent flex items-center gap-2 ${
                      pathname === "/admin" || pathname.startsWith("/admin/") ? "text-primary bg-accent" : ""
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" /> Admin
                  </Link>
                </SheetClose>
              )}
              <SheetClose asChild>
                <Link
                  href="/dashboard/settings"
                  className={`hover:text-primary w-full p-3 px-10 rounded-sm hover:bg-accent flex items-center gap-2 ${
                    pathname === "/dashboard/settings" ? "text-primary bg-accent" : ""
                  }`}
                >
                  <Settings className="w-5 h-5" /> Settings
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className='flex items-center gap-4'>
        <ModeToggle/>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground hidden sm:block'>{user?.email}</span>
          <Link
            href='/dashboard/settings'
            className='p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
            title='Settings'
            aria-label='Settings'
          >
            <Settings className='w-4 h-4' />
          </Link>
          <button
            onClick={() => authClient.signOut().then(() => router.push('/'))}
            className='p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors'
            title="Sign out"
          >
            <LogOut className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader

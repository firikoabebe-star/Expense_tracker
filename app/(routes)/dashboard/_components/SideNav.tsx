'use client'
import { authClient } from '/lib/auth-client';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, LogOut } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

function SideNav() {
  const menuList = [    //objects inside 
    {
      id: 1,
      name: 'Dashboard',
      icon: LayoutGrid,
      path:'/dashboard',
    },
    {
      id: 2,
      name: 'Budget',
      icon: PiggyBank,
      path:'/dashboard/budgets',
    },
    {
      id: 3,
      name: 'Expenses',
      icon: ReceiptText, // Corrected spelling
      path:'/dashboard/expenses',
    },

  ];
  const path=usePathname();
  const router = useRouter();
  useEffect(()=>{
    console.log(path)
  }),[path]
  return (
    <div className='h-screen p-5 border shadow-sm dark:bg-[#1B1B1F]'>
     <Link href='/'> <Image src='/logoipsum-247.svg' alt='logo' height={50} width={50} /></Link>   
      <div className='mt-5'>
        {menuList.map((menu) => {
          const IconComponent = menu.icon;
          return (
            <Link href={menu.path} className={`flex gap-2 items-center text-gray-500 font-md p-5 cursor-pointer rounded-md hover:text-primary hover:bg-green-100
                ${path==menu.path&&'text-primary bg-green-100'}
            `}
            key={menu.id}>
              <IconComponent />
              <h2>{menu.name}</h2>
            </Link>
          );
        })}
      </div>
      <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
        <button
          onClick={() => authClient.signOut().then(() => router.push('/'))}
          className='flex gap-2 items-center text-gray-500 hover:text-red-600 transition-colors'
          title="Sign out"
        >
          <LogOut className='w-5 h-5' />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default SideNav;


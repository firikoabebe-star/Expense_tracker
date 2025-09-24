'use client'
import { UserButton } from '@clerk/nextjs';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function SideNav() {
  const menuList = [
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
    {
      id: 4,
      name: 'Upgrade',
      icon: ShieldCheck, // Corrected spelling
      path:'/dashboard/upgrade'
    },
  ];
  const path=usePathname();
  useEffect(() => {
    console.log(path)
  },[path])
  return (
    <div className='h-screen p-5 border shadow-sm'>
      <Image src='/logo.svg' alt='logo' height={50} width={100} />
      <div className='mt-5'>
        {menuList.map((menu) => {
          const IconComponent = menu.icon;
          return (
            <div className={`flex gap-2 items-center text-gray-500 font-md p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100
                ${path==menu.path&&'text-primary bg-blue-100'}
            `}
            key={menu.id}>
              <IconComponent />
              <h2>{menu.name}</h2>
            </div>
          );
        })}
      </div>
      <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
        <UserButton/>
        Profile
      </div>
    </div>
  );
}

export default SideNav;
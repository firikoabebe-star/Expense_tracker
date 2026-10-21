'use client'
import { authClient } from '/lib/auth-client';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, LogOut } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

function SideNav() {
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined;

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
      icon: ReceiptText,
      path:'/dashboard/expenses',
    },
    ...(userRole === 'admin' ? [{
      id: 4,
      name: 'Admin',
      icon: ShieldCheck,
      path: '/admin',
    }] : []),
  ];
  const path=usePathname();
  const router = useRouter();
  return (
    <div className='h-screen p-5 border border-border shadow-sm bg-background'>
     <Link href='/'> <Image src='/logoipsum-247.svg' alt='logo' height={50} width={50} /></Link>   
      <div className='mt-5'>
        {menuList.map((menu) => {
          const IconComponent = menu.icon;
          return (
            <Link href={menu.path} className={`flex gap-2 items-center text-muted-foreground font-md p-5 cursor-pointer rounded-md hover:text-primary hover:bg-accent
                ${path==menu.path?'text-primary bg-accent':''}
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
          className='flex gap-2 items-center text-muted-foreground hover:text-destructive transition-colors'
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

'use client'
import { authClient } from '/lib/auth-client';
import { ShieldCheck, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DASHBOARD_NAV_ITEMS, isDashboardNavItemActive } from './nav';

/**
 * Legacy sidebar kept for the admin layout. The customer dashboard now uses the
 * top bar only; both surfaces read their destinations from the shared nav
 * config so they can be swapped without duplicating links.
 */
function SideNav() {
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined;

  const menuList = [
    ...DASHBOARD_NAV_ITEMS,
    ...(userRole === 'admin' ? [{
      name: 'Admin',
      icon: ShieldCheck,
      path: '/admin',
    }] : []),
    {
      name: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
    },
  ];
  const path=usePathname();
  const router = useRouter();
  return (
    <div className='h-screen p-5 border border-border shadow-sm bg-background'>
     <Link href='/'> <Image src='/logoipsum-247.svg' alt='logo' height={50} width={50} /></Link>
      <div className='mt-5'>
        {menuList.map((menu) => {
          const IconComponent = menu.icon;
          const active = isDashboardNavItemActive(path, menu.path);
          return (
            <Link href={menu.path} className={`flex gap-2 items-center text-muted-foreground font-md p-5 cursor-pointer rounded-md hover:text-primary hover:bg-accent
                ${active ? 'text-primary bg-accent' : ''}
            `}
            key={menu.path}
            aria-current={active ? 'page' : undefined}>
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

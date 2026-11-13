"use client"
import React from 'react'
import DashboardHeader from './_components/DashboardHeader'
import { authClient } from '/lib/auth-client'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { checkUserBudgets } from './actions';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const checkBudgets=async()=>{
    try {
      const result = await checkUserBudgets();
      if(result?.length==0){
        router.replace('/dashboard/budgets')
      }
    } catch {
      toast.error('Failed to verify your budgets');
    }
  };

  React.useEffect(() => {
    if (user) {
      checkBudgets();
    }
  }, [user]);

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <DashboardHeader />

      <main className='mx-auto w-full max-w-7xl p-6'>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;

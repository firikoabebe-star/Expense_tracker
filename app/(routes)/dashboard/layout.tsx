"use client"
import React from 'react'
import SideNav from './_components/SideNav'
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
    <div>
      <div className="fixed lg:w-64 hidden lg:block">
        <SideNav />
      </div>
      <div className="lg:ml-64">
        <DashboardHeader />
        
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;

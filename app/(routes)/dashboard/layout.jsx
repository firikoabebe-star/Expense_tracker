"use client"
import React from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '../../../utils/dbConfig'
import { Budgets } from '../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from "drizzle-orm"; // <-- make sure this import exists
import { useRouter } from 'next/navigation';


function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  const checkUserBudgets = async () => {
    const result = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)); // <-- pass correct value

    console.log(result);
    if(result?.length==0){
      router.replace('/dashboard/budgets')
    }
    return result;
  };

  // Optionally call it when needed
  React.useEffect(() => {
    if (user) {
      checkUserBudgets();
    }
  }, [user]);

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;


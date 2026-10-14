"use client"
import React from 'react'
import SideNav from '../dashboard/_components/SideNav'
import DashboardHeader from '../dashboard/_components/DashboardHeader'

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
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

export default AdminLayout;

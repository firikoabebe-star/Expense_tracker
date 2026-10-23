"use client"
import React, { useEffect, useState } from 'react'
import { authClient } from '/lib/auth-client';
import { Users, ReceiptText, PiggyBank, UserPlus, ShieldCheck, ShieldOff, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "/components/ui/alert-dialog";
import { getAllUsers, getAdminStats, getRecentActivity, updateUserRole, getSignupsLast30Days, getExpensesLast7Days } from './actions';
import { formatCurrency } from '/lib/utils';
import LineChartDashboard from './_components/LineChartDashboard';
import DailyExpensesBarChart from './_components/DailyExpensesBarChart';

interface AdminStats {
  totalUsers: number;
  totalExpenses: number;
  totalBudgets: number;
  signupsThisWeek: number;
  signupsThisMonth: number;
}

interface UserWithCounts {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  createdAt: Date;
  budgetCount: number;
  expenseCount: number;
}

interface ActivityItem {
  id: number;
  name: string;
  amount: string;
  createdAt: string;
  type: string;
  userName: string;
  userEmail: string;
}

function AdminPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserWithCounts[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [signups, setSignups] = useState<{ date: string; count: number }[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<{ date: string; total: number; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsResult, usersResult, activityResult, signupsResult, dailyExpensesResult] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getRecentActivity(),
        getSignupsLast30Days(),
        getExpensesLast7Days(),
      ]);
      setStats(statsResult);
      setUsers(usersResult);
      setActivity(activityResult);
      setSignups(signupsResult);
      setDailyExpenses(dailyExpensesResult);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );
      toast.success(`User role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update user role");
    }
  };

  if (loading) {
    return (
      <div className='p-8 dark:bg-[#1B1B1F]'>
        <h2 className='font-bold text-3xl'>Admin Dashboard</h2>
        <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {[1, 2, 3, 4].map((item, index) => (
            <div key={index} className='h-[110px] w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg' />
          ))}
        </div>
        <div className='mt-7 h-[300px] w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg' />
        <div className='mt-7 h-[400px] w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg' />
        <div className='mt-7 h-[400px] w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg' />
      </div>
    );
  }

  return (
    <div className='p-8 dark:bg-[#1B1B1F]'>
      <h2 className='font-bold text-3xl'>Admin Dashboard</h2>
      <p className='text-gray-500'>Manage users and monitor platform activity.</p>

      {/* Overview Cards */}
      <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        <div className='p-7 border dark:border-[#585b5a] rounded-lg flex items-center justify-between'>
          <div>
            <h2 className='text-sm'>Total Users</h2>
            <h2 className='font-bold text-2xl'>{stats?.totalUsers ?? 0}</h2>
          </div>
          <Users className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
        </div>
        <div className='p-7 border dark:border-[#585b5a] rounded-lg flex items-center justify-between'>
          <div>
            <h2 className='text-sm'>Total Expenses</h2>
            <h2 className='font-bold text-2xl'>{stats?.totalExpenses ?? 0}</h2>
          </div>
          <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
        </div>
        <div className='p-7 border dark:border-[#585b5a] rounded-lg flex items-center justify-between'>
          <div>
            <h2 className='text-sm'>Total Budgets</h2>
            <h2 className='font-bold text-2xl'>{stats?.totalBudgets ?? 0}</h2>
          </div>
          <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
        </div>
        <div className='p-7 border dark:border-[#585b5a] rounded-lg flex items-center justify-between'>
          <div>
            <h2 className='text-sm'>Signups (Week / Month)</h2>
            <h2 className='font-bold text-2xl'>{stats?.signupsThisWeek ?? 0} / {stats?.signupsThisMonth ?? 0}</h2>
          </div>
          <UserPlus className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
        </div>
      </div>

      {/* Signups Line Chart */}
      <div className='mt-7'>
        <LineChartDashboard data={signups} />
      </div>

      {/* Daily Expenses Bar Chart */}
      <div className='mt-7'>
        <DailyExpensesBarChart data={dailyExpenses} />
      </div>

      {/* User Management Table */}
      <div className='mt-7'>
        <h2 className='font-bold text-lg mb-2'>User Management</h2>
        <div className='overflow-x-auto'>
          <div className='min-w-[800px]'>
            <div className='grid grid-cols-7 bg-slate-200 dark:bg-inherit p-2'>
              <h2 className='font-bold'>Name</h2>
              <h2 className='font-bold'>Email</h2>
              <h2 className='font-bold'>Role</h2>
              <h2 className='font-bold'>Signed Up</h2>
              <h2 className='font-bold'>Verified</h2>
              <h2 className='font-bold'>Budgets / Expenses</h2>
              <h2 className='font-bold'>Action</h2>
            </div>
            {users.map((u) => (
              <div key={u.id} className='grid grid-cols-7 bg-slate-50 dark:bg-inherit p-2 items-center gap-3 md:gap-4'>
                <h2 className='truncate'>{u.name}</h2>
                <h2 className='truncate'>{u.email}</h2>
                <h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {u.role}
                  </span>
                </h2>
                <h2>{new Date(u.createdAt).toLocaleDateString()}</h2>
                <h2>{u.emailVerified ? '✓' : '✗'}</h2>
                <h2>{u.budgetCount} / {u.expenseCount}</h2>
                <h2>
                  {u.id === session?.user?.id ? (
                    <span className='text-gray-400 text-sm'>You</span>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className='text-sm px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'>
                          {u.role === 'admin' ? (
                            <ShieldOff className='w-4 h-4 text-orange-500 inline' />
                          ) : (
                            <ShieldCheck className='w-4 h-4 text-primary inline' />
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {u.role === 'admin' ? 'Demote User?' : 'Promote to Admin?'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {u.role === 'admin'
                              ? `Are you sure you want to remove admin privileges from ${u.name}?`
                              : `Are you sure you want to make ${u.name} an admin? They will have full access to the admin dashboard.`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRoleToggle(u.id, u.role)}>
                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='mt-7 mb-8'>
        <h2 className='font-bold text-lg mb-2'>Recent Activity</h2>
        <div className='overflow-x-auto'>
          <div className='min-w-[700px]'>
            <div className='grid grid-cols-5 bg-slate-200 dark:bg-inherit p-2'>
              <h2 className='font-bold'>Type</h2>
              <h2 className='font-bold'>Name</h2>
              <h2 className='font-bold'>Amount</h2>
              <h2 className='font-bold'>User</h2>
              <h2 className='font-bold'>Date</h2>
            </div>
            {activity.length === 0 ? (
              <div className='p-4 text-center text-gray-500'>No recent activity</div>
            ) : (
              activity.map((item, index) => (
                <div key={`${item.type}-${item.id}-${index}`} className='grid grid-cols-5 bg-slate-50 dark:bg-inherit p-2 items-center gap-3'>
                  <h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'expense' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {item.type}
                    </span>
                  </h2>
                  <h2 className='truncate'>{item.name}</h2>
                  <h2>{formatCurrency(item.amount)}</h2>
                  <h2 className='truncate'>{item.userName}</h2>
                  <h2>{item.createdAt || '—'}</h2>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

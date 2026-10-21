"use client"
import { ArrowLeft, Trash, Search, ArrowUp, ArrowDown, ArrowUpDown, Download } from 'lucide-react'
import React, { useState ,useEffect, useMemo, useCallback} from 'react'
import { authClient } from '/lib/auth-client';
import { Button } from '/components/ui/button'
import { Input } from '/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { ExpenseSummary } from '/types'
import { getAllExpenses, deleteExpense } from '../actions';
import ExpenseTableSkeleton from '../_components/ExpenseTableSkeleton';
import { formatCurrency, compareExpenseDates, toCsv } from '/lib/utils';
import {
  UNDO_WINDOW_MS,
  cancelExpenseDelete,
  getPendingDeleteIds,
  scheduleExpenseDelete,
  subscribePendingDeletes,
} from './pendingDelete';
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
} from '/components/ui/alert-dialog';

type SortField = 'name' | 'amount' | 'date';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, activeField, dir }: { field: SortField; activeField: SortField | null; dir: SortDir }) {
  if (field !== activeField) return <ArrowUpDown className='inline h-3 w-3 ml-1 opacity-40' />;
  return dir === 'asc' ? <ArrowUp className='inline h-3 w-3 ml-1' /> : <ArrowDown className='inline h-3 w-3 ml-1' />;
}

function ExpenseList() {
const [expensesList,setExpensesList]=useState<ExpenseSummary[]>([]);
const { data: session } = authClient.useSession();
const user = session?.user;
const router=useRouter();
const [loading,setLoading]=useState(true);
const [search,setSearch]=useState('');
const [sortField,setSortField]=useState<SortField | null>(null);
const [sortDir,setSortDir]=useState<SortDir>('asc');
const [pendingDeletes,setPendingDeletes]=useState<Set<number>>(new Set());

useEffect(
  () =>
    subscribePendingDeletes(() => {
      setPendingDeletes(new Set(getPendingDeleteIds()));
    }),
  []
);

const toggleSort = (field: SortField) => {
  if (sortField === field) {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  } else {
    setSortField(field);
    setSortDir('asc');
  }
};

const displayedExpenses = useMemo(() => {
  let list = expensesList.filter((e) => !pendingDeletes.has(e.id));
  if (search.trim()) {
    const term = search.toLowerCase();
    list = list.filter((e) => e.name.toLowerCase().includes(term));
  }
  if (sortField) {
    list = [...list].sort((a, b) => {
      let cmp = 0;
          if (sortField === 'name') cmp = a.name.localeCompare(b.name);
          else if (sortField === 'amount') cmp = Number(a.amount) - Number(b.amount);
          else cmp = compareExpenseDates(a.createdAt, b.createdAt);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }
  return list;
}, [expensesList, search, sortField, sortDir, pendingDeletes]);

  useEffect(()=>{
        user&&getAllExpensesAction();
    },[user])

    const getAllExpensesAction=async()=>{
      try {
        setLoading(true);
        const result=await getAllExpenses();
        setExpensesList(result);
      } catch {
        toast.error('Failed to load expenses');
      } finally {
        setLoading(false);
      }
    }

    const handleDeleteExpense = useCallback(
      (expense: ExpenseSummary) => {
        const toastId = toast('Expense deleted', {
          description: `"${expense.name}" is removed. You can undo this for ${UNDO_WINDOW_MS / 1000} seconds.`,
          duration: UNDO_WINDOW_MS,
          action: {
            label: 'Undo',
            onClick: () => {
              cancelExpenseDelete(expense.id);
              toast.dismiss(toastId);
            },
          },
        });

        scheduleExpenseDelete(expense.id, async () => {
          try {
            const result = await deleteExpense(expense.id);
            if (result) {
              await getAllExpensesAction();
              toast.dismiss(toastId);
            } else {
              toast.error('Failed to delete expense');
            }
          } catch {
            toast.error('Failed to delete expense');
          }
        });
      },
      []
    );

    const exportCsv = () => {
      const rows = displayedExpenses.map((e) => [e.name, e.amount, e.createdAt]);
      const csv = toCsv([['Name', 'Amount', 'Date'], ...rows]);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expenses.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    };

    if (loading) {
      return (
        <div className='p-6'>
          <h2 className='font-bold text-lg mb-2 flex gap-2 items-center'>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            Latest Expenses
          </h2>
          <ExpenseTableSkeleton />
        </div>
      );
    }

    return (
    <div className='p-6'>
      <h2 className='font-bold text-lg mb-2 flex gap-2 items-center '><Button onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>Latest Expenses</h2>
      {expensesList.length > 0 && (
        <div className='flex gap-2 mb-3'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search expenses by name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-9'
            />
          </div>
          <Button variant='outline' onClick={exportCsv} className='shrink-0'>
            <Download className='h-4 w-4 mr-1' /> CSV
          </Button>
        </div>
      )}
      {displayedExpenses.length > 0 ? (
        <>
          <div className='grid grid-cols-4 gap-3 bg-accent text-accent-foreground p-2 rounded-t-md'>
            <button className='font-bold text-left cursor-pointer' onClick={() => toggleSort('name')}>
              Name <SortIcon field='name' activeField={sortField} dir={sortDir} />
            </button>
            <button className='font-bold text-left cursor-pointer' onClick={() => toggleSort('amount')}>
              Amount <SortIcon field='amount' activeField={sortField} dir={sortDir} />
            </button>
            <button className='font-bold text-left cursor-pointer' onClick={() => toggleSort('date')}>
              Date <SortIcon field='date' activeField={sortField} dir={sortDir} />
            </button>
            <h2 className='font-bold'>Action</h2>
          </div>
          {displayedExpenses.map((expenses) => (
            <div key={expenses.id} className='grid grid-cols-4 bg-card p-2 border-b border-border'>
              <h2>{expenses.name}</h2>
              <h2>{formatCurrency(expenses.amount)}</h2>
              <h2>{expenses.createdAt}</h2>
              <h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className='text-destructive hover:opacity-70 cursor-pointer'>
                      <Trash />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete "{expenses.name}" ({formatCurrency(expenses.amount)}). You can undo it for {UNDO_WINDOW_MS / 1000} seconds afterwards.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:opacity-90" onClick={() => handleDeleteExpense(expenses)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </h2>
            </div>
          ))}
        </>
      ) : expensesList.length > 0 ? (
        <p className="text-muted-foreground mt-4">No expenses match "{search}".</p>
      ) : (
        <p className="text-muted-foreground mt-4">No expenses yet. Add one to get started!</p>
      )}
    </div>
  )
}

export default ExpenseList

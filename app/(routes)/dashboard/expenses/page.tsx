"use client"
import { ArrowLeft, Trash, Search, ArrowUp, ArrowDown, ArrowUpDown, Download } from 'lucide-react'
import React, { useState ,useEffect, useMemo, useRef, useCallback} from 'react'
import { authClient } from '/lib/auth-client';
import { Button } from '/components/ui/button'
import { Input } from '/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { ExpenseSummary } from '/types'
import { getAllExpenses, deleteExpense } from '../actions';
import { formatCurrency } from '/lib/utils';

type SortField = 'name' | 'amount' | 'date';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, activeField, dir }: { field: SortField; activeField: SortField | null; dir: SortDir }) {
  if (field !== activeField) return <ArrowUpDown className='inline h-3 w-3 ml-1 opacity-40' />;
  return dir === 'asc' ? <ArrowUp className='inline h-3 w-3 ml-1' /> : <ArrowDown className='inline h-3 w-3 ml-1' />;
}

const UNDO_DELAY = 5000;

function ExpenseList() {
const [expensesList,setExpensesList]=useState<ExpenseSummary[]>([]);
const { data: session } = authClient.useSession();
const user = session?.user;
const router=useRouter();
const [loading,setLoading]=useState(true);
const [search,setSearch]=useState('');
const [sortField,setSortField]=useState<SortField | null>(null);
const [sortDir,setSortDir]=useState<SortDir>('asc');
const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

const toggleSort = (field: SortField) => {
  if (sortField === field) {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  } else {
    setSortField(field);
    setSortDir('asc');
  }
};

const displayedExpenses = useMemo(() => {
  let list = expensesList;
  if (search.trim()) {
    const term = search.toLowerCase();
    list = list.filter((e) => e.name.toLowerCase().includes(term));
  }
  if (sortField) {
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'amount') cmp = Number(a.amount) - Number(b.amount);
      else cmp = a.createdAt.localeCompare(b.createdAt);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }
  return list;
}, [expensesList, search, sortField, sortDir]);

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

    const confirmDelete = useCallback(async (expense: ExpenseSummary) => {
      try {
        const result = await deleteExpense(expense.id);
        if (result) {
          getAllExpensesAction();
        }
      } catch {
        toast.error('Failed to delete expense');
      } finally {
        timersRef.current.delete(expense.id);
      }
    }, []);

    const handleDeleteExpense=(expense: ExpenseSummary)=>{
      setExpensesList((prev) => prev.filter((e) => e.id !== expense.id));
      const timer = setTimeout(() => {
        confirmDelete(expense);
      }, UNDO_DELAY);
      timersRef.current.set(expense.id, timer);

      toast('Expense deleted', {
        description: `"${expense.name}" will be permanently removed.`,
        action: {
          label: 'Undo',
          onClick: () => {
            clearTimeout(timer);
            timersRef.current.delete(expense.id);
            setExpensesList((prev) => {
              const exists = prev.some((e) => e.id === expense.id);
              if (exists) return prev;
              return [...prev, expense];
            });
          },
        },
      });
    };

    const exportCsv = () => {
      const header = 'Name,Amount,Date';
      const rows = displayedExpenses.map((e) => `"${e.name.replace(/"/g, '""')}",${e.amount},${e.createdAt}`);
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expenses.csv';
      link.click();
      URL.revokeObjectURL(url);
    };

    if (loading) {
      return (
        <div className='p-6'>
          <h2 className='font-bold text-lg mb-2 flex gap-2 items-center'>
            <Button className="dark:hover:bg-[#05766c] hover:bg-[#05766c]" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            Latest Expenses
          </h2>
          <div className='grid grid-cols-4 bg-slate-200 p-2'>
            <h2 className='font-bold'>Name</h2>
            <h2 className='font-bold'>Amount</h2>
            <h2 className='font-bold'>Date</h2>
            <h2 className='font-bold'>Action</h2>
          </div>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className='grid grid-cols-4 p-2'>
              <div className='h-4 bg-slate-200 animate-pulse rounded'></div>
              <div className='h-4 bg-slate-200 animate-pulse rounded'></div>
              <div className='h-4 bg-slate-200 animate-pulse rounded'></div>
              <div className='h-4 bg-slate-200 animate-pulse rounded w-4'></div>
            </div>
          ))}
        </div>
      );
    }

    return (
    <div className='p-6'>
      <h2 className='font-bold text-lg mb-2 flex gap-2 items-center '><Button className="dark:hover:bg-[#05766c] hover:bg-[#05766c]" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>Latest Expenses</h2>
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
          <div className='grid grid-cols-4 bg-slate-200 p-2'>
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
            <div key={expenses.id} className='grid grid-cols-4 bg-slate-50 p-2'>
              <h2>{expenses.name}</h2>
              <h2>{formatCurrency(expenses.amount)}</h2>
              <h2>{expenses.createdAt}</h2>
              <h2>
                <Trash className='hover:text-red-700 text-red-500 cursor-pointer'
                  onClick={() => handleDeleteExpense(expenses)} />
              </h2>
            </div>
          ))}
        </>
      ) : expensesList.length > 0 ? (
        <p className="text-gray-500 mt-4">No expenses match "{search}".</p>
      ) : (
        <p className="text-gray-500 mt-4">No expenses yet. Add one to get started!</p>
      )}
    </div>
  )
}

export default ExpenseList

"use client"
import { Trash, Search, ArrowUp, ArrowDown, ArrowUpDown, Download } from 'lucide-react'
import React, { useState, useMemo, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import type { ExpenseSummary, RefreshData } from '/types'
import { deleteExpense } from '../../actions';
import { formatCurrency } from '/lib/utils';
import { Input } from '/components/ui/input';
import { Button } from '/components/ui/button';

type SortField = 'name' | 'amount' | 'date';
type SortDir = 'asc' | 'desc';

interface ExpenseListTableProps {
  expensesList: ExpenseSummary[];
  refreshData: RefreshData;
}

function SortIcon({ field, activeField, dir }: { field: SortField; activeField: SortField | null; dir: SortDir }) {
  if (field !== activeField) return <ArrowUpDown className='inline h-3 w-3 ml-1 opacity-40' />;
  return dir === 'asc' ? <ArrowUp className='inline h-3 w-3 ml-1' /> : <ArrowDown className='inline h-3 w-3 ml-1' />;
}

const UNDO_DELAY = 5000;

function ExpenseListTable({expensesList, refreshData}: ExpenseListTableProps) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
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
          else cmp = a.createdAt.localeCompare(b.createdAt);
          return sortDir === 'asc' ? cmp : -cmp;
        });
      }
      return list;
    }, [expensesList, search, sortField, sortDir, pendingDeletes]);

    const confirmDelete = useCallback(async (id: number) => {
      try {
        const result = await deleteExpense(id);
        if (result) {
          refreshData();
        }
      } catch {
        toast.error('Failed to delete expense');
      } finally {
        timersRef.current.delete(id);
      }
    }, [refreshData]);

    const handleDeleteExpense = (expense: ExpenseSummary) => {
      setPendingDeletes((prev) => new Set(prev).add(expense.id));
      const timer = setTimeout(() => {
        confirmDelete(expense.id);
      }, UNDO_DELAY);
      timersRef.current.set(expense.id, timer);

      toast('Expense deleted', {
        description: `"${expense.name}" will be permanently removed.`,
        action: {
          label: 'Undo',
          onClick: () => {
            clearTimeout(timer);
            timersRef.current.delete(expense.id);
            setPendingDeletes((prev) => {
              const next = new Set(prev);
              next.delete(expense.id);
              return next;
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
  return (
    <div className='mt-3'>
      <h2 className='font-bold text-lg mb-2'>Latest Expenses</h2>
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
            <div key={expenses.id} className='grid grid-cols-4 bg-slate-50 p-2 items-center gap-3 md:gap-4'>
              <h2>{expenses.name}</h2>
              <h2>{formatCurrency(expenses.amount)}</h2>
              <h2>{expenses.createdAt}</h2>
              <h2>
                <Trash className='hover:text-red-700 text-red-600 cursor-pointer text-center'
                  onClick={() => handleDeleteExpense(expenses)} />
              </h2>
            </div>
          ))}
        </>
      ) : expensesList.length > 0 ? (
        <p className="text-gray-500 mt-2">No expenses match "{search}".</p>
      ) : (
        <p className="text-gray-500 mt-2">No expenses yet. Add one to get started!</p>
      )}
    </div>
  )
}

export default ExpenseListTable

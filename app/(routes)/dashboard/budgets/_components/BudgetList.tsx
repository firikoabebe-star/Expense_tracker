"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { authClient } from '/lib/auth-client';
import BudgetItem from './Budgetitem'
import type { BudgetSummary } from '/types';
import { getBudgetList } from '../../actions';

function BudgetList() {
  const [budgetList, setBudgetList] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    user && getBudgetListAction();
  }, [user]);

  const getBudgetListAction = async () => {
    setLoading(true);
    const result = await getBudgetList();
    setBudgetList(result);
    setLoading(false);
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget refreshData={getBudgetListAction}/>

        {/* Skeletons only while loading */}
        {loading ? (
          [1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="w-full bg-slate-200 rounded-lg h-[145px] animate-pulse"
            />
          ))
        ) : budgetList.length > 0 ? (
          budgetList.map((budget, index) => (
            <BudgetItem key={index} budget={budget} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            No budgets yet. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}

export default BudgetList;

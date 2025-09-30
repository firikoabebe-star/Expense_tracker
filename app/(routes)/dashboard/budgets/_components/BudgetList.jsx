"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget.jsx'
import { db } from '/utils/dbConfig.jsx'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '/utils/schema.jsx'
import { useUser } from "@clerk/nextjs";
import BudgetItem from './Budgetitem.jsx'

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  /**
   * Used to get budget list
   */
  const getBudgetList = async () => {
    setLoading(true);
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    setLoading(false);
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget refreshData={getBudgetList} />

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

"use client";
import React, { useEffect,useState } from "react";
import { db } from "../../../../../utils/dbConfig.jsx";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "../../../../../utils/schema.jsx";
import { useUser } from "@clerk/nextjs";
import { use } from "react"; // 👈 import use
import BudgetItem from "../../budgets/_components/Budgetitem";
import AddExpense from '../_components/AddExpense'
import ExpenseListTable from '../_components/ExpenseListTable'
function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo,setBudgetInfo]=useState();
  const[expensesList,setExpensesList]=useState([]);
  const unwrappedParams = use(params); // 👈 unwrap the promise

  useEffect(() => {
    if (user) getBudgetInfo();
  }, [user]);
  
  /**
   * Get Budget Information
   */
  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, unwrappedParams.id)) // 👈 use unwrapped params
      .groupBy(Budgets.id);

    setBudgetInfo(result[0]);
   
  };
  /**
   * Get Latest Expenses
   */
  const getExpensesList=async()=>{
   const result=await db.select().from(Expenses)
   .where(eq(Expenses.budgetId,params.id))
   .orderBy(desc(Expenses.id))
   setExpensesList(result)
   console.log(result)
  }
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">My Expenses</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
       {budgetInfo? <BudgetItem budget={budgetInfo}/>:
       <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>}
       <AddExpense budgetId={unwrappedParams.id}
       user={user}
       refreshData={
        ()=>getBudgetInfo()}/>
      </div>
      <div className='mt-4'>
         <h2 className='font-bold text-lg'>Latest Expenses</h2>
         <ExpenseListTable expensesList={expensesList}/>
      </div>
    </div>
  );
}

export default ExpensesScreen;

"use client";
import React, { useEffect,useState } from "react";
import { db } from "../../../../../utils/dbConfig.jsx";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "../../../../../utils/schema.jsx";
import { useUser } from "@clerk/nextjs";
import { use } from "react"; // 👈 import use
import BudgetItem from "../../budgets/_components/Budgetitem";
import AddExpense from '../_components/AddExpense'
import EditBudget from '../_components/EditBudget'
import ExpenseListTable from '../_components/ExpenseListTable'
import { Button } from "../../../../../components/ui/button.jsx";
import { PenBox, Trash } from "lucide-react";
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
} from "../../../../../components/ui/alert-dialog"
import { toast } from "sonner";
import { useRouter } from "next/navigation.js";
function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo,setBudgetInfo]=useState();
  const[expensesList,setExpensesList]=useState([]);
  const unwrappedParams = use(params); // 👈 unwrap the promise
  const route=useRouter();

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
    getExpensesList();
  };
  /**
   * Get Latest Expenses
   */
  const getExpensesList=async()=>{
   const result=await db.select().from(Expenses)
   .where(eq(Expenses.budgetId,unwrappedParams.id))
   .orderBy(desc(Expenses.id))
   setExpensesList(result)
   console.log(result)
  }

  /**
   * Used to Delete budget
   */
  const deleteBudget=async()=>{
    const deleteExpenseResult=await db.delete(Expenses)
    .where(eq(Expenses.budgetId,unwrappedParams.id))
    .returning()
    if(deleteExpenseResult){
      const result=await db.delete(Budgets)
    .where(eq(Budgets.id,unwrappedParams.id))
    .returning();
    }
    toast('Budget Deleted!')
    route.replace('/dashboard/budgets');
  }
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold flex justify-between items-center">My Expenses
       <div className='flex gap-2 items-center'>
        <EditBudget budgetInfo={budgetInfo}
        refreshData={()=>getBudgetInfo()}/>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className='flex gap-2' variant='destructive'> 
                        <Trash/> Delete</Button>
                   </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your Your current budget along with expenses
                            and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
        </div>
      </h2>
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
         <ExpenseListTable expensesList={expensesList}
         refreshData={()=>getBudgetInfo()} />
      </div>
    </div>
  );
}

export default ExpensesScreen;

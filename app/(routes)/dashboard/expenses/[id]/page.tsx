"use client";
import React, { useEffect,useState } from "react";
import { use } from "react";
import { authClient } from "/lib/auth-client";
import BudgetItem from "../../budgets/_components/Budgetitem";
import AddExpense from '../_components/AddExpense'
import EditBudget from '../_components/EditBudget'
import ExpenseListTable from '../_components/ExpenseListTable'
import { Button } from "/components/ui/button";
import { ArrowLeft, PenBox, Trash } from "lucide-react";
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
} from "/components/ui/alert-dialog"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { BudgetSummary, Expense } from "/types";
import { getBudgetInfo, getExpensesForBudget, deleteBudget } from '../../actions';

interface ExpensesScreenProps {
  params: Promise<{ id: string }>;
}

function ExpensesScreen({ params }: ExpensesScreenProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [budgetInfo,setBudgetInfo]=useState<BudgetSummary>();
  const[expensesList,setExpensesList]=useState<Expense[]>([]);
  const unwrappedParams = use(params);
  const route=useRouter();

  useEffect(() => {
    if (user) getBudgetInfoAction();
  }, [user]);
  
  const getBudgetInfoAction = async () => {
    const budgetId = Number(unwrappedParams.id);
    const info = await getBudgetInfo(budgetId);
    setBudgetInfo(info);
    const expenses = await getExpensesForBudget(budgetId);
    setExpensesList(expenses);
  };

  const handleDeleteBudget=async()=>{
    await deleteBudget(Number(unwrappedParams.id));
    toast('Budget Deleted!')
    route.replace('/dashboard/budgets');
  }
  return (
    <div className="p-10 dark:bg-[#1B1B1F] h-screen">
      <h2 className="text-2xl font-bold flex justify-between items-center">
        <div className='gap-2 flex items-center'>
       <Button  className="dark:hover:bg-[#05766c] hover:bg-[#05766c]" onClick={() => route.back()}><ArrowLeft className="w-5 h-5" /></Button>
        My Expenses
        </div>
       <div className='flex gap-2 items-center'>
        <EditBudget budgetInfo={budgetInfo}
        refreshData={()=>getBudgetInfoAction()}/>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className='flex gap-2 hover:bg-red-700 dark:bg-red-700  dark:hover:bg-red-800 dark:text-black' variant='destructive'> 
                        <Trash/> Delete</Button>
                   </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your budget and its expenses. This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="hover:bg-[#107c73]" onClick={()=>handleDeleteBudget()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
        </div>
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
       {budgetInfo? <BudgetItem budget={budgetInfo}/>:
       <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>}
        <AddExpense budgetId={Number(unwrappedParams.id)}
       refreshData={
        ()=>getBudgetInfoAction()}/>
      </div>
      <div className='mt-4'>
         <ExpenseListTable expensesList={expensesList}
         refreshData={()=>getBudgetInfoAction()} />
      </div>
    </div>
  );
}

export default ExpensesScreen;

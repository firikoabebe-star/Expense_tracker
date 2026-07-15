"use client"
import React, {useState} from "react";
import { Input } from "/components/ui/input";
import { Button } from "/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import type { RefreshData } from "/types";
import { getBudgetInfo, createExpense } from '../../actions';

interface AddExpenseProps {
  budgetId: number;
  refreshData: RefreshData;
}

function AddExpense({budgetId, refreshData}: AddExpenseProps) {

    const [name,setName]=useState("");
    const [amount,setAmount]=useState("");
    const [loading,setLoading]=useState(false);

    const addNewExpense=async()=>{
      setLoading(true);
      const budgetInfo = await getBudgetInfo(budgetId);
      const remainingBudget = Number(budgetInfo.amount || 0) - (budgetInfo.totalSpend || 0);

      if (Number(amount) > remainingBudget) {
        setLoading(false);
        toast.error(`Expense exceeds remaining budget of ${remainingBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`);
        return;
      }

        const result = await createExpense(name, amount, budgetId);

        setAmount('');
        setName('');
        if(result){
          setLoading(false)
            refreshData()
            toast('New Expense Added')
        }
        setLoading(false);  
    }

  return (
    <div className='border p-5 rounded-lg hover:shadow-md'>
      <h2 className="font-bold text-lg">AddExpense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1 dark:text-white">Expense Name</h2>
        <Input
          placeholder="e.g bedroom decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1 dark:text-white">Expense Amount</h2>
        <Input
          type='Number'
          placeholder="e.g 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button 
  disabled={(!name && !amount ) || loading}
  className="mt-3 w-full hover:bg-[#107c73]"
  onClick={() => addNewExpense()}
>
  {loading ? (
    <Loader className="animate-spin" />
  ) : (
   <h2> Add New Expense </h2> 
  )}
</Button>

    </div>
  );
}

export default AddExpense;

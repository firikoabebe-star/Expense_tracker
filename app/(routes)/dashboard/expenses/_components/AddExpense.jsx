import React, {useState} from "react";
import { Input } from "/components/ui/input";
import { Button } from "/components/ui/button";
import { Budgets, Expenses } from "/utils/schema";
import { toast } from "sonner";
import { db } from "/utils/dbConfig.jsx";
import moment from "moment";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { Loader } from "lucide-react";

function AddExpense({budgetId,user, refreshData}) {

    const [name,setName]=useState("");
    const [amount,setAmount]=useState("");
    const [loading,setLoading]=useState(false);
    /**
     * Used to add new expense
     */
    const addNewExpense=async()=>{
      setLoading(true);
      // 1. Get Budget Info (Amount & Spend)
      const budgetInfoResult = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      }).from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.id, budgetId))
        .groupBy(Budgets.id);

      const budgetInfo = budgetInfoResult[0];
      const remainingBudget = (budgetInfo.amount || 0) - (budgetInfo.totalSpend || 0);

      // 2. Validate new expense amount
      if (Number(amount) > remainingBudget) {
        setLoading(false);
        toast.error(`Expense exceeds remaining budget of ${remainingBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`);
        return; // Stop execution
      }


      // 3. Insert Expense if valid
        const result=await db.insert(Expenses).values({
            name:name,
            amount:amount,
            budgetId:budgetId,
            createdAt:moment().format("DD/MM/YYYY")
        }).returning({insertedId:Budgets.id});

        setAmount('');
        setName('');
        console.log(result);
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
  className="mt-3 w-full "
  onClick={() => addNewExpense()}
>
  {loading ? (
    <Loader className="animate-spin" />
  ) : (
    "Add New Expense"
  )}
</Button>

    </div>
  );
}

export default AddExpense;

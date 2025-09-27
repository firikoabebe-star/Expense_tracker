import React, {useState} from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Budgets, Expenses } from "../../../../../utils/schema";
import { toast } from "sonner";
import { db } from "../../../../../utils/dbConfig.jsx";

function AddExpense({budgetId,user, refreshData}) {

    const [name,setName]=useState();
    const [amount,setAmount]=useState();
   
    const addNewExpense=async()=>{
        const result=await db.insert(Expenses).values({
            name:name,
            amount:amount,
            budgetId:budgetId,
            createdAt:user?.primaryEmailAddress?.emailAddress,
        }).returning({insertedId:Budgets.id});

        console.log(result);
        if(result){
            refreshData()
            toast('New Expense Added')
        }
    }

  return (
    <div className='border p-5 rounded-lg hover:shadow-md'>
      <h2 className="font-bold text-lg">AddExpense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g bedroom decor"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          type='Number'
          placeholder="e.g 1000"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button disabled={!(name&&amount)} 
      className='mt-3 w-full'
      onClick={()=>addNewExpense()}>Add New Expense</Button>
    </div>
  );
}

export default AddExpense;

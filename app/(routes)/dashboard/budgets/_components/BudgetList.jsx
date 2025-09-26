   "use client"
  import React from 'react'
  import CreateBudget from './CreateBudget.jsx'
  import { db } from '../../../../../utils/dbConfig.jsx'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses} from '../../../../../utils/schema.jsx'
  function BudgetList() {
    
    const{user}=useUser();
    useEffect(()=>{
        user&&getBudgetList();
    },[user]) 
    /**
     * Used to get budget list
     */
    const getBudgetList=async()=>{
       const result=await db.select({
         ...getTableColumns(Budgets),
         totalSpend:sql `sum(${Expenses.amount})` .mapWith(Number),
         totalItem:sql `count(${Expenses.id})` .mapWith(Number)
       }).from(Budgets)
       .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
       .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
       .groupBy(Budgets.id);

       console.log(result);
    }

    return (
      <div className='mt-7'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <CreateBudget/>
            </div>
      </div>
    )
  }
  
  export default BudgetList
  
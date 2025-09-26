import React from 'react'

function Budgetitem({budget}) {
  return (
    <div className='p-5 border rounded-lg gap-10'>
      <div className='flex gap-2 items-center justify-between'>
        <div className='flex gap-2 items-center'>
            <h2 className='text-2xl p-3 px-4
            bg-slate-100 rounded-full'>
                {budget?.icon}</h2>
                <div>
                    <h2>{budget.name}</h2>
                    <h2>{budget.totalItem} Item</h2>
                </div>
        </div>
        <h2 className='font-bold text-primary text-lg'>${budget.amount}</h2>
        </div>
        <div className='mt-5'>
            <div className='w-full bg-slate-300 h-2 rounded-full'>
            <div className='w-[40%] bg-primary h-2 rounded-full'>

            </div>
            </div>
        </div>
    </div>
  )  
}

export default Budgetitem

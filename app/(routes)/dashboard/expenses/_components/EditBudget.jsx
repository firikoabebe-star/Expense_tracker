"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../../../../../components/ui/button'
import { PenBox } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../../../../../components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Input } from '../../../../../components/ui/input'
import { Budgets } from '../../../../../utils/schema'
import { db } from '../../../../../utils/dbConfig'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function EditBudget({budgetInfo, refreshData}) {
const [emojiIcon, setEmojiIcon] = useState(); 
 const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name,setName]=useState();
  const [amount,setAmount]=useState();

  const {user}=useUser();

  useEffect(()=>{
    if(budgetInfo){
    setEmojiIcon(budgetInfo?.icon)
    }
  },[budgetInfo])
  const onUpdateBudget=async()=>{
     const result=await db.update(Budgets).set({
        name:name,
        amount:amount,
        icon:emojiIcon,
     }).where(eq(Budgets.id,budgetInfo.id))
     .returning();

     if(result){
        refreshData()
        toast("Budget Updated")
     }
  }
  return (
    <div>
        <Dialog>
              <DialogTrigger asChild>
               <Button className='flex gap-2'> <PenBox/> Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Budget</DialogTitle>
                  {/* Use asChild so DialogDescription doesn't force <p> */}
                  <DialogDescription asChild>
                    <div>
                      <Button
                        variant="outline"
                        onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                      >
                        {emojiIcon}
                      </Button>
                      <div className='mt-2'>
                       <h2 className='text-black font-medium my-1'>Budget Name</h2>
                     {budgetInfo && (
                    <Input
                        placeholder="e.g home decor"
                        defaultValue={budgetInfo.name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                    )}

                       </div>
                       <div className='mt-2'>
                       <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                       {budgetInfo && (
                      <Input type='Number' placeholder="e.g 5000$"
                       defaultValue={budgetInfo.amount}
                       onChange={(e)=>setAmount(e.target.value)}/>
                       )}
                       </div>
                      
                      {openEmojiPicker && (
                        <div className="relative mt-2">
                          <div className="absolute z-50">
                            <EmojiPicker
                              onEmojiClick={(emojiObject) => setEmojiIcon(emojiObject.emoji)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button 
                       disabled={!(name&&amount)}
                       className='mt-5 w-full'
                       onClick={()=>onUpdateBudget()}>Update Budget</Button>
                    </DialogClose>
                  </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
  )
}

export default EditBudget

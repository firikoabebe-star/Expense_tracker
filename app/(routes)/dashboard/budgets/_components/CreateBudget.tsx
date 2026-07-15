"use client"
import React, { useState } from 'react'
import { authClient } from '/lib/auth-client';

import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '/components/ui/button';
import { Input } from "/components/ui/input"
import { toast } from 'sonner';
import type { RefreshData } from '/types';
import { createBudget } from '../../actions';

interface CreateBudgetProps {
  refreshData: RefreshData;
}

function CreateBudget({refreshData}: CreateBudgetProps) {
  const [emojiIcon, setEmojiIcon] = useState('🏡');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name,setName]=useState('');
  const [amount,setAmount]=useState('');

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const onCreateBudget=async()=>{
     const result = await createBudget(name, amount, emojiIcon);

     if(result){
      refreshData()
      toast('New Budget Created!')
     }
  }
  return (
    <div> 
      <Dialog>
        <DialogTrigger asChild>
          <div className='dark:bg-[#009689] dark:hover:bg-[#05766c] bg-slate-100 p-10 rounded-md 
          items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md whitespace-nowrap'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            {/* Use asChild so DialogDescription doesn't force <p> */}
            <DialogDescription asChild>
              <div>
                <Button
                  variant="outline"
                  className="dark:border-white"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}//toggles b/n true and false wich opens and closes the emoji picker
                >
                  {emojiIcon}
                </Button>
                <div className='mt-2'>
                 <h2 className='text-black font-medium my-1 dark:text-white'>Budget Name</h2>
                <Input placeholder="e.g home decor"
                onChange={(e)=>setName(e.target.value)}/>
                 </div>
                 <div className='mt-2'>
                 <h2 className='text-black font-medium my-1 dark:text-white'>Budget Amount</h2>
                <Input type='Number' placeholder="e.g 5000$"
                 onChange={(e)=>setAmount(e.target.value)}/>
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
                 className='mt-5 w-full dark:text-white hover:bg-[#107c73]'
                 onClick={()=>onCreateBudget()}>Create Budget</Button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateBudget

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
import { MAX_BUDGET_AMOUNT, MAX_BUDGET_NAME_LENGTH, validateMoneyAmount } from '/lib/utils';
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

  const amountValidation = validateMoneyAmount(amount, { max: MAX_BUDGET_AMOUNT });
  const trimmedName = name.trim();
  const canSubmit =
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_BUDGET_NAME_LENGTH &&
    amountValidation.valid;

  const onCreateBudget=async()=>{
    const check = validateMoneyAmount(amount, { max: MAX_BUDGET_AMOUNT });
    if(!check.valid){
      toast.error(check.message);
      return;
    }
    if(!trimmedName){
      toast.error('Enter a name');
      return;
    }
    if(trimmedName.length > MAX_BUDGET_NAME_LENGTH){
      toast.error(`Name can't be more than ${MAX_BUDGET_NAME_LENGTH} characters`);
      return;
    }

    try {
      const result = await createBudget(trimmedName, String(check.value), emojiIcon);

      if(result){
        refreshData();
        toast('New Budget Created!');
      }
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : 'Failed to create budget'
      );
    }
  }
  return (
    <div> 
      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-accent text-accent-foreground p-10 rounded-md 
          items-center flex flex-col border-2 border-dashed border-border cursor-pointer hover:shadow-md whitespace-nowrap'>
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
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className='mt-2'>
                 <h2 className='text-foreground font-medium my-1'>Budget Name</h2>
                <Input placeholder="e.g home decor"
                value={name}
                maxLength={MAX_BUDGET_NAME_LENGTH}
                onChange={(e)=>setName(e.target.value)}/>
                 </div>
                 <div className='mt-2'>
                 <h2 className='text-foreground font-medium my-1'>Budget Amount</h2>
                <Input type='text' inputMode='decimal' placeholder="e.g. 25000 or 1.5m"
                 value={amount}
                 aria-invalid={amount !== '' && !amountValidation.valid ? true : undefined}
                 aria-describedby={
                   amount === ''
                     ? undefined
                     : amountValidation.valid
                       ? 'create-budget-amount-preview'
                       : 'create-budget-amount-error'
                 }
                 onChange={(e)=>setAmount(e.target.value)}/>
                {amount !== '' && amountValidation.valid && (
                  <p id='create-budget-amount-preview' className='mt-1 text-xs text-muted-foreground'>
                    = ETB {amountValidation.value.toLocaleString('en-US')}
                  </p>
                )}
                {amount !== '' && !amountValidation.valid && (
                  <p id='create-budget-amount-error' role='alert' className='mt-1 text-xs text-destructive'>
                    {amountValidation.message}
                  </p>
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
                 disabled={!canSubmit}
                 className='mt-5 w-full'
                 onClick={()=>onCreateBudget()}>Create Budget</Button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateBudget

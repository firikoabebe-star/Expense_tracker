"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '/components/ui/button'
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
} from "/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Input } from '/components/ui/input'
import { toast } from 'sonner'
import type { BudgetSummary, RefreshData } from '/types'
import { MAX_BUDGET_AMOUNT, MAX_BUDGET_NAME_LENGTH, validateMoneyAmount } from '/lib/utils'
import { updateBudget } from '../../actions';

interface EditBudgetProps {
  budgetInfo?: BudgetSummary;
  refreshData: RefreshData;
}

function EditBudget({budgetInfo, refreshData}: EditBudgetProps) {
const [emojiIcon, setEmojiIcon] = useState<string | null | undefined>(); 
 const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name,setName]=useState<string | undefined>();
  const [amount,setAmount]=useState<string | undefined>();

  useEffect(()=>{
    if(budgetInfo){
    setEmojiIcon(budgetInfo?.icon)
    }
  },[budgetInfo])

  const amountValue = amount ?? budgetInfo?.amount ?? '';
  const nameValue = name ?? budgetInfo?.name ?? '';
  const amountValidation = validateMoneyAmount(amountValue, { max: MAX_BUDGET_AMOUNT });
  const trimmedName = nameValue.trim();
  const canSubmit =
    Boolean(budgetInfo) &&
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_BUDGET_NAME_LENGTH &&
    amountValidation.valid;

  const onUpdateBudget=async()=>{
    if(!budgetInfo) return;

    const check = validateMoneyAmount(amountValue, { max: MAX_BUDGET_AMOUNT });
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
      const result = await updateBudget(
        budgetInfo.id,
        trimmedName,
        String(check.value),
        emojiIcon
      );

      if(result){
        refreshData();
        toast("Budget Updated");
      }
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : 'Failed to update budget'
      );
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
                       <h2 className='text-foreground font-medium my-1'>Budget Name</h2>
                      {budgetInfo && (
                    <Input
                        placeholder="e.g home decor"
                        value={nameValue}
                        maxLength={MAX_BUDGET_NAME_LENGTH}
                        onChange={(e)=>setName(e.target.value)}
                    />
                    )}

                       </div>
                       <div className='mt-2'>
                       <h2 className='text-foreground font-medium my-1'>Budget Amount</h2>
                       {budgetInfo && (
                      <Input type='text' inputMode='decimal' placeholder="e.g. 25000 or 1.5m"
                       value={amountValue}
                       aria-invalid={amountValue !== '' && !amountValidation.valid ? true : undefined}
                       aria-describedby={
                         amountValue === ''
                           ? undefined
                           : amountValidation.valid
                             ? 'edit-budget-amount-preview'
                             : 'edit-budget-amount-error'
                       }
                       onChange={(e)=>setAmount(e.target.value)}/>
                       )}
                       {budgetInfo && amountValue !== '' && amountValidation.valid && (
                         <p id='edit-budget-amount-preview' className='mt-1 text-xs text-muted-foreground'>
                           = ETB {amountValidation.value.toLocaleString('en-US')}
                         </p>
                       )}
                       {budgetInfo && amountValue !== '' && !amountValidation.valid && (
                         <p id='edit-budget-amount-error' role='alert' className='mt-1 text-xs text-destructive'>
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
                       onClick={()=>onUpdateBudget()}>Update Budget</Button>
                    </DialogClose>
                  </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
  )
}

export default EditBudget

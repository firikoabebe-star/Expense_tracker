"use client"
import React, {useEffect, useRef, useState} from "react";
import { Input } from "/components/ui/input";
import { Button } from "/components/ui/button";
import { toast } from "sonner";
import { Camera, Loader, Sparkles } from "lucide-react";
import type { RefreshData } from "/types";
import { formatCurrency, MAX_EXPENSE_AMOUNT, MAX_EXPENSE_NAME_LENGTH, validateMoneyAmount } from "/lib/utils";
import { getBudgetInfo, createExpense } from '../../actions';
import { parseExpenseText, scanReceipt } from '../../ai-actions';

interface AddExpenseProps {
  budgetId: number;
  refreshData: RefreshData;
}

const MAX_RECEIPT_BYTES = 4 * 1024 * 1024;
const MAX_RECEIPT_DIMENSION = 1600;
const RECEIPT_JPEG_QUALITY = 0.8;

async function compressReceiptImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(
      1,
      MAX_RECEIPT_DIMENSION / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", RECEIPT_JPEG_QUALITY)
    );
    if (!blob) throw new Error("Could not compress image");
    return new File([blob], "receipt.jpg", { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}

function AddExpense({budgetId, refreshData}: AddExpenseProps) {

    const [name,setName]=useState("");
    const [amount,setAmount]=useState("");
    const [loading,setLoading]=useState(false);
    const [quickText,setQuickText]=useState("");
    const [parsing,setParsing]=useState(false);
    const [aiFilled,setAiFilled]=useState(false);
    const [scanning,setScanning]=useState(false);
    const [scanPreview,setScanPreview]=useState<string | null>(null);
    const receiptInputRef=useRef<HTMLInputElement>(null);

    useEffect(()=>{
      return () => {
        if(scanPreview) URL.revokeObjectURL(scanPreview);
      };
    },[scanPreview]);

    const amountValidation = validateMoneyAmount(amount, { max: MAX_EXPENSE_AMOUNT });
    const trimmedName = name.trim();
    const canSubmit =
      trimmedName.length > 0 &&
      trimmedName.length <= MAX_EXPENSE_NAME_LENGTH &&
      amountValidation.valid;

    const fillWithAi=async()=>{
      const text=quickText.trim();
      if(!text || parsing) return;

      setParsing(true);
      setAiFilled(false);
      try {
        const result=await parseExpenseText(text);
        if(!result.ok){
          toast.error(result.message);
          return;
        }

        // This form always adds to the budget it is rendered for, so the
        // returned budgetId is ignored and the current budget is kept.
        setName(result.data.name);
        setAmount(String(result.data.amount));
        setAiFilled(true);
      } catch {
        toast.error("Couldn't read that expense. Try something like 'lunch 250 birr'.");
      } finally {
        setParsing(false);
      }
    }

    const scanReceiptImage=async(file: File)=>{
      if(scanning || loading) return;
      if(!file.type.startsWith('image/')){
        toast.error('Choose a JPEG, PNG or WebP image.');
        return;
      }

      setScanning(true);
      setAiFilled(false);
      try {
        const compressed = await compressReceiptImage(file);
        if(compressed.size > MAX_RECEIPT_BYTES){
          toast.error('That image is too large. Try a smaller photo.');
          return;
        }

        setScanPreview(URL.createObjectURL(compressed));
        const formData = new FormData();
        formData.append('file', compressed);

        const result = await scanReceipt(formData);
        if(!result.ok){
          toast.error(result.message);
          return;
        }

        if(result.data.merchant) setName(result.data.merchant);
        setAmount(String(result.data.amount));
        if(
          result.data.suggestedBudgetId !== null &&
          result.data.suggestedBudgetId !== budgetId
        ){
          toast('This receipt looks like it belongs to another budget. It will be added to the current budget.');
        }
        setAiFilled(true);
      } catch {
        toast.error("Couldn't scan that receipt. Try a clearer photo.");
      } finally {
        setScanning(false);
        if(receiptInputRef.current) receiptInputRef.current.value = '';
      }
    }

    const addNewExpense=async()=>{
      if(loading) return;

      const check = validateMoneyAmount(amount, { max: MAX_EXPENSE_AMOUNT });
      if(!check.valid){
        toast.error(check.message);
        return;
      }
      if(!trimmedName){
        toast.error('Enter an expense name');
        return;
      }
      if(trimmedName.length > MAX_EXPENSE_NAME_LENGTH){
        toast.error(`Name can't be more than ${MAX_EXPENSE_NAME_LENGTH} characters`);
        return;
      }

      setLoading(true);
      try {
        const budgetInfo = await getBudgetInfo(budgetId);
        const remainingBudget = Number(budgetInfo.amount || 0) - (budgetInfo.totalSpend || 0);

        if (check.value > remainingBudget) {
          toast.error(`Expense exceeds remaining budget of ${formatCurrency(remainingBudget)}.`);
          return;
        }

        const result = await createExpense(trimmedName, String(check.value), budgetId);

        setAmount('');
        setName('');
        setAiFilled(false);
        setScanPreview(null);
        if(result){
          refreshData();
          toast('New Expense Added');
        }
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : 'Failed to add expense'
        );
      } finally {
        setLoading(false);
      }
    }

  return (
    <div className='border border-border bg-card p-5 rounded-lg hover:shadow-md'>
      <h2 className="font-bold text-lg">AddExpense</h2>
      <div className="mt-2 rounded-lg border border-border bg-accent p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-foreground" aria-hidden />
          <h2 className="font-medium text-sm text-foreground">Quick add with AI</h2>
        </div>
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            fillWithAi();
          }}
        >
          <Input
            placeholder="e.g. lunch 250 birr groceries"
            aria-label="Describe your expense"
            value={quickText}
            disabled={parsing || scanning}
            onChange={(e) => setQuickText(e.target.value)}
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-20 shrink-0"
            disabled={!quickText.trim() || parsing || scanning}
          >
            {parsing ? <Loader className="animate-spin" /> : <h2> Fill </h2>}
          </Button>
        </form>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Describe an expense and we&apos;ll fill in the name and amount. Nothing is
          saved until you press Add New Expense.
        </p>
        {aiFilled && (
          <p role="status" className="mt-1.5 text-xs font-medium text-foreground">
            AI filled this, please review.
          </p>
        )}
      </div>
      <div className="mt-2">
        <input
          ref={receiptInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={scanning || loading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) scanReceiptImage(file);
          }}
        />
        <Button
          type="button"
          variant="secondary"
          className="flex w-full items-center justify-center gap-2"
          disabled={scanning || loading}
          aria-busy={scanning}
          onClick={() => receiptInputRef.current?.click()}
        >
          {scanning ? (
            <Loader className="animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {scanning ? 'Scanning receipt...' : 'Scan receipt'}
        </Button>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Photo of the receipt total. Nothing is saved until you press Add New Expense.
        </p>
        {scanPreview && (
          <img
            src={scanPreview}
            alt="Receipt preview"
            className="mt-2 h-40 w-full rounded-md border border-border bg-background object-contain"
          />
        )}
      </div>
      <div className="mt-2">
        <h2 className="text-foreground font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g bedroom decor"
          value={name}
          maxLength={MAX_EXPENSE_NAME_LENGTH}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-foreground font-medium my-1">Expense Amount</h2>
        <Input
          type='text'
          inputMode='decimal'
          placeholder="e.g. 25000 or 1.5m"
          value={amount}
          aria-invalid={amount !== '' && !amountValidation.valid ? true : undefined}
          aria-describedby={
            amount === ''
              ? undefined
              : amountValidation.valid
                ? 'expense-amount-preview'
                : 'expense-amount-error'
          }
          onChange={(e) => setAmount(e.target.value)}
        />
        {amount !== '' && amountValidation.valid && (
          <p id='expense-amount-preview' className='mt-1 text-xs text-muted-foreground'>
            = ETB {amountValidation.value.toLocaleString('en-US')}
          </p>
        )}
        {amount !== '' && !amountValidation.valid && (
          <p id='expense-amount-error' role='alert' className='mt-1 text-xs text-destructive'>
            {amountValidation.message}
          </p>
        )}
      </div>
      <Button 
  disabled={!canSubmit || loading || scanning}
  className="mt-3 w-full"
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

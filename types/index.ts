import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { LucideIcon } from "lucide-react";

import type { Budgets, Expenses } from "../utils/schema";

export type Budget = InferSelectModel<typeof Budgets>;
export type NewBudget = InferInsertModel<typeof Budgets>;

export type Expense = InferSelectModel<typeof Expenses>;
export type NewExpense = InferInsertModel<typeof Expenses>;

export interface BudgetSummary extends Budget {
  totalSpend: number;
  totalItem: number;
}

export interface ExpenseSummary {
  id: number;
  name: string;
  amount: string;
  createdAt: string;
}

export interface NavItem {
  id: number;
  name: string;
  icon: LucideIcon;
  path: string;
}

export type RefreshData = () => void | Promise<void>;

"use server";

import { db } from "/utils/dbConfig";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "/utils/schema";
import { auth } from "/lib/auth";
import { headers } from "next/headers";
import moment from "moment";

async function getUserEmail() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session.user.email;
}

async function assertBudgetOwner(budgetId: number, email?: string) {
  const owner = email ?? (await getUserEmail());
  const [budget] = await db
    .select({ id: Budgets.id, createdBy: Budgets.createdBy })
    .from(Budgets)
    .where(eq(Budgets.id, budgetId));
  if (!budget) throw new Error("Not found");
  if (budget.createdBy !== owner) throw new Error("Forbidden");
  return { email: owner, budget };
}

export async function getBudgetList() {
  const email = await getUserEmail();
  return db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id));
}

export async function getAllExpenses() {
  const email = await getUserEmail();
  return db
    .select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
    })
    .from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .orderBy(desc(Expenses.id));
}

export async function getBudgetInfo(budgetId: number) {
  const email = await getUserEmail();
  const result = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(and(eq(Budgets.createdBy, email), eq(Budgets.id, budgetId)))
    .groupBy(Budgets.id);
  return result[0];
}

export async function getExpensesForBudget(budgetId: number) {
  await assertBudgetOwner(budgetId);
  return db
    .select()
    .from(Expenses)
    .where(eq(Expenses.budgetId, budgetId))
    .orderBy(desc(Expenses.id));
}

export async function checkUserBudgets() {
  const email = await getUserEmail();
  return db.select().from(Budgets).where(eq(Budgets.createdBy, email));
}

export async function createBudget(name: string, amount: string, icon: string) {
  const email = await getUserEmail();
  return db
    .insert(Budgets)
    .values({ name, amount, createdBy: email, icon })
    .returning({ insertedId: Budgets.id });
}

export async function updateBudget(
  budgetId: number,
  name: string | undefined,
  amount: string | undefined,
  icon: string | null | undefined
) {
  const { email } = await assertBudgetOwner(budgetId);
  return db
    .update(Budgets)
    .set({ name, amount, icon })
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, email)))
    .returning();
}

export async function createExpense(
  name: string,
  amount: string,
  budgetId: number
) {
  await assertBudgetOwner(budgetId);
  return db
    .insert(Expenses)
    .values({ name, amount, budgetId, createdAt: moment().format("DD/MM/YYYY") })
    .returning({ insertedId: Expenses.id });
}

export async function deleteExpense(expenseId: number) {
  const email = await getUserEmail();
  const [expense] = await db
    .select({ id: Expenses.id, budgetId: Expenses.budgetId })
    .from(Expenses)
    .where(eq(Expenses.id, expenseId));
  if (!expense) throw new Error("Not found");
  if (expense.budgetId === null) throw new Error("Forbidden");
  await assertBudgetOwner(expense.budgetId, email);
  return db.delete(Expenses).where(eq(Expenses.id, expenseId)).returning();
}

export async function deleteBudget(budgetId: number) {
  const { email } = await assertBudgetOwner(budgetId);
  const deleteExpenses = db.delete(Expenses).where(eq(Expenses.budgetId, budgetId));
  const deleteBudgetRow = db
    .delete(Budgets)
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, email)))
    .returning();
  const [, deletedBudgets] = await db.batch([deleteExpenses, deleteBudgetRow]);
  return deletedBudgets;
}

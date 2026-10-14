"use server";

import { db } from "/utils/dbConfig";
import { and, eq, sql, desc } from "drizzle-orm";
import { Budgets, Expenses } from "/utils/schema";
import { user } from "/auth-schema";
import { auth } from "/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  if (session.user.role !== "admin") throw new Error("Forbidden");
  return session;
}

export async function getAllUsers() {
  await requireAdmin();

  const usersWithCounts = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      budgetCount: sql<number>`coalesce((select count(*)::int from ${Budgets} where ${Budgets.createdBy} = ${user.email}), 0)`.mapWith(Number),
      expenseCount: sql<number>`coalesce((select count(*)::int from ${Expenses} where ${Expenses.budgetId} in (select ${Budgets.id} from ${Budgets} where ${Budgets.createdBy} = ${user.email})), 0)`.mapWith(Number),    })
    .from(user)
    .orderBy(desc(user.createdAt));

  return usersWithCounts;
}

export async function getAdminStats() {
  await requireAdmin();

  const [totalUsers] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user);

  const [totalExpenses] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(Expenses);

  const [totalBudgets] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(Budgets);

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [signupsThisWeek] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .where(sql`${user.createdAt} >= ${weekAgo}`);

  const [signupsThisMonth] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .where(sql`${user.createdAt} >= ${monthAgo}`);

  return {
    totalUsers: totalUsers.count,
    totalExpenses: totalExpenses.count,
    totalBudgets: totalBudgets.count,
    signupsThisWeek: signupsThisWeek.count,
    signupsThisMonth: signupsThisMonth.count,
  };
}

export async function getRecentActivity() {
  await requireAdmin();

  const recentExpenses = await db
    .select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
      type: sql<string>`'expense'`,
      userName: user.name,
      userEmail: user.email,
    })
    .from(Expenses)
    .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
    .innerJoin(user, eq(Budgets.createdBy, user.email))
    .orderBy(desc(Expenses.id))
    .limit(10);

  const recentBudgets = await db
    .select({
      id: Budgets.id,
      name: Budgets.name,
      amount: Budgets.amount,
      createdAt: sql<string>`''`,
      type: sql<string>`'budget'`,
      userName: user.name,
      userEmail: user.email,
    })
    .from(Budgets)
    .innerJoin(user, eq(Budgets.createdBy, user.email))
    .orderBy(desc(Budgets.id))
    .limit(10);

  const activity = [...recentExpenses, ...recentBudgets].sort((a, b) => {
    if (a.type === b.type) return Number(b.id) - Number(a.id);
    return 0;
  });

  return activity.slice(0, 15);
}

export async function updateUserRole(userId: string, newRole: string) {
  await requireAdmin();

  if (newRole !== "user" && newRole !== "admin") {
    throw new Error("Invalid role");
  }

  const [updated] = await db
    .update(user)
    .set({ role: newRole })
    .where(eq(user.id, userId))
    .returning({ id: user.id, name: user.name, email: user.email, role: user.role });

  return updated;
}

export async function getSignupsLast30Days() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const rows = await db
    .select({
      date: sql<string>`to_char(${user.createdAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
    })
    .from(user)
    .where(sql`${user.createdAt} >= ${thirtyDaysAgo}`)
    .groupBy(sql`to_char(${user.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${user.createdAt}, 'YYYY-MM-DD')`);

  return rows;
}

export async function getExpensesLast7Days() {
  await requireAdmin();

  const rows = await db
    .select({
      date: sql<string>`to_char(to_date(${Expenses.createdAt}, 'DD/MM/YYYY'), 'YYYY-MM-DD')`,
      total: sql<number>`sum(${Expenses.amount})::numeric`,
      count: sql<number>`count(*)::int`,
    })
    .from(Expenses)
    .where(sql`to_date(${Expenses.createdAt}, 'DD/MM/YYYY') >= current_date - interval '6 days'`)
    .groupBy(sql`to_char(to_date(${Expenses.createdAt}, 'DD/MM/YYYY'), 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(to_date(${Expenses.createdAt}, 'DD/MM/YYYY'), 'YYYY-MM-DD')`);

  return rows;
}

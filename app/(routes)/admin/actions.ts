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

  // The day range is generated in SQL and left joined to the users, so days
  // without signups are returned as zero instead of missing from the series.
  const result = await db.execute<{ date: string; count: number }>(sql`
    select to_char(days.day, 'YYYY-MM-DD') as date,
           count(${user.id})::int as count
    from generate_series(current_date - interval '29 days', current_date, interval '1 day') as days(day)
    left join ${user}
      on ${user.createdAt} >= current_date - interval '29 days'
     and date_trunc('day', ${user.createdAt}) = days.day
    group by days.day
    order by days.day
  `);

  return result.rows;
}

export async function getExpensesLast7Days() {
  await requireAdmin();

  // Expenses.createdAt is a DD/MM/YYYY varchar, so the day is rebuilt
  // explicitly into a YYYY-MM-DD key (year, month and day are read from their
  // own positions) instead of relying on a locale dependent cast. Rows that do
  // not have the expected shape are skipped, and a row can therefore never
  // make the whole query fail.
  const result = await db.execute<{ date: string; total: string; count: number }>(sql`
    with parsed as (
      select
        substring(${Expenses.createdAt} from '([[:digit:]]{4})$') || '-' ||
        lpad(substring(${Expenses.createdAt} from '^[[:digit:]]{1,2}/([[:digit:]]{1,2})/'), 2, '0') || '-' ||
        lpad(substring(${Expenses.createdAt} from '^([[:digit:]]{1,2})/'), 2, '0') as day,
        ${Expenses.amount} as amount
      from ${Expenses}
      where ${Expenses.createdAt} ~ '^[[:digit:]]{1,2}/[[:digit:]]{1,2}/[[:digit:]]{4}$'
    )
    select to_char(days.day, 'YYYY-MM-DD') as date,
           coalesce(sum(parsed.amount), 0)::numeric as total,
           count(parsed.day)::int as count
    from generate_series(current_date - interval '6 days', current_date, interval '1 day') as days(day)
    left join parsed on parsed.day = to_char(days.day, 'YYYY-MM-DD')
    group by days.day
    order by days.day
  `);

  // Postgres returns numeric as a string, so it is converted to a number
  // before it reaches the chart.
  return result.rows.map((row) => ({
    date: row.date,
    total: Number(row.total),
    count: row.count,
  }));
}

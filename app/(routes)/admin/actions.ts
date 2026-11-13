"use server";

import { db } from "/utils/dbConfig";
import { eq, sql, desc } from "drizzle-orm";
import { Budgets, Expenses } from "/utils/schema";
import { user, account } from "/auth-schema";
import { auth } from "/lib/auth";
import { headers } from "next/headers";
import { parseExpenseDate } from "/lib/utils";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  if (session.user.role !== "admin") throw new Error("Forbidden");
  return session;
}

function round2(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function percentChange(current: number, previous: number): number | null {
  if (!Number.isFinite(previous) || previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return round2(change);
}

function getDateRange(range: "7d" | "30d" | "6m" | "12m") {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let startCurrent: Date;
  let startPrevious: Date;
  let endPrevious: Date;

  if (range === "7d") {
    startCurrent = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    startCurrent.setHours(0, 0, 0, 0);
    endPrevious = new Date(startCurrent);
    endPrevious.setDate(endPrevious.getDate() - 1);
    endPrevious.setHours(23, 59, 59, 999);
    startPrevious = new Date(endPrevious);
    startPrevious.setDate(startPrevious.getDate() - 6);
    startPrevious.setHours(0, 0, 0, 0);
  } else if (range === "30d") {
    startCurrent = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    startCurrent.setHours(0, 0, 0, 0);
    endPrevious = new Date(startCurrent);
    endPrevious.setDate(endPrevious.getDate() - 1);
    endPrevious.setHours(23, 59, 59, 999);
    startPrevious = new Date(endPrevious);
    startPrevious.setDate(startPrevious.getDate() - 29);
    startPrevious.setHours(0, 0, 0, 0);
  } else if (range === "6m") {
    startCurrent = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    startCurrent.setHours(0, 0, 0, 0);
    endPrevious = new Date(startCurrent);
    endPrevious.setDate(endPrevious.getDate() - 1);
    endPrevious.setHours(23, 59, 59, 999);
    startPrevious = new Date(endPrevious);
    startPrevious.setMonth(startPrevious.getMonth() - 6);
    startPrevious.setHours(0, 0, 0, 0);
  } else {
    startCurrent = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    startCurrent.setHours(0, 0, 0, 0);
    endPrevious = new Date(startCurrent);
    endPrevious.setDate(endPrevious.getDate() - 1);
    endPrevious.setHours(23, 59, 59, 999);
    startPrevious = new Date(endPrevious);
    startPrevious.setFullYear(startPrevious.getFullYear() - 1);
    startPrevious.setHours(0, 0, 0, 0);
  }
  return { startCurrent, end, startPrevious, endPrevious };
}

function getSparklinePeriods(range: "7d" | "30d" | "6m" | "12m") {
  const now = new Date();
  const periods: Array<{ start: Date; end: Date; key: string }> = [];
  if (range === "7d") {
    for (let i = 11; i >= 0; i--) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      periods.push({ start, end, key: start.toISOString().slice(0, 10) });
    }
    return periods;
  } else if (range === "30d") {
    for (let i = 11; i >= 0; i--) {
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 2);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      periods.push({ start, end, key: end.toISOString().slice(0, 10) });
    }
    return periods;
  } else {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      periods.push({ start, end, key: start.toISOString().slice(0, 7) });
    }
    return periods;
  }
}

function getSeriesPeriods(range: "7d" | "30d" | "6m" | "12m") {
  const now = new Date();
  const periods: Array<{ start: Date; end: Date; key: string }> = [];
  if (range === "7d") {
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      periods.push({ start, end, key: start.toISOString().slice(0, 10) });
    }
    return periods;
  } else if (range === "30d") {
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      periods.push({ start, end, key: start.toISOString().slice(0, 10) });
    }
    return periods;
  } else if (range === "6m") {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      periods.push({ start, end, key: start.toISOString().slice(0, 7) });
    }
    return periods;
  } else {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      periods.push({ start, end, key: start.toISOString().slice(0, 7) });
    }
    return periods;
  }
}

export async function getAdminOverview(range: "7d" | "30d" | "6m" | "12m") {
  try {
    await requireAdmin();
    const { startCurrent, end, startPrevious, endPrevious } = getDateRange(range);

    const allUsers = await db.select({ id: user.id, email: user.email, createdAt: user.createdAt, role: user.role, emailVerified: user.emailVerified, name: user.name, image: user.image, updatedAt: user.updatedAt }).from(user);
    const allAccounts = await db.select().from(account);
    const allBudgets = await db.select().from(Budgets);
    const allExpenses = await db.select().from(Expenses);

    const budgetById = new Map<number, typeof Budgets.$inferSelect>();
    for (const b of allBudgets) budgetById.set(b.id, b);

    const expensesParsed: Array<{ expense: typeof Expenses.$inferSelect; date: Date | null; amount: number; ownerEmail: string | null }> = [];
    for (const exp of allExpenses) {
      const d = parseExpenseDate(exp.createdAt);
      const amt = Number(exp.amount);
      const b = exp.budgetId != null ? budgetById.get(exp.budgetId) : undefined;
      expensesParsed.push({ expense: exp, date: d, amount: Number.isFinite(amt) ? amt : 0, ownerEmail: b?.createdBy ?? null });
    }

    const usersTotal = allUsers.length;
    const usersCurrentNew = allUsers.filter(u => {
      const c = new Date(u.createdAt);
      return c >= startCurrent && c <= end;
    }).length;
    const usersPreviousNew = allUsers.filter(u => {
      const c = new Date(u.createdAt);
      return c >= startPrevious && c <= endPrevious;
    }).length;

    const budgetIdsCurrent = new Set<number>();
    const budgetIdsPrevious = new Set<number>();
    for (const ep of expensesParsed) {
      if (ep.date && ep.date >= startCurrent && ep.date <= end && ep.expense.budgetId != null) budgetIdsCurrent.add(ep.expense.budgetId);
      if (ep.date && ep.date >= startPrevious && ep.date <= endPrevious && ep.expense.budgetId != null) budgetIdsPrevious.add(ep.expense.budgetId);
    }
    const budgetsCurrent = budgetIdsCurrent.size;
    const budgetsPrevious = budgetIdsPrevious.size;

    const expensesCurrent = expensesParsed.filter(ep => ep.date && ep.date >= startCurrent && ep.date <= end).length;
    const expensesPrevious = expensesParsed.filter(ep => ep.date && ep.date >= startPrevious && ep.date <= endPrevious).length;

    const totalSpentCurrent = expensesParsed.filter(ep => ep.date && ep.date >= startCurrent && ep.date <= end).reduce((s, ep) => s + ep.amount, 0);
    const totalSpentPrevious = expensesParsed.filter(ep => ep.date && ep.date >= startPrevious && ep.date <= endPrevious).reduce((s, ep) => s + ep.amount, 0);

    const activeUsersSetCurrent = new Set<string>();
    const activeUsersSetPrevious = new Set<string>();
    for (const ep of expensesParsed) {
      if (ep.date && ep.date >= startCurrent && ep.date <= end && ep.ownerEmail) activeUsersSetCurrent.add(ep.ownerEmail);
      if (ep.date && ep.date >= startPrevious && ep.date <= endPrevious && ep.ownerEmail) activeUsersSetPrevious.add(ep.ownerEmail);
    }
    const activeUsersCurrent = activeUsersSetCurrent.size;
    const activeUsersPrevious = activeUsersSetPrevious.size;

    const sparkPeriods = getSparklinePeriods(range);
    const sparklineUsers: number[] = [];
    const sparklineExpenses: number[] = [];
    const sparklineSpent: number[] = [];
    for (const p of sparkPeriods) {
      const newUsersP = allUsers.filter(u => { const c = new Date(u.createdAt); return c >= p.start && c <= p.end; }).length;
      sparklineUsers.push(newUsersP);
      const expsP = expensesParsed.filter(ep => ep.date && ep.date >= p.start && ep.date <= p.end);
      sparklineExpenses.push(expsP.length);
      sparklineSpent.push(round2(expsP.reduce((s, ep) => s + ep.amount, 0)));
    }

    const seriesPeriods = getSeriesPeriods(range);
    const signupsSeries = seriesPeriods.map(p => {
      const count = allUsers.filter(u => { const c = new Date(u.createdAt); return c >= p.start && c <= p.end; }).length;
      return { key: p.key, count };
    });
    const expensesTotalSeries = seriesPeriods.map(p => {
      const total = expensesParsed.filter(ep => ep.date && ep.date >= p.start && ep.date <= p.end).reduce((s, ep) => s + ep.amount, 0);
      return { key: p.key, total: round2(total) };
    });

    const verifiedUsers = allUsers.filter(u => u.emailVerified).length;
    const verifiedRate = usersTotal === 0 ? 0 : round2(verifiedUsers / usersTotal);

    const adminsCount = allUsers.filter(u => u.role === "admin").length;
    const usersCount = allUsers.filter(u => u.role === "user").length;
    const roleSplit = { admins: adminsCount, users: usersCount };

    const googleUserIds = new Set<string>();
    for (const acc of allAccounts) {
      if (acc.providerId && String(acc.providerId).toLowerCase() === "google") {
        googleUserIds.add(acc.userId);
      }
    }
    let googleCount = 0;
    let emailCount = 0;
    for (const u of allUsers) {
      if (googleUserIds.has(u.id)) googleCount++;
      else emailCount++;
    }
    const signupSources = { google: googleCount, email: emailCount };

    return {
      ok: true,
      data: {
        range,
        totals: {
          users: { current: usersTotal, previous: usersTotal, change: percentChange(usersTotal, usersTotal) },
          newUsers: { current: usersCurrentNew, previous: usersPreviousNew, change: percentChange(usersCurrentNew, usersPreviousNew) },
          budgets: { current: budgetsCurrent, previous: budgetsPrevious, change: percentChange(budgetsCurrent, budgetsPrevious) },
          expenses: { current: expensesCurrent, previous: expensesPrevious, change: percentChange(expensesCurrent, expensesPrevious) },
          totalSpent: { current: round2(totalSpentCurrent), previous: round2(totalSpentPrevious), change: percentChange(totalSpentCurrent, totalSpentPrevious) },
          activeUsers: { current: activeUsersCurrent, previous: activeUsersPrevious, change: percentChange(activeUsersCurrent, activeUsersPrevious) },
        },
        sparklines: {
          users: sparklineUsers,
          expenses: sparklineExpenses,
          spent: sparklineSpent.map(v => round2(v)),
        },
        signupsSeries,
        expensesTotalSeries,
        verifiedRate,
        roleSplit,
        signupSources,
      }
    };
  } catch (e) {
    return { ok: false, message: "Failed to get admin overview" };
  }
}

export async function getTopUsers(limit = 5) {
  try {
    await requireAdmin();
    const lim = typeof limit === "number" && limit > 0 ? limit : 5;
    const allUsers = await db.select().from(user);
    const allBudgets = await db.select().from(Budgets);
    const allExpenses = await db.select().from(Expenses);

    const budgetById = new Map<number, typeof Budgets.$inferSelect>();
    for (const b of allBudgets) budgetById.set(b.id, b);

    const statsByEmail: Record<string, { total: number, count: number }> = {};
    for (const exp of allExpenses) {
      const b = exp.budgetId != null ? budgetById.get(exp.budgetId) : undefined;
      const email = b?.createdBy;
      if (!email) continue;
      const amt = Number(exp.amount);
      if (!statsByEmail[email]) statsByEmail[email] = { total: 0, count: 0 };
      statsByEmail[email].total += Number.isFinite(amt) ? amt : 0;
      statsByEmail[email].count += 1;
    }

    const result = allUsers
      .map(u => ({
        name: u.name,
        email: u.email,
        expenseCount: statsByEmail[u.email]?.count || 0,
        total: round2(statsByEmail[u.email]?.total || 0),
      }))
      .sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return b.expenseCount - a.expenseCount;
      })
      .slice(0, lim);

    return result;
  } catch (e) {
    return [];
  }
}

function escapeLikeInput(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export async function getUsersPage({ page, pageSize, search, role, verified }: { page: number, pageSize: number, search?: string, role?: string, verified?: boolean | string }) {
  try {
    await requireAdmin();
    const p = typeof page === "number" && page > 0 ? page : 1;
    const ps = typeof pageSize === "number" && pageSize > 0 ? Math.min(pageSize, 50) : 10;

    const allUsers = await db.select().from(user);
    const allBudgets = await db.select().from(Budgets);
    const allExpenses = await db.select().from(Expenses);

    const budgetCountByEmail: Record<string, number> = {};
    for (const b of allBudgets) {
      budgetCountByEmail[b.createdBy] = (budgetCountByEmail[b.createdBy] || 0) + 1;
    }
    const budgetById = new Map<number, typeof Budgets.$inferSelect>();
    for (const b of allBudgets) budgetById.set(b.id, b);
    const expenseCountByEmail: Record<string, number> = {};
    for (const exp of allExpenses) {
      const b = exp.budgetId != null ? budgetById.get(exp.budgetId) : undefined;
      const email = b?.createdBy;
      if (!email) continue;
      expenseCountByEmail[email] = (expenseCountByEmail[email] || 0) + 1;
    }

    let filtered = allUsers.slice();
    if (search && typeof search === "string" && search.trim() !== "") {
      const raw = String(search);
      const escaped = escapeLikeInput(raw);
      const term = escaped.toLowerCase();
      filtered = filtered.filter((u) => {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        return name.includes(term) || email.includes(term);
      });
    }

    if (role && typeof role === "string") {
      filtered = filtered.filter((u) => u.role === role);
    }
    if (verified !== undefined && verified !== null) {
      const v = verified === true || verified === "true";
      filtered = filtered.filter((u) => u.emailVerified === v);
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / ps));
    const start = (p - 1) * ps;
    const paged = filtered.slice(start, start + ps).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: u.emailVerified,
      image: u.image,
      role: u.role,
      createdAt: u.createdAt,
      budgetCount: budgetCountByEmail[u.email] || 0,
      expenseCount: expenseCountByEmail[u.email] || 0,
    }));

    return { ok: true, data: { users: paged, total, page: p, pageSize: ps, totalPages } };
  } catch (e) {
    return { ok: false, message: "Failed to get users page" };
  }
}

export async function getRecentActivity(limit = 15) {
  try {
    await requireAdmin();
    const lim = typeof limit === "number" && limit > 0 ? limit : 15;
    const allExpenses = await db.select().from(Expenses);
    const allBudgets = await db.select().from(Budgets);
    const allUsers = await db.select().from(user);

    const budgetById = new Map<number, typeof Budgets.$inferSelect>();
    for (const b of allBudgets) budgetById.set(b.id, b);
    const userByEmail = new Map<string, typeof user.$inferSelect>();
    for (const u of allUsers) userByEmail.set(u.email, u);

    const items: any[] = [];
    for (const exp of allExpenses) {
      const b = exp.budgetId != null ? budgetById.get(exp.budgetId) : undefined;
      const owner = b?.createdBy ? userByEmail.get(b.createdBy) : undefined;
      items.push({
        id: exp.id,
        name: exp.name,
        amount: exp.amount,
        createdAt: exp.createdAt,
        expenseDate: parseExpenseDate(exp.createdAt)?.toISOString() || exp.createdAt,
        date: exp.createdAt,
        budgetName: b?.name || "",
        budgetId: exp.budgetId,
        userName: owner?.name || "",
        userEmail: owner?.email || b?.createdBy || "",
        type: 'expense',
      });
    }
    items.sort((a, b) => {
      const da = parseExpenseDate(a.createdAt)?.getTime() || 0;
      const dbt = parseExpenseDate(b.createdAt)?.getTime() || 0;
      if (dbt !== da) return dbt - da;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
    return items.slice(0, lim);
  } catch (e) {
    return [];
  }
}


export async function updateUserRole(userId: string, newRole: string) {
  try {
    const session = await requireAdmin();
    if (newRole !== "user" && newRole !== "admin") {
      throw new Error("Invalid role");
    }

    const allAdmins = await db.select().from(user).where(eq(user.role, "admin"));
    if (allAdmins.length <= 1) {
      const [target] = await db.select().from(user).where(eq(user.id, userId));
      if (target && target.role === "admin" && newRole === "user") {
        throw new Error("Cannot remove the last remaining admin");
      }
    }
    if (session.user.id === userId && newRole === "user") {
      throw new Error("Cannot demote yourself");
    }

    const [updated] = await db
      .update(user)
      .set({ role: newRole })
      .where(eq(user.id, userId))
      .returning({ id: user.id, name: user.name, email: user.email, role: user.role });

    return updated;
  } catch (e: any) {
    throw e;
  }
}

export async function getAllUsers() {
  try {
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
        expenseCount: sql<number>`coalesce((select count(*)::int from ${Expenses} where ${Expenses.budgetId} in (select ${Budgets.id} from ${Budgets} where ${Budgets.createdBy} = ${user.email})), 0)`.mapWith(Number),
      })
      .from(user)
      .orderBy(desc(user.createdAt));

    return usersWithCounts;
  } catch (e) {
    return [];
  }
}

export async function getAdminStats() {
  try {
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
  } catch (e) {
    return { totalUsers: 0, totalExpenses: 0, totalBudgets: 0, signupsThisWeek: 0, signupsThisMonth: 0 };
  }
}

export async function getSignupsLast30Days() {
  try {
    await requireAdmin();

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
  } catch (e) {
    return [];
  }
}

export async function getExpensesLast7Days() {
  try {
    await requireAdmin();

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

    return result.rows.map((row) => ({
      date: row.date,
      total: Number(row.total),
      count: row.count,
    }));
  } catch (e) {
    return [];
  }
}

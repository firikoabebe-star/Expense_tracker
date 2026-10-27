"use server";

import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

import {
  addDays,
  addMonths,
  aggregateBuckets,
  buildDayBuckets,
  buildMonthBuckets,
  MONTH_LABELS,
  roundMoney,
} from "/lib/analytics";
import { auth } from "/lib/auth";
import {
  MAX_BUDGET_AMOUNT,
  MAX_EXPENSE_AMOUNT,
  formatCurrency,
  parseExpenseDate,
} from "/lib/utils";
import { db } from "/utils/dbConfig";
import { Budgets, Expenses } from "/utils/schema";

export type DashboardRange = "7d" | "30d" | "6m" | "12m";

export type MetricComparison = {
  current: number;
  previous: number;
  changePct: number | null;
};

export type DashboardTotals = {
  totalBudget: MetricComparison;
  totalSpent: MetricComparison;
  remaining: MetricComparison;
  budgetCount: MetricComparison;
  expenseCount: MetricComparison;
};

export type SpendingPoint = {
  key: string;
  label: string;
  value: number;
  cumulative: number;
};

export type BudgetBreakdown = {
  id: number;
  name: string;
  amount: number;
  spent: number;
  pct: number;
};

export type TopExpense = {
  id: number;
  name: string;
  amount: number;
  budgetName: string;
  createdAt: string;
};

export type MonthTarget = {
  spent: number;
  budget: number;
  pct: number;
};

export type Sparklines = {
  budget: number[];
  spent: number[];
  expenseCount: number[];
};

export type DashboardOverview = {
  range: DashboardRange;
  totals: DashboardTotals;
  series: SpendingPoint[];
  byBudget: BudgetBreakdown[];
  topExpenses: TopExpense[];
  monthTarget: MonthTarget;
  sparklines: Sparklines;
};

export type LargestExpense = TopExpense & {
  formattedAmount: string;
};

export type ExpenseStats = {
  total: number;
  totalFormatted: string;
  count: number;
  averagePerExpense: number;
  largestExpense: LargestExpense | null;
  thisMonthCount: number;
  lastMonthCount: number;
  busiestWeekday: { weekday: string; count: number } | null;
};

export type MonthlyReportMonth = {
  month: number;
  key: string;
  label: string;
  total: number;
  count: number;
};

export type MonthlyReportBudget = BudgetBreakdown & {
  count: number;
};

export type MonthlyReport = {
  year: number;
  total: number;
  count: number;
  months: MonthlyReportMonth[];
  byBudget: MonthlyReportBudget[];
};

export type AnalyticsResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

type RangeConfig = {
  kind: "day" | "month";
  count: number;
};

type BudgetRecord = {
  id: number;
  name: string;
  amount: number;
};

type ExpenseRecord = {
  id: number;
  name: string;
  amount: number;
  budgetId: number;
  createdAt: string;
  date: Date;
};

type UserAnalyticsData = {
  budgets: BudgetRecord[];
  expenses: ExpenseRecord[];
  budgetById: Map<number, BudgetRecord>;
};

const RANGE_CONFIG: Record<DashboardRange, RangeConfig> = {
  "7d": { kind: "day", count: 7 },
  "30d": { kind: "day", count: 30 },
  "6m": { kind: "month", count: 6 },
  "12m": { kind: "month", count: 12 },
};

const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function isDashboardRange(value: unknown): value is DashboardRange {
  return (
    value === "7d" || value === "30d" || value === "6m" || value === "12m"
  );
}

function toMoney(value: string | number, max: number): number {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return roundMoney(Math.min(amount, max));
}

function percentage(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return roundMoney((part / whole) * 100);
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return roundMoney(((current - previous) / previous) * 100);
}

function metric(current: number, previous: number): MetricComparison {
  return {
    current,
    previous,
    changePct: percentChange(current, previous),
  };
}

function sumExpenses(expenses: ExpenseRecord[]): number {
  return roundMoney(
    expenses.reduce((total, expense) => total + expense.amount, 0)
  );
}

function failure(error: unknown): { ok: false; message: string } {
  return {
    ok: false,
    message:
      error instanceof Error && error.message === "Unauthorized"
        ? "Unauthorized"
        : "Unable to load analytics.",
  };
}

async function loadUserAnalyticsData(): Promise<UserAnalyticsData> {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  if (!email) throw new Error("Unauthorized");

  const budgetRows = await db
    .select({
      id: Budgets.id,
      name: Budgets.name,
      amount: Budgets.amount,
    })
    .from(Budgets)
    .where(eq(Budgets.createdBy, email));

  const budgets: BudgetRecord[] = budgetRows.map((budget) => ({
    id: budget.id,
    name: budget.name,
    amount: toMoney(budget.amount, MAX_BUDGET_AMOUNT),
  }));

  const budgetById = new Map<number, BudgetRecord>();
  for (const budget of budgets) budgetById.set(budget.id, budget);

  const budgetIds = budgets.map((budget) => budget.id);
  const expenseRows = budgetIds.length
    ? await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          budgetId: Expenses.budgetId,
          createdAt: Expenses.createdAt,
        })
        .from(Expenses)
        .where(inArray(Expenses.budgetId, budgetIds))
    : [];

  const expenses: ExpenseRecord[] = [];

  for (const expense of expenseRows) {
    if (expense.budgetId === null) continue;
    if (!budgetById.has(expense.budgetId)) continue;

    const date = parseExpenseDate(expense.createdAt);
    if (!date) continue;

    expenses.push({
      id: expense.id,
      name: expense.name,
      amount: toMoney(expense.amount, MAX_EXPENSE_AMOUNT),
      budgetId: expense.budgetId,
      createdAt: expense.createdAt,
      date,
    });
  }

  return { budgets, expenses, budgetById };
}

export async function getDashboardOverview(
  range: DashboardRange
): Promise<AnalyticsResult<DashboardOverview>> {
  try {
    if (!isDashboardRange(range)) {
      return {
        ok: false,
        message: "Invalid range. Choose 7d, 30d, 6m, or 12m.",
      };
    }

    const { budgets, expenses, budgetById } = await loadUserAnalyticsData();
    const config = RANGE_CONFIG[range];
    const now = new Date();

    const buckets =
      config.kind === "day"
        ? buildDayBuckets(now, config.count)
        : buildMonthBuckets(now, config.count);

    const currentStart = buckets[0].start;
    const currentEnd = buckets[buckets.length - 1].end;
    const previousStart =
      config.kind === "day"
        ? addDays(currentStart, -config.count)
        : addMonths(currentStart, -config.count);
    const previousEnd = currentStart;

    const currentExpenses = expenses.filter(
      (expense) =>
        expense.date >= currentStart && expense.date < currentEnd
    );
    const previousExpenses = expenses.filter(
      (expense) =>
        expense.date >= previousStart && expense.date < previousEnd
    );

    const totalBudgetAmount = roundMoney(
      budgets.reduce((total, budget) => total + budget.amount, 0)
    );
    const currentSpent = sumExpenses(currentExpenses);
    const previousSpent = sumExpenses(previousExpenses);
    const currentRemaining = roundMoney(totalBudgetAmount - currentSpent);
    const previousRemaining = roundMoney(totalBudgetAmount - previousSpent);

    const totals: DashboardTotals = {
      totalBudget: metric(totalBudgetAmount, totalBudgetAmount),
      totalSpent: metric(currentSpent, previousSpent),
      remaining: metric(currentRemaining, previousRemaining),
      budgetCount: metric(budgets.length, budgets.length),
      expenseCount: metric(
        currentExpenses.length,
        previousExpenses.length
      ),
    };

    const bucketTotals = aggregateBuckets(
      buckets,
      currentExpenses.map((expense) => ({
        date: expense.date,
        amount: expense.amount,
      }))
    );

    const series: SpendingPoint[] = buckets.map((bucket, index) => ({
      key: bucket.key,
      label: bucket.label,
      value: roundMoney(bucketTotals.values[index]),
      cumulative: roundMoney(bucketTotals.cumulative[index]),
    }));

    const spentByBudget = new Map<number, number>();
    for (const expense of currentExpenses) {
      spentByBudget.set(
        expense.budgetId,
        (spentByBudget.get(expense.budgetId) ?? 0) + expense.amount
      );
    }

    const byBudget: BudgetBreakdown[] = budgets
      .map((budget) => {
        const spent = roundMoney(spentByBudget.get(budget.id) ?? 0);
        return {
          id: budget.id,
          name: budget.name,
          amount: budget.amount,
          spent,
          pct: percentage(spent, budget.amount),
        };
      })
      .sort((a, b) => b.spent - a.spent || a.name.localeCompare(b.name));

    const topExpenses: TopExpense[] = [...currentExpenses]
      .sort(
        (a, b) =>
          b.amount - a.amount || b.date.getTime() - a.date.getTime()
      )
      .slice(0, 5)
      .map((expense) => ({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        budgetName: budgetById.get(expense.budgetId)?.name ?? "Unknown",
        createdAt: expense.createdAt,
      }));

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const thisMonthSpent = sumExpenses(
      expenses.filter(
        (expense) =>
          expense.date >= thisMonthStart && expense.date < nextMonthStart
      )
    );

    const monthTarget: MonthTarget = {
      spent: thisMonthSpent,
      budget: totalBudgetAmount,
      pct: percentage(thisMonthSpent, totalBudgetAmount),
    };

    const sparklineBuckets =
      config.kind === "day"
        ? buildDayBuckets(now, 12)
        : buildMonthBuckets(now, 12);
    const sparklineSpending = aggregateBuckets(
      sparklineBuckets,
      expenses.map((expense) => ({
        date: expense.date,
        amount: expense.amount,
      }))
    );
    const sparklineCounts = aggregateBuckets(
      sparklineBuckets,
      expenses.map((expense) => ({
        date: expense.date,
        amount: 1,
      }))
    ).values;

    const sparklines: Sparklines = {
      budget: sparklineBuckets.map(() => totalBudgetAmount),
      spent: sparklineSpending.values.map(roundMoney),
      expenseCount: sparklineCounts,
    };

    return {
      ok: true,
      data: {
        range,
        totals,
        series,
        byBudget,
        topExpenses,
        monthTarget,
        sparklines,
      },
    };
  } catch (error) {
    return failure(error);
  }
}

export async function getExpenseStats(): Promise<
  AnalyticsResult<ExpenseStats>
> {
  try {
    const { budgets, expenses, budgetById } =
      await loadUserAnalyticsData();
    const total = sumExpenses(expenses);
    const count = expenses.length;
    const averagePerExpense =
      count > 0 ? roundMoney(total / count) : 0;

    const largest =
      count > 0
        ? [...expenses].sort(
            (a, b) =>
              b.amount - a.amount ||
              b.date.getTime() - a.date.getTime()
          )[0]
        : null;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const lastMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const thisMonthCount = expenses.filter(
      (expense) =>
        expense.date >= thisMonthStart && expense.date < nextMonthStart
    ).length;
    const lastMonthCount = expenses.filter(
      (expense) =>
        expense.date >= lastMonthStart && expense.date < thisMonthStart
    ).length;

    const weekdayCounts = new Array<number>(7).fill(0);
    for (const expense of expenses) {
      weekdayCounts[expense.date.getDay()] += 1;
    }

    let busiestWeekday: { weekday: string; count: number } | null = null;
    for (let index = 0; index < weekdayCounts.length; index += 1) {
      const weekdayCount = weekdayCounts[index];
      if (weekdayCount > (busiestWeekday?.count ?? 0)) {
        busiestWeekday = {
          weekday: WEEKDAY_LABELS[index],
          count: weekdayCount,
        };
      }
    }

    const largestExpense: LargestExpense | null = largest
      ? {
          id: largest.id,
          name: largest.name,
          amount: largest.amount,
          budgetName: budgetById.get(largest.budgetId)?.name ?? "Unknown",
          createdAt: largest.createdAt,
          formattedAmount: formatCurrency(largest.amount),
        }
      : null;

    return {
      ok: true,
      data: {
        total,
        totalFormatted: formatCurrency(total),
        count,
        averagePerExpense,
        largestExpense,
        thisMonthCount,
        lastMonthCount,
        busiestWeekday,
      },
    };
  } catch (error) {
    return failure(error);
  }
}

export type ExpenseBudgetTag = {
  id: number;
  budgetName: string;
};

/**
 * Read-only lookup that labels each expense with the budget it belongs to.
 * Additive helper for the expense list: the actions above are unchanged.
 */
export async function getExpenseBudgetTags(): Promise<
  AnalyticsResult<ExpenseBudgetTag[]>
> {
  try {
    const { expenses, budgetById } = await loadUserAnalyticsData();
    return {
      ok: true,
      data: expenses.map((expense) => ({
        id: expense.id,
        budgetName: budgetById.get(expense.budgetId)?.name ?? "Unknown",
      })),
    };
  } catch (error) {
    return failure(error);
  }
}

export async function getMonthlyReport(
  year: number
): Promise<AnalyticsResult<MonthlyReport>> {
  try {
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return {
        ok: false,
        message: "Year must be an integer between 2000 and 2100.",
      };
    }

    const { budgets, expenses } = await loadUserAnalyticsData();
    const yearExpenses = expenses.filter(
      (expense) => expense.date.getFullYear() === year
    );
    const buckets = buildMonthBuckets(new Date(year, 11, 1), 12);

    const months: MonthlyReportMonth[] = buckets.map((bucket, index) => {
      const monthExpenses = yearExpenses.filter(
        (expense) =>
          expense.date >= bucket.start && expense.date < bucket.end
      );
      return {
        month: index + 1,
        key: bucket.key,
        label: MONTH_LABELS[index],
        total: sumExpenses(monthExpenses),
        count: monthExpenses.length,
      };
    });

    const spentByBudget = new Map<number, number>();
    const countByBudget = new Map<number, number>();
    for (const expense of yearExpenses) {
      spentByBudget.set(
        expense.budgetId,
        (spentByBudget.get(expense.budgetId) ?? 0) + expense.amount
      );
      countByBudget.set(
        expense.budgetId,
        (countByBudget.get(expense.budgetId) ?? 0) + 1
      );
    }

    const byBudget: MonthlyReportBudget[] = budgets
      .map((budget) => {
        const spent = roundMoney(spentByBudget.get(budget.id) ?? 0);
        return {
          id: budget.id,
          name: budget.name,
          amount: budget.amount,
          spent,
          pct: percentage(spent, budget.amount),
          count: countByBudget.get(budget.id) ?? 0,
        };
      })
      .sort((a, b) => b.spent - a.spent || a.name.localeCompare(b.name));

    return {
      ok: true,
      data: {
        year,
        total: sumExpenses(yearExpenses),
        count: yearExpenses.length,
        months,
        byBudget,
      },
    };
  } catch (error) {
    return failure(error);
  }
}

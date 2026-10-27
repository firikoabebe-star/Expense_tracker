export interface PeriodBucket {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function buildDayBuckets(end: Date, count: number): PeriodBucket[] {
  const lastDay = startOfDay(end);
  const firstDay = addDays(lastDay, -(count - 1));

  return Array.from({ length: count }, (_, index) => {
    const start = addDays(firstDay, index);
    const next = addDays(start, 1);
    return {
      key: dayKey(start),
      label: `${padTwo(start.getDate())}/${padTwo(start.getMonth() + 1)}`,
      start,
      end: next,
    };
  });
}

export function buildMonthBuckets(end: Date, count: number): PeriodBucket[] {
  const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  const firstMonth = addMonths(lastMonth, -(count - 1));

  return Array.from({ length: count }, (_, index) => {
    const start = addMonths(firstMonth, index);
    const next = addMonths(start, 1);
    return {
      key: monthKey(start),
      label: `${MONTH_LABELS[start.getMonth()]} ${start.getFullYear()}`,
      start,
      end: next,
    };
  });
}

export function findBucketIndex(
  buckets: PeriodBucket[],
  date: Date
): number {
  for (let index = 0; index < buckets.length; index += 1) {
    const bucket = buckets[index];
    if (date >= bucket.start && date < bucket.end) return index;
  }
  return -1;
}

export function aggregateBuckets(
  buckets: PeriodBucket[],
  entries: Array<{ date: Date; amount: number }>
): { values: number[]; cumulative: number[] } {
  const values = buckets.map(() => 0);

  for (const entry of entries) {
    const index = findBucketIndex(buckets, entry.date);
    if (index !== -1) values[index] += entry.amount;
  }

  let running = 0;
  const cumulative = values.map((value) => {
    running += value;
    return running;
  });

  return { values, cumulative };
}

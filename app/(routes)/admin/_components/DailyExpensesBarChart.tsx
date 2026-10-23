"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "/components/ui/chart"
import { formatCurrency, parseDayKey } from "/lib/utils"

interface DailyExpense {
  date: string;
  total: number;
  count: number;
}

interface DailyExpensesBarChartProps {
  data: DailyExpense[];
}

const chartConfig = {
  total: {
    label: "Total Expenses",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export default function DailyExpensesBarChart({ data }: DailyExpensesBarChartProps) {
  const hasExpenses = data.some((entry) => entry.total > 0);

  if (data.length === 0 || !hasExpenses) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Daily Expenses</CardTitle>
          <CardDescription>Total expenses logged per day over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-sm">No expenses logged in the last 7 days.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Daily Expenses</CardTitle>
        <CardDescription>Total expenses logged per day over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => {
                const d = parseDayKey(value);
                return d
                  ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : value;
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => {
                    const d = parseDayKey(String(label));
                    return d
                      ? d.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : String(label);
                  }}
                  formatter={(value, name, item) => (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {formatCurrency(Number(value))}
                    </span>
                  )}
                />
              }
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

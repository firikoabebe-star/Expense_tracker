"use client"

import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
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
import type { BudgetSummary } from "/types"

interface PieChartDashboardProps {
  budgetList: BudgetSummary[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const FALLBACK_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c",
  "#d0ed57", "#8dd1e1", "#83a6ed", "#f97316", "#06b6d4",
];

export default function PieChartDashboard({ budgetList }: PieChartDashboardProps) {
  const data = budgetList
    .filter((b) => b.totalSpend > 0)
    .map((b) => ({ name: b.name, value: b.totalSpend }));

  if (data.length === 0) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Spend Distribution</CardTitle>
          <CardDescription>How your spending is split across budgets.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-sm">No spending data yet.</p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((d, i) => [
      d.name,
      { label: d.name, color: COLORS[i % COLORS.length] },
    ])
  );

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Spend Distribution</CardTitle>
        <CardDescription>How your spending is split across budgets.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {Number(value).toLocaleString()}
                    </span>
                  )}
                />
              }
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                  className="stroke-background"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

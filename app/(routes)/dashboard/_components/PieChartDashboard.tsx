"use client"

import { Pie, PieChart, Cell } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "/components/ui/chart"
import type { BudgetSummary } from "/types"
import { formatCurrency } from "/lib/utils"

interface PieChartDashboardProps {
  budgetList: BudgetSummary[];
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
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
        <CardContent className="flex items-center justify-center h-[278px]">
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
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="stroke-card"
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" className="flex-wrap gap-x-4 gap-y-2" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

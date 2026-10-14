"use client"

import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts"
import React, { useMemo } from 'react'
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

interface BarChartDashboardProps {
  budgetList: BudgetSummary[];
}

const chartConfig = {
  totalSpend: {
    label: "Total Spend",
    color: "hsl(var(--chart-1))",
  },
  amount: {
    label: "Budget Amount",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function BarChartDashboard({ budgetList }: BarChartDashboardProps) {
  const chartData = useMemo(() => {
    if (!budgetList) return [];
    return budgetList.map((budget) => ({
      name: budget.name,
      totalSpend: budget.totalSpend || 0,
      amount: Number(budget.amount),
    }));
  }, [budgetList]);

  if (chartData.length === 0) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            Comparison of your allocated budget vs. actual spending.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-sm">No budget data yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          Comparison of your allocated budget vs. actual spending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="totalSpend"
              fill="var(--color-totalSpend)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

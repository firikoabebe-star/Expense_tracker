"use client"

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
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
import { formatCompactCurrency, formatCurrency } from "/lib/utils"

interface BarChartDashboardProps {
  budgetList: BudgetSummary[];
}

const chartConfig = {
  totalSpend: {
    label: "Total Spend",
    color: "var(--chart-1)",
  },
  amount: {
    label: "Budget Amount",
    color: "var(--chart-2)",
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
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--clr-border-mid)"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ style: { fill: "var(--clr-text-2)" } }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={(value: number) => formatCompactCurrency(value)}
              tick={{ width: 120, style: { fill: "var(--clr-text-2)", fontSize: 11 } }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="border-border bg-background text-foreground"
                  formatter={(value, name) => (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {formatCurrency(Number(value))}
                    </span>
                  )}
                />
              }
              cursor={{ fill: "var(--muted)" }}
            />
            <ChartLegend content={<ChartLegendContent className="text-foreground" />} />
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

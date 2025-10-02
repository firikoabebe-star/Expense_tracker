"use client"

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "/components/ui/card"

export default function BarChartDashboard({ budgetList }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (budgetList) {
      const data = budgetList.map(budget => ({
        name: budget.name,
        totalSpend: budget.totalSpend || 0,
        amount: Number(budget.amount)
      }));
      setChartData(data);
    }
  }, [budgetList]);

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          Comparison of your allocated budget vs. actual spending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
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
            <Tooltip />
            <Legend />
            <Bar
              dataKey="totalSpend"
              name="Total Spend"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="amount"
              name="Budget Amount"
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

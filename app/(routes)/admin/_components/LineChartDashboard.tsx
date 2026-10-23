"use client"

import { Line, LineChart, XAxis, YAxis } from "recharts"
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
import { parseDayKey } from "/lib/utils"

interface SignupData {
  date: string;
  count: number;
}

interface LineChartDashboardProps {
  data: SignupData[];
}

const chartConfig = {
  count: {
    label: "Signups",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function LineChartDashboard({ data }: LineChartDashboardProps) {
  const hasSignups = data.some((entry) => entry.count > 0);

  if (data.length === 0 || !hasSignups) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>User Signups</CardTitle>
          <CardDescription>New user registrations over the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-sm">No signups in the last 30 days.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>User Signups</CardTitle>
        <CardDescription>New user registrations over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
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
                />
              }
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-count)" }}
              activeDot={{ r: 5, fill: "var(--color-count)", stroke: "var(--color-count)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

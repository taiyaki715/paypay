"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  budget: {
    label: "予算",
    color: "var(--chart-2)",
  },
  spending: {
    label: "支出",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface CategoryBudgetChartProps {
  chartData: Array<{
    category: string;
    budget: number;
    spending: number;
  }>;
  year: number;
  month: number;
}

export function CategoryBudgetChart({
  chartData,
  year,
  month,
}: CategoryBudgetChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>カテゴリ別予算</CardTitle>
        <CardDescription>
          {year}年{month}月の予算と支出
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            予算が設定されているカテゴリがありません
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  // Limit category name length for display
                  return value.length > 8 ? `${value.slice(0, 8)}...` : value;
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex flex-1 justify-between items-center leading-none">
                        <div className="grid gap-1.5">
                          <span className="text-muted-foreground">
                            {chartConfig[name as keyof typeof chartConfig]
                              ?.label || name}
                          </span>
                        </div>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          ¥{Number(value).toLocaleString()}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="budget"
                fill="var(--color-budget)"
                fillOpacity={0.3}
                radius={4}
              />
              <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          各カテゴリの月間予算と実際の支出を比較できます
        </div>
      </CardFooter>
    </Card>
  );
}

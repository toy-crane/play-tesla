"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface PriceChartData {
  setAt: string;
  [trimId: string]: number | string; // priceSetAt은 string이므로 number 또는 string 타입을 받을 수 있도록 설정
}

const chartData: PriceChartData[] = [
  {
    setAt: "2023-01-01",
    modelx: 186,
    models: 80,
    modely: 80,
    model3: 80,
  },
  {
    setAt: "2024-08-02",
    modelx: 25,
    models: 25,
    modely: 25,
    model3: 25,
  },
];

const chartConfig = {
  modelx: {
    label: "modelx",
    color: "hsl(var(--chart-1))",
  },
  models: {
    label: "models",
    color: "hsl(var(--chart-2))",
  },
  modely: {
    label: "modely",
    color: "hsl(var(--chart-3))",
  },
  model3: {
    label: "model3",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function Chart() {
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="setAt"
          tickLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <Line
          dataKey="modelx"
          dot={false}
          stroke="var(--color-modelx)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="modely"
          dot={false}
          stroke="var(--color-modely)"
          strokeWidth={2}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  );
}

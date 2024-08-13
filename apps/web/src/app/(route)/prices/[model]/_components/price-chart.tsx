"use client";
import type { CustomTooltipProps } from "@tremor/react";
import { LineChart } from "@tremor/react";
import { cn } from "@/lib/utils";
import type { PriceChartData } from "../page";

const dataFormatter = (number: number) => (number / 10000).toLocaleString();

export function PriceChart({
  data,
  categories,
}: {
  data: PriceChartData[];
  categories: string[];
}) {
  const customTooltip = (props: CustomTooltipProps) => {
    const { payload, active, label } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-72 border p-2 space-y-1 rounded-md bg-card">
        <div className="border-b py-1">
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <div className="py-1">
          {payload
            .filter((p) => p.type !== "none")
            .map((category) => (
              <div
                className="flex flex-1 space-x-2.5 items-center"
                key={category.dataKey}
              >
                <span
                  className={cn(
                    "shrink-0 rounded-full border-2 h-3 w-3 border-muted",
                    `bg-${category.color!}`
                  )}
                />
                <div className="flex gap-2 flex-1 justify-between">
                  <p className="text-muted-foreground">{category.dataKey}</p>
                  <p className="font-medium">
                    {(Number(category.value) / 10000).toLocaleString()}만원
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <LineChart
        autoMinValue
        categories={categories}
        className="h-80"
        colors={["blue-700", "fuchsia-700", "cyan-700"]}
        connectNulls
        customTooltip={customTooltip}
        data={data}
        index="priceSetAt"
        valueFormatter={dataFormatter}
      />
      <span className="absolute bottom-10 right-6 z-[-10] text-sm text-muted-foreground font-medium">
        playtesla.xyz
      </span>
    </div>
  );
}

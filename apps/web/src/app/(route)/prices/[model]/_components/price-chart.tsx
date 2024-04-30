"use client";
import type { CustomTooltipProps } from "@tremor/react";
import { LineChart } from "@tremor/react";
import { cn } from "@/lib/utils";
import type { PriceChartData } from "../page";

const dataFormatter = (number: number) =>
  `${(number / 10000).toLocaleString()}`;

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
      <div className="w-64 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown space-y-1">
        <div className="border-tremor-border border-b dark:border-dark-tremor-border py-1">
          <p className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
            {label}
          </p>
        </div>
        <div className="py-1">
          {payload
            .filter((p) => p.type !== "none")
            .map((category, idx) => (
              <div className="flex flex-1 space-x-2.5 items-center" key={idx}>
                <span
                  className={cn(
                    "shrink-0 rounded-tremor-full border-2 h-3 w-3 border-tremor-background shadow-tremor-card dark:border-dark-tremor-background dark:shadow-dark-tremor-card",
                    `bg-${category.color}`
                  )}
                />
                <div className="flex gap-2 flex-1 justify-between">
                  <p className="text-tremor-content">{category.dataKey}</p>
                  <p className="font-medium text-tremor-content-emphasis">
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
        onValueChange={(value) => {
          // eslint-disable-next-line no-console -- for debugging
          console.log(value);
        }}
        valueFormatter={dataFormatter}
      />
      <span className="absolute bottom-9 right-6 z-[-10] font-semibold text-muted-foreground">
        playtesla.xyz
      </span>
    </div>
  );
}

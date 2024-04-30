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
    const { payload, active } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown space-y-1">
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
              <div className="space-y-1">
                <p className="text-tremor-content">{category.dataKey}</p>
                <p className="font-medium text-tremor-content-emphasis">
                  {(Number(category.value) / 10000).toLocaleString()} 만원
                </p>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <LineChart
      categories={categories}
      className="h-80"
      colors={["blue-700", "fuchsia-700", "cyan-700"]}
      customTooltip={customTooltip}
      data={data}
      index="priceSetAt"
      minValue={50000000}
      onValueChange={(value) => {
        // eslint-disable-next-line no-console -- for debugging
        console.log(value);
      }}
      valueFormatter={dataFormatter}
    />
  );
}

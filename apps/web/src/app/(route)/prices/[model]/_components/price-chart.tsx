"use client";
import { LineChart } from "@tremor/react";
import type { PriceChartData } from "../page";

const dataFormatter = (number: number) =>
  `${(number / 10000).toLocaleString()}만원`;

export function PriceChart({ data }: { data: PriceChartData[] }) {
  const keys = Object.keys(data[0]!).filter((key) => key !== "priceSetAt");
  return (
    <LineChart
      categories={keys}
      className="h-80"
      colors={["blue-700", "fuchsia-700", "cyan-700"]}
      data={data}
      index="priceSetAt"
      minValue={50000000}
      onValueChange={(value) => {
        // eslint-disable-next-line no-console -- for debugging
        console.log(value);
      }}
      valueFormatter={dataFormatter}
      yAxisWidth={96}
    />
  );
}

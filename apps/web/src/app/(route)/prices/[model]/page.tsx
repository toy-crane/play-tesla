import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/generated";
import { PriceChart } from "./_components/price-chart";

type CarPrice = Tables<"trim_prices"> & {
  trims: {
    slug: string;
  } | null;
};

export interface PriceChartData {
  priceSetAt: string;
  [modelSlug: string]: number | string; // priceSetAt은 string이므로 number 또는 string 타입을 받을 수 있도록 설정
}

const transformCarData = (inputData: CarPrice[]): PriceChartData[] => {
  const chartData: PriceChartData[] = [];
  const modelPrices: Record<string, number> = {}; // 모델별 최신 가격을 저장하는 객체

  inputData.forEach((car) => {
    const priceSetAt = car.price_set_at;
    const modelSlug = car.trims?.slug.replace("-", " ");
    if (!modelSlug) return;
    modelPrices[modelSlug] = car.price; // 항상 최신 가격을 업데이트

    const entry = chartData.find((d) => d.priceSetAt === priceSetAt);
    if (entry) {
      entry[modelSlug] = car.price;
    } else {
      // 새로운 entry 생성 시 모든 모델의 최신 가격으로 초기화
      const newEntry: PriceChartData = { priceSetAt };
      for (const [model, price] of Object.entries(modelPrices)) {
        newEntry[model] = price;
      }
      newEntry[modelSlug] = car.price; // 현재 차량 모델 가격 업데이트
      chartData.push(newEntry);
    }
  });

  return chartData;
};

async function Page({
  params: { model },
}: {
  params: {
    model: string;
  };
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trim_prices")
    .select("*, trims!inner(slug)")
    .like("trims.slug", `${model}-%`)
    .order("price_set_at", {
      ascending: true,
    });
  if (error) {
    throw Error(error.message);
  }

  if (data.length === 0) {
    notFound();
  }

  return (
    <div>
      <PriceChart data={transformCarData(data)} />
    </div>
  );
}

export default Page;

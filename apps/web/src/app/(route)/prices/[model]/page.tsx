import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/generated";
import { Button } from "@/components/ui/button";
import { PriceChart } from "./_components/price-chart";
import SelectModel from "./_components/select-model";
import NoticeCTA from "./_components/notice-cta";

type CarPrice = Tables<"trim_prices"> & {
  trims: {
    slug: string;
    name: string | null;
    models: {
      name: string | null;
    } | null;
  } | null;
};

export interface PriceChartData {
  priceSetAt: string;
  [modelSlug: string]: number | string; // priceSetAt은 string이므로 number 또는 string 타입을 받을 수 있도록 설정
}

export async function generateMetadata(
  { params }: { params: { model: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient();
  const { data: modelDetail, error } = await supabase
    .from("models")
    .select("*")
    .eq("slug", params.model)
    .single();

  if (error) {
    throw Error(error.message);
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const title = `테슬라 ${modelDetail.name} 가격 변화 추이`;
  const description = `테슬라 ${modelDetail.name} 출시부터 현재까지의 가격 변화 추이를 확인하세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
    twitter: {
      title,
      description,
      images: [...previousImages],
    },
    alternates: {
      canonical: `/prices/${params.model}`,
    },
  };
}

const transformCarData = (inputData: CarPrice[]): PriceChartData[] => {
  const chartData: PriceChartData[] = [];
  const modelPrices: Record<string, number> = {}; // 모델별 최신 가격을 저장하는 객체

  inputData.forEach((car) => {
    const priceSetAt = car.price_set_at;
    const modelSlug = `${car.trims?.models?.name} ${car.trims?.name}`;
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
    .select("*, trims!inner(slug,name, models(name))")
    .like("trims.slug", `${model}%`)
    .order("price_set_at", {
      ascending: true,
    });
  if (error) {
    throw Error(error.message);
  }

  if (data.length === 0) {
    notFound();
  }

  const trimModels = [
    ...new Set(
      data.map((car) => `${car.trims.models?.name} ${car.trims.name}`)
    ),
  ];
  const chartData = transformCarData(data);
  const trimName = data[0]?.trims?.slug;
  const modelName = data[0]?.trims?.models?.name;

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-left text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1] mt-4">
          테슬라 가격 변화 추이
        </h1>
      </div>
      <SelectModel className="my-4" modelSlug={model} />
      <PriceChart categories={trimModels} data={chartData} />
      <div className="flex justify-end mt-4">
        <Button variant="outline">
          <Link href={`/cars/${trimName}`} prefetch>
            {modelName} 보조금 조회하기
          </Link>
        </Button>
      </div>
      <NoticeCTA />
    </>
  );
}

export default Page;

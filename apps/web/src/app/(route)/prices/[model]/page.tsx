import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import SelectModel from "./_components/select-model";
import NoticeCTA from "./_components/notice-cta";
import PriceCharts from "./_components/price-charts";

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
      images: [
        `/og-images/${modelDetail.slug}-price-og.png`,
        ...previousImages,
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/og-images/${modelDetail.slug}-price-og.png`,
        ...previousImages,
      ],
    },
    alternates: {
      canonical: `/prices/${params.model}`,
    },
  };
}

async function Page({
  params: { model },
}: {
  params: {
    model: string;
  };
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("models")
    .select("*,trims(*)")
    .eq("slug", model)
    .single();
  if (error) {
    throw Error(error.message);
  }
  const trimName = data.trims[0]?.slug;
  const modelName = data.name;

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-left text-3xl md:text-4xl font-bold leading-tight tracking-tighter lg:leading-[1.1] mt-4">
          테슬라 차량가격 변화 추이
        </h1>
      </div>

      <SelectModel className="my-4" modelSlug={model} />
      <Suspense
        fallback={
          <div className="h-80 w-full flex items-center justify-center">
            <Loader2
              className="h-5 w-5 animate-spin"
              color="#71717A"
              size={24}
            />
          </div>
        }
      >
        <PriceCharts modelSlug={model} />
      </Suspense>
      <div className="flex items-end flex-col gap-2 mt-2">
        <Button
          asChild
          className="w-full md:max-w-[256px]"
          size="lg"
          variant="outline"
        >
          <Link href={`/cars/${trimName}`} prefetch>
            {modelName} 지역별 보조금 조회하기
          </Link>
        </Button>
      </div>
      <div className="flex justify-end">
        <Button
          asChild
          className="underline underline-offset-4 px-0 hover:bg-white text-blue-500/90 hover:text-blue-500"
          size="sm"
          variant="ghost"
        >
          <a
            href="https://slashpage.com/play-tesla/new-feature"
            rel="noreferrer"
            target="_blank"
          >
            제작자에게 피드백 보내기
          </a>
        </Button>
      </div>
      <NoticeCTA />
    </>
  );
}

export default Page;

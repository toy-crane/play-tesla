import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import regions from "@/constants/regions";
import { Button } from "@/components/ui/button";
import { getCarImageUrl } from "@/lib/image";
import { CarView } from "@/constants/image";
import PriceDetail from "./_components/price-detail";
import { SelectRegion } from "./_components/select-region";
import CarCarousel from "./_components/car-carousel";
import OrderCTA from "./_components/order-cta";
import Options, { OptionSkeleton } from "./_components/options";
import { SelectCar } from "./_components/select-car";

interface PageProps {
  params: { trim: string };
  searchParams: {
    seat?: string;
    wheel?: string;
    color?: string;
    interior?: string;
    steering?: string;
    region?: string;
  };
}

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient();
  const headersList = headers();
  const xQueryParams = headersList.get("x-query-params") || "";
  const queryParams = new URLSearchParams(xQueryParams);

  const { data: trimDetail, error } = await supabase
    .from("trims")
    .select(
      "code,name, models(code, name, colors(code),steerings(code)),wheels(code)"
    )
    .eq("slug", params.trim)
    .order("slug")
    .single();

  if (error) {
    throw Error(error.message);
  }

  const modelCode = trimDetail.models?.code;
  const trimCode = trimDetail.code;
  const colorCode =
    queryParams.get("color") || trimDetail.models?.colors[0]?.code;
  const wheelCode = queryParams.get("wheel") || trimDetail.wheels[0]?.code;

  const modelName = trimDetail.models?.name;
  const trimName = trimDetail.name;
  const regionCode = searchParams.region ?? "1100";
  const region = regions.find((r) => r.code === regionCode);
  const regionName = region?.province
    ? `${region.province} ${region.name}`
    : region?.name;

  if (
    modelCode === undefined ||
    colorCode === undefined ||
    wheelCode === undefined
  ) {
    throw new Error("Model code, color code, or wheel code is undefined");
  }

  const imageUrl = getCarImageUrl(
    modelCode,
    trimCode,
    colorCode,
    wheelCode,
    CarView.FRONT
  );

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const title = `${regionName} 테슬라 ${modelName} ${trimName} 전기차 보조금 확인하기`;
  const description = `${regionName}의 ${modelName} ${trimName} 전기차 보조금에 관한 모든 정보를 확인하세요. 잔여 보조금 수량, 옵션 가격, 최종 구매 가격을 한 눈에 확인하실 수 있습니다.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl, ...previousImages],
    },
    twitter: {
      title,
      description,
      images: [imageUrl, ...previousImages],
    },
    alternates: {
      canonical: `/cars/${params.trim}?region=${regionCode}`,
    },
  };
}

const CarSelection = async ({ trim }: { trim: string }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trims")
    .select("slug, name, models(name)");
  if (error) {
    throw new Error(error.message);
  }
  return <SelectCar slug={trim} trims={data} />;
};

export async function generateStaticParams() {
  const supabase = createBrowserClient();
  const { error, data: trims } = await supabase.from("trims").select(`slug`);
  if (error) throw new Error(error.message);
  return trims.map((trim) => ({ trim: trim.slug }));
}

function Page({ params, searchParams: { region } }: PageProps) {
  const trimSlug = decodeURIComponent(params.trim);
  const regionCode = region ?? "1100";

  return (
    <>
      <div className="pb-40">
        <section className="flex gap-2 mb-2 sticky top-0 z-10 bg-white">
          <Suspense
            fallback={
              <>
                <Skeleton className="h-[44px] w-full" />
                <Skeleton className="h-[44px] w-full" />
              </>
            }
          >
            <CarSelection trim={trimSlug} />
            <SelectRegion code={regionCode} />
          </Suspense>
        </section>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-2">
              <div className="aspect-video w-[512px] flex items-center justify-center">
                <Loader2
                  className="h-5 w-5 animate-spin"
                  color="#71717A"
                  size={24}
                />
              </div>
            </div>
          }
        >
          <CarCarousel trimSlug={trimSlug} />
        </Suspense>
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
        <section className="mb-8">
          <Suspense
            fallback={
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <Skeleton className="w-1/4 h-6" />
                  <Skeleton className="w-2/4 h-6" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="w-1/4 h-6" />
                  <Skeleton className="w-2/4 h-6" />
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <Skeleton className="w-1/4 h-6" />
                  <Skeleton className="w-2/4 h-6" />
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <Skeleton className="w-2/4 h-6" />
                </div>
              </div>
            }
          >
            <PriceDetail trimSlug={trimSlug} />
          </Suspense>
        </section>
        <Suspense fallback={<OptionSkeleton />}>
          <Options trimSlug={trimSlug} />
        </Suspense>
      </div>
      <OrderCTA code={trimSlug.split("-")[0]} />
    </>
  );
}

export default Page;

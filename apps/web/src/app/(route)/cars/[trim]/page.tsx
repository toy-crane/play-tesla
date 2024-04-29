import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { SelectCar } from "./_components/select-car";
import OptionForm from "./_components/options";
import PriceDetail from "./_components/price-detail";
import { SelectRegion } from "./_components/select-region";
import ShareButton from "./_components/share-button";
import OrderCTA from "./_components/order-cta";
import CarCarousel from "./_components/car-carousel";

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

async function Page({
  params,
  searchParams: { seat, interior, wheel, color, steering, region },
}: PageProps) {
  const trimSlug = decodeURIComponent(params.trim);
  const regionCode = region ?? "1100";

  const supabase = createClient();
  const [trimDetailResponse, subsidyResponse] = await Promise.all([
    supabase
      .from("trims")
      .select(
        "*, models(name, code, colors(*),steerings(*)),seatings(*),wheels(*),trim_prices(*), interiors(*)"
      )
      .eq("slug", trimSlug)
      .order("slug")
      .order("price_set_at", {
        referencedTable: "trim_prices",
        ascending: false,
      })
      .limit(1, { referencedTable: "trim_prices" })
      .single(),
    supabase
      .from("subsidies")
      .select("*,trims!inner(slug)")
      .eq("trims.slug", trimSlug)
      .eq("region_code", regionCode)
      .eq("year", new Date().getFullYear())
      .maybeSingle(),
  ]);

  if (trimDetailResponse.error) {
    throw new Error(trimDetailResponse.error.message);
  }

  if (subsidyResponse.error) {
    throw new Error(subsidyResponse.error.message);
  }

  const trimDetail = trimDetailResponse.data;
  const subsidy = subsidyResponse.data;

  const option = {
    seat: seat || String(trimDetail.seatings[0]?.seat_count),
    wheel: wheel || String(trimDetail.wheels[0]?.code),
    color: color || String(trimDetail.models?.colors[0]?.code),
    interior: interior || String(trimDetail.interiors[0]?.code),
    steering: steering || String(trimDetail.models?.steerings[0]?.code),
  };

  return (
    <>
      <div className="pb-40">
        <section className="flex gap-2 mb-2 sticky top-0 z-10 bg-white">
          <CarSelection trim={trimSlug} />
          <SelectRegion code={regionCode} />
        </section>
        <div className="flex justify-end">
          <ShareButton />
        </div>
        <Suspense fallback={<div>Hello</div>}>
          <CarCarousel trimSlug={trimSlug} />
        </Suspense>
        <PriceDetail
          className="mb-8"
          selectedOption={option}
          subsidy={subsidy}
          trim={trimDetail}
        />
        <OptionForm defaultOption={option} trim={trimDetail} />
      </div>
      <OrderCTA code={trimDetail.models?.code} />
    </>
  );
}

export default Page;

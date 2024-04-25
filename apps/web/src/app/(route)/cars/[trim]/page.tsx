import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { getCarImageUrl } from "@/lib/image";
import { CarView } from "@/constants/image";
import { SelectCar } from "./_components/select-car";
import OptionForm from "./_components/options";
import PriceDetail from "./_components/price-detail";
import { SelectRegion } from "./_components/select-region";

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

async function Page({
  params,
  searchParams: { seat, interior, wheel, color, steering, region },
}: PageProps) {
  const trim = decodeURIComponent(params.trim);

  const supabase = createClient();
  const { data: trimDetail, error } = await supabase
    .from("trims")
    .select(
      "*, models(name, code, colors(*), interiors(*), steerings(*)),seatings(*),wheels(*),trim_prices(*),subsidies(*)"
    )
    .eq("slug", trim)
    .order("slug")
    .order("price_set_at", { referencedTable: "trim_prices", ascending: false })
    .limit(1, { referencedTable: "trim_prices" })
    .limit(1, { referencedTable: "subsidies" })
    .single();
  if (error) {
    throw new Error(error.message);
  }

  const option = {
    seat: seat || String(trimDetail.seatings[0]?.seat_count),
    wheel: wheel || String(trimDetail.wheels[0]?.code),
    color: color || String(trimDetail.models?.colors[0]?.code),
    interior: interior || String(trimDetail.models?.interiors[0]?.code),
    steering: steering || String(trimDetail.models?.steerings[0]?.code),
  };
  const image = getCarImageUrl(trimDetail, option, CarView.FRONT);

  return (
    <div className="pb-28">
      <div className="flex">
        <CarSelection trim={trim} />
        <SelectRegion code={region ?? "1100"} />
      </div>
      <div className="flex items-center justify-center">
        <div className="relative aspect-video w-[512px]">
          <Image alt={trimDetail.code} fill objectFit="contains" src={image} />
        </div>
      </div>
      <PriceDetail className="mb-8" selectedOption={option} trim={trimDetail} />
      <OptionForm defaultOption={option} trim={trimDetail} />
    </div>
  );
}

export default Page;

import { headers } from "next/headers";
import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Trim, Option } from "@/types/data";
import { createClient } from "@/utils/supabase/server";
import { DEFAULT_REGION_CODE } from "@/constants/regions";
import { Button } from "@/components/ui/button";
import { type Views } from "@/types/helper";

const getOption = (trim: Trim, selectedOption: Option) => {
  const steering = trim.models?.steerings.find(
    (s) => s.code === selectedOption.steering
  );
  const wheel = trim.wheels.find((w) => w.code === selectedOption.wheel);
  const interior = trim.interiors.find(
    (i) => i.code === selectedOption.interior
  );
  const color = trim.models?.colors.find(
    (c) => c.code === selectedOption.color
  );
  const seat = trim.seatings.find(
    (s) => s.seat_count === Number(selectedOption.seat)
  );

  const drivingAssist = trim.models?.driving_assist_options.find(
    (d) => d.code === selectedOption.drivingAssist
  );

  if (!color || !wheel || !interior || !seat || !drivingAssist || !steering) {
    throw new Error("Option not found");
  }

  const optionNames = `${color.korean_name}, ${wheel.name}, ${interior.korean_name}, ${seat.seat_count.toString()}인승, ${steering.name}, ${drivingAssist.korean_name}`;
  const totalOptionPrice =
    (steering.price || 0) +
    (wheel.price || 0) +
    (interior.price || 0) +
    (color.price || 0) +
    (seat.price || 0) +
    (drivingAssist.price || 0);
  return { optionNames, totalOptionPrice };
};

async function PriceDetail({
  className,
  trimSlug,
}: {
  className?: string;
  trimSlug: string;
}) {
  const headersList = headers();
  const supabase = createClient();
  const queryParams = headersList.get("x-query-params") || "";
  const params = new URLSearchParams(queryParams);
  const regionCode = params.get("region") || DEFAULT_REGION_CODE;

  const { data: trimDetail, error } = await supabase
    .from("trims")
    .select(
      "*, models(name, code, colors(*),steerings(*),driving_assist_options(*)),seatings(*),wheels(*),trim_prices(*), interiors(*), trim_delivery_estimates(*)"
    )
    .eq("slug", trimSlug)
    .order("slug")
    .order("price_set_at", {
      referencedTable: "trim_prices",
      ascending: false,
    })
    .order("set_at", {
      referencedTable: "trim_delivery_estimates",
      ascending: false,
    })
    .limit(2, { referencedTable: "trim_prices" })
    .limit(1, { referencedTable: "trim_delivery_estimates" })
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const [regionSubsidyResponse, subsidyResponse] = await Promise.all([
    supabase
      .from("region_subsidies")
      .select("*")
      .eq("region_code", regionCode)
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("integrated_subsidies_view")
      .select("*")
      .eq("trim_id", trimDetail.id)
      .eq("region_code", regionCode)
      .eq("year", new Date().getFullYear())
      .limit(1)
      .maybeSingle<Views<"integrated_subsidies_view">>(),
  ]);
  if (regionSubsidyResponse.error || subsidyResponse.error) {
    throw new Error(
      regionSubsidyResponse.error?.message || subsidyResponse.error?.message
    );
  }

  const subsidy = subsidyResponse.data;
  const regionSubsidy = regionSubsidyResponse.data;
  const trimDeliveryEstimate = trimDetail.trim_delivery_estimates[0];

  const option = {
    seat: params.get("seat") || String(trimDetail.seatings[0]?.seat_count),
    wheel: params.get("wheel") || String(trimDetail.wheels[0]?.code),
    color: params.get("color") || String(trimDetail.models?.colors[0]?.code),
    interior: params.get("interior") || String(trimDetail.interiors[0]?.code),
    steering:
      params.get("steering") || String(trimDetail.models?.steerings[0]?.code),
    drivingAssist: params.get("drivingAssist") || "ap",
  };

  const releasePrice = trimDetail.trim_prices[0]?.price;
  const lastReleasePrice = trimDetail.trim_prices[1]?.price;
  const { optionNames, totalOptionPrice } = getOption(trimDetail, option);

  const subsidyAvailble = releasePrice && releasePrice < 85000000;
  const subsidyConfirmed = Boolean(subsidy);
  // 보조금이 확정되지 않았을 수도 있으므로, 분리
  const applicableSubsidy =
    subsidyAvailble && subsidyConfirmed ? subsidy : null;

  const totalSubsidy =
    subsidyAvailble && applicableSubsidy
      ? applicableSubsidy.local_subsidy + applicableSubsidy.national_subsidy
      : 0;

  const purchasePrice = releasePrice
    ? releasePrice + totalOptionPrice - totalSubsidy
    : 0;

  const difference =
    lastReleasePrice && releasePrice ? releasePrice - lastReleasePrice : 0;

  return (
    <div className={cn("grid gap-3", className)}>
      <ul className="grid gap-3">
        {trimDeliveryEstimate ? (
          <li className="grid grid-cols-price-detail">
            <span className="text-muted-foreground">예상 인도시기</span>
            <span className="text-end">
              {trimDeliveryEstimate.min_week} ~ {trimDeliveryEstimate.max_week}
              주
            </span>
          </li>
        ) : null}
        <li className="grid grid-cols-price-detail">
          <span className="text-muted-foreground">차량 출고가</span>
          <span className="text-end">
            {releasePrice ? (
              <div className="flex flex-col">
                <span className="text-lg mb-1">
                  {releasePrice.toLocaleString()}원
                </span>
                <span className="text-xs text-muted-foreground">
                  지난 출고 가격 대비
                </span>
                <span className="text-xs text-muted-foreground flex items-center justify-end">
                  {Math.abs(difference).toLocaleString()}원{" "}
                  <TrendingDown
                    className={cn(difference > 0 && "hidden", "w-5 h-5 ml-1")}
                    color="#007C32"
                  />
                  <TrendingUp
                    className={cn(difference < 0 && "hidden", "w-5 h-5 ml-1")}
                    color="#D91400"
                  />
                </span>
                <Button
                  asChild
                  className="justify-self-end h-6 text-xs"
                  size="sm"
                  variant="outline"
                >
                  <Link href={`/prices/${trimDetail.slug.split("-")[0]!}`}>
                    가격 변동 확인하기
                  </Link>
                </Button>
              </div>
            ) : (
              "가격 미정"
            )}
          </span>
        </li>
        <li className="grid grid-cols-price-detail">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">차량 옵션 가격</span>
            <span className="text-muted-foreground text-xs">{optionNames}</span>
          </div>
          <span className="text-end text-lg">
            {totalOptionPrice.toLocaleString()}원
          </span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3">
        <li className="grid items-center grid-cols-price-detail">
          <span className="text-muted-foreground">국고 보조금</span>
          <span className="text-end text-lg">
            {!subsidyAvailble && "보조금 없음"}
            {subsidyAvailble && !subsidyConfirmed ? "보조금 미확정" : null}
            {applicableSubsidy
              ? `-${applicableSubsidy.national_subsidy.toLocaleString()}원`
              : null}
          </span>
        </li>
        <li className="grid grid-cols-price-detail">
          <span className="text-muted-foreground">지자체 보조금</span>
          <span className="text-end text-lg">
            {!subsidyAvailble && "보조금 없음"}
            {subsidyAvailble && !subsidyConfirmed ? "보조금 미확정" : null}
            {applicableSubsidy ? (
              <div className="flex flex-col gap-0.5">
                <span>
                  {`-${applicableSubsidy.local_subsidy.toLocaleString()}원`}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    기준일자: {regionSubsidy.snapshot_date}
                  </span>
                  <span className="font-semibold text-sm">
                    잔여 수량: {regionSubsidy.remaining_quota.toLocaleString()}
                    대
                  </span>
                  <span className="text-xs text-muted-foreground">
                    출처: 무공해차 통합누리집
                  </span>
                </div>
              </div>
            ) : null}
          </span>
        </li>
        <Separator className="my-2" />
        <li className="grid grid-cols-price-detail font-semibold">
          <span className="text-muted-foreground">최종 구매 가격</span>
          <span className="text-end text-xl">
            {purchasePrice.toLocaleString()}원
          </span>
        </li>
      </ul>
    </div>
  );
}

export default PriceDetail;

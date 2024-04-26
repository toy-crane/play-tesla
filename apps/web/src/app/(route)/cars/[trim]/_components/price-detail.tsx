import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Trim, Option, Subsidy } from "@/types/data";
import { createClient } from "@/utils/supabase/server";
import { DEFAULT_REGION_CODE } from "@/constants/regions";

const getOption = (trim: Trim, selectedOption: Option) => {
  const steering = trim.models?.steerings.find(
    (s) => s.code === selectedOption.steering
  );
  const wheel = trim.wheels.find((w) => w.code === selectedOption.wheel);
  const interior = trim.models?.interiors.find(
    (i) => i.code === selectedOption.interior
  );
  const color = trim.models?.colors.find(
    (c) => c.code === selectedOption.color
  );
  const seat = trim.seatings.find(
    (s) => s.seat_count === Number(selectedOption.seat)
  );

  const optionNames = `${color?.korean_name}, ${wheel?.name}, ${interior?.korean_name}, ${seat?.seat_count}인승, ${steering?.name}`;
  const totalOptionPrice =
    (steering?.price || 0) +
    (wheel?.price || 0) +
    (interior?.price || 0) +
    (color?.price || 0) +
    (seat?.price || 0);
  return { optionNames, totalOptionPrice };
};

async function PriceDetail({
  className,
  trim,
  selectedOption,
  subsidy,
}: {
  className: string;
  trim: Trim;
  subsidy: Subsidy | null;
  selectedOption: Option;
}) {
  const headersList = headers();
  const supabase = createClient();
  const queryParams = headersList.get("x-query-params") || "";
  const params = new URLSearchParams(queryParams);
  const regionCode = params.get("region") || DEFAULT_REGION_CODE;
  const { data: regionSubsidy, error } = await supabase
    .from("region_subsidies")
    .select("*")
    .eq("region_code", regionCode)
    .order("snapshot_date", { ascending: false })
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (regionSubsidy === null) {
    throw new Error("Region subsidy not found");
  }

  const releasePrice = trim.trim_prices?.[0]?.price;
  const { optionNames, totalOptionPrice } = getOption(trim, selectedOption);

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

  return (
    <div className={cn("grid gap-3", className)}>
      <ul className="grid gap-3">
        <li className="grid grid-cols-price-detail">
          <span className="text-muted-foreground">차량 출고가</span>
          <span className="text-end">
            {releasePrice ? `${releasePrice.toLocaleString()}원` : "가격 미정"}
          </span>
        </li>
        <li className="grid grid-cols-price-detail">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">차량 옵션 가격</span>
            <span className="text-muted-foreground text-xs">{optionNames}</span>
          </div>
          <span className="text-end">
            {totalOptionPrice.toLocaleString()}원
          </span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3">
        <li className="grid items-center grid-cols-price-detail">
          <span className="text-muted-foreground">국고 보조금</span>
          <span className="text-end">
            {!subsidyAvailble && "보조금 없음"}
            {subsidyAvailble && !subsidyConfirmed ? "보조금 미확정" : null}
            {applicableSubsidy
              ? `-${applicableSubsidy.national_subsidy.toLocaleString()}원`
              : null}
          </span>
        </li>
        <li className="grid grid-cols-price-detail">
          <span className="text-muted-foreground">지자체 보조금</span>
          <span className="text-end">
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
                  <span className="text-xs text-muted-foreground">
                    잔여 수량: {regionSubsidy.remaining_quota.toLocaleString()}
                    대
                  </span>
                </div>
              </div>
            ) : null}
          </span>
        </li>
        <li className="grid grid-cols-price-detail font-semibold">
          <span className="text-muted-foreground">최종 구매 가격</span>
          <span className="text-end">{purchasePrice.toLocaleString()}원</span>
        </li>
      </ul>
    </div>
  );
}

export default PriceDetail;

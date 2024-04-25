import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Trim, Option } from "@/types/data";

function PriceDetail({
  className,
  trim,
  selectedOption,
}: {
  className: string;
  trim: Trim;
  selectedOption: Option;
}) {
  const releasePrice = trim.trim_prices?.[0]?.price;
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

  const hasSubsidy = releasePrice && releasePrice < 85000000;
  const subsidy = hasSubsidy ? trim.subsidies?.[0] : null;
  const totalSubsidy = subsidy
    ? subsidy.local_subsidy + subsidy.national_subsidy
    : 0;

  const purchasePrice = releasePrice
    ? releasePrice + totalOptionPrice - totalSubsidy
    : 0;

  return (
    <div className={cn("grid gap-3", className)}>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">차량 출고가</span>
          <span>
            {releasePrice ? `${releasePrice.toLocaleString()}원` : "가격 미정"}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">차량 옵션 가격</span>
            <span className="text-muted-foreground text-xs">{optionNames}</span>
          </div>
          <span>{totalOptionPrice.toLocaleString()}원</span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">국고 보조금</span>
          <span>
            {hasSubsidy
              ? `-${subsidy?.national_subsidy.toLocaleString() ?? 0}원`
              : "보조금 없음"}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">지자체 보조금</span>
          <span>
            {hasSubsidy
              ? `-${subsidy?.local_subsidy.toLocaleString() ?? 0}원`
              : "보조금 없음"}
          </span>
        </li>
        <li className="flex items-center justify-between font-semibold">
          <span className="text-muted-foreground">최종 구매 가격</span>
          <span>{purchasePrice.toLocaleString()}원</span>
        </li>
      </ul>
    </div>
  );
}

export default PriceDetail;

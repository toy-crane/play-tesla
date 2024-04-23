import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Trim } from "@/types/data";

function PriceDetail({ className }: { className: string; trim: Trim }) {
  return (
    <div className={cn("grid gap-3", className)}>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">차량 출고가</span>
          <span>56,000,000원</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">차량 옵션 가격</span>
          <span>5,600,000원</span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">국고 보조금</span>
          <span>-3,200,000원</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">지자체 보조금</span>
          <span>-2,400,000원</span>
        </li>
        <li className="flex items-center justify-between font-semibold">
          <span className="text-muted-foreground">보조금 적용</span>
          <span>50,000,000원</span>
        </li>
      </ul>
    </div>
  );
}

export default PriceDetail;

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex w-full flex-col items-center gap-28 py-[26vh] pt-[18vh]">
      <div className="flex flex-col items-center space-y-3">
        <h1 className="text-3xl font-semibold tracking-tighter md:text-6xl">
          테슬라 가격에 관한 모든 것
        </h1>
        <p className="text-foreground md:text-2xl">
          가장 빠르고, 쉽게 알아 보세요
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[480px]">
        <Button asChild size="lg" variant="outline">
          <Link href="/cars/model3-longrange">지역별 테슬라 보조금 조회</Link>
        </Button>
        <Button size="lg">
          <Link href="/prices/model3">테슬라 모델별 가격 변경 추이</Link>
        </Button>
      </div>
    </div>
  );
}

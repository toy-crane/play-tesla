import Link from "next/link";
import { Button } from "@/components/ui/button";
import GradualSpacing from "@/components/magicui/gradual-spacing";

export default function Page() {
  return (
    <div className="flex w-full flex-col items-center gap-28 py-[26vh] pt-[18vh] relative">
      <div className="flex flex-col items-center space-y-3 z-20">
        <GradualSpacing
          text="테슬라 가격에 관한 모든 것"
          className="text-3xl font-semibold tracking-tighter md:text-6xl"
        />
        <p className="text-foreground md:text-2xl">
          가장 빠르고, 쉽게 알아 보세요
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[480px]">
        <Button asChild size="lg" variant="outline">
          <Link href="/cars/model3-longrange" prefetch>
            지역별 테슬라 보조금 조회
          </Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/prices/model3" prefetch>
            테슬라 모델별 가격 변경 추이
          </Link>
        </Button>
        <div className="flex gap-2 mt-8">
          <Button asChild className="flex-1" size="lg" variant="secondary">
            <a
              href="https://slashpage.com/play-tesla/roadmap"
              rel="noreferrer"
              target="_blank"
            >
              업데이트 계획 보기
            </a>
          </Button>
          <Button asChild className="flex-1" size="lg" variant="secondary">
            <a
              href="https://slashpage.com/play-tesla/new-feature"
              rel="noreferrer"
              target="_blank"
            >
              신규 기능 요청하기
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

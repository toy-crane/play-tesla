import Link from "next/link";
import { Button } from "@/components/ui/button";

function OrderCTA({ code }: { code: string }) {
  return (
    <div className="z-bottom-nav content-grid fixed bottom-4 w-full justify-center bg-gradient-to-t from-white from-80% to-transparent">
      <div className="md:content full flex justify-center pt-5">
        <Button asChild className="w-full text-sm" size="lg">
          <Link href={`https://www.tesla.com/ko_kr/${code}/design#overview`}>
            테슬라 홈페이지에서 주문하기
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default OrderCTA;

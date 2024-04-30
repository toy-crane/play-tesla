import { AlarmClock } from "lucide-react";
import { Button } from "@/components/ui/button";

function NoticeCTA() {
  return (
    <div className="z-bottom-nav content-grid fixed bottom-4 w-full justify-center bg-gradient-to-t from-white from-80% to-transparent">
      <div className="md:content full flex justify-center pt-5">
        <Button className="w-full text-sm" size="lg">
          <AlarmClock className="w-4 h-4 mr-1" />
          새로운 가격 변동 알림 받기
        </Button>
      </div>
    </div>
  );
}

export default NoticeCTA;

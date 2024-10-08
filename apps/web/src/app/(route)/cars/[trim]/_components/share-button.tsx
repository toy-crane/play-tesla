"use client";

import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function ShareButton() {
  const { toast } = useToast();

  return (
    <Button
      onClick={async () => {
        if (window.location.href) {
          await navigator.clipboard.writeText(window.location.href);
        }
        toast({
          title: "주소가 복사되었습니다",
          description: "원하는 곳에 붙여넣기(Ctrl+V)해주세요.",
          duration: 1000,
        });
        track("car-share-button-clicked");
      }}
      size="sm"
    >
      <span className="md:block">공유하기</span>
    </Button>
  );
}

export default ShareButton;

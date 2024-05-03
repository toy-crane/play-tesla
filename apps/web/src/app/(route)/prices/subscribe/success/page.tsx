"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function Page() {
  const router = useRouter();
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-md px-4 md:px-6">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            알림받기 등록 완료{"  "} 🎉
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            테슬라 차량의 가격 변동을 이메일로 가장 빠르게 보내드릴게요
          </p>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            router.push("/");
          }}
        >
          돌아가기
        </Button>
      </div>
    </section>
  );
}

export default Page;

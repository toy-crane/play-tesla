import { Button } from "@/components/ui/button";

function Page() {
  return (
    <div className="content-grid">
      <div className="flex justify-between items-center my-8">
        <h1 className="text-3xl font-semibold md:text-6xl">
          테슬라 모델 비교하기
        </h1>
        <Button>공유하기</Button>
      </div>
    </div>
  );
}

export default Page;

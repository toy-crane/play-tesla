import Chart from "./_components/chart";
import SelectModel from "./_components/select-model";

function Page({
  params: { model },
}: {
  params: {
    model: string;
  };
}) {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-left text-3xl md:text-4xl font-bold leading-tight tracking-tighter lg:leading-[1.1] mt-4">
          테슬라 차량 인도 기간
        </h1>
      </div>
      <SelectModel className="my-4" modelSlug={model} />
      <Chart />
    </div>
  );
}

export default Page;

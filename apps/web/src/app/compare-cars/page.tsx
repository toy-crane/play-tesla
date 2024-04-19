import { createClient } from "@/utils/supabase/server";
import ShareButton from "./_components/share-button";
import { Button } from "@/components/ui/button";
import Card from "./_components/card";

interface Props {
  searchParams: { trimList: string };
}

async function Page({ searchParams }: Props) {
  const originTrimList =
    searchParams.trimList || "model3-longrange,modely-longrange";
  const trimList = decodeURIComponent(originTrimList);
  const [first, second] = trimList.split(",");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trims")
    .select(
      "*, models(name, colors(*), interiors(*), steerings(*)),seatings(*),wheels(*)"
    )
    .in("slug", [first, second]);
  if (error) {
    throw error;
  }

  const primary = data[0];
  const secondary = data[1];

  if (!primary || !secondary) {
    throw new Error("Trim not found");
  }

  return (
    <div className="content-grid">
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-semibold md:text-6xl flex flex-col gap-1 md:gap-2">
          <span className="inline-flex">Tesla</span>
          <span className="inline-flex">모델 비교하기</span>
        </h1>
        <ShareButton />
      </div>
      <div className="flex">
        <Card trim={primary} />
        <Card trim={secondary} />
      </div>
    </div>
  );
}

export default Page;

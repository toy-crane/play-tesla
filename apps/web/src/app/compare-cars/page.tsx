import { createClient } from "@/utils/supabase/server";
import ShareButton from "./_components/share-button";
import Card from "./_components/card";
import { SelectCar } from "./_components/select-car";

interface Props {
  searchParams: { primaryTrim: string; secondaryTrim: string };
}

async function Page({ searchParams }: Props) {
  const primaryTrim = searchParams.primaryTrim
    ? decodeURIComponent(searchParams.primaryTrim)
    : "model3-longrange";
  const secondaryTrim = searchParams.secondaryTrim
    ? decodeURIComponent(searchParams.secondaryTrim)
    : "modely-longrange";

  const supabase = createClient();
  const { data, error } = await supabase
    .from("trims")
    .select(
      "*, models(name, code, colors(*), interiors(*), steerings(*)),seatings(*),wheels(*)"
    )
    .in("slug", [primaryTrim, secondaryTrim])
    .order("slug");
  if (error) {
    throw error;
  }

  const { data: allTrims, error: trimsError } = await supabase
    .from("trims")
    .select("*, models(*)");

  if (trimsError) {
    throw trimsError;
  }

  const primary = data.find((trim) => trim.slug === primaryTrim);
  const secondary = data.find((trim) => trim.slug === secondaryTrim);

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
      <SelectCar trims={allTrims} order="primary" />
      <div className="flex">
        <Card trim={primary} order="primary" />
        <Card trim={secondary} order="secondary" />
      </div>
    </div>
  );
}

export default Page;

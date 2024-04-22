import { createClient } from "@/utils/supabase/server";
import ShareButton from "./_components/share-button";
import Card from "./_components/card";
import { SelectCar } from "./_components/select-car";

interface PageProps {
  searchParams: {
    primaryTrim: string;
    secondaryTrim: string;
    primarySeating: string;
    secondarySeating: string;
    primaryWheel: string;
    secondaryWheel: string;
    primaryColor: string;
    secondaryColor: string;
    primaryInterior: string;
    secondaryInterior: string;
    primarySteering: string;
    secondarySteering: string;
  };
}

async function Page({ searchParams }: PageProps) {
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
    throw new Error(error.message);
  }

  const { data: allTrims, error: trimsError } = await supabase
    .from("trims")
    .select("*, models(*)");

  if (trimsError) {
    throw new Error(trimsError.message);
  }

  const primary = data.find((trim) => trim.slug === primaryTrim);
  const secondary = data.find((trim) => trim.slug === secondaryTrim);

  if (!primary || !secondary) {
    throw new Error("Trim not found");
  }

  const primaryOption = {
    seat:
      searchParams.primarySeating || String(primary.seatings[0]?.seat_count),
    wheel: searchParams.primaryWheel || String(primary.wheels[0]?.code),
    color: searchParams.primaryColor || String(primary.models?.colors[0]?.code),
    interior:
      searchParams.primaryInterior ||
      String(primary.models?.interiors[0]?.code),
    steering:
      searchParams.primarySteering ||
      String(primary.models?.steerings[0]?.code),
  };

  const secondaryOption = {
    seat:
      searchParams.secondarySeating ||
      String(secondary.seatings[0]?.seat_count),
    wheel: searchParams.secondaryWheel || String(secondary.wheels[0]?.code),
    color:
      searchParams.secondaryColor || String(secondary.models?.colors[0]?.code),
    interior:
      searchParams.secondaryInterior ||
      String(secondary.models?.interiors[0]?.code),
    steering:
      searchParams.secondarySteering ||
      String(secondary.models?.steerings[0]?.code),
  };

  return (
    <div className="content-grid">
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-semibold md:text-6xl flex flex-col gap-1 md:gap-2">
          <span className="inline-flex">Tesla</span>
          <span className="inline-flex">모델 비교하기</span>
        </h1>
        <ShareButton />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <SelectCar order="primary" slug={primaryTrim} trims={allTrims} />
          <Card
            key="primary"
            option={primaryOption}
            order="primary"
            trim={primary}
          />
        </div>
        <div className="flex-1">
          <SelectCar order="secondary" slug={secondaryTrim} trims={allTrims} />
          <Card
            key="secondary"
            option={secondaryOption}
            order="secondary"
            trim={secondary}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;

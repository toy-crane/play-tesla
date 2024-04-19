import { createClient } from "@/utils/supabase/server";
import ShareButton from "./_components/share-button";
import { Button } from "@/components/ui/button";

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
  if (error || data.length !== 2) {
    throw error;
  }

  const primary = data[0];
  const secondary = data[1];

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
        <div className="flex flex-1 flex-col">
          {primary?.models?.name} {primary?.name}
          <div>
            <h1>좌석</h1>
            <div className="flex gap-2">
              {primary?.seatings?.map((seating) => (
                <Button>{seating.seat_count}</Button>
              ))}
            </div>
          </div>
          <div>
            <h1>휠</h1>
            <div className="flex gap-2">
              {primary?.wheels?.map((wheel) => <Button>{wheel.name}</Button>)}
            </div>
          </div>
          <div>
            <h1>색상</h1>
            <div className="flex gap-2 overflow-auto">
              {primary?.models?.colors?.map((color) => (
                <Button>{color.name}</Button>
              ))}
            </div>
          </div>
          <div>
            <h1>인테리어</h1>
            <div className="flex gap-2 overflow-auto">
              {primary?.models?.interiors?.map((interior) => (
                <Button>{interior.name}</Button>
              ))}
            </div>
          </div>
          <div>
            <h1>스티어링</h1>
            <div className="flex gap-2 overflow-auto">
              {primary?.models?.steerings?.map((steering) => (
                <Button>{steering.name}</Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          {secondary?.models?.name} {secondary?.name}
          <div>
            <h1>좌석</h1>
            <div className="flex gap-2">
              {secondary?.seatings?.map((seating) => (
                <Button>{seating.seat_count}</Button>
              ))}
            </div>
          </div>
          <div>
            <h1>휠</h1>
            <div className="flex gap-2">
              {secondary?.wheels?.map((wheel) => <Button>{wheel.name}</Button>)}
            </div>
          </div>
          <div>
            <h1>색상</h1>
            <div className="flex gap-2 overflow-auto">
              {secondary?.models?.colors?.map((color) => (
                <Button>{color.name}</Button>
              ))}
            </div>
          </div>
          <div>
            <h1>인테리어</h1>
            <div className="flex gap-2 overflow-auto">
              {secondary?.models?.interiors?.map((interior) => (
                <Button>{interior.name}</Button>
              ))}
            </div>
          </div>
          <div>
            <h1>스티어링</h1>
            <div className="flex gap-2 overflow-auto">
              {secondary?.models?.steerings?.map((steering) => (
                <Button>{steering.name}</Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;

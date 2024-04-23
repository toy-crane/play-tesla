import { createClient } from "@/utils/supabase/server";
import { SelectCar } from "./_components/select-car";

interface PageProps {
  params: { trim: string };
}

const CarSelection = async ({ trim }: { trim: string }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trims")
    .select("slug, name, models(name)");
  if (error) {
    throw new Error(error.message);
  }
  return <SelectCar slug={trim} trims={data} />;
};

async function Page({ params }: PageProps) {
  const trim = decodeURIComponent(params.trim);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("trims")
    .select(
      "*, models(name, code, colors(*), interiors(*), steerings(*)),seatings(*),wheels(*)"
    )
    .eq("slug", trim)
    .order("slug")
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <div>
        <CarSelection trim={trim} />
      </div>
      {data.code}
    </div>
  );
}

export default Page;

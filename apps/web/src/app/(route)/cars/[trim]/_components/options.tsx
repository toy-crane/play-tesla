import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";
import OptionForm from "./option-form";

function OptionSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-[256px]" />
      <div className="flex gap-2">
        <Skeleton className="h-[70px] w-[128px]" />
        <Skeleton className="h-[70px] w-[128px]" />
        <Skeleton className="h-[70px] w-[128px]" />
      </div>
    </div>
  );
}

async function Options({ trimSlug }: { trimSlug: string }) {
  const headersList = headers();
  const supabase = createClient();
  const queryParams = headersList.get("x-query-params") || "";
  const params = new URLSearchParams(queryParams);
  const { data: trim, error } = await supabase
    .from("trims")
    .select(
      "*, models(code, id, name, colors(*),steerings(*)),seatings(*),wheels(*),interiors(*)"
    )
    .eq("slug", trimSlug)
    .order("slug")
    .single();
  if (error) {
    throw new Error(error.message);
  }

  const currentOption = {
    seat: params.get("seat") || String(trim.seatings[0]?.seat_count),
    wheel: params.get("wheel") || String(trim.wheels[0]?.code),
    color: params.get("color") || String(trim.models?.colors[0]?.code),
    interior: params.get("interior") || String(trim.interiors[0]?.code),
    steering: params.get("steering") || String(trim.models?.steerings[0]?.code),
  };

  return <OptionForm currentOption={currentOption} trim={trim} />;
}

export default Options;
export { OptionSkeleton };

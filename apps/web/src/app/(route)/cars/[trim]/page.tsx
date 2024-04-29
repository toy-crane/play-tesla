import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SelectCar } from "./_components/select-car";
import PriceDetail from "./_components/price-detail";
import { SelectRegion } from "./_components/select-region";
import ShareButton from "./_components/share-button";
import CarCarousel from "./_components/car-carousel";

interface PageProps {
  params: { trim: string };
  searchParams: {
    seat?: string;
    wheel?: string;
    color?: string;
    interior?: string;
    steering?: string;
    region?: string;
  };
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

export async function generateStaticParams() {
  const supabase = createBrowserClient();
  const { error, data: trims } = await supabase.from("trims").select(`slug`);
  if (error) throw new Error(error.message);
  return trims.map((trim) => ({ trim: trim.slug }));
}

function Page({ params, searchParams: { region } }: PageProps) {
  const trimSlug = decodeURIComponent(params.trim);
  const regionCode = region ?? "1100";

  return (
    <>
      <div className="pb-40">
        <section className="flex gap-2 mb-2 sticky top-0 z-10 bg-white">
          <Suspense
            fallback={
              <>
                <Skeleton className="h-[44px] w-full" />
                <Skeleton className="h-[44px] w-full" />
              </>
            }
          >
            <CarSelection trim={trimSlug} />
            <SelectRegion code={regionCode} />
          </Suspense>
        </section>
        <div className="flex justify-end">
          <ShareButton />
        </div>
        <Suspense
          fallback={
            <div className="h-[192.94px] w-full flex items-center justify-center py-2">
              <Loader2
                className="h-5 w-5 animate-spin"
                color="#71717A"
                size={24}
              />
            </div>
          }
        >
          <CarCarousel trimSlug={trimSlug} />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <Skeleton className="w-1/4 h-6" />
                <Skeleton className="w-2/4 h-6" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-1/4 h-6" />
                <Skeleton className="w-2/4 h-6" />
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <Skeleton className="w-1/4 h-6" />
                <Skeleton className="w-2/4 h-6" />
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <Skeleton className="w-2/4 h-6" />
              </div>
            </div>
          }
        >
          <PriceDetail className="mb-8" trimSlug={trimSlug} />
        </Suspense>
        {/* <OptionForm defaultOption={option} trim={trimDetail} /> */}
      </div>
      {/* <OrderCTA code={trimDetail.models?.code} /> */}
    </>
  );
}

export default Page;

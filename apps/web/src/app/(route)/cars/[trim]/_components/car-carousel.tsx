import Image from "next/image";
import { headers } from "next/headers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarView } from "@/constants/image";
import { createClient } from "@/utils/supabase/server";
import { getCarImageUrl } from "@/lib/image";

async function CarCarousel({ trimSlug }: { trimSlug: string }) {
  const supabase = createClient();
  const headersList = headers();
  const xQueryParams = headersList.get("x-query-params") || "";
  const queryParams = new URLSearchParams(xQueryParams);

  const { data: trim, error } = await supabase
    .from("trims")
    .select("code, models(code, colors(code),steerings(code)),wheels(code)")
    .eq("slug", trimSlug)
    .order("slug")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const modelCode = trim.models?.code;
  const trimCode = trim.code;
  const colorCode = queryParams.get("color") || trim.models?.colors[0]?.code;
  const wheelCode = queryParams.get("wheel") || trim.wheels[0]?.code;

  if (
    modelCode === undefined ||
    colorCode === undefined ||
    wheelCode === undefined
  ) {
    throw new Error("Model code, color code, or wheel code is undefined");
  }

  return (
    <Carousel
      className="py-2"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {Object.values(CarView).map((view) => (
          <CarouselItem key={view}>
            <div className="flex items-center justify-center">
              <div className="relative aspect-video w-[512px]">
                <Image
                  alt={`${trimSlug} ${view}`}
                  className="object-contain"
                  fill
                  priority
                  src={getCarImageUrl(
                    modelCode,
                    trimCode,
                    colorCode,
                    wheelCode,
                    view
                  )}
                  title={`${trimSlug} ${view}`}
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </Carousel>
  );
}

export default CarCarousel;

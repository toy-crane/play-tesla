import type { NextRequest } from "next/server";
import type { Trim } from "@/types/data";
import { createClient } from "@/utils/supabase/server";
import { CarView } from "@/constants/image";

export const dynamic = "force-dynamic";

interface ImageConfig {
  url: string;
  fileName: string;
}

async function fetchWithDelay(imageUrls: ImageConfig[]) {
  const supabase = createClient();
  for (const config of imageUrls) {
    // eslint-disable-next-line no-await-in-loop -- This is a server-side script
    const response = await fetch(config.url);
    if (response.ok) {
      // eslint-disable-next-line no-await-in-loop -- This is a server-side script
      const blob = await response.arrayBuffer();
      // eslint-disable-next-line no-await-in-loop -- This is a server-side script
      await supabase.storage.from("cars").upload(config.fileName, blob, {
        contentType: "image/jpeg",
      });
    } else {
      // eslint-disable-next-line no-console -- This is a server-side script
      console.error(`Failed to fetch image from ${config.url}`);
    }

    // eslint-disable-next-line no-await-in-loop -- This is a server-side script
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    }); // 1초 대기
  }
}

function generateImageURLs(trim: Trim): ImageConfig[] {
  if (!trim.models?.interiors.length) {
    return [];
  }

  const configs: ImageConfig[] = [];
  const modelCode = trim.models.code;
  const baseUrl = "https://static-assets.tesla.com/configurator/compositor";

  trim.models.colors.forEach((color) => {
    trim.wheels.forEach((wheel) => {
      Object.values(CarView).forEach((viewType) => {
        const interiorCode = trim.models?.interiors[0]?.code; // Assuming using the first interior for simplicity
        const url = `${baseUrl}?options=${trim.code},${color.code},${wheel.code},${interiorCode}&view=${viewType}&model=${modelCode}`;
        const fileName = `${modelCode}/${trim.code}/${color.code}-${wheel.code}-${interiorCode}-${viewType}`;
        configs.push({
          url,
          fileName,
        });
      });
    });
  });

  return configs;
}

interface Request {
  trim: string;
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { trim } = (await request.json()) as Request;

  const { data, error } = await supabase
    .from("trims")
    .select(
      "*, models(name, code, colors(*), interiors(*), steerings(*)),seatings(*),wheels(*)"
    )
    .eq("code", trim);
  if (error) {
    throw new Error(error.message);
  }

  const imageUrls = generateImageURLs(data[0] as Trim);
  await fetchWithDelay(imageUrls);

  return Response.json({ result: "success", imageUrls });
}

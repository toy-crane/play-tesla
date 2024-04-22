import { Trim } from "@/types/data";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface ImageConfig {
  url: string;
  fileName: string;
}

enum View {
  FRONT34 = "FRONT34",
  REAR34 = "REAR34",
  SIDE = "SIDE",
  RIMCLOSEUP = "RIMCLOSEUP",
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateImageURLs(trim: Trim): ImageConfig[] {
  if (!trim.models || !trim.models.interiors.length) {
    return [];
  }

  let configs: ImageConfig[] = [];
  const modelCode = trim.models.code;
  const baseUrl = "https://static-assets.tesla.com/configurator/compositor";

  trim.models.colors.forEach((color) => {
    trim.wheels.forEach((wheel) => {
      Object.values(View).forEach((viewType) => {
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

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("trims")
    .select(
      "*, models(name, code, colors(*), interiors(*), steerings(*)),seatings(*),wheels(*)"
    );
  if (error) {
    throw error;
  }

  const imageUrls = generateImageURLs(data[0] as Trim);

  imageUrls.forEach(async (config) => {
    await sleep(1000);
    const response = await fetch(config.url);
    if (response.ok) {
      const blob = await response.arrayBuffer();
      const { data, error } = await supabase.storage
        .from("cars")
        .upload(config.fileName, blob, {
          contentType: "image/jpeg",
        });
      if (error) {
        console.log(error);
      }
    }
  });

  return Response.json({ result: "success", imageUrls });
}

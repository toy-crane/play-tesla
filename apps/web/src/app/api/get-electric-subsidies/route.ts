import * as cheerio from "cheerio";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const modelNames = {
  "Model Y RWD": "modely-rwd",
  "Model 3 RWD": "model3-rwd",
  "Model 3 Long Range": "model3-longrange",
};

interface TeslaSubsidy {
  trim: string;
  nationalSubsidy: number;
  localSubsidy: number;
  totalSubsidy: number;
  regionCode: string;
}

function getTrim(model: string) {
  if (model in modelNames) {
    return modelNames[model as keyof typeof modelNames];
  }
  throw new Error(`Unknown model: ${model}`);
}

const SUBSIDY_API_URL =
  "https://ev.or.kr/nportal/buySupprt/psPopupLocalCarModelPrice.do";

async function fetchTeslaSubsidies(regionCode: string) {
  const response = await fetch(SUBSIDY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `year=2024&local_cd=${regionCode}&car_type=11`,
  });

  const text = await response.text();
  const $ = cheerio.load(text);

  const teslaSubsidies: TeslaSubsidy[] = [];

  // 테슬라 차종의 보조금 데이터를 추출
  $(".table01 tbody tr").each((index, element) => {
    const manufacturer = $(element).find("td").eq(1).text().trim(); // 제조사 칼럼
    if (manufacturer === "테슬라코리아") {
      const model = $(element).find("td").eq(2).text().trim(); // 모델명
      const trim = getTrim(model);
      const nationalSubsidyString = $(element).find("td").eq(3).text().trim(); // 국비 (만원)
      const localSubsidyString = $(element).find("td").eq(4).text().trim(); // 지방비 (만원)
      const totalSubsidyString = $(element).find("td").eq(5).text().trim(); // 보조금 (만원)
      teslaSubsidies.push({
        trim,
        nationalSubsidy: parseInt(nationalSubsidyString.replace(/,/g, ""), 10),
        localSubsidy: parseInt(localSubsidyString.replace(/,/g, ""), 10),
        totalSubsidy: parseInt(totalSubsidyString.replace(/,/g, ""), 10),
        regionCode,
      });
    }
  });

  return teslaSubsidies;
}

export async function POST() {
  const supabase = createClient({ type: "admin" });
  const { data: trims, error } = await supabase
    .from("trims")
    .select("id, slug")
    .in("slug", Object.values(modelNames));
  if (error) {
    throw new Error(error.message);
  }
  const teslaSubsidies = await fetchTeslaSubsidies("1100");
  const subsidies = teslaSubsidies.map((subsidy) => ({
    trim_id: trims.find((trim) => trim.slug === subsidy.trim)?.id,
    local_subsidy: subsidy.localSubsidy,
    national_subsidy: subsidy.nationalSubsidy,
    region_code: subsidy.regionCode,
    year: new Date().getFullYear(),
  }));
  const { data, error: insertError } = await supabase
    .from("subsidies")
    .insert(subsidies);
  if (insertError) {
    throw new Error(insertError.message);
  }
  return Response.json({ result: "success", subsidies: data });
}

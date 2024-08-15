import * as cheerio from "cheerio";
import { createClient } from "@/utils/supabase/server";
import regions from "@/constants/regions";
import { alertDiscord } from "@/lib/discord";

export const dynamic = "force-dynamic";

const modelNames = {
  "Model Y RWD": { trimSlug: "modely-rwd", wheelCode: undefined },
  "Model 3 RWD": { trimSlug: "model3-rwd", wheelCode: undefined },
  "Model 3 Long Range": { trimSlug: "model3-longrange", wheelCode: undefined },
  "Model 3 Performance(2024)": {
    trimSlug: "model3-performance",
    wheelCode: undefined,
  },
  "Model Y Long Range": { trimSlug: "modely-longrange", wheelCode: undefined },
  "Model Y Performance": {
    trimSlug: "modely-performance",
    wheelCode: undefined,
  },
  "Model Y Long Range 19인치": {
    trimSlug: "modely-longrange",
    wheelCode: "$WY19B",
  },
};

interface TeslaSubsidy {
  trimSlug: string;
  nationalSubsidy: number;
  localSubsidy: number;
  totalSubsidy: number;
  regionCode: string;
  wheelCode?: string;
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
  try {
    $(".table01 tbody tr").each((index, element) => {
      const manufacturer = $(element).find("td").eq(1).text().trim(); // 제조사 칼럼
      if (manufacturer === "테슬라코리아") {
        const model = $(element).find("td").eq(2).text().trim(); // 모델명
        // 사용하지 않는 모델 예외처리
        if (model === "Model Y RWD(2023)") return true;
        const { trimSlug, wheelCode } = getTrim(model);
        const nationalSubsidyString = $(element).find("td").eq(3).text().trim(); // 국비 (만원)
        const localSubsidyString = $(element).find("td").eq(4).text().trim(); // 지방비 (만원)
        const totalSubsidyString = $(element).find("td").eq(5).text().trim(); // 보조금 (만원)
        teslaSubsidies.push({
          trimSlug,
          wheelCode,
          nationalSubsidy:
            parseInt(nationalSubsidyString.replace(/,/g, ""), 10) * 10000,
          localSubsidy:
            parseInt(localSubsidyString.replace(/,/g, ""), 10) * 10000,
          totalSubsidy:
            parseInt(totalSubsidyString.replace(/,/g, ""), 10) * 10000,
          regionCode,
        });
      }
    });
  } catch (e) {
    await alertDiscord(
      "https://discord.com/api/webhooks/1234413370711736340/YMCJNwpQFSFfL5zFh5E3yrA31iR53dVsqZjtM24YrGRMBHfJZ9ThecuVlbLnV33XGEXS",
      `차종 보조금 조회 실패`
    );
  }

  return teslaSubsidies;
}

// 지자체 보조금 정보를 가져와서 DB에 저장
// 위치 -> 구매 및 지원 -> 구매 보조금 지급 현황 -> 지차제별 차종별 보조금 -> 지역 조회 -> 테슬라 코리아 찾기
export async function POST() {
  const supabase = createClient({ type: "admin" });
  const { data: trims, error } = await supabase
    .from("trims")
    .select("id, slug");
  if (error) {
    throw new Error(error.message);
  }

  const { data: wheels, error: wheelError } = await supabase
    .from("wheels")
    .select("id, code");

  if (wheelError) {
    throw new Error(wheelError.message);
  }

  const regionCodes = regions.map((r) => r.code);

  const teslaSubsidiesPromises = regionCodes.map((code) =>
    fetchTeslaSubsidies(code)
  );
  const allResponses = await Promise.all(teslaSubsidiesPromises);
  const teslaSubsidies = allResponses.flat();

  const wheelSpecificSubsidies = teslaSubsidies
    .filter((subsidy) => subsidy.wheelCode)
    .map((subsidy) => {
      const wheelId = wheels.find((wheel) => wheel.code === subsidy.wheelCode);
      if (!wheelId) throw new Error(`Wheel not found: ${subsidy.wheelCode!}`);
      return {
        trim_id: trims.find((trim) => trim.slug === subsidy.trimSlug)?.id,
        wheel_id: wheelId.id,
        local_subsidy: subsidy.localSubsidy,
        national_subsidy: subsidy.nationalSubsidy,
        region_code: subsidy.regionCode,
        year: new Date().getFullYear(),
      };
    });

  const subsidies = teslaSubsidies
    .filter((subsidy) => !subsidy.wheelCode)
    .map((subsidy) => ({
      trim_id: trims.find((trim) => trim.slug === subsidy.trimSlug)?.id,
      local_subsidy: subsidy.localSubsidy,
      national_subsidy: subsidy.nationalSubsidy,
      region_code: subsidy.regionCode,
      year: new Date().getFullYear(),
    }));

  const { error: insertError } = await supabase
    .from("subsidies")
    .upsert(subsidies, { onConflict: "year,trim_id,region_code" });

  if (insertError) {
    throw new Error(insertError.message);
  }

  const { error: insertWheelError } = await supabase
    .from("wheel_specific_subsidies")
    .upsert(wheelSpecificSubsidies, {
      onConflict: "year,trim_id,wheel_id,region_code",
    });

  if (insertWheelError) {
    throw new Error(insertWheelError.message);
  }

  return Response.json({ result: "success", subsidies });
}

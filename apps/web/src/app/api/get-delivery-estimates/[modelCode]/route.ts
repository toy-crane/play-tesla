import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { alertDiscord } from "@/lib/discord";

interface Child {
  id: number;
  name: string;
  options: string[];
  isActive: boolean;
  inStart: string;
  inEnd: string;
  inType: string;
}

interface Delivery {
  id: number;
  // 특수한 옵션이 있는 경우 해당 옵션의 배송 가능 옵션 표기
  children: Child[];
  model: string;
  // trim 명을 여기서 찾아야 함
  options: string[];
  atDate: string | null;
  // 배송 시작 가능 일자
  inStart: string;
  // 배송 종료 가능 일자
  inEnd: string;
  // weeks, months, years
  inType: string;
}

interface TeslaResponse {
  eddData: Delivery[];
}

const modelSlug = {
  m3: "model3",
  my: "modely",
  mx: "modelx",
  ms: "models",
};

export async function GET(
  request: NextRequest,
  { params: { modelCode } }: { params: { modelCode: keyof typeof modelSlug } }
) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (!["m3", "my", "mx", "ms"].includes(modelCode)) {
    throw new Error("Invalid model");
  }
  console.log(`get-car-price ${modelCode} cron job start`);

  const TESLA_URL = `https://www.tesla.com/ko_kr/${modelCode}/design#overview`;
  const supabase = createClient({ type: "admin" });
  const { data, error } = await supabase
    .from("models")
    .select(
      "trims(code, id, trim_delivery_estimates(max_week, min_week, set_at))"
    )
    .eq("slug", modelSlug[modelCode]);

  if (error) {
    throw new Error(error.message);
  }

  const trims = data.flatMap((model) =>
    model.trims.map((trim) => {
      const sortedDeliveryEstimates = trim.trim_delivery_estimates.sort(
        (a, b) => new Date(b.set_at).getTime() - new Date(a.set_at).getTime()
      );
      return {
        code: trim.code,
        id: trim.id,
        latest_delivery_estimate: sortedDeliveryEstimates[0],
      };
    })
  );
  console.log("supabase fetch done");

  // add browser like headers for crawling
  const response = await fetch(TESLA_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Cache-Control": "max-age=0",
    },
  });
  console.log("tesla html fetch success");
  const html = await response.text();
  // eslint-disable-next-line prefer-named-capture-group -- ignore
  const pattern = /const tslaObj = ({[\s\S]*?});/;
  const match = pattern.exec(html);

  if (!match?.[1]) throw new Error("Match not found");

  // JSON.parse를 사용하여 객체로 변환합니다
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func -- ignore
  const teslaResponse = new Function(`return ${match[1]}`)() as TeslaResponse;
  const deliveries = teslaResponse.eddData;

  const trimDeliveryEstimate = trims.reduce<
    { trim_id: string; max_week: number; min_week: number; set_at: string }[]
  >((acc, { id, latest_delivery_estimate: LatestDeliveryEstimate, code }) => {
    const delivery = deliveries.find((d) => d.options.includes(code));
    if (!delivery) {
      console.error(`Delivery not found for trim ${code}`);
      return acc;
    }
    if (
      LatestDeliveryEstimate?.min_week !== Number(delivery.inStart) &&
      LatestDeliveryEstimate?.max_week !== Number(delivery.inEnd)
    ) {
      acc.push({
        trim_id: id,
        max_week: Number(delivery.inEnd),
        min_week: Number(delivery.inStart),
        set_at: new Date().toISOString(),
      });
    } else {
      console.log(`변경된 배송 정보가 없습니다. ${code}`);
    }
    return acc;
  }, []);

  if (trimDeliveryEstimate.length > 0) {
    await supabase.from("trim_delivery_estimates").insert(trimDeliveryEstimate);
    await alertDiscord(
      "https://discord.com/api/webhooks/1267804345362026537/YZBA5v6d5qen82sfFjEA6a3QbMGtF_Px9yIdzGFl3ehN1Z0H3Lemm0uvxY4aiPo4q1eC",
      `배송 정보가 변경되었습니다. 차량코드: ${modelCode} 차량이름: ${modelSlug[modelCode]}`
    );
  } else {
    await alertDiscord(
      "https://discord.com/api/webhooks/1267804345362026537/YZBA5v6d5qen82sfFjEA6a3QbMGtF_Px9yIdzGFl3ehN1Z0H3Lemm0uvxY4aiPo4q1eC",
      `변경된 배송 정보가 없습니다. 차량코드: ${modelCode} 차량이름: ${modelSlug[modelCode]}`
    );
  }

  return NextResponse.json({
    result: "success",
  });
}

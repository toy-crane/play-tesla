import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { alertDiscord } from "@/lib/discord";

interface TeslaResponse {
  DSServices: {
    "Lexicon.m3": {
      options: Record<
        string,
        {
          pricing: {
            value: number;
            type: string;
          }[];
        }
      >;
    };
  };
}

interface Request {
  model: string;
}

export async function POST(request: NextRequest) {
  const { model } = (await request.json()) as Request;

  if (!["model3", "modely", "modelx", "models"].includes(model)) {
    return new Response("Invalid model", { status: 400 });
  }

  const TESLA_URL = `https://www.tesla.com/ko_kr/${model}/design#overview`;
  const supabase = createClient({ type: "admin" });
  const { data, error } = await supabase
    .from("models")
    .select("trims(code, id, slug, trim_prices(price_set_at, price))")
    .eq("slug", model);

  if (error) {
    throw new Error(error.message);
  }

  const trims = data.flatMap((model) =>
    model.trims.map((trim) => {
      // Sort trim_prices by price_set_at in descending order
      const sortedPrices = trim.trim_prices.sort(
        (a, b) =>
          new Date(b.price_set_at).getTime() -
          new Date(a.price_set_at).getTime()
      );
      return {
        code: trim.code,
        trim_id: trim.id,
        slug: trim.slug,
        latest_price: {
          price: sortedPrices[0]?.price,
          price_set_at: sortedPrices[0]?.price_set_at,
        },
      };
    })
  );

  try {
    const response = await fetch(TESLA_URL);
    const html = await response.text();
    // eslint-disable-next-line prefer-named-capture-group -- ignore
    const pattern = /const dataJson = ({[\s\S]*?});/;
    const match = pattern.exec(html);

    if (!match?.[1]) throw new Error("Match not found");

    try {
      // JSON.parse를 사용하여 객체로 변환합니다
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func -- ignore
      const teslaResponse = new Function(
        `return ${match[1]}`
      )() as TeslaResponse;

      const options = teslaResponse.DSServices["Lexicon.m3"].options;

      for (const trim of trims) {
        const pricingOptions = options[trim.code];
        if (!pricingOptions) continue;
        const priceOption = pricingOptions.pricing.find(
          (p) => p.type === "base_plus_trim"
        );
        const latestPrice = trim.latest_price;
        if (priceOption && latestPrice.price !== priceOption.value) {
          // eslint-disable-next-line no-await-in-loop -- ignore
          await supabase.from("trim_prices").insert({
            price: priceOption.value,
            price_set_at: new Date().toISOString(),
            trim_id: trim.trim_id,
          });
          // eslint-disable-next-line no-await-in-loop -- ignore
          await alertDiscord(
            "https://discord.com/api/webhooks/1267804345362026537/YZBA5v6d5qen82sfFjEA6a3QbMGtF_Px9yIdzGFl3ehN1Z0H3Lemm0uvxY4aiPo4q1eC",
            `차량 가격이 ${new Date().toLocaleDateString()}에 변경되었습니다. 차량 코드: ${trim.code}, 차량 이름: ${trim.slug} 기존 가격: ${latestPrice.price}, 새로운 가격: ${priceOption.value}`
          );
        }
      }

      return NextResponse.json({
        result: "success",
      });
    } catch (e) {
      return NextResponse.json(
        { result: "error", message: "Failed to crawl Tesla page" },
        { status: 500 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { result: "error", message: "Failed to crawl Tesla page" },
      { status: 500 }
    );
  }
}

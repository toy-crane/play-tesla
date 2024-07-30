import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@/utils/supabase/server";

const TESLA_URL = "https://www.tesla.com/ko_kr/model3/design#overview";

export async function POST() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("models")
    .select(
      `
    trims(
      code, 
      id,
      trim_prices(
        price,
        price_set_at
      )
    )
  `
    )
    .eq("slug", "model3");

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
        latest_price: {
          price: sortedPrices[0]?.price,
          price_set_at: sortedPrices[0]?.price_set_at,
        },
      };
    })
  );

  console.log(trims);

  try {
    const response = await fetch(TESLA_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
    const pattern = /const dataJson = ({.*?});/s;
    const match = pattern.exec(html);

    if (match?.[1]) {
      try {
        // JSON.parse를 사용하여 객체로 변환합니다
        const teslaMeta = new Function(`return ${match[1]}`)();
        const m3 = teslaMeta.DSServices["Lexicon.m3"].options.$MT351.pricing;

        return NextResponse.json({
          result: "success",
          m3,
        });
      } catch (error) {
        console.error("tslaObj 파싱 중 오류 발생:", error);
        return null;
      }
    }
  } catch (error) {
    console.error("Error crawling Tesla page:", error);
    return NextResponse.json(
      { result: "error", message: "Failed to crawl Tesla page" },
      { status: 500 }
    );
  }
}

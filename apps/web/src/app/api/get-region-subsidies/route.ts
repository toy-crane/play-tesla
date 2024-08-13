import * as cheerio from "cheerio";
import { getRegionCode } from "@/constants/regions";
import { createClient } from "@/utils/supabase/server";
import { alertDiscord } from "@/lib/discord";

export const dynamic = "force-dynamic";

const SUBSIDY_API_URL =
  "https://ev.or.kr/nportal/buySupprt/initSubsidyPaymentCheckAction.do";

export async function GET(request: Request) {
  if (
    request.headers.get("Authorization") !==
    `Bearer ${process.env.CRON_SECRET!}`
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const supabase = createClient({ type: "admin" });
  const response = await fetch(SUBSIDY_API_URL, {
    method: "GET",
  });

  const text = await response.text();
  const $ = cheerio.load(text);
  const subsidies = $(".table01.fz15 tbody tr")
    .map((index, element) => {
      const provinceName = $(element).find("td").eq(0).text().trim();
      const cityName = $(element).find("td").eq(1).text().trim();
      if (cityName === "한국환경공단") return;
      const regionCode = getRegionCode(provinceName, cityName);
      const initialQuota = parseInt(
        $(element)
          .find("td")
          .eq(5)
          .contents()
          .last()
          .text()
          .trim()
          .replace(/[()]/g, ""),
        10
      );

      // 나머지 코드도 동일한 방식으로 적용
      const intakedQuota = parseInt(
        $(element)
          .find("td")
          .eq(6)
          .contents()
          .last()
          .text()
          .trim()
          .replace(/[()]/g, ""),
        10
      );

      const shippedQuota = parseInt(
        $(element)
          .find("td")
          .eq(7)
          .contents()
          .last()
          .text()
          .trim()
          .replace(/[()]/g, ""),
        10
      );

      const remainingQuota = parseInt(
        $(element)
          .find("td")
          .eq(8)
          .contents()
          .last()
          .text()
          .trim()
          .replace(/[()]/g, ""),
        10
      );
      return {
        initial_quota: initialQuota,
        shipped_quota: shippedQuota,
        intaked_quota: intakedQuota,
        remaining_quota: remainingQuota,
        region_code: regionCode,
        snapshot_date: new Date().toISOString().split("T")[0]!,
      };
    })
    .get();

  const { error } = await supabase.from("region_subsidies").insert(subsidies);

  if (error) {
    throw new Error(error.message);
  }

  await alertDiscord(
    "https://discord.com/api/webhooks/1234413370711736340/YMCJNwpQFSFfL5zFh5E3yrA31iR53dVsqZjtM24YrGRMBHfJZ9ThecuVlbLnV33XGEXS",
    "Region subsidies updated! 🚀"
  );

  return Response.json({ result: "success", subsidies });
}

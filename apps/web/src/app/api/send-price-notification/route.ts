import type { NextRequest } from "next/server";
import type { Tables } from "@/types/generated";
import { createClient } from "@/utils/supabase/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

interface Request {
  type: "INSERT";
  table: string;
  schema: string;
  record: Tables<"trim_prices">;
  old_record: null;
}

export async function POST(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const { record } = (await request.json()) as Request;

  const supabase = createClient();
  const { data: trim, error } = await supabase
    .from("trims")
    .select("*, models(name)")
    .eq("id", record.trim_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  const trimName = `${trim.models?.name} ${trim.name}`;
  const subject = `${trimName} 차량 가격이 변동 되었습니다`;
  const html = `
    <strong>${trimName} 차량 가격이 ${record.price}로 변동 되었습니다.</strong>
    자세한 내용은 아래 링크를 통해 확인 하세요.
    <a href="https://www.playtesla.xyz/prices/${trim.slug}">테슬라 차량 가격 변동 추이</a>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Play Tesla <notifications@playtesla.xyz>",
      to: ["alwaysfun2183@gmail.com"],
      subject,
      html,
    }),
  });

  if (res.ok) {
    const data = (await res.json()) as Record<string, unknown>;
    return Response.json(data);
  }
}

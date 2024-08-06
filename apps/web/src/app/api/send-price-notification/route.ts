import type { NextRequest } from "next/server";
import type { Tables } from "@/types/generated";

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
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Play Tesla <notifications@playtesla.xyz>",
      to: ["alwaysfun2183@gmail.com"],
      subject: "차량 가격이 변동 되었습니다",
      html: `<strong>${record.trim_id} 차량 가격이 변동 되었습니다.</strong>`,
    }),
  });

  if (res.ok) {
    const data = (await res.json()) as Record<string, unknown>;
    return Response.json(data);
  }
}

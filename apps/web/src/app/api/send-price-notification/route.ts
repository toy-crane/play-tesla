import type { NextRequest } from "next/server";
import { PriceNotificationEmail } from "@repo/transactional/emails/price-notification";
import { Resend } from "resend";
import type { Tables } from "@/types/generated";
import { createClient } from "@/utils/supabase/server";

interface Request {
  type: "INSERT";
  table: string;
  schema: string;
  record: Tables<"trim_prices">;
  old_record: null;
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const { data: trim, error: getTrimError } = await supabase
    .from("trims")
    .select("*, models(name, slug)")
    .eq("id", record.trim_id)
    .single();

  if (getTrimError) {
    throw new Error(getTrimError.message);
  }
  if (!trim.models) {
    throw new Error("Model not found");
  }

  const { data: subscribers, error: getSubscribersError } = await supabase
    .from("newsletter_subscribers")
    .select("*");

  if (getSubscribersError) {
    throw new Error(getSubscribersError.message);
  }

  if (subscribers.length === 0) throw new Error("No subscribers found");

  const trimName = `${trim.models.name} ${trim.name}`;
  const newPrice = record.price;
  const modelSlug = trim.models.slug;

  const emails = subscribers.map((subscriber) => ({
    from: "Play Tesla <notifications@playtesla.xyz>",
    to: subscriber.email,
    subject: `${trimName} 차량 가격이 변동 되었습니다`,
    react: PriceNotificationEmail({
      trimName,
      newPrice,
      modelSlug,
    }),
  }));

  const { data, error } = await resend.batch.send(emails);

  if (error) {
    throw new Error(error.message);
  }

  return Response.json({ result: "success", data });
}

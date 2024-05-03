"use server";
import type { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { FormSchema } from "./schema";

export default async function createSubscriber(
  data: z.infer<typeof FormSchema>
) {
  const validatedFields = FormSchema.safeParse(data);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error };
  }
  const supabase = createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: data.email,
  });

  if (error?.code === "23505") {
    return { success: true };
  }

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

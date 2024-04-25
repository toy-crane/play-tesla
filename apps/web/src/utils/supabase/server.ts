import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/generated";

export const createClient = (option?: { type?: "admin" | "client" }) => {
  const cookieStore = cookies();
  const key =
    option?.type === "admin"
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- cookie setting
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- cookie setting
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

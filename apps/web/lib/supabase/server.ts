import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isMockMode, createMockClient } from "./mockClient";

export async function createClient() {
  if (isMockMode) {
    return createMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored, as it's safe to skip if called during server components rendering
          }
        },
      },
    }
  );
}

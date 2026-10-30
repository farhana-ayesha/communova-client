import { headers } from "next/headers";
import { cache } from "react";
import { auth, type Session } from "@/lib/auth";

/**
 * One session lookup per request, shared by the header, footer, and any page
 * that needs the member. `cache` dedupes the call inside a single render pass.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ?? null;
});

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

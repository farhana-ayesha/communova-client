import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSession } from "@/lib/session";

/**
 * A short-lived JWT for the Express API. The browser obtains the same token
 * from `/api/auth/token`; server components use this helper so a private page
 * can render its real state on first paint.
 */
export async function getApiToken(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  try {
    const result = await auth.api.getToken({ headers: await headers() });
    return result?.token ?? null;
  } catch {
    return null;
  }
}

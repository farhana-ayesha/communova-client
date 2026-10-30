import type { EventDto, EventView } from "@/types/event";

/**
 * Server-side data access for public event pages. A failure is a value, not an
 * exception: a page must still render (with a designed offline state) when the
 * Express service is cold, restarting, or not yet deployed.
 */

const API_BASE = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000"
).replace(/\/+$/, "");

export type FeedResult<T> =
  | { ok: true; data: T; count: number }
  | { ok: false; reason: "offline" | "error" | "not_found"; status?: number };

type Envelope<T> = { data: T; meta?: { count?: number } };

const REQUEST_TIMEOUT_MS = 4_000;

async function request<T>(
  path: string,
  token?: string | null,
): Promise<FeedResult<T>> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;

  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, reason: "offline" };
  }

  if (response.status === 404) {
    return { ok: false, reason: "not_found", status: 404 };
  }

  if (!response.ok) {
    return { ok: false, reason: "error", status: response.status };
  }

  const body = (await response.json()) as Envelope<T>;

  return {
    ok: true,
    data: body.data,
    count: body.meta?.count ?? (Array.isArray(body.data) ? body.data.length : 1),
  };
}

export async function getUpcomingEvents(
  limit?: number,
  token?: string | null,
): Promise<FeedResult<EventDto[]>> {
  const query = limit ? `?limit=${limit}` : "";
  return request<EventDto[]>(`/api/events${query}`, token);
}

export async function getEventView(
  id: string,
  token?: string | null,
): Promise<FeedResult<EventView>> {
  return request<EventView>(`/api/events/${encodeURIComponent(id)}`, token);
}

import type { EventDto, EventView } from "@/types/event";

/**
 * Browser-side calls to the Express API. Every mutating request exchanges the
 * Better Auth session cookie for a short-lived JWT, then sends it as a bearer
 * token. The cookie itself never leaves the Next.js origin.
 */

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");

export class SignInRequiredError extends Error {
  constructor() {
    super("Sign in to continue.");
    this.name = "SignInRequiredError";
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getViewerToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!response.ok) return null;

    const body = (await response.json()) as { token?: string };
    if (!body.token) return null;

    // Reuse for four minutes; the token itself lives for fifteen.
    cachedToken = { value: body.token, expiresAt: Date.now() + 4 * 60 * 1000 };
    return body.token;
  } catch {
    return null;
  }
}

export function clearViewerToken() {
  cachedToken = null;
}

async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (init.body) headers.set("content-type", "application/json");

  if (authenticated) {
    const token = await getViewerToken();
    if (!token) throw new SignInRequiredError();
    headers.set("authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      credentials: "omit",
    });
  } catch {
    throw new ApiError(
      0,
      "network_error",
      "The register is not reachable. Check your connection and try again.",
    );
  }

  if (response.status === 401) {
    cachedToken = null;
    throw new SignInRequiredError();
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: { code?: string; message?: string; details?: unknown };
    } | null;

    throw new ApiError(
      response.status,
      body?.error?.code ?? "request_failed",
      body?.error?.message ?? "That request did not go through. Try again.",
      body?.error?.details,
    );
  }

  if (response.status === 204) return undefined as T;

  const body = (await response.json()) as { data: T };
  return body.data;
}

export function joinEventRequest(id: string): Promise<EventView> {
  return apiRequest<EventView>(`/api/events/${encodeURIComponent(id)}/join`, {
    method: "POST",
  });
}

export function leaveEventRequest(id: string): Promise<EventView> {
  return apiRequest<EventView>(`/api/events/${encodeURIComponent(id)}/join`, {
    method: "DELETE",
  });
}

export async function listJoinedEvents(): Promise<EventDto[]> {
  return apiRequest<EventDto[]>("/api/events/joined");
}

export async function listMyEvents(): Promise<EventDto[]> {
  return apiRequest<EventDto[]>("/api/events/mine");
}

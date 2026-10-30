"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Browser client for Better Auth. Requests stay same-origin, so no base URL is
 * needed; cookies are scoped to the app.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? undefined,
});

export const { signIn, signUp, signOut, useSession } = authClient;

import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/auth-errors";
import { isGoogleConfigured } from "@/lib/oauth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Communova record to create and join service events.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <LoginForm
      nextPath={safeNextPath(params.next)}
      googleEnabled={isGoogleConfigured()}
      oauthError={params.error === "google"}
    />
  );
}

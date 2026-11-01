import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/auth-errors";
import { isGoogleConfigured } from "@/lib/oauth";
import { getSession } from "@/lib/session";

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
  const nextPath = safeNextPath(params.next);

  // A member who is already signed in never needs the form again.
  if (await getSession()) redirect(nextPath);

  return (
    <LoginForm
      nextPath={nextPath}
      googleEnabled={isGoogleConfigured()}
      oauthError={params.error === "google"}
    />
  );
}

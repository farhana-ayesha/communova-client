import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { safeNextPath } from "@/lib/auth-errors";
import { isGoogleConfigured } from "@/lib/oauth";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Register",
  description: "Open a Communova record to create and join service events in Dhaka.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  if (await getSession()) redirect(nextPath);

  return <RegisterForm nextPath={nextPath} googleEnabled={isGoogleConfigured()} />;
}

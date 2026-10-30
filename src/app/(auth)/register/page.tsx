import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { safeNextPath } from "@/lib/auth-errors";
import { isGoogleConfigured } from "@/lib/oauth";

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

  return <RegisterForm nextPath={safeNextPath(params.next)} googleEnabled={isGoogleConfigured()} />;
}

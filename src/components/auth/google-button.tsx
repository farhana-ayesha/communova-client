"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage, safeNextPath } from "@/lib/auth-errors";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.64h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.18-2 3.44-4.96 3.44-8.57Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.89c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.03-6.45-4.75H1.7v2.98A11.5 11.5 0 0 0 12 23.5Z"
      />
      <path
        fill="#FBBC05"
        d="M5.55 14.17a6.9 6.9 0 0 1 0-4.34V6.85H1.7a11.5 11.5 0 0 0 0 10.3l3.85-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.69 0 3.2.58 4.4 1.72l3.3-3.3A11.1 11.1 0 0 0 12 .5 11.5 11.5 0 0 0 1.7 6.85l3.85 2.98C6.46 7.11 9 4.75 12 4.75Z"
      />
    </svg>
  );
}

/**
 * Google is either fully configured or gracefully explained. With placeholder
 * keys the button never sends anyone to an OAuth error page.
 */
function GoogleButton({
  nextPath,
  enabled,
  label = "Continue with Google",
}: {
  nextPath: string;
  enabled: boolean;
  label?: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!enabled) {
      toast.info("Google sign-in is not configured in this environment yet.", {
        description: "Use email and password, or add the OAuth keys to enable it.",
      });
      return;
    }

    setPending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: safeNextPath(nextPath),
      errorCallbackURL: "/login?error=google",
    });

    if (error) {
      setPending(false);
      toast.error(authErrorMessage(error));
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className="w-full justify-center"
      onClick={handleClick}
      disabled={pending}
      aria-busy={pending}
    >
      <GoogleMark />
      {pending ? "Opening Google…" : label}
    </Button>
  );
}

export { GoogleButton };

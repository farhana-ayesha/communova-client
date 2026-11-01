"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { clearViewerToken } from "@/lib/events-client";

function SignOutButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setPending(true);
    const { error } = await authClient.signOut();

    if (error) {
      setPending(false);
      toast.error("Could not sign you out.", {
        description: "Check your connection and try again.",
      });
      return;
    }

    clearViewerToken();
    toast.success("Signed out.", { description: "Your record stays where you left it." });
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="secondary"
      onClick={() => void handleSignOut()}
      disabled={pending}
      className="justify-between"
    >
      {pending ? "Signing out…" : "Sign out"}
      <LogOut className="size-4" aria-hidden />
    </Button>
  );
}

export { SignOutButton };

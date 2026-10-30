"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Toasts follow the active theme and use the same square, hairline-bordered
 * surface as dialogs. Never `alert()` — every result is announced here.
 */
function Toaster() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
      className="font-sans"
      toastOptions={{
        classNames: {
          toast:
            "rounded-[2px] border border-bark bg-card text-ink shadow-overlay font-sans text-small",
          title: "font-medium text-ink",
          description: "text-ink-muted",
          actionButton: "rounded-[2px] bg-primary text-primary-foreground",
          cancelButton: "rounded-[2px] bg-sand text-ink",
          closeButton: "border-bark bg-card text-ink hover:bg-sand",
        },
      }}
    />
  );
}

export { Toaster };

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-36 w-full resize-y rounded-[2px] border border-input bg-card px-3.5 py-3 text-[15px] leading-relaxed text-ink transition-colors",
        "placeholder:text-ink-muted/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-clay aria-invalid:ring-1 aria-invalid:ring-clay/25",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

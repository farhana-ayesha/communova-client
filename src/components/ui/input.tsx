import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-[2px] border border-input bg-card px-3.5 text-[15px] text-ink transition-colors",
        "placeholder:text-ink-muted/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-clay aria-invalid:ring-1 aria-invalid:ring-clay/25",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-small file:font-medium file:text-ink",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

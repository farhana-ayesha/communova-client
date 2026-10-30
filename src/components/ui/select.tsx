import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "h-11 w-full appearance-none rounded-[2px] border border-input bg-card px-3.5 pr-10 text-[15px] text-ink transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-clay aria-invalid:ring-1 aria-invalid:ring-clay/25",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
    </div>
  );
}

export { Select };

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  /** Short uppercase label, e.g. "From the field". */
  label: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * The shared section opener: hairline, quiet label, serif heading. No index
 * numbers — the register's dates and counts carry enough structure on their own.
 */
function SectionHeader({
  label,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      className={cn("border-t border-bark pt-6", className)}
    >
      <div className="grid gap-5 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <span className="font-mono text-eyebrow uppercase text-clay">
            {label}
          </span>
        </div>

        <div className="md:col-span-9">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h2 className="max-w-[24ch] text-balance font-serif text-h2 text-ink">
              {title}
            </h2>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>

          {description ? (
            <p className="mt-4 max-w-[56ch] text-body text-ink-muted">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { SectionHeader };

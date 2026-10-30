import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Status tags carry their color in a 6px dot, not in the label, so the text
 * always keeps full contrast in both themes.
 */
const tagVariants = cva(
  "inline-flex items-center gap-2 rounded-[2px] border border-bark bg-transparent px-2.5 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-ink",
  {
    variants: {
      tone: {
        upcoming: "[&>span]:bg-fern",
        past: "[&>span]:bg-ink-muted",
        joined: "[&>span]:bg-marigold",
        full: "[&>span]:bg-clay",
        neutral: "[&>span]:bg-ink",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

type TagProps = ComponentProps<"span"> & VariantProps<typeof tagVariants>;

function Tag({ className, tone, children, ...props }: TagProps) {
  return (
    <span data-slot="tag" className={cn(tagVariants({ tone }), className)} {...props}>
      <span aria-hidden className="size-1.5 shrink-0 rounded-[1px]" />
      {children}
    </span>
  );
}

export { Tag, tagVariants };

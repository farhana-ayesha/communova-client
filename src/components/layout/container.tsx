import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Page gutter and max width. Every section on every page uses this so the
 * vertical edges of the site never move.
 */
function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-[1320px] px-5 md:px-10 xl:px-16", className)}
      {...props}
    />
  );
}

export { Container };

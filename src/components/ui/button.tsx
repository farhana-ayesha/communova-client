import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[2px] border font-sans font-medium tracking-[0.01em] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover disabled:border-bark disabled:bg-sand disabled:text-ink-muted disabled:opacity-100",
        secondary:
          "border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
        ghost: "border-transparent bg-transparent text-ink hover:bg-sand",
        destructive:
          "border-clay/40 bg-transparent text-clay hover:border-clay hover:bg-clay hover:text-destructive-foreground",
        link: "border-transparent bg-transparent px-0 text-ink underline decoration-bark underline-offset-4 hover:text-clay hover:decoration-clay",
      },
      size: {
        sm: "h-9 px-3 text-[13px]",
        md: "h-11 px-5 text-[15px]",
        lg: "h-[52px] px-6 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };

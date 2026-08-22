import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-wider transition-all select-none",
  {
    variants: {
      variant: {
        default:
          "border border-dashed border-amber-accent bg-amber-accent/10 text-amber-accent",
        teal:
          "border border-dashed border-teal-primary bg-teal-primary/10 text-teal-primary",
        amber:
          "border border-dashed border-amber-accent bg-amber-accent/10 text-amber-accent",
        danger:
          "border border-dashed border-brick-danger bg-brick-danger/10 text-brick-danger",
        solidTeal: "bg-teal-primary text-white",
        solidAmber: "bg-amber-accent text-white",
        outline:
          "border border-border-muted bg-surface text-ink",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
      rotated: {
        none: "",
        left: "-rotate-1",
        right: "rotate-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rotated: "none",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant,
  size,
  rotated,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, rotated, className }))}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

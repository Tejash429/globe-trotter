import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-sans text-sm font-semibold transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-teal-primary text-white hover:bg-teal-hover shadow-sm focus-visible:ring-teal-primary focus-visible:ring-offset-paper",
        secondary:
          "bg-surface text-ink border border-border-muted hover:bg-paper shadow-2xs focus-visible:ring-teal-primary focus-visible:ring-offset-paper",
        accent:
          "bg-amber-accent text-white hover:bg-amber-hover shadow-sm focus-visible:ring-amber-accent focus-visible:ring-offset-paper",
        danger:
          "bg-brick-danger text-white hover:bg-brick-hover shadow-sm focus-visible:ring-brick-danger focus-visible:ring-offset-paper",
        outline:
          "border border-teal-primary/40 text-teal-primary bg-transparent hover:bg-teal-primary/10 focus-visible:ring-teal-primary focus-visible:ring-offset-paper",
        ghost:
          "text-ink hover:bg-paper/80 hover:text-teal-primary focus-visible:ring-teal-primary focus-visible:ring-offset-paper",
        link: "text-teal-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-lg",
        icon: "h-10 w-10 p-0 rounded-md",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export { buttonVariants };

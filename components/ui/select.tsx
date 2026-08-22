import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-sans text-xs font-semibold text-ink uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full py-2.5 bg-paper/60 border border-border-muted rounded-md font-mono text-sm text-ink appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon ? "pl-9 pr-9" : "pl-3.5 pr-9",
              error && "border-brick-danger focus:ring-brick-danger/30 focus:border-brick-danger",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">
            <ChevronDown className="w-4 h-4 text-teal-primary/70" />
          </div>
        </div>
        {error ? (
          <p className="font-sans text-xs text-brick-danger flex items-center gap-1 mt-1">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

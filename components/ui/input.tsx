import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMonospace?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isMonospace = true,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
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
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full py-2.5 bg-paper/60 border border-border-muted rounded-md text-sm text-ink placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary disabled:cursor-not-allowed disabled:opacity-50",
              isMonospace ? "font-mono" : "font-sans",
              leftIcon ? "pl-9" : "pl-3.5",
              rightIcon ? "pr-10" : "pr-3.5",
              error && "border-brick-danger focus:ring-brick-danger/30 focus:border-brick-danger",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

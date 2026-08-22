import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  badge?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      badge,
      error,
      helperText,
      leftIcon,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {(label || badge) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={textareaId}
                className="block font-sans text-xs font-semibold text-ink uppercase tracking-wider"
              >
                {label}
              </label>
            )}
            {badge && (
              <span className="font-mono text-[10px] text-muted-foreground font-normal">
                {badge}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute top-3 left-3 pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <textarea
            id={textareaId}
            ref={ref}
            className={cn(
              "w-full py-2.5 bg-paper/60 border border-border-muted rounded-md font-mono text-sm text-ink placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[90px]",
              leftIcon ? "pl-9 pr-3.5" : "px-3.5",
              error && "border-brick-danger focus:ring-brick-danger/30 focus:border-brick-danger",
              className
            )}
            {...props}
          />
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

Textarea.displayName = "Textarea";

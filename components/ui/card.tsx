import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isTicketStub?: boolean;
  withRouteDivider?: boolean;
}

export function Card({
  className,
  isTicketStub = true,
  withRouteDivider = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border-muted rounded-xl shadow-xs relative overflow-hidden transition-all duration-200",
        isTicketStub && "ticket-stub",
        withRouteDivider && "route-divider",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  withDivider = true,
}: {
  className?: string;
  children: React.ReactNode;
  withDivider?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-6 pb-4",
        withDivider && "route-divider",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      className={cn(
        "font-display text-xl sm:text-2xl font-bold text-ink leading-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("font-sans text-xs text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-6 text-ink", className)}>{children}</div>;
}

export function CardFooter({
  className,
  children,
  withDivider = true,
}: {
  className?: string;
  children: React.ReactNode;
  withDivider?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-4 px-6 flex items-center justify-between",
        withDivider && "border-t border-border-muted bg-paper/40",
        className
      )}
    >
      {children}
    </div>
  );
}

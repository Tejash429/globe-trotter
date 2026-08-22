"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within Tabs");
  }
  return context;
}

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, className, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-paper border border-border-muted rounded-lg font-mono text-xs select-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  icon,
  children,
}: {
  value: string;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { value: activeValue, onValueChange } = useTabs();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition-all cursor-pointer",
        isActive
          ? "bg-teal-primary text-white shadow-xs"
          : "text-muted-foreground hover:text-ink hover:bg-surface/50",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { value: activeValue } = useTabs();
  if (activeValue !== value) return null;

  return (
    <div
      className={cn(
        "mt-4 animate-in fade-in-50 zoom-in-98 duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

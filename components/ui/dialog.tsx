"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  isOpen: boolean;
  onClose: () => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a Dialog");
  }
  return context;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, children }: DialogProps) {
  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <DialogContext.Provider value={{ isOpen, onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div
          role="dialog"
          aria-modal="true"
          className="relative z-10 w-full max-w-lg bg-surface border border-border-muted rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export function DialogHeader({
  className,
  children,
  stampText,
}: {
  className?: string;
  children: React.ReactNode;
  stampText?: string;
}) {
  const { onClose } = useDialog();

  return (
    <div
      className={cn(
        "flex items-start justify-between p-6 pb-4 route-divider bg-surface",
        className
      )}
    >
      <div className="flex-1 pr-4">
        {children}
        {stampText && (
          <span className="stamp-badge mt-2 inline-block">
            {stampText}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        type="button"
        className="rounded-md p-1.5 text-muted-foreground hover:text-ink hover:bg-paper transition-colors cursor-pointer"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export function DialogTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      className={cn(
        "font-display text-xl sm:text-2xl font-bold text-ink leading-snug",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function DialogDescription({
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

export function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-6 text-ink", className)}>{children}</div>;
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-4 px-6 bg-paper/50 border-t border-border-muted",
        className
      )}
    >
      {children}
    </div>
  );
}

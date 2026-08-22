"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

type ToastListener = (toast: ToastItem) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  success: (title: string, message?: string, duration = 4000) => {
    emit({ id: Math.random().toString(36).slice(2), type: "success", title, message, duration });
  },
  error: (title: string, message?: string, duration = 4500) => {
    emit({ id: Math.random().toString(36).slice(2), type: "error", title, message, duration });
  },
  warning: (title: string, message?: string, duration = 4000) => {
    emit({ id: Math.random().toString(36).slice(2), type: "warning", title, message, duration });
  },
  info: (title: string, message?: string, duration = 4000) => {
    emit({ id: Math.random().toString(36).slice(2), type: "info", title, message, duration });
  },
};

function emit(toastItem: ToastItem) {
  listeners.forEach((listener) => listener(toastItem));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleNewToast = (newToast: ToastItem) => {
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration);
      }
    };

    listeners.add(handleNewToast);
    return () => {
      listeners.delete(handleNewToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => removeToast(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  };

  const getStyle = () => {
    switch (item.type) {
      case "success":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-teal-primary shrink-0 mt-0.5" />,
          badge: "bg-teal-primary/10 text-teal-primary border-teal-primary/30",
          badgeText: "PASSPORT STAMP",
          accentBorder: "border-l-4 border-l-teal-primary",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4 text-brick-danger shrink-0 mt-0.5" />,
          badge: "bg-brick-danger/10 text-brick-danger border-brick-danger/30",
          badgeText: "ALERT",
          accentBorder: "border-l-4 border-l-brick-danger",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-accent shrink-0 mt-0.5" />,
          badge: "bg-amber-accent/10 text-amber-accent border-amber-accent/30",
          badgeText: "CAUTION",
          accentBorder: "border-l-4 border-l-amber-accent",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-4 h-4 text-teal-primary shrink-0 mt-0.5" />,
          badge: "bg-teal-primary/10 text-teal-primary border-teal-primary/30",
          badgeText: "NOTICE",
          accentBorder: "border-l-4 border-l-teal-primary",
        };
    }
  };

  const style = getStyle();

  return (
    <div
      role="alert"
      className={`pointer-events-auto bg-surface border border-border-muted rounded-xl p-4 shadow-xl flex items-start gap-3 transition-all duration-200 ${
        style.accentBorder
      } ${
        isExiting
          ? "opacity-0 translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-3"
      }`}
    >
      {style.icon}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-sans font-semibold text-xs text-ink leading-snug">
            {item.title}
          </span>
          <span
            className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${style.badge}`}
          >
            {style.badgeText}
          </span>
        </div>
        {item.message && (
          <p className="font-sans text-xs text-muted-foreground leading-relaxed">
            {item.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleClose}
        className="text-muted-foreground hover:text-ink p-1 rounded-lg hover:bg-paper transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

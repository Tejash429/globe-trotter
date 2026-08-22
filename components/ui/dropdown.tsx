"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface CustomDropdownProps {
  labelPrefix?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  leftIcon?: React.ReactNode;
  className?: string;
  align?: "left" | "right";
  isActive?: boolean;
}

export function CustomDropdown({
  labelPrefix,
  value,
  onChange,
  options,
  leftIcon,
  className,
  align = "left",
  isActive,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find active option label
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeHighlight = isActive ?? (value !== "all" && value !== "popular");

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          "inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all duration-200 cursor-pointer border select-none whitespace-nowrap",
          isOpen
            ? "bg-surface border-teal-primary text-ink shadow-sm ring-2 ring-teal-primary/20"
            : activeHighlight
            ? "bg-teal-primary/10 border-teal-primary/40 text-teal-primary hover:bg-teal-primary/15 font-semibold"
            : "bg-surface hover:bg-paper border-border-muted text-ink/80 hover:text-ink shadow-2xs"
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <div className="flex items-center gap-1 truncate">
            {labelPrefix && (
              <span className="text-muted-foreground font-normal">
                {labelPrefix}:
              </span>
            )}
            <span className="font-semibold text-ink truncate">
              {selectedOption?.label || value}
            </span>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-teal-primary"
          )}
        />
      </button>

      {/* Popover Menu Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 min-w-[190px] w-auto max-w-[260px] rounded-xl bg-surface border border-border-muted/90 p-1.5 shadow-xl shadow-ink/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div className="space-y-0.5" role="menu" aria-orientation="vertical">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-sans text-left transition-colors cursor-pointer",
                    isSelected
                      ? "bg-teal-primary text-white font-semibold shadow-xs"
                      : "text-ink hover:bg-paper hover:text-teal-primary font-medium"
                  )}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon && (
                      <span className={cn("shrink-0", isSelected ? "text-white" : "text-muted-foreground")}>
                        {option.icon}
                      </span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {option.badge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-mono",
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-paper border border-border-muted text-muted-foreground"
                        )}
                      >
                        {option.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

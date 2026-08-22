"use client";

import React from "react";
import { Compass, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-dashed border-border-muted/70 py-4 mt-12 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-teal-primary shrink-0" />
          <span className="font-semibold text-ink">GlobeTrotter</span>
          <span>• Passport & Travel Planning</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <span>Crafted for adventurers with</span>
            <Heart className="w-3 h-3 text-brick-danger fill-brick-danger" />
          </span>
          <span className="text-muted-foreground/60 hidden sm:inline">•</span>
          <span className="hidden sm:inline">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

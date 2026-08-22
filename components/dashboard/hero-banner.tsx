"use client";

import { Compass, Sparkles, Globe2, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { Button, Badge } from "@/components/ui";

interface HeroBannerProps {
  onPlanTripClick: () => void;
}

export function HeroBanner({ onPlanTripClick }: HeroBannerProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border-muted shadow-md min-h-[360px] sm:min-h-[420px] flex items-center">
      {/* 1. Full Panoramic Photographic Banner Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
        alt="Scenic travel expedition landscape"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 hover:scale-100"
      />

      {/* 2. Sophisticated Warm Cartography Gradient Overlay for flawless text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/40 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent sm:hidden" />

      {/* 3. Subtle Dashed Route Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FAF9F5_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* 4. Main Banner Content */}
      <div className="relative z-10 w-full px-6 py-10 sm:px-12 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl text-left space-y-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
              EXPLORER DISCOVERY PORTAL
            </Badge>
            <span className="font-mono text-xs text-[#FAF9F5]/80 hidden sm:inline-block">
              • SEASON 2026
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-sm">
            Where Will Your Next <br />
            <span className="text-amber-accent underline decoration-white/60 decoration-wavy decoration-2">
              Passport Stamp
            </span>{" "}
            Take You?
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#FAF9F5]/90 leading-relaxed max-w-lg drop-shadow-xs">
            Design multi-city journeys with structured daily timelines, automatic cost estimation, and interactive calendar stops — making travel planning as unforgettable as the destination.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={onPlanTripClick}
              leftIcon={<Compass className="w-4 h-4" />}
              className="shadow-md"
            >
              Start Planning Trip
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const element = document.getElementById("regional-selections");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-surface/90 backdrop-blur-md hover:bg-surface border-white/40"
            >
              Explore Destinations
            </Button>
          </div>
        </div>

        {/* Right Travel Stub Badge Highlight Card with Blur */}
        <div className="w-full max-w-xs ticket-stub p-5 bg-surface/95 backdrop-blur-md border border-border-muted rounded-xl shadow-lg space-y-4 shrink-0">
          <div className="flex items-center justify-between route-divider pb-3">
            <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              EXPEDITION METRICS
            </span>
            <span className="stamp-badge text-[10px]">
              VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-paper/80 border border-border-muted/60">
              <span className="text-muted-foreground block text-[10px] uppercase">
                Curated Cities
              </span>
              <span className="font-bold text-ink text-base">140+</span>
            </div>
            <div className="p-2.5 rounded-lg bg-paper/80 border border-border-muted/60">
              <span className="text-muted-foreground block text-[10px] uppercase">
                Active Itineraries
              </span>
              <span className="font-bold text-teal-primary text-base">3,800+</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-paper/80 border border-border-muted/60 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-accent" />
              <span className="font-semibold text-ink">Global Reach</span>
            </div>
            <span className="text-muted-foreground font-semibold">48 Countries</span>
          </div>
        </div>
      </div>
    </div>
  );
}

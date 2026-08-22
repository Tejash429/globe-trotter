"use client";

import { MapPin, Compass, Landmark, Palmtree, Mountain, Waves, Navigation2, Check, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui";

export interface Region {
  id: string;
  name: string;
  subhead: string;
  countryCount: number;
  cityCount: number;
  costIndex: "BUDGET" | "MODERATE" | "LUXURY";
  averageDailyCost: number;
  popularityScore: number;
  group: "europe" | "asia" | "americas" | "mediterranean";
  highlightCities: string[];
  imageUrl: string;
  tag: string;
}

export const REGIONS_DATA: Region[] = [
  {
    id: "western-europe",
    name: "Western Europe",
    subhead: "Castles & Historic Capitals",
    countryCount: 6,
    cityCount: 42,
    costIndex: "LUXURY",
    averageDailyCost: 220,
    popularityScore: 98,
    group: "europe",
    highlightCities: ["Paris", "Rome", "Amsterdam", "Vienna"],
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    tag: "TOP RATED",
  },
  {
    id: "southeast-asia",
    name: "Southeast Asia",
    subhead: "Tropical Havens & Temples",
    countryCount: 5,
    cityCount: 38,
    costIndex: "BUDGET",
    averageDailyCost: 65,
    popularityScore: 94,
    group: "asia",
    highlightCities: ["Bangkok", "Bali", "Hanoi", "Singapore"],
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    tag: "BEST VALUE",
  },
  {
    id: "nordic-fjords",
    name: "Nordic Fjords",
    subhead: "Glaciers & Northern Lights",
    countryCount: 4,
    cityCount: 24,
    costIndex: "LUXURY",
    averageDailyCost: 240,
    popularityScore: 91,
    group: "europe",
    highlightCities: ["Reykjavik", "Bergen", "Tromsø", "Oslo"],
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tag: "SCENIC",
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    subhead: "Sunlit Coasts & Islands",
    countryCount: 5,
    cityCount: 35,
    costIndex: "MODERATE",
    averageDailyCost: 175,
    popularityScore: 96,
    group: "mediterranean",
    highlightCities: ["Santorini", "Amalfi", "Dubrovnik", "Nice"],
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    tag: "COASTAL",
  },
  {
    id: "andes-patagonia",
    name: "Andes & Patagonia",
    subhead: "Alpine Peaks & Incan Trails",
    countryCount: 4,
    cityCount: 28,
    costIndex: "MODERATE",
    averageDailyCost: 110,
    popularityScore: 89,
    group: "americas",
    highlightCities: ["Cusco", "Bariloche", "Santiago", "Ushuaia"],
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    tag: "ADVENTURE",
  },
];

interface RegionalSelectionsProps {
  selectedRegion: string | null;
  onSelectRegion: (id: string | null) => void;
}

export function RegionalSelections({
  selectedRegion,
  onSelectRegion,
}: RegionalSelectionsProps) {
  return (
    <section id="regional-selections" className="w-full space-y-4">
      {/* Section Header with Dashed Map Route Line matching Excalidraw */}
      <div className="flex items-center justify-between route-divider pb-2">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            Top Regional Selections
          </h2>
          <span className="stamp-badge hidden sm:inline-flex text-[10px]">
            CURATED HUBS
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Compass className="w-3.5 h-3.5 text-teal-primary" />
          <span>Click to filter trip destinations</span>
        </div>
      </div>

      {/* 5 Square Cards Grid with High-Resolution Photography */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {REGIONS_DATA.map((region) => {
          const isSelected = selectedRegion === region.id;

          return (
            <div
              key={region.id}
              onClick={() => onSelectRegion(isSelected ? null : region.id)}
              className={`group cursor-pointer rounded-xl overflow-hidden aspect-square border transition-all duration-300 relative flex flex-col justify-between p-4 ${
                isSelected
                  ? "border-teal-primary ring-3 ring-teal-primary/40 shadow-lg transform -translate-y-1"
                  : "border-border-muted hover:border-teal-primary hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Background Photographic Image from Unsplash */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={region.imageUrl}
                alt={region.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Rich Multi-stop Gradient Overlay for Crisp Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/60 to-ink/30 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Top Tags & Selected Badge */}
              <div className="relative z-10 flex items-start justify-between">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface/90 backdrop-blur-xs text-ink shadow-xs">
                  {region.tag}
                </span>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-teal-primary text-white flex items-center justify-center shadow-md animate-in zoom-in-75">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="font-mono text-[10px] text-amber-accent font-bold px-1.5 py-0.5 rounded bg-ink/60 backdrop-blur-xs border border-amber-accent/40">
                    {region.costIndex === "BUDGET" ? "$" : region.costIndex === "MODERATE" ? "$$" : "$$$"}
                  </span>
                )}
              </div>

              {/* Bottom Content: Region Name, Subtitle, and City Count */}
              <div className="relative z-10 space-y-1 text-white">
                <h3 className="font-display text-base sm:text-lg font-bold leading-tight group-hover:text-amber-accent transition-colors drop-shadow-xs">
                  {region.name}
                </h3>
                <p className="font-sans text-[11px] text-[#FAF9F5]/85 line-clamp-1">
                  {region.subhead}
                </p>

                <div className="pt-1.5 border-t border-white/20 flex items-center justify-between font-mono text-[10px] text-[#FAF9F5]/90">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-accent" />
                    <span>{region.cityCount} Cities</span>
                  </span>
                  <span className="font-semibold text-amber-accent">
                    ~${region.averageDailyCost}/day
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

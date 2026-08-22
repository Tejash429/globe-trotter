"use client";

import { TripCard, TripCardProps } from "@/components/trips/trip-card";

export interface Trip {
  id: string;
  code: string;
  title: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  destinationCount: number;
  stops: string[];
  activityCount: number;
  estimatedCost: number;
  budgetCap: number;
  status: "upcoming" | "completed" | "draft";
  coverImage: string;
}

export const SAMPLE_TRIPS: Trip[] = [
  {
    id: "trip-1",
    code: "GT-EUR-2026",
    title: "Grand European Odyssey",
    dateRange: "JUL 01 – JUL 15, 2026",
    startDate: "2026-07-01",
    endDate: "2026-07-15",
    durationDays: 14,
    destinationCount: 3,
    stops: ["Paris (4d)", "Amsterdam (4d)", "Rome (6d)"],
    activityCount: 16,
    estimatedCost: 3100,
    budgetCap: 3500,
    status: "upcoming",
    coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "trip-2",
    code: "GT-JPN-2025",
    title: "Kyoto & Tokyo Blossom Trail",
    dateRange: "OCT 02 – OCT 14, 2025",
    startDate: "2025-10-02",
    endDate: "2025-10-14",
    durationDays: 12,
    destinationCount: 3,
    stops: ["Tokyo (5d)", "Kyoto (4d)", "Osaka (3d)"],
    activityCount: 22,
    estimatedCost: 1820,
    budgetCap: 2000,
    status: "completed",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "trip-3",
    code: "GT-ALP-2026",
    title: "Swiss Alps & Dolomites Trail",
    dateRange: "AUG 10 – AUG 20, 2026",
    startDate: "2026-08-10",
    endDate: "2026-08-20",
    durationDays: 10,
    destinationCount: 4,
    stops: ["Zurich (2d)", "Zermatt (3d)", "Cortina (3d)", "Innsbruck (2d)"],
    activityCount: 14,
    estimatedCost: 2890,
    budgetCap: 2700,
    status: "draft",
    coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
  },
];

interface PreviousTripsProps {
  onViewTrip: (trip: Trip) => void;
  filterRegion?: string | null;
}

export function PreviousTrips({ onViewTrip, filterRegion }: PreviousTripsProps) {
  return (
    <section className="w-full space-y-4">
      {/* Section Header with Dashed Map Route Line matching Excalidraw */}
      <div className="flex items-center justify-between route-divider pb-2">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            Previous Trips
          </h2>
          <span className="stamp-badge hidden sm:inline-flex text-[10px]">
            PASSPORT ITINERARIES
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground uppercase">
          {SAMPLE_TRIPS.length} Trips Recorded
        </span>
      </div>

      {/* 3 Tall Cards Grid matching Excalidraw */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SAMPLE_TRIPS.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onView={() => onViewTrip(trip)}
          />
        ))}
      </div>
    </section>
  );
}

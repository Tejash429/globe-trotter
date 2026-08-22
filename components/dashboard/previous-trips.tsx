"use client";

import {
  Calendar,
  MapPin,
  DollarSign,
  ArrowRight,
  Plane,
  CheckCircle2,
  Clock,
  FileEdit,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

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
  const getStatusBadge = (status: Trip["status"]) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="teal" icon={<Clock className="w-3 h-3" />}>
            UPCOMING
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" icon={<CheckCircle2 className="w-3 h-3 text-teal-primary" />}>
            COMPLETED
          </Badge>
        );
      case "draft":
      default:
        return (
          <Badge variant="amber" icon={<FileEdit className="w-3 h-3" />}>
            IN DRAFT
          </Badge>
        );
    }
  };

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
        {SAMPLE_TRIPS.map((trip) => {
          const budgetPercent = Math.min(
            100,
            Math.round((trip.estimatedCost / trip.budgetCap) * 100)
          );
          const isOverbudget = trip.estimatedCost > trip.budgetCap;

          return (
            <Card
              key={trip.id}
              isTicketStub
              className="flex flex-col justify-between overflow-hidden hover:shadow-md transition-all duration-300 group border-border-muted"
            >
              {/* Trip Photo Cover Banner */}
              <div className="relative h-36 w-full overflow-hidden border-b border-border-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-black/20" />
                
                {/* Status & Code Over Photo */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="px-2 py-1 rounded bg-ink/70 backdrop-blur-xs text-white font-mono text-[10px] font-bold border border-white/20">
                    {trip.code}
                  </div>
                  {getStatusBadge(trip.status)}
                </div>

                <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white font-mono text-xs drop-shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-amber-accent shrink-0" />
                  <span>{trip.dateRange}</span>
                </div>
              </div>

              {/* Ticket Body Content */}
              <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-ink group-hover:text-teal-primary transition-colors leading-tight">
                    {trip.title}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground mt-1">
                    {trip.destinationCount} Destination Stops • {trip.activityCount} Activities
                  </p>
                </div>

                {/* Stops Route with Dots */}
                <div className="p-3 rounded-lg bg-paper/80 border border-border-muted/70 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block">
                    Planned Waypoints:
                  </span>
                  <div className="space-y-1 font-sans text-xs text-ink font-medium">
                    {trip.stops.map((stop, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-primary shrink-0" />
                        <span>{stop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-teal-primary" />
                      <span>Budget:</span>
                    </span>
                    <span
                      className={`font-bold ${
                        isOverbudget ? "text-brick-danger" : "text-ink"
                      }`}
                    >
                      ${trip.estimatedCost.toLocaleString()} / ${trip.budgetCap.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-paper border border-border-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverbudget ? "bg-brick-danger" : "bg-teal-primary"
                      }`}
                      style={{ width: `${budgetPercent}%` }}
                    />
                  </div>
                  {isOverbudget && (
                    <div className="flex items-center gap-1 font-mono text-[10px] text-brick-danger font-semibold">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Over budget by ${(trip.estimatedCost - trip.budgetCap).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-3 border-t border-border-muted flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {trip.durationDays} Days Duration
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onViewTrip(trip)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Itinerary
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

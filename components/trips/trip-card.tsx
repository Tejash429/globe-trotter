"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  DollarSign,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileEdit,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

export interface TripCardProps {
  trip: {
    id: string;
    code?: string;
    title: string;
    destinationPlace?: string;
    description?: string;
    dateRange?: string;
    startDate?: string;
    endDate?: string;
    durationDays?: number;
    destinationCount?: number;
    stops?: string[];
    sections?: any[];
    activityCount?: number;
    sectionsCount?: number;
    estimatedCost?: number;
    totalSectionBudget?: number;
    totalEstimatedCost?: number;
    budgetCap?: number;
    totalBudget?: number;
    currency?: string;
    status?: "upcoming" | "completed" | "draft" | "ongoing";
    coverImage?: string | null;
  };
  onView?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  viewHref?: string;
}

export function TripCard({ trip, onView, onDelete, isDeleting, viewHref }: TripCardProps) {
  // Compute normalized values
  const code =
    trip.code ||
    `GT-${(trip.destinationPlace || "TRIP").slice(0, 3).toUpperCase()}-${new Date(
      trip.startDate || Date.now()
    ).getFullYear()}`;

  const startDateStr = trip.startDate
    ? new Date(trip.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "";
  const endDateStr = trip.endDate
    ? new Date(trip.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "";
  const dateRange =
    trip.dateRange ||
    (startDateStr && endDateStr
      ? `${startDateStr.toUpperCase()} – ${endDateStr.toUpperCase()}`
      : startDateStr || "FLEXIBLE DATES");

  const durationDays =
    trip.durationDays ||
    (trip.startDate && trip.endDate
      ? Math.max(
          1,
          Math.round(
            (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 7);

  const spentBudget =
    trip.estimatedCost ??
    trip.totalSectionBudget ??
    trip.totalEstimatedCost ??
    0;

  const totalBudget = trip.budgetCap ?? trip.totalBudget ?? spentBudget;
  const isOverbudget = totalBudget > 0 && spentBudget > totalBudget;
  const budgetPercent =
    totalBudget > 0 ? Math.min(100, Math.round((spentBudget / totalBudget) * 100)) : 0;

  const status =
    trip.status ||
    (trip.endDate && new Date(trip.endDate) < new Date() ? "completed" : "upcoming");

  const stops =
    trip.stops ||
    (trip.sections && trip.sections.length > 0
      ? trip.sections.map((s: any) => s.title || s.destinationPlace || "Waypoint Stop")
      : trip.destinationPlace
      ? [`${trip.destinationPlace} (${durationDays}d)`]
      : ["Main City Stop"]);

  const destinationCount =
    trip.destinationCount ??
    (trip.sections?.length ? trip.sections.length : trip.destinationPlace ? 1 : stops.length);

  const activityCount =
    trip.activityCount ??
    trip.sectionsCount ??
    (trip.sections ? trip.sections.reduce((acc: number, s: any) => acc + (s.activities?.length || 1), 0) : stops.length * 3);

  const coverUrl =
    trip.coverImage ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80";

  const getStatusBadge = () => {
    switch (status) {
      case "upcoming":
      case "ongoing":
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
    <Card
      isTicketStub
      className="flex flex-col justify-between overflow-hidden hover:shadow-md transition-all duration-300 group border-border-muted bg-surface h-full"
    >
      {/* Trip Photo Cover Banner */}
      <div className="relative h-40 w-full overflow-hidden border-b border-border-muted bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-black/20" />

        {/* Status & Code Over Photo */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="px-2 py-1 rounded bg-ink/75 backdrop-blur-xs text-white font-mono text-[10px] font-bold border border-white/20">
            {code}
          </div>
          <div className="flex items-center gap-1.5">
            {getStatusBadge()}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                disabled={isDeleting}
                className="p-1.5 rounded-lg bg-ink/80 backdrop-blur-xs text-white hover:text-white hover:bg-brick-danger transition-all duration-200 cursor-pointer border border-white/25 shadow-xs flex items-center justify-center group/del"
                title="Delete Trip"
                aria-label="Delete Trip"
              >
                <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white font-mono text-xs drop-shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-accent shrink-0" />
          <span>{dateRange}</span>
        </div>
      </div>

      {/* Ticket Body Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-ink group-hover:text-teal-primary transition-colors leading-tight line-clamp-1">
            {trip.title}
          </h3>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {destinationCount} {destinationCount === 1 ? "Destination" : "Destinations"} • {activityCount} Activities
          </p>
        </div>

        {/* Stops Route with Dots */}
        <div className="p-3 rounded-lg bg-paper/80 border border-border-muted/70 space-y-1.5">
          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase block">
            Planned Waypoints:
          </span>
          <div className="space-y-1 font-sans text-xs text-ink font-medium">
            {stops.slice(0, 3).map((stop, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-primary shrink-0" />
                <span className="truncate">{stop}</span>
              </div>
            ))}
            {stops.length > 3 && (
              <span className="text-[10px] font-mono text-muted-foreground pl-4">
                +{stops.length - 3} more stops
              </span>
            )}
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
              ${spentBudget.toLocaleString()} / ${totalBudget.toLocaleString()}{" "}
              {trip.currency || "USD"}
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
              <span>
                Over budget by ${(spentBudget - totalBudget).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-border-muted flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted-foreground">
            {durationDays} {durationDays === 1 ? "Day" : "Days"} Duration
          </span>

          {onView ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onView}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Itinerary
            </Button>
          ) : (
            <Link href={viewHref || `/trips/${trip.id}/builder`}>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View Itinerary
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

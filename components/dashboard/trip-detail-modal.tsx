"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  Button,
  Badge,
} from "@/components/ui";
import { Trip } from "./previous-trips";
import { Calendar, MapPin, DollarSign, Clock, CheckCircle2, Share2, Copy } from "lucide-react";

interface TripDetailModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TripDetailModal({
  trip,
  isOpen,
  onClose,
}: TripDetailModalProps) {
  if (!trip) return null;

  const isOverbudget = trip.estimatedCost > trip.budgetCap;

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader stampText={trip.code}>
        <DialogTitle>{trip.title}</DialogTitle>
        <DialogDescription>
          Detailed travel passport & multi-city stops
        </DialogDescription>
      </DialogHeader>

      <DialogContent className="space-y-4">
        {/* Date & Duration */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-paper border border-border-muted">
            <span className="text-muted-foreground block text-[10px] uppercase">
              Date Range
            </span>
            <span className="font-bold text-ink flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-amber-accent" />
              {trip.dateRange}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-paper border border-border-muted">
            <span className="text-muted-foreground block text-[10px] uppercase">
              Duration
            </span>
            <span className="font-bold text-teal-primary flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {trip.durationDays} Days Total
            </span>
          </div>
        </div>

        {/* Stops Sequence with Map Route Divider */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink block">
            Itinerary Waypoints
          </span>
          <div className="space-y-2 relative pl-4 route-divider-vertical-teal">
            {trip.stops.map((stop, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border-muted font-sans text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-primary shrink-0" />
                  <span className="font-semibold text-ink">Stop {idx + 1}: {stop}</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="p-3 rounded-lg bg-paper/80 border border-border-muted space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimated Spend:</span>
            <span className={`font-bold ${isOverbudget ? "text-brick-danger" : "text-ink"}`}>
              ${trip.estimatedCost.toLocaleString()} / ${trip.budgetCap.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface border border-border-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${isOverbudget ? "bg-brick-danger" : "bg-teal-primary"}`}
              style={{
                width: `${Math.min(100, Math.round((trip.estimatedCost / trip.budgetCap) * 100))}%`,
              }}
            />
          </div>
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            alert("Trip link copied to clipboard!");
            onClose();
          }}
          leftIcon={<Share2 className="w-3.5 h-3.5" />}
        >
          Share Passport
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

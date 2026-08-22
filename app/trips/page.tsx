"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Filter,
  Luggage,
  Sparkles,
  Plane,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { PlanTripModal } from "@/components/dashboard/plan-trip-modal";
import { Button, Card, Badge, Alert } from "@/components/ui";

interface TripSection {
  id: string;
  title: string;
  activities?: any[];
}

interface TripItem {
  id: string;
  title: string;
  destinationPlace: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  currency: string;
  description?: string;
  visibility: string;
  sections?: TripSection[];
  sectionsCount?: number;
}

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "CURRENT" | "PAST">("ALL");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTrips = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please sign in to view your trip passports.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const res = await fetch("/api/v1/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load trips");
      }

      const tripList = Array.isArray(data.data) ? data.data : data.data?.trips || [];
      setTrips(tripList);
    } catch (err: any) {
      setError(err.message || "Failed to load your trips");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (tripId: string, tripTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${tripTitle}"? This cannot be undone.`)) {
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setDeletingId(tripId);
    try {
      const res = await fetch(`/api/v1/trips/${tripId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to delete trip");
      }

      setActionSuccess(`Trip "${tripTitle}" has been deleted.`);
      fetchTrips();
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete trip");
    } finally {
      setDeletingId(null);
    }
  };

  const getTripStatus = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (end < now) {
      return { label: "PAST", variant: "outline" as const, color: "text-muted-foreground" };
    }
    if (start <= now && end >= now) {
      return { label: "IN PROGRESS", variant: "amber" as const, color: "text-amber-accent" };
    }
    return { label: "UPCOMING", variant: "teal" as const, color: "text-teal-primary" };
  };

  const filteredTrips = trips.filter((trip) => {
    const status = getTripStatus(trip.startDate, trip.endDate).label;
    if (activeTab === "UPCOMING") return status === "UPCOMING";
    if (activeTab === "CURRENT") return status === "IN PROGRESS";
    if (activeTab === "PAST") return status === "PAST";
    return true;
  });

  const formatDateRange = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return "";
    const start = new Date(startStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const end = new Date(endStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${start} – ${end}`;
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-amber-accent/20">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Title & Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 route-divider pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground hover:text-teal-primary transition-colors mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <span className="text-border-muted">•</span>
              <Luggage className="w-4 h-4 text-teal-primary ml-1" />
              <span className="stamp-badge text-[11px]">SCREEN 4 • TRIP MANAGEMENT</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              My Travel Passports ({trips.length})
            </h1>
            <p className="font-sans text-xs text-muted-foreground mt-0.5">
              Review, edit, and organize all your multi-city itinerary itineraries.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPlanModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Plan New Trip
          </Button>
        </div>

        {/* Global Error / Action Alerts */}
        {error && (
          <Alert variant="danger" badgeText="ERROR">
            {error}
          </Alert>
        )}

        {actionSuccess && (
          <Alert variant="success" badgeText="SUCCESS">
            {actionSuccess}
          </Alert>
        )}

        {/* Status Category Tabs */}
        <div className="flex items-center gap-2 border-b border-border-muted/70 pb-3 overflow-x-auto">
          {(
            [
              { id: "ALL", label: `All Trips (${trips.length})` },
              {
                id: "UPCOMING",
                label: `Upcoming (${trips.filter((t) => getTripStatus(t.startDate, t.endDate).label === "UPCOMING").length})`,
              },
              {
                id: "CURRENT",
                label: `In Progress (${trips.filter((t) => getTripStatus(t.startDate, t.endDate).label === "IN PROGRESS").length})`,
              },
              {
                id: "PAST",
                label: `Past (${trips.filter((t) => getTripStatus(t.startDate, t.endDate).label === "PAST").length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-teal-primary text-paper shadow-xs"
                  : "bg-surface text-muted-foreground hover:text-ink hover:bg-paper border border-border-muted/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center space-y-3 bg-surface rounded-xl border border-border-muted shadow-xs">
            <Compass className="w-8 h-8 text-teal-primary animate-spin mx-auto" />
            <p className="font-mono text-xs text-muted-foreground">
              Loading your saved travel itineraries...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTrips.length === 0 && (
          <div className="p-12 text-center space-y-4 bg-surface rounded-xl border border-dashed border-border-muted">
            <Luggage className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-ink">
                No {activeTab !== "ALL" ? activeTab.toLowerCase() : ""} trips found
              </h3>
              <p className="font-sans text-xs text-muted-foreground max-w-sm mx-auto">
                Ready for your next adventure? Initiate a new travel plan to build day-by-day itineraries.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPlanModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Plan a New Trip
            </Button>
          </div>
        )}

        {/* Trips Grid List */}
        {!isLoading && filteredTrips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTrips.map((trip) => {
              const statusInfo = getTripStatus(trip.startDate, trip.endDate);
              const stopCount = trip.sections?.length || trip.sectionsCount || 0;
              const totalActivities =
                trip.sections?.reduce((sum, s) => sum + (s.activities?.length || 0), 0) || 0;

              return (
                <Card
                  key={trip.id}
                  isTicketStub
                  className="p-5 bg-surface border border-border-muted hover:border-teal-primary/50 transition-all space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                          #{trip.id.slice(0, 8)}
                        </span>
                      </div>
                      <h2 className="font-display text-xl font-bold text-ink group-hover:text-teal-primary transition-colors leading-snug">
                        {trip.title}
                      </h2>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTrip(trip.id, trip.title)}
                      isLoading={deletingId === trip.id}
                      className="text-muted-foreground hover:text-red-600 p-1.5 h-auto cursor-pointer"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans bg-paper p-3 rounded-lg border border-border-muted/60">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-teal-primary shrink-0" />
                      <span className="font-semibold text-ink line-clamp-1">
                        {trip.destinationPlace}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-amber-accent shrink-0" />
                      <span className="line-clamp-1">
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="w-3.5 h-3.5 text-teal-primary shrink-0" />
                      <span className="font-semibold text-ink">
                        ${trip.totalBudget.toLocaleString()} USD Target
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>
                        {stopCount} Stop{stopCount !== 1 ? "s" : ""} • {totalActivities} Act.
                      </span>
                    </div>
                  </div>

                  {trip.description && (
                    <p className="font-sans text-xs text-muted-foreground line-clamp-2 italic">
                      "{trip.description}"
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-muted/50">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-muted-foreground hover:text-teal-primary transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Passport</span>
                    </Link>

                    <Link href={`/trips/${trip.id}/builder`}>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Open Builder
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Plan New Trip Modal */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onTripCreated={() => fetchTrips()}
      />
    </div>
  );
}

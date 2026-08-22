"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Luggage,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Footer } from "@/components/dashboard/footer";
import { PlanTripModal } from "@/components/dashboard/plan-trip-modal";
import { DeleteTripDialog } from "@/components/trips/delete-trip-dialog";
import { Button, Card, Badge, Alert, toast } from "@/components/ui";
import { TripCard } from "@/components/trips/trip-card";

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
  coverImage?: string | null;
  sections?: any[];
  sectionsCount?: number;
  totalSectionBudget?: number;
  activityCount?: number;
  status?: "upcoming" | "completed" | "draft" | "ongoing";
}

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "CURRENT" | "PAST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<TripItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTrips = async () => {
    let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      if (match) token = match[2];
    }

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/trips?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load trips");
      }

      const tripList = Array.isArray(data.data?.trips)
        ? data.data.trips
        : Array.isArray(data.data)
          ? data.data
          : [];
      setTrips(tripList);
    } catch (err: any) {
      toast.error("Failed to Load Trips", err.message || "Could not fetch your trips.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;

    let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      if (match) token = match[2];
    }
    if (!token) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/v1/trips/${tripToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to delete trip");
      }

      const deletedTitle = tripToDelete.title;
      setTrips((prev) => prev.filter((t) => t.id !== tripToDelete.id));
      setTripToDelete(null);
      toast.success("Expedition Removed", `"${deletedTitle}" was successfully removed.`);
    } catch (err: any) {
      toast.error("Deletion Failed", err.message || "Failed to delete trip");
    } finally {
      setIsDeleting(false);
    }
  };

  const now = new Date();

  // Filter trips by active tab and search query
  const filteredTrips = trips.filter((t) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchDest = t.destinationPlace?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDest && !matchDesc) return false;
    }

    const start = t.startDate ? new Date(t.startDate) : null;
    const end = t.endDate ? new Date(t.endDate) : null;

    if (activeTab === "UPCOMING") {
      if (t.status === "upcoming") return true;
      if (t.status === "completed") return false;
      return start ? start > now : true;
    }
    if (activeTab === "CURRENT") {
      if (t.status === "ongoing") return true;
      return start && end ? start <= now && end >= now : false;
    }
    if (activeTab === "PAST") {
      if (t.status === "completed") return true;
      if (t.status === "upcoming" || t.status === "ongoing") return false;
      return end ? end < now : false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-amber-accent/20 selection:text-ink font-sans">
      <Navbar onOpenPlanModal={() => setIsPlanModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-border-muted pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                My Trips
              </h1>
              <Badge variant="teal">GT-PASSPORT</Badge>
              <Badge variant="amber">{trips.length} EXPEDITIONS</Badge>
            </div>
            <p className="font-sans text-xs text-muted-foreground">
              Manage, explore, and review your multi-city itineraries and destination stops
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/calendar">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<CalendarIcon className="w-4 h-4 text-teal-primary" />}
              >
                Calendar View
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPlanModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Plan New Trip
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface p-3.5 rounded-xl border border-border-muted shadow-xs">
          {/* Status Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(
              [
                { id: "ALL", label: `All Trips (${trips.length})` },
                {
                  id: "UPCOMING",
                  label: `Upcoming (${trips.filter((t) => (t.startDate ? new Date(t.startDate) > now : true)).length
                    })`,
                },
                {
                  id: "CURRENT",
                  label: `Ongoing (${trips.filter((t) =>
                    t.startDate && t.endDate
                      ? new Date(t.startDate) <= now && new Date(t.endDate) >= now
                      : false
                  ).length
                    })`,
                },
                {
                  id: "PAST",
                  label: `Completed (${trips.filter((t) => (t.endDate ? new Date(t.endDate) < now : false)).length
                    })`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                  ? "bg-teal-primary text-white shadow-xs"
                  : "bg-paper text-muted-foreground hover:text-ink border border-border-muted/60"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city or title..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-muted bg-paper text-ink text-xs focus:ring-2 focus:ring-teal-primary/40 focus:outline-none placeholder:text-muted-foreground font-sans"
            />
          </div>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-surface border border-border-muted rounded-2xl overflow-hidden space-y-4 shadow-sm"
              >
                <div className="h-40 w-full bg-border-muted/50" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-48 bg-border-muted/60 rounded" />
                  <div className="h-3.5 w-32 bg-border-muted/40 rounded" />
                  <div className="h-16 w-full bg-paper rounded-xl border border-border-muted/40" />
                  <div className="h-2 w-full bg-border-muted/30 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTrips.length === 0 && (
          <div className="p-12 text-center space-y-4 bg-surface rounded-2xl border border-dashed border-border-muted max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-paper border border-border-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Luggage className="w-7 h-7 text-teal-primary/70" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-ink">
                No {activeTab !== "ALL" ? activeTab.toLowerCase() : ""} trips found
              </h3>
              <p className="font-sans text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? "No expeditions matched your search keywords. Try adjusting your query."
                  : "Ready for your next journey? Plan a new trip to build structured day-wise itineraries."}
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPlanModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Plan a New Trip
              </Button>
            </div>
          </div>
        )}

        {/* Trips Grid List using Reusable TripCard with custom Delete Dialog */}
        {!isLoading && filteredTrips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                viewHref={`/trips/${trip.id}/builder`}
                onDelete={() => setTripToDelete(trip)}
                isDeleting={isDeleting && tripToDelete?.id === trip.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Plan New Trip Modal */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          fetchTrips();
        }}
      />

      {/* Custom Delete Confirmation Dialog */}
      <DeleteTripDialog
        isOpen={!!tripToDelete}
        tripTitle={tripToDelete?.title}
        destinationPlace={tripToDelete?.destinationPlace}
        tripDateRange={
          tripToDelete?.startDate && tripToDelete?.endDate
            ? `${new Date(tripToDelete.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })} – ${new Date(tripToDelete.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`
            : undefined
        }
        onClose={() => setTripToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Discreet Workspace Status Strip */}
      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Plus,
  Search,
  Eye,
  Edit3,
  Luggage,
  Sparkles,
  X,
  Layers,
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

export default function TripCalendarPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "CURRENT" | "PAST">("ALL");

  // Current Calendar Month state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Default to Aug 2026 or current month

  // Selected Date Modal state (When user clicks on any calendar date)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Selected Single Trip Details Modal
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);

  useEffect(() => {
    async function fetchTrips() {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setError("Please sign in to view your trip calendar.");
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

        // If user has trips, set initial calendar view month to the start date of their earliest upcoming trip
        if (tripList.length > 0) {
          const upcoming = tripList.find((t: TripItem) => new Date(t.startDate) >= new Date());
          if (upcoming?.startDate) {
            setCurrentDate(new Date(upcoming.startDate));
          } else if (tripList[0]?.startDate) {
            setCurrentDate(new Date(tripList[0].startDate));
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load your trips for the calendar.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrips();
  }, []);

  // Calendar Date Math Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate Days Grid for Current Month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon, ...

  // Filter trips based on search query and status filter
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      !searchQuery ||
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destinationPlace.toLowerCase().includes(searchQuery.toLowerCase());

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const now = new Date();

    let matchesStatus = true;
    if (statusFilter === "UPCOMING") matchesStatus = start > now;
    if (statusFilter === "CURRENT") matchesStatus = start <= now && end >= now;
    if (statusFilter === "PAST") matchesStatus = end < now;

    return matchesSearch && matchesStatus;
  });

  // Get trips that overlap with a specific date
  const getTripsForDate = (dateObj: Date) => {
    const target = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();

    return filteredTrips.filter((t) => {
      const s = new Date(t.startDate);
      const e = new Date(t.endDate);
      const start = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
      const end = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
      return target >= start && target <= end;
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayHeaders = ["SUM", "MON", "TUE", "WED", "THI", "FRI", "SAT"];

  const isToday = (dayNum: number) => {
    const today = new Date();
    return (
      today.getDate() === dayNum &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // Trips scheduled for the currently selected date modal
  const selectedDateTrips = selectedDate ? getTripsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-amber-accent/20">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 route-divider pb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground hover:text-teal-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-border-muted">•</span>
            <span className="stamp-badge text-[11px]">
              SCREEN 10 • TRIP CALENDAR VIEW
            </span>
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

        {/* Global Notifications */}
        {error && (
          <Alert variant="danger" badgeText="ERROR">
            {error}
          </Alert>
        )}

        {/* Top Control Bar: Search, Filters & Month Stepper matching Excalidraw */}
        <Card className="p-4 bg-surface border-border-muted space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bar ... (Search trips by title or city)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-paper border border-border-muted text-xs font-sans text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-primary/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="font-mono text-xs text-muted-foreground uppercase font-bold shrink-0">
                Filter:
              </span>
              {(
                [
                  { id: "ALL", label: "All Trips" },
                  { id: "UPCOMING", label: "Upcoming" },
                  { id: "CURRENT", label: "In Progress" },
                  { id: "PAST", label: "Past" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                    statusFilter === tab.id
                      ? "bg-teal-primary text-paper shadow-xs"
                      : "bg-paper text-muted-foreground hover:text-ink border border-border-muted/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Loading State Skeleton */}
        {isLoading && <CalendarSkeleton />}

        {/* Main Monthly Calendar Frame matching Excalidraw reference */}
        {!isLoading && (
          <div className="bg-surface rounded-2xl border border-border-muted shadow-sm p-4 sm:p-6 space-y-6">
            {/* Calendar Title & Month Selector Header */}
            <div className="flex items-center justify-between border-b border-border-muted pb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-2 rounded-xl border border-border-muted bg-paper hover:bg-teal-primary/10 hover:text-teal-primary text-ink transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center space-y-0.5">
                <span className="font-mono text-[10px] font-bold text-amber-accent tracking-widest uppercase block">
                  CALENDAR VIEW
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  {monthNames[month]} {year}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                  className="hidden sm:inline-flex text-xs"
                >
                  Today
                </Button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-2 rounded-xl border border-border-muted bg-paper hover:bg-teal-primary/10 hover:text-teal-primary text-ink transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of Week Header Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {dayHeaders.map((day, idx) => (
                <div
                  key={idx}
                  className="font-mono text-xs font-bold text-muted-foreground uppercase py-2 bg-paper/60 rounded-lg border border-border-muted/50"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Cells Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr">
              {/* Previous Month Filler Empty Cells */}
              {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                <div
                  key={`empty_${idx}`}
                  className="min-h-[90px] sm:min-h-[110px] p-2 rounded-xl bg-paper/20 border border-border-muted/30 opacity-40 select-none"
                />
              ))}

              {/* Current Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const cellDate = new Date(year, month, dayNum);
                const dayTrips = getTripsForDate(cellDate);
                const isCurrent = isToday(dayNum);

                return (
                  <div
                    key={`day_${dayNum}`}
                    onClick={() => setSelectedDate(cellDate)}
                    className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer hover:shadow-xs ${
                      isCurrent
                        ? "bg-teal-primary/5 border-teal-primary ring-1 ring-teal-primary/30 shadow-xs"
                        : "bg-surface hover:bg-paper border-border-muted/80"
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                          isCurrent
                            ? "bg-teal-primary text-white"
                            : "text-ink"
                        }`}
                      >
                        {dayNum}
                      </span>

                      {dayTrips.length > 0 && (
                        <span className="font-mono text-[9px] text-amber-accent font-bold">
                          {dayTrips.length} {dayTrips.length === 1 ? "Trip" : "Trips"}
                        </span>
                      )}
                    </div>

                    {/* Trip Badges / Event Chips overlay matching Excalidraw */}
                    <div className="space-y-1 overflow-y-auto max-h-[70px] scrollbar-none">
                      {dayTrips.map((t) => {
                        const isStartDay =
                          new Date(t.startDate).getDate() === dayNum &&
                          new Date(t.startDate).getMonth() === month;

                        return (
                          <div
                            key={t.id}
                            onClick={(e) => {
                              e.stopPropagation(); // Don't trigger cell click
                              setSelectedTrip(t);
                            }}
                            className="w-full text-left p-1 rounded bg-teal-primary/10 hover:bg-teal-primary/20 border border-teal-primary/30 hover:border-teal-primary transition-all group cursor-pointer"
                            title={`${t.title} (${t.destinationPlace})`}
                          >
                            <p className="font-sans text-[10px] sm:text-xs font-bold text-teal-primary group-hover:text-teal-hover truncate leading-tight">
                              {t.title}
                            </p>
                            {isStartDay && (
                              <p className="font-mono text-[9px] text-muted-foreground truncate">
                                📍 {t.destinationPlace}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Date Cell Click Modal - Shows all trips on selected date */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 bg-surface border-border-muted space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-border-muted pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-amber-accent uppercase tracking-wider">
                  DATE PASSPORT SCHEDULE
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-muted-foreground hover:text-ink cursor-pointer p-1 rounded hover:bg-paper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of trips on this selected date */}
            {selectedDateTrips.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedDateTrips.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-paper border border-border-muted/80 space-y-2 hover:border-teal-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-sans text-sm font-bold text-ink">
                          {t.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-primary shrink-0" />
                          <span className="font-semibold text-ink">{t.destinationPlace}</span>
                        </div>
                      </div>
                      <Badge variant="teal">ACTIVE</Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-1 text-muted-foreground border-t border-border-muted/40">
                      <span>
                        Target: <strong className="text-ink">${t.totalBudget} USD</strong>
                      </span>
                      <span>
                        {t.sectionsCount || t.sections?.length || 0} Stops
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDate(null);
                          router.push(`/trips/${t.id}`);
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Passport
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedDate(null);
                          router.push(`/trips/${t.id}/builder`);
                        }}
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                      >
                        Open Builder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center space-y-3 bg-paper/50 rounded-xl border border-dashed border-border-muted">
                <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                <p className="font-sans text-xs text-muted-foreground">
                  No trips or itinerary stops scheduled for this date.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedDate(null);
                    setIsPlanModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Plan a Trip for this Date
                </Button>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDate(null)}
              >
                Close Schedule
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Single Trip Quick Detail Popover Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 bg-surface border-border-muted space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-teal-primary uppercase px-2 py-0.5 rounded bg-teal-primary/10 border border-teal-primary/20">
                  TRIP DETAILS
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-1">
                  {selectedTrip.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="text-muted-foreground hover:text-ink cursor-pointer p-1 rounded hover:bg-paper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-sans bg-paper p-3.5 rounded-xl border border-border-muted/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-primary" />
                <span className="font-bold text-ink">{selectedTrip.destinationPlace}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="w-4 h-4 text-amber-accent" />
                <span>
                  {new Date(selectedTrip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                  {new Date(selectedTrip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4 text-teal-primary" />
                <span className="font-bold text-ink">
                  ${selectedTrip.totalBudget.toLocaleString()} USD Budget Target
                </span>
              </div>
            </div>

            {selectedTrip.description && (
              <p className="font-sans text-xs text-muted-foreground italic bg-paper p-3 rounded-lg border border-border-muted/60">
                "{selectedTrip.description}"
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/trips/${selectedTrip.id}`)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                View Passport
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(`/trips/${selectedTrip.id}/builder`)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Open Itinerary Builder
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Plan Trip Modal */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onTripCreated={() => router.push("/calendar")}
      />
    </div>
  );
}

/**
 * Shimmering Monthly Calendar Grid Skeleton Loader Component
 */
function CalendarSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border-muted shadow-sm p-4 sm:p-6 space-y-6 animate-pulse">
      {/* Skeleton Month Header */}
      <div className="flex items-center justify-between border-b border-border-muted pb-4">
        <div className="h-10 w-10 bg-border-muted/50 rounded-xl" />
        <div className="space-y-2 text-center flex flex-col items-center">
          <div className="h-3 w-24 bg-border-muted/40 rounded" />
          <div className="h-7 w-48 bg-border-muted/70 rounded-lg" />
        </div>
        <div className="h-10 w-20 bg-border-muted/50 rounded-xl" />
      </div>

      {/* Skeleton Day Header Grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-4 bg-border-muted/40 rounded mx-auto w-8 sm:w-12" />
        ))}
      </div>

      {/* Skeleton 5-week Calendar Cells Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="min-h-[80px] sm:min-h-[110px] p-2 bg-paper/60 rounded-xl border border-border-muted/40 space-y-2"
          >
            <div className="h-4 w-5 bg-border-muted/60 rounded" />
            {i % 4 === 1 && <div className="h-4 w-full bg-teal-primary/20 rounded" />}
            {i % 6 === 2 && <div className="h-4 w-full bg-amber-accent/20 rounded" />}
          </div>
        ))}
      </div>
    </div>
  );
}

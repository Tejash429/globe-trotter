"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Edit,
  Plane,
  Building2,
  Ticket,
  Package,
  Share2,
  CheckCircle2,
  Clock,
  Layers,
  Save,
} from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Button, Card, Badge, Alert } from "@/components/ui";

interface ItinerarySection {
  id: string;
  title: string;
  type: "TRAVEL" | "ACCOMMODATION" | "ACTIVITY" | "MISCELLANEOUS";
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  orderIndex: number;
}

interface TripDetail {
  id: string;
  title: string;
  destinationPlace: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  currency: string;
  description?: string;
  visibility: string;
  sections?: ItinerarySection[];
  sectionsCount?: number;
  totalSectionBudget?: number;
  remainingBudget?: number;
}

export default function ItineraryViewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();

  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setError("Please sign in to view this trip itinerary.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`/api/v1/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || "Failed to load itinerary");
        }

        setTrip(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load trip itinerary");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const getTypeBadge = (type: ItinerarySection["type"]) => {
    switch (type) {
      case "TRAVEL":
        return (
          <Badge variant="teal" icon={<Plane className="w-3 h-3" />}>
            TRAVEL
          </Badge>
        );
      case "ACCOMMODATION":
        return (
          <Badge variant="amber" icon={<Building2 className="w-3 h-3" />}>
            LODGING
          </Badge>
        );
      case "ACTIVITY":
        return (
          <Badge variant="outline" icon={<Ticket className="w-3 h-3 text-teal-primary" />}>
            ACTIVITY
          </Badge>
        );
      case "MISCELLANEOUS":
      default:
        return (
          <Badge variant="outline" icon={<Package className="w-3 h-3" />}>
            MISC
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const handleSaveItinerary = async () => {
    setIsSaving(true);
    setError("");
    try {
      setSaveSuccess(true);
      setActionSuccess("Itinerary Passport saved successfully! Redirecting to your trips...");
      setTimeout(() => {
        router.push("/trips");
      }, 1000);
    } catch (err: any) {
      setError("Failed to save itinerary. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-amber-accent/20">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 route-divider pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/trips/${tripId}/builder`}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-teal-primary hover:text-teal-hover transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Itinerary Builder</span>
            </Link>
            <span className="text-border-muted">•</span>
            <Link
              href="/dashboard"
              className="font-sans text-xs font-semibold text-muted-foreground hover:text-teal-primary transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-border-muted">•</span>
            {/* <span className="stamp-badge text-[11px]">
              SCREEN 6 • ITINERARY PASSPORT
            </span> */}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveItinerary}
              isLoading={isSaving}
              leftIcon={
                saveSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                ) : (
                  <Save className="w-4 h-4 text-teal-primary" />
                )
              }
            >
              {saveSuccess ? "Itinerary Saved!" : "Save Itinerary"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
            >
              {copied ? "Link Copied!" : "Share Itinerary"}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push(`/trips/${tripId}/builder`)}
              leftIcon={<Edit className="w-3.5 h-3.5" />}
            >
              Edit Itinerary
            </Button>
          </div>
        </div>

        {actionSuccess && (
          <Alert variant="success" badgeText="SAVED">
            {actionSuccess}
          </Alert>
        )}

        {isLoading && (
          <div className="p-12 text-center space-y-3 bg-surface rounded-xl border border-border-muted shadow-xs">
            <Compass className="w-8 h-8 text-teal-primary animate-spin mx-auto" />
            <p className="font-mono text-xs text-muted-foreground">
              Loading itinerary passport...
            </p>
          </div>
        )}

        {error && (
          <Alert variant="danger" badgeText="ERROR">
            {error}
          </Alert>
        )}

        {!isLoading && trip && (
          <div className="space-y-6">
            {/* Header Ticket Stub */}
            <Card isTicketStub className="p-6 bg-surface space-y-4 border-border-muted">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="teal">CONFIRMED ITINERARY</Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      TRIP #{trip.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
                    {trip.title}
                  </h1>
                  <p className="font-sans text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-ink">
                      <MapPin className="w-3.5 h-3.5 text-teal-primary" />
                      {trip.destinationPlace}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-accent" />
                      {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </span>
                  </p>
                </div>

                <div className="bg-paper p-3 rounded-lg border border-border-muted font-mono text-xs text-right">
                  <span className="text-muted-foreground text-[10px] uppercase block">
                    Total Estimated Cost
                  </span>
                  <span className="font-bold text-teal-primary text-base">
                    ${(trip.totalSectionBudget || 0).toLocaleString()} / ${(trip.totalBudget || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {trip.description && (
                <p className="font-sans text-xs text-muted-foreground bg-paper p-3 rounded-lg border border-border-muted/70">
                  {trip.description}
                </p>
              )}
            </Card>

            {/* Day-by-Day Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between route-divider pb-2">
                <h2 className="font-display text-xl font-bold text-ink">
                  Day-by-Day Waypoint Schedule ({trip.sections?.length || 0})
                </h2>
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Timeline View
                </span>
              </div>

              {!trip.sections || trip.sections.length === 0 ? (
                <div className="p-8 text-center bg-surface rounded-xl border border-border-muted space-y-3">
                  <p className="font-sans text-xs text-muted-foreground">
                    No stops or activities have been added to this itinerary yet.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/trips/${tripId}/builder`)}
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                  >
                    Open Itinerary Builder
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 relative pl-4 route-divider-vertical-teal">
                  {trip.sections.map((section, idx) => (
                    <Card
                      key={section.id}
                      isTicketStub
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-3 border-border-muted"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-teal-primary">
                            Stop {idx + 1}
                          </span>
                          {getTypeBadge(section.type)}
                          <h3 className="font-display text-base font-bold text-ink">
                            {section.title}
                          </h3>
                        </div>

                        {section.description && (
                          <p className="font-sans text-xs text-muted-foreground">
                            {section.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1 text-ink">
                            <Calendar className="w-3.5 h-3.5 text-amber-accent" />
                            {formatDate(section.startDate)} – {formatDate(section.endDate)}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-teal-primary">
                            <DollarSign className="w-3.5 h-3.5" />
                            ${(section.budget || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

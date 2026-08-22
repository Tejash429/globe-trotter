"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Plus,
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Plane,
  Building2,
  Ticket,
  Package,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Button, Card, Badge, Alert } from "@/components/ui";
import { AddSectionModal, SectionData } from "@/components/itinerary/add-section-modal";

interface TripDetails {
  id: string;
  title: string;
  destinationPlace: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  currency: string;
  description?: string;
}

interface ItinerarySection {
  id: string;
  tripId: string;
  title: string;
  type: "TRAVEL" | "ACCOMMODATION" | "ACTIVITY" | "MISCELLANEOUS";
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  orderIndex: number;
}

interface Suggestion {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedCost: number;
}

export default function ItineraryBuilderPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [sections, setSections] = useState<ItinerarySection[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);
  const [actionSuccess, setActionSuccess] = useState("");

  // Fetch Trip and Sections data
  const fetchData = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please sign in to access the Itinerary Builder.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // 1. Fetch Trip details
      const tripRes = await fetch(`/api/v1/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tripData = await tripRes.json();

      if (!tripRes.ok || !tripData.success) {
        throw new Error(tripData.error?.message || "Failed to load trip details");
      }

      setTrip(tripData.data);

      // 2. Fetch Sections details
      const sectionsRes = await fetch(`/api/v1/trips/${tripId}/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sectionsData = await sectionsRes.json();

      if (sectionsRes.ok && sectionsData.success) {
        setSections(sectionsData.data.sections || []);
      }

      // Generate initial suggestions based on destination
      const dest = tripData.data?.destinationPlace || "Destination";
      setSuggestions([
        {
          id: "sug_1",
          title: `Flight / Transit to ${dest}`,
          category: "TRAVEL",
          description: `Direct transport tickets and baggage options to ${dest}.`,
          estimatedCost: 350,
        },
        {
          id: "sug_2",
          title: `Central ${dest} Hotel Stay`,
          category: "ACCOMMODATION",
          description: `Boutique hotel accommodation in the city center of ${dest}.`,
          estimatedCost: 650,
        },
        {
          id: "sug_3",
          title: `${dest} Highlights Walking Tour`,
          category: "ACTIVITY",
          description: `Explore iconic historic sights and landmarks with a local guide.`,
          estimatedCost: 45,
        },
        {
          id: "sug_4",
          title: `Local Food & Culinary Tasting`,
          category: "ACTIVITY",
          description: `Sample regional specialties, local street food, and wines in ${dest}.`,
          estimatedCost: 75,
        },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to load trip itinerary");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks-exhaustive-deps
  }, [tripId]);

  // Section Save Callback
  const handleSectionSaved = () => {
    setActionSuccess("Itinerary updated successfully!");
    fetchData();
    setTimeout(() => setActionSuccess(""), 3000);
  };

  // Delete Section
  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this itinerary stop?")) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      const res = await fetch(`/api/v1/trips/${tripId}/sections/${sectionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to delete section");
      }

      setActionSuccess("Section removed from itinerary.");
      fetchData();
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to delete section");
    }
  };

  // Reorder Sections (Move Up / Down)
  const handleMoveSection = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updatedSections = [...sections];
    const [moved] = updatedSections.splice(index, 1);
    updatedSections.splice(targetIndex, 0, moved);

    const sectionOrders = updatedSections.map((sec, idx) => ({
      sectionId: sec.id,
      orderIndex: idx + 1,
    }));

    setSections(updatedSections);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      await fetch(`/api/v1/trips/${tripId}/sections/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sectionOrders }),
      });
    } catch (err) {
      console.error("Failed to persist section reordering", err);
      fetchData();
    }
  };

  // Calculated Budget Statistics
  const totalTripBudget = trip?.totalBudget || 0;
  const totalAllocatedBudget = sections.reduce((sum, sec) => sum + (sec.budget || 0), 0);
  const remainingBudget = totalTripBudget - totalAllocatedBudget;
  const isOverbudget = totalAllocatedBudget > totalTripBudget && totalTripBudget > 0;
  const budgetPercentage =
    totalTripBudget > 0 ? Math.min(100, Math.round((totalAllocatedBudget / totalTripBudget) * 100)) : 0;

  // Helpers for category styling
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
              SCREEN 5 • ITINERARY BUILDER
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/trips/${tripId}`)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Preview Full Itinerary
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingSection(null);
                setIsModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Stop
            </Button>
          </div>
        </div>

        {/* Global Loading / Error Notifications */}
        {isLoading && (
          <div className="p-12 text-center space-y-3 bg-surface rounded-xl border border-border-muted shadow-xs">
            <Compass className="w-8 h-8 text-teal-primary animate-spin mx-auto" />
            <p className="font-mono text-xs text-muted-foreground">
              Loading trip passport & itinerary sections...
            </p>
          </div>
        )}

        {error && (
          <Alert variant="danger" badgeText="ERROR">
            {error}
          </Alert>
        )}

        {actionSuccess && (
          <Alert variant="success" badgeText="UPDATED">
            {actionSuccess}
          </Alert>
        )}

        {!isLoading && trip && (
          <>
            {/* Trip Passport Banner Card matching Excalidraw Ticket Stub */}
            <Card isTicketStub className="p-6 bg-surface space-y-5 border-border-muted">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-primary px-2 py-0.5 rounded bg-teal-primary/10 border border-teal-primary/20">
                      DESTINATION PASSPORT
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      ID: {trip.id.substring(0, 8).toUpperCase()}
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

                {/* Right side stats summary */}
                <div className="flex items-center gap-4 bg-paper p-3 rounded-lg border border-border-muted font-mono text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase block">
                      Waypoints
                    </span>
                    <span className="font-bold text-ink text-sm">
                      {sections.length} Stops
                    </span>
                  </div>
                  <div className="w-px h-8 bg-border-muted" />
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase block">
                      Allocated / Total
                    </span>
                    <span className={`font-bold text-sm ${isOverbudget ? "text-brick-danger" : "text-teal-primary"}`}>
                      ${totalAllocatedBudget.toLocaleString()} / ${totalTripBudget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Budget Allocation Progress Bar */}
              <div className="space-y-1.5 pt-2 route-divider">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-teal-primary" />
                    <span>Allocated Budget Progress:</span>
                  </span>
                  <span className={`font-bold ${isOverbudget ? "text-brick-danger" : "text-ink"}`}>
                    {budgetPercentage}% {isOverbudget ? "(Over Budget!)" : `($${remainingBudget.toLocaleString()} Remaining)`}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-paper border border-border-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverbudget ? "bg-brick-danger" : "bg-teal-primary"
                    }`}
                    style={{ width: `${budgetPercentage}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Quick Suggestions Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-accent" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
                  Suggested Waypoint Templates for {trip.destinationPlace}:
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {suggestions.map((sug) => (
                  <button
                    key={sug.id}
                    onClick={() => {
                      setEditingSection({
                        title: sug.title,
                        type: (sug.category as any) || "ACTIVITY",
                        startDate: trip.startDate ? trip.startDate.split("T")[0] : "",
                        endDate: trip.endDate ? trip.endDate.split("T")[0] : "",
                        budget: sug.estimatedCost,
                        description: sug.description,
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-3 rounded-lg bg-surface border border-border-muted hover:border-teal-primary/60 hover:shadow-xs transition-all text-left group cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold text-teal-primary uppercase">
                        + Quick Add
                      </span>
                      <span className="font-mono text-xs font-bold text-ink">
                        ${sug.estimatedCost}
                      </span>
                    </div>
                    <p className="font-sans text-xs font-bold text-ink group-hover:text-teal-primary transition-colors line-clamp-1">
                      {sug.title}
                    </p>
                    <p className="font-sans text-[11px] text-muted-foreground line-clamp-1">
                      {sug.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Stops Timeline Container */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between route-divider pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-primary" />
                  <h2 className="font-display text-xl font-bold text-ink">
                    Itinerary Stops & Waypoints ({sections.length})
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Reorder with arrows
                </span>
              </div>

              {/* Empty State */}
              {sections.length === 0 ? (
                <div className="p-10 text-center space-y-4 bg-surface rounded-xl border-2 border-dashed border-border-muted">
                  <div className="w-12 h-12 rounded-full bg-teal-primary/10 text-teal-primary flex items-center justify-center mx-auto">
                    <Compass className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      No Stops Added Yet
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                      Begin building your day-by-day itinerary by adding travel legs, hotel stays, or sightseeing activities!
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setEditingSection(null);
                      setIsModalOpen(true);
                    }}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Your First Stop
                  </Button>
                </div>
              ) : (
                /* Sections List */
                <div className="space-y-3">
                  {sections.map((section, idx) => (
                    <Card
                      key={section.id}
                      isTicketStub
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-border-muted hover:shadow-xs transition-shadow"
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Waypoint Number Badge */}
                        <div className="w-8 h-8 rounded-full bg-paper border border-border-muted text-teal-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getTypeBadge(section.type)}
                            <h4 className="font-display text-base font-bold text-ink leading-tight truncate">
                              {section.title}
                            </h4>
                          </div>

                          {section.description && (
                            <p className="font-sans text-xs text-muted-foreground line-clamp-2">
                              {section.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground pt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-ink">
                              <Calendar className="w-3.5 h-3.5 text-amber-accent" />
                              {formatDate(section.startDate)} – {formatDate(section.endDate)}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-teal-primary">
                              <DollarSign className="w-3.5 h-3.5" />
                              ${(section.budget || 0).toLocaleString()} allocated
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center bg-paper p-1 rounded-lg border border-border-muted">
                        <button
                          onClick={() => handleMoveSection(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded hover:bg-surface text-ink disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(idx, "down")}
                          disabled={idx === sections.length - 1}
                          className="p-1.5 rounded hover:bg-surface text-ink disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-border-muted mx-0.5" />
                        <button
                          onClick={() => {
                            setEditingSection(section);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded hover:bg-surface text-teal-primary transition-colors cursor-pointer"
                          title="Edit stop"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1.5 rounded hover:bg-surface text-brick-danger transition-colors cursor-pointer"
                          title="Delete stop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-4 route-divider">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(`/trips/${tripId}`)}
                rightIcon={<Eye className="w-4 h-4" />}
              >
                Preview Completed Itinerary
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Add / Edit Section Modal */}
      {trip && (
        <AddSectionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSection(null);
          }}
          tripId={trip.id}
          initialData={editingSection}
          defaultStartDate={trip.startDate ? trip.startDate.split("T")[0] : ""}
          defaultEndDate={trip.endDate ? trip.endDate.split("T")[0] : ""}
          onSectionSaved={handleSectionSaved}
        />
      )}
    </div>
  );
}

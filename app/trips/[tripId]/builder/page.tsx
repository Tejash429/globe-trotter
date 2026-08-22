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
  ArrowRight,
  Save,
} from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Button, Card, Badge, Alert,toast } from "@/components/ui";
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

interface SectionActivity {
  id: string;
  title: string;
  category: string;
  cost: number;
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
  activities?: SectionActivity[];
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
    // setActionSuccess("Itinerary stop updated successfully!");
    fetchData();
    setTimeout(() => setActionSuccess(""), 3000);
  };

  // Delete Section
  const handleDeleteSection = async (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
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

      // 
      toast.success("Itinerary stop removed successfully")
      fetchData();
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to delete section");
    }
  };

  // Reorder Sections (Move Up / Down)
  const handleMoveSection = async (e: React.MouseEvent, index: number, direction: "up" | "down") => {
    e.stopPropagation();
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

  const [isSavingItinerary, setIsSavingItinerary] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveItinerary = async () => {
    setIsSavingItinerary(true);
    setError("");
    try {
      await fetchData();
      setSaveSuccess(true);
      setActionSuccess("Itinerary Saved Successfully! Redirecting to your trips passport...");
      setTimeout(() => {
        router.push("/trips");
      }, 1000);
    } catch (err: any) {
      setError("Failed to save itinerary changes. Please try again.");
    } finally {
      setIsSavingItinerary(false);
    }
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
            {/* <span className="stamp-badge text-[11px]">
              SCREEN 5 • ITINERARY BUILDER
            </span> */}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/trips/${tripId}`)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Preview Full Itinerary
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveItinerary}
              isLoading={isSavingItinerary}
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
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingSection(null);
                setIsModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create New Stop (Section)
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
              <div className="space-y-1.5 pt-2">
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

            {/* Map Route Dashed Divider outside the Card */}
            <div className="route-divider my-2" />

            {/* Section Stops Timeline Container */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between route-divider pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-primary" />
                  <h2 className="font-display text-xl font-bold text-ink">
                    Itinerary Stops ({sections.length})
                  </h2>
                </div>
                {/* <span className="font-mono text-xs text-muted-foreground uppercase">
                  Click any stop to add & manage activities
                </span> */}
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
                      Begin building your day-by-day itinerary by adding travel legs, hotel stays, or sightseeing stops!
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
                /* Sections Brief Summary Cards List */
                <div className="space-y-4">
                  {sections.map((section, idx) => {
                    const activityCount = section.activities?.length || 0;
                    const totalActivityCost = (section.activities || []).reduce((acc, a) => acc + (a.cost || 0), 0);

                    return (
                      <Card
                        key={section.id}
                        isTicketStub
                        onClick={() => router.push(`/trips/${tripId}/sections/${section.id}`)}
                        className="p-5 flex flex-col space-y-3.5 border-border-muted hover:border-teal-primary/60 hover:shadow-md transition-all cursor-pointer group"
                      >
                        {/* Top Brief Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-paper border border-border-muted text-teal-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {getTypeBadge(section.type)}
                                <h3 className="font-display text-lg font-bold text-ink group-hover:text-teal-primary transition-colors leading-tight">
                                  {section.title}
                                </h3>
                              </div>
                              <p className="font-mono text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                                <span>{formatDate(section.startDate)} – {formatDate(section.endDate)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {/* Action Controls */}
                            <div className="flex items-center gap-1 bg-paper p-1 rounded-lg border border-border-muted">
                              <button
                                onClick={(e) => handleMoveSection(e, idx, "up")}
                                disabled={idx === 0}
                                className="p-1.5 rounded hover:bg-surface text-ink disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleMoveSection(e, idx, "down")}
                                disabled={idx === sections.length - 1}
                                className="p-1.5 rounded hover:bg-surface text-ink disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <div className="w-px h-4 bg-border-muted mx-0.5" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSection(section);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 rounded hover:bg-surface text-teal-primary transition-colors cursor-pointer"
                                title="Edit stop details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteSection(e, section.id)}
                                className="p-1.5 rounded hover:bg-surface text-brick-danger transition-colors cursor-pointer"
                                title="Delete stop"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                              className="group-hover:bg-teal-primary group-hover:text-white transition-colors"
                            >
                              Add & Manage Activities
                            </Button>
                          </div>
                        </div>

                        {/* Brief Summary Body */}
                        <div className="p-3.5 rounded-lg bg-paper/80 border border-border-muted/80 space-y-2 font-mono text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <Ticket className="w-3.5 h-3.5 text-teal-primary" />
                              <span className="font-bold text-ink">
                                {activityCount === 0 ? "No activities added yet" : `${activityCount} Activities Planned`}
                              </span>
                            </span>

                            <span className="font-bold text-teal-primary">
                              ${totalActivityCost.toLocaleString()} spent / ${section.budget.toLocaleString()} allocated
                            </span>
                          </div>

                          {/* Mini Activities Preview Chips */}
                          {section.activities && section.activities.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border-muted/50">
                              {section.activities.map((act) => (
                                <span
                                  key={act.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-border-muted text-ink font-sans text-xs font-semibold"
                                >
                                  <span>• {act.title}</span>
                                  {act.cost > 0 && (
                                    <span className="text-teal-primary font-mono text-[10px]">
                                      (${act.cost})
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
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

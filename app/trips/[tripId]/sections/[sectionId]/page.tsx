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
  Sparkles,
  Ticket,
  Clock,
  CheckCircle2,
  Tag,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Button, Card, Badge, Alert, Input, Textarea, Select, Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, ConfirmDeleteModal, toast } from "@/components/ui";

interface SectionActivity {
  id: string;
  sectionId: string;
  title: string;
  category: string;
  description?: string;
  cost: number;
  time?: string;
}

interface SectionDetail {
  id: string;
  tripId: string;
  tripTitle: string;
  destinationPlace: string;
  title: string;
  type: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  activities: SectionActivity[];
  totalActivityCost: number;
  remainingSectionBudget: number;
}

interface PlaceSuggestion {
  id: string;
  title: string;
  description: string;
  category?: string;
}

export default function SectionActivitiesPage({
  params,
}: {
  params: Promise<{ tripId: string; sectionId: string }>;
}) {
  const { tripId, sectionId } = use(params);
  const router = useRouter();

  const [section, setSection] = useState<SectionDetail | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Activity Modal State
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<SectionActivity | null>(null);

  // Delete Activity Modal State
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [deletingActivityTitle, setDeletingActivityTitle] = useState<string>("");
  const [isDeletingActivity, setIsDeletingActivity] = useState(false);
  const [activityForm, setActivityForm] = useState({
    title: "",
    category: "SIGHTSEEING",
    cost: "",
    time: "",
    description: "",
  });
  const [isSubmittingActivity, setIsSubmittingActivity] = useState(false);
  const [activityError, setActivityError] = useState("");

  // Fetch Section details and activities
  const fetchSectionData = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please sign in to view section details.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`/api/v1/trips/${tripId}/sections/${sectionId}/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load section activities");
      }

      setSection(data.data);

      // Fetch OpenTripMap place suggestions for this stop/destination
      const dest = data.data?.destinationPlace || data.data?.title || "Destination";
      try {
        const sugRes = await fetch(`/api/v1/destinations/suggestions?destination=${encodeURIComponent(dest)}`);
        const sugData = await sugRes.json();
        if (sugRes.ok && sugData.success && Array.isArray(sugData.data?.suggestions)) {
          setSuggestions(sugData.data.suggestions);
        }
      } catch (sugErr) {
        console.warn("Failed to load place suggestions", sugErr);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load section details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
    // eslint-disable-next-line react-hooks-exhaustive-deps
  }, [tripId, sectionId]);

  // Open modal for adding/editing activity
  const handleOpenAddActivity = (initialTitle = "", initialDesc = "") => {
    setEditingActivity(null);
    setActivityForm({
      title: initialTitle,
      category: "SIGHTSEEING",
      cost: "",
      time: "",
      description: initialDesc,
    });
    setActivityError("");
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (act: SectionActivity) => {
    setEditingActivity(act);
    setActivityForm({
      title: act.title,
      category: act.category || "SIGHTSEEING",
      cost: act.cost ? String(act.cost) : "",
      time: act.time || "",
      description: act.description || "",
    });
    setActivityError("");
    setIsActivityModalOpen(true);
  };

  // Submit Activity Form
  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivityError("");

    if (!activityForm.title.trim()) {
      setActivityError("Please enter an activity title.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setIsSubmittingActivity(true);

    try {
      const isEdit = !!editingActivity?.id;
      const url = isEdit
        ? `/api/v1/trips/${tripId}/sections/${sectionId}/activities/${editingActivity.id}`
        : `/api/v1/trips/${tripId}/sections/${sectionId}/activities`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        title: activityForm.title.trim(),
        category: activityForm.category,
        cost: activityForm.cost ? parseFloat(activityForm.cost) : 0,
        time: activityForm.time.trim() || undefined,
        description: activityForm.description.trim() || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      toast.success(
        isEdit ? "Activity Updated" : "Activity Added",
        isEdit
          ? `Activity "${activityForm.title}" has been updated.`
          : `New activity "${activityForm.title}" added to section!`
      );
      setIsActivityModalOpen(false);
      fetchSectionData();
    } catch (err: any) {
      setActivityError(err.message || "Failed to save activity");
    } finally {
      setIsSubmittingActivity(false);
    }
  };

  // Delete Activity Prompt
  const handlePromptDeleteActivity = (act: SectionActivity) => {
    setDeletingActivityId(act.id);
    setDeletingActivityTitle(act.title);
  };

  const handleConfirmDeleteActivity = async () => {
    if (!deletingActivityId) return;
    setIsDeletingActivity(true);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      const res = await fetch(`/api/v1/trips/${tripId}/sections/${sectionId}/activities/${deletingActivityId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to delete activity");
      }

      toast.info("Activity Deleted", `Activity "${deletingActivityTitle}" removed from section.`);
      setDeletingActivityId(null);
      fetchSectionData();
    } catch (err: any) {
      toast.error("Error Deleting Activity", err.message || "Failed to delete activity");
    } finally {
      setIsDeletingActivity(false);
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 route-divider pb-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/trips/${tripId}/builder`}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground hover:text-teal-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Itinerary Builder</span>
            </Link>
            {/* <span className="text-border-muted">•</span>
            <span className="stamp-badge text-[11px]">
              STOP ACTIVITIES & EXPERIENCES
            </span> */}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                toast.success("Section Saved", "Returning to itinerary builder...");
                setTimeout(() => {
                  router.push(`/trips/${tripId}/builder`);
                }, 400);
              }}
              leftIcon={<Save className="w-4 h-4 text-teal-primary" />}
            >
              Save & Return to Builder
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenAddActivity()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Custom Activity
            </Button>
          </div>
        </div>

        {/* Global Loading / Error Alerts */}
        {isLoading && <SectionActivitiesSkeleton />}

        {error && (
          <Alert variant="danger" badgeText="ERROR">
            {error}
          </Alert>
        )}

        {!isLoading && section && (
          <>
            {/* Section Header Card (Ticket Stub Style) */}
            <Card isTicketStub className="p-6 bg-surface space-y-4 border-border-muted">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-primary px-2 py-0.5 rounded bg-teal-primary/10 border border-teal-primary/20">
                      ITINERARY STOP
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      TRIP: {section.tripTitle}
                    </span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
                    {section.title}
                  </h1>
                  <p className="font-sans text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-ink">
                      <MapPin className="w-3.5 h-3.5 text-teal-primary" />
                      {section.destinationPlace}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-accent" />
                      {formatDate(section.startDate)} – {formatDate(section.endDate)}
                    </span>
                  </p>
                </div>

                {/* Right side stats summary */}
                <div className="flex items-center gap-4 bg-paper p-3 rounded-lg border border-border-muted font-mono text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase block">
                      Allocated Budget
                    </span>
                    <span className="font-bold text-ink text-sm">
                      ${section.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-border-muted" />
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase block">
                      Activity Spend
                    </span>
                    <span className="font-bold text-teal-primary text-sm">
                      ${section.totalActivityCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {section.description && (
                <p className="font-sans text-xs text-muted-foreground bg-paper p-3 rounded-lg border border-border-muted/70">
                  {section.description}
                </p>
              )}
            </Card>

            {/* OpenTripMap Places Suggestions Bar */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-accent" />
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Places to Visit in {section.destinationPlace} (OpenTripMap API):
                    </h3>
                  </div>

                  {suggestions.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                      className="font-mono text-xs font-semibold text-teal-primary hover:text-teal-hover flex items-center gap-1 cursor-pointer"
                    >
                      <span>
                        {showAllSuggestions ? "Show Less" : `+${suggestions.length - 3} More Activities`}
                      </span>
                      {showAllSuggestions ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(showAllSuggestions ? suggestions : suggestions.slice(0, 3)).map((sug) => (
                    <button
                      key={sug.id}
                      onClick={() => handleOpenAddActivity(sug.title, sug.description)}
                      className="p-3.5 rounded-lg bg-surface border border-border-muted hover:border-teal-primary/60 hover:shadow-xs transition-all text-left group cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-teal-primary uppercase px-1.5 py-0.5 rounded bg-teal-primary/10">
                          + Add to Stop
                        </span>
                      </div>
                      <p className="font-sans text-xs font-bold text-ink group-hover:text-teal-primary transition-colors line-clamp-1">
                        {sug.title}
                      </p>
                      {sug.description && (
                        <p className="font-sans text-[11px] text-muted-foreground line-clamp-2">
                          {sug.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Activities List Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between route-divider pb-2">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-teal-primary" />
                  <h2 className="font-display text-xl font-bold text-ink">
                    Activities for this Stop ({section.activities?.length || 0})
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Activity Breakdown
                </span>
              </div>

              {!section.activities || section.activities.length === 0 ? (
                <div className="p-10 text-center space-y-4 bg-surface rounded-xl border-2 border-dashed border-border-muted">
                  <div className="w-12 h-12 rounded-full bg-teal-primary/10 text-teal-primary flex items-center justify-center mx-auto">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      No Activities Added to this Stop
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                      Click a place suggestion above or add a custom activity to plan your schedule for this stop!
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenAddActivity()}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add First Activity
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {section.activities.map((activity, idx) => (
                    <Card
                      key={activity.id}
                      isTicketStub
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-border-muted hover:shadow-xs transition-shadow"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-paper border border-border-muted text-teal-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="teal">{activity.category}</Badge>
                            <h4 className="font-display text-base font-bold text-ink leading-tight">
                              {activity.title}
                            </h4>
                          </div>

                          {activity.description && (
                            <p className="font-sans text-xs text-muted-foreground line-clamp-2">
                              {activity.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground pt-1 flex-wrap">
                            {activity.time && (
                              <span className="flex items-center gap-1 text-ink">
                                <Clock className="w-3.5 h-3.5 text-amber-accent" />
                                {activity.time}
                              </span>
                            )}
                            <span className="flex items-center gap-1 font-bold text-teal-primary">
                              <DollarSign className="w-3.5 h-3.5" />
                              ${(activity.cost || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center bg-paper p-1 rounded-lg border border-border-muted">
                        <button
                          onClick={() => handleOpenEditActivity(activity)}
                          className="p-1.5 rounded hover:bg-surface text-teal-primary transition-colors cursor-pointer"
                          title="Edit activity"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePromptDeleteActivity(activity)}
                          className="p-1.5 rounded hover:bg-surface text-brick-danger transition-colors cursor-pointer"
                          title="Delete activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Add / Edit Activity Modal */}
      <Dialog isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)}>
        <DialogHeader stampText={editingActivity ? "UPDATE ACTIVITY" : "NEW ACTIVITY"}>
          <DialogTitle>{editingActivity ? "Edit Activity" : "Add Custom Activity"}</DialogTitle>
          <DialogDescription>
            Specify details, cost, and time for this itinerary activity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveActivity}>
          <DialogContent className="space-y-4 max-h-[75vh] overflow-y-auto">
            {activityError && (
              <Alert variant="danger" badgeText="REQUIRED">
                {activityError}
              </Alert>
            )}

            <Input
              id="act-title"
              name="title"
              label="Activity Title"
              value={activityForm.title}
              onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
              placeholder="e.g. Guided Louvre Museum Tour / Eiffel Tower Summit Tickets"
              leftIcon={<Tag className="w-4 h-4 text-teal-primary/70" />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                id="act-category"
                name="category"
                label="Category"
                value={activityForm.category}
                onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
              >
                <option value="SIGHTSEEING">🏛️ Sightseeing</option>
                <option value="FOOD">🍷 Food & Dining</option>
                <option value="ENTERTAINMENT">🎭 Entertainment</option>
                <option value="SHOPPING">🛍️ Shopping</option>
                <option value="TRANSPORT">🚕 Transport</option>
                <option value="OTHER">📌 Other</option>
              </Select>

              <Input
                id="act-cost"
                name="cost"
                type="number"
                label="Cost ($USD)"
                value={activityForm.cost}
                onChange={(e) => setActivityForm({ ...activityForm, cost: e.target.value })}
                placeholder="e.g. 65"
                leftIcon={<DollarSign className="w-4 h-4 text-teal-primary/70" />}
              />
            </div>

            <Input
              id="act-time"
              name="time"
              label="Scheduled Time / Duration"
              value={activityForm.time}
              onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
              placeholder="e.g. 10:00 AM - 1:00 PM (3 hours)"
              leftIcon={<Clock className="w-4 h-4 text-amber-accent/70" />}
            />

            <Textarea
              id="act-description"
              name="description"
              label="Notes & Booking Details"
              badge="OPTIONAL"
              rows={2}
              value={activityForm.description}
              onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
              placeholder="Ticket reservation codes, meeting location, special instructions..."
            />
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsActivityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingActivity}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {editingActivity ? "Save Activity" : "Add Activity"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Custom Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingActivityId}
        onClose={() => setDeletingActivityId(null)}
        onConfirm={handleConfirmDeleteActivity}
        title="Delete Activity"
        itemName={deletingActivityTitle}
        isLoading={isDeletingActivity}
      />
    </div>
  );
}

/**
 * Shimmering Section Activities Skeleton Loader Component
 */
function SectionActivitiesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Card Skeleton */}
      <div className="p-6 bg-surface border border-border-muted rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-border-muted/60 rounded" />
            <div className="h-7 w-60 bg-border-muted/80 rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-border-muted/40 rounded-lg" />
        </div>
      </div>

      {/* Activities Grid Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="h-6 w-40 bg-border-muted/60 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-surface border border-border-muted rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-5 w-48 bg-border-muted/60 rounded" />
                <div className="h-4 w-24 bg-border-muted/40 rounded" />
              </div>
              <div className="h-8 w-16 bg-border-muted/40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

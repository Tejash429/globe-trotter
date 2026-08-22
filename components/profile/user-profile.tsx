"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  User,
  Mail,
  Globe,
  Calendar,
  Edit3,
  Clock,
  ArrowRight,
  MapPin,
  Camera,
  Phone,
  FileText,
  Plus,
  CompassIcon,
} from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Footer } from "@/components/dashboard/footer";
import { Badge, Button, Alert, Card, toast } from "@/components/ui";
import { TripCard } from "@/components/trips/trip-card";
import { DeleteTripDialog } from "@/components/trips/delete-trip-dialog";

interface TripData {
  id: string;
  userId: string;
  title: string;
  destinationPlace: string;
  description?: string;
  coverImage?: string | null;
  startDate: string;
  endDate: string;
  totalBudget: number;
  currency?: string;
  visibility?: string;
  status?: "upcoming" | "ongoing" | "completed" | "draft";
  sectionsCount?: number;
  totalSectionBudget?: number;
  totalEstimatedCost?: number;
  sections?: any[];
}

interface UserProfileData {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
  language: string;
  role: string;
  avatarUrl?: string;
  joinedDate: string;
  tripsCount: number;
}

export function UserProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [editForm, setEditForm] = useState<UserProfileData>({
    id: "",
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    country: "",
    additionalInfo: "",
    language: "English (US)",
    role: "USER",
    avatarUrl: "",
    joinedDate: "",
    tripsCount: 0,
  });

  useEffect(() => {
    async function loadProfileAndTrips() {
      setIsLoading(true);
      let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // Fallback: Read token from cookies if not in localStorage
      if (!token && typeof document !== "undefined") {
        const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
        if (match) token = match[2];
      }

      if (!token) {
        // Check local storage for cached user
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            const userObj: UserProfileData = {
              id: parsed.id || "",
              name: parsed.name || `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() || "Traveler",
              firstName: parsed.firstName || "",
              lastName: parsed.lastName || "",
              email: parsed.email || "",
              phoneNumber: parsed.phoneNumber || "",
              city: parsed.city || "",
              country: parsed.country || "",
              additionalInfo: parsed.additionalInfo || "",
              language: parsed.language === "es" ? "Spanish (Español)" : parsed.language === "fr" ? "French (Français)" : "English (US)",
              role: parsed.role || "USER",
              avatarUrl: parsed.avatarUrl || undefined,
              joinedDate: parsed.createdAt
                ? new Date(parsed.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                : "Recent",
              tripsCount: parsed._count?.trips || 0,
            };
            setUserData(userObj);
            setEditForm(userObj);
          } catch {
            setUserData(null);
          }
        } else {
          setUserData(null);
        }
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch User Profile from /api/v1/auth/me
        const userRes = await fetch("/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userDataRes = await userRes.json();
        if (userRes.ok && userDataRes.success && userDataRes.data) {
          const u = userDataRes.data;
          const formattedUser: UserProfileData = {
            id: u.id,
            name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Traveler",
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email,
            phoneNumber: u.phoneNumber || "",
            city: u.city || "",
            country: u.country || "",
            additionalInfo: u.additionalInfo || "",
            language: u.language === "es" ? "Spanish (Español)" : u.language === "fr" ? "French (Français)" : "English (US)",
            role: u.role || "USER",
            avatarUrl: u.avatarUrl || undefined,
            joinedDate: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "August 2026",
            tripsCount: u._count?.trips || 0,
          };

          setUserData(formattedUser);
          setEditForm(formattedUser);
          localStorage.setItem("user", JSON.stringify(u));
        } else {
          setUserData(null);
        }

        // 2. Fetch User Trips from /api/v1/trips
        const tripsRes = await fetch("/api/v1/trips?limit=100", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tripsDataRes = await tripsRes.json();
        if (tripsRes.ok && tripsDataRes.success) {
          // Parse trips from either data.trips or data
          const tripList: TripData[] = Array.isArray(tripsDataRes.data?.trips)
            ? tripsDataRes.data.trips
            : Array.isArray(tripsDataRes.data)
            ? tripsDataRes.data
            : [];

          setTrips(tripList);
          setUserData((prev) => (prev ? { ...prev, tripsCount: tripList.length } : null));
        } else {
          setTrips([]);
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfileAndTrips();
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      if (match) token = match[2];
    }

    try {
      const res = await fetch("/api/v1/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          firstName: editForm.firstName?.trim(),
          lastName: editForm.lastName?.trim(),
          phoneNumber: editForm.phoneNumber?.trim(),
          city: editForm.city?.trim(),
          country: editForm.country?.trim(),
          additionalInfo: editForm.additionalInfo?.trim(),
          avatarUrl: editForm.avatarUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update profile");
      }

      const updated = data.data;
      const formattedUser: UserProfileData = {
        id: updated.id,
        name: updated.name || `${updated.firstName || ""} ${updated.lastName || ""}`.trim() || "Traveler",
        firstName: updated.firstName || "",
        lastName: updated.lastName || "",
        email: updated.email,
        phoneNumber: updated.phoneNumber || "",
        city: updated.city || "",
        country: updated.country || "",
        additionalInfo: updated.additionalInfo || "",
        language: updated.language === "es" ? "Spanish (Español)" : updated.language === "fr" ? "French (Français)" : "English (US)",
        role: updated.role || "USER",
        avatarUrl: updated.avatarUrl || undefined,
        joinedDate: updated.createdAt
          ? new Date(updated.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "Recent",
        tripsCount: updated._count?.trips || trips.length,
      };

      setUserData(formattedUser);
      setEditForm(formattedUser);
      localStorage.setItem("user", JSON.stringify(updated));

      setIsEditing(false);
      toast.success("Profile Updated", "Your traveler passport credentials have been successfully updated.");
    } catch (err: any) {
      toast.error("Update Failed", err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const [tripToDelete, setTripToDelete] = useState<TripData | null>(null);
  const [isDeletingTrip, setIsDeletingTrip] = useState(false);

  const handleConfirmDeleteTrip = async () => {
    if (!tripToDelete) return;

    let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      if (match) token = match[2];
    }
    if (!token) return;

    setIsDeletingTrip(true);
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
      setUserData((prev) => (prev ? { ...prev, tripsCount: Math.max(0, prev.tripsCount - 1) } : null));
      setTripToDelete(null);
      toast.success("Expedition Removed", `"${deletedTitle}" was successfully removed.`);
    } catch (err: any) {
      toast.error("Deletion Failed", err.message || "Failed to delete trip");
    } finally {
      setIsDeletingTrip(false);
    }
  };

  // Segregate trips into upcoming and completed based on dates or status
  const now = new Date();
  const upcomingTrips = trips.filter((t) => {
    if (t.status === "upcoming" || t.status === "ongoing" || t.status === "draft") return true;
    if (t.status === "completed") return false;
    if (!t.endDate) return true;
    return new Date(t.endDate) >= now;
  });

  const previousTrips = trips.filter((t) => {
    if (t.status === "completed") return true;
    if (t.status === "upcoming" || t.status === "ongoing" || t.status === "draft") return false;
    return t.endDate ? new Date(t.endDate) < now : false;
  });

  return (
    <div className="min-h-screen w-full bg-paper text-ink flex flex-col font-sans selection:bg-amber-accent/20 selection:text-ink">
      {/* Universal Top Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Loading Skeleton */}
        {isLoading && <ProfileSkeleton />}

        {/* Not Logged In State */}
        {!isLoading && !userData && (
          <div className="max-w-md mx-auto py-12">
            <Card isTicketStub className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-teal-primary/10 border-2 border-dashed border-teal-primary/40 flex items-center justify-center mx-auto text-teal-primary">
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">Passport Locked</h2>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  Please sign in with your credentials to inspect and manage your traveler profile.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2.5">
                <Link href="/login">
                  <Button variant="primary" size="lg" className="w-full">
                    Sign In to Passport
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="md" className="w-full">
                    Create New Account
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* Authenticated Profile Content */}
        {!isLoading && userData && (
          <>
            {/* Top Section: User Profile Card */}
            <section className="w-full bg-surface border border-border-muted rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(27,43,52,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-primary via-amber-accent to-teal-primary" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {/* Left: Image of the User */}
                <div className="relative shrink-0 group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-teal-primary/40 p-1.5 bg-paper shadow-xs transition-all duration-300 group-hover:border-teal-primary flex items-center justify-center overflow-hidden">
                    {userData.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={userData.avatarUrl}
                        alt={userData.name}
                        className="w-full h-full rounded-full object-cover shadow-inner"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-teal-primary/10 flex items-center justify-center text-teal-primary font-mono text-xl font-bold uppercase">
                        {userData.name ? userData.name.slice(0, 2) : <User className="w-8 h-8" />}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-1 right-1 bg-amber-accent hover:bg-amber-hover text-white p-2 rounded-full shadow-xs cursor-pointer transition-colors"
                    title="Change Avatar"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: User Details with Option to Edit */}
                <div className="flex-1 text-center md:text-left space-y-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-border-muted pb-4">
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-ink tracking-tight">
                          {userData.name}
                        </h1>
                        <Badge variant="teal">VERIFIED TRAVELER</Badge>
                        <Badge variant="amber">{userData.role}</Badge>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mt-1">
                        Member since {userData.joinedDate} • {trips.length} Total Expeditions
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      leftIcon={<Edit3 className="w-3.5 h-3.5 text-teal-primary" />}
                    >
                      {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </Button>
                  </div>

                  {/* Inline Profile Details Grid or Edit Form */}
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-left">
                        <div className="p-3 rounded-xl border border-border-muted bg-paper/60 space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-teal-primary" /> EMAIL ADDRESS
                          </span>
                          <p className="text-xs font-mono text-ink truncate font-medium">
                            {userData.email}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-border-muted bg-paper/60 space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-teal-primary" /> PHONE
                          </span>
                          <p className="text-xs font-mono text-ink truncate font-medium">
                            {userData.phoneNumber || "Not provided"}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-border-muted bg-paper/60 space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-accent" /> BASE LOCATION
                          </span>
                          <p className="text-xs font-sans text-ink font-medium">
                            {userData.city && userData.country
                              ? `${userData.city}, ${userData.country}`
                              : userData.city || userData.country || "Not specified"}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-border-muted bg-paper/60 space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-teal-primary" /> LANGUAGE
                          </span>
                          <p className="text-xs font-sans text-ink font-medium">
                            {userData.language}
                          </p>
                        </div>
                      </div>

                      {userData.additionalInfo && (
                        <div className="p-3.5 rounded-xl border border-border-muted bg-paper/40 text-left">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                            <FileText className="w-3.5 h-3.5 text-teal-primary" /> TRAVEL STYLE & BIO
                          </span>
                          <p className="text-xs font-sans text-ink leading-relaxed">
                            {userData.additionalInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Editable Form */
                    <form
                      onSubmit={handleSaveProfile}
                      className="space-y-4 pt-2 text-left animate-in fade-in"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono font-bold text-ink uppercase">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                firstName: e.target.value,
                                name: `${e.target.value} ${editForm.lastName || ""}`.trim(),
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono font-bold text-ink uppercase">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                lastName: e.target.value,
                                name: `${editForm.firstName || ""} ${e.target.value}`.trim(),
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono font-bold text-ink uppercase">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({ ...editForm, email: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs font-mono focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono font-bold text-ink uppercase">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={editForm.phoneNumber}
                            onChange={(e) =>
                              setEditForm({ ...editForm, phoneNumber: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs font-mono focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono font-bold text-ink uppercase">
                            City
                          </label>
                          <input
                            type="text"
                            value={editForm.city}
                            onChange={(e) =>
                              setEditForm({ ...editForm, city: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono font-bold text-ink uppercase">
                            Country
                          </label>
                          <input
                            type="text"
                            value={editForm.country}
                            onChange={(e) =>
                              setEditForm({ ...editForm, country: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-mono font-bold text-ink uppercase">
                            Additional Bio & Preferences
                          </label>
                          <textarea
                            rows={2}
                            value={editForm.additionalInfo}
                            onChange={(e) =>
                              setEditForm({ ...editForm, additionalInfo: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: Preplanned Trips (Unified TripCard) */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-border-muted pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold font-display text-ink tracking-tight">
                    Preplanned Trips
                  </h2>
                  <span className="stamp-badge hidden sm:inline-flex text-[10px]">
                    UPCOMING EXPEDITIONS
                  </span>
                </div>
                <Badge variant="teal">
                  {upcomingTrips.length} UPCOMING EXPEDITIONS
                </Badge>
              </div>

              {upcomingTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      viewHref={`/trips/${trip.id}/builder`}
                      onDelete={() => setTripToDelete(trip)}
                      isDeleting={isDeletingTrip && tripToDelete?.id === trip.id}
                    />
                  ))}
                </div>
              ) : (
                <EmptyTripsState
                  title="No Upcoming Expeditions"
                  description="You don't have any upcoming trips scheduled. Start exploring cities or map your next journey."
                />
              )}
            </section>

            {/* Section 3: Previous Trips (Unified TripCard) */}
            <section className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-border-muted pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold font-display text-ink tracking-tight">
                    Previous Trips
                  </h2>
                  <span className="stamp-badge hidden sm:inline-flex text-[10px]">
                    ARCHIVED ITINERARIES
                  </span>
                </div>
                <Badge variant="amber">
                  {previousTrips.length} COMPLETED EXPEDITIONS
                </Badge>
              </div>

              {previousTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {previousTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      viewHref={`/trips/${trip.id}`}
                      onDelete={() => setTripToDelete(trip)}
                      isDeleting={isDeletingTrip && tripToDelete?.id === trip.id}
                    />
                  ))}
                </div>
              ) : (
                <EmptyTripsState
                  title="No Archived Trips"
                  description="Completed expeditions and travel logs will appear here after your journeys conclude."
                  showCreateButton={false}
                />
              )}
            </section>
          </>
        )}
      </main>

      {/* Delete Trip Confirmation Modal */}
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
        onConfirm={handleConfirmDeleteTrip}
        isDeleting={isDeletingTrip}
      />

      {/* Modern Passport Footer */}
      <Footer />
    </div>
  );
}

/**
 * Empty Trips State Component
 */
function EmptyTripsState({
  title,
  description,
  showCreateButton = true,
}: {
  title: string;
  description: string;
  showCreateButton?: boolean;
}) {
  return (
    <div className="p-8 rounded-2xl border border-dashed border-border-muted bg-surface text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-paper border border-border-muted flex items-center justify-center mx-auto text-muted-foreground">
        <CompassIcon className="w-6 h-6 text-teal-primary/70" />
      </div>
      <div>
        <h3 className="font-display text-base font-bold text-ink">{title}</h3>
        <p className="font-sans text-xs text-muted-foreground max-w-md mx-auto mt-1">
          {description}
        </p>
      </div>
      {showCreateButton && (
        <div className="pt-2">
          <Link href="/dashboard">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Plan a New Trip
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * Shimmering Passport Loading Skeleton Component
 */
function ProfileSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Top Profile Card Skeleton */}
      <div className="w-full bg-surface border border-border-muted rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Avatar Skeleton */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-paper border-2 border-dashed border-border-muted/80 p-2 shrink-0">
            <div className="w-full h-full rounded-full bg-border-muted/50" />
          </div>

          {/* User Meta Skeleton */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-border-muted pb-4">
              <div className="space-y-2">
                <div className="h-8 w-56 bg-border-muted/60 rounded-lg" />
                <div className="h-4 w-40 bg-border-muted/40 rounded" />
              </div>
              <div className="h-9 w-28 bg-border-muted/40 rounded-xl" />
            </div>

            {/* 4 Details Boxes Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3.5 rounded-xl border border-border-muted bg-paper/60 space-y-2">
                  <div className="h-3 w-20 bg-border-muted/50 rounded" />
                  <div className="h-4 w-32 bg-border-muted/70 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trips Section Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-dashed border-border-muted pb-3">
          <div className="space-y-1.5">
            <div className="h-6 w-44 bg-border-muted/60 rounded" />
            <div className="h-3 w-60 bg-border-muted/30 rounded" />
          </div>
          <div className="h-6 w-32 bg-border-muted/40 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border-muted rounded-2xl overflow-hidden space-y-4">
              <div className="h-48 w-full bg-border-muted/50" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-48 bg-border-muted/60 rounded" />
                <div className="h-3.5 w-32 bg-border-muted/40 rounded" />
                <div className="h-16 w-full bg-paper rounded-xl border border-border-muted/40" />
                <div className="h-2 w-full bg-border-muted/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Plus,
  Sparkles,
  Camera,
  LogOut,
  Phone,
  FileText,
  Ticket,
} from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Badge, Button, Alert, Card } from "@/components/ui";

interface TripItem {
  id: string;
  code: string;
  title: string;
  dateRange: string;
  stopsCount: number;
  activitiesCount: number;
  durationDays: number;
  status: "UPCOMING" | "COMPLETED";
  coverUrl: string;
  waypoints: { city: string; duration: string }[];
  spentBudget: number;
  totalBudget: number;
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

const DEFAULT_PREPLANNED_TRIPS: TripItem[] = [
  {
    id: "trip-1",
    code: "GT-EUR-2026",
    title: "Grand European Odyssey",
    dateRange: "JUL 01 – JUL 15, 2026",
    stopsCount: 3,
    activitiesCount: 16,
    durationDays: 14,
    status: "UPCOMING",
    coverUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80",
    waypoints: [
      { city: "Paris", duration: "4d" },
      { city: "Amsterdam", duration: "4d" },
      { city: "Rome", duration: "6d" },
    ],
    spentBudget: 3100,
    totalBudget: 3500,
  },
  {
    id: "trip-2",
    code: "GT-JPN-2026",
    title: "Tokyo & Kyoto Explorer",
    dateRange: "SEP 10 – SEP 22, 2026",
    stopsCount: 3,
    activitiesCount: 14,
    durationDays: 12,
    status: "UPCOMING",
    coverUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
    waypoints: [
      { city: "Tokyo", duration: "6d" },
      { city: "Hakone", duration: "2d" },
      { city: "Kyoto", duration: "4d" },
    ],
    spentBudget: 2800,
    totalBudget: 3000,
  },
];

const DEFAULT_PREVIOUS_TRIPS: TripItem[] = [
  {
    id: "trip-3",
    code: "GT-IDN-2026",
    title: "Bali Coastal Escape",
    dateRange: "JAN 12 – JAN 22, 2026",
    stopsCount: 3,
    activitiesCount: 12,
    durationDays: 10,
    status: "COMPLETED",
    coverUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
    waypoints: [
      { city: "Seminyak", duration: "3d" },
      { city: "Ubud", duration: "4d" },
      { city: "Uluwatu", duration: "3d" },
    ],
    spentBudget: 1950,
    totalBudget: 2000,
  },
];

export function UserProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
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
    async function loadUserProfile() {
      setIsLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        // Fallback: Check local storage for authenticated user
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
              avatarUrl: parsed.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
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
        const res = await fetch("/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success && data.data) {
          const u = data.data;
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
            avatarUrl:
              u.avatarUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
            joinedDate: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "August 2026",
            tripsCount: u._count?.trips || 0,
          };

          setUserData(formattedUser);
          setEditForm(formattedUser);

          // Update local storage session cache
          localStorage.setItem("user", JSON.stringify(u));
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Failed to fetch /api/v1/auth/me:", err);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData({ ...editForm });

    // Update local storage user
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...parsed,
            name: editForm.name,
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            phoneNumber: editForm.phoneNumber,
            city: editForm.city,
            country: editForm.country,
            additionalInfo: editForm.additionalInfo,
          })
        );
      }
    } catch {
      // Ignore
    }

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
            {/* Success Alert */}
            {saveSuccess && (
              <Alert variant="success" badgeText="PROFILE UPDATED">
                Your traveler credentials and preferences have been successfully updated.
              </Alert>
            )}

            {/* Top Section: User Profile Card */}
            <section className="w-full bg-surface border border-border-muted rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(27,43,52,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-primary via-amber-accent to-teal-primary" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {/* Left: Image of the User */}
                <div className="relative shrink-0 group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-teal-primary/40 p-1.5 bg-paper shadow-xs transition-all duration-300 group-hover:border-teal-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={userData.avatarUrl}
                      alt={userData.name}
                      className="w-full h-full rounded-full object-cover shadow-inner"
                    />
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
                        Member since {userData.joinedDate} • {userData.tripsCount} Expeditions Planned
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
                              : "Not specified"}
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
                        >
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: Preplanned Trips */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-border-muted pb-3">
                <div>
                  <h2 className="text-2xl font-extrabold font-display text-ink tracking-tight">
                    Preplanned Trips
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Upcoming scheduled multi-city itineraries
                  </p>
                </div>
                <Badge variant="teal">
                  {DEFAULT_PREPLANNED_TRIPS.length} UPCOMING EXPEDITIONS
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEFAULT_PREPLANNED_TRIPS.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>

            {/* Section 3: Previous Trips */}
            <section className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-border-muted pb-3">
                <div>
                  <h2 className="text-2xl font-extrabold font-display text-ink tracking-tight">
                    Previous Trips
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Completed travel logs &amp; archived itineraries
                  </p>
                </div>
                <Badge variant="amber">
                  {DEFAULT_PREVIOUS_TRIPS.length} COMPLETED EXPEDITIONS
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEFAULT_PREVIOUS_TRIPS.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
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

function TripCard({ trip }: { trip: TripItem }) {
  const budgetPercentage = Math.min(
    Math.round((trip.spentBudget / trip.totalBudget) * 100),
    100
  );

  return (
    <div className="bg-surface border border-border-muted rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(27,43,52,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Cover Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={trip.coverUrl}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-white font-mono text-[11px] font-bold tracking-wider border border-white/10 shadow-xs">
            {trip.code}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold flex items-center gap-1 border shadow-xs ${
              trip.status === "UPCOMING"
                ? "bg-teal-primary/90 text-white border-teal-primary"
                : "bg-amber-accent/90 text-white border-amber-accent"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{trip.status}</span>
          </span>
        </div>

        {/* Bottom Date Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white font-mono text-xs font-semibold drop-shadow-md">
          <Calendar className="w-3.5 h-3.5 text-amber-accent" />
          <span>{trip.dateRange}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-ink group-hover:text-teal-primary transition-colors">
            {trip.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {trip.stopsCount} Stops • {trip.activitiesCount} Activities
          </p>

          {/* Waypoints */}
          <div className="mt-3 p-2.5 rounded-xl bg-paper border border-border-muted/70">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block mb-1.5">
              Waypoints
            </span>
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              {trip.waypoints.map((wp, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-surface px-2 py-0.5 rounded border border-border-muted text-ink"
                >
                  <MapPin className="w-3 h-3 text-teal-primary" />
                  <span>{wp.city}</span>
                  <span className="text-muted-foreground text-[10px]">({wp.duration})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-1.5 border-t border-dashed border-border-muted pt-3">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">Estimated Budget:</span>
            <span className="font-bold text-ink">
              ${trip.spentBudget.toLocaleString()} / ${trip.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden border border-border-muted/50">
            <div
              className="h-full bg-teal-primary rounded-full transition-all duration-500"
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-mono text-muted-foreground">
            {trip.durationDays} Days Duration
          </span>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

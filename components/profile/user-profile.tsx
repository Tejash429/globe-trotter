'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  LogOut
} from 'lucide-react';

interface TripItem {
  id: string;
  code: string;
  title: string;
  dateRange: string;
  stopsCount: number;
  activitiesCount: number;
  durationDays: number;
  status: 'UPCOMING' | 'COMPLETED';
  coverUrl: string;
  waypoints: { city: string; duration: string }[];
  spentBudget: number;
  totalBudget: number;
}

const PREPLANNED_TRIPS: TripItem[] = [
  {
    id: 'trip-1',
    code: 'GT-EUR-2026',
    title: 'Grand European Odyssey',
    dateRange: 'JUL 01 – JUL 15, 2026',
    stopsCount: 3,
    activitiesCount: 16,
    durationDays: 14,
    status: 'UPCOMING',
    coverUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
    waypoints: [
      { city: 'Paris', duration: '4d' },
      { city: 'Amsterdam', duration: '4d' },
      { city: 'Rome', duration: '6d' },
    ],
    spentBudget: 3100,
    totalBudget: 3500,
  },
  {
    id: 'trip-2',
    code: 'GT-JPN-2026',
    title: 'Tokyo & Kyoto Explorer',
    dateRange: 'SEP 10 – SEP 22, 2026',
    stopsCount: 3,
    activitiesCount: 14,
    durationDays: 12,
    status: 'UPCOMING',
    coverUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    waypoints: [
      { city: 'Tokyo', duration: '6d' },
      { city: 'Hakone', duration: '2d' },
      { city: 'Kyoto', duration: '4d' },
    ],
    spentBudget: 2800,
    totalBudget: 3000,
  },
  {
    id: 'trip-3',
    code: 'GT-CHE-2026',
    title: 'Swiss Alpine Trail',
    dateRange: 'DEC 05 – DEC 14, 2026',
    stopsCount: 3,
    activitiesCount: 10,
    durationDays: 9,
    status: 'UPCOMING',
    coverUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80',
    waypoints: [
      { city: 'Zurich', duration: '2d' },
      { city: 'Lucerne', duration: '3d' },
      { city: 'Zermatt', duration: '4d' },
    ],
    spentBudget: 4200,
    totalBudget: 4500,
  },
];

const PREVIOUS_TRIPS: TripItem[] = [
  {
    id: 'trip-4',
    code: 'GT-IDN-2026',
    title: 'Bali Coastal Escape',
    dateRange: 'JAN 12 – JAN 22, 2026',
    stopsCount: 3,
    activitiesCount: 12,
    durationDays: 10,
    status: 'COMPLETED',
    coverUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
    waypoints: [
      { city: 'Seminyak', duration: '3d' },
      { city: 'Ubud', duration: '4d' },
      { city: 'Uluwatu', duration: '3d' },
    ],
    spentBudget: 1950,
    totalBudget: 2000,
  },
  {
    id: 'trip-5',
    code: 'GT-ITA-2025',
    title: 'Amalfi & Rome Getaway',
    dateRange: 'MAY 10 – MAY 18, 2025',
    stopsCount: 3,
    activitiesCount: 11,
    durationDays: 8,
    status: 'COMPLETED',
    coverUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80',
    waypoints: [
      { city: 'Rome', duration: '3d' },
      { city: 'Positano', duration: '3d' },
      { city: 'Capri', duration: '2d' },
    ],
    spentBudget: 3400,
    totalBudget: 3400,
  },
  {
    id: 'trip-6',
    code: 'GT-ISL-2025',
    title: 'Iceland Ring Road Tour',
    dateRange: 'SEP 02 – SEP 11, 2025',
    stopsCount: 3,
    activitiesCount: 15,
    durationDays: 9,
    status: 'COMPLETED',
    coverUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop&q=80',
    waypoints: [
      { city: 'Reykjavik', duration: '2d' },
      { city: 'Vik', duration: '3d' },
      { city: 'Akureyri', duration: '4d' },
    ],
    spentBudget: 2650,
    totalBudget: 2800,
  },
];

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    username: 'alex_explorer',
    email: 'alex.morgan@globetrotter.com',
    language: 'English (US)',
    joinedDate: 'March 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  });

  const [editForm, setEditForm] = useState({ ...user });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen w-full bg-paper text-ink flex flex-col font-sans selection:bg-amber-accent/20 selection:text-ink">
      {/* Top Header Navigation */}
      <header className="w-full bg-surface border-b border-border-muted sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-teal-primary flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <span className="font-extrabold font-display text-lg text-ink tracking-tight flex items-center gap-2">
                GlobeTrotter
              </span>
              <span className="block text-[10px] font-mono text-muted-foreground">PERSONALIZED TRAVEL PLANNING</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="stamp-badge hidden sm:inline-flex">
              <span>USER PROFILE (SCREEN 7)</span>
            </div>
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-ink px-3 py-1.5 rounded-lg border border-border-muted bg-paper hover:bg-muted transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Top Section: User Profile Card (Wireframe Top Row) */}
        <section className="w-full bg-surface border border-border-muted rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(27,43,52,0.04)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-primary via-amber-accent to-teal-primary" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            
            {/* Left: Image of the User */}
            <div className="relative shrink-0 group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-teal-primary/40 p-1.5 bg-paper shadow-sm transition-all duration-300 group-hover:border-teal-primary">
                {/* eslint-disable-next-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl}
                  alt={user.name}
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

            {/* Right: User Details with appropriate option to edit those information */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-border-muted pb-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-ink tracking-tight">
                      {user.name}
                    </h1>
                    <span className="stamp-badge-teal text-[10px]">VERIFIED TRAVELER</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    @{user.username} • {user.joinedDate}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border-muted bg-paper hover:bg-muted text-ink font-semibold text-xs transition-colors cursor-pointer self-center md:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5 text-teal-primary" />
                  <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
                </button>
              </div>

              {/* Inline Profile Details Grid or Edit Form */}
              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-left">
                  <div className="p-3.5 rounded-xl border border-border-muted bg-paper/60 space-y-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-teal-primary" /> EMAIL ADDRESS
                    </span>
                    <p className="text-xs font-mono text-ink truncate font-medium">{user.email}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border-muted bg-paper/60 space-y-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-accent" /> PREFERRED LANGUAGE
                    </span>
                    <p className="text-xs font-sans text-ink font-medium">{user.language}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border-muted bg-paper/60 space-y-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-primary" /> PASSPORT CLEARANCE
                    </span>
                    <p className="text-xs font-mono text-teal-primary font-bold">CLEARANCE #GT-2026</p>
                  </div>
                </div>
              ) : (
                /* Editable Form */
                <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 text-left animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-ink uppercase">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-ink uppercase">Username</label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs font-mono focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-ink uppercase">Email Address</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs font-mono focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-ink uppercase">Language</label>
                      <select
                        value={editForm.language}
                        onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-muted bg-paper text-ink text-xs focus:ring-2 focus:ring-teal-primary/40 focus:outline-none"
                      >
                        <option>English (US)</option>
                        <option>Spanish (Español)</option>
                        <option>French (Français)</option>
                        <option>German (Deutsch)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl border border-border-muted bg-paper text-xs font-semibold text-muted-foreground hover:text-ink cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-teal-primary hover:bg-teal-hover text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </section>

        {/* Section 2: Preplanned Trips (Wireframe Middle Section) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-border-muted pb-3">
            <div>
              <h2 className="text-2xl font-extrabold font-heading text-ink tracking-tight">
                Preplanned Trips
              </h2>
              <p className="text-xs text-muted-foreground">Upcoming scheduled multi-city itineraries</p>
            </div>
            <div className="stamp-badge-teal self-start sm:self-auto">
              <span>{PREPLANNED_TRIPS.length} UPCOMING EXPEDITIONS</span>
            </div>
          </div>

          {/* Grid of Trip Cards matching Image 2 EXACTLY */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREPLANNED_TRIPS.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Section 3: Previous Trips (Wireframe Bottom Section) */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-border-muted pb-3">
            <div>
              <h2 className="text-2xl font-extrabold font-heading text-ink tracking-tight">
                Previous Trips
              </h2>
              <p className="text-xs text-muted-foreground">Completed travel logs &amp; archived itineraries</p>
            </div>
            <div className="stamp-badge self-start sm:self-auto">
              <span>{PREVIOUS_TRIPS.length} COMPLETED EXPEDITIONS</span>
            </div>
          </div>

          {/* Grid of Trip Cards matching Image 2 EXACTLY */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREVIOUS_TRIPS.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

/**
 * Trip Card Component — Recreating Card Reference Image 2 EXACTLY:
 * - Cover Image with Dark Gradient
 * - Code Tag Badge (GT-EUR-2026) + Status Badge (UPCOMING)
 * - Date Range overlay (JUL 01 – JUL 15, 2026)
 * - Title in Fraunces serif (Grand European Odyssey)
 * - Subtitle (3 Destination Stops • 16 Activities)
 * - Waypoints Card Box (PLANNED WAYPOINTS: Paris, Amsterdam, Rome)
 * - Budget Progress Bar ($3,100 / $3,500)
 * - Footer with Duration (14 Days Duration) and View Itinerary CTA button
 */
function TripCard({ trip }: { trip: TripItem }) {
  const budgetPercentage = Math.min(Math.round((trip.spentBudget / trip.totalBudget) * 100), 100);

  return (
    <div className="bg-surface border border-border-muted rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(27,43,52,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
      
      {/* Cover Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        {/* eslint-disable-next-next-line @next/next/no-img-element */}
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
            className={`stamp-badge text-[10px] backdrop-blur-md shadow-xs ${
              trip.status === 'UPCOMING'
                ? 'stamp-badge-teal bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-300'
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

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title & Subtitle */}
        <div>
          <h3 className="text-xl font-bold font-display text-teal-primary tracking-tight group-hover:text-teal-hover transition-colors">
            {trip.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {trip.stopsCount} Destination Stops • {trip.activitiesCount} Activities
          </p>
        </div>

        {/* Planned Waypoints Box */}
        <div className="p-3.5 rounded-xl border border-border-muted bg-paper/80 space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase block">
            PLANNED WAYPOINTS:
          </span>
          <ul className="space-y-1 text-xs font-sans text-ink">
            {trip.waypoints.map((wp, i) => (
              <li key={i} className="flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-primary" />
                <span>{wp.city}</span>
                <span className="text-muted-foreground font-mono text-[11px]">({wp.duration})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Budget Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-muted-foreground flex items-center gap-1">
              <span className="text-teal-primary font-bold">$</span> Budget:
            </span>
            <span className="font-mono font-bold text-ink">
              ${trip.spentBudget.toLocaleString()} / ${trip.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full bg-paper border border-border-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-primary rounded-full transition-all duration-500"
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>

        {/* Card Footer: Duration & CTA */}
        <div className="pt-3 border-t border-border-muted flex items-center justify-between text-xs">
          <span className="font-mono text-muted-foreground font-medium">
            {trip.durationDays} Days Duration
          </span>
          <button
            type="button"
            className="py-2 px-3.5 rounded-xl bg-teal-primary hover:bg-teal-hover text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>View Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}

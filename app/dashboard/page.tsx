"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { HeroBanner } from "@/components/dashboard/hero-banner";
import { SearchFilterBar } from "@/components/dashboard/search-filter-bar";
import { RegionalSelections } from "@/components/dashboard/regional-selections";
import { PreviousTrips, Trip } from "@/components/dashboard/previous-trips";
import { PlanTripModal } from "@/components/dashboard/plan-trip-modal";
import { TripDetailModal } from "@/components/dashboard/trip-detail-modal";
import { Footer } from "@/components/dashboard/footer";
import { Button } from "@/components/ui";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState("all");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-amber-accent/20 relative">
      {/* 1. Header / Navbar matching Excalidraw Top Nav */}
      <Navbar onOpenPlanModal={() => setIsPlanModalOpen(true)} />

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Personalized Traveler Hero Banner */}
        <HeroBanner onPlanTripClick={() => setIsPlanModalOpen(true)} />

        {/* 3. Search Bar + Dropdown Actions Controls */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onOpenPlanModal={() => setIsPlanModalOpen(true)}
        />

        {/* 4. Filter Destination Cards (Europe, Asia, etc.) */}
        <RegionalSelections
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* 5. Previous Trips Section (Reusable Ticket-Stub Cards) */}
        <PreviousTrips
          onViewTrip={(trip) => setSelectedTrip(trip)}
          filterRegion={selectedRegion}
        />
      </main>

      {/* Floating Action Button (Always Visible in Bottom Right Corner) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsPlanModalOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-teal-primary hover:bg-teal-primary/90 text-white font-mono text-xs font-extrabold shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
          title="Plan New Trip"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="tracking-wider uppercase font-bold">Plan Trip</span>
        </button>
      </div>

      {/* Modals */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />

      <TripDetailModal
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />

      {/* Discreet Workspace Status Strip */}
      <Footer />
    </div>
  );
}

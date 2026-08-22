"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Compass } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { HeroBanner } from "@/components/dashboard/hero-banner";
import { SearchFilterBar } from "@/components/dashboard/search-filter-bar";
import { RegionalSelections } from "@/components/dashboard/regional-selections";
import { PreviousTrips, Trip } from "@/components/dashboard/previous-trips";
import { PlanTripModal } from "@/components/dashboard/plan-trip-modal";
import { TripDetailModal } from "@/components/dashboard/trip-detail-modal";
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
      {/* 1. Header / Navbar matching Excalidraw Top Nav (GlobalTrotter + Circle Avatar) */}
      <Navbar onOpenPlanModal={() => setIsPlanModalOpen(true)} />

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 2. Panoramic Banner Image Container matching Excalidraw 'Banner Image' */}
        <HeroBanner onPlanTripClick={() => setIsPlanModalOpen(true)} />

        {/* 3. Search Bar Row: [ Search bar ...... ] [ Group by ] [ Filter ] [ Sort by... ] */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* 4. Top Regional Selections (5 square cards with Unsplash imagery) */}
        <RegionalSelections
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* 5. Previous Trips (3 tall ticket cards with cover photos) */}
        <PreviousTrips
          onViewTrip={(trip) => setSelectedTrip(trip)}
          filterRegion={selectedRegion}
        />
      </main>

      {/* 6. Bottom-Right Floating CTA: [ + Plan a trip ] matching Excalidraw */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsPlanModalOpen(true)}
          leftIcon={<Plus className="w-5 h-5 stroke-[2.5]" />}
          className="shadow-lg hover:shadow-xl hover:scale-105 transition-all font-sans font-bold px-5 py-3.5 rounded-full border-2 border-surface/30 ring-2 ring-teal-primary/20"
        >
          Plan a trip
        </Button>
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

      {/* Footer */}
      <footer className="w-full bg-surface border-t border-border-muted py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-primary" />
            <span className="font-semibold text-ink">GlobeTrotter</span>
            <span>• Empowering Personalized Multi-City Travel Planning</span>
          </div>

          <div className="flex items-center gap-4 font-sans text-xs">
            <Link href="/login" className="hover:text-teal-primary transition-colors">
              Sign In (Screen 1)
            </Link>
            <Link href="/register" className="hover:text-teal-primary transition-colors">
              Register (Screen 2)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

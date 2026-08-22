"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, Layers, X, Globe2, Sparkles, DollarSign } from "lucide-react";
import { CustomDropdown, DropdownOption } from "@/components/ui";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  groupBy: string;
  onGroupByChange: (group: string) => void;
  filterBy: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onOpenPlanModal?: () => void;
}

const GROUP_OPTIONS: DropdownOption[] = [
  { value: "all", label: "All Regions" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "americas", label: "Americas" },
  { value: "mediterranean", label: "Mediterranean" },
];

const FILTER_OPTIONS: DropdownOption[] = [
  { value: "all", label: "All Tiers" },
  { value: "budget", label: "Budget Tier", badge: "$" },
  { value: "moderate", label: "Moderate Tier", badge: "$$" },
  { value: "luxury", label: "Luxury Tier", badge: "$$$" },
];

const SORT_OPTIONS: DropdownOption[] = [
  { value: "popular", label: "Most Popular" },
  { value: "budget-asc", label: "Cost: Low to High" },
  { value: "budget-desc", label: "Cost: High to Low" },
  { value: "recent", label: "Recently Added" },
];

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupByChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortByChange,
  onOpenPlanModal,
}: SearchFilterBarProps) {
  const hasActiveFilters = searchQuery || groupBy !== "all" || filterBy !== "all" || sortBy !== "popular";

  const handleReset = () => {
    onSearchChange("");
    onGroupByChange("all");
    onFilterChange("all");
    onSortByChange("popular");
  };

  return (
    <div className="w-full bg-surface border border-border-muted rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Bar matching Excalidraw */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4 text-teal-primary" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search destinations (e.g. Paris, Tokyo, Alps, Amalfi)..."
            className="w-full pl-10 pr-9 py-2.5 bg-paper/60 border border-border-muted rounded-xl font-sans text-xs sm:text-sm text-ink placeholder:text-muted-foreground/70 transition-all focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary focus:bg-surface"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls: Group By, Filter, Sort By & Plan Trip Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Group By Dropdown */}
          <CustomDropdown
            labelPrefix="Group"
            value={groupBy}
            onChange={onGroupByChange}
            options={GROUP_OPTIONS}
            leftIcon={<Layers className="w-3.5 h-3.5 text-teal-primary" />}
            isActive={groupBy !== "all"}
          />

          {/* Filter Dropdown */}
          <CustomDropdown
            labelPrefix="Filter"
            value={filterBy}
            onChange={onFilterChange}
            options={FILTER_OPTIONS}
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-amber-accent" />}
            isActive={filterBy !== "all"}
          />

          {/* Sort By Dropdown */}
          <CustomDropdown
            labelPrefix="Sort"
            value={sortBy}
            onChange={onSortByChange}
            options={SORT_OPTIONS}
            leftIcon={<ArrowUpDown className="w-3.5 h-3.5 text-teal-primary" />}
            align="right"
            isActive={sortBy !== "popular"}
          />

          {/* Plan New Trip CTA Button */}
          
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-2 border-t border-border-muted/50 font-sans text-xs flex-wrap">
          <span className="text-muted-foreground text-[10px] font-mono uppercase font-bold tracking-wider">
            Active Filters:
          </span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-primary/10 text-teal-primary border border-teal-primary/20 text-[11px] font-medium">
              Query: &quot;{searchQuery}&quot;
            </span>
          )}
          {groupBy !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-accent/15 text-amber-900 dark:text-amber-200 border border-amber-accent/30 text-[11px] font-medium">
              Region: {GROUP_OPTIONS.find((o) => o.value === groupBy)?.label}
            </span>
          )}
          {filterBy !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-accent/15 text-amber-900 dark:text-amber-200 border border-amber-accent/30 text-[11px] font-medium">
              Tier: {FILTER_OPTIONS.find((o) => o.value === filterBy)?.label}
            </span>
          )}
          {sortBy !== "popular" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-primary/10 text-teal-primary border border-teal-primary/20 text-[11px] font-medium">
              Order: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="text-brick-danger hover:underline ml-auto text-xs font-semibold cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

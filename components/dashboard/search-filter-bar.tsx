"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, Layers, X } from "lucide-react";
import { Select } from "@/components/ui";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  groupBy: string;
  onGroupByChange: (group: string) => void;
  filterBy: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupByChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortByChange,
}: SearchFilterBarProps) {
  const hasActiveFilters = searchQuery || groupBy !== "all" || filterBy !== "all" || sortBy !== "popular";

  const handleReset = () => {
    onSearchChange("");
    onGroupByChange("all");
    onFilterChange("all");
    onSortByChange("popular");
  };

  return (
    <div className="w-full bg-surface border border-border-muted rounded-xl p-3 sm:p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar matching Excalidraw */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4 text-teal-primary" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search bar ...... (e.g. Paris, Tokyo, Alps, Amalfi)"
            className="w-full pl-10 pr-9 py-2.5 bg-paper/60 border border-border-muted rounded-lg font-mono text-sm text-ink placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls: Group By, Filter, Sort By */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Group By Select */}
          <div className="w-full sm:w-40">
            <Select
              value={groupBy}
              onChange={(e) => onGroupByChange(e.target.value)}
              leftIcon={<Layers className="w-3.5 h-3.5 text-teal-primary" />}
            >
              <option value="all">Group by: All</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="americas">Americas</option>
              <option value="mediterranean">Mediterranean</option>
            </Select>
          </div>

          {/* Filter Select */}
          <div className="w-full sm:w-36">
            <Select
              value={filterBy}
              onChange={(e) => onFilterChange(e.target.value)}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-amber-accent" />}
            >
              <option value="all">Filter: All</option>
              <option value="budget">Budget ($)</option>
              <option value="moderate">Moderate ($$)</option>
              <option value="luxury">Luxury ($$$)</option>
            </Select>
          </div>

          {/* Sort By Select */}
          <div className="w-full sm:w-40">
            <Select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              leftIcon={<ArrowUpDown className="w-3.5 h-3.5 text-teal-primary" />}
            >
              <option value="popular">Sort by: Popular</option>
              <option value="budget-asc">Cost: Low to High</option>
              <option value="budget-desc">Cost: High to Low</option>
              <option value="recent">Recently Added</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-1 border-t border-border-muted/50 font-mono text-xs">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">
            Active:
          </span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-primary/10 text-teal-primary border border-teal-primary/20">
              Query: &quot;{searchQuery}&quot;
            </span>
          )}
          {groupBy !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-accent/10 text-amber-accent border border-amber-accent/20">
              Group: {groupBy}
            </span>
          )}
          {filterBy !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-accent/10 text-amber-accent border border-amber-accent/20">
              Tier: {filterBy}
            </span>
          )}
          <button
            onClick={handleReset}
            className="text-brick-danger hover:underline ml-auto text-[11px] font-sans font-semibold cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

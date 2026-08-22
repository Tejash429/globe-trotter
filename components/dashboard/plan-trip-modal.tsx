"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Alert,
} from "@/components/ui";
import { Plus, Calendar, MapPin, DollarSign, Compass, Search, Loader2 } from "lucide-react";

interface CitySearchResult {
  id: string;
  name: string;
  country: string;
  region?: string;
  label: string;
}

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated?: (trip: any) => void;
}

export function PlanTripModal({
  isOpen,
  onClose,
  onTripCreated,
}: PlanTripModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    destinationPlace: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
    description: "",
  });

  // Autocomplete state
  const [citySuggestions, setCitySuggestions] = useState<CitySearchResult[]>([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch live city & state suggestions dynamically from API
  const fetchCitySuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setCitySuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSearchingCities(true);
    try {
      const res = await fetch(`/api/v1/destinations/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setCitySuggestions(data.data);
        setShowDropdown(data.data.length > 0);
      }
    } catch (err) {
      console.warn("City search API error:", err);
    } finally {
      setIsSearchingCities(false);
    }
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, destinationPlace: val }));
    fetchCitySuggestions(val);
  };

  const handleSelectCity = (city: CitySearchResult) => {
    setFormData((prev) => ({
      ...prev,
      destinationPlace: city.name || city.label,
    }));
    setShowDropdown(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please provide a title for your trip.");
      return;
    }
    if (!formData.destinationPlace.trim()) {
      setError("Please specify a valid destination city or state.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please specify both start and end travel dates.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("You must be signed in to create a trip. Please log in first.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          destinationPlace: formData.destinationPlace.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalBudget: formData.totalBudget ? parseFloat(formData.totalBudget) : 0,
          description: formData.description.trim() || undefined,
          currency: "USD",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg =
          data.error?.message ||
          data.error?.details?.[0]?.issue ||
          "Failed to create trip. Please check your inputs.";
        throw new Error(errorMsg);
      }

      setSuccess(true);
      const createdTrip = data.data.trip;

      if (onTripCreated) {
        onTripCreated(createdTrip);
      }

      setTimeout(() => {
        setSuccess(false);
        setFormData({
          title: "",
          destinationPlace: "",
          startDate: "",
          endDate: "",
          totalBudget: "",
          description: "",
        });
        onClose();
        if (createdTrip?.id) {
          router.push(`/trips/${createdTrip.id}/builder`);
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to create trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader stampText="NEW PASSPORT ROUTE">
        <DialogTitle>Plan a New Trip</DialogTitle>
        <DialogDescription>
          Initiate your multi-city itinerary parameters and budget target.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <Alert variant="danger" badgeText="REQUIRED">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" badgeText="CREATED">
              Trip passport created successfully!
            </Alert>
          )}

          {/* Trip Title */}
          <Input
            id="trip-title"
            name="title"
            label="Trip Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Nordic Winter Expedition 2026"
            leftIcon={<Compass className="w-4 h-4 text-teal-primary/70" />}
            required
          />

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="startDate"
              name="startDate"
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={handleChange}
              leftIcon={<Calendar className="w-4 h-4 text-amber-accent/70" />}
              required
            />
            <Input
              id="endDate"
              name="endDate"
              type="date"
              label="End Date"
              value={formData.endDate}
              onChange={handleChange}
              leftIcon={<Calendar className="w-4 h-4 text-amber-accent/70" />}
              required
            />
          </div>

          {/* Destination Place (Live Autocomplete) & Budget Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative" ref={dropdownRef}>
              <Input
                id="destinationPlace"
                name="destinationPlace"
                label="Destination City / State"
                value={formData.destinationPlace}
                onChange={handleDestinationChange}
                onFocus={() => {
                  if (formData.destinationPlace.length >= 2 && citySuggestions.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                placeholder="e.g. Jaipur, Paris, Tokyo"
                leftIcon={<MapPin className="w-4 h-4 text-teal-primary/70" />}
                rightIcon={
                  isSearchingCities ? (
                    <Loader2 className="w-4 h-4 text-teal-primary animate-spin" />
                  ) : undefined
                }
                required
              />

              {/* Dynamic Live Autocomplete Dropdown */}
              {showDropdown && citySuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border-muted rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto font-sans text-xs">
                  <div className="p-1.5 font-mono text-[10px] uppercase font-bold text-muted-foreground bg-paper border-b border-border-muted/60 px-3">
                    Select Valid City or State:
                  </div>
                  {citySuggestions.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className="w-full text-left px-3 py-2 hover:bg-teal-primary/10 hover:text-teal-primary transition-colors flex items-center justify-between group cursor-pointer border-b border-border-muted/30 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-primary/70 group-hover:text-teal-primary shrink-0" />
                        <span className="font-semibold text-ink group-hover:text-teal-primary">
                          {city.name}
                        </span>
                        {city.region && (
                          <span className="text-muted-foreground text-[11px]">
                            ({city.region})
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase font-semibold">
                        {city.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Input
              id="totalBudget"
              name="totalBudget"
              type="number"
              label="Target Budget ($USD)"
              value={formData.totalBudget}
              onChange={handleChange}
              placeholder="e.g. 2500"
              leftIcon={<DollarSign className="w-4 h-4 text-teal-primary/70" />}
            />
          </div>

          {/* Description */}
          <Textarea
            id="description"
            name="description"
            label="Trip Description & Notes"
            badge="OPTIONAL"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="Bucket list sights, dietary restrictions, preferred transportation..."
          />
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Trip Passport
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

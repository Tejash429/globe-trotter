"use client";

import { useState } from "react";
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
  Select,
  Alert,
} from "@/components/ui";
import { Plus, Calendar, MapPin, DollarSign, Compass, CheckCircle2 } from "lucide-react";

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
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    startingCity: "",
    budget: "",
    travelStyle: "moderate",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please provide a title for your trip.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please specify both start and end travel dates.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      if (onTripCreated) {
        onTripCreated(formData);
      }
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }, 800);
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
              Trip passport opened! Launching Itinerary Builder...
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
            />
            <Input
              id="endDate"
              name="endDate"
              type="date"
              label="End Date"
              value={formData.endDate}
              onChange={handleChange}
              leftIcon={<Calendar className="w-4 h-4 text-amber-accent/70" />}
            />
          </div>

          {/* Starting City & Budget Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="startingCity"
              name="startingCity"
              label="Starting City"
              value={formData.startingCity}
              onChange={handleChange}
              placeholder="e.g. London / Oslo"
              leftIcon={<MapPin className="w-4 h-4 text-teal-primary/70" />}
            />
            <Input
              id="budget"
              name="budget"
              type="number"
              label="Target Budget ($USD)"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 2500"
              leftIcon={<DollarSign className="w-4 h-4 text-teal-primary/70" />}
            />
          </div>

          {/* Travel Style */}
          <Select
            id="travelStyle"
            name="travelStyle"
            label="Travel Pace & Style"
            value={formData.travelStyle}
            onChange={handleChange}
          >
            <option value="budget">Backpacker / Budget ($)</option>
            <option value="moderate">Balanced / Moderate ($$)</option>
            <option value="luxury">Comfort / Luxury ($$$)</option>
          </Select>

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

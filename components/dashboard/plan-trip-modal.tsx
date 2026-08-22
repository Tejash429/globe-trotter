"use client";

import { useState } from "react";
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
import { Plus, Calendar, MapPin, DollarSign, Compass } from "lucide-react";

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

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
      setError("Please specify a destination place or city.");
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

          {/* Destination Place & Budget Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="destinationPlace"
              name="destinationPlace"
              label="Destination Place / City"
              value={formData.destinationPlace}
              onChange={handleChange}
              placeholder="e.g. Paris / Jaipur"
              leftIcon={<MapPin className="w-4 h-4 text-teal-primary/70" />}
              required
            />
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


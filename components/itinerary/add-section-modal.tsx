"use client";

import { useState, useEffect } from "react";
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
  toast,
} from "@/components/ui";
import { Plus, Calendar, DollarSign, Tag, FileText, CheckCircle2 } from "lucide-react";

export type SectionType = "TRAVEL" | "ACCOMMODATION" | "ACTIVITY" | "MISCELLANEOUS";

export interface SectionData {
  id?: string;
  title: string;
  type: SectionType;
  startDate: string;
  endDate: string;
  budget: number | string;
  description?: string;
  orderIndex?: number;
}

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  initialData?: SectionData | null;
  onSectionSaved: (section: any) => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export function AddSectionModal({
  isOpen,
  onClose,
  tripId,
  initialData,
  onSectionSaved,
  defaultStartDate = "",
  defaultEndDate = "",
}: AddSectionModalProps) {
  const [formData, setFormData] = useState<SectionData>({
    title: "",
    type: "ACTIVITY",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    budget: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        type: initialData.type || "ACTIVITY",
        startDate: initialData.startDate ? initialData.startDate.split("T")[0] : defaultStartDate,
        endDate: initialData.endDate ? initialData.endDate.split("T")[0] : defaultEndDate,
        budget: initialData.budget !== undefined ? initialData.budget : "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        title: "",
        type: "ACTIVITY",
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        budget: "",
        description: "",
      });
    }
    setError("");
  }, [initialData, isOpen, defaultStartDate, defaultEndDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please provide a title for this itinerary section.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please specify valid start and end dates.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("You must be logged in to modify trip sections.");
      return;
    }

    setIsLoading(true);

    try {
      const isEdit = !!initialData?.id;
      const url = isEdit
        ? `/api/v1/trips/${tripId}/sections/${initialData.id}`
        : `/api/v1/trips/${tripId}/sections`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        title: formData.title.trim(),
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget ? parseFloat(String(formData.budget)) : 0,
        description: formData.description?.trim() || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg =
          data.error?.message ||
          data.error?.details?.[0]?.issue ||
          "Failed to save itinerary section.";
        throw new Error(errorMsg);
      }

      toast.success(
        isEdit ? "Waypoint Updated" : "Waypoint Stop Added",
        isEdit
          ? `Itinerary stop "${formData.title}" has been updated.`
          : `New stop "${formData.title}" added to itinerary!`
      );
      onSectionSaved(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save itinerary section.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader stampText={initialData ? "UPDATE WAYPOINT" : "ADD WAYPOINT STOP"}>
        <DialogTitle>{initialData ? "Edit Itinerary Stop" : "Add Itinerary Stop"}</DialogTitle>
        <DialogDescription>
          Specify the section details, category, dates, and allocated budget for this waypoint.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <Alert variant="danger" badgeText="REQUIRED">
              {error}
            </Alert>
          )}

          {/* Section Title */}
          <Input
            id="section-title"
            name="title"
            label="Section / Stop Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Air France Flight to Paris / Louvre Museum Tour"
            leftIcon={<Tag className="w-4 h-4 text-teal-primary/70" />}
            required
          />

          {/* Section Type & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              id="section-type"
              name="type"
              label="Section Category"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="TRAVEL">✈️ Travel & Transit</option>
              <option value="ACCOMMODATION">🏨 Hotel & Lodging</option>
              <option value="ACTIVITY">🎭 Activity & Sightseeing</option>
              <option value="MISCELLANEOUS">📦 Miscellaneous / Meals</option>
            </Select>

            <Input
              id="section-budget"
              name="budget"
              type="number"
              label="Allocated Budget ($USD)"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 450"
              leftIcon={<DollarSign className="w-4 h-4 text-teal-primary/70" />}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="section-startDate"
              name="startDate"
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={handleChange}
              leftIcon={<Calendar className="w-4 h-4 text-amber-accent/70" />}
              required
            />
            <Input
              id="section-endDate"
              name="endDate"
              type="date"
              label="End Date"
              value={formData.endDate}
              onChange={handleChange}
              leftIcon={<Calendar className="w-4 h-4 text-amber-accent/70" />}
              required
            />
          </div>

          {/* Description & Notes */}
          <Textarea
            id="section-description"
            name="description"
            label="Description & Booking Notes"
            badge="OPTIONAL"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="Reservation codes, flight numbers, address, or travel instructions..."
          />
        </DialogContent>

        <DialogFooter>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {initialData ? "Save Changes" : "Add Stop to Itinerary"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

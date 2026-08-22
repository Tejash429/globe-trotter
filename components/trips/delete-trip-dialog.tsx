"use client";

import React from "react";
import { AlertTriangle, Trash2, Calendar, MapPin } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, Button, Badge } from "@/components/ui";

interface DeleteTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tripTitle?: string;
  tripDateRange?: string;
  destinationPlace?: string;
  isDeleting?: boolean;
}

export function DeleteTripDialog({
  isOpen,
  onClose,
  onConfirm,
  tripTitle = "this trip",
  tripDateRange,
  destinationPlace,
  isDeleting = false,
}: DeleteTripDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader stampText="DESTRUCTIVE ACTION">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brick-danger/10 border border-brick-danger/30 flex items-center justify-center text-brick-danger shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle className="text-xl">Delete Expedition?</DialogTitle>
            <DialogDescription>
              Permanently remove itinerary and itinerary stops
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogContent className="space-y-4 pt-4">
        <p className="font-sans text-xs text-ink/80 leading-relaxed">
          Are you sure you want to permanently cancel and delete{" "}
          <strong className="text-ink font-bold">&quot;{tripTitle}&quot;</strong>?
          All associated waypoints, activity schedules, and estimated budget items will be removed from your passport log.
        </p>

        {(destinationPlace || tripDateRange) && (
          <div className="p-3 rounded-xl bg-paper/80 border border-border-muted space-y-1.5 font-mono text-xs text-muted-foreground">
            {destinationPlace && (
              <div className="flex items-center gap-2 text-ink font-medium">
                <MapPin className="w-3.5 h-3.5 text-teal-primary shrink-0" />
                <span className="truncate">{destinationPlace}</span>
              </div>
            )}
            {tripDateRange && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-accent shrink-0" />
                <span>{tripDateRange}</span>
              </div>
            )}
          </div>
        )}

        <p className="font-mono text-[11px] text-brick-danger flex items-center gap-1 font-semibold">
          <span>• This action cannot be reversed once confirmed.</span>
        </p>
      </DialogContent>

      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={isDeleting}
        >
          Keep Expedition
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={onConfirm}
          isLoading={isDeleting}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Yes, Delete Itinerary
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

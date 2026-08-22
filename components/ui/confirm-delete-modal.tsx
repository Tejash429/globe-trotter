"use client";

import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  Button,
} from "@/components/ui";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  description?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  itemName = "this item",
  description,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader stampText="PERMANENT ACTION">
        <DialogTitle className="flex items-center gap-2 text-brick-danger">
          <AlertTriangle className="w-5 h-5 text-brick-danger shrink-0" />
          <span>{title}</span>
        </DialogTitle>
        <DialogDescription>
          {description || `Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
        </DialogDescription>
      </DialogHeader>

      <DialogContent className="py-3">
        <div className="p-3.5 rounded-xl bg-brick-danger/10 border border-brick-danger/20 text-xs font-sans text-brick-danger flex items-start gap-2.5">
          <Trash2 className="w-4 h-4 text-brick-danger shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Deleting <strong>"{itemName}"</strong> will permanently remove it and all associated metadata from your trip passport.
          </p>
        </div>
      </DialogContent>

      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Delete Permanently
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

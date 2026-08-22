"use client";

import Link from "next/link";
import { Compass, User, Bell, Map, Ticket } from "lucide-react";
import { Badge } from "@/components/ui";

interface NavbarProps {
  onOpenPlanModal?: () => void;
}

export function Navbar({ onOpenPlanModal }: NavbarProps) {
  return (
    <header className="w-full bg-surface/95 backdrop-blur-md border-b border-border-muted sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-teal-primary text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold text-ink tracking-tight block leading-tight">
              GlobeTrotter
            </span>
            <span className="font-mono text-[9px] text-amber-accent font-semibold tracking-wider uppercase block">
              Passport & Travel Planning
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-sans font-medium text-ink">
          <Link
            href="/dashboard"
            className="text-teal-primary font-semibold flex items-center gap-1.5"
          >
            <Map className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-ink transition-colors"
          >
            My Trips
          </Link>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-ink transition-colors"
          >
            Switch Account
          </Link>
        </nav>

        {/* Right Section: Stamp Badge & Avatar Circle */}
        <div className="flex items-center gap-3">
          <Badge variant="amber" icon={<Ticket className="w-3.5 h-3.5" />} className="hidden sm:inline-flex">
            PASS #2026
          </Badge>

          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-ink rounded-full hover:bg-paper transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-accent ring-2 ring-surface" />
          </button>

          {/* User Photo Avatar Circle per Excalidraw Wireframe */}
          <Link
            href="/dashboard"
            className="relative group block cursor-pointer"
            title="Traveler Profile"
          >
            <div className="w-10 h-10 rounded-full bg-paper border-2 border-dashed border-teal-primary flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-2xs">
              <div className="w-full h-full bg-teal-primary/10 flex items-center justify-center text-teal-primary font-mono text-xs font-bold">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-primary ring-2 ring-surface" />
          </Link>
        </div>
      </div>
    </header>
  );
}

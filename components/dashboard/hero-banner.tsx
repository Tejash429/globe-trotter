"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Plus,
  ArrowRight,
  Plane,
  Ticket,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";

interface HeroBannerProps {
  onPlanTripClick: () => void;
}

export function HeroBanner({ onPlanTripClick }: HeroBannerProps) {
  const [userName, setUserName] = useState<string>("Traveler");
  const [userLocation, setUserLocation] = useState<string>("");
  const [tripsCount, setTripsCount] = useState<number>(0);

  useEffect(() => {
    try {
      let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token && typeof document !== "undefined") {
        const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
        if (match) token = match[2];
      }

      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.firstName) {
          setUserName(u.firstName);
        } else if (u.name) {
          setUserName(u.name.split(" ")[0]);
        }
        if (u.city && u.country) {
          setUserLocation(`${u.city}, ${u.country}`);
        } else if (u.country) {
          setUserLocation(u.country);
        }
        if (u._count?.trips !== undefined) {
          setTripsCount(u._count.trips);
        }
      }

      if (token) {
        // 1. Fetch live user details
        fetch("/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.data) {
              const u = data.data;
              if (u.firstName) {
                setUserName(u.firstName);
              } else if (u.name) {
                setUserName(u.name.split(" ")[0]);
              }
              if (u.city && u.country) {
                setUserLocation(`${u.city}, ${u.country}`);
              } else if (u.country) {
                setUserLocation(u.country);
              }
              localStorage.setItem("user", JSON.stringify(u));
            }
          })
          .catch(() => {});

        // 2. Fetch live trips count
        fetch("/api/v1/trips?limit=100", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const list = Array.isArray(data.data?.trips)
                ? data.data.trips
                : Array.isArray(data.data)
                ? data.data
                : [];
              setTripsCount(list.length);
            }
          })
          .catch(() => {});
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border-muted shadow-sm min-h-[300px] sm:min-h-[340px] flex items-center">
      {/* 1. Full Panoramic Photographic Banner Image with Subtle Zoom */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
        alt="Scenic travel expedition landscape"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 hover:scale-100"
      />

      {/* 2. Sophisticated Cartography Gradient Overlay tailored for dashboard legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent sm:hidden" />

      {/* 3. Subtle Dashed Route Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FAF9F5_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* 4. Main Dashboard Command Content */}
      <div className="relative z-10 w-full px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="max-w-xl text-left space-y-3.5">
          {/* Personalized Greeting & Status Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-primary/90 text-white font-mono text-[11px] font-semibold border border-teal-primary shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-accent" />
              <span>PASSPORT ACTIVE</span>
            </span>
            {userLocation && (
              <span className="font-mono text-xs text-[#FAF9F5]/80 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-accent" />
                <span>Base: {userLocation}</span>
              </span>
            )}
          </div>

          {/* Heading */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.2] drop-shadow-sm">
            Welcome back,{" "}
            <span className="text-amber-accent">
              {userName}
            </span>
            !
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#FAF9F5]/90 leading-relaxed max-w-lg drop-shadow-xs">
            {tripsCount > 0
              ? `You currently have ${tripsCount} active travel ${tripsCount === 1 ? "expedition" : "expeditions"} in your log. Ready to map a new stop or review your daily timelines?`
              : "Your travel passport is open and ready. Start planning your next multi-city journey with automated cost estimation and daily activity schedules."}
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={onPlanTripClick}
              leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
              className="shadow-md font-bold"
            >
              Plan New Trip
            </Button>
            <Link href="/trips">
              <Button
                variant="secondary"
                size="md"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="bg-surface/90 backdrop-blur-md hover:bg-surface border-white/40 font-medium text-ink text-xs"
              >
                View My Trips ({tripsCount})
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Personal Traveler Stub Highlight Card */}
        <div className="w-full max-w-xs ticket-stub p-4 sm:p-5 bg-surface/95 backdrop-blur-md border border-border-muted rounded-xl shadow-lg space-y-3.5 shrink-0">
          <div className="flex items-center justify-between route-divider pb-2.5">
            <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-teal-primary" />
              <span>TRAVEL LOG SUMMARY</span>
            </span>
            <Badge variant="teal">GT-2026</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
            <div className="p-2 rounded-lg bg-paper/80 border border-border-muted/60">
              <span className="text-muted-foreground block text-[9px] uppercase font-semibold">
                Planned Expeditions
              </span>
              <span className="font-bold text-ink text-base">{tripsCount}</span>
            </div>
            <div className="p-2 rounded-lg bg-paper/80 border border-border-muted/60">
              <span className="text-muted-foreground block text-[9px] uppercase font-semibold">
                Passport Status
              </span>
              <span className="font-bold text-teal-primary text-xs flex items-center gap-1 mt-1">
                <Plane className="w-3 h-3" /> Ready
              </span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-paper/80 border border-border-muted/60 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-accent" />
              <span className="font-semibold text-ink text-[11px]">Travel Mode</span>
            </div>
            <span className="text-teal-primary font-bold text-[11px]">Multi-City</span>
          </div>
        </div>
      </div>
    </div>
  );
}

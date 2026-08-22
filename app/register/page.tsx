"use client";

import Link from "next/link";
import { Compass, ShieldCheck, MapPin, Globe2, Plane } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { Badge } from "@/components/ui";

export default function RegisterPage() {
  return (
    <main className="h-screen w-screen max-h-screen overflow-hidden bg-paper text-ink flex flex-col lg:flex-row selection:bg-amber-accent/20 selection:text-ink font-sans">
      {/* Left Column: Visual Travel Showcase Hero Pane (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full flex-col justify-between p-12 overflow-hidden bg-slate-900">
        {/* Photographic Background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80"
          alt="Kyoto pagodas and cherry blossoms vista"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85 scale-105 transition-transform duration-1000"
        />

        {/* Gradient & Cartography Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/60 to-ink/40" />
        <div className="absolute inset-0 bg-[radial-gradient(#FAF9F5_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Header in Left Pane */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-surface/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md">
              <Compass className="w-6 h-6 text-amber-accent animate-[spin_20s_linear_infinite]" />
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tight text-white block leading-none">
                GlobeTrotter
              </span>
              <span className="font-mono text-[9px] text-amber-accent font-bold tracking-widest uppercase block mt-1">
                Expedition & Travel Suite
              </span>
            </div>
          </Link>

          <Badge variant="teal" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            PASSPORT ISSUE DESK
          </Badge>
        </div>

        {/* Center Inspiration Quote & City Waypoint Overlay */}
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md border border-white/20 text-white font-mono text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-accent" />
            <span>Open Clearance • Interactive Timelines • Live Budgets</span>
          </div>

          <h2 className="font-display text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            Begin your global story with an intelligent travel passport.
          </h2>

          <p className="text-sm font-sans text-[#FAF9F5]/80 leading-relaxed max-w-md">
            Join thousands of travelers crafting structured day-wise journeys, tracking multi-city costs, and discovering extraordinary destinations.
          </p>

          {/* Mini Waypoints Route Preview Pill */}
          <div className="p-3 rounded-xl bg-surface/15 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs font-mono text-white/90">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-accent animate-pulse" />
              <span>TOKYO</span>
              <span className="text-white/40">→</span>
              <span>KYOTO</span>
              <span className="text-white/40">→</span>
              <span>BALI</span>
            </div>
            <span className="text-teal-primary font-semibold text-[11px]">3 DESTINATIONS</span>
          </div>
        </div>

        {/* Bottom Metadata in Left Pane */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-white/70 border-t border-white/15 pt-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-teal-primary" />
            <span>GLOBAL CLEARANCE #2026</span>
          </div>
          <span>EDITION 2.6 • INSTANT ISSUE</span>
        </div>
      </div>

      {/* Right Column: Form Container (Smooth scrollable, never cuts off) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-y-auto">
        {/* Mobile Header (Visible only on smaller screens) */}
        <div className="flex lg:hidden items-center justify-between pb-2 border-b border-dashed border-border-muted/80">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-primary text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-ink">
              GlobeTrotter
            </span>
          </Link>
          <Badge variant="amber">CREATE PASSPORT</Badge>
        </div>

        {/* Main Center Form */}
        <div className="my-auto py-2 w-full flex items-center justify-center">
          <RegisterForm />
        </div>

        {/* Discreet Bottom Bar */}
        <div className="pt-2 text-center text-[11px] font-mono text-muted-foreground">
          <span>GlobeTrotter Travel OS • 256-Bit Encrypted Registration</span>
        </div>
      </div>
    </main>
  );
}

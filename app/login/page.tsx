"use client";

import Link from "next/link";
import { Compass, ShieldCheck, MapPin, Sparkles, Plane, Globe2 } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="h-screen w-screen max-h-screen overflow-hidden bg-paper text-ink flex flex-col lg:flex-row selection:bg-amber-accent/20 selection:text-ink font-sans">
      {/* Left Column: Visual Travel Showcase Hero Pane (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full flex-col justify-between p-12 overflow-hidden bg-slate-900">
        {/* Photographic Background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80"
          alt="Paris Eiffel Tower twilight panorama"
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
            PASSPORT AUTHORIZED
          </Badge>
        </div>

        {/* Center Inspiration Quote & City Waypoint Overlay */}
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md border border-white/20 text-white font-mono text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-accent" />
            <span>Waypoints • Multi-City Routes • Auto Budgets</span>
          </div>

          <h2 className="font-display text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            Journey beyond the ordinary with precision itineraries.
          </h2>

          <p className="text-sm font-sans text-[#FAF9F5]/80 leading-relaxed max-w-md">
            Seamlessly build day-wise schedules, track multi-currency budgets, and explore curated destination experiences across the globe.
          </p>

          {/* Mini Waypoints Route Preview Pill */}
          <div className="p-3 rounded-xl bg-surface/15 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs font-mono text-white/90">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-primary animate-pulse" />
              <span>PARIS</span>
              <span className="text-white/40">→</span>
              <span>AMALFI</span>
              <span className="text-white/40">→</span>
              <span>KYOTO</span>
            </div>
            <span className="text-amber-accent font-semibold text-[11px]">3 DESTINATIONS</span>
          </div>
        </div>

        {/* Bottom Metadata in Left Pane */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-white/70 border-t border-white/15 pt-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-teal-primary" />
            <span>GLOBAL CLEARANCE #2026</span>
          </div>
          <span>EDITION 2.6 • ALL ROUTES SECURE</span>
        </div>
      </div>

      {/* Right Column: Form Container (Fixed 100vh, centered, never scrollable) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 relative overflow-y-auto lg:overflow-hidden">
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
          <Badge variant="amber">PASSPORT SIGN IN</Badge>
        </div>

        {/* Main Center Form */}
        <div className="my-auto py-2 w-full flex items-center justify-center">
          <LoginForm />
        </div>

        {/* Discreet Bottom Bar */}
        <div className="pt-2 text-center text-[11px] font-mono text-muted-foreground">
          <span>GlobeTrotter Travel OS • 256-Bit Encrypted Session</span>
        </div>
      </div>
    </main>
  );
}

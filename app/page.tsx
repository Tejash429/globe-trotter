"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers,
  HelpCircle,
  Plane,
  Ticket,
  Map,
} from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import {
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  Alert,
} from "@/components/ui";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("both");
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-amber-accent/20">
      {/* Top Navigation Bar */}
      <header className="w-full bg-surface border-b border-border-muted sticky top-0 z-50 backdrop-blur-md bg-surface/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-primary text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-ink tracking-tight block leading-tight">
                GlobeTrotter
              </span>
              <span className="font-mono text-[10px] text-amber-accent font-semibold tracking-wider uppercase block">
                Passport & Travel Hub
              </span>
            </div>
          </div>

          {/* Custom Tabs Navigation */}
          <div className="hidden md:flex items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="both" icon={<Layers className="w-3.5 h-3.5" />}>
                  Side-by-Side
                </TabsTrigger>
                <TabsTrigger value="login">
                  Screen 1: Login
                </TabsTrigger>
                <TabsTrigger value="register">
                  Screen 2: Registration
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Quick Direct Links & Components Demo Modal Trigger */}
          <div className="flex items-center gap-3">
            <Badge variant="amber" icon={<ShieldCheck className="w-3.5 h-3.5" />} className="hidden sm:inline-flex">
              PORT 2026
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDemoDialogOpen(true)}
              leftIcon={<Ticket className="w-3.5 h-3.5" />}
            >
              Preview UI Dialog
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
        {/* Banner Intro */}
        <div className="text-center max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-accent/10 border border-amber-accent/30 text-amber-accent font-mono text-xs font-semibold uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authenticated Traveler Portal • Custom Components</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-3">
            GlobeTrotter Passport Access
          </h1>
          <p className="font-sans text-sm sm:text-base text-muted-foreground">
            Sign in with your existing traveler credentials or create a new passport profile to start planning your multi-city expeditions.
          </p>

          {/* Mobile Tab Toggle */}
          <div className="flex md:hidden justify-center items-center gap-2 mt-6">
            <Button
              variant={activeTab === "login" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("login")}
            >
              Screen 1: Login
            </Button>
            <Button
              variant={activeTab === "register" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("register")}
            >
              Screen 2: Registration
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        {activeTab === "both" && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Screen 1: Login Screen */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full mb-3 flex items-center justify-between px-1">
                <span className="font-display font-bold text-lg text-ink">
                  Screen 1 — Login
                </span>
                <Badge variant="amber">MOCKUP 1</Badge>
              </div>
              <LoginForm onSwitchToRegister={() => setActiveTab("register")} />
            </div>

            {/* Central Map Route Divider */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center h-full min-h-[400px] route-divider-vertical-teal relative">
              <div className="w-8 h-8 rounded-full bg-paper border border-teal-primary/30 flex items-center justify-center text-teal-primary font-mono text-xs font-bold my-auto shadow-xs">
                OR
              </div>
            </div>

            {/* Screen 2: Registration Screen */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full mb-3 flex items-center justify-between px-1">
                <span className="font-display font-bold text-lg text-ink">
                  Screen 2 — Registration
                </span>
                <Badge variant="teal">MOCKUP 2</Badge>
              </div>
              <RegisterForm onSwitchToLogin={() => setActiveTab("login")} />
            </div>
          </div>
        )}

        {activeTab === "login" && (
          <div className="w-full max-w-md mx-auto">
            <LoginForm onSwitchToRegister={() => setActiveTab("register")} />
          </div>
        )}

        {activeTab === "register" && (
          <div className="w-full max-w-xl mx-auto">
            <RegisterForm onSwitchToLogin={() => setActiveTab("login")} />
          </div>
        )}
      </main>

      {/* Reusable UI Dialog Modal Demo */}
      <Dialog isOpen={isDemoDialogOpen} onClose={() => setIsDemoDialogOpen(false)}>
        <DialogHeader stampText="EXPEDITION #042">
          <DialogTitle>Traveler Passport Guide</DialogTitle>
          <DialogDescription>
            Seamlessly navigate between 13 core screens using custom GlobeTrotter components.
          </DialogDescription>
        </DialogHeader>

        <DialogContent className="space-y-4">
          <Alert variant="info" title="Zero External UI Overhead">
            All components (Button, Input, Textarea, Dialog, Card, Badge, Tabs, Alert) are custom-built with pure theme variables.
          </Alert>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg border border-border-muted bg-paper/60 space-y-1">
              <div className="flex items-center gap-2 text-teal-primary font-bold text-xs font-mono">
                <Plane className="w-4 h-4" />
                <span>ITINERARY BUILDER</span>
              </div>
              <p className="font-sans text-[11px] text-muted-foreground">
                Reorder stops & estimate daily travel budgets.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border-muted bg-paper/60 space-y-1">
              <div className="flex items-center gap-2 text-amber-accent font-bold text-xs font-mono">
                <Map className="w-4 h-4" />
                <span>MAP EXPLORER</span>
              </div>
              <p className="font-sans text-[11px] text-muted-foreground">
                Discover popular cities with cost meta-data.
              </p>
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDemoDialogOpen(false)}
          >
            Close Guide
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDemoDialogOpen(false)}
          >
            Got It
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Footer Signature */}
      <footer className="w-full bg-surface border-t border-border-muted py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-primary" />
            <span>GlobeTrotter App • 100% Custom Reusable UI System</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-ink hover:underline">
              /login
            </Link>
            <Link href="/register" className="hover:text-ink hover:underline">
              /register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, User, Bell, Map, Ticket, LogOut } from "lucide-react";
import { Badge, Button } from "@/components/ui";

interface NavbarProps {
  onOpenPlanModal?: () => void;
}

export function Navbar({ onOpenPlanModal }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/login");
  };

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
            className="text-muted-foreground hover:text-teal-primary font-medium flex items-center gap-1.5 transition-colors"
          >
            <Map className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-teal-primary font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>My Trips</span>
          </Link>
        </nav>

        {/* Right Section: Stamp Badge & Avatar Circle */}
        <div className="flex items-center gap-3">
          <Badge variant="amber" icon={<Ticket className="w-3.5 h-3.5" />} className="hidden sm:inline-flex">
            {user?.name ? `${user.name.split(" ")[0].toUpperCase()} #2026` : "PASS #2026"}
          </Badge>

          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-ink rounded-full hover:bg-paper transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-accent ring-2 ring-surface" />
          </button>

          {/* User Photo Avatar Circle with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative group block cursor-pointer focus:outline-none"
              title={user?.name || "Traveler Profile"}
            >
              <div className="w-10 h-10 rounded-full bg-paper border-2 border-dashed border-teal-primary flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-2xs">
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-teal-primary/10 flex items-center justify-center text-teal-primary font-mono text-xs font-bold uppercase">
                    {user?.name ? user.name.slice(0, 2) : <User className="w-5 h-5" />}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-primary ring-2 ring-surface" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-surface border border-border-muted shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {user ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-border-muted/60">
                      <p className="font-sans text-sm font-semibold text-ink truncate">
                        {user.name}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      {user.city && user.country && (
                        <span className="inline-block mt-1 font-mono text-[10px] text-teal-primary bg-teal-primary/10 px-2 py-0.5 rounded">
                          📍 {user.city}, {user.country}
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-sans text-ink hover:bg-paper transition-colors font-medium"
                      >
                        <User className="w-4 h-4 text-teal-primary" />
                        <span>Traveler Profile & Settings</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-sans text-ink hover:bg-paper transition-colors font-medium"
                      >
                        <Map className="w-4 h-4 text-teal-primary" />
                        <span>My Travel Passport</span>
                      </Link>
                    </div>

                    <div className="border-t border-border-muted/60 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-sans text-brick-danger hover:bg-brick-danger/10 transition-colors cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out / Lock Passport</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-3 space-y-2 text-center">
                    <p className="font-sans text-xs text-muted-foreground">
                      Sign in to save and sync trips across devices
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      <Link href="/login" onClick={() => setIsDropdownOpen(false)}>
                        <Button variant="primary" size="sm" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsDropdownOpen(false)}>
                        <Button variant="secondary" size="sm" className="w-full">
                          Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

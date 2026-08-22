"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { Button, Input, Card, Badge, Alert } from "@/components/ui";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your username or email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <Card isTicketStub className="w-full max-w-md mx-auto p-6 sm:p-8">
      {/* Stamp Header */}
      <div className="flex items-center justify-between pb-4 mb-6 route-divider">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink leading-tight">
            Sign In
          </h2>
          <p className="font-sans text-xs text-muted-foreground">
            Access your personalized travel itineraries
          </p>
        </div>
        <Badge variant="amber">
          <span>PORT #01</span>
        </Badge>
      </div>

      {/* Screen 1 Circle Photo / Logo Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-paper border-2 border-dashed border-teal-primary/40 flex items-center justify-center p-1 shadow-inner transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-teal-primary/10 flex flex-col items-center justify-center text-teal-primary overflow-hidden">
              <Compass className="w-10 h-10 animate-spin-slow" />
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold mt-1">
                GLOBE
              </span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-accent text-white p-1 rounded-full shadow border-2 border-surface">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="font-mono text-xs text-muted-foreground mt-2 tracking-wide uppercase">
          Passport Clearance
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5">
          <Alert variant="danger" badgeText="ALERT">
            {error}
          </Alert>
        </div>
      )}

      {/* Success Notification */}
      {success && (
        <div className="mb-5">
          <Alert variant="success" badgeText="PASSPORT VERIFIED">
            Welcome back, traveler! Redirecting to Dashboard...
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field */}
        <Input
          id="login-username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. traveler_alex"
          leftIcon={<User className="w-4 h-4 text-teal-primary/70" />}
        />

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block font-sans text-xs font-semibold text-ink uppercase tracking-wider"
            >
              Password
            </label>
            <a
              href="#"
              className="font-sans text-xs text-teal-primary hover:text-teal-hover hover:underline transition-colors"
            >
              Forgot Password?
            </a>
          </div>
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4 text-teal-primary/70" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-border-muted text-teal-primary focus:ring-teal-primary/30 accent-[#2F6F5E]"
            />
            <span className="font-sans text-xs text-muted-foreground">
              Remember my session
            </span>
          </label>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Login Button
        </Button>
      </form>

      {/* Dashed Footer */}
      <div className="mt-6 pt-4 route-divider flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted-foreground uppercase">
          New Traveler?
        </span>
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-sans text-xs font-semibold text-amber-accent hover:underline cursor-pointer"
          >
            Create Account &rarr;
          </button>
        ) : (
          <Link
            href="/register"
            className="font-sans text-xs font-semibold text-amber-accent hover:underline"
          >
            Create Account &rarr;
          </Link>
        )}
      </div>
    </Card>
  );
}

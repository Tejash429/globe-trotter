"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { Button, Input, Card, Badge, toast } from "@/components/ui";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email Required", "Please enter your registered email address.");
      return;
    }
    if (!password) {
      toast.error("Password Required", "Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg =
          data.error?.message ||
          data.error?.details?.[0]?.issue ||
          "Failed to sign in. Please check your credentials.";
        toast.error("Authentication Failed", errorMsg);
        return;
      }

      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        // Set cookie for middleware route protection
        document.cookie = `token=${data.data.token}; path=/; max-age=604800; SameSite=Lax`;
        if (data.data.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
      }

      toast.success(
        "Passport Verified",
        `Welcome back${data.data?.user?.name ? `, ${data.data.user.name.split(" ")[0]}` : ""}! Redirecting to Dashboard...`
      );

      setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect") || "/dashboard";
        router.push(redirectUrl);
      }, 700);
    } catch (err: any) {
      toast.error("Connection Error", err.message || "Failed to contact server. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <Input
          id="login-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. traveler@globetrotter.io"
          leftIcon={<Mail className="w-4 h-4 text-teal-primary/70" />}
          required
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
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Password Reset", "Password reset instructions will be sent to your registered email.");
              }}
              className="font-sans text-xs text-teal-primary hover:text-teal-hover hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4 text-teal-primary/70" />}
            required
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
          Sign In to Passport
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

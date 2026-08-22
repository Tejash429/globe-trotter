"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Compass, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
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
        // Set cookie for middleware route protection (7 days)
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
      }, 600);
    } catch (err: any) {
      toast.error("Connection Error", err.message || "Failed to contact server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <Card isTicketStub className="p-6 sm:p-7 shadow-xl border-border-muted/90 bg-surface backdrop-blur-md space-y-4">
        {/* Ticket Header Stamp */}
        <div className="flex items-center justify-between route-divider pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-primary/10 border border-teal-primary/30 flex items-center justify-center text-teal-primary">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink leading-tight">
                Passport Sign In
              </h2>
              <p className="font-sans text-[11px] text-muted-foreground">
                Enter credentials to unlock itineraries
              </p>
            </div>
          </div>
          <Badge variant="teal" icon={<Ticket className="w-3 h-3" />}>
            GT-AUTH
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email Field */}
          <Input
            id="login-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="traveler@globetrotter.io"
            leftIcon={<Mail className="w-4 h-4 text-teal-primary/70" />}
            required
            className="text-xs"
          />

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block font-sans text-xs font-semibold text-ink uppercase tracking-wider"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  toast.info(
                    "Password Reset",
                    "Password recovery link will be dispatched to your registered email address."
                  );
                }}
                className="font-sans text-[11px] text-teal-primary hover:text-teal-hover hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-teal-primary/70" />}
              required
              className="text-xs"
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

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-border-muted text-teal-primary focus:ring-teal-primary/30 accent-[#2F6F5E]"
              />
              <span className="font-sans text-xs text-muted-foreground">
                Keep session authenticated
              </span>
            </label>
          </div>

          {/* Login Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full font-bold shadow-md mt-1"
          >
            Sign In to Passport
          </Button>
        </form>

        {/* Create Account Footer */}
        <div className="pt-2.5 border-t border-border-muted flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-mono text-[11px]">
            New traveler?
          </span>
          {onSwitchToRegister ? (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-sans font-bold text-amber-accent hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/register"
              className="font-sans font-bold text-amber-accent hover:underline flex items-center gap-1"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}

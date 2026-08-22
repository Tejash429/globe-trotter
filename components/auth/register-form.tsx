"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Compass,
  Ticket,
} from "lucide-react";
import { Button, Input, Textarea, Card, Badge, toast } from "@/components/ui";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    country: "",
    additionalInfo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Name Required", "Please enter your First Name and Last Name.");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email Required", "Please enter a valid email address.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error("Weak Password", "Password must be at least 6 characters long.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone Required", "Please enter your phone number.");
      return;
    }
    if (!formData.city.trim() || !formData.country.trim()) {
      toast.error("Location Required", "Please specify your base city and country.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phoneNumber: formData.phone.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          additionalInfo: formData.additionalInfo?.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg =
          data.error?.message ||
          data.error?.details?.[0]?.issue ||
          "Registration failed. Please check your information.";
        toast.error("Registration Failed", errorMsg);
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
        "Passport Issued",
        `Welcome to GlobeTrotter, ${formData.firstName}! Preparing your workspace...`
      );

      setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect") || "/dashboard";
        router.push(redirectUrl);
      }, 700);
    } catch (err: any) {
      toast.error("Connection Error", err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <Card isTicketStub className="p-5 sm:p-6 shadow-xl border-border-muted/90 bg-surface backdrop-blur-md space-y-3.5">
        {/* Ticket Header Stamp */}
        <div className="flex items-center justify-between route-divider pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-accent/15 border border-amber-accent/30 flex items-center justify-center text-amber-accent">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink leading-tight">
                Create Passport
              </h2>
              <p className="font-sans text-[11px] text-muted-foreground">
                Issue your personal travel clearance profile
              </p>
            </div>
          </div>
          <Badge variant="amber" icon={<Ticket className="w-3 h-3" />}>
            GT-NEW
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Row 1: First Name & Last Name (2 cols) */}
          <div className="grid grid-cols-2 gap-2.5">
            <Input
              id="firstName"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              leftIcon={<UserCheck className="w-3.5 h-3.5 text-teal-primary/70" />}
              required
              className="text-xs"
            />
            <Input
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              leftIcon={<UserCheck className="w-3.5 h-3.5 text-teal-primary/70" />}
              required
              className="text-xs"
            />
          </div>

          {/* Row 2: Email Address & Phone Number (2 cols) */}
          <div className="grid grid-cols-2 gap-2.5">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              leftIcon={<Mail className="w-3.5 h-3.5 text-teal-primary/70" />}
              required
              className="text-xs"
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
              leftIcon={<Phone className="w-3.5 h-3.5 text-teal-primary/70" />}
              required
              className="text-xs font-mono"
            />
          </div>

          {/* Row 3: Password (Single Cell Occupying Full Width) */}
          <div className="space-y-1">
            <label
              htmlFor="register-password"
              className="block font-sans text-xs font-semibold text-ink uppercase tracking-wider"
            >
              Password
            </label>
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              leftIcon={<Lock className="w-3.5 h-3.5 text-teal-primary/70" />}
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
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              }
            />
          </div>

          {/* Row 4: Base City & Country (2 cols) */}
          <div className="grid grid-cols-2 gap-2.5">
            <Input
              id="city"
              name="city"
              label="Base City"
              value={formData.city}
              onChange={handleChange}
              placeholder="San Francisco"
              leftIcon={<MapPin className="w-3.5 h-3.5 text-teal-primary/70" />}
              required
              className="text-xs"
            />
            <Input
              id="country"
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              placeholder="United States"
              leftIcon={<Globe className="w-3.5 h-3.5 text-teal-primary/70" />}
              required
              className="text-xs"
            />
          </div>

          {/* Row 5: Additional Info (Compact Rectangular Textarea at the bottom) */}
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            label="Additional Information / Travel Style"
            badge="OPTIONAL"
            rows={1}
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Tell us about your travel style, favorite destinations, or budget preferences..."
            leftIcon={<FileText className="w-3.5 h-3.5 text-teal-primary/70" />}
            className="text-xs resize-none min-h-[75px] h-12 py-1.5"
          />

          {/* Register Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full font-bold shadow-md mt-1.5"
          >
            Issue Passport & Register
          </Button>
        </form>

        {/* Already registered switch */}
        <div className="pt-2 border-t border-border-muted flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-mono text-[11px]">
            Already registered?
          </span>
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-sans font-bold text-amber-accent hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/login"
              className="font-sans font-bold text-amber-accent hover:underline flex items-center gap-1"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  UserCheck,
  ArrowRight,
  Upload,
  Lock,
  Eye,
  EyeOff,
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        // Set cookie for middleware route protection
        document.cookie = `token=${data.data.token}; path=/; max-age=604800; SameSite=Lax`;
        if (data.data.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
      }

      toast.success(
        "Passport Created",
        `Welcome aboard, ${formData.firstName}! Redirecting to Dashboard...`
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
    <Card isTicketStub className="w-full max-w-xl mx-auto p-6 sm:p-8">
      {/* Stamp Header */}
      <div className="flex items-center justify-between pb-4 mb-6 route-divider">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink leading-tight">
            Registration Screen
          </h2>
          <p className="font-sans text-xs text-muted-foreground">
            Create your GlobeTrotter passport & traveler profile
          </p>
        </div>
      </div>

      {/* Screen 2 Photo Circle Avatar Upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group cursor-pointer">
          <label htmlFor="photo-upload" className="cursor-pointer block">
            <div className="w-24 h-24 rounded-full bg-paper border-2 border-dashed border-amber-accent flex items-center justify-center p-1 shadow-inner transition-transform group-hover:scale-105 relative overflow-hidden">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-amber-accent/10 flex flex-col items-center justify-center text-amber-accent">
                  <User className="w-9 h-9" />
                  <span className="font-mono text-[9px] uppercase font-semibold">
                    Photo
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Upload className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-teal-primary text-white p-1.5 rounded-full shadow border-2 border-surface">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground mt-2 tracking-wide uppercase">
          Click to upload Passport Photo
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            leftIcon={<UserCheck className="w-4 h-4 text-teal-primary/70" />}
            required
          />
          <Input
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            leftIcon={<UserCheck className="w-4 h-4 text-teal-primary/70" />}
            required
          />
        </div>

        {/* Row 2: Email Address & Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            leftIcon={<Mail className="w-4 h-4 text-teal-primary/70" />}
            required
          />
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1 555 123 4567"
            leftIcon={<Phone className="w-4 h-4 text-teal-primary/70" />}
            required
          />
        </div>

        {/* Row 3: Password */}
        <div className="space-y-1.5">
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
            placeholder="Min. 6 characters"
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

        {/* Row 4: City & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="city"
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. San Francisco"
            leftIcon={<MapPin className="w-4 h-4 text-teal-primary/70" />}
            required
          />
          <Input
            id="country"
            name="country"
            label="Country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g. United States"
            leftIcon={<Globe className="w-4 h-4 text-teal-primary/70" />}
            required
          />
        </div>

        {/* Additional Information textarea */}
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          label="Additional Information ...."
          badge="OPTIONAL"
          rows={3}
          value={formData.additionalInfo}
          onChange={handleChange}
          placeholder="Tell us about your travel style, budget preferences, or bucket list destinations..."
          leftIcon={<FileText className="w-4 h-4 text-teal-primary/70" />}
        />

        {/* Register Users Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full mt-3"
        >
          Register Users
        </Button>
      </form>

      {/* Dashed Footer */}
      <div className="mt-6 pt-4 route-divider flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted-foreground uppercase">
          Already Registered?
        </span>
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-sans text-xs font-semibold text-amber-accent hover:underline cursor-pointer"
          >
            Sign In &rarr;
          </button>
        ) : (
          <Link
            href="/login"
            className="font-sans text-xs font-semibold text-amber-accent hover:underline"
          >
            Sign In &rarr;
          </Link>
        )}
      </div>
    </Card>
  );
}

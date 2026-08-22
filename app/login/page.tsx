import Link from "next/link";
import { Compass } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-teal-primary text-white flex items-center justify-center shadow-md">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            GlobeTrotter
          </h1>
          <p className="font-mono text-xs text-amber-accent font-semibold tracking-wider uppercase">
            Personalized Travel Planning
          </p>
        </div>
      </div>

      <LoginForm />
    </main>
  );
}

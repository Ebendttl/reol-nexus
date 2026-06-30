"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "../auth/actions";
import { User, Mail, KeyRound, AlertCircle, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F7F5] dark:bg-[#0A0D0B] p-4 font-sans selection:bg-[#D4AF37]/30 selection:text-foreground">
      <div className="w-full max-w-md bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-2xl shadow-xl overflow-hidden p-8 transition-all duration-300 hover:shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0F5132]/10 dark:bg-[#0F5132]/30 text-[#0F5132] dark:text-[#38C186] mb-3">
            <span className="text-2xl font-black tracking-wider font-mono">RN</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17221A] dark:text-[#E2EAE4]">
            Get Started
          </h1>
          <p className="text-sm text-[#5C6E62] dark:text-[#90A496] mt-1.5">
            Create an account to manage your business units
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5C6E62]/60 dark:text-[#90A496]/60">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="fullName"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm placeholder-[#5C6E62]/40 dark:placeholder-[#90A496]/40 focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                placeholder="Chief Reol"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5C6E62]/60 dark:text-[#90A496]/60">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm placeholder-[#5C6E62]/40 dark:placeholder-[#90A496]/40 focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                placeholder="chief@reolglobal.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5C6E62]/60 dark:text-[#90A496]/60">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                name="password"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm placeholder-[#5C6E62]/40 dark:placeholder-[#90A496]/40 focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                placeholder="Min. 8 characters"
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0F5132] hover:bg-[#0D442A] active:bg-[#0A3721] text-white font-medium text-sm transition-colors duration-200 border-b-4 border-[#09321F] disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl hover:shadow-[#0F5132]/10"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#E2EAE4] dark:border-[#1E2720] text-center">
          <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#0F5132] dark:text-[#38C186] hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}

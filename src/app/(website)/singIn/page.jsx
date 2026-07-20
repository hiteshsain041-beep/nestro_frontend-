"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      // Call the Next.js proxy route (/api/auth/login) which:
      // 1. Forwards to the Express backend
      // 2. Re-sets jwt + role cookies on the Vercel domain so middleware can read them
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",          // send + receive cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Login failed. Please try again.");
        return;
      }

      toast.success(data.message || "Login successful!");

      // Redirect based on role
      const role = data.data?.user?.role;
      if (role === "admin" || role === "superAdmin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh(); // force Next.js to re-read cookies & re-render layout
    } catch {
      toast.error("Unable to reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#ede9e3] p-8 shadow-[0_8px_40px_rgba(58,36,24,0.08)]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf0e8] text-2xl">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-[#1a1007]">Welcome Back</h1>
          <p className="mt-1 text-sm text-[#9a8a7a]">Sign in to your Nestro account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#3a2418] uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full border border-[#ede9e3] rounded-xl px-4 py-3 text-sm text-[#1a1007] outline-none focus:border-[#a46d43] focus:ring-2 focus:ring-[#a46d43]/10 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#3a2418] uppercase tracking-wide">
                Password
              </label>
              <Link href="/forget-Password" className="text-xs text-[#a46d43] hover:text-[#3a2418] transition">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full border border-[#ede9e3] rounded-xl px-4 py-3 pr-11 text-sm text-[#1a1007] outline-none focus:border-[#a46d43] focus:ring-2 focus:ring-[#a46d43]/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a8a7a] hover:text-[#3a2418] transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#3a2418] hover:bg-[#2a1a10] disabled:bg-[#c9b9a8] disabled:cursor-not-allowed text-white py-3.5 text-sm font-semibold transition"
          >
            {loading ? (
              <>
                <FiLoader size={15} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#9a8a7a]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#a46d43] hover:text-[#3a2418] transition">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

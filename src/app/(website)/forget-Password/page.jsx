"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/utils/helper";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) return toast.error("Email or Mobile Number is required");

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isMobile = /^[6-9]\d{9}$/.test(identifier);

    if (!isEmail && !isMobile)
      return toast.error("Enter a valid Email or 10-digit Mobile Number");

    try {
      setLoading(true);
      const payload = isEmail ? { email: identifier } : { mobile: identifier };
      const { data } = await client.post("user/forgot-password", payload);

      if (data.success) {
        toast.success(data.message);
        // Pass the identifier and type to the OTP page
        router.push(
          `/inter-otp?${isEmail ? `email=${encodeURIComponent(identifier)}` : `mobile=${encodeURIComponent(identifier)}`}&type=forgot-password`
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-5 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-3xl bg-white border border-[#ede9e3] p-8 shadow-[0_8px_40px_rgba(58,36,24,0.08)]">

          {/* Icon + heading */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf0e8]">
              <FiMail size={22} className="text-[#a46d43]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1007]">Forgot Password?</h1>
            <p className="mt-2 text-sm text-[#9a8a7a] leading-relaxed">
              Enter your registered email address or mobile number.
              We'll send you a one-time OTP to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-[#5a4a3a] uppercase tracking-wide mb-1.5">
                Email or Mobile Number
              </label>
              <input
                type="text"
                placeholder="rahul@email.com  or  9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-xl border border-[#ede9e3] bg-[#faf8f5] px-4 py-3.5 text-sm outline-none transition focus:border-[#a46d43] focus:ring-2 focus:ring-[#a46d43]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              className="w-full rounded-xl bg-[#3a2418] py-3.5 text-sm font-semibold text-white hover:bg-[#2a1a10] disabled:bg-[#c9b9a8] disabled:cursor-not-allowed transition"
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>

          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a46d43] hover:text-[#3a2418] transition"
            >
              <FiArrowLeft size={13} />
              Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

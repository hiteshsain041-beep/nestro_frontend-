"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { toast } from "sonner";
import { client } from "@/utils/helper";

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // email and otp are both passed from the OTP page in the URL
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { password, confirmPassword } = formData;

  useEffect(() => {
    // Both email and otp are required — redirect if either is missing
    if (!email || !otp) {
      toast.error("Invalid or expired reset link");
      router.replace("/forget-Password");
    }
  }, [email, otp, router]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!password || !confirmPassword) return toast.error("All fields are required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    try {
      setLoading(true);

      // Backend resetPassword expects: { email, otp, password }
      const { data } = await client.post("/user/reset-password", {
        email,
        otp,
        password,
      });

      if (data.success) {
        toast.success(data.message || "Password reset successfully!");
        setFormData({ password: "", confirmPassword: "" });
        router.replace("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-5">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#ede9e3] p-8 shadow-[0_8px_40px_rgba(58,36,24,0.08)]">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf0e8]">
            <FiLock size={22} className="text-[#a46d43]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1007]">Create New Password</h1>
          <p className="mt-2 text-sm text-[#9a8a7a]">
            Choose a strong password for{" "}
            <span className="font-medium text-[#3a2418]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-[#5a4a3a] uppercase tracking-wide mb-1.5">
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a8a7a]" size={15} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ede9e3] bg-[#faf8f5] py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#a46d43] focus:ring-2 focus:ring-[#a46d43]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a7a] hover:text-[#3a2418] transition"
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-[#5a4a3a] uppercase tracking-wide mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a8a7a]" size={15} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#ede9e3] bg-[#faf8f5] py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#a46d43] focus:ring-2 focus:ring-[#a46d43]/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a7a] hover:text-[#3a2418] transition"
              >
                {showConfirmPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {/* Password match indicator */}
          {confirmPassword && (
            <p className={`text-xs font-medium ${password === confirmPassword ? "text-green-600" : "text-red-500"}`}>
              {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full rounded-xl bg-[#3a2418] py-3.5 text-sm font-semibold text-white hover:bg-[#2a1a10] disabled:bg-[#c9b9a8] disabled:cursor-not-allowed transition mt-2"
          >
            {loading ? "Updating…" : "Reset Password"}
          </button>
        </form>

      </div>
    </div>
  );
}

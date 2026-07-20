"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/utils/helper";

export default function OTPVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const type = searchParams.get("type");
  const isForgotPassword = type === "forgot-password";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      router.replace("/register");
      return;
    }
    inputRefs.current[0]?.focus();
  }, [email, router]);

  function handleChange(value, index) {
    if (!/^\d?$/.test(value)) return;
    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const arr = pasted.split("");
    setOtp([...arr, ...Array(6 - arr.length).fill("")]);
    inputRefs.current[arr.length - 1]?.focus();
  }

  async function verifyOTP(e) {
    e.preventDefault();
    const finalOTP = otp.join("");
    if (finalOTP.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    // ── Forgot-password flow ────────────────────────────────────────────
    // Do NOT call verify-otp here — that endpoint clears the OTP after
    // marking the user verified, which breaks resetPassword later.
    // Instead, just pass the OTP forward to the new-password page so
    // resetPassword can validate + consume it in a single request.
    if (isForgotPassword) {
      router.push(`/new-password?email=${encodeURIComponent(email)}&otp=${finalOTP}`);
      return;
    }

    // ── Registration verification flow ─────────────────────────────────
    try {
      setLoading(true);
      const { data } = await client.post("/user/verify-otp", { email, otp: finalOTP });
      toast.success(data.message);
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    try {
      setLoading(true);
      const { data } = await client.post("/user/resend-otp", { email });
      toast.success(data.message);
      setOtp(Array(6).fill(""));
      setError("");
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#ede9e3] p-8 shadow-[0_8px_40px_rgba(58,36,24,0.08)]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf0e8] text-2xl">
            📬
          </div>
          <h2 className="text-2xl font-bold text-[#1a1007]">Verify OTP</h2>
          <p className="mt-2 text-sm text-[#9a8a7a]">
            Enter the 6-digit code sent to
          </p>
          <p className="text-sm font-semibold text-[#3a2418] mt-0.5">{email}</p>
        </div>

        <form onSubmit={verifyOTP} className="space-y-6">

          {/* OTP boxes */}
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`h-13 w-13 flex-1 rounded-xl border text-center text-xl font-bold outline-none transition
                  ${digit ? "border-[#a46d43] bg-[#faf0e8] text-[#3a2418]" : "border-[#ede9e3] bg-[#faf8f5] text-[#1a1007]"}
                  focus:border-[#a46d43] focus:ring-2 focus:ring-[#a46d43]/10`}
                style={{ height: "3.25rem" }}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-xs text-red-500 -mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full rounded-xl bg-[#3a2418] py-3.5 text-sm font-semibold text-white hover:bg-[#2a1a10] disabled:bg-[#c9b9a8] disabled:cursor-not-allowed transition"
          >
            {loading ? "Verifying…" : isForgotPassword ? "Continue" : "Verify OTP"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={resendOTP}
            className="text-sm font-medium text-[#a46d43] hover:text-[#3a2418] hover:underline transition disabled:opacity-50"
          >
            Didn't receive it? Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

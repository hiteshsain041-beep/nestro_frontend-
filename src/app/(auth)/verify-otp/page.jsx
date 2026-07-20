"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { client } from "@/utils/helper";

export default function OTPVerify() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const type = searchParams.get("type");
  const isForgotPassword = type === "forgot-password";

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      router.push("/register");
      return;
    }

    inputRefs.current[0]?.focus();
  }, [email, router]);

  function handleChange(value, index) {
    if (!/^[0-9]?$/.test(value)) return;

    const copy = [...otp];

    copy[index] = value;

    setOtp(copy);

    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();

    const value = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(value)) return;

    const arr = value.split("");

    setOtp([...arr, ...new Array(6 - arr.length).fill("")]);

    inputRefs.current[value.length - 1]?.focus();
  }

  async function verifyOTP() {
    const finalOTP = otp.join("");

    if (finalOTP.length !== 6) {
      setError("Please enter 6 digit OTP");

      return;
    }

    try {
      setLoading(true);

      const response = await client.post(
        isForgotPassword ? "user/reset-password" : "user/verify-otp",
        isForgotPassword
          ? {
              email,
              otp: finalOTP,
              password,
            }
          : {
              email,
              otp: finalOTP,
            },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        router.push("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    try {
      setLoading(true);
      const response = await client.post("user/resend-otp", {
        email,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Unable to resend OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP");
    } finally {
      setLoading(false);
      setOtp(new Array(6).fill(""));
      setError("");
      inputRefs.current[0]?.focus();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f1] px-5">
      <div className="bg-white shadow rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold">Verify OTP</h1>

        <p className="text-gray-500 mt-3">Enter 6 digit OTP</p>

        <div onPaste={handlePaste} className="flex gap-3 justify-center mt-10">
          {otp.map((item, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={item}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
                                w-12 h-14
                                text-xl
                                text-center
                                border
                                rounded-xl
                                outline-none
                                focus:ring-2
                                focus:ring-[#93633e]
                                "
            />
          ))}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button
          onClick={verifyOTP}
          disabled={loading || otp.join("").length !== 6}
          className="
                    w-full
                    mt-8
                    py-4
                    rounded-xl
                    bg-[#93633e]
                    text-white
                    disabled:opacity-50
                    "
        >
          {loading
            ? isForgotPassword
              ? "Resetting..."
              : "Verifying..."
            : isForgotPassword
              ? "Reset Password"
              : "Verify OTP"}
        </button>

        <button
          onClick={resendOTP}
          className="
                    mt-6
                    text-[#93633e]
                    "
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

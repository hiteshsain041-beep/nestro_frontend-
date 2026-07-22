"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { lsToCart } from "@/redux/features/cartSlice";
import { client } from "@/utils/helper";

export default function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── Cart sync helper — called after any successful login ──────────────────
  async function syncCart() {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
      const syncResponse = await client.post("cart/sync-cart", {
        localCart: JSON.stringify(localCart.items),
      });
      if (syncResponse.data.success) {
        const serverItems = syncResponse.data.cart.items ?? [];
        let final_total = 0;
        let original_total = 0;
        const hydratedItems = serverItems.map(({ productId: p, qty }) => {
          final_total += p.salePrice * qty;
          original_total += p.originalPrice * qty;
          return {
            id: p._id,
            name: p.name,
            thumbnail: p.thumbnail?.trim() || null,
            salePrice: p.salePrice,
            originalPrice: p.originalPrice,
            discount: p.discount,
            qty,
          };
        });
        localStorage.setItem(
          "cart",
          JSON.stringify({ final_total, original_total, items: hydratedItems })
        );
        dispatch(lsToCart());
      }
    } catch {
      // sync failed — local cart remains intact, non-fatal
    }
  }

  // ── Email / password login ─────────────────────────────────────────────────
  async function loginHandler(e) {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      // Call the Next.js proxy route — NOT the Express backend directly.
      // The proxy sets jwt + role cookies on the frontend (Vercel) domain.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Login failed. Please try again.");
        return;
      }

      toast.success(data.message || "Login successful!");
      await syncCart();
      setFormData({ email: "", password: "" });

      // window.location.href forces a full browser navigation.
      // This makes Next.js re-run all Server Components fresh,
      // so WebsiteLayout calls getProfile() with the new jwt cookie
      // and Header receives the real user prop (not null).
      // router.push() is NOT enough — it reuses the server-component cache.
      const role = data.data?.user?.role;
      if (role === "admin" || role === "superAdmin") {
        window.location.href = "/";
      } else {
        window.location.href = "/";
      }
    } catch {
      toast.error("Unable to reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // ── Google login ───────────────────────────────────────────────────────────
  async function googleLogin() {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Call the Next.js proxy route — NOT the Express backend directly.
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Google login failed. Please try again.");
        return;
      }

      toast.success("Login Successful");
      await syncCart();

      // Full reload — same reason as above
      window.location.href = "/";
    } catch (error) {
      toast.error(error.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col justify-center">

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Sign in to your Nestro account to continue.
        </p>
      </div>

      <form onSubmit={loginHandler} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Email Address
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            type="email"
            placeholder="rahul@email.com"
            required
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#93633e] focus:ring-2 focus:ring-[#93633e]/10 transition"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Password
            </label>
            <Link href="/forget-Password" className="text-xs text-[#93633e] font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#93633e] focus:ring-2 focus:ring-[#93633e]/10 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#93633e] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#7b5030] disabled:opacity-50 transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6 text-gray-400 text-xs">
        <div className="h-px bg-gray-200 flex-1" />
        or continue with
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <div className="space-y-3">
        <button
          onClick={googleLogin}
          type="button"
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-sm disabled:opacity-50 transition"
        >
          <FcGoogle size={20} />
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
        >
          <FaApple size={20} />
          Continue with Apple
        </button>
      </div>

      <p className="text-center mt-7 text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-[#93633e] font-semibold hover:underline"
        >
          Create account
        </button>
      </p>
    </div>
  );
}

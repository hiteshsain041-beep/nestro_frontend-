"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterInline() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubscribe(e) {
        e.preventDefault();
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        setLoading(true);
        // Simulate async subscription — replace with real API call when ready
        setTimeout(() => {
            toast.success("You're subscribed! Welcome to the Nestro family.");
            setEmail("");
            setLoading(false);
        }, 800);
    }

    return (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-xl border border-[#5a3928] bg-[#3a2418] px-4 py-3 text-sm text-white placeholder:text-[#9a8a7a] outline-none focus:border-[#d9b48b] transition"
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="flex-shrink-0 rounded-xl bg-[#a46d43] hover:bg-[#b87d53] disabled:bg-[#6a4a2a] text-white px-6 py-3 text-sm font-semibold transition"
            >
                {loading ? "Subscribing…" : "Subscribe"}
            </button>
        </form>
    );
}

"use client";

import { useState } from "react";
import { FiStar, FiUser, FiThumbsUp } from "react-icons/fi";
import { toast } from "sonner";

const DUMMY_REVIEWS = [
    { id: 1, name: "Rahul Sharma", rating: 5, date: "Jun 2026", helpful: 14, review: "Absolutely stunning piece! The quality is outstanding and it looks even better in person. Highly recommend." },
    { id: 2, name: "Priya Nair", rating: 4, date: "May 2026", helpful: 8, review: "Very happy with my purchase. Delivery was quick and assembly was straightforward." },
    { id: 3, name: "Arjun Mehta", rating: 5, date: "May 2026", helpful: 21, review: "Premium build quality, excellent packaging. The finish is exactly as described — smooth and durable." },
];

function Stars({ rating, interactive = false, onRate, hovered = 0 }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = interactive ? (hovered || rating) > i : rating > i;
                return (
                    <FiStar
                        key={i}
                        size={interactive ? 20 : 13}
                        className={`transition-colors ${filled ? "text-amber-400" : "text-gray-200"} ${interactive ? "cursor-pointer" : ""}`}
                        style={{ fill: filled ? "#fbbf24" : "transparent" }}
                        onMouseEnter={() => interactive && onRate?.(-1 - i)}
                        onMouseLeave={() => interactive && onRate?.(-1)}
                        onClick={() => interactive && onRate?.(i + 1)}
                    />
                );
            })}
        </div>
    );
}

function RatingBar({ label, pct }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="w-8 text-right text-gray-500 flex-shrink-0">{label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400 transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 text-gray-400">{pct}%</span>
        </div>
    );
}

export default function ReviewSection({ productName = "this product" }) {
    const [reviews] = useState(DUMMY_REVIEWS);
    const [newRating, setNewRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [form, setForm] = useState({ name: "", review: "" });
    const [submitting, setSubmitting] = useState(false);

    const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

    function handleRate(val) {
        if (val < 0) setHovered(val === -1 ? 0 : Math.abs(val + 1) + 1);
        else { setNewRating(val); setHovered(0); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!newRating) { toast.error("Please select a rating"); return; }
        if (!form.name.trim()) { toast.error("Name is required"); return; }
        if (!form.review.trim()) { toast.error("Review is required"); return; }
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 700));
        toast.success("Review submitted! (Demo — not saved to DB)");
        setForm({ name: "", review: "" });
        setNewRating(0);
        setSubmitting(false);
    }

    return (
        <section className="mt-14 sm:mt-20">
            <div className="mb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-1">Customer Feedback</p>
                <h2 className="text-xl sm:text-2xl font-light text-[#1a1007]">
                    Reviews &amp; <span className="text-[#a46d43]">Ratings</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Summary + Form */}
                <div className="lg:col-span-1 space-y-5">
                    <div className="bg-white border border-[#ede9e3] rounded-2xl p-6 text-center">
                        <div className="text-5xl font-black text-[#1a1007] mb-1">{avg}</div>
                        <Stars rating={Math.round(avg)} />
                        <p className="text-sm text-gray-400 mt-2">{reviews.length} reviews</p>
                        <div className="mt-5 space-y-2 text-left">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter((r) => r.rating === star).length;
                                return (
                                    <RatingBar key={star} label={`${star}★`} pct={Math.round((count / reviews.length) * 100)} />
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white border border-[#ede9e3] rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-[#1a1007] mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Your Rating *</label>
                                <Stars interactive rating={newRating} hovered={hovered} onRate={handleRate} />
                            </div>
                            <input
                                type="text"
                                placeholder="Your name *"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#a46d43] transition"
                            />
                            <textarea
                                placeholder={`Your thoughts on ${productName}…`}
                                rows={4}
                                value={form.review}
                                onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#a46d43] transition resize-none"
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-10 rounded-xl bg-[#3a2418] hover:bg-[#2a1a10] text-white text-sm font-semibold transition disabled:opacity-60"
                            >
                                {submitting ? "Submitting…" : "Submit Review"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Review list */}
                <div className="lg:col-span-2 space-y-4">
                    {reviews.map((r) => (
                        <div key={r.id} className="bg-white border border-[#ede9e3] rounded-2xl p-5">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#faf0e8] flex items-center justify-center flex-shrink-0">
                                        <FiUser size={15} className="text-[#a46d43]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1a1007]">{r.name}</p>
                                        <p className="text-[11px] text-gray-400">{r.date}</p>
                                    </div>
                                </div>
                                <Stars rating={r.rating} />
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{r.review}</p>
                            <button className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#a46d43] transition">
                                <FiThumbsUp size={11} /> Helpful ({r.helpful})
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// ── Static fallback banners — shown when no dynamic data is available ──────────
// Replace these with real Cloudinary URLs once a banner CMS is added to the backend.
const FALLBACK_BANNERS = [
    {
        id: "f1",
        title: "Where Comfort\nMeets Craft",
        subtitle: "Summer Collection 2026",
        description: "Scandinavian-inspired furniture crafted from responsibly sourced teak and sheesham — designed to endure seasons.",
        cta: { label: "Shop Collection", href: "/store" },
        ctaSecondary: { label: "Explore Rooms", href: "/store" },
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80",
        overlay: "from-[#1a0d05]/80 via-[#1a0d05]/40 to-transparent",
        badge: "New Arrivals",
    },
    {
        id: "f2",
        title: "Reimagine\nYour Bedroom",
        subtitle: "Bedroom Essentials",
        description: "Premium beds, wardrobes and storage crafted for deep, restorative sleep — and mornings that feel like a retreat.",
        cta: { label: "Shop Bedroom", href: "/store?room=bedroom" },
        ctaSecondary: { label: "View Lookbook", href: "/about" },
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=80",
        overlay: "from-[#0d1a1a]/80 via-[#0d1a1a]/40 to-transparent",
        badge: "Best Sellers",
    },
    {
        id: "f3",
        title: "Gather Around\nPerfect Dining",
        subtitle: "Dining Collection",
        description: "Solid wood dining tables and handcrafted chairs that turn every meal into a memory worth keeping.",
        cta: { label: "Shop Dining", href: "/store?room=dining" },
        ctaSecondary: { label: "See All Rooms", href: "/store" },
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1400&q=80",
        overlay: "from-[#1a0d05]/80 via-[#1a0d05]/40 to-transparent",
        badge: "Up to 30% Off",
    },
];

// ── Skeleton loader ────────────────────────────────────────────────────────────
function HeroSkeleton() {
    return (
        <section className="w-full bg-[#faf8f5] px-4 md:px-6 py-4 md:py-6">
            <div className="max-w-7xl mx-auto">
                <div className="w-full rounded-[24px] overflow-hidden bg-[#e8e2da] animate-pulse"
                    style={{ minHeight: "340px" }} />
            </div>
        </section>
    );
}

// ── Main HeroSlider component ──────────────────────────────────────────────────
/**
 * HeroSlider
 *
 * Props:
 *   banners — array of banner objects (optional). Falls back to FALLBACK_BANNERS.
 *             Each banner: { id, title, subtitle, description, cta, ctaSecondary,
 *                            image, overlay, badge }
 */
export default function HeroSlider({ banners }) {
    const slides = (banners?.length > 0 ? banners : FALLBACK_BANNERS);

    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef(null);
    const total = slides.length;

    // Avoid hydration mismatch — render only after mount
    useEffect(() => { setMounted(true); }, []);

    const goTo = useCallback((index) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent((index + total) % total);
        setTimeout(() => setIsAnimating(false), 600);
    }, [isAnimating, total]);

    const next = useCallback(() => goTo(current + 1), [goTo, current]);
    const prev = useCallback(() => goTo(current - 1), [goTo, current]);

    // Auto-play
    useEffect(() => {
        if (total <= 1 || isPaused) return;
        timerRef.current = setInterval(next, 5000);
        return () => clearInterval(timerRef.current);
    }, [next, isPaused, total]);

    if (!mounted) return <HeroSkeleton />;

    const slide = slides[current];

    return (
        <section
            className="w-full bg-[#faf8f5] px-4 md:px-6 py-4 md:py-6"
            aria-label="Hero banner"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto">
                <div className="relative w-full rounded-[24px] overflow-hidden"
                    style={{ minHeight: "clamp(320px, 52vw, 560px)" }}>

                    {/* ── Slides ─────────────────────────────────────────────────────── */}
                    {slides.map((s, idx) => (
                        <div
                            key={s.id}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                            aria-hidden={idx !== current}
                        >
                            {/* Background image */}
                            <Image
                                src={s.image}
                                alt={s.title?.replace("\n", " ") ?? "Banner"}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1280px"
                                priority={idx === 0}
                                loading={idx === 0 ? "eager" : "lazy"}
                                className="object-cover"
                            />

                            {/* Gradient overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay ?? "from-[#1a0d05]/75 via-[#1a0d05]/35 to-transparent"}`} />

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="px-8 sm:px-12 lg:px-16 max-w-2xl">

                                    {/* Badge */}
                                    {s.badge && (
                                        <span className="inline-block mb-4 px-3 py-1 rounded-full bg-[#a46d43]/90 text-white text-[11px] font-bold uppercase tracking-widest">
                                            {s.badge}
                                        </span>
                                    )}

                                    {/* Subtitle */}
                                    {s.subtitle && (
                                        <p className="text-[#d9b48b] uppercase tracking-[0.2em] text-[11px] sm:text-[12px] font-semibold mb-3">
                                            {s.subtitle}
                                        </p>
                                    )}

                                    {/* Title */}
                                    <h1 className="text-white font-light leading-[1.08] text-[36px] sm:text-[50px] lg:text-[58px]">
                                        {s.title?.split("\n").map((line, i) => (
                                            <span key={i} className="block">{line}</span>
                                        ))}
                                    </h1>

                                    {/* Description */}
                                    {s.description && (
                                        <p className="mt-4 text-[#b0a098] text-[14px] sm:text-[15px] leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none">
                                            {s.description}
                                        </p>
                                    )}

                                    {/* CTAs */}
                                    <div className="flex flex-wrap gap-3 mt-7">
                                        {s.cta && (
                                            <Link
                                                href={s.cta.href}
                                                className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#a46d43] hover:bg-[#b87d53] active:scale-95 text-white text-[14px] font-semibold transition-all duration-200 shadow-lg"
                                            >
                                                {s.cta.label}
                                                <span aria-hidden="true">→</span>
                                            </Link>
                                        )}
                                        {s.ctaSecondary && (
                                            <Link
                                                href={s.ctaSecondary.href}
                                                className="inline-flex items-center h-11 px-7 rounded-xl border border-[#5a3a28] text-[#d9cbbf] text-[14px] font-medium hover:bg-[#3a2418] hover:border-[#3a2418] hover:text-white active:scale-95 transition-all duration-200"
                                            >
                                                {s.ctaSecondary.label}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* ── Navigation arrows (only when > 1 slide) ──────────────────── */}
                    {total > 1 && (
                        <>
                            <button
                                onClick={prev}
                                aria-label="Previous slide"
                                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20
                           w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center
                           rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-sm
                           text-white transition-all duration-200 hover:scale-110 active:scale-95"
                            >
                                <FiChevronLeft size={20} />
                            </button>
                            <button
                                onClick={next}
                                aria-label="Next slide"
                                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20
                           w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center
                           rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-sm
                           text-white transition-all duration-200 hover:scale-110 active:scale-95"
                            >
                                <FiChevronRight size={20} />
                            </button>
                        </>
                    )}

                    {/* ── Pagination dots ───────────────────────────────────────────── */}
                    {total > 1 && (
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
                            role="tablist" aria-label="Slide indicators">
                            {slides.map((s, idx) => (
                                <button
                                    key={s.id}
                                    onClick={() => goTo(idx)}
                                    role="tab"
                                    aria-selected={idx === current}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className={`transition-all duration-300 rounded-full
                    ${idx === current
                                            ? "w-6 h-2.5 bg-[#a46d43]"
                                            : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Slide counter badge ────────────────────────────────────────── */}
                    {total > 1 && (
                        <div className="absolute top-4 right-5 z-20 text-[11px] font-semibold text-white/70 tabular-nums">
                            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}

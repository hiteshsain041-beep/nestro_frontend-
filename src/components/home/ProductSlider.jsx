"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";

/**
 * ProductSlider — shared slider for BestSellerSection, NewArrivalSection,
 * and Slider (Featured Products).
 *
 * Breakpoints are UNCHANGED:
 *   0   → 1 slide   (mobile)
 *   768 → 2 slides  (tablet)
 *   1024→ 2 slides  (desktop)
 *
 * Navigation is now positioned BELOW the slide strip:
 *   ← circle   [View All Products →]   → circle
 */
export default function ProductSlider({
    products = [],
    viewAllHref = "/store",
    viewAllText = "View All Products",
    aboveFold = false,
}) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!products.length) return null;

    return (
        <div>
            {/* ── Slide strip ────────────────────────────────────────── */}
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                loop={products.length >= 2}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    if (
                        swiper.params.navigation &&
                        typeof swiper.params.navigation !== "boolean"
                    ) {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }
                }}
                /* ── Responsive breakpoints — UNCHANGED ── */
                breakpoints={{
                    0: { slidesPerView: 1, spaceBetween: 16 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 2, spaceBetween: 24 },
                }}
                style={{ alignItems: "stretch" }}
            >
                {products.map((product, idx) => (
                    <SwiperSlide key={String(product._id)} className="h-auto">
                        <div className="h-full">
                            <ProductCard
                                product={product}
                                priority={aboveFold && idx < 2}
                                showWishlist
                                showQuickView
                                showAddToCart
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ── Bottom navigation bar ─────────────────────────────────
                Layout: [← circle]  [View All Products →]  [→ circle]  */}
            <div className="flex items-center justify-center gap-3 mt-7">
                <button
                    ref={prevRef}
                    aria-label="Previous"
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full
                               border-2 border-[#c9a882] text-[#a46d43] bg-white
                               hover:bg-[#a46d43] hover:text-white hover:border-[#a46d43]
                               transition-all duration-200 shadow-sm"
                >
                    <FiChevronLeft size={18} />
                </button>

                <Link
                    href={viewAllHref}
                    className="px-6 py-2.5 rounded-full border-2 border-[#c9a882]
                               text-[13px] font-semibold text-[#3a2418] bg-white
                               hover:bg-[#3a2418] hover:text-white hover:border-[#3a2418]
                               transition-all duration-200 shadow-sm whitespace-nowrap"
                >
                    {viewAllText} →
                </Link>

                <button
                    ref={nextRef}
                    aria-label="Next"
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full
                               border-2 border-[#c9a882] text-[#a46d43] bg-white
                               hover:bg-[#a46d43] hover:text-white hover:border-[#a46d43]
                               transition-all duration-200 shadow-sm"
                >
                    <FiChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}

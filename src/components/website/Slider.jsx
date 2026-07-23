"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Slider({ products = [] }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!products.length) return null;

    return (
        <section className="bg-[#faf8f5] py-10 sm:py-14 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">

                {/* ── Section header ──────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a46d43] mb-0.5">
                            Curated Picks
                        </p>
                        <h2 className="text-xl sm:text-2xl font-light text-[#1a1007]">
                            Featured <span className="text-[#a46d43]">Products</span>
                        </h2>
                    </div>

                    {/* Desktop nav arrows + View All */}
                    <div className="flex items-center gap-3">
                        {/* Prev arrow */}
                        <button
                            ref={prevRef}
                            aria-label="Previous products"
                            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-[#c9a882]
                                       text-[#a46d43] bg-white hover:bg-[#a46d43] hover:text-white hover:border-[#a46d43]
                                       transition-all duration-200 shadow-sm flex-shrink-0"
                        >
                            <FiChevronLeft size={17} />
                        </button>

                        {/* Next arrow */}
                        <button
                            ref={nextRef}
                            aria-label="Next products"
                            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-[#c9a882]
                                       text-[#a46d43] bg-white hover:bg-[#a46d43] hover:text-white hover:border-[#a46d43]
                                       transition-all duration-200 shadow-sm flex-shrink-0"
                        >
                            <FiChevronRight size={17} />
                        </button>

                        <Link
                            href="/store"
                            className="text-[12px] font-semibold text-[#a46d43] hover:text-[#3a2418] transition-colors hidden sm:block ml-1"
                        >
                            View All →
                        </Link>
                    </div>
                </div>

                {/* ── Swiper ──────────────────────────────────────────────── */}
                {/* Wrapper adds horizontal overflow clip without clipping card shadows */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        slidesPerView={1}
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
                        // Re-init navigation once DOM refs are ready
                        onBeforeInit={(swiper) => {
                            if (
                                swiper.params.navigation &&
                                typeof swiper.params.navigation !== "boolean"
                            ) {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }
                        }}
                        breakpoints={{
                            // Mobile  (<640 px) — 1 card
                            0: { slidesPerView: 1, spaceBetween: 16 },
                            // Tablet  (≥640 px) — 2 cards
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            // Desktop (≥1024 px) — 2 cards
                            1024: { slidesPerView: 2, spaceBetween: 24 },
                        }}
                        // Equal-height slides
                        style={{ alignItems: "stretch" }}
                        className="!overflow-visible"
                    >
                        {products.map((product, idx) => (
                            <SwiperSlide
                                key={product._id}
                                className="h-auto"   /* let the slide stretch to fill Swiper height */
                            >
                                <div className="h-full">
                                    <ProductCard product={product} priority={idx < 2} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile arrows — shown below the slide strip on small screens */}
                    <div className="flex items-center justify-center gap-4 mt-5 sm:hidden">
                        <button
                            ref={prevRef}
                            aria-label="Previous products"
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#c9a882]
                                       text-[#a46d43] bg-white hover:bg-[#a46d43] hover:text-white
                                       transition-all duration-200 shadow-sm"
                        >
                            <FiChevronLeft size={17} />
                        </button>

                        <Link
                            href="/store"
                            className="text-[12px] font-semibold text-[#a46d43] hover:text-[#3a2418] transition-colors"
                        >
                            View All Products →
                        </Link>

                        <button
                            ref={nextRef}
                            aria-label="Next products"
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#c9a882]
                                       text-[#a46d43] bg-white hover:bg-[#a46d43] hover:text-white
                                       transition-all duration-200 shadow-sm"
                        >
                            <FiChevronRight size={17} />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}

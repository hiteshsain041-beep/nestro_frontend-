"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";

/**
 * ProductSlider — shared client-side Swiper used by BestSellerSection
 * and NewArrivalSection.
 *
 * Props:
 *   products    — filtered product array
 *   viewAllHref — href for "View All" link
 *   viewAllText — label for the "View All" link
 *   aboveFold   — pass priority=true to first 2 images when above the fold
 */
export default function ProductSlider({
    products = [],
    viewAllHref = "/store",
    viewAllText = "View All",
    aboveFold = false,
}) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!products.length) return null;

    return (
        <div>
            {/* Controls bar — arrows + View All */}
            <div className="flex items-center justify-end gap-2 mb-5 sm:mb-6">
                <button
                    ref={prevRef}
                    aria-label="Previous products"
                    className="w-9 h-9 flex items-center justify-center rounded-full
                               border border-[#c9a882] text-[#a46d43] bg-white
                               hover:bg-[#a46d43] hover:text-white hover:border-[#a46d43]
                               transition-all duration-200 shadow-sm flex-shrink-0"
                >
                    <FiChevronLeft size={17} />
                </button>

                <button
                    ref={nextRef}
                    aria-label="Next products"
                    className="w-9 h-9 flex items-center justify-center rounded-full
                               border border-[#c9a882] text-[#a46d43] bg-white
                               hover:bg-[#a46d43] hover:text-white hover:border-[#a46d43]
                               transition-all duration-200 shadow-sm flex-shrink-0"
                >
                    <FiChevronRight size={17} />
                </button>

                <Link
                    href={viewAllHref}
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold
                               text-[#a46d43] hover:text-[#3a2418] dark:hover:text-[#d9b48b]
                               transition-colors ml-2"
                >
                    {viewAllText} <FiArrowRight size={14} />
                </Link>
            </div>

            {/* Swiper */}
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

            {/* Mobile "View All" */}
            <div className="mt-6 text-center sm:hidden">
                <Link
                    href={viewAllHref}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a46d43]"
                >
                    {viewAllText} <FiArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Slider({ products = [] }) {
    if (!products.length) return null;

    return (
        <section className="bg-[#faf8f5] py-10 sm:py-14 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Section header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a46d43] mb-0.5">
                            Curated Picks
                        </p>
                        <h2 className="text-xl sm:text-2xl font-light text-[#1a1007]">
                            Featured <span className="text-[#a46d43]">Products</span>
                        </h2>
                    </div>
                    <Link
                        href="/store"
                        className="text-[12px] font-semibold text-[#a46d43] hover:text-[#3a2418] transition-colors hidden sm:block"
                    >
                        View All →
                    </Link>
                </div>

                <Swiper
                    slidesPerView={1}
                    spaceBetween={16}
                    loop={products.length >= 4}
                    autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    breakpoints={{
                        480: { slidesPerView: 1, spaceBetween: 16 },
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                        1280: { slidesPerView: 4, spaceBetween: 28 },
                    }}
                    modules={[Pagination, Autoplay]}
                    className="pb-10"
                >
                    {products.map((product, idx) => (
                        <SwiperSlide key={product._id}>
                            {/* Only the first 4 slots are above the fold — pass priority through */}
                            <ProductCard product={product} priority={idx < 4} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Mobile "View All" */}
                <div className="mt-2 text-center sm:hidden">
                    <Link
                        href="/store"
                        className="text-[12px] font-semibold text-[#a46d43] hover:text-[#3a2418] transition-colors"
                    >
                        View All Products →
                    </Link>
                </div>

            </div>
        </section>
    );
}

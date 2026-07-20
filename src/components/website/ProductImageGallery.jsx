"use client";

import { useState } from "react";
import Image from "next/image";

// Fallback shown when an image URL is empty or broken
const PLACEHOLDER = "/placeholder-product.png";

export default function ProductImageGallery({ images = [], name = "Product" }) {
    const validImages = images.filter(Boolean);
    const [activeIndex, setActiveIndex] = useState(0);

    const activeSrc = validImages[activeIndex] || null;

    return (
        <div className="flex flex-col gap-3">

            {/* ── Main image ──────────────────────────────────────────── */}
            <div className="relative w-full rounded-2xl bg-[#f5f3f0] overflow-hidden"
                style={{ paddingBottom: "75%" }}>
                {activeSrc ? (
                    <Image
                        key={activeSrc}
                        src={activeSrc}
                        alt={name}
                        fill
                        priority
                        loading="eager"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        className="object-contain p-4 sm:p-8 transition-opacity duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-7xl text-gray-200">
                        🛋️
                    </div>
                )}
            </div>

            {/* ── Thumbnail strip — only shown when there are 2+ images ── */}
            {validImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {validImages.map((src, idx) => (
                        <button
                            key={src + idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${idx === activeIndex
                                ? "border-[#a46d43] shadow-md scale-105"
                                : "border-gray-200 hover:border-[#c9a882] hover:scale-105"
                                }`}
                            aria-label={`View image ${idx + 1}`}
                        >
                            <Image
                                src={src}
                                alt={`${name} thumbnail ${idx + 1}`}
                                fill
                                sizes="80px"
                                loading="lazy"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

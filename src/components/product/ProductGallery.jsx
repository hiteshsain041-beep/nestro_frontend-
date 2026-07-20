"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { FiZoomIn } from "react-icons/fi";

export default function ProductGallery({ images = [], name = "Product" }) {
    const valid = images.filter(Boolean);
    const [active, setActive] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const [pos, setPos] = useState({ x: 50, y: 50 });

    const src = valid[active] ?? null;

    const handleMouseMove = useCallback((e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
        });
    }, []);

    return (
        <div className="flex flex-col gap-3 select-none">

            {/* ── Main image ─────────────────────────────────────────────── */}
            <div
                className="relative w-full rounded-2xl bg-[#f5f3f0] overflow-hidden cursor-zoom-in"
                style={{ paddingBottom: "80%" }}
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                onMouseMove={handleMouseMove}
            >
                {src ? (
                    <>
                        <Image
                            key={src}
                            src={src}
                            alt={name}
                            fill
                            priority
                            sizes="(max-width:768px) 100vw, 50vw"
                            className={`object-contain p-6 sm:p-10 transition-transform duration-300 ${zoomed ? "scale-[1.45]" : "scale-100"
                                }`}
                            style={zoomed ? { transformOrigin: `${pos.x}% ${pos.y}%` } : {}}
                        />
                        {!zoomed && (
                            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-full pointer-events-none">
                                <FiZoomIn size={11} /> Hover to zoom
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">
                        <span className="text-7xl">🛋️</span>
                        <p className="text-sm font-medium">No image available</p>
                    </div>
                )}
            </div>

            {/* ── Thumbnail strip ─────────────────────────────────────────── */}
            {valid.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {valid.map((imgSrc, idx) => (
                        <button
                            key={imgSrc + idx}
                            onClick={() => setActive(idx)}
                            aria-label={`View image ${idx + 1}`}
                            className={`relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${idx === active
                                    ? "border-[#a46d43] shadow-md ring-2 ring-[#a46d43]/20"
                                    : "border-gray-200 hover:border-[#c9a882] hover:-translate-y-0.5"
                                }`}
                        >
                            <Image
                                src={imgSrc}
                                alt={`${name} ${idx + 1}`}
                                fill
                                sizes="72px"
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

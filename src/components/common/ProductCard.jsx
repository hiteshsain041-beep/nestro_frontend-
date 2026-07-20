"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeart, FiEye, FiShoppingCart, FiStar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import CartButton from "@/components/website/CartButton";

// ─── helpers ────────────────────────────────────────────────────────────────

function calcDiscount(original, sale) {
    if (!original || !sale || original <= sale) return 0;
    return Math.round(((original - sale) / original) * 100);
}

function Stars({ rating = 0, count }) {
    const filled = Math.round(rating);
    return (
        <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                        key={i}
                        size={11}
                        className={i < filled ? "text-[#a46d43]" : "text-gray-200"}
                        style={{ fill: i < filled ? "#a46d43" : "transparent" }}
                    />
                ))}
            </div>
            {count !== undefined && (
                <span className="text-[10px] text-gray-400">({count})</span>
            )}
        </div>
    );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

export function ProductCardSkeleton() {
    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-[#ede9e3] dark:border-zinc-800 shadow-sm overflow-hidden animate-pulse">
            <div className="h-[240px] bg-[#f5f2ed] dark:bg-zinc-800" />
            <div className="p-4 space-y-2.5">
                <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-zinc-700" />
                <div className="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-zinc-700" />
                <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-zinc-700" />
                    ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                    <div className="h-5 w-20 rounded bg-gray-200 dark:bg-zinc-700" />
                    <div className="h-8 w-24 rounded-xl bg-gray-200 dark:bg-zinc-700" />
                </div>
            </div>
        </div>
    );
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * ProductCard — reusable card for Best Sellers and New Arrivals.
 *
 * Props:
 *   product       — full product object from /api/product
 *   priority      — next/image priority (above-fold cards)
 *   showWishlist  — show wishlist heart icon (default true)
 *   showQuickView — show quick-view eye icon (default true)
 *   showAddToCart — show add-to-cart button (default true)
 */
export default function ProductCard({
    product,
    priority = false,
    showWishlist = true,
    showQuickView = true,
    showAddToCart = true,
}) {
    const router = useRouter();
    const [wished, setWished] = useState(false);

    const handleWishlist = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setWished((v) => !v);
        },
        []
    );

    const handleQuickView = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/store/${product?.slug}`);
        },
        [router, product?.slug]
    );

    if (!product) return null;

    const {
        slug,
        name,
        thumbnail,
        salePrice,
        originalPrice,
        categoryId,
        bestSeller,
        newArrival,
        stock,
        rating,
        reviewCount,
    } = product;

    const hasThumbnail = Boolean(thumbnail?.trim());
    const discount = calcDiscount(originalPrice, salePrice);
    const inStock = stock !== false; // stock is boolean in schema

    return (
        <div className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-[#ede9e3] dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-zinc-900/60">

            {/* ── Image wrapper ─────────────────────────────────────── */}
            <Link href={`/store/${slug}`} className="block relative h-[240px] bg-[#f5f2ed] dark:bg-zinc-800 overflow-hidden" tabIndex={-1} aria-hidden="true">

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    {bestSeller && (
                        <span className="rounded-full bg-[#788864] px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
                            Best Seller
                        </span>
                    )}
                    {newArrival && (
                        <span className="rounded-full bg-[#3b7abc] px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
                            New
                        </span>
                    )}
                    {!inStock && (
                        <span className="rounded-full bg-gray-400 px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
                            Out of Stock
                        </span>
                    )}
                </div>

                {discount > 0 && (
                    <span className="absolute top-3 right-3 z-10 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        -{discount}%
                    </span>
                )}

                {/* Product image */}
                {hasThumbnail ? (
                    <Image
                        src={thumbnail}
                        alt={name || "Product"}
                        fill
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                        priority={priority}
                        loading={priority ? "eager" : "lazy"}
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl text-gray-200 dark:text-zinc-700">
                        🛋️
                    </div>
                )}

                {/* Hover action overlay */}
                <div
                    className="absolute inset-0 flex items-center justify-center gap-2.5
                     bg-black/0 opacity-0 transition-all duration-300
                     group-hover:bg-black/5 group-hover:opacity-100"
                >
                    {showWishlist && (
                        <button
                            onClick={handleWishlist}
                            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md
                         transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a46d43]"
                        >
                            {wished ? (
                                <FaHeart className="text-red-500" size={13} />
                            ) : (
                                <FiHeart className="text-gray-500" size={13} />
                            )}
                        </button>
                    )}

                    {showQuickView && (
                        <button
                            onClick={handleQuickView}
                            aria-label="Quick view"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md
                         transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a46d43]"
                        >
                            <FiEye className="text-gray-500" size={13} />
                        </button>
                    )}
                </div>
            </Link>

            {/* ── Body ──────────────────────────────────────────────── */}
            <div className="p-4">
                {/* Category */}
                <p className="text-[11px] font-medium text-[#9a8a7a] uppercase tracking-wider mb-1 truncate">
                    {categoryId?.name ?? "Furniture"}
                </p>

                {/* Name */}
                <Link href={`/store/${slug}`} className="block group/name mb-1.5">
                    <h3 className="line-clamp-1 text-sm font-semibold text-[#1a1007] dark:text-white
                         group-hover/name:text-[#a46d43] transition-colors duration-200">
                        {name}
                    </h3>
                </Link>

                {/* Rating */}
                {rating !== undefined && (
                    <div className="mb-2.5">
                        <Stars rating={rating} count={reviewCount} />
                    </div>
                )}

                {/* Price + CTA */}
                <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex-shrink-0">
                        <span className="text-[17px] font-black text-[#1a1007] dark:text-white">
                            ₹{salePrice?.toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                            <span className="ml-1.5 text-xs text-gray-400 line-through">
                                ₹{originalPrice?.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>

                    {showAddToCart && inStock ? (
                        <CartButton
                            product={product}
                            title="Add"
                            className="!h-8 !px-3 !text-xs !rounded-xl flex-shrink-0"
                        />
                    ) : showAddToCart && !inStock ? (
                        <span className="text-xs text-gray-400 font-medium">Unavailable</span>
                    ) : null}
                </div>

                {/* View Details link */}
                <Link
                    href={`/store/${slug}`}
                    className="mt-2.5 block w-full text-center text-[11px] font-semibold text-[#a46d43]
                     hover:text-[#3a2418] transition-colors duration-200 py-1.5 rounded-xl
                     border border-transparent hover:border-[#c9a882] hover:bg-[#faf0e8]"
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
}

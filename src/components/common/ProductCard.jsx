"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeart, FiEye, FiPlus, FiStar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { client } from "@/utils/helper";

// ─── helpers ─────────────────────────────────────────────────────────────────

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

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function ProductCardSkeleton() {
    return (
        <div className="rounded-[20px] bg-white border border-[#ede9e3] shadow-sm overflow-hidden animate-pulse">
            <div className="h-[260px] bg-[#f5f2ed]" />
            <div className="p-4 space-y-2.5">
                <div className="h-2.5 w-16 rounded-full bg-gray-200" />
                <div className="h-3.5 w-3/4 rounded bg-gray-200" />
                <div className="flex items-center justify-between pt-1">
                    <div className="h-5 w-20 rounded bg-gray-200" />
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ProductCard({
    product,
    priority = false,
    showWishlist = true,
    showQuickView = true,
    showAddToCart = true,
}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [wished, setWished] = useState(false);
    const [adding, setAdding] = useState(false);

    const handleWishlist = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setWished((v) => !v);
    }, []);

    const handleQuickView = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/store/${product?.slug}`);
    }, [router, product?.slug]);

    const handleAddToCart = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product || adding) return;
        setAdding(true);
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            salePrice: product.salePrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            thumbnail: product.thumbnail?.trim() || null,
            qty: 1,
        }));
        try {
            await client.post("cart/add-to-cart", { productId: product._id, qty: 1 });
        } catch { /* guest user — Redux already updated */ }
        finally { setAdding(false); }
    }, [dispatch, product, adding]);

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
    const inStock = stock !== false;

    return (
        <div
            className="group relative flex flex-col rounded-[20px] bg-white border border-[#ede9e3]
                       shadow-sm overflow-hidden transition-all duration-300
                       hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(164,109,67,0.15)]"
        >
            {/* ── Image area ──────────────────────────────────────────── */}
            <Link
                href={`/store/${slug}`}
                className="relative block h-[260px] bg-[#f5f2ed] overflow-hidden flex-shrink-0"
                tabIndex={-1}
                aria-hidden="true"
            >
                {/* Left badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    {bestSeller && (
                        <span className="rounded-full bg-[#788864] px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide shadow-sm">
                            Best Seller
                        </span>
                    )}
                    {newArrival && (
                        <span className="rounded-full bg-[#3b7abc] px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide shadow-sm">
                            New
                        </span>
                    )}
                    {!inStock && (
                        <span className="rounded-full bg-gray-400 px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Discount badge — top right */}
                {discount > 0 && (
                    <span className="absolute top-3 right-3 z-10 rounded-full bg-red-500
                                     px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        -{discount}%
                    </span>
                )}

                {/* Product image */}
                {hasThumbnail ? (
                    <Image
                        src={thumbnail}
                        alt={name || "Product"}
                        fill
                        sizes="(max-width:640px) 90vw, (max-width:1024px) 50vw, 40vw"
                        priority={priority}
                        loading={priority ? "eager" : "lazy"}
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl text-gray-200">
                        🛋️
                    </div>
                )}

                {/* Hover action overlay — wishlist + quick view */}
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
                                       transition-transform hover:scale-110
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a46d43]"
                        >
                            {wished
                                ? <FaHeart className="text-red-500" size={13} />
                                : <FiHeart className="text-gray-500" size={13} />
                            }
                        </button>
                    )}
                    {showQuickView && (
                        <button
                            onClick={handleQuickView}
                            aria-label="Quick view"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md
                                       transition-transform hover:scale-110
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a46d43]"
                        >
                            <FiEye className="text-gray-500" size={13} />
                        </button>
                    )}
                </div>
            </Link>

            {/* ── Card body ───────────────────────────────────────────── */}
            <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4">
                {/* Category */}
                <p className="text-[10px] font-semibold text-[#a46d43] uppercase tracking-[0.18em] mb-1 truncate">
                    {categoryId?.name ?? "Furniture"}
                </p>

                {/* Product name */}
                <Link href={`/store/${slug}`} className="block mb-1">
                    <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug
                                   text-[#1a1007] group-hover:text-[#a46d43] transition-colors duration-200">
                        {name}
                    </h3>
                </Link>

                {/* Rating (when available) */}
                {rating !== undefined && (
                    <div className="mb-2">
                        <Stars rating={rating} count={reviewCount} />
                    </div>
                )}

                {/* Spacer pushes price row to bottom */}
                <div className="flex-1" />

                {/* Price row + Add to Cart */}
                <div className="flex items-center justify-between gap-2 mt-3">
                    <div className="min-w-0">
                        <span className="text-[18px] font-black text-[#1a1007] leading-none">
                            ₹{salePrice?.toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                            <span className="ml-2 text-xs text-gray-400 line-through whitespace-nowrap">
                                ₹{originalPrice?.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>

                    {showAddToCart && (
                        inStock ? (
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                aria-label="Add to cart"
                                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full
                                           bg-[#2d2d2d] text-white shadow-sm
                                           hover:bg-[#1a1007] hover:scale-110
                                           transition-all duration-200 disabled:opacity-50"
                            >
                                <FiPlus size={15} />
                            </button>
                        ) : (
                            <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">
                                Unavailable
                            </span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

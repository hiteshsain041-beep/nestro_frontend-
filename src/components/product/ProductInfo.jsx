"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { toast } from "sonner";
import {
    FiHeart, FiShare2, FiShoppingCart, FiZap, FiStar,
    FiTruck, FiShield, FiRefreshCw, FiAward, FiCheck,
    FiMinus, FiPlus,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

// ── Star rating ───────────────────────────────────────────────────────────────
function Stars({ rating = 4.5 }) {
    const full = Math.floor(rating);
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                        key={i}
                        size={14}
                        className={i < full ? "text-amber-400" : "text-gray-200"}
                        style={{ fill: i < full ? "#fbbf24" : "transparent" }}
                    />
                ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">(3 reviews)</span>
        </div>
    );
}

// ── Quantity selector ─────────────────────────────────────────────────────────
function QtySelector({ qty, setQty }) {
    return (
        <div className="inline-flex items-center rounded-xl border border-gray-200 overflow-hidden">
            <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <FiMinus size={13} />
            </button>
            <span className="w-11 h-10 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200">
                {qty}
            </span>
            <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
            >
                <FiPlus size={13} />
            </button>
        </div>
    );
}

const TRUST_BADGES = [
    { icon: <FiTruck size={14} />, label: "Free Delivery", sub: "On orders above ₹5,000" },
    { icon: <FiShield size={14} />, label: "Secure Payment", sub: "256-bit SSL encryption" },
    { icon: <FiRefreshCw size={14} />, label: "Easy Returns", sub: "30-day return policy" },
    { icon: <FiAward size={14} />, label: "Quality Assured", sub: "Premium craftsmanship" },
];

export default function ProductInfo({ product }) {
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const [wished, setWished] = useState(false);
    const [adding, setAdding] = useState(false);
    const [buying, setBuying] = useState(false);
    const [copied, setCopied] = useState(false);

    const inStock = product.stock !== false;
    const discount =
        product.originalPrice > product.salePrice
            ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
            : 0;

    // ── Add to cart ───────────────────────────────────────────────────────────
    const handleAddToCart = useCallback(async () => {
        if (!inStock) return;
        setAdding(true);
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            salePrice: product.salePrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            thumbnail: product.thumbnail?.trim() || null,
            qty,
        }));
        try {
            await client.post("cart/add-to-cart", { productId: product._id, qty });
            toast.success(`${product.name} added to cart`);
        } catch { /* guest — Redux already updated */ }
        finally { setAdding(false); }
    }, [dispatch, product, qty, inStock]);

    // ── Buy now ───────────────────────────────────────────────────────────────
    const handleBuyNow = useCallback(async () => {
        if (!inStock) return;
        setBuying(true);
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            salePrice: product.salePrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            thumbnail: product.thumbnail?.trim() || null,
            qty,
        }));
        try { await client.post("cart/add-to-cart", { productId: product._id, qty }); } catch { }
        window.location.href = "/checkout";
    }, [dispatch, product, qty, inStock]);

    // ── Share ─────────────────────────────────────────────────────────────────
    const handleShare = useCallback(async () => {
        const url = window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title: product.name, url }); } catch { }
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied!");
            setTimeout(() => setCopied(false), 2500);
        }
    }, [product.name]);

    return (
        <div className="flex flex-col gap-5">

            {/* Category + Room pill */}
            <div className="flex items-center gap-2 flex-wrap">
                {product.categoryId?.name && (
                    <Link
                        href={`/store?category=${product.categoryId.slug}`}
                        className="text-[11px] font-semibold uppercase tracking-wider text-[#a46d43] bg-[#faf0e8] px-3 py-1 rounded-full hover:bg-[#f5e0cc] transition"
                    >
                        {product.categoryId.name}
                    </Link>
                )}
                {product.roomId?.name && (
                    <span className="text-[11px] text-gray-400">· {product.roomId.name}</span>
                )}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1007] leading-tight">
                {product.name}
            </h1>

            {/* Rating */}
            <Stars rating={4.5} />

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-[#1a1007]">
                    ₹{product.salePrice?.toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                    <>
                        <span className="text-lg text-gray-400 line-through font-medium">
                            ₹{product.originalPrice?.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm font-bold text-white bg-red-500 px-2.5 py-1 rounded-full">
                            {discount}% OFF
                        </span>
                    </>
                )}
            </div>

            {/* Savings */}
            {discount > 0 && (
                <p className="text-sm text-emerald-600 font-medium -mt-2">
                    You save ₹{(product.originalPrice - product.salePrice).toLocaleString("en-IN")}
                </p>
            )}

            {/* Short description */}
            {product.shortDescription && (
                <p className="text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Stock */}
            <div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${inStock
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
                    {inStock ? "In Stock" : "Out of Stock"}
                </span>
            </div>

            {/* Quantity */}
            {inStock && (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Qty:</span>
                    <QtySelector qty={qty} setQty={setQty} />
                </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={!inStock || adding}
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-[#3a2418] hover:bg-[#2a1a10] text-white"
                >
                    {adding ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    ) : <FiShoppingCart size={16} />}
                    {inStock ? "Add to Cart" : "Out of Stock"}
                </button>

                {inStock && (
                    <button
                        onClick={handleBuyNow}
                        disabled={buying}
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#a46d43] hover:bg-[#8d5c35] text-white font-semibold text-sm transition disabled:opacity-60"
                    >
                        {buying ? (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : <FiZap size={16} />}
                        Buy Now
                    </button>
                )}
            </div>

            {/* Wishlist + Share */}
            <div className="flex gap-3">
                <button
                    onClick={() => { setWished((w) => !w); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${wished
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-200 text-gray-600 hover:border-[#a46d43] hover:text-[#a46d43]"
                        }`}
                >
                    {wished ? <FaHeart size={13} className="text-red-500" /> : <FiHeart size={13} />}
                    {wished ? "Wishlisted" : "Wishlist"}
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#a46d43] hover:text-[#a46d43] transition-all"
                >
                    {copied ? <FiCheck size={13} className="text-emerald-500" /> : <FiShare2 size={13} />}
                    {copied ? "Copied!" : "Share"}
                </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                {TRUST_BADGES.map((b) => (
                    <div key={b.label} className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#faf0e8] text-[#a46d43] flex-shrink-0">
                            {b.icon}
                        </div>
                        <div>
                            <p className="text-[12px] font-semibold text-gray-800">{b.label}</p>
                            <p className="text-[10px] text-gray-400 leading-snug">{b.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

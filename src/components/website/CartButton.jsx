'use client';

import { addToCart } from '@/redux/features/cartSlice';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

export default function CartButton({ product }) {
    const dispatch = useDispatch();

    async function cartHandler() {
        // ── Step 1: Update Redux + localStorage immediately (optimistic) ──────
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            salePrice: product.salePrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            thumbnail: product.thumbnail?.trim() || null,
            qty: 1,
        }));

        // ── Step 2: Sync to MongoDB via BFF proxy (same-domain) ──────────────
        // Using /api/cart/add (Next.js BFF) instead of calling Render directly.
        // The BFF reads the jwt cookie server-side and adds Authorization header,
        // fixing the cross-domain cookie issue on mobile browsers.
        // 401 = guest user → ignored, Redux/localStorage cart is still correct.
        try {
            await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    productId: product._id,
                    qty: 1,
                }),
            });
        } catch {
            // Network error — local cart still correct, sync on next login
        }
    }

    return (
        <>
            {product.stock ? (
                <button
                    onClick={cartHandler}
                    aria-label="Add to cart"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2d2d2d] text-white transition-all duration-300 hover:scale-110 hover:bg-black"
                >
                    <FaPlus size={12} />
                </button>
            ) : (
                <span className="rounded-full bg-red-50 px-3 py-2 text-sm font-medium text-red-500">
                    Out of Stock
                </span>
            )}
        </>
    );
}

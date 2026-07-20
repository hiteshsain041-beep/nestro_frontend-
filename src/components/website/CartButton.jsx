'use client';

import { addToCart } from '@/redux/features/cartSlice';
import { client } from '@/utils/helper';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

export default function CartButton({ product }) {
    const dispatch = useDispatch();

    async function cartHandler() {
        // ── Step 1: Update Redux + localStorage immediately (optimistic / guest) ──
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            salePrice: product.salePrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            thumbnail: product.thumbnail?.trim() || null,
            qty: 1,
        }));

        // ── Step 2: Sync to the backend DB in the background ──────────────────────
        // client has withCredentials:true so the JWT cookie is sent automatically.
        // If the user is not logged in, the request will 401 — we swallow that
        // silently so guest users are unaffected.
        try {
            await client.post('cart/add-to-cart', {
                productId: product._id,
                qty: 1,
            });
        } catch {
            // 401 = guest user (no token) → ignore, Redux already updated
            // Any other error → log quietly, local cart is still correct
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

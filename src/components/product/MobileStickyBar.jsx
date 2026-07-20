"use client";

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import { FiShoppingCart, FiZap } from "react-icons/fi";

export default function MobileStickyBar({ product }) {
    const dispatch = useDispatch();
    const [adding, setAdding] = useState(false);
    const inStock = product.stock !== false;

    const handleAdd = useCallback(async () => {
        if (!inStock) return;
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
            toast.success("Added to cart");
        } catch { /* guest — ok */ }
        finally { setAdding(false); }
    }, [dispatch, product, inStock]);

    if (!inStock) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
            <button
                onClick={handleAdd}
                disabled={adding}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#3a2418] hover:bg-[#2a1a10] text-white font-semibold text-sm transition disabled:opacity-60"
            >
                {adding ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                ) : <FiShoppingCart size={15} />}
                Add to Cart
            </button>

            <button
                onClick={async () => {
                    dispatch(addToCart({
                        id: product._id,
                        name: product.name,
                        salePrice: product.salePrice,
                        originalPrice: product.originalPrice,
                        discount: product.discount,
                        thumbnail: product.thumbnail?.trim() || null,
                        qty: 1,
                    }));
                    try { await client.post("cart/add-to-cart", { productId: product._id, qty: 1 }); } catch { }
                    window.location.href = "/checkout";
                }}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#a46d43] hover:bg-[#8d5c35] text-white font-semibold text-sm transition"
            >
                <FiZap size={15} /> Buy Now
            </button>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaHeart } from "react-icons/fa";
import Image from "next/image";
import CartButton from "./CartButton";

export default function ProductCard({ product, priority = false }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);

  if (!product) return null;

  const { _id, name, thumbnail, salePrice, originalPrice, bestSeller, categoryId } = product;
  const hasThumbnail = Boolean(thumbnail?.trim());
  const discount = originalPrice > salePrice
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900">

      {/* ── Image ──────────────────────────────────────────────── */}
      <div className="relative flex h-[240px] items-center justify-center bg-[#f5f3f0] dark:bg-zinc-800 overflow-hidden">

        {bestSeller && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#788864] px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-wide">
            Best Seller
          </span>
        )}

        {discount > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        {hasThumbnail ? (
          <Image
            src={thumbnail}
            alt={name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-contain p-6 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-gray-200 dark:text-zinc-700">
            🛋️
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/5 group-hover:opacity-100">
          <button
            onClick={() => setFavorite(!favorite)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
            aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className={favorite ? "text-red-500" : "text-gray-400"} size={14} />
          </button>
          <button
            onClick={() => router.push(`/productDitail/${_id}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
            aria-label="View product details"
          >
            <FaEye className="text-gray-500" size={14} />
          </button>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="p-4">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
          {categoryId?.name || "Furniture"}
        </p>
        <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{salePrice?.toLocaleString()}
            </span>
            {originalPrice > salePrice && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                ₹{originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <CartButton product={product} title="Add To Cart" />
        </div>
      </div>
    </div>
  );
}

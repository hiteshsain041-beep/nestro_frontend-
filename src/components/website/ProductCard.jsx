"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEye, FaHeart } from "react-icons/fa";
import Image from "next/image";
import CartButton from "./CartButton";

export default function ProductCard({ product, priority = false }) {
  const [favorite, setFavorite] = useState(false);

  if (!product) return null;

  // Prefer slug for canonical URL; fall back to id for legacy routes
  const { _id, slug, name, thumbnail, salePrice, originalPrice, bestSeller, categoryId } = product;
  const href = slug ? `/store/${slug}` : `/store/${_id}`;
  const hasThumbnail = Boolean(thumbnail?.trim());
  const discount = originalPrice > salePrice
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ── Image — entire area is a Link ──────────────────────── */}
      <Link
        href={href}
        className="relative flex h-[180px] sm:h-[240px] items-center justify-center bg-[#f5f3f0] overflow-hidden block"
        aria-label={`View ${name}`}
      >
        {bestSeller && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#788864] px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
            Best Seller
          </span>
        )}

        {discount > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        {hasThumbnail ? (
          <Image
            src={thumbnail}
            alt={name || "Product image"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-contain p-4 sm:p-6 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-gray-200">
            🛋️
          </div>
        )}

        {/* Hover actions — stopPropagation so clicks don't navigate */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/5 group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); setFavorite(!favorite); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
            aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className={favorite ? "text-red-500" : "text-gray-400"} size={14} />
          </button>
        </div>
      </Link>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5 truncate">
          {categoryId?.name || "Furniture"}
        </p>
        <Link href={href}>
          <h3 className="line-clamp-1 text-xs sm:text-sm font-semibold text-gray-900 mb-2 hover:text-[#a46d43] transition-colors">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-1">
          <div className="min-w-0">
            <span className="text-sm sm:text-lg font-bold text-gray-900">
              ₹{salePrice?.toLocaleString("en-IN")}
            </span>
            {originalPrice > salePrice && (
              <span className="ml-1 text-[10px] sm:text-xs text-gray-400 line-through whitespace-nowrap">
                ₹{originalPrice?.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <CartButton product={product} title="Add To Cart" />
        </div>
      </div>
    </div>
  );
}

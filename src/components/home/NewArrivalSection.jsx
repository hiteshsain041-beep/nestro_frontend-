import Link from "next/link";
import { FiArrowRight, FiAlertCircle } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";

// ─── Section label ───────────────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-1.5">
            {children}
        </p>
    );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="py-16 text-center text-[#9a8a7a]">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-sm font-medium">Products coming soon.</p>
            <p className="text-xs mt-1">New arrivals are on their way. Stay tuned!</p>
        </div>
    );
}

// ─── Error state ─────────────────────────────────────────────────────────────
function ErrorState({ message }) {
    return (
        <div className="py-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <FiAlertCircle size={15} />
                {message ?? "Unable to load products. Please refresh the page."}
            </div>
        </div>
    );
}

// ─── Main Server Component ───────────────────────────────────────────────────

/**
 * NewArrivalSection — Server Component.
 *
 * Props:
 *   products  — pre-fetched products array from page.jsx
 *   error     — error message if fetch failed
 */
export default function NewArrivalSection({ products = [], error = null }) {
    // Filter new arrivals (page.jsx passes all products, we filter here)
    const newArrivals = products.filter((p) => p.newArrival === true && p.status !== false);

    return (
        <section
            className="bg-[#f5f2ed] dark:bg-zinc-900 py-14 sm:py-20"
            aria-label="New Arrivals"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">

                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <SectionLabel>Just Landed</SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007] dark:text-white">
                            New <span className="text-[#a46d43]">Arrivals</span>
                        </h2>
                        <p className="text-sm text-[#9a8a7a] mt-1">The latest additions to our curated collection</p>
                    </div>
                    <Link
                        href="/store"
                        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#a46d43]
                       hover:text-[#3a2418] dark:hover:text-[#d9b48b] transition-colors"
                    >
                        Explore All <FiArrowRight size={14} />
                    </Link>
                </div>

                {/* Content */}
                {error ? (
                    <ErrorState message={error} />
                ) : newArrivals.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/*
              Responsive grid:
                Mobile  → 2 columns
                Tablet  → 3 columns
                Desktop → 4 columns
            */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                            {newArrivals.map((product, idx) => (
                                <ProductCard
                                    key={String(product._id)}
                                    product={product}
                                    priority={false}   /* new arrivals are below the fold */
                                    showWishlist
                                    showQuickView
                                    showAddToCart
                                />
                            ))}
                        </div>

                        {/* Mobile "View All" */}
                        <div className="mt-7 text-center sm:hidden">
                            <Link
                                href="/store"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a46d43]"
                            >
                                View All New Arrivals <FiArrowRight size={14} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

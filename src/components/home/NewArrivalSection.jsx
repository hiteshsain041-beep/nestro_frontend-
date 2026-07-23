import { FiAlertCircle } from "react-icons/fi";
import ProductSlider from "./ProductSlider";

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

/**
 * NewArrivalSection — Server Component.
 * Props:
 *   products  — pre-fetched product array from page.jsx
 *   error     — error message string if fetch failed
 */
export default function NewArrivalSection({ products = [], error = null }) {
    const newArrivals = products.filter(
        (p) => p.newArrival === true && p.status !== false
    );

    return (
        <section
            className="bg-[#f5f2ed] dark:bg-zinc-900 py-14 sm:py-20"
            aria-label="New Arrivals"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">

                {/* Section header */}
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <SectionLabel>Just Landed</SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007] dark:text-white">
                            New <span className="text-[#a46d43]">Arrivals</span>
                        </h2>
                        <p className="text-sm text-[#9a8a7a] mt-1">
                            The latest additions to our curated collection
                        </p>
                    </div>
                </div>

                {/* Content */}
                {error ? (
                    <ErrorState message={error} />
                ) : newArrivals.length === 0 ? (
                    <EmptyState />
                ) : (
                    <ProductSlider
                        products={newArrivals}
                        viewAllHref="/store"
                        viewAllText="View All New Arrivals"
                        aboveFold={false}
                    />
                )}
            </div>
        </section>
    );
}

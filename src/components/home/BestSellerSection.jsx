import { FiAlertCircle } from "react-icons/fi";
import ProductSlider from "./ProductSlider";

function SectionLabel({ children }) {
    return (
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-1.5">
            {children}
        </p>
    );
}

function EmptyState() {
    return (
        <div className="py-16 text-center text-[#9a8a7a]">
            <div className="text-4xl mb-3">🛋️</div>
            <p className="text-sm font-medium">Products coming soon.</p>
            <p className="text-xs mt-1">Check back later for our best sellers.</p>
        </div>
    );
}

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

export default function BestSellerSection({ products = [], error = null }) {
    const bestSellers = products.filter(
        (p) => p.bestSeller === true && p.status !== false
    );

    return (
        <section className="bg-white dark:bg-zinc-950 py-14 sm:py-20" aria-label="Best Sellers">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">

                <div className="mb-6">
                    <SectionLabel>Most Loved</SectionLabel>
                    <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007] dark:text-white">
                        Best <span className="text-[#a46d43]">Sellers</span>
                    </h2>
                    <p className="text-sm text-[#9a8a7a] mt-1">
                        Our most popular products, chosen by customers like you
                    </p>
                </div>

                {error ? (
                    <ErrorState message={error} />
                ) : bestSellers.length === 0 ? (
                    <EmptyState />
                ) : (
                    <ProductSlider
                        products={bestSellers}
                        viewAllHref="/store"
                        viewAllText="View All Best Sellers"
                        aboveFold={true}
                    />
                )}
            </div>
        </section>
    );
}

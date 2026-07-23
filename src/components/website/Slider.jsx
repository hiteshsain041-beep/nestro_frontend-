"use client";

// Featured Products section on the Home page.
// Delegates the actual slider to the shared ProductSlider component
// so all three sliders (Featured, Best Sellers, New Arrivals) behave identically.

import ProductSlider from "@/components/home/ProductSlider";

export default function Slider({ products = [] }) {
    if (!products.length) return null;

    return (
        <section className="bg-[#faf8f5] py-10 sm:py-14 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Section header */}
                <div className="mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a46d43] mb-0.5">
                        Curated Picks
                    </p>
                    <h2 className="text-xl sm:text-2xl font-light text-[#1a1007]">
                        Featured <span className="text-[#a46d43]">Products</span>
                    </h2>
                </div>

                <ProductSlider
                    products={products}
                    viewAllHref="/store"
                    viewAllText="View All Products"
                    aboveFold={true}
                />
            </div>
        </section>
    );
}

import ProductCard from "@/components/website/ProductCard";
import { fetchProduct } from "@/utils/api";
import { FiPackage, FiAlertCircle } from "react-icons/fi";

export const metadata = {
    title: "Shop Furniture — Nestro",
    description: "Browse our curated collection of premium furniture. Filter by room, category, and price.",
};

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const room = params.room || "";
    const category = params.category || "";
    const min = params.min || "";
    const max = params.max || "";
    const sort = params.sort || "";

    const result = await fetchProduct({ status: true, room, category, min, max, sort });

    if (!result.success) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
                <FiAlertCircle size={40} className="text-red-400 mb-4" />
                <h2 className="text-lg font-semibold text-red-700 mb-1">Failed to Load Products</h2>
                <p className="text-sm text-red-500">{result.message}</p>
                <p className="mt-3 text-xs text-gray-400">
                    Make sure the backend is running at{" "}
                    <code className="bg-red-100 px-1 rounded">http://localhost:5000</code>
                </p>
            </div>
        );
    }

    const products = result.data ?? [];

    if (products.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ede9e3] bg-[#faf8f5] p-10 text-center">
                <FiPackage size={48} className="text-[#c9b9a8] mb-4" />
                <h2 className="text-xl font-semibold text-[#1a1007] mb-2">No Products Found</h2>
                <p className="text-sm text-[#9a8a7a] max-w-xs">
                    Try adjusting your filters or browse a different category.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {products.map((product, idx) => (
                    <ProductCard key={product._id} product={product} priority={idx < 4} />
                ))}
            </div>
        </div>
    );
}

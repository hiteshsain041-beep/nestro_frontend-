import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

function RelatedCard({ product }) {
    const discount =
        product.originalPrice > product.salePrice
            ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
            : 0;

    return (
        <Link
            href={`/store/${product.slug}`}
            className="group block rounded-2xl bg-white border border-[#ede9e3] shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300"
        >
            <div className="relative h-[180px] bg-[#f5f2ed] overflow-hidden">
                {discount > 0 && (
                    <span className="absolute top-2 left-2 z-10 text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                        -{discount}%
                    </span>
                )}
                {product.thumbnail ? (
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        sizes="(max-width:640px) 50vw, 25vw"
                        loading="lazy"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-200">
                        🛋️
                    </div>
                )}
            </div>
            <div className="p-3.5">
                <p className="text-[10px] font-medium text-[#9a8a7a] uppercase tracking-wider mb-1 truncate">
                    {product.categoryId?.name ?? "Furniture"}
                </p>
                <h4 className="text-sm font-semibold text-[#1a1007] line-clamp-1 mb-2 group-hover:text-[#a46d43] transition-colors">
                    {product.name}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1a1007]">
                        ₹{product.salePrice?.toLocaleString("en-IN")}
                    </span>
                    {discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice?.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function RelatedProducts({ products = [] }) {
    if (!products.length) return null;

    return (
        <section className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-1">
                        You Might Also Like
                    </p>
                    <h2 className="text-xl sm:text-2xl font-light text-[#1a1007]">
                        Related <span className="text-[#a46d43]">Products</span>
                    </h2>
                </div>
                <Link
                    href="/store"
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#a46d43] hover:text-[#3a2418] transition"
                >
                    View All <FiArrowRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((p) => (
                    <RelatedCard key={String(p._id)} product={p} />
                ))}
            </div>
        </section>
    );
}

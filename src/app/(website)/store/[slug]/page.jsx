export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { FiHome, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewSection from "@/components/product/ReviewSection";
import MobileStickyBar from "@/components/product/MobileStickyBar";

// ── Server-side data fetchers ──────────────────────────────────────────────────
const BASE = (process.env.API_BASE_URL || "http://localhost:5000/api").replace(/\/+$/, "");

async function getProductBySlug(slug) {
    try {
        const res = await fetch(`${BASE}/product?slug=${encodeURIComponent(slug)}&limit=1&status=true`, {
            cache: "no-store",
        });
        const data = await res.json();
        return data.products?.[0] ?? null;
    } catch {
        return null;
    }
}

async function getRelatedProducts(categoryId, excludeSlug) {
    if (!categoryId) return [];
    try {
        const res = await fetch(
            `${BASE}/product?categoryId=${categoryId}&limit=6&status=true`,
            { cache: "no-store" }
        );
        const data = await res.json();
        return (data.products ?? []).filter((p) => p.slug !== excludeSlug).slice(0, 5);
    } catch {
        return [];
    }
}

// ── Dynamic metadata ───────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return { title: "Product Not Found — Nestro" };
    }

    const title = product.seoTitle || `${product.name} — Nestro`;
    const description =
        product.seoDescription ||
        product.shortDescription ||
        `Buy ${product.name} at the best price. Premium quality furniture from Nestro.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: product.thumbnail ? [{ url: product.thumbnail, width: 800, height: 800 }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product.thumbnail ? [product.thumbnail] : [],
        },
    };
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const categoryId = product.categoryId?._id ?? product.categoryId ?? null;
    const related = await getRelatedProducts(String(categoryId ?? ""), slug);

    const allImages = [
        ...(product.thumbnail?.trim() ? [product.thumbnail] : []),
        ...(product.gallery ?? []).map((g) => g.url).filter(Boolean),
    ];

    const discount =
        product.originalPrice > product.salePrice
            ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
            : 0;

    // JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        description: product.shortDescription || product.name,
        image: allImages,
        sku: product._id,
        brand: { "@type": "Brand", name: "Nestro" },
        offers: {
            "@type": "Offer",
            url: `https://nestro-frontend-chi.vercel.app/store/${slug}`,
            priceCurrency: "INR",
            price: product.salePrice,
            availability: product.stock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.5",
            reviewCount: "3",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="bg-[#faf8f5] dark:bg-zinc-950 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                    {/* Breadcrumb */}
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap"
                    >
                        <Link href="/" className="flex items-center gap-1 hover:text-[#a46d43] transition">
                            <FiHome size={11} /> Home
                        </Link>
                        <FiChevronRight size={10} />
                        <Link href="/store" className="hover:text-[#a46d43] transition">Store</Link>
                        {product.categoryId?.name && (
                            <>
                                <FiChevronRight size={10} />
                                <Link
                                    href={`/store?category=${product.categoryId.slug}`}
                                    className="hover:text-[#a46d43] transition"
                                >
                                    {product.categoryId.name}
                                </Link>
                            </>
                        )}
                        <FiChevronRight size={10} />
                        <span className="text-[#1a1007] dark:text-white font-medium line-clamp-1 max-w-[200px]">
                            {product.name}
                        </span>
                    </nav>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Gallery — sticky on desktop */}
                        <div className="lg:sticky lg:top-6 lg:self-start">
                            <ProductGallery images={allImages} name={product.name} />
                        </div>

                        {/* Info */}
                        <div>
                            <ProductInfo product={product} />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-12 bg-white dark:bg-zinc-900 border border-[#ede9e3] dark:border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-sm">
                        <ProductTabs product={product} />
                    </div>

                    {/* Reviews */}
                    <ReviewSection productName={product.name} />

                    {/* Related */}
                    <RelatedProducts products={related} />

                </div>

                {/* Mobile sticky bar */}
                <MobileStickyBar product={product} />
            </div>
        </>
    );
}

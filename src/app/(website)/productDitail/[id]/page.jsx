import CartButton from "@/components/website/CartButton";
import { fetchProductById } from "@/utils/api";
import ProductImageGallery from "@/components/website/ProductImageGallery";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const { success, product } = await fetchProductById(id);

  if (!success || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-red-500 text-center">
          Product Not Found
        </h1>
      </div>
    );
  }

  // Build the ordered image list: thumbnail first, then gallery urls
  const allImages = [
    ...(product.thumbnail?.trim() ? [product.thumbnail] : []),
    ...(product.gallery ?? []).map((g) => g.url).filter(Boolean),
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-2">

        {/* ── Image gallery ──────────────────────────────────── */}
        <ProductImageGallery images={allImages} name={product.name} />

        {/* ── Details ───────────────────────────────────────── */}
        <div>
          <h1 className="mb-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1007]">
            {product.name}
          </h1>

          <p className="mb-5 text-gray-500 text-sm sm:text-base leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-3xl sm:text-4xl font-bold text-[#1a1007]">
              ₹{product.salePrice?.toLocaleString()}
            </span>
            {product.originalPrice > product.salePrice && (
              <span className="text-lg sm:text-xl line-through text-gray-400">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
            {product.discount > 0 && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Stock badge */}
          <div className="mb-5">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${product.stock
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
              }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${product.stock ? "bg-green-500" : "bg-red-500"}`} />
              {product.stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <CartButton product={product} title="Add To Cart" />

          <div className="mt-8 sm:mt-10 space-y-1 divide-y divide-gray-100">
            {[
              { title: "Category", value: product.categoryId?.name },
              { title: "Room", value: product.roomId?.name },
              { title: "Material", value: product.material },
              { title: "Color", value: product.color },
              { title: "Weight", value: product.weight ? `${product.weight} Kg` : null },
            ].map((spec) => (
              <Spec key={spec.title} title={spec.title} value={spec.value} />
            ))}
          </div>

          {product.description && (
            <div className="prose prose-sm sm:prose mt-8 sm:mt-10 max-w-none">
              <h2>Description</h2>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Spec({ title, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2.5 text-sm">
      <span className="text-gray-500">{title}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

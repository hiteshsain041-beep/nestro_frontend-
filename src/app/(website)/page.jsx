import HeroSlider from "@/components/website/HeroSlider";
import CategorySection from "@/components/website/CategorySection";
import Slider from "@/components/website/Slider";
import HomeSections from "@/components/website/HomeSections";
import BestSellerSection from "@/components/home/BestSellerSection";
import NewArrivalSection from "@/components/home/NewArrivalSection";
import { fetchCategoryServer, fetchProductServer } from "@/utils/api.server";

export const metadata = {
  title: "Nestro — Curated Furniture",
  description:
    "Premium Scandinavian-inspired furniture for modern living. Crafted to endure seasons.",
};

export default async function HomePage() {
  // Single parallel fetch for categories + all active products.
  // bestSeller/newArrival filtering happens inside each section component,
  // so we only hit the API once per page request.
  const [catResult, productResult] = await Promise.all([
    fetchCategoryServer({ status: true }),
    fetchProductServer({ status: true, limit: 100 }),
  ]);

  const categories = catResult.data ?? [];
  const products = productResult.data ?? [];
  const productError = productResult.success ? null : productResult.message;

  // Enrich categories with per-category product counts
  const countMap = {};
  for (const p of products) {
    const cid = String(p.categoryId?._id ?? p.categoryId ?? "");
    if (cid) countMap[cid] = (countMap[cid] ?? 0) + 1;
  }

  const enrichedCategories = categories.map((cat) => ({
    ...cat,
    productCount: countMap[String(cat._id)] ?? 0,
  }));

  return (
    <>
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Category Section — with live product counts */}
      <CategorySection
        categories={enrichedCategories}
        error={catResult.success ? null : catResult.message}
      />

      {/* 3. Best Sellers — products where bestSeller === true */}
      <BestSellerSection products={products} error={productError} />

      {/* 4. New Arrivals — products where newArrival === true */}
      <NewArrivalSection products={products} error={productError} />

      {/* 5. Product carousel */}
      <Slider products={products} />

      {/* 6. Features, Shop by Room, testimonials, FAQ, newsletter, CTA */}
      <HomeSections />
    </>
  );
}

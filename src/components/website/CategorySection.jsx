import Image from 'next/image';
import Link from 'next/link';

// ── SVG icon map — keyed by sanitised slug ────────────────────────────────────
const ICON_MAP = {
  sofa: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17h18M5 17V9a2 2 0 012-2h10a2 2 0 012 2v8M2 14h3m14 0h3" />,
  sofas: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17h18M5 17V9a2 2 0 012-2h10a2 2 0 012 2v8M2 14h3m14 0h3" />,
  bedroom: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 7h18M5 7v10M19 7v10M3 17h18M7 12v5M17 12v5" />,
  table: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M6 8v10M18 8v10M8 18h8" />,
  tables: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M6 8v10M18 8v10M8 18h8" />,
  chair: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 20v-6M18 20v-6M4 14h16M7 14V8a2 2 0 012-2h6a2 2 0 012 2v6" />,
  chairs: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 20v-6M18 20v-6M4 14h16M7 14V8a2 2 0 012-2h6a2 2 0 012 2v6" />,
  storage: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 4h14a1 1 0 011 1v5H4V5a1 1 0 011-1zM4 10h16v10H4zM10 10v10M14 10v10" />,
  lighting: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 18h6M10 22h4M12 2v2M12 6a6 6 0 016 6c0 2.5-1.5 4.5-3 5.5H9c-1.5-1-3-3-3-5.5a6 6 0 016-6z" />,
  decor: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />,
  outdoor: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" />,
  office: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM12 17v4M8 21h8" />,
  dining: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M6 8v10M18 8v10M8 18h8M12 4v4" />,
  wardrobe: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v16H3V5a2 2 0 012-2zM12 3v18M9 10h.01M15 10h.01" />,
};

const DEFAULT_ICON = (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
);

function CategoryIcon({ slug = "" }) {
  const key = slug.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-7 h-7 text-[#a46d43]"
      aria-hidden="true"
    >
      {ICON_MAP[key] ?? DEFAULT_ICON}
    </svg>
  );
}

// ── Individual card ────────────────────────────────────────────────────────────
function CategoryCard({ cat, index }) {
  const hasImage = Boolean(cat.image?.trim());
  const isAboveFold = index < 6; // first row visible on load

  return (
    <Link
      href={`/store?category=${encodeURIComponent(cat.slug)}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a46d43] rounded-2xl"
      aria-label={`Browse ${cat.name}`}
    >
      <div className="flex flex-col items-center text-center bg-white border border-[#ede9e3] rounded-2xl px-3 py-5 sm:px-4 h-full
                      transition-all duration-200
                      hover:border-[#c9a882]
                      hover:shadow-[0_6px_24px_rgba(164,109,67,0.13)]
                      hover:-translate-y-0.5
                      group-focus-visible:border-[#a46d43]">

        {/* Image or icon */}
        <div className="relative w-7 h-7 sm:w-10 sm:h-10 mb-3 flex-shrink-0">
          {hasImage ? (
            <div className="w-full h-full rounded-xl overflow-hidden bg-[#f5f2ed]">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="80px"
                priority={isAboveFold}
                loading={isAboveFold ? "eager" : "lazy"}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-xl bg-[#faf0e8] flex items-center justify-center
                            transition-colors duration-200 group-hover:bg-[#f5e6d0]">
              {/* <CategoryIcon slug={cat.slug} /> */}
            </div>
          )}
        </div>

        {/* Name */}
        <h4 className="text-[12px] sm:text-[13px] font-semibold text-[#1a1007] line-clamp-2 leading-snug mb-0.5
                       group-hover:text-[#a46d43] transition-colors duration-200">
          {cat.name}
        </h4>

        {/* Product count */}
        {typeof cat.productCount === "number" && (
          <p className="text-[11px] text-[#9a8a7a] mt-0.5">
            {cat.productCount === 0
              ? "Coming soon"
              : `${cat.productCount} piece${cat.productCount !== 1 ? "s" : ""}`}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── Skeleton card for loading state ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col items-center bg-white border border-[#ede9e3] rounded-2xl px-4 py-5 animate-pulse">
      <div className="w-14 h-14 rounded-xl bg-[#f0ebe4] mb-3" />
      <div className="h-3 w-16 bg-[#f0ebe4] rounded mb-1.5" />
      <div className="h-2.5 w-10 bg-[#f5f2ed] rounded" />
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
/**
 * CategorySection
 *
 * Props:
 *   categories  — array of category objects enriched with `productCount`
 *   loading     — show skeleton cards while fetching (optional, default false)
 *   error       — error message string (optional)
 *
 * Data is fetched by the parent Server Component (page.jsx) and passed down,
 * keeping this component as a pure presentational component with no own fetch.
 */
export default function CategorySection({ categories = [], loading = false, error = null }) {

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="bg-[#faf8f5] py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center py-6">
          <p className="text-sm text-[#9a8a7a]">
            Unable to load categories right now. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // ── Loading state — show 6 skeleton cards ────────────────────────────────────
  if (loading) {
    return (
      <section className="bg-[#faf8f5] py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  // ── Deduplicate by _id (safety guard) ────────────────────────────────────────
  const seen = new Set();
  const unique = categories.filter((cat) => {
    if (!cat?._id || seen.has(String(cat._id))) return false;
    seen.add(String(cat._id));
    return true;
  });

  // ── Empty state ───────────────────────────────────────────────────────────────
  if (unique.length === 0) return null;

  return (
    <section className="bg-[#faf8f5] py-8 px-4 md:px-6" aria-label="Shop by category">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a46d43] mb-0.5">
              Collections
            </p>
            <h2 className="text-xl sm:text-2xl font-light text-[#1a1007]">
              Shop by <span className="text-[#a46d43]">Category</span>
            </h2>
          </div>
          <Link
            href="/store"
            className="text-[12px] font-semibold text-[#a46d43] hover:text-[#3a2418] transition-colors hidden sm:block"
          >
            View All →
          </Link>
        </div>

        {/* Responsive grid:
              mobile  → 2 cols
              sm      → 3 cols
              md      → 4 cols
              lg      → 6 cols  */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3">
          {unique.map((cat, idx) => (
            <CategoryCard key={String(cat._id)} cat={cat} index={idx} />
          ))}
        </div>

        {/* "View All" link for mobile */}
        <div className="mt-5 text-center sm:hidden">
          <Link
            href="/store"
            className="text-[12px] font-semibold text-[#a46d43] hover:text-[#3a2418] transition-colors"
          >
            View All Categories →
          </Link>
        </div>

      </div>
    </section>
  );
}

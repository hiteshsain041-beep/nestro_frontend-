
import Image from "next/image";
import Link from "next/link";
import {
    FiAward, FiTruck, FiRefreshCw, FiHeadphones,
    FiCreditCard, FiCheckCircle, FiStar, FiArrowRight,
    FiMail,
} from "react-icons/fi";
import FaqAccordion from "./FaqAccordion";
import NewsletterInline from "./NewsletterInline";

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
    { icon: <FiAward size={22} />, title: "Premium Quality", body: "Every piece is built from responsibly sourced teak, sheesham, and cane — chosen to age beautifully." },
    { icon: <FiCheckCircle size={22} />, title: "Sustainable Materials", body: "FSC-certified wood, non-toxic finishes, and zero-landfill production keep our footprint small." },
    { icon: <FiTruck size={22} />, title: "Fast Delivery", body: "White-glove delivery in 5–7 days across India, including in-home assembly at no extra charge." },
    { icon: <FiCreditCard size={22} />, title: "Secure Payments", body: "256-bit SSL encryption. Cards, UPI, net banking, and 0% EMI options accepted." },
    { icon: <FiRefreshCw size={22} />, title: "Easy Returns", body: "30-day hassle-free returns. If you're not in love with it, we'll sort it out — no questions." },
    { icon: <FiHeadphones size={22} />, title: "24/7 Support", body: "Real humans via chat, email, or phone — around the clock, every day of the year." },
];

const SHOP_BY_ROOM = [
    { label: "Living Room", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=75", slug: "living-room" },
    { label: "Bedroom", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=75", slug: "bedroom" },
    { label: "Dining Room", img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=75", slug: "dining" },
    { label: "Home Office", img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=75", slug: "office" },
    { label: "Outdoor", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=75", slug: "outdoor" },
    { label: "Décor", img: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&q=75", slug: "decor" },
];

// const BEST_SELLERS = [
//     { id: 1, name: "Oslo Lounge Chair", category: "Living Room", price: 28500, original: 34000, img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=75", rating: 4.9, reviews: 214 },
//     { id: 2, name: "Fjord Dining Table", category: "Dining", price: 42000, original: 54000, img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&q=75", rating: 4.8, reviews: 178 },
//     { id: 3, name: "Haven King Bed", category: "Bedroom", price: 65000, original: 78000, img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&q=75", rating: 4.9, reviews: 302 },
//     { id: 4, name: "Craft Bookshelf", category: "Living Room", price: 18500, original: 22000, img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=75", rating: 4.7, reviews: 96 },
// ];

// const NEW_ARRIVALS = [
//     { id: 5, name: "Nara Floor Lamp", category: "Lighting", price: 8500, original: 11000, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=75", rating: 4.6, reviews: 43 },
//     { id: 6, name: "Alto Coffee Table", category: "Living Room", price: 15500, original: 19000, img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=75", rating: 4.8, reviews: 61 },
//     { id: 7, name: "Reed Accent Chair", category: "Outdoor", price: 21000, original: 26000, img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=75", rating: 4.7, reviews: 38 },
//     { id: 8, name: "Loft Work Desk", category: "Office", price: 31000, original: 38000, img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=75", rating: 4.9, reviews: 55 },
// ];

const TESTIMONIALS = [
    { name: "Vikram Nair", location: "Mumbai", rating: 5, img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=75", review: "The walnut dining table is the centrepiece of our home. Guests always ask where we got it — quality that justifies every rupee." },
    { name: "Ananya Bose", location: "Bengaluru", rating: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=75", review: "Nestro's team walked me through every step. The sofa arrived perfectly wrapped and was assembled in under an hour. Absolutely stunning." },
    { name: "Rohan Gupta", location: "New Delhi", rating: 5, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=75", review: "Five stars isn't enough. Three rooms, all Nestro. The consistency in quality across product lines is what makes this brand special." },
];

const STATS = [
    { value: "25,000+", label: "Happy Customers" },
    { value: "5,000+", label: "Products Sold" },
    { value: "15+", label: "Years Experience" },
    { value: "150+", label: "Team Members" },
];

const BLOGS = [
    { title: "10 Ways to Style Your Living Room This Season", desc: "Discover expert tips on layering textures, choosing accent pieces, and creating a living space that feels both curated and lived-in.", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=75", date: "Jun 18, 2026" },
    { title: "The Art of Choosing the Perfect Dining Table", desc: "Shape, size, and material — we break down everything you need to consider before investing in the centrepiece of your dining room.", img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=75", date: "Jun 10, 2026" },
    { title: "Sustainable Furniture: Why It Matters in 2026", desc: "From FSC-certified timber to water-based finishes, learn how responsible sourcing shapes every piece we make — and why it should matter to you.", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=75", date: "May 29, 2026" },
];

const FAQS = [
    { q: "What materials does Nestro use?", a: "We source FSC-certified teak, sheesham, cane, and solid mango wood. All finishes are non-toxic and water-based." },
    { q: "How long does delivery take?", a: "Standard delivery is 5–7 business days across India. White-glove in-home assembly is included at no extra charge." },
    { q: "What is your return policy?", a: "We offer 30-day hassle-free returns on all products. Contact our support team and we'll arrange a pickup." },
    { q: "Do you offer EMI options?", a: "Yes — 0% EMI is available on orders above ₹15,000 via leading banks. Select the option at checkout." },
    { q: "Can I customise furniture dimensions or finishes?", a: "Custom orders are available for select collections. Reach out via our contact page with your requirements." },
    { q: "How do I care for my Nestro furniture?", a: "Wipe with a dry or slightly damp cloth. Avoid direct sunlight and harsh chemicals. We include a care guide with every order." },
];

// ─── Small reusable pieces ───────────────────────────────────────────────────

function SectionLabel({ children }) {
    return <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-2">{children}</p>;
}

function Stars({ n = 5 }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                    key={i}
                    size={12}
                    className={i < n ? "text-[#a46d43]" : "text-gray-200"}
                    style={{ fill: i < n ? "#a46d43" : "transparent" }}
                />
            ))}
        </div>
    );
}

function ProductCard({ item }) {
    const discount = Math.round(((item.original - item.price) / item.original) * 100);
    return (
        <div className="group bg-white rounded-2xl border border-[#ede9e3] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-52 bg-[#f5f2ed]">
                <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width:640px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-[#3a2418] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        -{discount}%
                    </span>
                )}
            </div>
            <div className="p-4">
                <p className="text-[10px] text-[#9a8a7a] uppercase tracking-wider mb-1">{item.category}</p>
                <h3 className="text-sm font-semibold text-[#1a1007] line-clamp-1 mb-1.5">{item.name}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                    <Stars n={item.rating} />
                    <span className="text-[11px] text-[#9a8a7a]">({item.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-bold text-[#1a1007]">₹{item.price.toLocaleString()}</span>
                        <span className="ml-2 text-xs text-gray-400 line-through">₹{item.original.toLocaleString()}</span>
                    </div>
                    <Link href="/store" className="text-[11px] font-semibold text-[#a46d43] hover:text-[#3a2418] transition">
                        View →
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function HomeSections() {
    return (
        <>
            {/* ══ 1. FEATURES ═══════════════════════════════════════════════════ */}
            <section className="bg-[#faf8f5] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <SectionLabel>Why Nestro</SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007]">
                            Built Around <span className="text-[#a46d43]">You</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="group bg-white border border-[#ede9e3] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf0e8] text-[#a46d43] mb-4 group-hover:bg-[#3a2418] group-hover:text-white transition-colors duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="font-semibold text-[#1a1007] mb-1.5">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 2. BEST SELLERS ═══════════════════════════════════════════════ */}
            {/* <section className="bg-white py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <SectionLabel>Most Loved</SectionLabel>
                            <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007]">Best <span className="text-[#a46d43]">Sellers</span></h2>
                        </div>
                        <Link href="/store" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#a46d43] hover:text-[#3a2418] transition">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {BEST_SELLERS.map((item) => <ProductCard key={item.id} item={item} />)}
                    </div>
                    <div className="mt-6 text-center sm:hidden">
                        <Link href="/store" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a46d43]">View All <FiArrowRight size={14} /></Link>
                    </div>
                </div>
            </section> */}

            {/* ══ 3. NEW ARRIVALS ═══════════════════════════════════════════════ */}
            {/* <section className="bg-[#f0ebe4] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <SectionLabel>Just Landed</SectionLabel>
                            <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007]">New <span className="text-[#a46d43]">Arrivals</span></h2>
                        </div>
                        <Link href="/store" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#a46d43] hover:text-[#3a2418] transition">
                            Explore <FiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {NEW_ARRIVALS.map((item) => <ProductCard key={item.id} item={item} />)}
                    </div>
                </div>
            </section> */}

            {/* ══ 4. SHOP BY ROOM ═══════════════════════════════════════════════ */}
            <section className="bg-[#faf8f5] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <SectionLabel>Explore by Space</SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007]">Shop by <span className="text-[#a46d43]">Room</span></h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {SHOP_BY_ROOM.map((room) => (
                            <Link key={room.slug} href={`/store?room=${room.slug}`} className="group relative rounded-2xl overflow-hidden aspect-square block">
                                <Image src={room.img} alt={room.label} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw" className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-75" />
                                <div className="absolute inset-0 flex items-end p-3">
                                    <span className="text-white text-xs sm:text-sm font-semibold leading-tight drop-shadow-sm">{room.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 5. SPECIAL OFFER BANNER ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-[#2b180f] py-16 sm:py-24">
                <div className="absolute inset-0 opacity-10">
                    <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=60" alt="offer background" fill className="object-cover" sizes="100vw" />
                </div>
                <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
                    <SectionLabel>Limited Time</SectionLabel>
                    <h2 className="text-3xl sm:text-5xl font-light text-white mb-4">Up to <span className="text-[#d9b48b] font-normal italic">40% Off</span></h2>
                    <p className="text-[#9a8a7a] text-sm sm:text-base mb-8 max-w-xl mx-auto">
                        Our biggest seasonal sale is live. Shop premium furniture at prices that won't come around again — free delivery included on all orders above ₹20,000.
                    </p>
                    <Link href="/store" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#a46d43] hover:bg-[#b87d53] text-white text-sm font-semibold transition-all duration-200 shadow-lg">
                        Shop the Sale <FiArrowRight size={15} />
                    </Link>
                </div>
            </section>

            {/* ══ 6. STATISTICS ═════════════════════════════════════════════════ */}
            <section className="bg-[#3a2418] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        {STATS.map((s) => (
                            <div key={s.label} className="py-3">
                                <p className="text-3xl sm:text-4xl font-bold text-white">{s.value}</p>
                                <p className="mt-1.5 text-xs sm:text-sm text-[#d9b48b] uppercase tracking-widest">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 7. TESTIMONIALS ═══════════════════════════════════════════════ */}
            <section className="bg-[#faf8f5] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <SectionLabel>Customer Stories</SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007]">What Our <span className="text-[#a46d43]">Families</span> Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl border border-[#ede9e3] p-6 shadow-sm flex flex-col gap-4">
                                <Stars n={t.rating} />
                                <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{t.review}&rdquo;</p>
                                <div className="flex items-center gap-3 pt-3 border-t border-[#f0ebe4]">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                                        <Image src={t.img} alt={t.name} fill sizes="40px" className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1a1007]">{t.name}</p>
                                        <p className="text-xs text-[#9a8a7a]">{t.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 8. BLOG ═══════════════════════════════════════════════════════ */}
            <section className="bg-white py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <SectionLabel>From the Journal</SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007]">Latest <span className="text-[#a46d43]">Articles</span></h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {BLOGS.map((b) => (
                            <article key={b.title} className="group bg-[#faf8f5] rounded-2xl overflow-hidden border border-[#ede9e3] shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="relative h-48">
                                    <Image src={b.img} alt={b.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-5">
                                    <p className="text-[10px] text-[#9a8a7a] uppercase tracking-wider mb-2">{b.date}</p>
                                    <h3 className="text-sm font-semibold text-[#1a1007] mb-2 line-clamp-2 leading-snug">{b.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{b.desc}</p>
                                    <Link href="/about" className="inline-flex items-center gap-1 text-xs font-semibold text-[#a46d43] hover:text-[#3a2418] transition">
                                        Read More <FiArrowRight size={11} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 9. NEWSLETTER ═════════════════════════════════════════════════ */}
            <section className="bg-[#2b180f] py-14 sm:py-20">
                <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a46d43]/20 mb-5">
                        <FiMail size={20} className="text-[#d9b48b]" />
                    </div>
                    <SectionLabel>Stay in the Loop</SectionLabel>
                    <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">
                        Get Exclusive <span className="text-[#d9b48b] italic">Offers</span>
                    </h2>
                    <p className="text-[#9a8a7a] text-sm mb-7 leading-relaxed">
                        Subscribe for early access to new collections, members-only discounts, and interior inspiration — straight to your inbox.
                    </p>
                    <NewsletterInline />
                </div>
            </section>

            {/* ══ 10. FAQ ════════════════════════════════════════════════════════ */}
            <section className="bg-[#faf8f5] py-14 sm:py-20">
                <div className="mx-auto max-w-2xl px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <SectionLabel>Got Questions?</SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007]">Frequently <span className="text-[#a46d43]">Asked</span></h2>
                    </div>
                    <FaqAccordion items={FAQS} />
                </div>
            </section>

            {/* ══ 11. CTA ════════════════════════════════════════════════════════ */}
            <section className="bg-white py-14 sm:py-20">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
                    <SectionLabel>Take the Next Step</SectionLabel>
                    <h2 className="text-3xl sm:text-4xl font-light text-[#1a1007] mb-4 leading-snug">
                        Transform Your Home with<br />
                        <span className="text-[#a46d43]">Premium Furniture</span>
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                        Browse our curated collection — every piece designed to bring warmth, character, and lasting quality into your living space. Free delivery. Expert assembly. 30-day returns.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/store" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#3a2418] text-white text-sm font-semibold hover:bg-[#2a1a10] transition shadow-lg w-full sm:w-auto">
                            Shop Now <FiArrowRight size={14} />
                        </Link>
                        <Link href="/contact" className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-[#3a2418] text-[#3a2418] text-sm font-semibold hover:bg-[#3a2418] hover:text-white transition w-full sm:w-auto">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

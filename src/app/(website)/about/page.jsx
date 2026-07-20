import Image from "next/image";
import Link from "next/link";
import {
  FiAward, FiTruck, FiRefreshCw,
  FiHeadphones, FiCreditCard, FiStar, FiHeart,
  FiZap, FiGlobe, FiCheckCircle,
} from "react-icons/fi";

export const metadata = {
  title: "About Nestro — Our Story, Mission & Team",
  description:
    "Discover Nestro's journey — a premium furniture brand built on craftsmanship, sustainable materials, and a passion for beautiful living spaces.",
};

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-3">
      {children}
    </p>
  );
}

const WHY_CHOOSE = [
  { icon: <FiAward size={22} />, title: "Premium Quality", body: "Every piece is crafted from responsibly sourced teak, sheesham, and cane — materials chosen to age beautifully with your home." },
  { icon: <FiZap size={22} />, title: "Modern Designs", body: "Our in-house team blends Scandinavian minimalism with Indian craftsmanship to create timeless silhouettes that never go out of style." },
  { icon: <FiTruck size={22} />, title: "Fast Delivery", body: "White-glove delivery within 5–7 business days across India, with in-home assembly included at no extra charge." },
  { icon: <FiCreditCard size={22} />, title: "Secure Payments", body: "Shop with confidence using 256-bit SSL encryption. We accept cards, UPI, net banking, and 0% EMI options." },
  { icon: <FiRefreshCw size={22} />, title: "Easy Returns", body: "Not in love with your purchase? Our 30-day hassle-free return policy means zero risk for you." },
  { icon: <FiHeadphones size={22} />, title: "24/7 Support", body: "Real humans available around the clock via chat, email, or phone. Your satisfaction is our round-the-clock priority." },
];

const VALUES = [
  { icon: <FiAward size={20} />, title: "Quality", body: "We never compromise on materials or finish. Every joint, every curve is inspected before it leaves our workshop." },
  { icon: <FiZap size={20} />, title: "Innovation", body: "We invest in design R&D every year, exploring new forms and sustainable production techniques." },
  { icon: <FiCheckCircle size={20} />, title: "Integrity", body: "Honest pricing, honest timelines, honest conversations — our word is our contract." },
  { icon: <FiGlobe size={20} />, title: "Sustainability", body: "All wood is FSC-certified. We plant two trees for every tree used and run a zero-landfill production facility." },
  { icon: <FiHeart size={20} />, title: "Customer First", body: "Every decision we make — from thread count to packaging — is filtered through one question: would our customer love this?" },
  { icon: <FiStar size={20} />, title: "Excellence", body: "Good is never good enough. We pursue mastery in every detail, because your home deserves nothing less." },
];

const STATS = [
  { value: "15+", label: "Years of Experience" },
  { value: "25K+", label: "Happy Customers" },
  { value: "5K+", label: "Products Delivered" },
  { value: "150+", label: "Team Members" },
];

const TEAM = [
  {
    name: "Arjun Mehra",
    role: "Founder & CEO",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "A self-taught woodworker turned entrepreneur, Arjun founded Nestro with a single dining table and an obsession with honest craft. He still visits the workshop every morning.",
  },
  {
    name: "Priya Sharma",
    role: "Creative Director",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    bio: "Priya trained at the National Institute of Design and spent five years in Milan before bringing her refined aesthetic to Nestro's product catalogue.",
  },
  {
    name: "Rahul Kapoor",
    role: "Operations Manager",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    bio: "Rahul built Nestro's supply chain from scratch, ensuring every artisan is paid fairly, every delivery is on time, and every customer receives a flawless experience.",
  },
  {
    name: "Sneha Rao",
    role: "Customer Success Lead",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    bio: "Sneha leads a team of 20 specialists dedicated to post-purchase happiness. She personally reads every feedback form submitted to Nestro.",
  },
];

const TESTIMONIALS = [
  {
    name: "Vikram Nair",
    img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80",
    review: "The walnut dining table from Nestro is the centrepiece of our home. Guests always ask where we got it. Quality that truly justifies the price — I couldn't be happier.",
    location: "Mumbai",
  },
  {
    name: "Ananya Bose",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    review: "I was nervous ordering furniture online, but Nestro's team walked me through every step. The sofa arrived perfectly wrapped and was assembled in under an hour. Absolutely stunning.",
    location: "Bengaluru",
  },
  {
    name: "Rohan Gupta",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    review: "Five stars is not enough. We've furnished three rooms entirely with Nestro pieces. The consistency in quality across different product lines is remarkable. This is a brand you can trust.",
    location: "New Delhi",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#faf8f5]">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[55vh] min-h-[380px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80"
            alt="Nestro showroom"
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1007]/60 to-[#1a1007]/20" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <SectionLabel>Est. 2009 · New Delhi, India</SectionLabel>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight max-w-3xl">
            Where Every Room Tells{" "}
            <em className="italic text-[#d9b48b] font-normal">a Story</em>
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
            Nestro was born from one simple belief — that beautifully crafted furniture
            transforms a house into a home. We have spent fifteen years making that
            belief a reality for families across India.
          </p>
        </div>
      </section>

      {/* ── 2. OUR STORY ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[320px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl order-last lg:order-first">
              <Image
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80"
                alt="Nestro workshop"
                fill sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-5 left-5 bg-[#3a2418] text-white rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-2xl font-bold">15+</p>
                <p className="text-xs text-[#d9b48b] uppercase tracking-wider">Years of Craft</p>
              </div>
            </div>
            <div>
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-light text-[#1a1007] leading-snug mb-6">
                A Passion for Furniture,<br />
                <span className="text-[#a46d43]">Built Over a Decade</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                <p>Nestro began in 2009 in a modest workshop in South Delhi, where our founder Arjun Mehra handcrafted his first dining table for a neighbour. That single piece sparked a movement — word spread not because of advertising, but because the table was simply beautiful and built to last.</p>
                <p>By 2014 we had outgrown three workshops and opened our first flagship showroom in Saket. Our design philosophy sharpened: draw from Scandinavian minimalism, ground it in Indian craftsmanship, and let natural materials speak for themselves. Teak, sheesham, cane, and hand-woven fabrics became our signature language.</p>
                <p>Today Nestro employs over 150 artisans, designers, and logistics specialists. We have furnished more than 25,000 homes and received recognition from leading interior design publications. But our proudest achievement remains unchanged — every customer who says their Nestro piece is the first thing guests notice when they walk in.</p>
                <p>We are not just selling furniture. We are helping people create the backdrop for their most important moments — family dinners, lazy Sunday mornings, late-night conversations. That responsibility keeps every member of our team accountable to the highest standard of craft.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MISSION + VISION ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#2b180f]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a46d43]/20 mb-6">
                <FiHeart size={22} className="text-[#d9b48b]" />
              </div>
              <SectionLabel>Our Mission</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-light text-white mb-5">Craft. Deliver. Delight.</h2>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                Our mission is to make premium, sustainably crafted furniture accessible to every Indian household — not just the privileged few. We combine rigorous quality standards, transparent pricing, and end-to-end service to ensure that choosing Nestro is never a compromise. From the first sketch to the final assembly in your home, we obsess over every detail so you never have to.
              </p>
              <ul className="mt-6 space-y-2.5">
                {["Deliver furniture built to last a lifetime", "Use sustainable, responsibly sourced materials", "Keep pricing honest and transparent", "Provide service that exceeds expectations"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                    <FiCheckCircle size={16} className="text-[#a46d43] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a46d43]/20 mb-6">
                <FiGlobe size={22} className="text-[#d9b48b]" />
              </div>
              <SectionLabel>Our Vision</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-light text-white mb-5">India's Most Loved Furniture Brand</h2>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                We envision a future where every home in India has at least one Nestro piece — not because we pushed it on them, but because they actively sought it out. A future where sustainable furniture is the default, not the exception. Where buying a sofa or a bookcase is as joyful as the moment you first sit on it or stack your favourite reads in it. We are building toward that future, one beautifully made piece at a time.
              </p>
              <ul className="mt-6 space-y-2.5">
                {["Expand to 50 cities by 2028", "Achieve carbon-neutral production by 2027", "Launch a trade programme for interior designers", "Open Nestro Experience Studios nationwide"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                    <FiCheckCircle size={16} className="text-[#a46d43] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <SectionLabel>Why Nestro</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1a1007]">
              Six Reasons Families <span className="text-[#a46d43]">Choose Us</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE.map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-3xl p-7 shadow-sm border border-[#ede9e3] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf0e8] text-[#a46d43] mb-5 group-hover:bg-[#3a2418] group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1a1007] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. OUR VALUES ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#f0ebe4]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <SectionLabel>What We Stand For</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1a1007]">
              The Values That <span className="text-[#a46d43]">Guide Us</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="flex gap-4 bg-white rounded-2xl p-6 shadow-sm border border-[#ede9e3]">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-[#faf0e8] text-[#a46d43]">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1007] mb-1">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. STATISTICS ───────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#3a2418]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="py-4">
                <p className="text-4xl sm:text-5xl font-bold text-white">{s.value}</p>
                <p className="mt-2 text-sm sm:text-base text-[#d9b48b] uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. MEET OUR TEAM ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <SectionLabel>The People Behind Nestro</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1a1007]">
              Meet Our <span className="text-[#a46d43]">Team</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {TEAM.map((member) => (
              <div key={member.name} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-[#ede9e3] hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1a1007] text-base">{member.name}</h3>
                  <p className="text-[#a46d43] text-xs font-semibold uppercase tracking-wider mt-0.5 mb-3">{member.role}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#f0ebe4]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <SectionLabel>What Customers Say</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1a1007]">
              Stories from <span className="text-[#a46d43]">Our Families</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-7 shadow-sm border border-[#ede9e3] flex flex-col gap-5">
                {/* Stars */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiStar key={i} size={14} className="text-[#a46d43] fill-[#a46d43]" />
                  ))}
                </div>
                {/* Review */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  &ldquo;{t.review}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#f0ebe4]">
                  <div className="relative h-11 w-11 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={t.img}
                      alt={t.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1a1007]">{t.name}</p>
                    <p className="text-xs text-[#9a8a7a]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CALL TO ACTION ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <SectionLabel>Take the Next Step</SectionLabel>
          <h2 className="text-3xl sm:text-5xl font-light text-[#1a1007] leading-snug mb-5">
            Ready to Transform<br />
            <span className="text-[#a46d43]">Your Home?</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Browse our curated collection of premium furniture — each piece designed
            to bring warmth, character, and lasting quality into your living space.
            Free delivery. Expert assembly. 30-day returns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/store"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[#3a2418] text-white text-sm font-semibold hover:bg-[#2a1a10] transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Shop Now →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-[#3a2418] text-[#3a2418] text-sm font-semibold hover:bg-[#3a2418] hover:text-white transition-all duration-200 w-full sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

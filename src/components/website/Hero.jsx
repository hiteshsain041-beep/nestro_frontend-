import Link from "next/link";

export default function Hero() {
    return (
        <section className="w-full px-4 md:px-6 py-4 md:py-6 bg-[#faf8f5]">
            <div className="max-w-7xl mx-auto">
                <div className="w-full bg-[#2b180f] rounded-[24px] overflow-hidden min-h-[340px] md:min-h-[380px]">

                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center h-full px-8 sm:px-12 lg:px-16 py-12 lg:py-10 gap-8">

                        {/* ── LEFT CONTENT ───────────────────────────── */}
                        <div className="flex flex-col justify-center">

                            {/* Label */}
                            <p className="text-[#a87a52] uppercase tracking-[0.2em] text-[11px] font-semibold mb-5">
                                Summer Collection 2026
                            </p>

                            {/* Heading */}
                            <h1 className="text-white font-light leading-[1.08]">
                                <span className="text-[40px] sm:text-[52px] lg:text-[56px] block">
                                    Where Comfort
                                </span>
                                <span className="text-[40px] sm:text-[52px] lg:text-[56px]">
                                    Meets{" "}
                                    <em className="italic text-[#d9b48b] font-normal not-italic" style={{ fontStyle: "italic" }}>
                                        Craft
                                    </em>
                                </span>
                            </h1>

                            {/* Description */}
                            <div className="mt-6 space-y-1.5">
                                <p className="text-[#9a8a7a] text-[15px] sm:text-[16px] leading-relaxed">
                                    Scandinavian-inspired furniture for modern living.
                                </p>
                                <p className="text-[#9a8a7a] text-[15px] sm:text-[16px] leading-relaxed">
                                    Curated pieces that endure seasons.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                <Link
                                    href="/store"
                                    className="inline-flex items-center justify-center gap-2.5 h-11 px-7 rounded-xl bg-[#a46d43] hover:bg-[#b87d53] text-white text-[14px] font-semibold transition-all duration-200"
                                >
                                    Shop Collection
                                    <span className="text-[16px] leading-none">→</span>
                                </Link>

                                <Link
                                    href="/lookbook"
                                    className="inline-flex items-center justify-center h-11 px-7 rounded-xl border border-[#5a3a28] text-[#d9cbbf] text-[14px] font-medium hover:bg-[#3a2418] hover:border-[#3a2418] hover:text-white transition-all duration-200"
                                >
                                    View Lookbook
                                </Link>
                            </div>
                        </div>

                        {/* ── RIGHT — Furniture illustration ─────────── */}
                        <div className="relative flex items-center justify-center min-h-[200px] lg:min-h-[280px]">
                            {/* Warm ambient glow */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[300px] h-[200px] bg-[#8b5e3b]/25 blur-[80px] rounded-full" />
                            </div>

                            {/* Sofa SVG illustration matching the screenshot */}
                            <svg
                                viewBox="0 0 440 240"
                                className="relative w-full max-w-[420px] drop-shadow-2xl"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Back rest */}
                                <rect x="40" y="60" width="360" height="90" rx="18" fill="#6b4226" opacity="0.85" />
                                {/* Seat */}
                                <rect x="30" y="140" width="380" height="60" rx="14" fill="#7d4f30" opacity="0.9" />
                                {/* Left armrest */}
                                <rect x="20" y="110" width="50" height="90" rx="14" fill="#5c3820" opacity="0.9" />
                                {/* Right armrest */}
                                <rect x="370" y="110" width="50" height="90" rx="14" fill="#5c3820" opacity="0.9" />
                                {/* Left leg */}
                                <rect x="50" y="196" width="16" height="30" rx="5" fill="#4a2e16" />
                                {/* Right leg */}
                                <rect x="374" y="196" width="16" height="30" rx="5" fill="#4a2e16" />
                                {/* Centre divider cushion line */}
                                <line x1="220" y1="142" x2="220" y2="198" stroke="#5c3820" strokeWidth="2" opacity="0.6" />
                                {/* Cushion highlight */}
                                <rect x="55" y="148" width="155" height="44" rx="10" fill="#9b6040" opacity="0.35" />
                                <rect x="230" y="148" width="155" height="44" rx="10" fill="#9b6040" opacity="0.35" />
                            </svg>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

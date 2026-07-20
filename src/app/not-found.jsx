import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-[#F8F5F2] flex items-center justify-center px-6">

      <div className="max-w-2xl text-center">

        {/* 404 */}
        <h1 className="text-[120px] md:text-[180px] font-bold leading-none text-[#D8CFC8]">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-semibold text-[#2A170F] -mt-6">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          The furniture piece you're looking for may have been moved,
          renamed, or is temporarily unavailable.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Link
            href="/"
            className="px-8 py-4 rounded-xl bg-[#A46D43] text-white font-medium hover:bg-[#BC8458] transition"
          >
            Back To Home
          </Link>

          <Link
            href="/store"
            className="px-8 py-4 rounded-xl border border-[#A46D43] text-[#A46D43] font-medium hover:bg-[#A46D43] hover:text-white transition"
          >
            Browse Collection
          </Link>

        </div>

        {/* Decorative Furniture Icon */}
        <div className="mt-16 text-7xl">
          🛋️
        </div>

      </div>

    </section>
  );
}
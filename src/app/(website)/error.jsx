"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}) {
    useEffect(() => {
        // console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2] px-6">

            <div className="max-w-xl text-center">

                {/* Error Code */}
                <h1 className="text-[100px] md:text-[140px] font-bold text-[#D8CFC8]">
                    500
                </h1>

                {/* Heading */}
                <h2 className="text-3xl md:text-5xl font-semibold text-[#2A170F]">
                    Something Went Wrong
                </h2>

                {/* Description */}
                <p className="mt-5 text-gray-600 leading-relaxed">
                    We encountered an unexpected error while loading this page.
                    Please try again or return to the homepage.
                </p>

                {/* Buttons */}
                <div className="mt-10 flex flex-wrap justify-center gap-4">

                    <button
                        onClick={() => reset()}
                        className="px-8 py-4 rounded-xl bg-[#A46D43] text-white font-medium hover:bg-[#BC8458] transition"
                    >
                        Try Again
                    </button>

                    <a
                        href="/"
                        className="px-8 py-4 rounded-xl border border-[#A46D43] text-[#A46D43] font-medium hover:bg-[#A46D43] hover:text-white transition"
                    >
                        Go Home
                    </a>

                </div>

                {/* Icon */}
                <div className="mt-14 text-6xl">
                    ⚠️
                </div>

            </div>

        </div>
    );
}
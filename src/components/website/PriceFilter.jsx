'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';

export default function PriceFilter() {
    const [min, setMin] = useState(800);
    const [max, setMax] = useState(50000);
    const router = useRouter();

    const searchParams = useSearchParams();


    function applyFilter() {
        const params = new URLSearchParams(searchParams.toString())
        params.set("min", min)
        params.set("max", max)
        router.push(`?${params.toString()}`);
    }
    return (

        < div className="border-b border-gray-200 pb-8" >
            <h3 className="mb-5 text-xl font-semibold text-gray-800">
                Price Range
            </h3>

            <div className="space-y-3">
                <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                    placeholder="Min Price"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                />

                <input
                    type="number"
                    placeholder="Max Price"
                    onChange={(e) => setMax(Number(e.target.value))}
                    value={max}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                />

                <button
                    onClick={applyFilter}

                    className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    Apply Filter
                </button>
            </div>
        </div >
    )
}

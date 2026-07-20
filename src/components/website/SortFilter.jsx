'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortFilter() {

    const router = useRouter();
    const searchParams = useSearchParams();

    function applyFilter(value) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("sort", value)
        router.push(`?${params.toString()}`);
    }
    return (
        <div className="mb-8 flex items-center justify-between rounded-xl  bg-white px-6 py-5 shadow-sm">
            <p className="text-gray-600">
                <span className="font-semibold text-black"></span> Products Found
            </p>

            <select onChange={(e) => applyFilter(e.target.value)} className="rounded-lg border px-4 py-2 text-sm outline-none">
                <option value="asc">Price: Low To High</option>
                <option value="desc">Price: High To Low</option>
                <option value="createAt" >Newest</option>
            </select>
        </div >
    )
}

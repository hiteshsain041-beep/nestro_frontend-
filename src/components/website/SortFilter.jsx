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
        <div>
            <div className="flex items-center justify-end">
                <select onChange={(e) => applyFilter(e.target.value)} className="rounded-lg border px-4 py-2 text-sm outline-none bg-white">
                    <option value="asc">Price: Low To High</option>
                    <option value="desc">Price: High To Low</option>
                    <option value="createAt">Newest</option>
                </select>
            </div>
        </div>
    )
}

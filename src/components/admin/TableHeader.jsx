import React from 'react'
import Link from 'next/link'

export default function TableHeader({ title = "Data", path = "/admin" }) {
    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 className="text-xl lg:text-2xl font-black tracking-tight text-gray-900">
                    {title} List
                </h1>


            </div>
            <Link href={path}>
                <button className="h-11 rounded-2xl bg-black px-5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:bg-gray-900">
                    + Create {title}
                </button>
            </Link>


        </div>
    )
}

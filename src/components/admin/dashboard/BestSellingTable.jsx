"use client";

import React from "react";
import Image from "next/image";
import { FiTrendingUp } from "react-icons/fi";

function fmt(n) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(n ?? 0);
}

export default function BestSellingTable({ products = [], loading = false }) {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiTrendingUp size={15} className="text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-800">Best Selling Products</h3>
                    <p className="text-xs text-gray-400">Top performers by units sold</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="text-left px-5 py-3 font-semibold">#</th>
                            <th className="text-left px-5 py-3 font-semibold">Product</th>
                            <th className="text-left px-5 py-3 font-semibold">Category</th>
                            <th className="text-right px-5 py-3 font-semibold">Sold</th>
                            <th className="text-right px-5 py-3 font-semibold">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-5 py-4">
                                        <div className="w-5 h-3 rounded bg-gray-200" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
                                            <div className="w-28 h-3 rounded bg-gray-200" />
                                        </div>
                                    </td>
                                    {[0, 1, 2].map((j) => (
                                        <td key={j} className="px-5 py-4">
                                            <div className="h-3 rounded bg-gray-100 w-12 ml-auto" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading && products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-14 text-center text-gray-400">
                                    <FiTrendingUp size={30} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-medium">No sales data yet</p>
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            products.map((p, idx) => (
                                <tr key={p._id ?? idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold ${idx === 0
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : idx === 1
                                                        ? "bg-gray-200 text-gray-600"
                                                        : idx === 2
                                                            ? "bg-orange-100 text-orange-600"
                                                            : "bg-gray-50 text-gray-400"
                                                }`}
                                        >
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                {p.thumbnail ? (
                                                    <Image
                                                        src={p.thumbnail}
                                                        alt={p.name ?? ""}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                                                        No img
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-800 text-sm line-clamp-1">
                                                {p.name ?? "Unknown Product"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-gray-500">{p.category ?? "—"}</td>
                                    <td className="px-5 py-3.5 text-right">
                                        <span className="font-semibold text-gray-800">{p.soldQty ?? 0}</span>
                                        <span className="text-xs text-gray-400 ml-1">units</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-600 whitespace-nowrap">
                                        {fmt(p.revenue)}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

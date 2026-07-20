"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiAlertTriangle, FiEdit2 } from "react-icons/fi";

export default function LowStockTable({ products = [], loading = false }) {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <FiAlertTriangle size={15} className="text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800">Low Stock Products</h3>
                        <p className="text-xs text-gray-400">Needs immediate attention</p>
                    </div>
                </div>
                <Link
                    href="/admin/product"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition px-3 py-1.5 rounded-xl border border-indigo-100 hover:bg-indigo-50"
                >
                    Manage →
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="text-left px-5 py-3 font-semibold">Product</th>
                            <th className="text-left px-5 py-3 font-semibold">Category</th>
                            <th className="text-center px-5 py-3 font-semibold">Stock</th>
                            <th className="text-center px-5 py-3 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
                                            <div className="w-32 h-3 rounded bg-gray-200" />
                                        </div>
                                    </td>
                                    {[0, 1, 2].map((j) => (
                                        <td key={j} className="px-5 py-4">
                                            <div className="h-3 rounded bg-gray-100 w-16 mx-auto" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading && products.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-14 text-center text-gray-400">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                        <FiAlertTriangle size={18} className="text-green-600" />
                                    </div>
                                    <p className="text-sm font-medium text-green-700">All products are in stock</p>
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            products.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                {p.thumbnail ? (
                                                    <Image
                                                        src={p.thumbnail}
                                                        alt={p.name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                                        No img
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-800 text-sm line-clamp-1">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-gray-500">
                                        {p.categoryId?.name ?? "—"}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                                            Out of Stock
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <Link
                                            href={`/admin/product/edit/${p._id}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 hover:text-gray-900 transition"
                                        >
                                            <FiEdit2 size={11} /> Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import { FiEye, FiPackage, FiRefreshCw } from "react-icons/fi";

const ORDER_STATUS = {
    placed: { label: "Placed", cls: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmed", cls: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", cls: "bg-purple-100 text-purple-800" },
    out_for_delivery: { label: "Out for Delivery", cls: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Delivered", cls: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-800" },
    return: { label: "Return", cls: "bg-orange-100 text-orange-800" },
};

const PAYMENT_STATUS = {
    paid: { label: "Paid", cls: "bg-green-100 text-green-700" },
    pending: { label: "Pending", cls: "bg-orange-100 text-orange-700" },
    failed: { label: "Failed", cls: "bg-red-100 text-red-700" },
};

function Badge({ map, value }) {
    const cfg = map[value] ?? { label: value ?? "—", cls: "bg-gray-100 text-gray-600" };
    return (
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
}

function fmt(n) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(n ?? 0);
}

function fmtDate(d) {
    return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

export default function OrdersTable({ orders = [], loading = false, onRefresh }) {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                    <h3 className="text-base font-bold text-gray-800">Recent Orders</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Latest customer purchases</p>
                </div>
                <div className="flex items-center gap-2">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition disabled:opacity-40"
                        >
                            <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        </button>
                    )}
                    <Link
                        href="/admin/orders"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition px-3 py-1.5 rounded-xl border border-indigo-100 hover:bg-indigo-50"
                    >
                        View All →
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="text-left px-5 py-3 font-semibold">Order ID</th>
                            <th className="text-left px-5 py-3 font-semibold">Customer</th>
                            <th className="text-right px-5 py-3 font-semibold">Amount</th>
                            <th className="text-left px-5 py-3 font-semibold">Payment</th>
                            <th className="text-left px-5 py-3 font-semibold">Status</th>
                            <th className="text-left px-5 py-3 font-semibold">Date</th>
                            <th className="text-center px-5 py-3 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {/* Skeleton */}
                        {loading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <td key={j} className="px-5 py-4">
                                            <div className="h-3 rounded bg-gray-100" style={{ width: `${55 + (j % 3) * 15}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {/* Empty */}
                        {!loading && orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-14 text-center text-gray-400">
                                    <FiPackage size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-medium">No orders yet</p>
                                </td>
                            </tr>
                        )}

                        {/* Rows */}
                        {!loading &&
                            orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs text-indigo-600 font-semibold whitespace-nowrap">
                                        #{String(order._id).slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="font-medium text-gray-800 text-sm">
                                            {order.shippingAddress?.fullName ?? order.user?.name ?? "—"}
                                        </p>
                                        {order.shippingAddress?.mobile && (
                                            <p className="text-[11px] text-gray-400">{order.shippingAddress.mobile}</p>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-bold text-gray-800 whitespace-nowrap">
                                        {fmt(order.totalAmount)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Badge map={PAYMENT_STATUS} value={order.paymentStatus} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Badge map={ORDER_STATUS} value={order.orderStatus} />
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                                        {fmtDate(order.createdAt)}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <Link
                                            href="/admin/orders"
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 hover:text-gray-900 transition"
                                        >
                                            <FiEye size={12} /> View
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

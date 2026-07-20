"use client";

import { useEffect, useState } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import {
    FiPackage, FiRefreshCw, FiSearch,
    FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

// ── Status badge configs ──────────────────────────────────────────────────────
const ORDER_STATUS = {
    placed: { label: "Placed", bg: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmed", bg: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", bg: "bg-purple-100 text-purple-800" },
    out_for_delivery: { label: "Out for Delivery", bg: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Delivered", bg: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", bg: "bg-red-100 text-red-800" },
    return: { label: "Return", bg: "bg-orange-100 text-orange-800" },
};

const PAYMENT_STATUS = {
    pending: { label: "Pending", bg: "bg-yellow-100 text-yellow-700" },
    paid: { label: "Paid", bg: "bg-green-100 text-green-700" },
    failed: { label: "Failed", bg: "bg-red-100 text-red-700" },
};

function Badge({ map, value }) {
    const cfg = map[value] ?? { label: value, bg: "bg-gray-100 text-gray-600" };
    return (
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cfg.bg}`}>
            {cfg.label}
        </span>
    );
}

function formatCurrency(n) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(d) {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_OPTIONS = ["all", "placed", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled", "return"];
const PAYMENT_OPTIONS = ["all", "pending", "paid", "failed"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const LIMIT = 10;

    async function fetchOrders(pg = page) {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pg,
                limit: LIMIT,
                sortBy: "createdAt",
                sortOrder: "desc",
            });
            if (search.trim()) params.set("search", search.trim());
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (paymentFilter !== "all") params.set("paymentStatus", paymentFilter);

            const { data } = await client.get(`order?${params.toString()}`);
            if (data.success) {
                setOrders(data.orders || []);
                setPagination(data.pagination || { total: 0, totalPages: 1 });
            }
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchOrders(1); setPage(1); }, [statusFilter, paymentFilter]);
    useEffect(() => { fetchOrders(page); }, [page]);

    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        fetchOrders(1);
    }

    return (
        <div className="min-h-screen bg-[#f7f8fd] p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-[#2a3460]">Orders</h1>
                    <p className="text-sm text-[#7a84a6] mt-0.5">
                        {pagination.total} total order{pagination.total !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => fetchOrders(page)}
                    className="inline-flex items-center gap-2 text-sm text-[#3b497e] border border-[#c3c9e3] px-4 py-2 rounded-xl hover:bg-[#f4f5fb] transition self-start sm:self-auto"
                >
                    <FiRefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8a7a]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or mobile…"
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#c3c9e3] rounded-xl outline-none focus:border-[#3b497e] transition"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2.5 bg-[#3b497e] text-white text-sm rounded-xl hover:bg-[#2a3460] transition">
                        Search
                    </button>
                </form>

                {/* Status */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-sm border border-[#c3c9e3] rounded-xl px-3 py-2.5 outline-none focus:border-[#3b497e] text-[#3a3f5c] bg-white"
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s === "all" ? "All Statuses" : ORDER_STATUS[s]?.label ?? s}</option>
                    ))}
                </select>

                {/* Payment */}
                <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="text-sm border border-[#c3c9e3] rounded-xl px-3 py-2.5 outline-none focus:border-[#3b497e] text-[#3a3f5c] bg-white"
                >
                    {PAYMENT_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s === "all" ? "All Payments" : PAYMENT_STATUS[s]?.label ?? s}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#3b497e] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-[#9a8a7a]">
                        <FiPackage size={40} className="mb-3 text-[#c3c9e3]" />
                        <p className="text-sm font-medium">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#f7f8fd] border-b border-[#eef0f8] text-[#7a84a6] text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="text-left px-5 py-3">Order ID</th>
                                    <th className="text-left px-5 py-3">Customer</th>
                                    <th className="text-left px-5 py-3">Date</th>
                                    <th className="text-left px-5 py-3">Items</th>
                                    <th className="text-right px-5 py-3">Total</th>
                                    <th className="text-left px-5 py-3">Payment</th>
                                    <th className="text-left px-5 py-3">Method</th>
                                    <th className="text-left px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0f0f8]">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-[#fafbff] transition">
                                        <td className="px-5 py-4 font-mono text-xs text-[#3b497e]">
                                            #{String(order._id).slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-[#2a3460]">{order.shippingAddress?.fullName ?? "—"}</p>
                                            <p className="text-[11px] text-[#9a8a7a]">{order.shippingAddress?.mobile}</p>
                                        </td>
                                        <td className="px-5 py-4 text-[#7a84a6]">{formatDate(order.createdAt)}</td>
                                        <td className="px-5 py-4 text-center">{order.items?.length ?? 0}</td>
                                        <td className="px-5 py-4 text-right font-semibold text-[#2a3460]">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge map={PAYMENT_STATUS} value={order.paymentStatus} />
                                        </td>
                                        <td className="px-5 py-4 text-[#7a84a6] capitalize">
                                            {order.paymentMethod === "cod" ? "COD" : "Online"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge map={ORDER_STATUS} value={order.orderStatus} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-[#eef0f8] text-sm text-[#7a84a6]">
                        <span>
                            Page {page} of {pagination.totalPages} &middot; {pagination.total} orders
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#c3c9e3] disabled:opacity-40 hover:bg-[#f4f5fb] transition"
                            >
                                <FiChevronLeft size={14} /> Prev
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#c3c9e3] disabled:opacity-40 hover:bg-[#f4f5fb] transition"
                            >
                                Next <FiChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

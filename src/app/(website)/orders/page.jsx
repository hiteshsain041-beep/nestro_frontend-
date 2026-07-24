"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FiPackage,
    FiClock,
    FiTruck,
    FiCheckCircle,
    FiXCircle,
    FiShoppingBag,
    FiCalendar,
    FiMapPin,
    FiCreditCard,
    FiRefreshCw,
} from "react-icons/fi";

// ── Status badge config ───────────────────────────────────────────────────────
const ORDER_STATUS = {
    placed: { label: "Placed", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
    out_for_delivery: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
    return: { label: "Return", color: "bg-orange-100 text-orange-800" },
};

const PAYMENT_STATUS = {
    pending: { label: "Pending", color: "bg-orange-100 text-orange-700" },
    paid: { label: "Paid", color: "bg-green-100 text-green-700" },
    failed: { label: "Failed", color: "bg-red-100 text-red-700" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function shortId(id) {
    return String(id).slice(-8).toUpperCase();
}

function StatusBadge({ map, value }) {
    const cfg = map[value] ?? { label: value, color: "bg-gray-100 text-gray-600" };
    return (
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
            {cfg.label}
        </span>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    async function fetchOrders() {
        setLoading(true);
        setError(null);
        try {
            // Use Next.js BFF proxy — avoids cross-domain cookie issue on mobile
            const res = await fetch("/api/order/my-orders", {
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders || []);
            } else {
                setError(data.message || "Failed to fetch orders");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-[#9a8a7a]">
                    <div className="w-12 h-12 border-4 border-[#d9b48b] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium">Loading your orders…</p>
                </div>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiXCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1a1007] mb-2">Something went wrong</h2>
                    <p className="text-[#9a8a7a] text-sm mb-6">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="inline-flex items-center gap-2 bg-[#2b180f] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3d2517] transition"
                    >
                        <FiRefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ── Empty state ───────────────────────────────────────────────────────────
    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-[#f0ebe4] rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiPackage className="w-12 h-12 text-[#d9b48b]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1a1007] mb-2">No Orders Found</h2>
                    <p className="text-[#9a8a7a] text-sm mb-8 max-w-xs mx-auto">
                        You haven&apos;t placed any orders yet. Explore our collection and find something you love.
                    </p>
                    <Link
                        href="/store"
                        className="inline-flex items-center gap-2 bg-[#2b180f] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#3d2517] transition"
                    >
                        <FiShoppingBag className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // ── Orders list ───────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#faf8f5] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#1a1007] tracking-tight">My Orders</h1>
                    <p className="text-[#9a8a7a] text-sm mt-1">
                        {orders.length} order{orders.length !== 1 ? "s" : ""} total
                    </p>
                </div>

                {/* Order cards */}
                <div className="space-y-5">
                    {orders.map((order) => {
                        const isExpanded = expandedId === order._id;
                        const orderCfg = ORDER_STATUS[order.orderStatus] ?? { label: order.orderStatus, color: "bg-gray-100 text-gray-600" };

                        return (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] overflow-hidden"
                            >
                                {/* Card header */}
                                <div className="p-5 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                        {/* Left: ID + date */}
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-semibold text-[#9a8a7a] uppercase tracking-wider">
                                                    Order #{shortId(order._id)}
                                                </span>
                                                <StatusBadge map={ORDER_STATUS} value={order.orderStatus} />
                                                <StatusBadge map={PAYMENT_STATUS} value={order.paymentStatus} />
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-[#9a8a7a]">
                                                <span className="flex items-center gap-1">
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    {formatDate(order.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FiPackage className="w-3.5 h-3.5" />
                                                    {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: total + payment method */}
                                        <div className="sm:text-right">
                                            <p className="text-xl font-black text-[#2b180f]">
                                                {formatCurrency(order.totalAmount)}
                                            </p>
                                            <p className="text-xs text-[#9a8a7a] mt-0.5 flex items-center gap-1 sm:justify-end capitalize">
                                                <FiCreditCard className="w-3.5 h-3.5" />
                                                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Shipping address summary */}
                                    {order.shippingAddress && (
                                        <div className="mt-3 flex items-start gap-1.5 text-xs text-[#9a8a7a]">
                                            <FiMapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                            <span>
                                                {order.shippingAddress.fullName} &mdash;&nbsp;
                                                {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                                            </span>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                            className="text-xs font-semibold px-4 py-2 rounded-full border border-[#d9b48b] text-[#2b180f] hover:bg-[#faf0e8] transition"
                                        >
                                            {isExpanded ? "Hide Items" : "View Items"}
                                        </button>
                                        <button
                                            disabled
                                            title="Coming soon"
                                            className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 text-gray-400 cursor-not-allowed"
                                        >
                                            <FiTruck className="inline w-3.5 h-3.5 mr-1" />
                                            Track Order
                                        </button>
                                        <button
                                            disabled
                                            title="Coming soon"
                                            className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 text-gray-400 cursor-not-allowed"
                                        >
                                            Download Invoice
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded items list */}
                                {isExpanded && (
                                    <div className="border-t border-[#f0ebe4] bg-[#faf8f5]">
                                        {(order.items ?? []).map((item, idx) => (
                                            <ProductRow key={item.product_id?._id ?? idx} item={item} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

// ── Product row sub-component ─────────────────────────────────────────────────
function ProductRow({ item }) {
    const product = item.product_id; // populated by backend
    const name = product?.name ?? "Product";
    const thumbnail = product?.thumbnail ?? "";
    const price = item.price;
    const qty = item.qty;
    const total = item.total;

    return (
        <div className="flex items-center gap-4 px-5 sm:px-6 py-4 border-b border-[#f0ebe4] last:border-b-0">
            {/* Image */}
            <div className="w-14 h-14 rounded-xl bg-[#f0ebe4] overflow-hidden shrink-0 flex items-center justify-center">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <FiPackage className="w-6 h-6 text-[#c9b9a8]" />
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a1007] truncate">{name}</p>
                <p className="text-xs text-[#9a8a7a] mt-0.5">
                    Qty: {qty} &times; {formatCurrency(price)}
                </p>
            </div>

            {/* Total */}
            <p className="text-sm font-bold text-[#2b180f] shrink-0">
                {formatCurrency(total)}
            </p>
        </div>
    );
}

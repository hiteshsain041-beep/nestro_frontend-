'use client';

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRazorpay } from "react-razorpay";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cartSlice";
import AddressSection from "@/components/website/AddressSection";
import Link from "next/link";
import {
    FiTruck, FiCreditCard, FiLock, FiAlertCircle,
    FiCheckCircle, FiXCircle, FiRefreshCw,
} from "react-icons/fi";

// ── Payment result states ─────────────────────────────────────────────────────
// null | "success" | "failed" | "cancelled"
const RESULT_CONFIG = {
    success: {
        icon: <FiCheckCircle size={40} className="text-green-500" />,
        title: "Payment Successful!",
        color: "bg-green-50 border-green-100",
    },
    failed: {
        icon: <FiXCircle size={40} className="text-red-500" />,
        title: "Payment Failed",
        color: "bg-red-50 border-red-100",
    },
    cancelled: {
        icon: <FiAlertCircle size={40} className="text-amber-500" />,
        title: "Payment Cancelled",
        color: "bg-amber-50 border-amber-100",
    },
};

export default function Checkout({ user }) {
    const { Razorpay } = useRazorpay();
    const router = useRouter();
    const dispatch = useDispatch();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [payment, setPayment] = useState("cod");
    const [placing, setPlacing] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);   // null | "success" | "failed" | "cancelled"
    const [paymentMessage, setPaymentMessage] = useState("");
    const [successOrderId, setSuccessOrderId] = useState(null);

    function wipeCart() {
        dispatch(clearCart());
        localStorage.removeItem("cart");
    }

    async function orderHandler() {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }
        if (placing) return;
        setPlacing(true);
        setPaymentResult(null);

        try {
            const shippingAddress = {
                fullName: selectedAddress.fullName,
                mobile: selectedAddress.mobile,
                pincode: selectedAddress.pincode,
                addressLine: selectedAddress.address,
                city: selectedAddress.city,
                state: selectedAddress.state,
            };

            // ── Use Next.js BFF proxy — NOT direct axios to Render ───────────
            // Mobile browsers block cross-domain cookies; BFF reads the jwt
            // cookie server-side and adds Authorization: Bearer header.
            const placeRes = await fetch("/api/order/place", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    paymentMethod: payment,
                    shippingAddress,
                }),
            });

            const response = { data: await placeRes.json() };

            if (placeRes.status === 401) {
                setPlacing(false);
                toast.error("Session expired. Please sign in again.");
                return;
            }

            if (!response.data.success && payment === "cod") {
                setPlacing(false);
                toast.error(response.data.message || "Failed to place order.");
                return;
            }

            // ── COD ──────────────────────────────────────────────────────────
            if (payment === "cod") {
                if (response.data.success) {
                    wipeCart();
                    setPlacing(false);
                    toast.success("Order placed successfully!");
                    router.push(`/thank-you?order_id=${response.data.orderId}`);
                }
                return;
            }

            // ── Online — Razorpay ─────────────────────────────────────────────
            if (!response.data.success) {
                setPlacing(false);
                toast.error(response.data.message || "Failed to create payment order.");
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                currency: "INR",
                amount: response.data.total,
                name: "Nestro",
                description: "Order Payment",
                order_id: response.data.razorpay_order_id,

                handler: async (paymentResponse) => {
                    try {
                        // Also proxy the verify call through BFF
                        const verifyRes = await fetch("/api/order/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify(paymentResponse),
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            wipeCart();
                            setSuccessOrderId(verifyData.orderId);
                            setPaymentMessage("Your payment has been confirmed and your order is placed.");
                            setPaymentResult("success");
                        } else {
                            setPaymentMessage(verifyData.message || "Payment verification failed. Contact support.");
                            setPaymentResult("failed");
                        }
                    } catch {
                        setPaymentMessage("Payment verification failed. Please contact support with your payment ID.");
                        setPaymentResult("failed");
                    } finally {
                        setPlacing(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setPlacing(false);
                        setPaymentMessage("You closed the payment window. Your cart is still saved.");
                        setPaymentResult("cancelled");
                    },
                },

                prefill: {
                    name: selectedAddress.fullName || user?.name || "Guest",
                    email: user?.email || "",
                    contact: selectedAddress.mobile || "",
                },

                theme: { color: "#2b180f" },
            };

            const razorpayInstance = new Razorpay(options);

            razorpayInstance.on("payment.failed", (rzpResponse) => {
                setPlacing(false);
                setPaymentMessage(
                    rzpResponse?.error?.description ||
                    "Your payment could not be processed. Please try a different payment method."
                );
                setPaymentResult("failed");
            });

            razorpayInstance.open();

        } catch (error) {
            setPlacing(false);
            toast.error(error.message || "Something went wrong. Please try again.");
        }
    }

    // ── Payment result screen ─────────────────────────────────────────────────
    if (paymentResult) {
        const cfg = RESULT_CONFIG[paymentResult];
        return (
            <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center px-4 py-10">
                <div className={`w-full max-w-md rounded-2xl border p-8 text-center shadow-sm ${cfg.color}`}>
                    <div className="flex justify-center mb-4">{cfg.icon}</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{cfg.title}</h2>
                    <p className="text-sm text-gray-600 mb-7 leading-relaxed">{paymentMessage}</p>

                    {paymentResult === "success" && (
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push(`/thank-you?order_id=${successOrderId}`)}
                                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition"
                            >
                                <FiCheckCircle size={15} /> View Order Confirmation
                            </button>
                            <Link href="/orders" className="block text-sm text-gray-500 hover:text-gray-800 transition">
                                My Orders →
                            </Link>
                        </div>
                    )}

                    {(paymentResult === "failed" || paymentResult === "cancelled") && (
                        <div className="space-y-3">
                            <button
                                onClick={() => { setPaymentResult(null); setPaymentMessage(""); }}
                                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm transition"
                            >
                                <FiRefreshCw size={15} /> Try Again
                            </button>
                            <Link href="/cart" className="block text-sm text-gray-500 hover:text-gray-800 transition">
                                ← Back to Cart
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── Main checkout UI ──────────────────────────────────────────────────────
    const paymentOptions = [
        {
            value: "cod",
            label: "Cash On Delivery",
            sub: "Pay when your order arrives",
            icon: <FiTruck size={20} />,
        },
        {
            value: "online",
            label: "Online Payment",
            sub: "Debit / Credit / UPI / Net Banking",
            icon: <FiCreditCard size={20} />,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f6f4f1] py-10 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl font-bold text-gray-900 mb-7">Checkout</h1>

                {/* Not logged in — show prompt */}
                {!user && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
                        <FiAlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Please sign in to continue</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                You need to be logged in to save addresses and place orders.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block mt-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-xl transition"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">

                    {/* ── Left: Address + Payment ──────────────────────── */}
                    <div className="md:col-span-2 space-y-5">

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <AddressSection onAddressSelect={setSelectedAddress} />
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {paymentOptions.map(({ value, label, sub, icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setPayment(value)}
                                        className={`relative flex items-center gap-4 rounded-2xl border p-4 text-left transition ${payment === value
                                            ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                                            : "border-gray-200 bg-white hover:border-gray-400"
                                            }`}
                                    >
                                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${payment === value ? "bg-white/20" : "bg-gray-100"
                                            }`}>
                                            {icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold">{label}</p>
                                            <p className={`text-xs mt-0.5 ${payment === value ? "text-gray-300" : "text-gray-400"}`}>
                                                {sub}
                                            </p>
                                        </div>
                                        <div className={`absolute right-4 top-4 h-4 w-4 rounded-full border-2 flex items-center justify-center ${payment === value ? "border-white" : "border-gray-300"
                                            }`}>
                                            {payment === value && <div className="h-2 w-2 rounded-full bg-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Order Summary ─────────────────────────── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 mb-5">Order Summary</h2>

                            {selectedAddress ? (
                                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs space-y-1 mb-5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        Delivering to
                                    </p>
                                    <p className="font-bold text-gray-900 text-sm">{selectedAddress.fullName}</p>
                                    <p className="text-gray-500">📞 {selectedAddress.mobile}</p>
                                    <p className="text-gray-600 leading-relaxed">{selectedAddress.address}</p>
                                    <p className="text-gray-500">
                                        {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-xl border-2 border-dashed border-gray-200 p-5 text-center text-sm text-gray-400 mb-5">
                                    No address selected yet
                                </div>
                            )}

                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                            </div>

                            <button
                                onClick={orderHandler}
                                disabled={!selectedAddress || placing || !user}
                                className="mt-5 w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold
                           hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                           transition text-sm"
                            >
                                {placing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Placing Order…
                                    </span>
                                ) : "Place Order"}
                            </button>

                            {!selectedAddress && user && (
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    Select a delivery address to continue
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                            <FiLock size={12} />
                            Secure &amp; encrypted checkout
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

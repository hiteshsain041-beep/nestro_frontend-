'use client';

import { client } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRazorpay } from "react-razorpay";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cartSlice";
import AddressSection from "@/components/website/AddressSection";
import { FiTruck, FiCreditCard, FiLock } from "react-icons/fi";

export default function Checkout({ user }) {
    const { Razorpay } = useRazorpay();
    const router = useRouter();
    const dispatch = useDispatch();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [payment, setPayment] = useState("cod");
    const [placing, setPlacing] = useState(false);

    function wipeCart() {
        dispatch(clearCart());
        localStorage.removeItem('cart');
    }

    async function orderHandler() {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }
        if (placing) return;
        setPlacing(true);

        try {
            const shippingAddress = {
                fullName: selectedAddress.fullName,
                mobile: selectedAddress.mobile,
                pincode: selectedAddress.pincode,
                addressLine: selectedAddress.address,
                city: selectedAddress.city,
                state: selectedAddress.state,
            };

            const response = await client.post("order/place", {
                paymentMethod: payment,
                shippingAddress,
            });

            if (payment === "cod") {
                if (response.data.success) {
                    wipeCart();
                    toast.success("Order placed successfully!");
                    router.push(`/thank-you?order_id=${response.data.orderId}`);
                }
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                currency: "INR",
                amount: response.data.total,
                name: "Nestro Ltd",
                description: "Order Payment",
                order_id: response.data.razorpay_order_id,
                handler: async (paymentResponse) => {
                    try {
                        const verifyRes = await client.post("order/verify", paymentResponse);
                        if (verifyRes.data.success) {
                            wipeCart();
                            toast.success("Payment successful! Order confirmed.");
                            router.push(`/thank-you?order_id=${verifyRes.data.orderId}`);
                        } else {
                            toast.error(verifyRes.data.message || "Payment verification failed");
                        }
                    } catch {
                        toast.error("Payment verification failed. Contact support.");
                    }
                },
                modal: {
                    ondismiss: () => {
                        setPlacing(false);
                        toast.info("Payment cancelled. Your cart is saved.");
                    },
                },
                prefill: {
                    name: selectedAddress.fullName || user?.name || "Guest",
                    email: user?.email || "guest@example.com",
                    contact: selectedAddress.mobile || "9999999999",
                },
                theme: { color: "#2d2d2d" },
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.on("payment.failed", () => {
                setPlacing(false);
                toast.error("Payment failed. Please try again.");
            });
            razorpayInstance.open();

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            if (payment === "cod") setPlacing(false);
        }
    }

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
        <div className="min-h-screen bg-[#f6f4f1] py-10 px-4 sm:px-6 dark:bg-zinc-950">
            <div className="max-w-6xl mx-auto">

                {/* Page title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-7">Checkout</h1>

                <div className="grid md:grid-cols-3 gap-6">

                    {/* ── Left: Address + Payment ──────────────────────── */}
                    <div className="md:col-span-2 space-y-5">

                        {/* Address section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 dark:bg-zinc-900">
                            <AddressSection onAddressSelect={setSelectedAddress} />
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 dark:bg-zinc-900">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Payment Method
                            </h3>

                            <div className="grid sm:grid-cols-2 gap-3">
                                {paymentOptions.map(({ value, label, sub, icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setPayment(value)}
                                        className={`
                                            relative flex items-center gap-4 rounded-2xl border p-4 text-left transition
                                            ${payment === value
                                                ? "border-gray-900 bg-gray-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-black"
                                                : "border-gray-200 bg-white hover:border-gray-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500"
                                            }
                                        `}
                                    >
                                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${payment === value ? "bg-white/20 dark:bg-black/20" : "bg-gray-100 dark:bg-zinc-700"}`}>
                                            {icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold">{label}</p>
                                            <p className={`text-xs mt-0.5 ${payment === value ? "text-gray-300 dark:text-gray-500" : "text-gray-400"}`}>
                                                {sub}
                                            </p>
                                        </div>
                                        {/* Radio dot */}
                                        <div className={`absolute right-4 top-4 h-4 w-4 rounded-full border-2 flex items-center justify-center ${payment === value ? "border-white dark:border-black" : "border-gray-300"}`}>
                                            {payment === value && <div className="h-2 w-2 rounded-full bg-white dark:bg-black" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Order Summary ─────────────────────────── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm p-6 dark:bg-zinc-900">
                            <h2 className="font-bold text-gray-900 dark:text-white mb-5">Order Summary</h2>

                            {/* Selected address preview */}
                            {selectedAddress ? (
                                <div className="rounded-xl bg-gray-50 border border-gray-100 dark:bg-zinc-800 dark:border-zinc-700 p-4 text-xs space-y-1 mb-5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        Delivering to
                                    </p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                                        {selectedAddress.fullName}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">📞 {selectedAddress.mobile}</p>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {selectedAddress.address}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-700 p-5 text-center text-sm text-gray-400 mb-5">
                                    No address selected yet
                                </div>
                            )}

                            <div className="border-t border-gray-100 dark:border-zinc-700 pt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                            </div>

                            {/* Place Order */}
                            <button
                                onClick={orderHandler}
                                disabled={!selectedAddress || placing}
                                className="mt-5 w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400 transition text-sm"
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

                            {!selectedAddress && (
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    Select a delivery address to continue
                                </p>
                            )}
                        </div>

                        {/* Trust badge */}
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-zinc-500">
                            <FiLock size={12} />
                            Secure & encrypted checkout
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import { FiArrowRight, FiPackage } from "react-icons/fi";

export default async function ThankYouPage({ searchParams }) {
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center px-5 py-12 dark:bg-zinc-950">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-lg p-8 sm:p-10 text-center dark:bg-zinc-900">

                {/* Animated checkmark */}
                <div className="flex justify-center mb-6">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
                        <FaCheckCircle className="text-green-500 text-5xl" />
                        <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-10" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Order Confirmed! 🎉
                </h1>

                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-7">
                    Thank you for your purchase. Your order has been confirmed and will be delivered soon.
                </p>

                {/* Order Info card */}
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-5 text-left mb-7 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Order ID</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                            #{String(params.order_id).slice(-8).toUpperCase()}
                        </span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-zinc-700" />
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Processing
                        </span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-zinc-700" />
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Delivery</span>
                        <span className="text-sm font-semibold text-green-600">FREE</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/store"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition"
                    >
                        Continue Shopping
                        <FiArrowRight size={14} />
                    </Link>

                    <Link
                        href="/orders"
                        className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                    >
                        <FiPackage size={14} />
                        My Orders
                    </Link>
                </div>

            </div>
        </div>
    );
}

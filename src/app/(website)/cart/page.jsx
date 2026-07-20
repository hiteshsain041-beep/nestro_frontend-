'use client';

import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from '@/redux/features/cartSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

export default function CartPage() {
    const cart = useSelector((store) => store.cart);
    const dispatch = useDispatch();

    const savings = cart.original_total - cart.final_total;

    return (
        <div className="min-h-screen bg-[#f6f4f1] py-10 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Page heading */}
                <div className="flex items-center gap-3 mb-8">
                    <Link href="/store" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition dark:text-gray-400 dark:hover:text-white">
                        <FiArrowLeft size={14} /> Continue Shopping
                    </Link>
                    <span className="text-gray-300 dark:text-zinc-600">|</span>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Shopping Cart
                        {cart.items.length > 0 && (
                            <span className="ml-2 text-base font-normal text-gray-400">
                                ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})
                            </span>
                        )}
                    </h1>
                </div>

                {/* Empty state */}
                {cart.items.length === 0 && (
                    <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm py-24 px-6 text-center dark:bg-zinc-900">
                        <FiShoppingBag size={56} className="text-gray-200 dark:text-zinc-700 mb-5" />
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
                        <p className="text-sm text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                        <Link
                            href="/store"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:bg-gray-700 transition dark:bg-white dark:text-black dark:hover:bg-gray-100"
                        >
                            <FiShoppingBag size={15} />
                            Browse Products
                        </Link>
                    </div>
                )}

                {cart.items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* ── Cart Items ─────────────────────────────────── */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => {
                                const hasThumbnail = Boolean(item.thumbnail?.trim());
                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl shadow-sm p-5 flex gap-5 items-start transition hover:shadow-md dark:bg-zinc-900"
                                    >
                                        {/* Image */}
                                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
                                            {hasThumbnail ? (
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.name || 'Product'}
                                                    fill
                                                    sizes="112px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-3xl">🛋️</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">{item.name}</h2>
                                            <p className="text-xs text-gray-400 mt-0.5">Premium quality product</p>

                                            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                                {/* Qty controls */}
                                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
                                                    <button
                                                        onClick={() => dispatch(decreaseQuantity({ id: item.id }))}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:bg-zinc-700 transition"
                                                    >
                                                        <FiMinus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                                        {item.qty}
                                                    </span>
                                                    <button
                                                        onClick={() => dispatch(increaseQuantity({ id: item.id }))}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:bg-zinc-700 transition"
                                                    >
                                                        <FiPlus size={12} />
                                                    </button>
                                                </div>

                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    ₹{(item.salePrice * item.qty).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => dispatch(removeFromCart({ id: item.id }))}
                                            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition"
                                            aria-label="Remove item"
                                        >
                                            <FiTrash2 size={15} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Order Summary ──────────────────────────────── */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit dark:bg-zinc-900">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ₹{cart.original_total.toLocaleString()}
                                    </span>
                                </div>

                                {savings > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>You Save</span>
                                        <span className="font-semibold">− ₹{savings.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-zinc-700 mt-4 pt-4 flex justify-between items-center">
                                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{cart.final_total.toLocaleString()}
                                </span>
                            </div>

                            {savings > 0 && (
                                <p className="mt-3 text-center text-xs text-green-600 bg-green-50 dark:bg-green-500/10 rounded-xl py-2">
                                    🎉 You're saving ₹{savings.toLocaleString()} on this order!
                                </p>
                            )}

                            <Link href="/checkout">
                                <button className="mt-5 w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

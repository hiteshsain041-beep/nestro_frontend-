"use client";

import React from "react";
import Link from "next/link";
import { FiMail, FiEye } from "react-icons/fi";

function fmtDate(d) {
    return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

export default function ContactTable({ messages = [], loading = false }) {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                    <h3 className="text-base font-bold text-gray-800">Contact Messages</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Latest form submissions</p>
                </div>
                <Link
                    href="/admin/contact"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition px-3 py-1.5 rounded-xl border border-indigo-100 hover:bg-indigo-50"
                >
                    View All →
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="text-left px-5 py-3 font-semibold">Name</th>
                            <th className="text-left px-5 py-3 font-semibold">Email</th>
                            <th className="text-left px-5 py-3 font-semibold">Subject</th>
                            <th className="text-left px-5 py-3 font-semibold">Date</th>
                            <th className="text-center px-5 py-3 font-semibold">Status</th>
                            <th className="text-center px-5 py-3 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <td key={j} className="px-5 py-4">
                                            <div className="h-3 rounded bg-gray-100" style={{ width: `${50 + (j % 4) * 12}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading && messages.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-14 text-center text-gray-400">
                                    <FiMail size={30} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-medium">No messages yet</p>
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            messages.map((msg) => (
                                <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-800">{msg.name}</td>
                                    <td className="px-5 py-3.5 text-gray-500 text-xs">{msg.email}</td>
                                    <td className="px-5 py-3.5 text-gray-600 max-w-[160px] truncate">
                                        {msg.subject || "—"}
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                                        {fmtDate(msg.createdAt)}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span
                                            className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${msg.isRead
                                                    ? "bg-gray-100 text-gray-500"
                                                    : "bg-orange-100 text-orange-700"
                                                }`}
                                        >
                                            {msg.isRead ? "Read" : "Unread"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <Link
                                            href="/admin/contact"
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

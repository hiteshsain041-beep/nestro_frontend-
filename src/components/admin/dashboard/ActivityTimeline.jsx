"use client";

import React from "react";
import {
    FiShoppingBag, FiUser, FiPackage, FiTag, FiMail, FiCheckCircle,
} from "react-icons/fi";

const TYPE_CONFIG = {
    order: {
        icon: <FiShoppingBag size={13} />,
        bg: "bg-indigo-100",
        color: "text-indigo-600",
        dot: "bg-indigo-500",
    },
    customer: {
        icon: <FiUser size={13} />,
        bg: "bg-sky-100",
        color: "text-sky-600",
        dot: "bg-sky-500",
    },
    product: {
        icon: <FiPackage size={13} />,
        bg: "bg-violet-100",
        color: "text-violet-600",
        dot: "bg-violet-500",
    },
    category: {
        icon: <FiTag size={13} />,
        bg: "bg-amber-100",
        color: "text-amber-600",
        dot: "bg-amber-500",
    },
    contact: {
        icon: <FiMail size={13} />,
        bg: "bg-rose-100",
        color: "text-rose-600",
        dot: "bg-rose-500",
    },
    delivered: {
        icon: <FiCheckCircle size={13} />,
        bg: "bg-emerald-100",
        color: "text-emerald-600",
        dot: "bg-emerald-500",
    },
};

function timeAgo(date) {
    const secs = Math.floor((Date.now() - new Date(date)) / 1000);
    if (secs < 60) return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function ActivityTimeline({ activities = [], loading = false }) {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-base font-bold text-gray-800 mb-4">Recent Activity</h3>

            {loading && (
                <div className="space-y-4 animate-pulse">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gray-200 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 space-y-1.5 pt-1">
                                <div className="h-3 w-3/4 rounded bg-gray-200" />
                                <div className="h-2.5 w-1/2 rounded bg-gray-100" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && activities.length === 0 && (
                <div className="py-10 text-center text-gray-400">
                    <FiShoppingBag size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">No recent activity</p>
                </div>
            )}

            {!loading && (
                <div className="relative">
                    {/* vertical line */}
                    {activities.length > 0 && (
                        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-100" />
                    )}
                    <div className="space-y-4">
                        {activities.map((item, idx) => {
                            const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.order;
                            return (
                                <div key={idx} className="flex gap-3 relative">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 z-10 ${cfg.bg} ${cfg.color}`}>
                                        {cfg.icon}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight">{item.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-1">{item.description}</p>
                                    </div>
                                    <span className="text-[11px] text-gray-400 whitespace-nowrap pt-0.5 flex-shrink-0">
                                        {timeAgo(item.createdAt)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

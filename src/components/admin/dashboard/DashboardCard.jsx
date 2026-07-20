"use client";

import React from "react";

/**
 * DashboardCard — KPI stat card with icon, value, growth badge, hover effect.
 */
export default function DashboardCard({
    icon,
    title,
    value,
    description,
    growth,
    iconBg = "bg-indigo-100",
    iconColor = "text-indigo-600",
    loading = false,
}) {
    const isPositive = growth >= 0;

    if (loading) {
        return (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-200" />
                    <div className="w-14 h-5 rounded-full bg-gray-200" />
                </div>
                <div className="w-20 h-7 rounded bg-gray-200 mb-2" />
                <div className="w-28 h-3 rounded bg-gray-100 mb-1" />
                <div className="w-20 h-3 rounded bg-gray-100" />
            </div>
        );
    }

    return (
        <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 cursor-default">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${iconBg} ${iconColor}`}>
                    {icon}
                </div>
                {growth !== undefined && (
                    <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${isPositive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-600"
                            }`}
                    >
                        {isPositive ? "▲" : "▼"} {Math.abs(growth)}%
                    </span>
                )}
            </div>
            <div className="text-[26px] font-black text-gray-900 tracking-tight leading-none mb-1">
                {value}
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-0.5">{title}</div>
            {description && (
                <div className="text-xs text-gray-400">{description}</div>
            )}
        </div>
    );
}

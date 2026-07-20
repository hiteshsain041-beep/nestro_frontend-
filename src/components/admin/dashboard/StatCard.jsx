"use client";

import React from "react";

/**
 * StatCard — displays a single KPI metric.
 * Props: icon, title, value, description, growth (number %), color
 */
export default function StatCard({ icon, title, value, description, growth, color = "blue", loading = false }) {
    const colorMap = {
        blue: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "bg-blue-100 dark:bg-blue-800/40 text-blue-600 dark:text-blue-400",
            badge: growth >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
        purple: {
            bg: "bg-purple-50 dark:bg-purple-900/20",
            icon: "bg-purple-100 dark:bg-purple-800/40 text-purple-600 dark:text-purple-400",
            badge: growth >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
        green: {
            bg: "bg-green-50 dark:bg-green-900/20",
            icon: "bg-green-100 dark:bg-green-800/40 text-green-600 dark:text-green-400",
            badge: growth >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
        orange: {
            bg: "bg-orange-50 dark:bg-orange-900/20",
            icon: "bg-orange-100 dark:bg-orange-800/40 text-orange-600 dark:text-orange-400",
            badge: growth >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
        cyan: {
            bg: "bg-cyan-50 dark:bg-cyan-900/20",
            icon: "bg-cyan-100 dark:bg-cyan-800/40 text-cyan-600 dark:text-cyan-400",
            badge: growth >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
        rose: {
            bg: "bg-rose-50 dark:bg-rose-900/20",
            icon: "bg-rose-100 dark:bg-rose-800/40 text-rose-600 dark:text-rose-400",
            badge: growth >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
    };

    const c = colorMap[color] || colorMap.blue;

    if (loading) {
        return (
            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm animate-pulse">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    <div className="w-16 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="w-24 h-7 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                <div className="w-32 h-4 rounded bg-gray-100 dark:bg-gray-700" />
            </div>
        );
    }

    return (
        <div className={`group rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${c.icon}`}>
                    {icon}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {growth >= 0 ? "▲" : "▼"} {Math.abs(growth)}%
                </span>
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                {value}
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-0.5">{title}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{description}</div>
        </div>
    );
}

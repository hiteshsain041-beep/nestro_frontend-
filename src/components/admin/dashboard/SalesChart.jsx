"use client";

import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

function fmt(n) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.color }} className="text-xs">
                    {p.name}: <span className="font-bold">{p.dataKey === "revenue" ? fmt(p.value) : p.value}</span>
                </p>
            ))}
        </div>
    );
};

export default function SalesChart({ data = [], loading = false }) {
    // Ensure last 6 months are always shown even if no data
    const chartData = useMemo(() => {
        if (data.length > 0) return data.slice(-6);
        // fallback empty structure
        return [];
    }, [data]);

    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-base font-bold text-gray-800">Monthly Sales</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Orders placed per month</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded-full bg-indigo-500" />
                        Orders
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="h-[220px] rounded-xl bg-gray-50 animate-pulse" />
            ) : chartData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-gray-400">
                    <div className="text-center">
                        <div className="text-3xl mb-2">📊</div>
                        <p className="text-sm font-medium">No sales data yet</p>
                    </div>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            width={28}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="orders"
                            name="Orders"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            fill="url(#ordersGrad)"
                            dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                            activeDot={{ r: 5, fill: "#6366f1" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

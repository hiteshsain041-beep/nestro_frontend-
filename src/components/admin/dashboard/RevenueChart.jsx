"use client";

import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
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
            <p className="text-xs text-emerald-600">
                Revenue: <span className="font-bold">{fmt(payload[0]?.value ?? 0)}</span>
            </p>
        </div>
    );
};

export default function RevenueChart({ data = [], loading = false }) {
    const chartData = useMemo(() => (data.length > 0 ? data.slice(-6) : []), [data]);
    const maxRevenue = useMemo(() => Math.max(...chartData.map((d) => d.revenue ?? 0), 1), [chartData]);

    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-base font-bold text-gray-800">Revenue Analytics</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Monthly revenue from paid orders</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
                    Revenue
                </div>
            </div>

            {loading ? (
                <div className="h-[220px] rounded-xl bg-gray-50 animate-pulse" />
            ) : chartData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-gray-400">
                    <div className="text-center">
                        <div className="text-3xl mb-2">💰</div>
                        <p className="text-sm font-medium">No revenue data yet</p>
                    </div>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tickFormatter={fmt}
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                        <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, idx) => (
                                <Cell
                                    key={idx}
                                    fill={entry.revenue === maxRevenue ? "#10b981" : "#d1fae5"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

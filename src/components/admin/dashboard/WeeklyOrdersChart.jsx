"use client";

import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            <p className="text-xs text-indigo-600">
                Orders: <span className="font-bold">{payload[0]?.value ?? 0}</span>
            </p>
        </div>
    );
};

export default function WeeklyOrdersChart({ data = [], loading = false }) {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-base font-bold text-gray-800">Weekly Orders</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Orders placed in last 7 days</p>
                </div>
            </div>

            {loading ? (
                <div className="h-[180px] rounded-xl bg-gray-50 animate-pulse" />
            ) : data.length === 0 ? (
                <div className="h-[180px] flex items-center justify-center text-gray-400">
                    <div className="text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <p className="text-sm font-medium">No orders this week</p>
                    </div>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            width={24}
                            allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#fff", stroke: "#6366f1", strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: "#6366f1" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

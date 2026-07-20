"use client";

import React from "react";

/**
 * DashboardTable — generic table shell with header, skeleton rows, empty state.
 * Props:
 *   columns: [{ key, label, className }]
 *   data: []
 *   loading: bool
 *   emptyMessage: string
 *   emptyIcon: ReactNode
 *   renderRow: (row, idx) => <tr>
 *   skeletonCols: number (defaults to columns.length)
 */
export default function DashboardTable({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No data found",
    emptyIcon = null,
    renderRow,
    skeletonCols,
    title,
    action,
}) {
    const cols = skeletonCols ?? columns.length;

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Optional header */}
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    {title && <h3 className="text-base font-bold text-gray-800 dark:text-white">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`text-left px-5 py-3 font-semibold ${col.className ?? ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {/* Loading skeletons */}
                        {loading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {Array.from({ length: cols }).map((_, j) => (
                                        <td key={j} className="px-5 py-4">
                                            <div
                                                className="h-3 rounded bg-gray-200 dark:bg-gray-700"
                                                style={{ width: `${50 + (j % 4) * 12}%` }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {/* Empty state */}
                        {!loading && data.length === 0 && (
                            <tr>
                                <td colSpan={cols} className="py-16 text-center text-gray-400">
                                    {emptyIcon && <div className="flex justify-center mb-3 opacity-40">{emptyIcon}</div>}
                                    <p className="text-sm font-medium">{emptyMessage}</p>
                                </td>
                            </tr>
                        )}

                        {/* Data rows */}
                        {!loading && data.map((row, idx) => renderRow(row, idx))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

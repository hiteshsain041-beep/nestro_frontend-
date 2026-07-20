"use client";

import React from "react";
import Link from "next/link";
import {
    FiPlus, FiTag, FiShoppingBag, FiUsers, FiMail, FiGrid,
} from "react-icons/fi";

const ACTIONS = [
    {
        label: "Add Product",
        href: "/admin/product/add",
        icon: <FiPlus size={18} />,
        bg: "bg-indigo-50 hover:bg-indigo-100",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        text: "text-indigo-700",
    },
    {
        label: "Add Category",
        href: "/admin/category/add",
        icon: <FiGrid size={18} />,
        bg: "bg-violet-50 hover:bg-violet-100",
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        text: "text-violet-700",
    },
    {
        label: "View Orders",
        href: "/admin/orders",
        icon: <FiShoppingBag size={18} />,
        bg: "bg-emerald-50 hover:bg-emerald-100",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        text: "text-emerald-700",
    },
    {
        label: "View Customers",
        href: "/admin/customers",
        icon: <FiUsers size={18} />,
        bg: "bg-sky-50 hover:bg-sky-100",
        iconBg: "bg-sky-100",
        iconColor: "text-sky-600",
        text: "text-sky-700",
    },
    {
        label: "All Products",
        href: "/admin/product",
        icon: <FiTag size={18} />,
        bg: "bg-amber-50 hover:bg-amber-100",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        text: "text-amber-700",
    },
    {
        label: "Messages",
        href: "/admin/contact",
        icon: <FiMail size={18} />,
        bg: "bg-rose-50 hover:bg-rose-100",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        text: "text-rose-700",
    },
];

export default function QuickActions() {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-base font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACTIONS.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-150 group ${action.bg}`}
                    >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${action.iconBg} ${action.iconColor}`}>
                            {action.icon}
                        </div>
                        <span className={`text-sm font-semibold ${action.text}`}>{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

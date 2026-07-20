"use client";

const ORDER_STATUS = {
    placed: { label: "Placed", cls: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    confirmed: { label: "Confirmed", cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    shipped: { label: "Shipped", cls: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
    out_for_delivery: { label: "Out for Delivery", cls: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" },
    delivered: { label: "Delivered", cls: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    return: { label: "Return", cls: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
};

const PAYMENT_STATUS = {
    paid: { label: "Paid", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    pending: { label: "Pending", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    failed: { label: "Failed", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const GENERAL_STATUS = {
    active: { label: "Active", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    inactive: { label: "Inactive", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const STATUS_MAPS = {
    order: ORDER_STATUS,
    payment: PAYMENT_STATUS,
    general: GENERAL_STATUS,
};

/**
 * StatusBadge — renders a colour-coded pill.
 * type: "order" | "payment" | "general"
 */
export default function StatusBadge({ type = "general", value }) {
    const map = STATUS_MAPS[type] ?? STATUS_MAPS.general;
    const cfg = map[value] ?? { label: value ?? "—", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" };
    return (
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
}

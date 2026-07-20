"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";

// ── Icons ──────────────────────────────────────────────────────────────────────
import {
  FiPackage, FiGrid, FiShoppingBag, FiUsers, FiDollarSign,
  FiMail, FiRefreshCw, FiAlertCircle, FiCalendar, FiHome,
  FiChevronRight,
} from "react-icons/fi";

// ── Dashboard components ───────────────────────────────────────────────────────
import DashboardCard from "@/components/admin/dashboard/DashboardCard";
import OrdersTable from "@/components/admin/dashboard/OrdersTable";
import ContactTable from "@/components/admin/dashboard/ContactTable";
import LowStockTable from "@/components/admin/dashboard/LowStockTable";
import BestSellingTable from "@/components/admin/dashboard/BestSellingTable";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import ActivityTimeline from "@/components/admin/dashboard/ActivityTimeline";
import SalesChart from "@/components/admin/dashboard/SalesChart";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import WeeklyOrdersChart from "@/components/admin/dashboard/WeeklyOrdersChart";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function formatCurrency(n) {
  if (!n) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function getCurrentDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

// Auto-refresh every 30 seconds
const REFRESH_INTERVAL = 30_000;

// ─────────────────────────────────────────────────────────────────────────────
// Default / empty state
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_DATA = {
  stats: {},
  recentOrders: [],
  latestCustomers: [],
  topSellingProducts: [],
  lowStockProducts: [],
  contactMessages: [],
  activityTimeline: [],
  salesChart: [],
  revenueChart: [],
  weeklyOrders: [],
  orderStatusSummary: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// Order-status summary card
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_DISPLAY = [
  { key: "placed", label: "Pending", cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { key: "confirmed", label: "Confirmed", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  { key: "shipped", label: "Shipped", cls: "bg-purple-100 text-purple-800 border-purple-200" },
  { key: "out_for_delivery", label: "Out for Del", cls: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { key: "delivered", label: "Delivered", cls: "bg-green-100 text-green-800 border-green-200" },
  { key: "cancelled", label: "Cancelled", cls: "bg-red-100 text-red-800 border-red-200" },
];

function OrderStatusSummary({ summary = {}, loading = false }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
      <h3 className="text-base font-bold text-gray-800 mb-4">Order Status Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUS_DISPLAY.map((s) => (
          <div
            key={s.key}
            className={`rounded-xl border p-3 text-center ${s.cls} ${loading ? "animate-pulse" : ""}`}
          >
            <div className="text-2xl font-black">
              {loading ? (
                <div className="w-8 h-6 rounded bg-current opacity-20 mx-auto" />
              ) : (
                summary[s.key] ?? 0
              )}
            </div>
            <div className="text-[11px] font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Latest customers panel
// ─────────────────────────────────────────────────────────────────────────────
function LatestCustomers({ customers = [], loading = false }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
      <h3 className="text-base font-bold text-gray-800 mb-4">Latest Customers</h3>
      {loading && (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-2/3 rounded bg-gray-200" />
                <div className="h-2.5 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && customers.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          <FiUsers size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">No customers yet</p>
        </div>
      )}
      {!loading && (
        <div className="space-y-3">
          {customers.map((c, i) => {
            const initials = (c.name ?? "?")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const colors = [
              "bg-indigo-100 text-indigo-700",
              "bg-violet-100 text-violet-700",
              "bg-emerald-100 text-emerald-700",
              "bg-sky-100 text-sky-700",
              "bg-amber-100 text-amber-700",
              "bg-rose-100 text-rose-700",
            ];
            return (
              <div key={c._id ?? i} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${colors[i % colors.length]}`}
                >
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt={c.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.email}</p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboard = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { data: res } = await client.get("admin/dashboard");
      if (res.success) {
        setData(res);
        setLastUpdated(new Date());
      } else {
        throw new Error(res.message || "Failed to load dashboard");
      }
    } catch (err) {
      const msg = err.friendlyMessage || err.message || "Failed to load dashboard data";
      setError(msg);
      if (!silent) toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Auto-refresh every 30s (silent — no loader flash)
  useEffect(() => {
    const timer = setInterval(() => fetchDashboard(true), REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchDashboard]);

  // Memoised stat cards config
  const statCards = useMemo(() => {
    const s = data.stats ?? {};
    return [
      {
        icon: <FiPackage />,
        title: "Total Products",
        value: s.totalProducts?.toLocaleString("en-IN") ?? "0",
        description: "Active in catalogue",
        growth: s.productsGrowth,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
      },
      {
        icon: <FiGrid />,
        title: "Total Categories",
        value: s.totalCategories?.toLocaleString("en-IN") ?? "0",
        description: "Product categories",
        growth: s.categoriesGrowth,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
      },
      {
        icon: <FiShoppingBag />,
        title: "Total Orders",
        value: s.totalOrders?.toLocaleString("en-IN") ?? "0",
        description: "All time orders",
        growth: s.ordersGrowth,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
      },
      {
        icon: <FiUsers />,
        title: "Total Customers",
        value: s.totalCustomers?.toLocaleString("en-IN") ?? "0",
        description: "Registered users",
        growth: s.customersGrowth,
        iconBg: "bg-sky-100",
        iconColor: "text-sky-600",
      },
      {
        icon: <FiDollarSign />,
        title: "Total Revenue",
        value: formatCurrency(s.totalRevenue ?? 0),
        description: "From paid orders",
        growth: s.revenueGrowth,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
      },
      {
        icon: <FiMail />,
        title: "Contact Messages",
        value: s.totalMessages?.toLocaleString("en-IN") ?? (data.contactMessages?.length ?? 0).toString(),
        description: "Customer inquiries",
        growth: undefined,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
      },
    ];
  }, [data.stats, data.contactMessages]);

  // ── Error state ──────────────────────────────────────────────────────────────
  if (!loading && error) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle size={24} className="text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Failed to Load Dashboard</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => fetchDashboard()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <FiRefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <FiHome size={11} />
              <FiChevronRight size={11} />
              <span className="text-gray-600 font-medium">Dashboard</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
              <FiCalendar size={13} />
              <span>{getCurrentDate()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-400 hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <button
              onClick={() => fetchDashboard()}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 bg-white px-4 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 shadow-sm"
            >
              <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Welcome Banner ───────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 sm:p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">Welcome back, Admin 👋</h2>
              <p className="text-indigo-200 text-sm mt-1">
                Here&apos;s what&apos;s happening with your store today.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[80px]">
                <div className="text-2xl font-black">
                  {loading ? <span className="inline-block w-8 h-6 bg-white/20 rounded animate-pulse" /> : (data.stats?.pendingOrders ?? 0)}
                </div>
                <div className="text-[11px] text-indigo-200 mt-0.5 font-medium">Pending Orders</div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[80px]">
                <div className="text-2xl font-black">
                  {loading ? <span className="inline-block w-8 h-6 bg-white/20 rounded animate-pulse" /> : (data.stats?.orderStatusSummary?.delivered ?? data.orderStatusSummary?.delivered ?? 0)}
                </div>
                <div className="text-[11px] text-indigo-200 mt-0.5 font-medium">Delivered</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card, i) => (
            <DashboardCard key={i} {...card} loading={loading} />
          ))}
        </div>

        {/* ── Order Status Summary ─────────────────────────────────────────── */}
        <OrderStatusSummary summary={data.orderStatusSummary} loading={loading} />

        {/* ── Charts Row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-1">
            <SalesChart data={data.salesChart} loading={loading} />
          </div>
          <div className="xl:col-span-1">
            <RevenueChart data={data.revenueChart} loading={loading} />
          </div>
          <div className="xl:col-span-1">
            <WeeklyOrdersChart data={data.weeklyOrders} loading={loading} />
          </div>
        </div>

        {/* ── Recent Orders ────────────────────────────────────────────────── */}
        <OrdersTable
          orders={data.recentOrders}
          loading={loading}
          onRefresh={() => fetchDashboard()}
        />

        {/* ── Best Selling + Latest Customers ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BestSellingTable products={data.topSellingProducts} loading={loading} />
          <LatestCustomers customers={data.latestCustomers} loading={loading} />
        </div>

        {/* ── Low Stock + Contact Messages ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LowStockTable products={data.lowStockProducts} loading={loading} />
          <ContactTable messages={data.contactMessages} loading={loading} />
        </div>

        {/* ── Quick Actions + Activity Timeline ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <QuickActions />
          <ActivityTimeline activities={data.activityTimeline} loading={loading} />
        </div>

      </div>
    </div>
  );
}

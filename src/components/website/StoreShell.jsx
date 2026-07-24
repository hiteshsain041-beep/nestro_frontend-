"use client";

// ─── StoreShell ──────────────────────────────────────────────────────────────
// This is the interactive shell for the store layout.
// It manages the mobile filter drawer state (useState) which requires
// "use client". It does NOT import Filter directly — Filter is passed in
// as a prop from the Server Component layout, keeping it a true Server
// Component (async is allowed there).

import { useState } from "react";
import { FiSliders, FiX } from "react-icons/fi";
import SortFilter from "@/components/website/SortFilter";

export default function StoreShell({ children, filterSlot }) {
    const [filterOpen, setFilterOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">

            {/* ── Mobile filter toggle bar — Filters button only, no sort ── */}
            <div className="flex items-center mb-3 lg:hidden">
                <button
                    onClick={() => setFilterOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#ede9e3] bg-white px-4 py-2.5 text-sm font-medium text-[#3a2418] hover:bg-[#f0ebe4] transition shadow-sm"
                    aria-label="Open filters"
                >
                    <FiSliders size={15} />
                    Filters
                </button>
            </div>

            <div className="flex gap-4 lg:gap-6">

                {/* ── Sidebar — desktop ─────────────────────── */}
                <aside className="hidden lg:block w-[260px] xl:w-[280px] flex-shrink-0">
                    <div className="sticky top-24 bg-white rounded-2xl shadow-sm p-5 space-y-6">
                        {/* filterSlot is a pre-rendered Server Component tree */}
                        {filterSlot}
                    </div>
                </aside>

                {/* ── Product grid ──────────────────────────── */}
                <div className="flex-1 min-w-0">
                    <div className="hidden lg:block mb-4">
                        <SortFilter />
                    </div>
                    {children}
                </div>
            </div>

            {/* ── Mobile filter drawer ──────────────────────────── */}

            {/* Backdrop */}
            {filterOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setFilterOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Slide-in panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Product filters"
                className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${filterOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h2 className="text-base font-bold text-[#1a1007]">Filters</h2>
                    <button
                        onClick={() => setFilterOpen(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500"
                        aria-label="Close filters"
                    >
                        <FiX size={18} />
                    </button>
                </div>
                <div className="overflow-y-auto h-[calc(100%-65px)] p-5">
                    {/* Same filterSlot passed into the drawer */}
                    {filterSlot}
                </div>
            </div>
        </div>
    );
}

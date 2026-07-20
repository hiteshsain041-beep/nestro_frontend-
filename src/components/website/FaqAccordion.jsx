"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function FaqAccordion({ items = [] }) {
    const [open, setOpen] = useState(null);

    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-[#ede9e3] bg-white overflow-hidden transition-shadow hover:shadow-sm"
                >
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                        onClick={() => setOpen(open === i ? null : i)}
                        aria-expanded={open === i}
                    >
                        <span className="text-sm font-semibold text-[#1a1007] pr-4">{item.q}</span>
                        <span className="flex-shrink-0 text-[#a46d43]">
                            {open === i ? <FiMinus size={16} /> : <FiPlus size={16} />}
                        </span>
                    </button>

                    {open === i && (
                        <div className="px-5 pb-5">
                            <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

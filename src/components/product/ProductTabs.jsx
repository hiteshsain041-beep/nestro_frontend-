"use client";

import { useState } from "react";

const TABS = ["Description", "Specifications", "Additional Info"];

export default function ProductTabs({ product }) {
    const [active, setActive] = useState(0);

    const specs = [
        { label: "Category", value: product.categoryId?.name },
        { label: "Room", value: product.roomId?.name },
        { label: "Material", value: product.material },
        { label: "Color", value: product.color },
        { label: "Weight", value: product.weight ? `${product.weight} kg` : null },
        { label: "Width", value: product.dimensions?.width ? `${product.dimensions.width} cm` : null },
        { label: "Height", value: product.dimensions?.height ? `${product.dimensions.height} cm` : null },
        { label: "Depth", value: product.dimensions?.depth ? `${product.dimensions.depth} cm` : null },
    ].filter((s) => s.value);

    return (
        <div>
            {/* Tab bar */}
            <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
                {TABS.map((tab, idx) => (
                    <button
                        key={tab}
                        onClick={() => setActive(idx)}
                        className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-200 ${active === idx
                                ? "border-[#a46d43] text-[#a46d43]"
                                : "border-transparent text-gray-500 hover:text-gray-800"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="pt-6">
                {/* Description */}
                {active === 0 && (
                    product.description ? (
                        <div
                            className="prose prose-sm max-w-none text-gray-600 prose-headings:text-[#1a1007] prose-a:text-[#a46d43]"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    ) : (
                        <p className="text-sm text-gray-400 italic">No description available.</p>
                    )
                )}

                {/* Specifications */}
                {active === 1 && (
                    specs.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {specs.map((spec) => (
                                <div key={spec.label} className="flex justify-between py-3">
                                    <span className="text-sm text-gray-500">{spec.label}</span>
                                    <span className="text-sm font-semibold text-gray-800 capitalize">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No specifications available.</p>
                    )
                )}

                {/* Additional Info */}
                {active === 2 && (
                    <div className="space-y-3 text-sm text-gray-600">
                        {product.shortDescription && (
                            <p className="leading-relaxed">{product.shortDescription}</p>
                        )}
                        {product.seoTitle && (
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">SEO Title</p>
                                <p className="text-sm text-gray-700">{product.seoTitle}</p>
                            </div>
                        )}
                        {product.seoDescription && (
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">SEO Description</p>
                                <p className="text-sm text-gray-700">{product.seoDescription}</p>
                            </div>
                        )}
                        {!product.shortDescription && !product.seoTitle && (
                            <p className="italic text-gray-400">No additional information available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

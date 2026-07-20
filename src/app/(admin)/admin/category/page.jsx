export const dynamic = "force-dynamic";

import ActionDropdown from "@/components/admin/ActionDropdown";
import { fetchCategoryServer } from "@/utils/api.server";
import TableHeader from "@/components/admin/TableHeader";
import TableFilter from "@/components/admin/TableFilter";
import StatusBtn from "@/components/admin/StatusBtn";
// Using next/image for optimised, safe image rendering
import Image from "next/image";

export default async function Page() {
    const category = await fetchCategoryServer();

    // ERROR HANDLE
    if (category?.success === false) {
        throw new Error(category?.message || "Failed to fetch categories");
    }

    return (
        <div className="min-h-screen p-4 lg:p-6">

            {/* HEADER */}
            <TableHeader
                title="Categories"
                path="/admin/category/add"
            />

            {/* MAIN CARD */}
            <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

                {/* FILTER */}
                <TableFilter />

                {/* TABLE HEADER */}
                <div className="hidden grid-cols-12 border-b border-gray-100 bg-gray-50 px-4 py-3 lg:grid">
                    <div className="col-span-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Image
                        </p>
                    </div>

                    <div className="col-span-5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Name
                        </p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Slug
                        </p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Status
                        </p>
                    </div>

                    <div className="col-span-2 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Action
                        </p>
                    </div>
                </div>

                {/* TABLE BODY */}
                <div>
                    {category?.data?.length === 0 ? (

                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    No Category Found
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    There are no categories available right now.
                                </p>
                            </div>
                        </div>

                    ) : (

                        category?.data?.map((item, index) => {
                            // Treat empty string / null / undefined as "no image"
                            const hasImage = Boolean(item.image?.trim());

                            return (
                                <div
                                    key={item._id || index}
                                    className="grid grid-cols-1 gap-3 border-b border-gray-100 px-8 py-4 transition-all duration-300 hover:bg-gray-50/60 lg:grid-cols-12 lg:items-center"
                                >

                                    {/* IMAGE CELL
                                        - The outer div is 36×36 px (h-9 w-9).
                                        - When an image exists we render next/image (optimised, lazy, sized).
                                        - When no image exists we render a grey circle with a camera emoji
                                          so no <img> tag with an empty src is ever in the DOM.
                                    */}
                                    <div className="hidden lg:block lg:col-span-1">
                                        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                                            {hasImage ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name || "Category image"}
                                                    fill
                                                    sizes="36px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                // Placeholder — no <img>, no broken src
                                                <span
                                                    className="text-base text-gray-400"
                                                    aria-label="No image"
                                                >
                                                    📷
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* CATEGORY INFO */}
                                    <div className="flex items-center gap-3 lg:col-span-5">
                                        <div className="min-w-0">
                                            <h2 className="truncate text-sm font-bold text-gray-900">
                                                {item.name}
                                            </h2>
                                            <p className="mt-1 text-[11px] text-gray-500 lg:hidden">
                                                {item.slug}
                                            </p>
                                        </div>
                                    </div>

                                    {/* SLUG */}
                                    <div className="hidden lg:block lg:col-span-2">
                                        <div className="inline-flex rounded-xl bg-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-600">
                                            {item.slug}
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div className="lg:col-span-2">
                                        <StatusBtn status={item.status} path={`category/status-update/${item._id}`} />
                                    </div>

                                    {/* ACTION */}
                                    <div className="hidden justify-end lg:col-span-2 lg:flex">
                                        <ActionDropdown module="category" id={item._id} />
                                    </div>

                                </div>
                            );
                        })

                    )}
                </div>
            </div>
        </div>
    );
}

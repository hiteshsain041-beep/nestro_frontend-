import {
    MdSearch,
} from "react-icons/md";


export default function TableFilter() {
    return (
        <div className="border-b border-gray-100 p-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                {/* SEARCH */}
                <div className="relative lg:col-span-8">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-xs font-medium text-gray-700 outline-none transition-all focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                    />
                </div>

                {/* STATUS */}
                <select className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 lg:col-span-2">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>

                {/* CATEGORY */}
                <select className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 lg:col-span-2">
                    <option>All Categories</option>
                </select>
            </div>
        </div>
    )
}

import Link from "next/link";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

export default function ProductNotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-5">
                <FiAlertTriangle size={28} className="text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1007] dark:text-white mb-2">
                Product Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-8">
                The product you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Link
                href="/store"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#3a2418] hover:bg-[#2a1a10] text-white text-sm font-semibold transition"
            >
                <FiArrowLeft size={14} /> Back to Store
            </Link>
        </div>
    );
}

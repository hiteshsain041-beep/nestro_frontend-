export default function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-square rounded-2xl bg-gray-200"></div>

            <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>

            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>

            <div className="mt-4 h-6 w-24 rounded bg-gray-200"></div>
        </div>
    );
}
export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="text-center">

                {/* Logo */}
                <h1 className="text-5xl font-light tracking-[10px] text-[#2A170F]">
                    NESTRO<span className="text-[#B07A50]">.</span>
                </h1>

                {/* Loading Bar */}
                <div className="mt-8 w-56 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-[#B07A50] animate-loading" />
                </div>

                <p className="mt-4 text-gray-500 tracking-wider text-sm">
                    Loading Luxury Furniture...
                </p>

            </div>
        </div>
    );
}
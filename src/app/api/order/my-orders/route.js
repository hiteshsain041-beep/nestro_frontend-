/**
 * GET /api/order/my-orders
 *
 * BFF proxy for fetching the user's own order history.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = (
    process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value ?? null;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized — no token provided" },
            { status: 401 }
        );
    }

    try {
        const res = await fetch(`${BACKEND}/order/my-orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to fetch orders." },
            { status: 503 }
        );
    }
}

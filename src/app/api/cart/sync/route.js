/**
 * POST /api/cart/sync
 *
 * BFF proxy for syncing the local cart to MongoDB after login.
 * Also used to pull the server cart on checkout page load.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = (
    process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export async function POST(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value ?? null;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        const res = await fetch(`${BACKEND}/cart/sync-cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json(
            { success: false, message: "Cart sync unavailable" },
            { status: 503 }
        );
    }
}

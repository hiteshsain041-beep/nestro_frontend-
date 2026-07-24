/**
 * POST /api/cart/add
 *
 * BFF proxy for adding items to cart.
 * Reads jwt cookie server-side (same-domain), attaches Bearer header,
 * forwards to Express backend — fixes cross-domain cookie issue on mobile.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = (
    process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export async function POST(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value ?? null;

    // Guest user — no token. Return 401 so CartButton can silently ignore.
    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        const res = await fetch(`${BACKEND}/cart/add-to-cart`, {
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
            { success: false, message: "Cart service unavailable" },
            { status: 503 }
        );
    }
}

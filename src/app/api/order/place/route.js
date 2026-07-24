/**
 * POST /api/order/place
 *
 * Next.js BFF proxy — reads the jwt cookie server-side (same-domain),
 * attaches Authorization: Bearer header, forwards to Express backend.
 * Solves the mobile cross-domain cookie problem where the browser refuses
 * to send the Vercel-domain jwt cookie directly to Render.
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
            { success: false, message: "Unauthorized — no token provided" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        const res = await fetch(`${BACKEND}/order/place`, {
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
            { success: false, message: "Order service unavailable. Please try again." },
            { status: 503 }
        );
    }
}

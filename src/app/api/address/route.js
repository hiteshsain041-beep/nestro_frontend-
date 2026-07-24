/**
 * GET /api/address
 *
 * Next.js BFF proxy — forwards the request to Express backend using the
 * jwt cookie from the frontend domain. This avoids the cross-domain cookie
 * problem where mobile browsers refuse to send the Vercel-domain jwt cookie
 * directly to the Render backend.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = (
    process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function getToken() {
    const cookieStore = await cookies();
    return cookieStore.get("jwt")?.value ?? null;
}

export async function GET() {
    const token = await getToken();

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized — no token provided" },
            { status: 401 }
        );
    }

    try {
        const res = await fetch(`${BACKEND}/address`, {
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
            { success: false, message: "Failed to fetch addresses" },
            { status: 503 }
        );
    }
}

export async function POST(request) {
    const token = await getToken();

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized — no token provided" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const res = await fetch(`${BACKEND}/address/create`, {
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
            { success: false, message: "Failed to create address" },
            { status: 503 }
        );
    }
}

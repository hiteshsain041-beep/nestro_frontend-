/**
 * PUT  /api/address/[id]  — update address
 * DELETE /api/address/[id] — delete address
 *
 * Same BFF proxy pattern as GET /api/address
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

export async function PUT(request, { params }) {
    const token = await getToken();
    const { id } = await params;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized — no token provided" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const res = await fetch(`${BACKEND}/address/update/${id}`, {
            method: "PUT",
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
            { success: false, message: "Failed to update address" },
            { status: 503 }
        );
    }
}

export async function DELETE(request, { params }) {
    const token = await getToken();
    const { id } = await params;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized — no token provided" },
            { status: 401 }
        );
    }

    try {
        const res = await fetch(`${BACKEND}/address/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to delete address" },
            { status: 503 }
        );
    }
}

import { NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL || "http://localhost:5000/api/";
const IS_PROD = process.env.NODE_ENV === "production";

const COOKIE_BASE = {
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds (cookies API uses seconds)
    secure: IS_PROD,
    sameSite: IS_PROD ? "none" : "lax",
};

/**
 * POST /api/auth/login
 *
 * Thin proxy that forwards credentials to the Express backend, then sets
 * the jwt and role cookies on localhost:3000 so Next.js middleware can
 * read them. The backend's own Set-Cookie headers are on localhost:5000
 * and are therefore invisible to the Next.js middleware running on :3000.
 */
export async function POST(request) {
    try {
        const body = await request.json();

        // Forward to backend
        const backendRes = await fetch(`${BACKEND}user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await backendRes.json();

        if (!backendRes.ok || !data.success) {
            return NextResponse.json(data, { status: backendRes.status });
        }

        // Extract the jwt token the backend sent back in Set-Cookie
        // (the backend also embeds it there, but we need to re-set it on :3000)
        const setCookieHeader = backendRes.headers.get("set-cookie") || "";

        // Parse jwt value from the raw Set-Cookie string
        const jwtMatch = setCookieHeader.match(/(?:^|,)\s*jwt=([^;,]+)/i);
        const jwtToken = jwtMatch?.[1] ?? null;

        const user = data.data?.user;
        const role = user?.role ?? "user";

        const response = NextResponse.json(data, { status: 200 });

        // Set jwt cookie (httpOnly — not readable by JS, only sent to server)
        if (jwtToken) {
            response.cookies.set("jwt", jwtToken, {
                ...COOKIE_BASE,
                httpOnly: true,
            });
        }

        // Set role cookie (non-httpOnly — Edge middleware can read it)
        response.cookies.set("role", role, {
            ...COOKIE_BASE,
            httpOnly: false,
        });

        return response;
    } catch (err) {
        console.error("[/api/auth/login]", err.message);
        return NextResponse.json(
            { success: false, message: "Login service unavailable. Is the backend running?" },
            { status: 503 }
        );
    }
}

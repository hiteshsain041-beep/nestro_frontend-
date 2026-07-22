import { NextResponse } from "next/server";

const BACKEND = (
    process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const IS_PROD = process.env.NODE_ENV === "production";

const COOKIE_BASE = {
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    secure: IS_PROD,
    sameSite: IS_PROD ? "none" : "lax",
};

/**
 * POST /api/auth/google-login
 *
 * Thin proxy for Google OAuth login:
 * 1. Forwards Google user data to Express backend
 * 2. Reads JWT from JSON body (data.data.token) — reliable on all runtimes
 * 3. Sets jwt (httpOnly) + role (non-httpOnly) cookies on the frontend domain
 */
export async function POST(request) {
    try {
        const body = await request.json();

        const backendRes = await fetch(`${BACKEND}/user/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await backendRes.json();

        if (!backendRes.ok || !data.success) {
            return NextResponse.json(data, { status: backendRes.status });
        }

        // Read token from JSON body — no Set-Cookie header parsing needed
        const jwtToken = data.data?.token ?? null;
        const user = data.data?.user ?? null;
        const role = user?.role ?? "user";

        if (!jwtToken) {
            console.error(
                "[/api/auth/google-login] ❌ token missing from backend response.",
                "Ensure googleLogin returns: sendSuccess(res, msg, { user, token })"
            );
        }

        const response = NextResponse.json(data, { status: 200 });

        if (jwtToken) {
            response.cookies.set("jwt", jwtToken, {
                ...COOKIE_BASE,
                httpOnly: true,
            });
        }

        response.cookies.set("role", role, {
            ...COOKIE_BASE,
            httpOnly: false,
        });

        return response;
    } catch (err) {
        console.error("[/api/auth/google-login]", err.message);
        return NextResponse.json(
            { success: false, message: "Google login service unavailable. Please try again." },
            { status: 503 }
        );
    }
}

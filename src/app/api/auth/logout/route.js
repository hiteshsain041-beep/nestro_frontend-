import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = (
    process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * POST /api/auth/logout
 *
 * 1. Forwards logout to Express backend (clears backend-domain cookies)
 * 2. Clears jwt + role cookies on the FRONTEND domain — this is critical
 *    because Next.js middleware and getProfile() read these frontend cookies,
 *    not the backend-domain cookies
 */
export async function POST() {
    // Forward to backend — fire-and-forget, we clear frontend cookies regardless
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
        await fetch(`${BACKEND}/user/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
    } catch {
        // Backend down — still clear frontend cookies
    }

    // Attributes MUST exactly match what was set at login:
    // same path, secure, sameSite, httpOnly — otherwise browser ignores the clear
    const CLEAR = {
        path: "/",
        maxAge: 0,            // expire immediately
        expires: new Date(0),  // belt-and-suspenders for older browsers
        secure: IS_PROD,
        sameSite: IS_PROD ? "none" : "lax",
    };

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.set("jwt", "", { ...CLEAR, httpOnly: true });
    response.cookies.set("role", "", { ...CLEAR, httpOnly: false });
    return response;
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = (
    process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * POST /api/auth/logout
 *
 * 1. Forwards logout to the Express backend (so its httpOnly cookie is cleared there too).
 * 2. Clears jwt + role on the *frontend* domain — this is what actually matters
 *    for Next.js middleware and the Server Layout.
 */
export async function POST() {
    // Fire-and-forget to backend — we clear frontend cookies regardless.
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
        // Backend down — still clear frontend cookies.
    }

    // Cookie attributes MUST match what was set at login — otherwise
    // the browser ignores the clear (same name + path + domain + secure).
    const CLEAR_OPTS = {
        path: "/",
        maxAge: 0,           // expire immediately
        expires: new Date(0), // belt-and-suspenders
        secure: IS_PROD,
        sameSite: IS_PROD ? "none" : "lax",
    };

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.set("jwt", "", { ...CLEAR_OPTS, httpOnly: true });
    response.cookies.set("role", "", { ...CLEAR_OPTS, httpOnly: false });
    return response;
}

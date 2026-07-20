import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = (process.env.API_BASE_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const IS_PROD = process.env.NODE_ENV === "production";

/**
 * POST /api/auth/logout
 *
 * Clears jwt and role cookies on localhost:3000 so middleware immediately
 * treats the user as logged out. Also forwards the logout to the backend.
 */
export async function POST() {
    // Forward to backend (fire-and-forget — we clear cookies regardless)
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
        await fetch(`${BACKEND}/user/logout`, {
            method: "POST",
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    } catch {
        // Backend may be down — still clear frontend cookies
    }

    const CLEAR = {
        path: "/",
        maxAge: 0,
        secure: IS_PROD,
        sameSite: IS_PROD ? "none" : "lax",
    };

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.set("jwt", "", { ...CLEAR, httpOnly: true });
    response.cookies.set("role", "", { ...CLEAR, httpOnly: false });
    return response;
}

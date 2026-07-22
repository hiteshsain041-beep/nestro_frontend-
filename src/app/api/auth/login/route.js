import { NextResponse } from "next/server";

const BACKEND = (
  process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const IS_PROD = process.env.NODE_ENV === "production";

// Cookie options — same values used for both jwt and role
const COOKIE_BASE = {
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  secure: IS_PROD,
  sameSite: IS_PROD ? "none" : "lax",
};

/**
 * POST /api/auth/login
 *
 * Thin proxy that:
 * 1. Forwards credentials to the Express backend
 * 2. Reads the JWT from the JSON response body (data.data.token) — reliable
 *    on all environments including Vercel Edge and Render
 * 3. Re-sets jwt (httpOnly) + role (non-httpOnly) cookies on the *frontend*
 *    domain so Next.js middleware and Server Components can read them
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // ── 1. Forward to Express backend ───────────────────────────────────────
    const backendRes = await fetch(`${BACKEND}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // No credentials:"include" — this is server→server, cookies don't apply
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // ── 2. Get JWT from JSON body — reliable on all runtimes ────────────────
    // Backend now includes token in: { success, message, data: { user, token } }
    const jwtToken = data.data?.token ?? null;
    const user = data.data?.user ?? null;
    const role = user?.role ?? "user";

    if (!jwtToken) {
      console.error(
        "[/api/auth/login] ❌ token missing from backend response.",
        "Ensure backend login returns: sendSuccess(res, msg, { user, token })"
      );
    }

    // ── 3. Build response and set cookies on the frontend domain ────────────
    const response = NextResponse.json(data, { status: 200 });

    if (jwtToken) {
      // httpOnly: true — invisible to JS/extensions, only sent to the server
      response.cookies.set("jwt", jwtToken, {
        ...COOKIE_BASE,
        httpOnly: true,
      });
    }

    // httpOnly: false — Edge middleware can read this for routing decisions
    response.cookies.set("role", role, {
      ...COOKIE_BASE,
      httpOnly: false,
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/login]", err.message);
    return NextResponse.json(
      { success: false, message: "Login service unavailable. Please try again." },
      { status: 503 }
    );
  }
}

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
 * POST /api/auth/login
 *
 * Thin proxy: forwards credentials to Express, then re-sets the jwt + role
 * cookies on the *frontend* domain (Vercel / localhost:3000) so that:
 *  - Next.js middleware can read `jwt` (httpOnly) for auth guards
 *  - `getProfile()` in the Server Layout reads the cookie on the next render
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // ── 1. Call Express backend ──────────────────────────────────────────────
    const backendRes = await fetch(`${BACKEND}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Do NOT set credentials:"include" here — this is a server→server call,
      // credentials only matter for browser→server requests.
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // ── 2. Parse the jwt token out of the backend Set-Cookie header ──────────
    // getSetCookie() returns an array — one string per Set-Cookie header.
    // This is the correct API; .get("set-cookie") only returns the first one.
    let jwtToken = null;
    try {
      const setCookies =
        typeof backendRes.headers.getSetCookie === "function"
          ? backendRes.headers.getSetCookie()
          : [backendRes.headers.get("set-cookie") ?? ""];

      for (const raw of setCookies) {
        // Each string looks like:  jwt=<value>; Path=/; HttpOnly; ...
        // We want only the first name=value pair.
        const firstPair = raw.split(";")[0].trim();        // "jwt=<value>"
        const eqIdx = firstPair.indexOf("=");
        if (eqIdx === -1) continue;
        const name = firstPair.slice(0, eqIdx).trim().toLowerCase();
        const value = firstPair.slice(eqIdx + 1).trim();
        if (name === "jwt" && value) {
          jwtToken = decodeURIComponent(value);
          break;
        }
      }
    } catch (parseErr) {
      console.error("[login] Cookie parse error:", parseErr.message);
    }

    if (!jwtToken) {
      // Backend didn't send a jwt cookie — log but still return user data.
      // Authenticated actions will fail later, but the UI can still show
      // the user name from the response body.
      console.warn("[login] ⚠️  Backend did not return a jwt Set-Cookie.");
    }

    // ── 3. Re-set cookies on the frontend domain ─────────────────────────────
    const user = data.data?.user;
    const role = user?.role ?? "user";

    const response = NextResponse.json(data, { status: 200 });

    if (jwtToken) {
      // httpOnly — JS cannot read this; only sent to the server on each request.
      response.cookies.set("jwt", jwtToken, {
        ...COOKIE_BASE,
        httpOnly: true,
      });
    }

    // Non-httpOnly companion — Edge middleware can read this for routing.
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

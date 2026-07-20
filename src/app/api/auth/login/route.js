// /api/auth/login/route.js - COMPLETE FIXED VERSION

import { NextResponse } from "next/server";

const BACKEND = (
  process.env.API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const IS_PROD = process.env.NODE_ENV === "production";

const COOKIE_BASE = {
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
  secure: IS_PROD,
  sameSite: IS_PROD ? "none" : "lax",
};

export async function POST(request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // ✅ FIX: getSetCookie() returns array - each cookie separate
    const setCookieHeaders =
      typeof backendRes.headers.getSetCookie === "function"
        ? backendRes.headers.getSetCookie()
        : [backendRes.headers.get("set-cookie") || ""];

    console.log("[login] Set-Cookie headers:", setCookieHeaders); // debug

    // ✅ FIX: Correct parsing - har header alag check karo
    let jwtToken = null;
    for (const cookieStr of setCookieHeaders) {
      const match = cookieStr.match(/^jwt=([^;]+)/i);
      if (match) {
        jwtToken = decodeURIComponent(match[1]);
        break;
      }
    }

    console.log("[login] Parsed JWT:", jwtToken ? "found" : "NOT FOUND"); // debug

    const user = data.data?.user;
    const role = user?.role ?? "user";

    const response = NextResponse.json(data, { status: 200 });

    if (jwtToken) {
      response.cookies.set("jwt", jwtToken, {
        ...COOKIE_BASE,
        httpOnly: true,
      });
    } else {
      // ⚠️ JWT nahi mila - ye log dekho
      console.error("[login] JWT token not found in backend Set-Cookie!");
      console.error("[login] Raw headers:", setCookieHeaders);
    }

    response.cookies.set("role", role, {
      ...COOKIE_BASE,
      httpOnly: false,
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/login]", err.message);
    return NextResponse.json(
      { success: false, message: "Login service unavailable." },
      { status: 503 }
    );
  }
}
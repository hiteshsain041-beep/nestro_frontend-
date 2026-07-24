import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/checkout', '/profile'];
const AUTH_ROUTES = ['/login', '/register', '/verify-otp'];
const ADMIN_ROLES = ['admin', 'superAdmin'];

export function proxy(request) {
    const { pathname } = request.nextUrl;

    // jwt is httpOnly — only tells us if the user is authenticated at all.
    const token = request.cookies.get('jwt')?.value || null;

    // role is a non-httpOnly companion cookie set by the backend on login.
    // Middleware (Edge runtime) cannot read httpOnly cookies, so we use this
    // lightweight cookie purely for routing decisions.
    // The actual auth/authz is enforced by the backend on every API call.
    const role = request.cookies.get('role')?.value || null;

    // ── /admin-login ──────────────────────────────────────────────────────────
    if (pathname === '/admin-login') {
        // Already logged in as admin → go straight to dashboard
        if (token && ADMIN_ROLES.includes(role)) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.next();
    }

    // ── /admin/* ──────────────────────────────────────────────────────────────
    if (pathname.startsWith('/admin')) {
        // No token at all → login page
        if (!token) {
            return NextResponse.redirect(new URL('/admin-login', request.url));
        }
        // Has token but role is not admin/superAdmin → login with reason
        if (!ADMIN_ROLES.includes(role)) {
            return NextResponse.redirect(
                new URL('/admin-login?reason=forbidden', request.url)
            );
        }
        // Verified admin — allow through. No network call needed.
        return NextResponse.next();
    }

    // ── User protected routes ─────────────────────────────────────────────────
    if (PROTECTED_ROUTES.includes(pathname) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // ── Auth routes: already logged in → home ────────────────────────────────
    if (AUTH_ROUTES.includes(pathname) && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/checkout',
        '/profile',
        '/login',
        '/register',
        '/verify-otp',
        '/admin-login',
        '/admin/:path*',
    ],
};

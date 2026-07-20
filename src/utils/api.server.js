
import axios from "axios";
import { cookies } from "next/headers";
import { cache } from "react";

// ── Resolve the API base URL ──────────────────────────────────────────────────
function getBaseUrl() {
    const url =
        process.env.API_BASE_URL ||           // ✅ preferred — plain server var
        process.env.NEXT_PUBLIC_BASE_URL ||   // fallback (may be undefined at SSR)
        "http://localhost:5000/api/";          // hard-coded last resort

    if (!url || url === "undefined") {
        console.error(
            "[api.server] ⚠️  Base URL is undefined.\n" +
            "   Add  API_BASE_URL=http://localhost:5000/api/  to frontend/.env\n" +
            "   and restart the Next.js dev server."
        );
    }

    return url;
}

// ── Shared axios factory ──────────────────────────────────────────────────────
async function serverClient() {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    const baseURL = getBaseUrl();

    return axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: true,
    });
}

// ── Shared error logger ───────────────────────────────────────────────────────
function logError(label, error) {
    if (error.response) {
        const status = error.response.status;
        if (status === 401) return; // expected for unauthenticated guests
        console.error(
            `[${label}] HTTP ${status} from ${error.config?.url}\n` +
            `  Body: ${JSON.stringify(error.response.data)}`
        );
    } else if (error.request) {
        console.error(
            `[${label}] No response received.\n` +
            `  URL attempted: ${error.config?.baseURL}${error.config?.url}\n` +
            `  Cause: ${error.message}\n` +
            "  → Is the backend server running? Is API_BASE_URL correct?"
        );
    } else {
        console.error(`[${label}] Request setup error: ${error.message}`);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// API functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getProfile — wrapped in React.cache() so that multiple Server Components
 * calling this within the same request share a single fetch result.
 * This prevents the admin layout from hitting the backend on every render
 * and eliminates the continuous GET /admin loop in Turbopack dev mode.
 */
export const getProfile = cache(async () => {
    try {
        const http = await serverClient();
        const response = await http.get("user/profile");
        return {
            success: response.data.success,
            data: response.data.user,
            message: response.data.message,
        };
    } catch (error) {
        logError("getProfile", error);
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || error.message || "Failed to fetch profile",
        };
    }
});

export const fetchRoomsServer = async (queryObject = {}) => {
    try {
        const http = await serverClient();
        const query = new URLSearchParams(queryObject).toString();
        const url = `room-type${query ? `?${query}` : ""}`;
        const { data } = await http.get(url);
        return {
            success: data.success,
            data: data.rooms ?? [],
            message: data.message,
        };
    } catch (error) {
        logError("fetchRoomsServer", error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || error.message || "Failed to fetch room types",
        };
    }
};

export const fetchCategoryServer = async (queryObject = {}) => {
    try {
        const http = await serverClient();
        const query = new URLSearchParams();
        if (queryObject.status !== undefined) query.append("status", queryObject.status);
        if (queryObject.limit) query.append("limit", queryObject.limit);
        const url = `category${query.toString() ? `?${query.toString()}` : ""}`;
        const { data } = await http.get(url);
        return {
            success: data.success,
            data: data.categories ?? [],
            message: data.message,
        };
    } catch (error) {
        logError("fetchCategoryServer", error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || error.message || "Failed to fetch categories",
        };
    }
};

export const fetchProductServer = async (queryObject = {}) => {
    try {
        const http = await serverClient();
        const query = new URLSearchParams();
        if (queryObject.status) query.append("status", queryObject.status);
        if (queryObject.limit) query.append("limit", queryObject.limit);
        const { data } = await http.get(`product?${query.toString()}`);
        return {
            success: data.success,
            data: data.products ?? [],
            message: data.message,
        };
    } catch (error) {
        logError("fetchProductServer", error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || error.message || "Failed to fetch products",
        };
    }
};

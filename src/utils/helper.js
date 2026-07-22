import axios from "axios";

const isDev = process.env.NODE_ENV === "development";

// BASE_URL always ends with exactly one slash so that
// client.get("user/login") → baseURL + "user/login" = ".../api/user/login" ✅
// Without trailing slash: ".../api" + "user/login" = ".../apiuser/login"   ❌
const rawBase = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";
const BASE_URL = `${rawBase.replace(/\/+$/, "")}/`;

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,       // increased from 10s — Render cold-starts can be slow
    withCredentials: true,
});

// ── Request interceptor — dev logging ─────────────────────────────────────────
client.interceptors.request.use((config) => {
    if (isDev) {
        const hasAuth = Boolean(config.headers?.Authorization);
        // Strip leading slash from config.url before concatenating with baseURL
        // to avoid double-slash in the logged URL (baseURL already ends with /)
        const urlPath = (config.url ?? "").replace(/^\/+/, "");
        console.debug(
            `[API →] ${config.method?.toUpperCase()} ${config.baseURL ?? ""}${urlPath}` +
            ` | auth-header: ${hasAuth ? "present" : "absent (using cookie)"}`
        );
    }
    return config;
});

// ── Response interceptor — error normalisation + dev logging ──────────────────
client.interceptors.response.use(
    (response) => {
        if (isDev) {
            console.debug(
                `[API ←] ${response.status} ${response.config?.method?.toUpperCase()} ` +
                response.config?.url
            );
        }
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const method = error.config?.method?.toUpperCase() ?? "?";
        const url = error.config?.url ?? "?";

        if (isDev) {
            console.warn(
                `[API ✗] ${status ?? "ERR"} ${method} ${url}`,
                error.response?.data ?? error.message
            );
        }

        // Normalise the error message so callers always get a human-readable string.
        // Map status codes → friendly messages; fall back to the server's message.
        let friendlyMessage;
        switch (status) {
            case 400:
                friendlyMessage = serverMessage || "Invalid request. Please check your input.";
                break;
            case 401:
                friendlyMessage = serverMessage || "Your session has expired. Please log in again.";
                break;
            case 403:
                // This is what the user was seeing as "CORD Forbidden"
                friendlyMessage =
                    serverMessage ||
                    "You do not have permission to perform this action. Admin access required.";
                break;
            case 404:
                friendlyMessage = serverMessage || "The requested resource was not found.";
                break;
            case 409:
                friendlyMessage = serverMessage || "A conflict occurred. This item may already exist.";
                break;
            case 422:
                friendlyMessage = serverMessage || "Validation failed. Please check all required fields.";
                break;
            case 429:
                friendlyMessage = "Too many requests. Please wait a moment and try again.";
                break;
            case 500:
            case 502:
            case 503:
                friendlyMessage = "Server error. Please try again later.";
                break;
            default:
                if (!error.response) {
                    // Network error / timeout / CORS
                    friendlyMessage =
                        "Unable to reach the server. Check your connection or ensure the backend is running.";
                } else {
                    friendlyMessage = serverMessage || `Unexpected error (${status}).`;
                }
        }

        // Attach the friendly message so every catch block can use:
        //   toast.error(error.friendlyMessage)
        // without needing to decode status codes each time.
        error.friendlyMessage = friendlyMessage;

        return Promise.reject(error);
    }
);

const generateSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
};

/**
 * Returns a safe image URL for use in <img> or next/image src.
 * Falls back to the provided placeholder if the URL is empty/null.
 */
const getSafeImageUrl = (url, fallback = "/placeholder.png") => {
    return url?.trim() ? url : fallback;
};

export { client, generateSlug, getSafeImageUrl };

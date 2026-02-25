/**
 * CSRF-aware fetch wrapper.
 *
 * Reads the `sm_csrf` cookie and attaches it as `X-CSRF-Token` header
 * on all mutation requests (POST, PATCH, PUT, DELETE).
 *
 * Usage:
 *   import { csrfFetch } from "@/lib/csrfFetch";
 *   const res = await csrfFetch("/api/profile", { method: "PATCH", body: ... });
 */

const CSRF_COOKIE = "sm_csrf";
const CSRF_HEADER = "X-CSRF-Token";
const MUTATION_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

function getCsrfToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${CSRF_COOKIE}=`));
    return match ? match.split("=")[1] : null;
}

export async function csrfFetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const method = (init?.method || "GET").toUpperCase();
    const headers = new Headers(init?.headers);

    if (MUTATION_METHODS.has(method)) {
        const token = getCsrfToken();
        if (token) {
            headers.set(CSRF_HEADER, token);
        }
    }

    return fetch(input, {
        ...init,
        headers,
        credentials: init?.credentials ?? "include",
    });
}

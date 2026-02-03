// src/lib/api.ts

// Use proxy route for all API calls (/api/* -> backend)
// This avoids CORS issues and keeps cookies same-origin
const API_PREFIX = "/api";
const ORG_STORAGE_KEY = "skymain_org_slug";
const DEFAULT_ORG_SLUG = "demo-org";

type ApiError = {
    detail?: string;
    message?: string;
};

// Simple request-id generator (enough for correlation; not a security token)
function makeRequestId(): string {
    // Prefer crypto.randomUUID when available (modern browsers)
    const c = globalThis.crypto as Crypto | undefined;
    if (c?.randomUUID) return `req-${c.randomUUID()}`;

    // Fallback: timestamp + random
    return `req-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const existingHeaders =
        options.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : (options.headers as Record<string, string> | undefined) ?? {};

    const orgSlug = getOrgSlug();
    const headers: Record<string, string> = {
        ...existingHeaders,
        "Content-Type": "application/json",
        "X-Request-Id": makeRequestId(),
    };

    if (orgSlug && !headers["X-Org-Slug"]) {
        headers["X-Org-Slug"] = orgSlug;
    }

    // Use proxy route: /api/v1/... -> proxied to backend /v1/...
    const res = await fetch(`${API_PREFIX}${path}`, {
        ...options,
        headers,
        credentials: "include", // ✅ send/receive httpOnly cookies
    });

    if (!res.ok) {
        let payload: ApiError | null = null;
        try {
            payload = (await res.json()) as ApiError;
        } catch {
            // ignore
        }
        const msg =
            payload?.detail || payload?.message || `Request failed (${res.status})`;
        throw new Error(msg);
    }


    // Handle empty responses safely
    const text = await res.text();
    return (text ? JSON.parse(text) : {}) as T;
}

export type User = {
    id?: string;
    email: string;
    role: "admin" | "user" | "operator" | string;
    organization?: string;
    organization_name?: string;
};

export type DocumentCreate = {
    kind: string;
    aircraft: string;
    ata: string;
    revision: string;
    title: string;
    storage_uri: string;
};

export type DocumentOut = DocumentCreate & {
    id: number;
    org_id: number;
};

export type DomainIntelligenceRequest = {
    aircraft_family: string;
    subsystem: string;
    question: string;
    ata?: string | null;
};

export type DomainIntelligenceCitation = {
    kind: "AMM" | "MEL" | "SRM" | "IPC";
    document_id: number;
    aircraft: string;
    ata: string;
    revision: string;
    title: string;
};

export type DomainIntelligenceSource = {
    kind: "AMM" | "MEL" | "SRM" | "IPC";
    count: number;
    documents: DomainIntelligenceCitation[];
};

export type DomainIntelligenceAnswerBlock = {
    type: "summary" | "steps" | "checks" | "warnings" | "notes";
    title: string;
    items: string[];
};

export type DomainIntelligenceResponse = {
    answer: string;
    ok?: boolean;
    answer_text?: string;
    answer_blocks?: DomainIntelligenceAnswerBlock[];
    citations: DomainIntelligenceCitation[];
    sources: DomainIntelligenceSource[];
    metadata: {
        aircraft_family: string;
        subsystem: string;
    };
};

export function getOrgSlug(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ORG_STORAGE_KEY);
}

export function setOrgSlug(slug: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ORG_STORAGE_KEY, slug);
}

export function ensureDefaultOrgSlug() {
    if (typeof window === "undefined") return;
    const current = window.localStorage.getItem(ORG_STORAGE_KEY);
    if (!current) {
        window.localStorage.setItem(ORG_STORAGE_KEY, DEFAULT_ORG_SLUG);
    }
}

export async function login(email: string, password: string) {
    return request<{ ok: boolean; user?: User }>("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function getMe() {
    return request<User>("/v1/auth/me", { method: "GET" });
}

export async function logout() {
    return request<{ ok: boolean }>("/v1/auth/logout", {
        method: "POST",
    });
}

export async function getHealth() {
    return request<{ status?: string }>("/v1/health", { method: "GET" });
}

export async function createDocument(payload: DocumentCreate) {
    return request<DocumentOut>("/v1/documents", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function answerDomainIntelligence(payload: DomainIntelligenceRequest) {
    return request<DomainIntelligenceResponse>("/v1/domain-intelligence/answer", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

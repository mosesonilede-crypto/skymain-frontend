const TRIAL_STORAGE_KEY = "skymaintain.trial";

export type TrialStatus = {
    startedAt: number;
    expiresAt: number;
    expired: boolean;
    daysRemaining: number;
};

const TRIAL_LENGTH_DAYS = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function safeParse(raw: string | null) {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as { startedAt?: number; expiresAt?: number };
    } catch {
        return null;
    }
}

/**
 * Starts a trial if one doesn't already exist.
 * Also syncs with the server to persist trial data.
 */
export async function startTrialIfMissing(now = Date.now()) {
    if (typeof window === "undefined") return;
    const existing = safeParse(window.localStorage.getItem(TRIAL_STORAGE_KEY));
    if (existing?.startedAt && existing?.expiresAt) return;

    const startedAt = now;
    const expiresAt = startedAt + TRIAL_LENGTH_DAYS * MS_PER_DAY;
    window.localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify({ startedAt, expiresAt }));

    // Sync trial to server (best effort)
    try {
        await fetch("/api/auth/trial", {
            method: "POST",
            credentials: "include",
        });
    } catch (e) {
        console.warn("Failed to sync trial to server:", e);
    }
}

export function getTrialStatus(now = Date.now()): TrialStatus | null {
    if (typeof window === "undefined") return null;
    const existing = safeParse(window.localStorage.getItem(TRIAL_STORAGE_KEY));
    if (!existing?.startedAt || !existing?.expiresAt) return null;

    const expired = now >= existing.expiresAt;
    const daysRemaining = Math.max(0, Math.ceil((existing.expiresAt - now) / MS_PER_DAY));

    return {
        startedAt: existing.startedAt,
        expiresAt: existing.expiresAt,
        expired,
        daysRemaining,
    };
}

export type ServerTrialStatus = {
    status: "trial" | "active" | "expired" | "pending";
    daysRemaining: number;
    hasActiveSubscription: boolean;
};

/**
 * Check trial status from the server.
 * This is the source of truth for trial status.
 */
export async function getServerTrialStatus(): Promise<ServerTrialStatus | null> {
    try {
        const res = await fetch("/api/auth/trial", { credentials: "include" });
        if (!res.ok) {
            return null;
        }
        const data = await res.json();
        return {
            status: data.status || "pending",
            daysRemaining: data.daysRemaining || 0,
            hasActiveSubscription: data.hasActiveSubscription || false,
        };
    } catch (e) {
        console.warn("Failed to check server trial status:", e);
        return null;
    }
}

export function clearTrial() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TRIAL_STORAGE_KEY);
}

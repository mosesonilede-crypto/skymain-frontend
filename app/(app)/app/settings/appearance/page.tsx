"use client";

import * as React from "react";

type DataMode = "mock" | "live" | "hybrid";

type ThemeMode = "light" | "dark";

type DashboardDensity = "compact" | "comfortable" | "spacious";

type LandingPageKey =
    | "dashboard"
    | "documentation"
    | "predictive_alerts"
    | "maintenance_logs"
    | "reports"
    | "regulatory_compliance"
    | "ai_insights"
    | "settings";

type AppearanceSettings = {
    theme: ThemeMode;
    dashboard_density: DashboardDensity;
    default_landing_page: LandingPageKey | null;
};

type ApiEnvelope<T> = {
    ok: boolean;
    data: T;
    meta?: { request_id?: string };
};

const DEFAULT_SETTINGS: AppearanceSettings = {
    theme: "light",
    dashboard_density: "comfortable",
    default_landing_page: null,
};

const DENSITY_OPTIONS: Array<{
    key: DashboardDensity;
    title: string;
    description: string;
}> = [
        { key: "compact", title: "Compact", description: "More information, less spacing" },
        { key: "comfortable", title: "Comfortable", description: "Balanced layout (recommended)" },
        { key: "spacious", title: "Spacious", description: "More spacing, easier scanning" },
    ];

const LANDING_PAGE_OPTIONS: Array<{ value: LandingPageKey; label: string }> = [
    { value: "dashboard", label: "Dashboard" },
    { value: "documentation", label: "Documentation" },
    { value: "predictive_alerts", label: "Predictive Alerts" },
    { value: "maintenance_logs", label: "Maintenance Logs" },
    { value: "reports", label: "Reports" },
    { value: "regulatory_compliance", label: "Regulatory Compliance" },
    { value: "ai_insights", label: "AI Insights" },
    { value: "settings", label: "Settings" },
];

function cx(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
    if (raw === "mock" || raw === "live" || raw === "hybrid") return raw;
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
}

let mockStore: AppearanceSettings = structuredClone(DEFAULT_SETTINGS);

function normalizeIncoming(incoming: Partial<AppearanceSettings> | null | undefined): AppearanceSettings {
    const safe = incoming ?? {};
    const theme: ThemeMode = safe.theme === "dark" || safe.theme === "light" ? safe.theme : DEFAULT_SETTINGS.theme;

    const density: DashboardDensity =
        safe.dashboard_density === "compact" ||
            safe.dashboard_density === "comfortable" ||
            safe.dashboard_density === "spacious"
            ? safe.dashboard_density
            : DEFAULT_SETTINGS.dashboard_density;

    const landing: LandingPageKey | null =
        safe.default_landing_page === null ||
            safe.default_landing_page === undefined ||
            LANDING_PAGE_OPTIONS.some((x) => x.value === safe.default_landing_page)
            ? (safe.default_landing_page ?? null)
            : DEFAULT_SETTINGS.default_landing_page;

    return {
        theme,
        dashboard_density: density,
        default_landing_page: landing,
    };
}

async function apiGetAppearance(signal?: AbortSignal): Promise<AppearanceSettings> {
    const mode = getDataMode();
    if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 160));
        return structuredClone(mockStore);
    }

    const base = getApiBaseUrl();
    if (!base) {
        await new Promise((r) => setTimeout(r, 120));
        return structuredClone(mockStore);
    }

    const res = await fetch(`${base}/v1/settings/appearance`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/settings/appearance failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<AppearanceSettings>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/settings/appearance");
    }

    const normalized = normalizeIncoming(json.data);
    if (mode === "hybrid") mockStore = structuredClone(normalized);
    return normalized;
}

async function apiPutAppearance(payload: AppearanceSettings): Promise<void> {
    const mode = getDataMode();

    if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 160));
        mockStore = structuredClone(payload);
        return;
    }

    const base = getApiBaseUrl();
    if (!base) {
        await new Promise((r) => setTimeout(r, 120));
        mockStore = structuredClone(payload);
        if (mode === "live") throw new Error("NEXT_PUBLIC_API_BASE_URL is not set (live mode requires backend).");
        return;
    }

    const res = await fetch(`${base}/v1/settings/appearance`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        if (mode === "hybrid") {
            mockStore = structuredClone(payload);
            return;
        }
        throw new Error(`PUT /v1/settings/appearance failed (${res.status})`);
    }

    if (mode === "hybrid") mockStore = structuredClone(payload);
}

export default function AppearanceSettingsPage(): React.ReactElement {
    const mode = getDataMode();

    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const [settings, setSettings] = React.useState<AppearanceSettings>(structuredClone(DEFAULT_SETTINGS));
    const [initialSnapshot, setInitialSnapshot] = React.useState<string>("");

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            setSuccess(null);

            try {
                const data = await apiGetAppearance(ac.signal);
                const normalized = normalizeIncoming(data);
                setSettings(normalized);
                setInitialSnapshot(JSON.stringify(normalized));
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load appearance settings.";
                setError(msg);
                const snap = JSON.stringify(DEFAULT_SETTINGS);
                setInitialSnapshot(snap);
            } finally {
                setLoading(false);
            }
        })();

        return () => ac.abort();
    }, []);

    const hasChanges = React.useMemo(() => JSON.stringify(settings) !== initialSnapshot, [settings, initialSnapshot]);

    function setTheme(next: ThemeMode): void {
        setSettings((prev) => ({ ...prev, theme: next }));
    }

    function setDensity(next: DashboardDensity): void {
        setSettings((prev) => ({ ...prev, dashboard_density: next }));
    }

    function setLanding(next: string): void {
        if (next === "") {
            setSettings((prev) => ({ ...prev, default_landing_page: null }));
            return;
        }
        const found = LANDING_PAGE_OPTIONS.find((x) => x.value === next);
        if (!found) return;
        setSettings((prev) => ({ ...prev, default_landing_page: found.value }));
    }

    async function onSave(): Promise<void> {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const payload: AppearanceSettings =
                settings.theme === "dark"
                    ? { ...settings, theme: "light" }
                    : settings;

            await apiPutAppearance(payload);
            setSettings(payload);
            setInitialSnapshot(JSON.stringify(payload));
            setSuccess("Appearance settings saved.");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to save appearance settings.";
            setError(msg);
        } finally {
            setSaving(false);
            window.setTimeout(() => setSuccess(null), 2500);
        }
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Appearance Preferences</h1>
                        <p className="mt-1 text-sm text-slate-600">Customize your user interface experience</p>
                    </div>

                    <span
                        className={cx(
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                            mode === "live"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : mode === "hybrid"
                                    ? "border-amber-200 bg-amber-50 text-amber-800"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                        )}
                        title="Data mode is controlled by NEXT_PUBLIC_DATA_MODE"
                    >
                        Data: {mode.toUpperCase()}
                    </span>
                </div>
            </div>

            {(error || success) && (
                <div className="mb-6 space-y-2">
                    {error && (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {success}
                        </div>
                    )}
                </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">Theme</h2>
                </div>

                <div className="px-5 py-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setTheme("light")}
                            disabled={loading || saving}
                            className={cx(
                                "relative w-full rounded-lg border px-4 py-3 text-left transition",
                                settings.theme === "light"
                                    ? "border-slate-400 bg-white"
                                    : "border-slate-200 bg-slate-50 hover:border-slate-300",
                                (loading || saving) && "opacity-60"
                            )}
                            aria-pressed={settings.theme === "light"}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Light Mode</div>
                                    <div className="mt-1 text-xs text-slate-600">Classic light interface</div>
                                </div>
                                {settings.theme === "light" && (
                                    <span className="mt-0.5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                        Selected
                                    </span>
                                )}
                            </div>
                            <div className="pointer-events-none absolute inset-0 rounded-lg ring-0 ring-slate-200 focus-visible:ring-2" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setTheme("dark")}
                            disabled={true}
                            className={cx("relative w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left opacity-70")}
                            aria-disabled="true"
                            title="Coming soon"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Dark Mode</div>
                                    <div className="mt-1 text-xs text-slate-600">Coming soon</div>
                                </div>
                                <span className="mt-0.5 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                    Coming soon
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">Dashboard Density</h2>
                </div>

                <div className="px-5 py-4">
                    <div className="space-y-3">
                        {DENSITY_OPTIONS.map((opt) => {
                            const selected = settings.dashboard_density === opt.key;
                            return (
                                <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => setDensity(opt.key)}
                                    disabled={loading || saving}
                                    className={cx(
                                        "w-full rounded-lg border px-4 py-3 text-left transition",
                                        selected ? "border-slate-400 bg-white" : "border-slate-200 bg-white hover:border-slate-300",
                                        (loading || saving) && "opacity-60"
                                    )}
                                    aria-pressed={selected}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">{opt.title}</div>
                                            <div className="mt-1 text-xs text-slate-600">{opt.description}</div>
                                        </div>
                                        {selected && (
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">Default Landing Page</h2>
                    <p className="mt-1 text-xs text-slate-600">Page shown immediately after login</p>
                </div>

                <div className="px-5 py-4">
                    <div className="max-w-md">
                        <select
                            value={settings.default_landing_page ?? ""}
                            onChange={(e) => setLanding(e.target.value)}
                            disabled={loading || saving}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
                        >
                            <option value="">Use organization default</option>
                            {LANDING_PAGE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end border-t border-slate-200 px-5 py-4">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={loading || saving || !hasChanges}
                        className={cx(
                            "rounded-lg px-4 py-2 text-sm font-semibold transition",
                            hasChanges ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-600",
                            (loading || saving) && "opacity-70"
                        )}
                    >
                        {saving ? "Saving..." : "Save Appearance Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}

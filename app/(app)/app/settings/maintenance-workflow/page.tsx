"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Maintenance Workflow Settings — functional wiring baseline
 *
 * Data mode:
 * - NEXT_PUBLIC_DATA_MODE=mock|live|hybrid
 *
 * Live endpoints (proposed minimal contract):
 * - GET  /v1/settings/workflow
 * - PUT  /v1/settings/workflow
 *
 * Notes:
 * - Footer + AI Mechanic FAB must be owned by the app shell layout, not page components.
 * - Status lifecycle is read-only (standard Part 145 progression) per prototype.
 */

type DataMode = "mock" | "live" | "hybrid";

type SignoffRule = "technician_only" | "technician_supervisor" | "dual_inspection";

type WorkflowStatus = "open" | "in_progress" | "inspected" | "closed";

type WorkflowSettings = {
    signoff_rule: SignoffRule;
    closure_required_fields: {
        findings_description: boolean;
        rectification_actions: boolean;
        reference_documents: boolean;
    };
    status_lifecycle: WorkflowStatus[];
    updated_at?: string;
    updated_by?: { display_name: string };
};

const DEFAULTS: WorkflowSettings = {
    signoff_rule: "technician_supervisor",
    closure_required_fields: {
        findings_description: true,
        rectification_actions: true,
        reference_documents: true,
    },
    status_lifecycle: ["open", "in_progress", "inspected", "closed"],
};

export default function MaintenanceWorkflowSettingsPage() {
    const [mode] = useState<DataMode>(() => {
        const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
        if (raw === "live" || raw === "hybrid" || raw === "mock") return raw;
        return "mock";
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const [initial, setInitial] = useState<WorkflowSettings>(DEFAULTS);
    const [draft, setDraft] = useState<WorkflowSettings>(DEFAULTS);

    const dirty = useMemo(
        () => JSON.stringify(stripMeta(initial)) !== JSON.stringify(stripMeta(draft)),
        [initial, draft]
    );

    const signoffOptions = useMemo(
        () =>
            [
                {
                    key: "technician_only" as const,
                    title: "Technician Only",
                    subtitle: "Single sign-off by technician",
                },
                {
                    key: "technician_supervisor" as const,
                    title: "Technician + Supervisor",
                    subtitle: "Requires supervisor approval",
                },
                {
                    key: "dual_inspection" as const,
                    title: "Dual Inspection Required",
                    subtitle: "Two independent inspections required",
                },
            ] as const,
        []
    );

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setErrorMsg(null);

            try {
                const s = await getWorkflowSettings({ mode });
                if (cancelled) return;
                setInitial(s);
                setDraft(s);
            } catch (err: unknown) {
                if (cancelled) return;
                setErrorMsg(
                    err instanceof Error && typeof err.message === "string"
                        ? err.message
                        : "Unable to load workflow settings."
                );

                if (mode === "hybrid") {
                    try {
                        const fallback = await getWorkflowSettings({ mode: "mock" });
                        if (cancelled) return;
                        setInitial(fallback);
                        setDraft(fallback);
                    } catch {
                        // keep error
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [mode]);

    useEffect(() => {
        if (!toastMsg) return;
        const t = setTimeout(() => setToastMsg(null), 2600);
        return () => clearTimeout(t);
    }, [toastMsg]);

    async function onSave() {
        setSaving(true);
        setErrorMsg(null);

        try {
            const saved = await saveWorkflowSettings({ mode, settings: draft });
            setInitial(saved);
            setDraft(saved);
            setToastMsg("Workflow settings updated.");
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Unable to save workflow settings.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="pt-1">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
                    <DataModePill mode={mode} />
                </div>
            </div>

            {toastMsg ? <Toast message={toastMsg} /> : null}

            {errorMsg ? <InlineBanner kind="error" title="Action required" body={errorMsg} /> : null}

            <Panel
                title="Maintenance Workflow Settings"
                subtitle="Configure task approval and documentation requirements"
            >
                {loading ? (
                    <SettingsSkeleton />
                ) : (
                    <div className="space-y-8">
                        <Section title="Maintenance Sign-Off Rules">
                            <div className="grid gap-3">
                                {signoffOptions.map((opt) => (
                                    <SelectableCard
                                        key={opt.key}
                                        title={opt.title}
                                        subtitle={opt.subtitle}
                                        checked={draft.signoff_rule === opt.key}
                                        onSelect={() => setDraft((p) => ({ ...p, signoff_rule: opt.key }))}
                                    />
                                ))}
                            </div>

                            <div className="mt-3 text-xs text-slate-600">
                                Sign-off rules are enforced at task closure and audit stamped in the maintenance record.
                            </div>
                        </Section>

                        <Section title="Mandatory Fields for Task Closure">
                            <div className="grid gap-3">
                                <ToggleTile
                                    title="Findings Description"
                                    subtitle="Require detailed findings documentation"
                                    enabled={draft.closure_required_fields.findings_description}
                                    onToggle={() =>
                                        setDraft((p) => ({
                                            ...p,
                                            closure_required_fields: {
                                                ...p.closure_required_fields,
                                                findings_description: !p.closure_required_fields.findings_description,
                                            },
                                        }))
                                    }
                                />
                                <ToggleTile
                                    title="Rectification Actions"
                                    subtitle="Require description of corrective actions"
                                    enabled={draft.closure_required_fields.rectification_actions}
                                    onToggle={() =>
                                        setDraft((p) => ({
                                            ...p,
                                            closure_required_fields: {
                                                ...p.closure_required_fields,
                                                rectification_actions: !p.closure_required_fields.rectification_actions,
                                            },
                                        }))
                                    }
                                />
                                <ToggleTile
                                    title="Reference Documents"
                                    subtitle="Require reference to manuals/procedures"
                                    enabled={draft.closure_required_fields.reference_documents}
                                    onToggle={() =>
                                        setDraft((p) => ({
                                            ...p,
                                            closure_required_fields: {
                                                ...p.closure_required_fields,
                                                reference_documents: !p.closure_required_fields.reference_documents,
                                            },
                                        }))
                                    }
                                />
                            </div>
                        </Section>

                        <Section title="Task Status Lifecycle">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                                    {draft.status_lifecycle.map((s, idx) => (
                                        <React.Fragment key={s}>
                                            <StatusPill status={s} />
                                            {idx < draft.status_lifecycle.length - 1 ? (
                                                <span className="text-slate-400">›</span>
                                            ) : null}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="mt-3 text-sm text-slate-600">
                                    Standard Part 145 workflow progression
                                </div>
                            </div>

                            <div className="mt-3 text-xs text-slate-600">
                                Lifecycle changes are controlled by governance. Custom workflows can be enabled as an
                                enterprise feature flag.
                            </div>
                        </Section>

                        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                                disabled={!dirty || saving}
                                onClick={() => setDraft(initial)}
                            >
                                Reset
                            </button>

                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                                disabled={!dirty || saving || !isValid(draft)}
                                onClick={onSave}
                            >
                                {saving ? "Saving…" : "Save Workflow Settings"}
                            </button>
                        </div>
                    </div>
                )}
            </Panel>
        </section>
    );
}

function Panel({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
            <div className="mt-5">{children}</div>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <div className="mt-4">{children}</div>
        </div>
    );
}

function SelectableCard({
    title,
    subtitle,
    checked,
    onSelect,
}: {
    title: string;
    subtitle: string;
    checked: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={[
                "w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition",
                checked ? "border-slate-900" : "border-slate-200 hover:bg-slate-50",
            ].join(" ")}
            aria-pressed={checked}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
                </div>
                <div className="shrink-0">{checked ? <CheckIcon /> : <span className="h-5 w-5" />}</div>
            </div>
        </button>
    );
}

function ToggleTile({
    title,
    subtitle,
    enabled,
    onToggle,
}: {
    title: string;
    subtitle: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50"
            aria-pressed={enabled}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
                </div>
                <div className="shrink-0">
                    <Switch enabled={enabled} />
                </div>
            </div>
        </button>
    );
}

function StatusPill({ status }: { status: WorkflowStatus }) {
    const label =
        status === "open"
            ? "Open"
            : status === "in_progress"
                ? "In Progress"
                : status === "inspected"
                    ? "Inspected"
                    : "Closed";

    return (
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
            {label}
        </span>
    );
}

function Switch({ enabled }: { enabled: boolean }) {
    return (
        <div
            className={[
                "h-6 w-11 rounded-full border transition",
                enabled ? "border-slate-900 bg-slate-900" : "border-slate-200 bg-slate-100",
            ].join(" ")}
        >
            <div
                className={[
                    "h-5 w-5 translate-y-[1px] rounded-full bg-white shadow-sm transition",
                    enabled ? "translate-x-5" : "translate-x-1",
                ].join(" ")}
            />
        </div>
    );
}

function InlineBanner({
    kind,
    title,
    body,
}: {
    kind: "error" | "info";
    title: string;
    body: string;
}) {
    const border = kind === "error" ? "border-rose-200" : "border-slate-200";
    const bg = kind === "error" ? "bg-rose-50" : "bg-slate-50";
    const text = kind === "error" ? "text-rose-900" : "text-slate-900";
    const sub = kind === "error" ? "text-rose-800/80" : "text-slate-700";

    return (
        <div className={`rounded-2xl border ${border} ${bg} p-4`}>
            <div className={`text-sm font-semibold ${text}`}>{title}</div>
            <div className={`mt-1 text-sm ${sub}`}>{body}</div>
        </div>
    );
}

function Toast({ message }: { message: string }) {
    return (
        <div className="fixed right-6 top-6 z-50 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg">
            {message}
        </div>
    );
}

function DataModePill({ mode }: { mode: DataMode }) {
    const label = mode === "live" ? "Live data" : mode === "hybrid" ? "Hybrid" : "Mock data";

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            {label}
        </div>
    );
}

function SettingsSkeleton() {
    return (
        <div className="space-y-5">
            <div className="h-5 w-72 animate-pulse rounded bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />

            <div className="h-5 w-64 animate-pulse rounded bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />

            <div className="h-5 w-52 animate-pulse rounded bg-slate-100" />
            <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-100" />

            <div className="h-12 w-52 animate-pulse rounded-xl bg-slate-100" />
        </div>
    );
}

async function getWorkflowSettings({
    mode,
}: {
    mode: DataMode;
}): Promise<WorkflowSettings> {
    if (mode === "mock") return mockWorkflowSettings();

    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
    if (!base) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL.");

    const url = `${base}/v1/settings/workflow`;
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) {
        const text = await safeText(res);
        throw new Error(
            `Backend error (${res.status}). ${text ? text : "Unable to load workflow settings."}`
        );
    }

    const data = (await res.json()) as WorkflowSettings;
    return normalizeSettings(data);
}

async function saveWorkflowSettings({
    mode,
    settings,
}: {
    mode: DataMode;
    settings: WorkflowSettings;
}): Promise<WorkflowSettings> {
    const normalized = normalizeSettings(settings);

    if (mode === "mock") return normalized;

    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
    if (!base) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL.");

    const url = `${base}/v1/settings/workflow`;
    const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            signoff_rule: normalized.signoff_rule,
            closure_required_fields: normalized.closure_required_fields,
            status_lifecycle: normalized.status_lifecycle,
        }),
    });

    if (!res.ok) {
        const text = await safeText(res);
        throw new Error(
            `Backend error (${res.status}). ${text ? text : "Unable to save workflow settings."}`
        );
    }

    const data = (await res.json()) as WorkflowSettings;
    return normalizeSettings(data);
}

function normalizeSettings(input: WorkflowSettings): WorkflowSettings {
    const merged: WorkflowSettings = {
        ...DEFAULTS,
        ...input,
        closure_required_fields: {
            ...DEFAULTS.closure_required_fields,
            ...(input.closure_required_fields || {}),
        },
    };

    if (
        merged.signoff_rule !== "technician_only" &&
        merged.signoff_rule !== "technician_supervisor" &&
        merged.signoff_rule !== "dual_inspection"
    ) {
        merged.signoff_rule = DEFAULTS.signoff_rule;
    }

    const normalizedLifecycle = normalizeLifecycle(merged.status_lifecycle);
    merged.status_lifecycle = normalizedLifecycle;

    return merged;
}

function normalizeLifecycle(input?: WorkflowStatus[]) {
    const canonical: WorkflowStatus[] = ["open", "in_progress", "inspected", "closed"];
    if (!Array.isArray(input) || input.length === 0) return canonical;

    const set = new Set<WorkflowStatus>();
    for (const v of input) {
        if (v === "open" || v === "in_progress" || v === "inspected" || v === "closed") {
            set.add(v);
        }
    }

    for (const c of canonical) {
        if (!set.has(c)) return canonical;
    }
    return canonical;
}

function stripMeta(s: WorkflowSettings) {
    const { updated_at, updated_by, ...rest } = s;
    void updated_at;
    void updated_by;
    return rest;
}

function isValid(s: WorkflowSettings) {
    return Boolean(s.signoff_rule) && Array.isArray(s.status_lifecycle) && s.status_lifecycle.length === 4;
}

async function safeText(res: Response) {
    try {
        const t = await res.text();
        return (t || "").slice(0, 300);
    } catch {
        return "";
    }
}

function mockWorkflowSettings(): WorkflowSettings {
    return {
        ...DEFAULTS,
        updated_at: "2026-01-22T14:05:00Z",
        updated_by: { display_name: "manager" },
    };
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

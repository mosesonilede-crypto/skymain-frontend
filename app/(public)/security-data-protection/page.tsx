"use client";

import * as React from "react";
import { CONTACT_DEMO } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";

type SecurityDoc = {
    page_label: string;
    title: string;
    intro: string;
    columns: Array<{
        heading: string;
        bullets: string[];
    }>;
    closing: string;
    cta_strip: {
        eyebrow: string;
        primary: { label: string; href: string };
        secondary: { label: string; href: string };
    };
};

type ApiEnvelope<T> = { ok: boolean; data: T; meta?: { request_id?: string } };

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

const DEFAULT_DOC: SecurityDoc = {
    page_label: "Security & Data Protection",
    title: "Security & Data Protection",
    intro: "SkyMaintain is designed with security-first principles to support enterprise aviation environments.",
    columns: [
        {
            heading: "Platform Security",
            bullets: [
                "Secure cloud infrastructure",
                "Encryption of data in transit and at rest",
                "Role-based access controls",
                "Secure authentication and authorization mechanisms",
            ],
        },
        {
            heading: "Operational Integrity",
            bullets: [
                "Audit-friendly logging and traceability",
                "Separation of operational and analytical layers",
                "Controlled access to sensitive data",
            ],
        },
        {
            heading: "Secure Development Practices",
            bullets: ["Secure development lifecycle principles", "Regular system monitoring", "Ongoing platform improvement"],
        },
    ],
    closing:
        "SkyMaintain is designed to support aviation safety and data protection requirements, while recognizing the sensitive nature of maintenance information.",
    cta_strip: {
        eyebrow: "Enterprise-grade security for aviation operations",
        primary: { label: "Start Your Free Trial", href: "/get-started" },
        secondary: { label: "Schedule a Demo", href: CONTACT_DEMO },
    },
};

let mockStore: SecurityDoc = structuredClone(DEFAULT_DOC);

async function apiGetSecurityDoc(signal?: AbortSignal): Promise<SecurityDoc> {
    const mode = getDataMode();

    if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 100));
        return structuredClone(mockStore);
    }

    const base = getApiBaseUrl();
    if (!base) {
        await new Promise((r) => setTimeout(r, 70));
        return structuredClone(mockStore);
    }

    const res = await fetch(`${base}/v1/legal/security-data-protection`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/legal/security-data-protection failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<SecurityDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/legal/security-data-protection");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

function Card({
    heading,
    bullets,
    loading,
}: {
    heading: string;
    bullets: string[];
    loading: boolean;
}): React.ReactElement {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">{heading}</h2>

            {loading ? (
                <div className="mt-4 grid gap-2">
                    {Array.from({ length: Math.max(3, bullets.length || 3) }).map((_, idx) => (
                        <div key={idx} className="h-4 animate-pulse rounded bg-slate-100" />
                    ))}
                </div>
            ) : (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                    {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function SecurityDataProtectionPage(): React.ReactElement {
    const mode = getDataMode();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<SecurityDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetSecurityDoc(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load Security & Data Protection.";
                setError(msg);
                setDoc(structuredClone(DEFAULT_DOC));
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    return (
        <div className="w-full">
            <div className="text-center">
                <div className="text-xs font-semibold tracking-wide text-slate-500">{doc.page_label}</div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{doc.title}</h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-700">{doc.intro}</p>

                <div className="mt-4">
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

                {error && (
                    <div className="mx-auto mt-5 max-w-2xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {error}
                    </div>
                )}
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
                <Card heading={doc.columns[0]?.heading ?? "Platform Security"} bullets={doc.columns[0]?.bullets ?? []} loading={loading} />
                <Card
                    heading={doc.columns[1]?.heading ?? "Operational Integrity"}
                    bullets={doc.columns[1]?.bullets ?? []}
                    loading={loading}
                />
                <Card
                    heading={doc.columns[2]?.heading ?? "Secure Development Practices"}
                    bullets={doc.columns[2]?.bullets ?? []}
                    loading={loading}
                />
            </div>

            <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-sm leading-relaxed text-slate-700">{doc.closing}</p>
            </div>

            <section className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-slate-900 px-6 py-8 text-center text-white">
                    <div className="text-sm font-semibold">{doc.cta_strip.eyebrow}</div>
                    <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href={doc.cta_strip.primary.href}
                            className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                            {doc.cta_strip.primary.label}
                        </a>
                        <a
                            href={doc.cta_strip.secondary.href}
                            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                        >
                            {doc.cta_strip.secondary.label}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import * as React from "react";
import { CONTACT_DEMO } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";

type SecuritySection = {
    title: string;
    bullets: string[];
};

type SecurityDoc = {
    badge: string;
    headline: string;
    intro: string;
    sections: SecuritySection[];
    closing: string;
    highlight: string;
    cta: {
        primary: { label: string; href: string };
        secondary: { label: string; href: string };
    };
};

type ApiEnvelope<T> = { ok: boolean; data: T; meta?: { request_id?: string } };

function cx(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "").toLowerCase();
    if (raw === "mock" || raw === "live" || raw === "hybrid") return raw;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();
    if (process.env.NODE_ENV === "production" && base) return "live";
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
}

/**
 * Canonical mock content (verbatim from Security & Data Protection prototype/PDF).
 */
const DEFAULT_DOC: SecurityDoc = {
    badge: "Security & Data Protection",
    headline: "Security & Data Protection",
    intro:
        "SkyMaintain is designed with security-first principles to support enterprise aviation environments.",
    sections: [
        {
            title: "Platform Security",
            bullets: [
                "Secure cloud infrastructure",
                "Encryption of data in transit and at rest",
                "Role-based access controls",
                "Secure authentication and authorization mechanisms",
            ],
        },
        {
            title: "Operational Integrity",
            bullets: [
                "Audit-friendly logging and traceability",
                "Separation of operational and analytical layers",
                "Controlled access to sensitive data",
            ],
        },
        {
            title: "Secure Development Practices",
            bullets: [
                "Secure development lifecycle principles",
                "Regular system monitoring",
                "Ongoing platform improvement",
            ],
        },
    ],
    closing:
        "SkyMaintain is designed to support aviation safety and data protection requirements, while recognizing the sensitive nature of maintenance information.",
    highlight: "Enterprise-grade security for aviation operations",
    cta: {
        primary: { label: "Start Your Free Trial", href: "/get-started" },
        secondary: { label: "Schedule a Demo", href: CONTACT_DEMO },
    },
};

let mockStore: SecurityDoc = structuredClone(DEFAULT_DOC);

async function apiGetSecurityDoc(signal?: AbortSignal): Promise<SecurityDoc> {
    const mode = getDataMode();

    if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 90));
        return structuredClone(mockStore);
    }

    const base = getApiBaseUrl();
    if (!base) {
        await new Promise((r) => setTimeout(r, 70));
        return structuredClone(mockStore);
    }

    try {
        const res = await fetch(`${base}/v1/public/security`, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            signal,
        });

        if (!res.ok) {
            if (mode === "hybrid") return structuredClone(mockStore);
            return structuredClone(mockStore);
        }

        const json = (await res.json()) as ApiEnvelope<SecurityDoc>;
        if (!json?.ok || !json?.data) {
            if (mode === "hybrid") return structuredClone(mockStore);
            return structuredClone(mockStore);
        }

        if (mode === "hybrid") mockStore = structuredClone(json.data);
        return json.data;
    } catch {
        return structuredClone(mockStore);
    }
}

function BulletIcon(): React.ReactElement {
    return (
        <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path
                    d="M20 6 9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}

function SectionCard({
    title,
    bullets,
    loading,
}: {
    title: string;
    bullets: string[];
    loading: boolean;
}): React.ReactElement {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

            {loading ? (
                <div className="mt-4 space-y-2">
                    {Array.from({ length: Math.max(3, bullets.length || 3) }).map((_, idx) => (
                        <div key={idx} className="h-4 animate-pulse rounded bg-slate-100" />
                    ))}
                </div>
            ) : (
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                    {bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <BulletIcon />
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function SecurityPage(): React.ReactElement {
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
                const msg = e instanceof Error ? e.message : "Failed to load Security page.";
                setError(msg);
                setDoc(structuredClone(DEFAULT_DOC));
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    const content = loading ? DEFAULT_DOC : doc;

    return (
        <div className="w-full">
            <section className="rounded-2xl bg-gradient-to-b from-slate-50 to-white px-6 py-12 text-center">
                <div className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    {content.badge}
                </div>

                <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    {content.headline}
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">
                    {content.intro}
                </p>

                {mode !== "mock" ? (
                    <div className="mt-4">
                        <span
                            className={cx(
                                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                                mode === "live"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-amber-200 bg-amber-50 text-amber-800"
                            )}
                            title="Data mode is controlled by NEXT_PUBLIC_DATA_MODE"
                        >
                            Data: {mode.toUpperCase()}
                        </span>
                    </div>
                ) : null}

                {error && (
                    <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {error}
                    </div>
                )}
            </section>

            <section className="mx-auto mt-10 max-w-5xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {content.sections.map((s, idx) => (
                        <SectionCard key={`${s.title}-${idx}`} title={s.title} bullets={s.bullets} loading={loading} />
                    ))}
                </div>

                <p className="mx-auto mt-10 max-w-4xl text-center text-sm leading-relaxed text-slate-600">
                    {content.closing}
                </p>

                <p className="mx-auto mt-4 max-w-4xl text-center text-sm font-semibold text-slate-900">
                    {content.highlight}
                </p>
            </section>

            <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-12 text-center text-white">
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href={content.cta.primary.href}
                            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                            {content.cta.primary.label}
                        </a>

                        <a
                            href={content.cta.secondary.href}
                            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
                        >
                            {content.cta.secondary.label}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import * as React from "react";
import { CONTACT_DEMO } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";

type FeatureBlock = {
    title: string;
    description: string;
    bullets: string[];
    icon: "spark" | "database" | "shield" | "people" | "cloud";
};

type PlatformFeaturesDoc = {
    badge: string;
    headline: string;
    intro: string;
    features: FeatureBlock[];
    cta: {
        headline: string;
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

const DEFAULT_DOC: PlatformFeaturesDoc = {
    badge: "Platform Features",
    headline: "Intelligent tools built to support aircraft maintenance decision-making",
    intro:
        "SkyMaintain is an AI-assisted software platform designed to help maintenance professionals analyze data, identify trends, and support informed decisions — while maintaining full compliance with aviation regulatory frameworks.",
    features: [
        {
            title: "Predictive Maintenance Intelligence",
            description:
                "SkyMaintain analyzes maintenance data to identify recurring issues, emerging risks, and performance trends across aircraft systems.",
            bullets: [
                "AI-assisted pattern recognition",
                "Early identification of high-risk components",
                "Trend analysis across maintenance events",
                "Decision-support insights, not automated decisions",
            ],
            icon: "spark",
        },
        {
            title: "Maintenance Data Integration",
            description: "Designed to work with structured maintenance records and operational data.",
            bullets: [
                "Supports ingestion of inspection records, defect reports, and maintenance logs",
                "Modular architecture for system-specific analysis (hydraulics, landing gear, powerplant, etc.)",
                "Built to evolve with operator data maturity",
            ],
            icon: "database",
        },
        {
            title: "Regulatory-Aligned Architecture",
            description: "SkyMaintain is built with regulatory awareness at its core.",
            bullets: [
                "Architecture informed by FAA and EASA maintenance principles",
                "Supports traceability, documentation, and audit readiness",
                "Designed to complement — not replace — approved maintenance programs",
            ],
            icon: "shield",
        },
        {
            title: "Technician & Engineer Support",
            description: "Clear, intuitive dashboards reduce cognitive load and information fragmentation.",
            bullets: [
                "Human-centered design for maintenance professionals",
                "Visual insights to support troubleshooting and planning",
                "Encourages consistent, informed decision-making",
            ],
            icon: "people",
        },
        {
            title: "Secure, Scalable SaaS Platform",
            description: "Enterprise-ready foundation designed for growth.",
            bullets: [
                "Role-based access control",
                "Secure cloud-native architecture",
                "Audit-friendly system design",
                "Scalable for operators, MROs, and training environments",
            ],
            icon: "cloud",
        },
    ],
    cta: {
        headline: "Ready to see SkyMaintain in action?",
        primary: { label: "Start Your Free Trial", href: "/get-started" },
        secondary: { label: "Schedule a Demo", href: CONTACT_DEMO },
    },
};

let mockStore: PlatformFeaturesDoc = structuredClone(DEFAULT_DOC);

async function apiGetPlatformFeatures(signal?: AbortSignal): Promise<PlatformFeaturesDoc> {
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

    const res = await fetch(`${base}/v1/public/platform-features`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/platform-features failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<PlatformFeaturesDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/platform-features");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

function Icon({ kind }: { kind: FeatureBlock["icon"] }): React.ReactElement {
    const common = "h-7 w-7";
    switch (kind) {
        case "spark":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path
                        d="M12 2l1.2 6.1L20 10l-6.8 1.9L12 18l-1.2-6.1L4 10l6.8-1.9L12 2Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "database":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path
                        d="M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    />
                    <path
                        d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "shield":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path
                        d="M12 2 20 6v7c0 5-3.4 9-8 9s-8-4-8-9V6l8-4Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "people":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path d="M16 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M4 20c1.4-3.2 4.2-5 8-5s6.6 1.8 8 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M7 10a2.5 2.5 0 1 1 0-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case "cloud":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path
                        d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 18Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                </svg>
            );
    }
}

function FeatureCard({ block, loading }: { block: FeatureBlock; loading: boolean }): React.ReactElement {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-blue-600">
                <Icon kind={block.icon} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">{block.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{block.description}</p>

            {loading ? (
                <div className="mt-4 grid gap-2">
                    {Array.from({ length: Math.max(3, block.bullets.length || 3) }).map((_, idx) => (
                        <div key={idx} className="h-4 animate-pulse rounded bg-slate-100" />
                    ))}
                </div>
            ) : (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                    {block.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function PlatformFeaturesPage(): React.ReactElement {
    const mode = getDataMode();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<PlatformFeaturesDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetPlatformFeatures(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load Platform Features.";
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
            <div className="text-center">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    {content.badge}
                </div>

                <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    {content.headline}
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">{content.intro}</p>

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
                    <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {error}
                    </div>
                )}
            </div>

            <div className="mx-auto mt-10 max-w-5xl space-y-6">
                {content.features.map((block, idx) => (
                    <FeatureCard key={`${block.title}-${idx}`} block={block} loading={loading} />
                ))}
            </div>

            <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-10 text-center text-white">
                    <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{content.cta.headline}</h3>

                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href={content.cta.primary.href}
                            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                            {content.cta.primary.label}
                        </a>

                        <a
                            href={content.cta.secondary.href}
                            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
                        >
                            {content.cta.secondary.label}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

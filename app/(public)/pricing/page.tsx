"use client";

import * as React from "react";
import { CONTACT_DEMO, CONTACT_PRICING } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";
type TierId = "starter" | "professional" | "enterprise";

type PricingTier = {
    id: TierId;
    name: string;
    tagline: string;
    bullets: string[];
    cta_label: string;
    cta_href: string;
    is_popular?: boolean;
};

type PricingDoc = {
    badge: string;
    headline: string;
    subhead: string;
    note: string;
    tiers: PricingTier[];
    footer_note: string;
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

const PRICING_INTENT_HREF = CONTACT_PRICING;

const DEFAULT_DOC: PricingDoc = {
    badge: "Pricing",
    headline: "Pricing Designed for Aviation Operations",
    subhead:
        "Flexible pricing models to support operators, MROs, and maintenance organizations of all sizes.",
    note:
        "SkyMaintain pricing is tailored based on operational scale, data scope, and integration requirements.",
    tiers: [
        {
            id: "starter",
            name: "Starter (Pilot Program)",
            tagline: "Ideal for evaluation and proof-of-concept use.",
            bullets: ["Limited user access", "Core analytics and dashboards", "Initial data ingestion support"],
            cta_label: "Contact us for pricing",
            cta_href: PRICING_INTENT_HREF,
        },
        {
            id: "professional",
            name: "Professional",
            tagline: "Designed for active operational use.",
            bullets: ["Expanded user access", "Advanced analytics", "Compliance-aligned reporting", "Priority support"],
            cta_label: "Contact us for pricing",
            cta_href: PRICING_INTENT_HREF,
            is_popular: true,
        },
        {
            id: "enterprise",
            name: "Enterprise",
            tagline: "For large operators and complex environments.",
            bullets: ["Custom integrations", "Dedicated support", "SLA options", "Flexible deployment models"],
            cta_label: "Contact us for pricing",
            cta_href: PRICING_INTENT_HREF,
        },
    ],
    footer_note:
        "SkyMaintain pricing is customized to ensure alignment with operational complexity and regulatory requirements.",
    cta: {
        headline: "Ready to get started?",
        primary: { label: "Request Pricing", href: PRICING_INTENT_HREF },
        secondary: { label: "Schedule a Demo", href: CONTACT_DEMO },
    },
};

let mockStore: PricingDoc = structuredClone(DEFAULT_DOC);

async function apiGetPricing(signal?: AbortSignal): Promise<PricingDoc> {
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

    const res = await fetch(`${base}/v1/public/pricing`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/pricing failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<PricingDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/pricing");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

function CheckIcon(): React.ReactElement {
    return (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
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

function TierCard({ tier }: { tier: PricingTier }): React.ReactElement {
    const isPopular = Boolean(tier.is_popular);

    return (
        <div
            className={cx(
                "relative rounded-2xl border bg-white p-7 shadow-sm",
                isPopular ? "border-blue-600 ring-2 ring-blue-200" : "border-slate-200"
            )}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="text-left">
                <h2 className="text-xl font-semibold text-slate-900">{tier.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{tier.tagline}</p>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {tier.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">{CheckIcon()}</div>
                        <span>{b}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-7">
                <a
                    href={tier.cta_href}
                    className={cx(
                        "inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold",
                        isPopular
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                    )}
                >
                    {tier.cta_label}
                </a>
            </div>
        </div>
    );
}

export default function PricingPage(): React.ReactElement {
    const mode = getDataMode();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<PricingDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetPricing(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load Pricing.";
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
                    {content.subhead}
                </p>

                <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
                    {content.note}
                </p>

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
            </section>

            <section className="mx-auto mt-10 max-w-5xl">
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
                                <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
                                <div className="mt-6 space-y-2">
                                    <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                                    <div className="h-4 w-4/6 animate-pulse rounded bg-slate-100" />
                                    <div className="h-4 w-3/6 animate-pulse rounded bg-slate-100" />
                                    <div className="h-4 w-4/6 animate-pulse rounded bg-slate-100" />
                                </div>
                                <div className="mt-7 h-10 w-full animate-pulse rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {content.tiers.map((tier) => (
                            <TierCard key={tier.id} tier={tier} />
                        ))}
                    </div>
                )}

                <p className="mx-auto mt-10 max-w-4xl text-center text-sm leading-relaxed text-slate-600">
                    {content.footer_note}
                </p>
            </section>

            <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-12 text-center text-white">
                    <h3 className="text-3xl font-semibold tracking-tight">{content.cta.headline}</h3>

                    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

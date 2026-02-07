"use client";

import * as React from "react";

type DataMode = "mock" | "live" | "hybrid";

type CareersDoc = {
    badge: string;
    headline: string;
    intro: string;
    paragraph: string;
    areas_title: string;
    areas: string[];
    touch_title: string;
    touch_text: string;
    email: string;
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
 * Canonical mock content (verbatim from Careers prototype/PDF).
 */
const DEFAULT_DOC: CareersDoc = {
    badge: "Careers",
    headline: "Careers at SkyMaintain",
    intro:
        "SkyMaintain is building the next generation of AI-assisted decision-support tools for aviation maintenance professionals.",
    paragraph:
        "While we are a growing platform, we are always interested in connecting with individuals who share a passion for aviation safety, engineering excellence, and responsible technology development.",
    areas_title: "Areas of Interest",
    areas: [
        "Aircraft Maintenance & Engineering",
        "Aviation Safety & Compliance",
        "Data & AI Systems",
        "Product, UX, and Platform Design",
    ],
    touch_title: "Get in Touch",
    touch_text: "Interested in joining our team or learning more about opportunities?",
    email: "careers@skymaintain.ai",
};

let mockStore: CareersDoc = structuredClone(DEFAULT_DOC);

async function apiGetCareers(signal?: AbortSignal): Promise<CareersDoc> {
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

    const res = await fetch(`${base}/v1/public/careers`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/careers failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<CareersDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/careers");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
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

export default function CareersPage(): React.ReactElement {
    const mode = getDataMode();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<CareersDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetCareers(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load Careers page.";
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

                <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-slate-700">
                    {content.intro}
                </p>

                <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
                    {content.paragraph}
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

            <section className="mx-auto mt-10 max-w-5xl space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">{content.areas_title}</h2>

                    {loading ? (
                        <div className="mt-4 space-y-2">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="h-4 animate-pulse rounded bg-slate-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {content.areas.map((a, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                                >
                                    <BulletIcon />
                                    <div className="text-sm font-medium text-slate-800">{a}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">{content.touch_title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">{content.touch_text}</p>

                    <div className="mt-4">
                        <a
                            href={`mailto:${content.email}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <span aria-hidden="true">✉</span>
                            <span>{content.email}</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

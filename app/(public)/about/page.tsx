"use client";

import * as React from "react";
import { CONTACT_DEMO } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";

type AboutDoc = {
    badge: string;
    headline: string;
    intro: string;
    product_line: string;
    bridge_line: string;
    mission_title: string;
    mission_text: string;
    approach_title: string;
    approach_bullets: string[];
    closing_headline: string;
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
 * Canonical mock content (verbatim from About Us prototype/PDF).
 */
const DEFAULT_DOC: AboutDoc = {
    badge: "About Us",
    headline: "About SkyMaintain",
    intro:
        "SkyMaintain is an AI-assisted aircraft maintenance decision-support platform designed to enhance safety, efficiency, and regulatory alignment in aviation maintenance operations.",
    product_line:
        "SkyMaintain is a product of EncycloAMTs LLC, an aviation technology and training company focused on advancing maintenance knowledge, decision support, and workforce capability.",
    bridge_line:
        "Built by professionals with deep experience in aircraft maintenance, engineering, logistics, and regulatory environments, SkyMaintain bridges operational expertise with modern AI-driven analytics.",
    mission_title: "Our Mission",
    mission_text:
        "To support aircraft maintenance professionals with intelligent tools that enhance human decision-making while respecting regulatory boundaries.",
    approach_title: "Our Approach",
    approach_bullets: [
        "Human-in-the-loop design",
        "Regulatory-aware architecture",
        "Practical, operationally grounded insights",
        "Continuous improvement driven by industry feedback",
    ],
    closing_headline: "Join us in advancing aviation maintenance",
    cta: {
        primary: { label: "Start Your Free Trial", href: "/get-started" },
        secondary: { label: "Schedule a Demo", href: CONTACT_DEMO },
    },
};

let mockStore: AboutDoc = structuredClone(DEFAULT_DOC);

async function apiGetAbout(signal?: AbortSignal): Promise<AboutDoc> {
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

    const res = await fetch(`${base}/v1/public/about`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/about failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<AboutDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/about");
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

export default function AboutPage(): React.ReactElement {
    const mode = getDataMode();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<AboutDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetAbout(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load About page.";
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
                    <p className="text-sm leading-relaxed text-slate-700">{content.product_line}</p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700">{content.bridge_line}</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">{content.mission_title}</h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700">{content.mission_text}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">{content.approach_title}</h2>
                        {loading ? (
                            <div className="mt-4 space-y-2">
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <div key={idx} className="h-4 animate-pulse rounded bg-slate-100" />
                                ))}
                            </div>
                        ) : (
                            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                                {content.approach_bullets.map((b, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <BulletIcon />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-12 text-center text-white">
                    <h3 className="text-3xl font-semibold tracking-tight">{content.closing_headline}</h3>

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

"use client";

import * as React from "react";
import { CONTACT_DEMO } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";

type BenefitTile = {
    title: string;
    description: string;
    icon: "visibility" | "overhead" | "audit" | "accountability";
};

type SectionBlock =
    | {
        kind: "callout_list";
        title: string;
        body: string[];
        bullets: string[];
        footer_note?: string;
    }
    | {
        kind: "bullets";
        title: string;
        body: string[];
        bullets: string[];
        footer_note?: string;
    };

type RegulatoryComplianceAutomationDoc = {
    page_label: string;
    headline: string;
    subhead: string;
    intro: string;
    what_it_does: SectionBlock;
    how_it_works: SectionBlock;
    benefits: {
        title: string;
        tiles: BenefitTile[];
    };
    designed_for_regulated: {
        title: string;
        body: string[];
        bullets: string[];
        warning: string;
    };
    human_in_the_loop: {
        title: string;
        body: string[];
        bullets: string[];
        footer_note: string;
    };
    transparency: {
        title: string;
        body: string[];
        bullets: string[];
        footer_note: string;
    };
    who_its_for: {
        title: string;
        body: string[];
        groups: string[];
        closing: string;
    };
    final_cta: {
        title: string;
        body: string[];
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

const DEFAULT_DOC: RegulatoryComplianceAutomationDoc = {
    page_label: "Regulatory Compliance Automation",
    headline: "Simplify Compliance Without Compromising Oversight",
    subhead:
        "Automated visibility and tracking tools that help maintenance organizations stay aligned with regulatory requirements—without replacing professional judgment.",
    intro: "",
    what_it_does: {
        kind: "callout_list",
        title: "What It Does",
        body: [
            "SkyMaintain's Regulatory Compliance Automation module helps maintenance teams track, organize, and manage regulatory obligations more efficiently.",
            "The platform provides structured visibility into compliance-related information so organizations can:",
        ],
        bullets: [
            "Monitor applicable FAA and EASA requirements",
            "Track airworthiness directives and compliance deadlines",
            "Maintain organized compliance records",
            "Reduce administrative burden and missed obligations",
        ],
        footer_note: "SkyMaintain supports compliance management, not regulatory decision-making.",
    },
    how_it_works: {
        kind: "callout_list",
        title: "How It Works",
        body: [
            "The system aggregates regulatory references and compliance-related data into a centralized dashboard, helping teams stay informed of:",
        ],
        bullets: [
            "Applicable airworthiness directives (ADs)",
            "Compliance timelines and status indicators",
            "Maintenance actions linked to regulatory items",
            "Documentation and audit-readiness signals",
        ],
        footer_note:
            "Automated alerts and reminders help ensure nothing is overlooked, while final compliance determinations remain with authorized personnel.",
    },
    benefits: {
        title: "Key Benefits",
        tiles: [
            {
                title: "Improved Compliance Visibility",
                description: "See regulatory obligations clearly across aircraft, components, and maintenance programs.",
                icon: "visibility",
            },
            {
                title: "Reduced Administrative Overhead",
                description: "Minimize manual tracking and spreadsheet-based compliance management.",
                icon: "overhead",
            },
            {
                title: "Audit-Ready Documentation",
                description: "Maintain organized records to support internal reviews and external audits.",
                icon: "audit",
            },
            {
                title: "Clear Accountability",
                description: "Ensure compliance actions are assigned, tracked, and reviewed by responsible personnel.",
                icon: "accountability",
            },
        ],
    },
    designed_for_regulated: {
        title: "Designed for Regulated Environments",
        body: ["SkyMaintain is built with the realities of aviation regulation in mind.", "The platform:"],
        bullets: [
            "Supports FAA and EASA maintenance governance frameworks",
            "Preserves clear audit trails and traceability",
            "Avoids automated regulatory determinations",
            "Reinforces documented, human-approved compliance actions",
        ],
        warning:
            "SkyMaintain does not issue regulatory approvals, certify compliance, or replace authority-mandated oversight.",
    },
    human_in_the_loop: {
        title: "Human-in-the-Loop Compliance",
        body: ["SkyMaintain is intentionally designed to support—not substitute—regulatory accountability."],
        bullets: [
            "No automated compliance sign-offs",
            "No override of approved maintenance programs",
            "No substitution for required inspections or certifications",
        ],
        footer_note: "Every compliance-related action remains under the control of qualified, authorized professionals.",
    },
    transparency: {
        title: "Transparency & Trust",
        body: ["SkyMaintain emphasizes responsible system design:"],
        bullets: [
            "Clear separation between automation and decision authority",
            "Transparent compliance status indicators",
            "Customer ownership of compliance data",
            "No sale or external monetization of regulatory information",
        ],
        footer_note: "Compliance insights are informational tools, not regulatory judgments.",
    },
    who_its_for: {
        title: "Who It's For",
        body: ["This capability supports:"],
        groups: [
            "Airlines and fleet operators",
            "MRO compliance departments",
            "Continuing airworthiness management organizations (CAMOs)",
            "Engineering and quality assurance teams",
            "Safety and compliance leadership",
        ],
        closing: "Whether managing a single fleet or multiple operators, SkyMaintain helps teams maintain clarity and control.",
    },
    final_cta: {
        title: "Ready to Modernize Compliance Management?",
        body: [
            "Discover how structured automation can improve oversight, accountability, and audit readiness—without sacrificing regulatory integrity.",
        ],
        primary: { label: "Start a Free Trial", href: "/get-started" },
        secondary: { label: "Schedule a Demo", href: CONTACT_DEMO },
    },
};

let mockStore: RegulatoryComplianceAutomationDoc = structuredClone(DEFAULT_DOC);

async function apiGetDoc(signal?: AbortSignal): Promise<RegulatoryComplianceAutomationDoc> {
    const mode = getDataMode();

    if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 110));
        return structuredClone(mockStore);
    }

    const base = getApiBaseUrl();
    if (!base) {
        await new Promise((r) => setTimeout(r, 70));
        return structuredClone(mockStore);
    }

    const res = await fetch(`${base}/v1/public/regulatory-compliance-automation`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/regulatory-compliance-automation failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<RegulatoryComplianceAutomationDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/regulatory-compliance-automation");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

function Icon({ kind }: { kind: BenefitTile["icon"] }): React.ReactElement {
    const common = "h-7 w-7";
    switch (kind) {
        case "visibility":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path
                        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
            );
        case "overhead":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path
                        d="M5 7h14M7 7V5.5A2.5 2.5 0 0 1 9.5 3h5A2.5 2.5 0 0 1 17 5.5V7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path d="M6 7l1 14h10l1-14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case "audit":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path d="M9 3h6l2 2v16H7V5l2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M10 7h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case "accountability":
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M5 21c1.5-4 5-6 7-6s5.5 2 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
    }
}

function CalloutSection({
    title,
    body,
    bullets,
    footerNote,
    loading,
}: {
    title: string;
    body: string[];
    bullets: string[];
    footerNote?: string;
    loading: boolean;
}): React.ReactElement {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                {body.map((p, i) => (
                    <p key={i}>{p}</p>
                ))}
            </div>

            {loading ? (
                <div className="mt-5 grid gap-2">
                    {Array.from({ length: Math.max(4, bullets.length || 4) }).map((_, idx) => (
                        <div key={idx} className="h-4 animate-pulse rounded bg-slate-100" />
                    ))}
                </div>
            ) : (
                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                    {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>
            )}

            {footerNote ? (
                <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    {footerNote}
                </div>
            ) : null}
        </section>
    );
}

export default function RegulatoryComplianceAutomationPage(): React.ReactElement {
    const mode = getDataMode();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<RegulatoryComplianceAutomationDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetDoc(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load module page.";
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
                <div className="text-sm font-semibold text-slate-700">{content.page_label}</div>
                <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    {content.headline}
                </h1>
                <p className="mx-auto mt-4 max-w-4xl text-sm leading-relaxed text-slate-700">{content.subhead}</p>

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

            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6">
                <CalloutSection
                    title={content.what_it_does.title}
                    body={content.what_it_does.body}
                    bullets={content.what_it_does.bullets}
                    footerNote={content.what_it_does.footer_note}
                    loading={loading}
                />
                <CalloutSection
                    title={content.how_it_works.title}
                    body={content.how_it_works.body}
                    bullets={content.how_it_works.bullets}
                    footerNote={content.how_it_works.footer_note}
                    loading={loading}
                />
            </div>

            <section className="mx-auto mt-10 max-w-5xl">
                <h2 className="text-xl font-semibold text-slate-900">{content.benefits.title}</h2>

                <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {content.benefits.tiles.map((t, idx) => (
                        <div key={`${t.title}-${idx}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-blue-600">
                                <Icon kind={t.icon} />
                            </div>
                            <h3 className="mt-5 text-base font-semibold text-slate-900">{t.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-700">{t.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">{content.designed_for_regulated.title}</h2>

                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                    {content.designed_for_regulated.body.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>

                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                    {content.designed_for_regulated.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>

                <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    {content.designed_for_regulated.warning}
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">{content.human_in_the_loop.title}</h2>

                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                    {content.human_in_the_loop.body.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>

                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                    {content.human_in_the_loop.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>

                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                    {content.human_in_the_loop.footer_note}
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">{content.transparency.title}</h2>

                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                    {content.transparency.body.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>

                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                    {content.transparency.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>

                <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                    {content.transparency.footer_note}
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">{content.who_its_for.title}</h2>

                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                    {content.who_its_for.body.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>

                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                    {content.who_its_for.groups.map((g, i) => (
                        <li key={i}>{g}</li>
                    ))}
                </ul>

                <p className="mt-5 text-sm leading-relaxed text-slate-700">{content.who_its_for.closing}</p>
            </section>

            <section className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 px-6 py-10 text-center text-white">
                    <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{content.final_cta.title}</h3>
                    {content.final_cta.body.map((line, idx) => (
                        <p key={idx} className="mx-auto mt-3 max-w-4xl text-sm leading-relaxed text-white/90">
                            {line}
                        </p>
                    ))}

                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href={content.final_cta.primary.href}
                            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                            {content.final_cta.primary.label}
                        </a>
                        <a
                            href={content.final_cta.secondary.href}
                            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
                        >
                            {content.final_cta.secondary.label}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_DEMO } from "@/lib/routes";

// Figma asset URLs for icons
const iconBadge = "https://www.figma.com/api/mcp/asset/b5966af9-c778-47b6-9820-532dbaf57b6b";
const iconArrow = "https://www.figma.com/api/mcp/asset/1464c41c-ab9f-48f1-90fb-50654a89586a";
const iconDeterministic = "https://www.figma.com/api/mcp/asset/c631e507-9ed0-4c38-8935-b407feba3dae";
const iconPolicy = "https://www.figma.com/api/mcp/asset/ff1e0574-b5e2-4064-87aa-585c36de1725";
const iconTraceability = "https://www.figma.com/api/mcp/asset/04e67b42-429d-4232-b500-1eb701a84e71";
const iconPredictive = "https://www.figma.com/api/mcp/asset/738016d1-8556-46b0-8e2c-b6bc7366720e";
const iconRegulated = "https://www.figma.com/api/mcp/asset/fa174900-8ce5-4274-9f9c-0118b509dc1b";
const iconOutputs = "https://www.figma.com/api/mcp/asset/f8e10bd0-9460-4cf9-9532-ecd5556c223e";
const iconNoBlackBox = "https://www.figma.com/api/mcp/asset/af22291d-db0e-4161-983e-bcea0652f461";
const iconHumanLoop = "https://www.figma.com/api/mcp/asset/13f7dc02-0be3-4558-b077-a565c873e372";
const iconSeparation = "https://www.figma.com/api/mcp/asset/55bc640b-9e68-4ebb-9dc7-229319bbe381";
const iconSafety = "https://www.figma.com/api/mcp/asset/64a121f2-35e6-4c0e-9ed5-84c4c577e284";
const iconAlignment = "https://www.figma.com/api/mcp/asset/28164d5f-5125-47d8-8cfb-6b8c154fdb79";
const iconAudit = "https://www.figma.com/api/mcp/asset/135ce890-a0f2-4240-80e0-4ec53a216ebc";
const iconSecurityTenant = "https://www.figma.com/api/mcp/asset/a107a37f-a3f8-4d8d-84d4-f17f40331c65";
const iconTransparency = "https://www.figma.com/api/mcp/asset/020bda5c-b650-4ea8-a59e-73a1330eea3f";
const iconEngineering = "https://www.figma.com/api/mcp/asset/71e1c11d-c988-482a-86fc-60e4927b66da";
const iconPlanning = "https://www.figma.com/api/mcp/asset/cb7d4135-7ca6-4bb8-b227-b11e378b58b4";
const iconQA = "https://www.figma.com/api/mcp/asset/fe515090-4ab5-462e-8c9e-f82622505115";
const iconLeadership = "https://www.figma.com/api/mcp/asset/c0a00756-67f3-4d1c-85a2-af32aa483be7";

type DataMode = "mock" | "live" | "hybrid";

type FeatureCard = {
    icon: string;
    iconBg: string;
    title: string;
    description: string;
};

type DifferentiatorItem = {
    icon: string;
    iconBg: string;
    title: string;
    description: string;
};

type EnvironmentCard = {
    icon: string;
    iconBg: string;
    title: string;
    description: string;
};

type UseCaseCard = {
    icon: string;
    iconBg: string;
    title: string;
    description: string;
};

type EnterprisePageData = {
    hero: {
        badge: string;
        headline: string[];
        subheadline: string;
        tagline: string;
        primaryCta: { label: string; href: string };
        secondaryCta: { label: string; href: string };
    };
    accountability: {
        headline: string;
        description: string;
        tagline: string;
    };
    operationalIntelligence: {
        headline: string;
        cards: FeatureCard[];
    };
    differentiators: {
        headline: string;
        subheadline: string;
        items: DifferentiatorItem[];
    };
    environments: {
        headline: string;
        cards: EnvironmentCard[];
    };
    useCases: {
        headline: string;
        cards: UseCaseCard[];
    };
    aviationRealities: {
        headline: string;
        description1: string;
        description2: string;
    };
    evaluation: {
        headline: string;
        description: string;
        cta: { label: string; href: string };
    };
};

type ApiEnvelope<T> = { ok: boolean; data: T; meta?: { request_id?: string } };

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
    if (raw === "mock" || raw === "live" || raw === "hybrid") return raw;
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
}

const DEFAULT_DATA: EnterprisePageData = {
    hero: {
        badge: "Enterprise Aircraft Maintenance Intelligence",
        headline: ["Regulatory-Grade AI for", "Aircraft Maintenance Operations"],
        subheadline:
            "Deterministic, auditable, and policy-aligned decision support for airlines, MROs, and regulated maintenance environments.",
        tagline:
            "Designed to support compliance-driven maintenance workflows without compromising human authority, safety, or regulatory accountability.",
        primaryCta: { label: "Request Enterprise Demo", href: CONTACT_DEMO },
        secondaryCta: { label: "View Platform Capabilities", href: "/platform-features" },
    },
    accountability: {
        headline: "Built for Aviation. Designed for Accountability.",
        description:
            "SkyMaintain is not a general-purpose AI tool. It is an enterprise maintenance intelligence platform engineered for environments governed by FAA, EASA, and organizational maintenance control requirements.",
        tagline: "Every output is traceable. Every decision is explainable. Every workflow respects regulatory boundaries.",
    },
    operationalIntelligence: {
        headline: "Operational Intelligence for Aircraft Maintenance",
        cards: [
            {
                icon: iconDeterministic,
                iconBg: "bg-blue-50",
                title: "Deterministic Maintenance Reasoning",
                description:
                    "SkyMaintain provides AI-assisted reasoning grounded exclusively in approved technical documentation, maintenance data, and policy constraints. Outputs are deterministic, explainable, and suitable for regulated decision-support use.",
            },
            {
                icon: iconPolicy,
                iconBg: "bg-green-50",
                title: "Policy-Aligned Decision Support",
                description:
                    "All recommendations are generated within clearly defined policy boundaries, ensuring alignment with organizational procedures, regulatory requirements, and approved maintenance practices. No autonomous actions. No opaque logic. Human authority remains absolute.",
            },
            {
                icon: iconTraceability,
                iconBg: "bg-purple-50",
                title: "Source-Anchored Traceability",
                description:
                    "Every response is linked to its originating technical sources, enabling engineers, inspectors, and auditors to review, validate, and defend decisions with confidence. This supports internal audits, regulatory reviews, and quality assurance processes.",
            },
            {
                icon: iconPredictive,
                iconBg: "bg-amber-50",
                title: "Predictive Maintenance Alerts (Advisory Only)",
                description:
                    "SkyMaintain surfaces predictive insights based on historical and operational data trends to support maintenance planning and risk awareness. Alerts are advisory, not prescriptive—designed to inform engineers, not replace judgment.",
            },
        ],
    },
    differentiators: {
        headline: "Why SkyMaintain Is Different",
        subheadline:
            "Most AI platforms prioritize speed and automation. SkyMaintain prioritizes safety, traceability, and regulatory confidence.",
        items: [
            {
                icon: iconRegulated,
                iconBg: "bg-blue-100",
                title: "Built for Regulated Aviation",
                description: "Specifically engineered for regulated aviation maintenance environments",
            },
            {
                icon: iconOutputs,
                iconBg: "bg-green-100",
                title: "Deterministic Outputs",
                description: "Outputs suitable for audit and regulatory review",
            },
            {
                icon: iconNoBlackBox,
                iconBg: "bg-purple-100",
                title: "No Black-Box ML",
                description: "No black-box machine learning in safety-critical decision paths",
            },
            {
                icon: iconHumanLoop,
                iconBg: "bg-amber-100",
                title: "Human-in-the-Loop",
                description: "Human-in-the-loop design by default",
            },
            {
                icon: iconSeparation,
                iconBg: "bg-indigo-100",
                title: "Clear Separation",
                description: "Advisory intelligence separated from maintenance authority",
            },
            {
                icon: iconSafety,
                iconBg: "bg-red-100",
                title: "Safety First",
                description: "Safety and accountability over automation speed",
            },
        ],
    },
    environments: {
        headline: "Designed for Regulated Maintenance Environments",
        cards: [
            {
                icon: iconAlignment,
                iconBg: "bg-blue-50",
                title: "Regulatory Alignment",
                description:
                    "Designed with FAA and EASA maintenance philosophies in mind, supporting Part 145, airline, and CAMO operational structures.",
            },
            {
                icon: iconAudit,
                iconBg: "bg-green-50",
                title: "Audit-Ready Architecture",
                description:
                    "Every interaction is logged, traceable, and reviewable to support quality systems, audits, and compliance oversight.",
            },
            {
                icon: iconSecurityTenant,
                iconBg: "bg-purple-50",
                title: "Security & Tenant Isolation",
                description:
                    "Enterprise-grade access control, organization-level isolation, and role-based permissions protect operational integrity.",
            },
            {
                icon: iconTransparency,
                iconBg: "bg-amber-50",
                title: "Operational Transparency",
                description:
                    "No hidden decision logic. No uncontrolled automation. SkyMaintain operates as a controlled, inspectable system.",
            },
        ],
    },
    useCases: {
        headline: "Supporting Maintenance Across the Operation",
        cards: [
            {
                icon: iconEngineering,
                iconBg: "bg-blue-50",
                title: "Maintenance Engineering",
                description:
                    "Assist engineers in interpreting manuals, troubleshooting recurring defects, and validating maintenance pathways using traceable references.",
            },
            {
                icon: iconPlanning,
                iconBg: "bg-green-50",
                title: "Maintenance Control & Planning",
                description:
                    "Support informed planning decisions with advisory insights derived from operational patterns and historical data.",
            },
            {
                icon: iconQA,
                iconBg: "bg-purple-50",
                title: "Quality Assurance & Compliance",
                description:
                    "Enable transparent review of AI-assisted decisions with full traceability for internal and external audits.",
            },
            {
                icon: iconLeadership,
                iconBg: "bg-amber-50",
                title: "Technical Leadership",
                description:
                    "Provide leadership with confidence that digital intelligence supports—not undermines—regulatory accountability.",
            },
        ],
    },
    aviationRealities: {
        headline: "AI That Respects Aviation Realities",
        description1:
            "SkyMaintain is engineered with the understanding that aircraft maintenance is not a domain for experimentation.",
        description2:
            "It is a controlled, high-consequence environment where technology must enhance discipline, not bypass it.",
    },
    evaluation: {
        headline: "Evaluate SkyMaintain for Your Maintenance Operation",
        description:
            "See how a deterministic, audit-ready AI platform can support compliance-driven aircraft maintenance without compromising safety, authority, or regulatory trust.",
        cta: { label: "Schedule a Technical Walkthrough", href: CONTACT_DEMO },
    },
};

let mockStore: EnterprisePageData = structuredClone(DEFAULT_DATA);

async function apiGetEnterpriseData(signal?: AbortSignal): Promise<EnterprisePageData> {
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

    const res = await fetch(`${base}/v1/public/enterprise`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/enterprise failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<EnterprisePageData>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/enterprise");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

function FeatureCard({ card, loading }: { card: FeatureCard; loading: boolean }) {
    return (
        <article className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-8 transition-shadow hover:shadow-lg">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}>
                {loading ? (
                    <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
                ) : (
                    <img src={card.icon} alt="" className="h-6 w-6" aria-hidden="true" />
                )}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
            {loading ? (
                <div className="space-y-2">
                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                </div>
            ) : (
                <p className="text-base leading-relaxed text-slate-600">{card.description}</p>
            )}
        </article>
    );
}

function DifferentiatorCard({ item, loading }: { item: DifferentiatorItem; loading: boolean }) {
    return (
        <div className="flex flex-col items-center gap-4 px-4 py-6 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${item.iconBg}`}>
                {loading ? (
                    <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
                ) : (
                    <img src={item.icon} alt="" className="h-8 w-8" aria-hidden="true" />
                )}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
        </div>
    );
}

function EnvironmentCard({ card, loading }: { card: EnvironmentCard; loading: boolean }) {
    return (
        <article className="flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-6 text-center transition-shadow hover:shadow-lg">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${card.iconBg}`}>
                {loading ? (
                    <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200" />
                ) : (
                    <img src={card.icon} alt="" className="h-7 w-7" aria-hidden="true" />
                )}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
            {loading ? (
                <div className="space-y-2">
                    <div className="h-3 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-3/4 mx-auto animate-pulse rounded bg-slate-100" />
                </div>
            ) : (
                <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
            )}
        </article>
    );
}

function UseCaseCard({ card, loading }: { card: UseCaseCard; loading: boolean }) {
    return (
        <article className="rounded-2xl border border-black/10 bg-white p-8 transition-shadow hover:shadow-lg">
            <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
                    {loading ? (
                        <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
                    ) : (
                        <img src={card.icon} alt="" className="h-6 w-6" aria-hidden="true" />
                    )}
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                    {loading ? (
                        <div className="space-y-2">
                            <div className="h-4 animate-pulse rounded bg-slate-100" />
                            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                        </div>
                    ) : (
                        <p className="text-base leading-relaxed text-slate-600">{card.description}</p>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function EnterprisePage() {
    const mode = getDataMode();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [data, setData] = React.useState<EnterprisePageData>(structuredClone(DEFAULT_DATA));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const pageData = await apiGetEnterpriseData(ac.signal);
                setData(pageData);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load Enterprise page data.";
                setError(msg);
                setData(structuredClone(DEFAULT_DATA));
            } finally {
                setLoading(false);
            }
        })();

        return () => ac.abort();
    }, []);

    const content = loading ? DEFAULT_DATA : data;

    const handleScrollToCapabilities = () => {
        const element = document.getElementById("capabilities");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="mx-auto max-w-[1084px] px-4 pb-24 pt-16 text-center sm:px-8">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                    <img src={iconBadge} alt="" className="h-4 w-4" aria-hidden="true" />
                    <span>{content.hero.badge}</span>
                </div>

                <h1 className="mt-8 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
                    {content.hero.headline.map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            {i < content.hero.headline.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </h1>

                <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 sm:text-xl">
                    {content.hero.subheadline}
                </p>

                <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-500">{content.hero.tagline}</p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href={content.hero.primaryCta.href}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
                    >
                        {content.hero.primaryCta.label}
                        <img src={iconArrow} alt="" className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <button
                        onClick={handleScrollToCapabilities}
                        type="button"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-black/10 bg-white px-8 py-4 text-lg font-medium text-slate-950 transition-colors hover:bg-slate-50 sm:w-auto"
                    >
                        {content.hero.secondaryCta.label}
                    </button>
                </div>
            </section>

            {/* Accountability Section */}
            <section className="mx-auto max-w-[1024px] rounded-xl bg-slate-900 px-6 py-8 text-center text-white sm:rounded-2xl sm:px-8">
                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">{content.accountability.headline}</h2>
                <p className="mx-auto mt-4 max-w-4xl text-base text-slate-200 sm:text-lg">
                    {content.accountability.description}
                </p>
                <p className="mx-auto mt-4 max-w-4xl text-base font-medium text-white sm:text-lg">
                    {content.accountability.tagline}
                </p>
            </section>

            {/* Operational Intelligence Section */}
            <section id="capabilities" className="mx-auto max-w-[1084px] scroll-mt-20 px-4 py-24 sm:px-8">
                <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                    {content.operationalIntelligence.headline}
                </h2>

                {error && (
                    <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {error}
                    </div>
                )}

                <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2">
                    {content.operationalIntelligence.cards.map((card, idx) => (
                        <FeatureCard key={`feature-${idx}`} card={card} loading={loading} />
                    ))}
                </div>
            </section>

            {/* Why Different Section */}
            <section className="bg-slate-50">
                <div className="mx-auto max-w-[1084px] px-4 py-20 text-center sm:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                        {content.differentiators.headline}
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 sm:text-xl">
                        {content.differentiators.subheadline}
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3">
                        {content.differentiators.items.map((item, idx) => (
                            <DifferentiatorCard key={`diff-${idx}`} item={item} loading={loading} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Regulated Environments Section */}
            <section className="mx-auto max-w-[1084px] px-4 py-24 sm:px-8">
                <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                    {content.environments.headline}
                </h2>

                <div className="mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {content.environments.cards.map((card, idx) => (
                        <EnvironmentCard key={`env-${idx}`} card={card} loading={loading} />
                    ))}
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="bg-slate-50">
                <div className="mx-auto max-w-[1084px] px-4 py-20 sm:px-8">
                    <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                        {content.useCases.headline}
                    </h2>

                    <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2">
                        {content.useCases.cards.map((card, idx) => (
                            <UseCaseCard key={`usecase-${idx}`} card={card} loading={loading} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Aviation Realities Section */}
            <section
                className="relative overflow-hidden"
                style={{
                    backgroundImage: "linear-gradient(162deg, rgb(28, 57, 142) 0%, rgb(15, 23, 43) 100%)",
                }}
            >
                <div className="mx-auto max-w-[1148px] px-4 py-20 text-center text-white sm:px-8">
                    <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">{content.aviationRealities.headline}</h2>
                    <p className="mx-auto mt-6 max-w-4xl text-lg text-blue-100 sm:text-xl">
                        {content.aviationRealities.description1}
                    </p>
                    <p className="mx-auto mt-4 max-w-4xl text-lg text-blue-100 sm:text-xl">
                        {content.aviationRealities.description2}
                    </p>
                </div>
            </section>

            {/* Evaluation CTA Section */}
            <section className="mx-auto max-w-[896px] px-4 py-24 text-center sm:px-8">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                    {content.evaluation.headline}
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
                    {content.evaluation.description}
                </p>
                <div className="mt-10 flex justify-center">
                    <Link
                        href={content.evaluation.cta.href}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        {content.evaluation.cta.label}
                        <img src={iconArrow} alt="" className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* Data Mode Indicator (for debugging) */}
            {process.env.NODE_ENV === "development" && (
                <div className="fixed bottom-4 right-4 z-50">
                    <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${mode === "live"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : mode === "hybrid"
                                ? "border-amber-200 bg-amber-50 text-amber-800"
                                : "border-slate-200 bg-slate-50 text-slate-700"
                            }`}
                        title="Data mode is controlled by NEXT_PUBLIC_DATA_MODE"
                    >
                        Data: {mode.toUpperCase()}
                    </span>
                </div>
            )}
        </div>
    );
}

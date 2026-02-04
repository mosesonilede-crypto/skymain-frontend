/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_DEMO, CONTACT_PRICING } from "@/lib/routes";

// Figma assets
const imgIconCheck = "https://www.figma.com/api/mcp/asset/74cf00ef-a8cb-4b19-99d3-f1df481c4720";
const imgIconCheckBlue = "https://www.figma.com/api/mcp/asset/6abd012b-cd97-4798-af40-8729582451bd";
const imgIconArrowBlue = "https://www.figma.com/api/mcp/asset/8c3e0e43-f399-46c6-bd18-e30293784226";
const imgVector = "https://www.figma.com/api/mcp/asset/32d07f00-e54f-4c3d-9ef0-14e94ffd7be8";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/d7d85ad0-3fd3-4977-bb18-6030f7a3027b";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/15b7e17a-7ec8-4020-92a2-9711593821b6";

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
            bullets: [
                "Limited user access",
                "Core analytics and dashboards",
                "Initial data ingestion support",
            ],
            cta_label: "Contact us for pricing",
            cta_href: PRICING_INTENT_HREF,
        },
        {
            id: "professional",
            name: "Professional",
            tagline: "Designed for active operational use.",
            bullets: [
                "Expanded user access",
                "Advanced analytics",
                "Compliance-aligned reporting",
                "Priority support",
            ],
            cta_label: "Contact us for pricing",
            cta_href: PRICING_INTENT_HREF,
            is_popular: true,
        },
        {
            id: "enterprise",
            name: "Enterprise",
            tagline: "For large operators and complex environments.",
            bullets: [
                "Custom integrations",
                "Dedicated support",
                "SLA options",
                "Flexible deployment models",
            ],
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

function TierCard({
    tier,
    loading,
}: {
    tier: PricingTier;
    loading: boolean;
}): React.ReactElement {
    const isPopular = Boolean(tier.is_popular);

    return (
        <div
            className="relative rounded-xl bg-white p-8"
            style={{
                border: isPopular ? "4px solid #155dfc" : "1.6px solid rgba(0,0,0,0.1)",
                boxShadow: isPopular ? "0px 25px 50px rgba(0,0,0,0.25)" : "none",
            }}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                        className="inline-flex items-center rounded-lg px-4 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: "#155dfc" }}
                    >
                        Most Popular
                    </span>
                </div>
            )}

            <div className="text-left">
                <h2
                    className="text-2xl font-bold"
                    style={{ color: "#101828", lineHeight: "32px" }}
                >
                    {tier.name}
                </h2>
                <p
                    className="mt-4 text-base leading-relaxed"
                    style={{ color: "#4a5565" }}
                >
                    {tier.tagline}
                </p>
            </div>

            <ul className="mt-6 space-y-3">
                {loading
                    ? Array.from({ length: tier.bullets.length }).map((_, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-100" />
                            <div className="h-5 flex-1 animate-pulse rounded bg-slate-100" />
                        </li>
                    ))
                    : tier.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <img
                                src={isPopular ? imgIconCheckBlue : imgIconCheck}
                                alt=""
                                className="mt-0.5 h-5 w-5 shrink-0"
                            />
                            <span
                                className="text-base"
                                style={{ color: "#364153", lineHeight: "24px" }}
                            >
                                {b}
                            </span>
                        </li>
                    ))}
            </ul>

            <div className="mt-8">
                <Link
                    href={tier.cta_href}
                    className="inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: isPopular ? "#155dfc" : "#101828" }}
                >
                    {tier.cta_label}
                </Link>
            </div>
        </div>
    );
}

export default function PricingPage(): React.ReactElement {
    const [loading, setLoading] = React.useState(true);
    const [doc, setDoc] = React.useState<PricingDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            try {
                const data = await apiGetPricing(ac.signal);
                setDoc(data);
            } catch {
                // Fallback to default doc
                setDoc(structuredClone(DEFAULT_DOC));
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    const content = loading ? DEFAULT_DOC : doc;

    return (
        <div className="w-full bg-white">
            {/* Header */}
            <header
                className="fixed left-0 right-0 top-0 z-50 border-b px-6 py-4"
                style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderColor: "#e5e7eb",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)",
                }}
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl"
                            style={{
                                background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                boxShadow:
                                    "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            <img
                                src={imgVectorLarge}
                                alt="SkyMaintain"
                                className="h-7 w-7"
                            />
                        </div>
                        <div>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: "#101828", lineHeight: "32px" }}
                            >
                                SkyMaintain
                            </p>
                            <p className="text-xs" style={{ color: "#4a5565" }}>
                                Regulatory-Compliant AI Platform
                            </p>
                        </div>
                    </Link>

                    {/* Right buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="rounded-lg px-4 py-2 text-sm transition-colors hover:bg-gray-100"
                            style={{ color: "#364153" }}
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/get-started"
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                            style={{ backgroundColor: "#155dfc" }}
                        >
                            Get Started
                            <img src={imgIconArrowWhite} alt="" className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section
                className="px-6 pb-16 pt-32 text-center"
                style={{
                    background: "linear-gradient(157deg, #eff6ff 0%, #faf5ff 100%)",
                }}
            >
                <div className="mx-auto max-w-4xl">
                    {/* Badge */}
                    <div
                        className="mx-auto inline-flex items-center justify-center rounded-lg px-5 py-2"
                        style={{ backgroundColor: "#155dfc" }}
                    >
                        <span className="text-sm font-medium" style={{ color: "#ffffff" }}>
                            {content.badge}
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="mt-6 text-5xl font-bold tracking-tight"
                        style={{ color: "#101828", lineHeight: "48px" }}
                    >
                        {content.headline}
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed"
                        style={{ color: "#4a5565" }}
                    >
                        {content.subhead}
                    </p>

                    {/* Note */}
                    <p
                        className="mx-auto mt-4 max-w-3xl text-lg"
                        style={{ color: "#4a5565", lineHeight: "28px" }}
                    >
                        {content.note}
                    </p>
                </div>
            </section>

            {/* Pricing Cards Section */}
            <section className="bg-white px-6 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {content.tiers.map((tier) => (
                            <TierCard key={tier.id} tier={tier} loading={loading} />
                        ))}
                    </div>

                    {/* Footer note */}
                    <p
                        className="mx-auto mt-12 max-w-3xl text-center text-lg leading-relaxed"
                        style={{ color: "#4a5565" }}
                    >
                        {content.footer_note}
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section
                className="px-6 py-24"
                style={{
                    background:
                        "linear-gradient(165deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                }}
            >
                <div className="mx-auto max-w-4xl text-center">
                    {/* Headline */}
                    <h2
                        className="text-4xl font-bold"
                        style={{ color: "#ffffff", lineHeight: "40px" }}
                    >
                        {content.cta.headline}
                    </h2>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href={content.cta.primary.href}
                            className="flex items-center gap-2 rounded-lg bg-white px-10 py-3 text-lg font-medium transition-colors hover:bg-gray-100"
                            style={{
                                color: "#155dfc",
                                boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                            }}
                        >
                            {content.cta.primary.label}
                            <img src={imgIconArrowBlue} alt="" className="h-5 w-5" />
                        </Link>
                        <Link
                            href={content.cta.secondary.href}
                            className="rounded-lg bg-white px-10 py-3 text-lg font-medium transition-colors hover:bg-gray-100"
                            style={{
                                color: "#155dfc",
                                boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                            }}
                        >
                            {content.cta.secondary.label}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-6" style={{ backgroundColor: "#101828" }}>
                <div className="mx-auto max-w-4xl text-center">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{ backgroundColor: "#155dfc" }}
                        >
                            <img src={imgVector} alt="SkyMaintain" className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold" style={{ color: "#ffffff" }}>
                            SkyMaintain
                        </span>
                    </div>

                    {/* Tagline */}
                    <p className="mt-3 text-sm" style={{ color: "#99a1af" }}>
                        AI-powered aircraft maintenance platform ensuring safety,
                        compliance, and efficiency.
                    </p>

                    {/* Copyright */}
                    <p className="mt-2 text-sm" style={{ color: "#d1d5dc" }}>
                        © 2026 <span style={{ color: "#51a2ff" }}>SkyMaintain</span>. All
                        Rights Reserved.
                    </p>

                    {/* EncycloAMTs */}
                    <p className="mt-2 text-sm" style={{ color: "#6a7282" }}>
                        SkyMaintain is a product of EncycloAMTs LLC.
                    </p>
                </div>
            </footer>
        </div>
    );
}

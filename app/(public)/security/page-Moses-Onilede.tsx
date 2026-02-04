/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_DEMO } from "@/lib/routes";

// Figma assets
const imgIconShield = "https://www.figma.com/api/mcp/asset/85bbb0d9-6e7f-4b00-a6e2-cd78bb6a0532";
const imgIconPlatformSecurity = "https://www.figma.com/api/mcp/asset/eaf3ba68-5add-41ca-9a79-90a5c26df576";
const imgIconOperational = "https://www.figma.com/api/mcp/asset/42619f6c-83b3-489c-9c02-dd18c5f69772";
const imgIconSecureDev = "https://www.figma.com/api/mcp/asset/42619f6c-83b3-489c-9c02-dd18c5f69772";
const imgIconKey = "https://www.figma.com/api/mcp/asset/d6ef40b8-ba08-46c1-bc22-c7ae05d1824c";
const imgIconArrowBlue = "https://www.figma.com/api/mcp/asset/aa3c1adc-4402-47b5-bad5-8f1b5ef90632";
const imgVector = "https://www.figma.com/api/mcp/asset/b6958c16-dd85-4f65-9f2e-6a8a8efa9470";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/0015c7eb-d0a2-4366-aa2b-9086583ee428";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/b505431d-6807-4d45-be8a-cc16a013fd53";

type DataMode = "mock" | "live" | "hybrid";

type SecuritySection = {
    id: string;
    title: string;
    bullets: string[];
    icon: string;
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

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
    if (raw === "mock" || raw === "live" || raw === "hybrid") return raw;
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
}

const DEFAULT_DOC: SecurityDoc = {
    badge: "Security & Data Protection",
    headline: "Security & Data Protection",
    intro:
        "SkyMaintain is designed with security-first principles to support enterprise aviation environments.",
    sections: [
        {
            id: "platform",
            title: "Platform Security",
            icon: imgIconPlatformSecurity,
            bullets: [
                "Secure cloud infrastructure",
                "Encryption of data in transit and at rest",
                "Role-based access controls",
                "Secure authentication and authorization mechanisms",
            ],
        },
        {
            id: "operational",
            title: "Operational Integrity",
            icon: imgIconOperational,
            bullets: [
                "Audit-friendly logging and traceability",
                "Separation of operational and analytical layers",
                "Controlled access to sensitive data",
            ],
        },
        {
            id: "development",
            title: "Secure Development Practices",
            icon: imgIconSecureDev,
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

    const res = await fetch(`${base}/v1/public/security`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/security failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<SecurityDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/security");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

function SectionCard({
    section,
    loading,
}: {
    section: SecuritySection;
    loading: boolean;
}): React.ReactElement {
    return (
        <div
            className="rounded-xl bg-white p-8"
            style={{
                border: "1.6px solid rgba(0,0,0,0.1)",
            }}
        >
            {/* Icon */}
            <div className="mb-12">
                <img
                    src={section.icon}
                    alt=""
                    className="h-12 w-12"
                />
            </div>

            {/* Title */}
            <h2
                className="text-2xl font-bold"
                style={{ color: "#101828", lineHeight: "32px" }}
            >
                {section.title}
            </h2>

            {/* Bullets */}
            <ul className="mt-12 space-y-3">
                {loading
                    ? Array.from({ length: section.bullets.length }).map((_, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-100" />
                            <div className="h-5 flex-1 animate-pulse rounded bg-slate-100" />
                        </li>
                    ))
                    : section.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <img
                                src={imgIconPlatformSecurity}
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
        </div>
    );
}

export default function SecurityPage(): React.ReactElement {
    const [loading, setLoading] = React.useState(true);
    const [doc, setDoc] = React.useState<SecurityDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            try {
                const data = await apiGetSecurityDoc(ac.signal);
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
                    {/* Shield Icon */}
                    <div className="mb-6 flex justify-center">
                        <img
                            src={imgIconShield}
                            alt=""
                            className="h-20 w-20"
                        />
                    </div>

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
                        {content.intro}
                    </p>
                </div>
            </section>

            {/* Cards Section */}
            <section className="bg-white px-6 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {content.sections.map((section) => (
                            <SectionCard key={section.id} section={section} loading={loading} />
                        ))}
                    </div>

                    {/* Closing note card */}
                    <div
                        className="mt-16 rounded-xl p-10"
                        style={{
                            backgroundColor: "#eff6ff",
                            border: "1.6px solid #bedbff",
                        }}
                    >
                        <p
                            className="text-center text-lg"
                            style={{ color: "#364153", lineHeight: "29px" }}
                        >
                            {content.closing}
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                className="px-6 py-24"
                style={{
                    background:
                        "linear-gradient(161deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                }}
            >
                <div className="mx-auto max-w-4xl text-center">
                    {/* Key Icon */}
                    <div className="mb-6 flex justify-center">
                        <img
                            src={imgIconKey}
                            alt=""
                            className="h-16 w-16"
                        />
                    </div>

                    {/* Headline */}
                    <h2
                        className="text-4xl font-bold"
                        style={{ color: "#ffffff", lineHeight: "40px" }}
                    >
                        {content.highlight}
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

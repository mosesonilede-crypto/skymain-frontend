/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_DEMO } from "@/lib/routes";

// Figma assets (node 39:10077)
const imgIconShield = "https://www.figma.com/api/mcp/asset/7afd3692-8706-4d73-937e-8fd2c7631539";
const imgIconPlatformSecurity = "https://www.figma.com/api/mcp/asset/2b75799f-f77d-40e5-b5e5-494a830a9b55";
const imgIconOperational = "https://www.figma.com/api/mcp/asset/7654f05f-93c1-4096-8f36-bd6193a6bd43";
const imgIconSecureDev = "https://www.figma.com/api/mcp/asset/3087d078-193a-4f1d-a004-592400a6d571";
const imgIconCheck = "https://www.figma.com/api/mcp/asset/fb91fe8d-7e0d-4490-811d-812c401e1c3a";
const imgIconCheckAlt = "https://www.figma.com/api/mcp/asset/54e83d1b-1973-434b-b5e7-cc132d847121";
const imgIconKey = "https://www.figma.com/api/mcp/asset/213c96f3-b0a2-4f27-a202-3127d4a712fd";
const imgIconArrow = "https://www.figma.com/api/mcp/asset/f326ed5f-e9b2-42b6-a722-625f4d5ba96d";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/9ed9a5aa-1b92-4e00-a6a9-197cc98ec833";
const imgVector = "https://www.figma.com/api/mcp/asset/60484c54-5563-4953-90e8-f81b53a2b8b8";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/088731d0-fa21-460b-a57d-e19e8fc223a7";

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
    iconSrc,
    iconType,
}: {
    heading: string;
    bullets: string[];
    loading: boolean;
    iconSrc: string;
    iconType: "blue" | "green";
}): React.ReactElement {
    const checkIcon = iconType === "blue" ? imgIconCheck : imgIconCheckAlt;

    return (
        <div
            className="flex flex-col bg-white"
            style={{
                width: "345.325px",
                height: "423.188px",
                borderRadius: "14px",
                border: "1.6px solid rgba(0,0,0,0.1)",
                paddingLeft: "33.6px",
                paddingTop: "33.6px",
                gap: "48px",
            }}
        >
            {/* Icon - 48px */}
            <img
                src={iconSrc}
                alt=""
                style={{ width: "48px", height: "48px" }}
            />

            {/* Heading */}
            <h2
                className="font-bold"
                style={{ color: "#101828", fontSize: "24px", lineHeight: "32px" }}
            >
                {heading}
            </h2>

            {/* List */}
            {loading ? (
                <div className="flex flex-col" style={{ gap: "12px" }}>
                    {Array.from({ length: Math.max(3, bullets.length || 3) }).map((_, idx) => (
                        <div key={idx} className="h-6 animate-pulse rounded bg-slate-100" />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col" style={{ gap: "12px" }}>
                    {bullets.map((b, i) => (
                        <div key={i} className="flex items-start" style={{ gap: "12px" }}>
                            <img
                                src={checkIcon}
                                alt=""
                                style={{ width: "20px", height: "20px", marginTop: "2px", flexShrink: 0 }}
                            />
                            <span
                                style={{ color: "#364153", fontSize: "16px", lineHeight: "24px" }}
                            >
                                {b}
                            </span>
                        </div>
                    ))}
                </div>
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
        <div className="w-full bg-white">
            {/* Header - 80.8px height per Figma */}
            <header
                className="fixed left-0 right-0 top-0 z-50 flex flex-col items-start"
                style={{
                    height: "80.8px",
                    paddingTop: "16px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    paddingBottom: "0.8px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)",
                }}
            >
                <div className="flex w-full items-center justify-between" style={{ height: "48px" }}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center" style={{ gap: "12px" }}>
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "14px",
                                background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            <img
                                src={imgVectorLarge}
                                alt="SkyMaintain"
                                style={{ width: "28px", height: "28px" }}
                            />
                        </div>
                        <div style={{ height: "47.975px" }}>
                            <p
                                className="font-bold text-center"
                                style={{ color: "#101828", fontSize: "24px", lineHeight: "32px" }}
                            >
                                SkyMaintain
                            </p>
                            <p
                                className="text-center"
                                style={{ color: "#4a5565", fontSize: "12px", lineHeight: "16px" }}
                            >
                                Regulatory-Compliant AI Platform
                            </p>
                        </div>
                    </Link>

                    {/* Right buttons - 261.363px container, 12px gap */}
                    <div className="flex items-center" style={{ gap: "12px" }}>
                        {/* Back to Home button - 121.225px width, 36px height */}
                        <Link
                            href="/"
                            className="flex items-center justify-center transition-colors hover:bg-gray-100"
                            style={{
                                width: "121.225px",
                                height: "36px",
                                borderRadius: "8px",
                                padding: "8px 16px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#364153", fontSize: "14px", lineHeight: "20px" }}
                            >
                                Back to Home
                            </span>
                        </Link>
                        {/* Get Started button - 128.137px width, 36px height */}
                        <Link
                            href="/get-started"
                            className="flex items-center justify-center transition-colors hover:opacity-90"
                            style={{
                                width: "128.137px",
                                height: "36px",
                                backgroundColor: "#155dfc",
                                borderRadius: "8px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#ffffff", fontSize: "14px", lineHeight: "20px" }}
                            >
                                Get Started
                            </span>
                            <img
                                src={imgIconArrowWhite}
                                alt=""
                                style={{ width: "16px", height: "16px", marginLeft: "4px" }}
                            />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section - 498.6px height per Figma */}
            <section
                className="flex flex-col items-start w-full"
                style={{
                    height: "498.6px",
                    paddingTop: "128px",
                    paddingLeft: "126px",
                    paddingRight: "126px",
                    background: "linear-gradient(156.52deg, #eff6ff 0%, #faf5ff 100%)",
                }}
            >
                <div className="relative w-full" style={{ height: "306.6px" }}>
                    {/* Shield Icon - 80px, centered */}
                    <div className="flex justify-center w-full">
                        <img
                            src={imgIconShield}
                            alt=""
                            style={{ width: "80px", height: "80px" }}
                        />
                    </div>

                    {/* Badge - 24px top margin, 209.55px width, 41.6px height */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px" }}>
                        <div
                            className="flex items-center justify-center"
                            style={{
                                backgroundColor: "#155dfc",
                                borderRadius: "8px",
                                height: "41.6px",
                                paddingLeft: "16px",
                                paddingRight: "16px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#ffffff", fontSize: "14px", lineHeight: "20px" }}
                            >
                                {doc.page_label}
                            </span>
                        </div>
                    </div>

                    {/* Title - 24px top margin */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px" }}>
                        <h1
                            className="font-bold text-center"
                            style={{ color: "#101828", fontSize: "48px", lineHeight: "48px" }}
                        >
                            {doc.title}
                        </h1>
                    </div>

                    {/* Description - 24px top margin */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px" }}>
                        <p
                            className="text-center"
                            style={{
                                color: "#4a5565",
                                fontSize: "20px",
                                lineHeight: "32.5px",
                                maxWidth: "728px",
                            }}
                        >
                            {doc.intro}
                        </p>
                    </div>

                    {/* Data mode badge */}
                    <div className="flex justify-center w-full mt-4">
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
                        <div className="flex justify-center w-full mt-5">
                            <div className="max-w-2xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                                {error}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Content Section - 788.888px height, 24px horizontal padding, 80px top padding, 64px gap */}
            <section
                className="bg-white flex flex-col items-start w-full"
                style={{
                    paddingTop: "80px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    gap: "64px",
                }}
            >
                {/* Three Column Cards - 423.188px height, cards side by side */}
                <div className="relative w-full" style={{ height: "423.188px" }}>
                    {/* Card 1 - Platform Security */}
                    <div className="absolute" style={{ left: "0px", top: "0px" }}>
                        <Card
                            heading={doc.columns[0]?.heading ?? "Platform Security"}
                            bullets={doc.columns[0]?.bullets ?? []}
                            loading={loading}
                            iconSrc={imgIconPlatformSecurity}
                            iconType="blue"
                        />
                    </div>
                    {/* Card 2 - Operational Integrity */}
                    <div className="absolute" style={{ left: "377.33px", top: "0px" }}>
                        <Card
                            heading={doc.columns[1]?.heading ?? "Operational Integrity"}
                            bullets={doc.columns[1]?.bullets ?? []}
                            loading={loading}
                            iconSrc={imgIconOperational}
                            iconType="green"
                        />
                    </div>
                    {/* Card 3 - Secure Development Practices */}
                    <div className="absolute" style={{ left: "754.66px", top: "0px" }}>
                        <Card
                            heading={doc.columns[2]?.heading ?? "Secure Development Practices"}
                            bullets={doc.columns[2]?.bullets ?? []}
                            loading={loading}
                            iconSrc={imgIconSecureDev}
                            iconType="green"
                        />
                    </div>
                </div>

                {/* Closing Statement Card - 141.7px height, 41.6px padding */}
                <div
                    className="flex flex-col items-start w-full"
                    style={{
                        height: "141.7px",
                        backgroundColor: "#eff6ff",
                        borderRadius: "14px",
                        border: "1.6px solid #bedbff",
                        paddingTop: "41.6px",
                        paddingLeft: "41.6px",
                    }}
                >
                    <p
                        className="text-center w-full"
                        style={{
                            color: "#364153",
                            fontSize: "18px",
                            lineHeight: "29.25px",
                        }}
                    >
                        {doc.closing}
                    </p>
                </div>
            </section>

            {/* CTA Section - 392px height, 96px top padding, 126px horizontal padding */}
            <section
                className="flex flex-col items-start w-full"
                style={{
                    height: "392px",
                    paddingTop: "96px",
                    paddingLeft: "126px",
                    paddingRight: "126px",
                    background: "linear-gradient(161.15deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                }}
            >
                <div className="relative w-full" style={{ height: "200px" }}>
                    {/* Key Icon - 64px, centered */}
                    <div className="flex justify-center w-full">
                        <img
                            src={imgIconKey}
                            alt=""
                            style={{ width: "64px", height: "64px" }}
                        />
                    </div>

                    {/* Eyebrow - 88px top margin */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px" }}>
                        <h2
                            className="font-bold text-center"
                            style={{ color: "#ffffff", fontSize: "36px", lineHeight: "40px" }}
                        >
                            {doc.cta_strip.eyebrow}
                        </h2>
                    </div>

                    {/* Buttons - 48px height, centered */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px", gap: "16px" }}>
                        {/* Primary Button - Start Your Free Trial */}
                        <Link
                            href={doc.cta_strip.primary.href}
                            className="flex items-center justify-center bg-white transition-colors hover:bg-gray-100"
                            style={{
                                width: "227.012px",
                                height: "48px",
                                borderRadius: "8px",
                                boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#155dfc", fontSize: "18px", lineHeight: "28px" }}
                            >
                                {doc.cta_strip.primary.label}
                            </span>
                            <img
                                src={imgIconArrow}
                                alt=""
                                style={{ width: "20px", height: "20px", marginLeft: "8px" }}
                            />
                        </Link>
                        {/* Secondary Button - Schedule a Demo */}
                        <Link
                            href={doc.cta_strip.secondary.href}
                            className="flex items-center justify-center bg-white transition-colors hover:bg-gray-100"
                            style={{
                                width: "222.375px",
                                height: "48px",
                                borderRadius: "8px",
                                boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                padding: "24px 40px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#155dfc", fontSize: "18px", lineHeight: "28px" }}
                            >
                                {doc.cta_strip.secondary.label}
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer - 128px height per Figma */}
            <footer
                className="relative w-full"
                style={{ height: "128px", backgroundColor: "#101828" }}
            >
                {/* Logo row */}
                <div
                    className="absolute flex items-center justify-center"
                    style={{ left: "24px", top: "0", width: "1100px", height: "36px", gap: "8px" }}
                >
                    <div
                        className="flex items-center justify-center"
                        style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#155dfc",
                            borderRadius: "10px",
                        }}
                    >
                        <img
                            src={imgVector}
                            alt="SkyMaintain"
                            style={{ width: "20px", height: "20px" }}
                        />
                    </div>
                    <span
                        className="font-bold text-center"
                        style={{ color: "#ffffff", fontSize: "18px", lineHeight: "28px" }}
                    >
                        SkyMaintain
                    </span>
                </div>

                {/* Tagline */}
                <p
                    className="absolute text-center"
                    style={{
                        left: "24px",
                        top: "52px",
                        width: "1100px",
                        color: "#99a1af",
                        fontSize: "14px",
                        lineHeight: "20px",
                    }}
                >
                    AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                </p>

                {/* Copyright */}
                <div
                    className="absolute flex items-center justify-center"
                    style={{ left: "24px", top: "80px", width: "1100px", height: "20px" }}
                >
                    <span style={{ color: "#d1d5dc", fontSize: "14px", lineHeight: "20px" }}>© 2026</span>
                    <span style={{ color: "#51a2ff", fontSize: "14px", lineHeight: "20px", marginLeft: "4px" }}>SkyMaintain</span>
                    <span style={{ color: "#d1d5dc", fontSize: "14px", lineHeight: "20px" }}>. All Rights Reserved.</span>
                </div>

                {/* EncycloAMTs */}
                <p
                    className="absolute text-center"
                    style={{
                        left: "24px",
                        top: "108px",
                        width: "1100px",
                        color: "#6a7282",
                        fontSize: "14px",
                        lineHeight: "20px",
                    }}
                >
                    SkyMaintain is a product of EncycloAMTs LLC.
                </p>
            </footer>
        </div>
    );
}

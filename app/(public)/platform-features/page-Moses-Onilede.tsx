/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_DEMO } from "@/lib/routes";

// Figma assets (node 39:10334)
const imgIconPredictive = "https://www.figma.com/api/mcp/asset/9aa7330b-37b3-435a-8342-595bc2e3b619";
const imgIconPredictive2 = "https://www.figma.com/api/mcp/asset/2983bd54-27eb-49fb-8890-11b314238bfd";
const imgIconPredictive3 = "https://www.figma.com/api/mcp/asset/1bdaeefd-18d4-486d-b02b-dd20a261ff6a";
const imgIconPredictive4 = "https://www.figma.com/api/mcp/asset/47e07913-8c6d-46ac-ad32-ad5fefb7c7de";
const imgIconPredictive5 = "https://www.figma.com/api/mcp/asset/20341423-dd8c-4089-a76f-3825e26b12ae";
const imgIconPredictive6 = "https://www.figma.com/api/mcp/asset/57c99a3f-03bf-46b2-9e99-bb152bfd6ac8";
const imgIconPredictive7 = "https://www.figma.com/api/mcp/asset/3befa6dd-76c8-49bb-88e9-864c4f34e2ac";
const imgIconPredictive8 = "https://www.figma.com/api/mcp/asset/0bf72b3a-10dd-4373-8324-7579c46e58a5";
const imgIconPredictive9 = "https://www.figma.com/api/mcp/asset/28d705f3-fbc6-417e-a40b-6090b3e110f4";
const imgIconCheck = "https://www.figma.com/api/mcp/asset/4b8be3cf-9196-483e-8213-53e24678ca12";
const imgIconDatabase = "https://www.figma.com/api/mcp/asset/031ce5bc-4bf6-4280-8205-d919514d217b";
const imgIconDatabase2 = "https://www.figma.com/api/mcp/asset/412b43a6-4537-4c76-8e9d-4018aff18b2d";
const imgIconDatabase3 = "https://www.figma.com/api/mcp/asset/5a2507f6-79fe-421c-ab2c-e32619f16388";
const imgIconShield = "https://www.figma.com/api/mcp/asset/50b8f681-72cb-4fac-b5ef-bfc5fa390a31";
const imgIconPeople = "https://www.figma.com/api/mcp/asset/9a586275-27d2-497c-b925-4a5b2d29ed6a";
const imgIconPeople2 = "https://www.figma.com/api/mcp/asset/3fac6ad4-a66a-4521-8f38-59072089f0a5";
const imgIconPeople3 = "https://www.figma.com/api/mcp/asset/48868a5e-8ada-41ec-a9ba-2ef6d682b40e";
const imgIconPeople4 = "https://www.figma.com/api/mcp/asset/e8164285-fa4b-4331-8282-fd7fc4729a6c";
const imgIconCloud = "https://www.figma.com/api/mcp/asset/63c37bb2-4090-40ae-9f27-d7c7da66dd68";
const imgIconCloud2 = "https://www.figma.com/api/mcp/asset/3462c30e-300e-4274-8e98-eebc0aede691";
const imgIconArrowBlue = "https://www.figma.com/api/mcp/asset/635940e0-f163-4d9d-b56e-34a9035bd4f3";
const imgVector = "https://www.figma.com/api/mcp/asset/c797c388-22fc-4707-acda-58b53efbe5b9";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/300439e2-4415-4026-acfb-2e40c859d02a";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/fc776e5c-893a-4c46-b41e-a28f24f8b6d2";

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

export default function PlatformFeaturesPage(): React.ReactElement {
    const [loading, setLoading] = React.useState(true);
    const [doc, setDoc] = React.useState<PlatformFeaturesDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            try {
                const data = await apiGetPlatformFeatures(ac.signal);
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
        <div className="w-full bg-white relative" style={{ width: "1148px" }}>
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
                    width: "1148px",
                }}
            >
                <div className="flex w-full items-center justify-between" style={{ height: "48px" }}>
                    {/* Logo - 246.063px width */}
                    <Link href="/" className="flex items-center" style={{ width: "246.063px", gap: "12px" }}>
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
                    <div className="flex items-center" style={{ width: "261.363px", height: "36px", gap: "12px" }}>
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
                            className="flex items-center justify-center transition-colors hover:opacity-90 relative"
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
                                style={{ width: "16px", height: "16px", position: "absolute", left: "100.14px", top: "10px" }}
                            />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Container - 2990.6px height */}
            <div className="flex flex-col items-start bg-white" style={{ width: "1148px", height: "2990.6px" }}>
                {/* Hero Section - 523.1px height per Figma */}
                <section
                    className="flex flex-col items-start w-full"
                    style={{
                        height: "523.1px",
                        paddingTop: "128px",
                        paddingLeft: "126px",
                        paddingRight: "126px",
                        background: "linear-gradient(155.50deg, #eff6ff 0%, #faf5ff 100%)",
                    }}
                >
                    <div className="relative w-full" style={{ height: "331.1px" }}>
                        {/* Badge - 153.963px width, 41.6px height, centered at 371.01px left */}
                        <div
                            className="absolute flex items-center justify-center"
                            style={{
                                left: "371.01px",
                                top: "0",
                                width: "153.963px",
                                height: "41.6px",
                                backgroundColor: "#155dfc",
                                borderRadius: "8px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#ffffff", fontSize: "14px", lineHeight: "20px" }}
                            >
                                {content.badge}
                            </span>
                        </div>

                        {/* Title - 848px width at 24px left, 65.6px top */}
                        <div
                            className="absolute"
                            style={{ left: "24px", top: "65.6px", width: "848px", height: "144px" }}
                        >
                            <h1
                                className="font-bold text-center"
                                style={{
                                    color: "#101828",
                                    fontSize: "48px",
                                    lineHeight: "48px",
                                    width: "729px",
                                    marginLeft: "59.5px",
                                }}
                            >
                                {content.headline}
                            </h1>
                        </div>

                        {/* Subtitle - 768px width at 64px left, 233.6px top */}
                        <div
                            className="absolute"
                            style={{ left: "64px", top: "233.6px", width: "768px", height: "97.5px" }}
                        >
                            <p
                                className="text-center"
                                style={{
                                    color: "#4a5565",
                                    fontSize: "20px",
                                    lineHeight: "32.5px",
                                    width: "735px",
                                    marginLeft: "16.5px",
                                }}
                            >
                                {content.intro}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section - 1939.5px height, 80px top padding, 64px gap */}
                <section
                    className="bg-white flex flex-col items-start w-full"
                    style={{
                        height: "1939.5px",
                        paddingTop: "80px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                        gap: "64px",
                    }}
                >
                    {/* Feature Card 1 - Predictive Maintenance Intelligence - 349.7px height */}
                    <div
                        className="bg-white flex flex-col items-start w-full"
                        style={{
                            height: "349.7px",
                            paddingTop: "41.6px",
                            paddingLeft: "41.6px",
                            paddingRight: "1.6px",
                            paddingBottom: "1.6px",
                            borderRadius: "14px",
                            border: "1.6px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        <div className="flex items-start" style={{ width: "1016.8px", height: "266.5px", gap: "32px" }}>
                            {/* Icon - 48x48 */}
                            <div className="relative overflow-hidden" style={{ width: "48px", height: "48px" }}>
                                <div className="absolute" style={{ left: "8.33%", top: "8.3%", right: "50%", bottom: "8.35%" }}>
                                    <img src={imgIconPredictive} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "50%", top: "8.3%", right: "8.33%", bottom: "8.35%" }}>
                                    <img src={imgIconPredictive2} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "37.5%", top: "37.5%", right: "37.5%", bottom: "45.83%" }}>
                                    <img src={imgIconPredictive3} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "25.01%", top: "21.35%", right: "73.33%", bottom: "72.92%" }}>
                                    <img src={imgIconPredictive4} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "73.33%", top: "21.35%", right: "25.01%", bottom: "72.92%" }}>
                                    <img src={imgIconPredictive5} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "14.49%", top: "43.75%", right: "83.08%", bottom: "54.6%" }}>
                                    <img src={imgIconPredictive6} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "83.07%", top: "43.75%", right: "14.49%", bottom: "54.6%" }}>
                                    <img src={imgIconPredictive7} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "16.8%", top: "72.85%", right: "75%", bottom: "25%" }}>
                                    <img src={imgIconPredictive8} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "75%", top: "72.85%", right: "16.8%", bottom: "25%" }}>
                                    <img src={imgIconPredictive9} alt="" className="w-full h-full" />
                                </div>
                            </div>
                            {/* Content */}
                            <div className="flex flex-col items-start" style={{ flex: 1, height: "266.5px", gap: "16px" }}>
                                {/* Title */}
                                <div style={{ height: "36px", width: "100%" }}>
                                    <p
                                        className="font-bold"
                                        style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                                    >
                                        {content.features[0]?.title}
                                    </p>
                                </div>
                                {/* Description */}
                                <div style={{ height: "58.5px", width: "100%" }}>
                                    <p style={{ color: "#4a5565", fontSize: "18px", lineHeight: "29.25px", width: "910px" }}>
                                        {content.features[0]?.description}
                                    </p>
                                </div>
                                {/* List - 132px height, 12px gap */}
                                <div className="flex flex-col items-start" style={{ height: "132px", width: "100%", gap: "12px" }}>
                                    {content.features[0]?.bullets.map((bullet, i) => (
                                        <div key={i} className="relative" style={{ height: "24px", width: "100%" }}>
                                            <img
                                                src={imgIconCheck}
                                                alt=""
                                                style={{ position: "absolute", left: "0", top: "2px", width: "20px", height: "20px" }}
                                            />
                                            <p
                                                style={{
                                                    position: "absolute",
                                                    left: "32px",
                                                    top: "0",
                                                    color: "#364153",
                                                    fontSize: "16px",
                                                    lineHeight: "24px",
                                                }}
                                            >
                                                {bullet}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Card 2 - Maintenance Data Integration - 284.45px height */}
                    <div
                        className="bg-white flex flex-col items-start w-full"
                        style={{
                            height: "284.45px",
                            paddingTop: "41.6px",
                            paddingLeft: "41.6px",
                            paddingRight: "1.6px",
                            paddingBottom: "1.6px",
                            borderRadius: "14px",
                            border: "1.6px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        <div className="flex items-start" style={{ width: "1016.8px", height: "201.25px", gap: "32px" }}>
                            {/* Icon - 48x48 */}
                            <div className="relative overflow-hidden" style={{ width: "48px", height: "48px" }}>
                                <div className="absolute" style={{ left: "12.5%", top: "8.33%", right: "12.5%", bottom: "66.67%" }}>
                                    <img src={imgIconDatabase} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "12.5%", top: "20.83%", right: "12.5%", bottom: "8.33%" }}>
                                    <img src={imgIconDatabase2} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "12.5%", top: "50%", right: "12.5%", bottom: "37.5%" }}>
                                    <img src={imgIconDatabase3} alt="" className="w-full h-full" />
                                </div>
                            </div>
                            {/* Content */}
                            <div className="flex flex-col items-start" style={{ flex: 1, height: "201.25px", gap: "16px" }}>
                                {/* Title */}
                                <div style={{ height: "36px", width: "100%" }}>
                                    <p
                                        className="font-bold"
                                        style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                                    >
                                        {content.features[1]?.title}
                                    </p>
                                </div>
                                {/* Description */}
                                <div style={{ height: "29.25px", width: "100%" }}>
                                    <p style={{ color: "#4a5565", fontSize: "18px", lineHeight: "29.25px" }}>
                                        {content.features[1]?.description}
                                    </p>
                                </div>
                                {/* List - 96px height, 12px gap */}
                                <div className="flex flex-col items-start" style={{ height: "96px", width: "100%", gap: "12px" }}>
                                    {content.features[1]?.bullets.map((bullet, i) => (
                                        <div key={i} className="relative" style={{ height: "24px", width: "100%" }}>
                                            <img
                                                src={imgIconCheck}
                                                alt=""
                                                style={{ position: "absolute", left: "0", top: "2px", width: "20px", height: "20px" }}
                                            />
                                            <p
                                                style={{
                                                    position: "absolute",
                                                    left: "32px",
                                                    top: "0",
                                                    color: "#364153",
                                                    fontSize: "16px",
                                                    lineHeight: "24px",
                                                }}
                                            >
                                                {bullet}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Card 3 - Regulatory-Aligned Architecture - 284.45px height */}
                    <div
                        className="bg-white flex flex-col items-start w-full"
                        style={{
                            height: "284.45px",
                            paddingTop: "41.6px",
                            paddingLeft: "41.6px",
                            paddingRight: "1.6px",
                            paddingBottom: "1.6px",
                            borderRadius: "14px",
                            border: "1.6px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        <div className="flex items-start" style={{ width: "1016.8px", height: "201.25px", gap: "32px" }}>
                            {/* Icon - 48x48 */}
                            <div className="relative overflow-hidden" style={{ width: "48px", height: "48px" }}>
                                <div className="absolute" style={{ left: "16.67%", top: "8.33%", right: "16.67%", bottom: "8.32%" }}>
                                    <img src={imgIconShield} alt="" className="w-full h-full" />
                                </div>
                            </div>
                            {/* Content */}
                            <div className="flex flex-col items-start" style={{ flex: 1, height: "201.25px", gap: "16px" }}>
                                {/* Title */}
                                <div style={{ height: "36px", width: "100%" }}>
                                    <p
                                        className="font-bold"
                                        style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                                    >
                                        {content.features[2]?.title}
                                    </p>
                                </div>
                                {/* Description */}
                                <div style={{ height: "29.25px", width: "100%" }}>
                                    <p style={{ color: "#4a5565", fontSize: "18px", lineHeight: "29.25px" }}>
                                        {content.features[2]?.description}
                                    </p>
                                </div>
                                {/* List - 96px height, 12px gap */}
                                <div className="flex flex-col items-start" style={{ height: "96px", width: "100%", gap: "12px" }}>
                                    {content.features[2]?.bullets.map((bullet, i) => (
                                        <div key={i} className="relative" style={{ height: "24px", width: "100%" }}>
                                            <img
                                                src={imgIconCheck}
                                                alt=""
                                                style={{ position: "absolute", left: "0", top: "2px", width: "20px", height: "20px" }}
                                            />
                                            <p
                                                style={{
                                                    position: "absolute",
                                                    left: "32px",
                                                    top: "0",
                                                    color: "#364153",
                                                    fontSize: "16px",
                                                    lineHeight: "24px",
                                                }}
                                            >
                                                {bullet}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Card 4 - Technician & Engineer Support - 284.45px height */}
                    <div
                        className="bg-white flex flex-col items-start w-full"
                        style={{
                            height: "284.45px",
                            paddingTop: "41.6px",
                            paddingLeft: "41.6px",
                            paddingRight: "1.6px",
                            paddingBottom: "1.6px",
                            borderRadius: "14px",
                            border: "1.6px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        <div className="flex items-start" style={{ width: "1016.8px", height: "201.25px", gap: "32px" }}>
                            {/* Icon - 48x48 */}
                            <div className="relative overflow-hidden" style={{ width: "48px", height: "48px" }}>
                                <div className="absolute" style={{ left: "8.33%", top: "62.5%", right: "33.33%", bottom: "12.5%" }}>
                                    <img src={imgIconPeople} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "20.83%", top: "12.5%", right: "45.83%", bottom: "54.17%" }}>
                                    <img src={imgIconPeople2} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "79.17%", top: "63.04%", right: "8.33%", bottom: "12.5%" }}>
                                    <img src={imgIconPeople3} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "66.67%", top: "13.04%", right: "20.8%", bottom: "54.67%" }}>
                                    <img src={imgIconPeople4} alt="" className="w-full h-full" />
                                </div>
                            </div>
                            {/* Content */}
                            <div className="flex flex-col items-start" style={{ flex: 1, height: "201.25px", gap: "16px" }}>
                                {/* Title */}
                                <div style={{ height: "36px", width: "100%" }}>
                                    <p
                                        className="font-bold"
                                        style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                                    >
                                        {content.features[3]?.title}
                                    </p>
                                </div>
                                {/* Description */}
                                <div style={{ height: "29.25px", width: "100%" }}>
                                    <p style={{ color: "#4a5565", fontSize: "18px", lineHeight: "29.25px" }}>
                                        {content.features[3]?.description}
                                    </p>
                                </div>
                                {/* List - 96px height, 12px gap */}
                                <div className="flex flex-col items-start" style={{ height: "96px", width: "100%", gap: "12px" }}>
                                    {content.features[3]?.bullets.map((bullet, i) => (
                                        <div key={i} className="relative" style={{ height: "24px", width: "100%" }}>
                                            <img
                                                src={imgIconCheck}
                                                alt=""
                                                style={{ position: "absolute", left: "0", top: "2px", width: "20px", height: "20px" }}
                                            />
                                            <p
                                                style={{
                                                    position: "absolute",
                                                    left: "32px",
                                                    top: "0",
                                                    color: "#364153",
                                                    fontSize: "16px",
                                                    lineHeight: "24px",
                                                }}
                                            >
                                                {bullet}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Card 5 - Secure, Scalable SaaS Platform - 320.45px height */}
                    <div
                        className="bg-white flex flex-col items-start w-full"
                        style={{
                            height: "320.45px",
                            paddingTop: "41.6px",
                            paddingLeft: "41.6px",
                            paddingRight: "1.6px",
                            paddingBottom: "1.6px",
                            borderRadius: "14px",
                            border: "1.6px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        <div className="flex items-start" style={{ width: "1016.8px", height: "237.25px", gap: "32px" }}>
                            {/* Icon - 48x48 */}
                            <div className="relative overflow-hidden" style={{ width: "48px", height: "48px" }}>
                                <div className="absolute" style={{ left: "12.5%", top: "45.83%", right: "12.5%", bottom: "8.33%" }}>
                                    <img src={imgIconCloud} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute" style={{ left: "29.17%", top: "8.33%", right: "29.17%", bottom: "54.17%" }}>
                                    <img src={imgIconCloud2} alt="" className="w-full h-full" />
                                </div>
                            </div>
                            {/* Content */}
                            <div className="flex flex-col items-start" style={{ flex: 1, height: "237.25px", gap: "16px" }}>
                                {/* Title */}
                                <div style={{ height: "36px", width: "100%" }}>
                                    <p
                                        className="font-bold"
                                        style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                                    >
                                        {content.features[4]?.title}
                                    </p>
                                </div>
                                {/* Description */}
                                <div style={{ height: "29.25px", width: "100%" }}>
                                    <p style={{ color: "#4a5565", fontSize: "18px", lineHeight: "29.25px" }}>
                                        {content.features[4]?.description}
                                    </p>
                                </div>
                                {/* List - 132px height, 12px gap */}
                                <div className="flex flex-col items-start" style={{ height: "132px", width: "100%", gap: "12px" }}>
                                    {content.features[4]?.bullets.map((bullet, i) => (
                                        <div key={i} className="relative" style={{ height: "24px", width: "100%" }}>
                                            <img
                                                src={imgIconCheck}
                                                alt=""
                                                style={{ position: "absolute", left: "0", top: "2px", width: "20px", height: "20px" }}
                                            />
                                            <p
                                                style={{
                                                    position: "absolute",
                                                    left: "32px",
                                                    top: "0",
                                                    color: "#364153",
                                                    fontSize: "16px",
                                                    lineHeight: "24px",
                                                }}
                                            >
                                                {bullet}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section - 304px height, 96px top padding */}
                <section
                    className="flex flex-col items-start w-full"
                    style={{
                        height: "304px",
                        paddingTop: "96px",
                        paddingLeft: "126px",
                        paddingRight: "126px",
                        background: "linear-gradient(165.17deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                    }}
                >
                    <div
                        className="flex flex-col items-start w-full"
                        style={{ height: "112px", paddingLeft: "24px", paddingRight: "24px", gap: "24px" }}
                    >
                        {/* Headline */}
                        <div className="w-full" style={{ height: "40px" }}>
                            <p
                                className="font-bold text-center"
                                style={{ color: "#ffffff", fontSize: "36px", lineHeight: "40px" }}
                            >
                                {content.cta.headline}
                            </p>
                        </div>

                        {/* Buttons - centered */}
                        <div className="relative w-full" style={{ height: "48px" }}>
                            {/* Start Your Free Trial - 227.012px width at 191.3px left */}
                            <Link
                                href={content.cta.primary.href}
                                className="absolute flex items-center justify-center bg-white transition-colors hover:bg-gray-100"
                                style={{
                                    left: "191.3px",
                                    top: "0",
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
                                    {content.cta.primary.label}
                                </span>
                                <img
                                    src={imgIconArrowBlue}
                                    alt=""
                                    style={{ width: "20px", height: "20px", marginLeft: "8px" }}
                                />
                            </Link>
                            {/* Schedule a Demo - 222.375px width at 434.31px left */}
                            <Link
                                href={content.cta.secondary.href}
                                className="absolute flex items-center justify-center bg-white transition-colors hover:bg-gray-100"
                                style={{
                                    left: "434.31px",
                                    top: "0",
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
                                    {content.cta.secondary.label}
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
        </div>
    );
}

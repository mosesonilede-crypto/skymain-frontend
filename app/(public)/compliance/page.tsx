import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, Shield, TriangleAlert, XCircle } from "lucide-react";

export const metadata = {
    title: "Compliance Statement | SkyMaintain",
    description:
        "Compliance & Regulatory Alignment statement for the SkyMaintain Regulatory-Compliant AI Platform.",
};

type CompliancePayload = {
    headlineTop: string;
    backToHomeLabel: string;
    subhead: string;
    pageTitle: string;
    heroKicker: string;
    heroBody: string;
    keyPrinciplesTitle: string;
    keyPrinciples: string[];
    regulatoryAlignmentTitle: string;
    regulatoryAlignmentIntro: string;
    regulatoryAlignmentBullets: string[];
    importantNoticeTitle: string;
    importantNoticeIntro: string;
    importantNoticeBullets: string[];
    importantNoticeClosingLine1: string;
    importantNoticeClosingLine2: string;
    lastUpdated?: string;
};

function getEnv(name: string, fallback: string) {
    const v = process.env[name];
    return (v ?? fallback).trim();
}

function mockCompliance(): CompliancePayload {
    return {
        headlineTop: "SkyMaintain",
        backToHomeLabel: "Back to Home",
        subhead: "Regulatory-Compliant AI Platform",
        pageTitle: "Compliance Statement",
        heroKicker: "Compliance & Regulatory Alignment",
        heroBody:
            "SkyMaintain is designed as a decision-support platform aligned with aviation maintenance best practices and regulatory frameworks.",
        keyPrinciplesTitle: "Key Principles",
        keyPrinciples: [
            "Human-in-the-loop decision support",
            "No autonomous maintenance actions",
            "No certification authority",
            "No airworthiness approvals",
        ],
        regulatoryAlignmentTitle: "Regulatory Alignment",
        regulatoryAlignmentIntro: "SkyMaintain architecture is informed by:",
        regulatoryAlignmentBullets: [
            "FAA maintenance and continuing airworthiness principles",
            "EASA maintenance organization concepts",
            "Industry safety management practices",
        ],
        importantNoticeTitle: "Important Notice",
        importantNoticeIntro: "SkyMaintain does not replace:",
        importantNoticeBullets: [
            "Approved Maintenance Programs",
            "Regulatory authority oversight",
            "Certified maintenance judgment",
        ],
        importantNoticeClosingLine1: "SkyMaintain supports maintenance professionals —",
        importantNoticeClosingLine2: "it does not substitute them.",
    };
}

async function fetchComplianceLive(baseUrl: string): Promise<CompliancePayload> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/public/compliance`;
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`GET /v1/public/compliance failed: ${res.status}`);

    const data = (await res.json()) as Partial<CompliancePayload>;

    if (
        !data ||
        typeof data.subhead !== "string" ||
        typeof data.pageTitle !== "string" ||
        typeof data.heroKicker !== "string" ||
        typeof data.heroBody !== "string" ||
        !Array.isArray(data.keyPrinciples) ||
        !Array.isArray(data.regulatoryAlignmentBullets) ||
        !Array.isArray(data.importantNoticeBullets)
    ) {
        throw new Error("Invalid compliance payload shape");
    }

    return {
        ...mockCompliance(),
        ...data,
    };
}

async function loadCompliance(): Promise<{ payload: CompliancePayload; source: "mock" | "live" }> {
    const baseUrl = getEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const rawMode = getEnv("NEXT_PUBLIC_DATA_MODE", "").toLowerCase();
    const mode = (rawMode === "mock" || rawMode === "live" || rawMode === "hybrid")
        ? rawMode
        : "hybrid";

    if (mode === "mock") return { payload: mockCompliance(), source: "mock" };
    if (!baseUrl) return { payload: mockCompliance(), source: "mock" };

    try {
        const payload = await fetchComplianceLive(baseUrl);
        return { payload, source: "live" };
    } catch {
        return { payload: mockCompliance(), source: "mock" };
    }
}

export default async function CompliancePage() {
    const { payload, source } = await loadCompliance();

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
                    <Link href="/" className="flex items-center gap-3">
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
                            <Shield size={28} color="#ffffff" strokeWidth={2.5} />
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

                    {/* Back to Home button - 36px height, rounded-[8px] */}
                    <Link
                        href="/"
                        className="flex items-center transition-colors hover:bg-gray-100"
                        style={{ height: "36px", borderRadius: "8px", paddingLeft: "12px", paddingRight: "12px" }}
                    >
                        <ArrowLeft size={16} color="#364153" />
                        <span
                            className="text-center"
                            style={{ color: "#364153", fontSize: "14px", lineHeight: "20px", marginLeft: "8px" }}
                        >
                            Back to Home
                        </span>
                    </Link>
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
                        <Shield size={80} color="#155dfc" strokeWidth={1.75} />
                    </div>

                    {/* Compliance Statement Badge - 24px top margin */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px" }}>
                        <div
                            className="flex items-center justify-center"
                            style={{
                                backgroundColor: "#00a63e",
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
                                Compliance Statement
                            </span>
                        </div>
                    </div>

                    {/* Title - 24px top margin */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px" }}>
                        <h1
                            className="font-bold text-center"
                            style={{ color: "#101828", fontSize: "48px", lineHeight: "48px" }}
                        >
                            Compliance &amp; Regulatory Alignment
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
                                maxWidth: "678px",
                            }}
                        >
                            {payload.heroBody}
                        </p>
                    </div>

                    {/* Data source badge (for development) */}
                    {source === "live" && (
                        <div className="flex justify-center w-full mt-4">
                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                Data: LIVE
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Content Section - 1554.375px height, 86px horizontal padding, 80px top padding, 64px gap */}
            <section
                className="bg-white flex flex-col items-start w-full"
                style={{
                    paddingTop: "80px",
                    paddingLeft: "86px",
                    paddingRight: "86px",
                    gap: "64px",
                }}
            >
                {/* Key Principles - 258.4px height, 32px gap */}
                <div className="flex flex-col items-start w-full" style={{ gap: "32px" }}>
                    <h2
                        className="w-full text-center font-bold"
                        style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                    >
                        {payload.keyPrinciplesTitle}
                    </h2>

                    {/* 2x2 Grid: 476px cards, 24px gap between rows, 24px gap between columns */}
                    <div className="relative w-full" style={{ height: "190.4px" }}>
                        {/* Row 1 */}
                        <div
                            className="absolute flex items-center bg-white"
                            style={{
                                left: "0px",
                                top: "0px",
                                width: "476px",
                                height: "83.2px",
                                borderRadius: "14px",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                paddingLeft: "25.6px",
                                paddingTop: "25.6px",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <Check size={32} color="#00a63e" strokeWidth={2.5} />
                                <span className="font-bold" style={{ color: "#101828", fontSize: "18px", lineHeight: "28px" }}>
                                    {payload.keyPrinciples[0]}
                                </span>
                            </div>
                        </div>
                        <div
                            className="absolute flex items-center bg-white"
                            style={{
                                left: "500px",
                                top: "0px",
                                width: "476px",
                                height: "83.2px",
                                borderRadius: "14px",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                paddingLeft: "25.6px",
                                paddingTop: "25.6px",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <Check size={32} color="#00a63e" strokeWidth={2.5} />
                                <span className="font-bold" style={{ color: "#101828", fontSize: "18px", lineHeight: "28px" }}>
                                    {payload.keyPrinciples[1]}
                                </span>
                            </div>
                        </div>
                        {/* Row 2 */}
                        <div
                            className="absolute flex items-center bg-white"
                            style={{
                                left: "0px",
                                top: "107.2px",
                                width: "476px",
                                height: "83.2px",
                                borderRadius: "14px",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                paddingLeft: "25.6px",
                                paddingTop: "25.6px",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <Check size={32} color="#00a63e" strokeWidth={2.5} />
                                <span className="font-bold" style={{ color: "#101828", fontSize: "18px", lineHeight: "28px" }}>
                                    {payload.keyPrinciples[2]}
                                </span>
                            </div>
                        </div>
                        <div
                            className="absolute flex items-center bg-white"
                            style={{
                                left: "500px",
                                top: "107.2px",
                                width: "476px",
                                height: "83.2px",
                                borderRadius: "14px",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                paddingLeft: "25.6px",
                                paddingTop: "25.6px",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <Check size={32} color="#00a63e" strokeWidth={2.5} />
                                <span className="font-bold" style={{ color: "#101828", fontSize: "18px", lineHeight: "28px" }}>
                                    {payload.keyPrinciples[3]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Regulatory Alignment - 327.2px height, 32px gap */}
                <div className="flex flex-col items-start w-full" style={{ gap: "32px" }}>
                    <h2
                        className="w-full text-center font-bold"
                        style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                    >
                        {payload.regulatoryAlignmentTitle}
                    </h2>

                    {/* Card - 259.2px height, 33.6px padding, 48px gap */}
                    <div
                        className="flex flex-col items-start bg-white w-full"
                        style={{
                            height: "259.2px",
                            borderRadius: "14px",
                            border: "1.6px solid rgba(0,0,0,0.1)",
                            paddingLeft: "33.6px",
                            paddingTop: "33.6px",
                            paddingBottom: "33.6px",
                            gap: "48px",
                        }}
                    >
                        <p style={{ color: "#364153", fontSize: "18px", lineHeight: "28px" }}>
                            {payload.regulatoryAlignmentIntro}
                        </p>

                        {/* List items - 16px gap */}
                        <div className="flex flex-col items-start" style={{ gap: "16px" }}>
                            {payload.regulatoryAlignmentBullets.map((item, idx) => (
                                <div key={idx} className="flex items-center" style={{ gap: "12px" }}>
                                    <CheckCircle2 size={24} color="#00a63e" strokeWidth={2.25} />
                                    <span style={{ color: "#364153", fontSize: "18px", lineHeight: "28px" }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Important Notice - 327.2px height, 32px gap */}
                <div className="flex flex-col items-start w-full" style={{ gap: "32px" }}>
                    <h2
                        className="w-full text-center font-bold"
                        style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                    >
                        {payload.importantNoticeTitle}
                    </h2>

                    {/* Warning Card - 259.2px height */}
                    <div
                        className="relative w-full"
                        style={{
                            height: "259.2px",
                            backgroundColor: "#fffbeb",
                            borderRadius: "14px",
                            border: "1.6px solid #fee685",
                        }}
                    >
                        {/* Header with warning icon */}
                        <div
                            className="absolute flex items-start"
                            style={{ left: "32px", top: "32px", gap: "16px" }}
                        >
                            <TriangleAlert size={32} color="#d97706" strokeWidth={2.25} />
                            <p
                                className="font-bold"
                                style={{ color: "#101828", fontSize: "20px", lineHeight: "28px" }}
                            >
                                {payload.importantNoticeIntro}
                            </p>
                        </div>

                        {/* List items - 12px gap */}
                        <div
                            className="absolute flex flex-col items-start"
                            style={{ left: "80px", top: "116px", gap: "12px" }}
                        >
                            {payload.importantNoticeBullets.map((item, idx) => (
                                <div key={idx} className="flex items-center" style={{ gap: "12px" }}>
                                    <XCircle size={24} color="#dc2626" strokeWidth={2.25} />
                                    <span style={{ color: "#364153", fontSize: "18px", lineHeight: "28px" }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Banner - 289.575px height */}
                <div
                    className="relative w-full"
                    style={{
                        height: "289.575px",
                        borderRadius: "14px",
                        border: "0.8px solid rgba(0,0,0,0.1)",
                        background: "linear-gradient(163.47deg, #155dfc 0%, #9810fa 100%)",
                    }}
                >
                    {/* Icon - 64px, centered at top */}
                    <div
                        className="absolute"
                        style={{ left: "50%", transform: "translateX(-50%)", top: "40px" }}
                    >
                        <Shield size={64} color="#ffffff" strokeWidth={2} />
                    </div>

                    {/* Line 1 */}
                    <p
                        className="absolute w-full text-center font-bold"
                        style={{
                            top: "152px",
                            left: "0",
                            color: "#ffffff",
                            fontSize: "24px",
                            lineHeight: "32px",
                        }}
                    >
                        {payload.importantNoticeClosingLine1}
                    </p>

                    {/* Line 2 */}
                    <p
                        className="absolute w-full text-center font-bold"
                        style={{
                            top: "215.99px",
                            left: "0",
                            color: "#ffffff",
                            fontSize: "24px",
                            lineHeight: "32px",
                        }}
                    >
                        {payload.importantNoticeClosingLine2}
                    </p>
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
                        <Shield size={20} color="#ffffff" strokeWidth={2.5} />
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

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// Figma assets - updated from node 39:9815
const imgIconScale = "https://www.figma.com/api/mcp/asset/e9775b77-4d6c-47ac-8ba8-ad36a1499aa4";
const imgIconWarning = "https://www.figma.com/api/mcp/asset/b539e2f5-0edb-4c38-8122-02e5a820f566";
const imgVector = "https://www.figma.com/api/mcp/asset/96dcea44-d6ba-48b6-b716-3cd56a7298f6";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/ef605a3e-33e5-491a-814e-c15a47d776c6";
const imgIconArrow = "https://www.figma.com/api/mcp/asset/fbc61bd8-9d1b-4340-a7c0-74fb1ec0e715";

export const metadata = {
    title: "Terms of Service | SkyMaintain",
    description:
        "SkyMaintain Terms of Service for use of the Regulatory-Compliant AI Platform.",
};

type TermsPayload = {
    lastUpdated: string;
    sections: Array<{
        number: number;
        title: string;
        paragraphs: string[];
        bullets?: string[];
    }>;
    importantNoticeTitle: string;
    importantNoticeBody: string;
};

function getEnv(name: string, fallback: string) {
    const v = process.env[name];
    return (v ?? fallback).trim();
}

function mockTerms(): TermsPayload {
    return {
        lastUpdated: "January 30, 2026",
        sections: [
            {
                number: 1,
                title: "Overview",
                paragraphs: [
                    "SkyMaintain is a software-as-a-service (SaaS) platform providing AI-assisted decision-support tools for aircraft maintenance professionals.",
                    "SkyMaintain is a product of EncycloAMTs LLC.",
                ],
            },
            {
                number: 2,
                title: "No Replacement of Certified Judgment",
                paragraphs: ["SkyMaintain provides decision-support insights only.", "SkyMaintain does not:"],
                bullets: [
                    "Replace certified maintenance personnel",
                    "Issue maintenance approvals or certifications",
                    "Replace approved maintenance programs",
                    "Make autonomous maintenance decisions",
                ],
            },
            {
                number: 3,
                title: "Regulatory Disclaimer",
                paragraphs: [
                    "SkyMaintain is not certified, approved, or endorsed by the FAA, EASA, or any aviation authority.",
                    "Use of SkyMaintain does not relieve users of their regulatory obligations.",
                ],
            },
            {
                number: 4,
                title: "Limitation of Liability",
                paragraphs: [
                    'SkyMaintain is provided "as-is" for decision-support purposes only. EncycloAMTs LLC shall not be liable for operational decisions made based on platform outputs.',
                ],
            },
            {
                number: 5,
                title: "Data Responsibility",
                paragraphs: [
                    "Users are responsible for ensuring that data entered into SkyMaintain is accurate, authorized, and compliant with applicable regulations.",
                ],
            },
            {
                number: 6,
                title: "Termination",
                paragraphs: [
                    "Accounts may be suspended or terminated for misuse, violation of terms, or unauthorized use.",
                ],
            },
            {
                number: 7,
                title: "Governing Law",
                paragraphs: ["These terms are governed by the laws of the United States."],
            },
        ],
        importantNoticeTitle: "Important Notice",
        importantNoticeBody:
            "By using SkyMaintain, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the platform.",
    };
}

async function fetchTermsLive(baseUrl: string): Promise<TermsPayload> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/public/terms`;
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) {
        throw new Error(`GET /v1/public/terms failed: ${res.status}`);
    }

    const data = (await res.json()) as Partial<TermsPayload>;

    if (
        !data ||
        typeof data.lastUpdated !== "string" ||
        !Array.isArray(data.sections) ||
        data.sections.length === 0 ||
        typeof data.importantNoticeTitle !== "string" ||
        typeof data.importantNoticeBody !== "string"
    ) {
        throw new Error("Invalid terms payload shape");
    }

    return data as TermsPayload;
}

async function loadTerms(): Promise<{ payload: TermsPayload; source: "mock" | "live" }> {
    const mode = getEnv("NEXT_PUBLIC_DATA_MODE", "mock");
    const baseUrl = getEnv("NEXT_PUBLIC_API_BASE_URL", "");

    if (mode === "mock") return { payload: mockTerms(), source: "mock" };

    if (!baseUrl) return { payload: mockTerms(), source: "mock" };

    if (mode === "live") {
        const payload = await fetchTermsLive(baseUrl);
        return { payload, source: "live" };
    }

    try {
        const payload = await fetchTermsLive(baseUrl);
        return { payload, source: "live" };
    } catch {
        return { payload: mockTerms(), source: "mock" };
    }
}

function SectionBlock({
    number,
    title,
    paragraphs,
    bullets,
}: {
    number: number;
    title: string;
    paragraphs: string[];
    bullets?: string[];
}) {
    return (
        <section
            className="rounded-[14px] bg-white"
            style={{
                border: "1.6px solid rgba(0,0,0,0.1)",
                padding: "33.6px",
            }}
        >
            <h2
                className="font-bold"
                style={{ color: "#101828", fontSize: "24px", lineHeight: "32px" }}
            >
                {number}. {title}
            </h2>

            <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {paragraphs.map((p, idx) => (
                    <p
                        key={idx}
                        style={{ color: "#364153", fontSize: "16px", lineHeight: "26px" }}
                    >
                        {p}
                    </p>
                ))}

                {bullets && bullets.length > 0 ? (
                    <ul style={{ marginLeft: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {bullets.map((b, idx) => (
                            <li
                                key={idx}
                                className="flex items-start"
                                style={{ height: "24px" }}
                            >
                                <span
                                    style={{ color: "#155dfc", fontSize: "16px", lineHeight: "24px", marginRight: "6px" }}
                                >
                                    •
                                </span>
                                <span
                                    style={{ color: "#364153", fontSize: "16px", lineHeight: "24px" }}
                                >
                                    {b}
                                </span>
                        ))}
                            </ul>
                        ) : null}

                        {number === 2 ? (
                            <p
                                style={{ color: "#364153", fontSize: "16px", lineHeight: "26px" }}
                            >
                                All maintenance actions remain the responsibility of appropriately certified personnel
                                and organizations.
                            </p>
                        ) : null}
                    </div>
        </section>
    );
}

export default async function TermsPage() {
    const { payload, source } = await loadTerms();

    return (
        <div className="w-full bg-white min-h-screen relative">
            {/* Header - matches Figma 39:9915 */}
            <header
                className="fixed left-0 right-0 top-0 z-50 px-6 pt-4"
                style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)",
                    height: "80.8px",
                }}
            >
                <div className="mx-auto flex max-w-[1100px] items-center justify-between h-12">
                    {/* Logo Button */}
                    <Link href="/" className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center rounded-[14px]"
                            style={{
                                width: "48px",
                                height: "48px",
                                background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div className="h-7 w-7 overflow-hidden">
                                <img
                                    src={imgVectorLarge}
                                    alt="SkyMaintain"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>
                        <div>
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

                    {/* Back to Home button */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-lg px-3 py-2"
                        style={{ height: "36px" }}
                    >
                        <img
                            src={imgIconArrow}
                            alt=""
                            className="h-4 w-4"
                        />
                        <span
                            style={{ color: "#364153", fontSize: "14px", lineHeight: "20px" }}
                        >
                            Back to Home
                        </span>
                    </Link>
                </div>
            </header>

            {/* Hero Section - matches Figma 39:9817 */}
            <section
                className="px-[126px] pt-[128px] text-center"
                style={{
                    background: "linear-gradient(158.1deg, #eff6ff 0%, #faf5ff 100%)",
                    height: "461.6px",
                }}
            >
                <div className="mx-auto max-w-[848px] relative" style={{ height: "269.6px" }}>
                    {/* Scale Icon - centered */}
                    <div className="flex justify-center">
                        <img
                            src={imgIconScale}
                            alt=""
                            style={{ width: "80px", height: "80px" }}
                        />
                    </div>

                    {/* Legal Badge - centered */}
                    <div className="flex justify-center" style={{ marginTop: "24px" }}>
                        <div
                            className="flex items-center justify-center rounded-lg overflow-hidden"
                            style={{
                                backgroundColor: "#155dfc",
                                height: "41.6px",
                                padding: "0 20px",
                                border: "0.8px solid transparent",
                            }}
                        >
                            <span
                                style={{ color: "#ffffff", fontSize: "14px", lineHeight: "20px" }}
                            >
                                Legal
                            </span>
                        </div>
                    </div>

                    {/* Title - centered */}
                    <h1
                        className="font-bold text-center"
                        style={{
                            color: "#101828",
                            fontSize: "48px",
                            lineHeight: "48px",
                            marginTop: "24px",
                        }}
                    >
                        Terms of Service
                    </h1>

                    {/* Last Updated */}
                    <p
                        className="text-center"
                        style={{
                            color: "#4a5565",
                            fontSize: "18px",
                            lineHeight: "28px",
                            marginTop: "24px",
                        }}
                    >
                        Last Updated: {payload.lastUpdated}
                    </p>
                </div>
            </section>

            {/* Content Section - matches Figma 39:9831 */}
            <section className="bg-white px-[86px] pt-[80px]" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                <div className="mx-auto w-full max-w-[976px]" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {payload.sections.map((s) => (
                        <SectionBlock
                            key={s.number}
                            number={s.number}
                            title={s.title}
                            paragraphs={s.paragraphs}
                            bullets={s.bullets}
                        />
                    ))}
                </div>

                {/* Important Notice Card - matches Figma 39:9888 */}
                <section
                    className="mx-auto w-full max-w-[976px] rounded-[14px]"
                    style={{
                        backgroundColor: "#fffbeb",
                        border: "1.6px solid #fee685",
                        padding: "33.6px",
                    }}
                >
                    <div className="flex items-start" style={{ gap: "16px" }}>
                        <img
                            src={imgIconWarning}
                            alt=""
                            style={{ width: "32px", height: "32px", flexShrink: 0 }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <h3
                                className="font-bold"
                                style={{ color: "#101828", fontSize: "20px", lineHeight: "28px" }}
                            >
                                {payload.importantNoticeTitle}
                            </h3>
                            <p
                                style={{ color: "#364153", fontSize: "16px", lineHeight: "26px" }}
                            >
                                {payload.importantNoticeBody}
                            </p>
                        </div>
                    </div>
                </section>
            </section>

            {/* Footer - matches Figma 39:9899 */}
            <footer
                className="px-6 relative"
                style={{ backgroundColor: "#101828", height: "128px" }}
            >
                <div className="mx-auto max-w-[1100px]">
                    {/* Logo Row */}
                    <div 
                        className="flex items-center justify-center"
                        style={{ gap: "8px", height: "36px" }}
                    >
                        <div
                            className="flex items-center justify-center rounded-[10px]"
                            style={{ backgroundColor: "#155dfc", width: "36px", height: "36px" }}
                        >
                            <div className="h-5 w-5 overflow-hidden">
                                <img
                                    src={imgVector}
                                    alt="SkyMaintain"
                                    className="h-full w-full object-contain"
                                />
                            </div>
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
                        className="text-center"
                        style={{ color: "#99a1af", fontSize: "14px", lineHeight: "20px", marginTop: "16px" }}
                    >
                        AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                    </p>

                    {/* Copyright */}
                    <p
                        className="text-center"
                        style={{ color: "#d1d5dc", fontSize: "14px", lineHeight: "20px", marginTop: "8px" }}
                    >
                        © 2026{" "}
                        <span style={{ color: "#51a2ff" }}>SkyMaintain</span>
                        . All Rights Reserved.
                    </p>

                    {/* EncycloAMTs */}
                    <p
                        className="text-center"
                        style={{ color: "#6a7282", fontSize: "14px", lineHeight: "20px", marginTop: "8px" }}
                    >
                        SkyMaintain is a product of EncycloAMTs LLC.
                    </p>
                </div>
            </footer>
        </div>
    );
}

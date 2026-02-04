/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_GENERAL } from "@/lib/routes";

/* ----------------------------- Figma Assets ----------------------------- */
const imgIconShield =
    "https://www.figma.com/api/mcp/asset/c1fb85a3-4403-49cf-9cde-2e88ebd71a59";
const imgIconArrow =
    "https://www.figma.com/api/mcp/asset/7f780624-8afc-4672-868f-0a48b93d35be";
const imgVector =
    "https://www.figma.com/api/mcp/asset/cb7d7b83-eddb-4003-abc7-950b54ef38d4";
const imgVectorLarge =
    "https://www.figma.com/api/mcp/asset/5cc557cc-0d79-4e48-904e-c6537a4ad2b0";
const imgIconArrowSmall =
    "https://www.figma.com/api/mcp/asset/a4d21c24-180a-4ae0-bdbe-6e41172e2a12";

/* ----------------------------- Type Definitions ----------------------------- */
type DataMode = "mock" | "live" | "hybrid";

type PolicySection = {
    id: string;
    heading: string;
    subheadings?: Array<{
        title: string;
        paragraphs: string[];
        items?: string[];
        note?: string;
    }>;
    paragraphs?: string[];
    items?: string[];
    note?: string;
};

type PrivacyPolicyDoc = {
    badge: string;
    title: string;
    effective_date: string;
    last_updated: string;
    lead: string;
    product_note: string;
    intro: string;
    sections: PolicySection[];
    contact_info: {
        team_name: string;
        email: string;
        company: string;
        location: string;
    };
    questions_banner: {
        title: string;
        subtitle: string;
        cta_label: string;
        cta_href: string;
    };
};

type ApiEnvelope<T> = { ok: boolean; data: T; meta?: { request_id?: string } };

/* ----------------------------- Helpers ----------------------------- */
function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
    if (raw === "mock" || raw === "live" || raw === "hybrid") return raw;
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
}

/* ----------------------------- Default Data ----------------------------- */
const DEFAULT_DOC: PrivacyPolicyDoc = {
    badge: "Privacy Policy",
    title: "SkyMaintain Privacy Policy",
    effective_date: "Effective Date: January 27, 2026",
    last_updated: "Last Updated: January 27, 2026",
    lead: 'SkyMaintain ("SkyMaintain," "we," "us," or "our") respects your privacy and is committed to protecting the personal and operational information you share with us.',
    product_note: "SkyMaintain is a product of EncycloAMTs LLC.",
    intro: 'This Privacy Policy explains how information is collected, used, disclosed, and protected when you access or use the SkyMaintain platform, website, or related services (collectively, the "Services").',
    sections: [
        {
            id: "scope",
            heading: "1. Scope of This Policy",
            paragraphs: ["This Privacy Policy applies to:"],
            items: [
                "The SkyMaintain website",
                "The SkyMaintain SaaS platform",
                "Trial, demo, and production environments",
                "Communications with SkyMaintain (email, support, demos)",
            ],
            note: "This policy does not apply to third-party services you may access through integrations.",
        },
        {
            id: "info-collect",
            heading: "2. Information We Collect",
            subheadings: [
                {
                    title: "2.1 Information You Provide",
                    paragraphs: ["We may collect information you voluntarily provide, including:"],
                    items: [
                        "Name",
                        "Business email address",
                        "Organization or company name",
                        "Job title or role",
                        "Support requests and communications",
                        "Account credentials",
                    ],
                },
                {
                    title: "2.2 Operational & Platform Data",
                    paragraphs: ["When using the platform, SkyMaintain may process:"],
                    items: [
                        "Maintenance records or structured operational data uploaded by users",
                        "System usage data (features accessed, timestamps)",
                        "Configuration preferences",
                    ],
                    note: "SkyMaintain does not require personally identifiable aircraft ownership data unless explicitly provided by the user.",
                },
                {
                    title: "2.3 Technical & Log Data",
                    paragraphs: ["We may automatically collect:"],
                    items: [
                        "IP address",
                        "Browser type and device information",
                        "Session identifiers",
                        "Security logs and audit logs",
                    ],
                },
            ],
            note: "This data is used strictly for security, reliability, and platform improvement.",
        },
        {
            id: "how-use",
            heading: "3. How We Use Information",
            paragraphs: ["We use collected information to:"],
            items: [
                "Provide and operate the SkyMaintain platform",
                "Authenticate users and manage accounts",
                "Deliver support and respond to inquiries",
                "Improve system performance and reliability",
                "Maintain security and prevent misuse",
                "Meet legal and contractual obligations",
            ],
        },
        {
            id: "ai-transparency",
            heading: "4. AI & Data Use Transparency",
            subheadings: [
                {
                    title: "4.1 No Autonomous Decision-Making",
                    paragraphs: [
                        "SkyMaintain provides AI-assisted decision support only. The platform does not make autonomous maintenance decisions.",
                    ],
                },
                {
                    title: "4.2 No Model Training on Customer Data",
                    paragraphs: [
                        "Customer-provided data is not used to train AI models unless explicitly agreed to in writing.",
                        "All AI outputs are generated for the specific user environment and are not shared across organizations.",
                    ],
                },
            ],
        },
        {
            id: "data-sharing",
            heading: "5. Data Sharing & Disclosure",
            paragraphs: [
                "We do not sell personal or operational data.",
                "We may share information only in the following circumstances:",
            ],
            items: [
                "With trusted service providers (hosting, security, infrastructure)",
                "To comply with legal obligations",
                "To protect the rights, safety, or security of SkyMaintain, users, or others",
                "With explicit user consent",
            ],
            note: "All service providers are contractually obligated to protect data confidentiality.",
        },
        {
            id: "data-security",
            heading: "6. Data Security",
            paragraphs: [
                "SkyMaintain employs reasonable administrative, technical, and organizational safeguards, including:",
            ],
            items: [
                "Encryption in transit and at rest",
                "Role-based access controls",
                "Secure authentication mechanisms",
                "Audit logging and monitoring",
            ],
            note: "While no system is 100% secure, we actively work to protect your information.",
        },
        {
            id: "data-retention",
            heading: "7. Data Retention",
            paragraphs: ["We retain information only as long as necessary to:"],
            items: [
                "Provide the Services",
                "Meet legal, regulatory, or contractual obligations",
                "Resolve disputes",
                "Enforce agreements",
            ],
            note: "Users may request deletion of their data, subject to legal or regulatory retention requirements.",
        },
        {
            id: "your-rights",
            heading: "8. Your Rights & Choices",
            paragraphs: ["Depending on your jurisdiction, you may have the right to:"],
            items: [
                "Access your personal data",
                "Correct inaccurate information",
                "Request deletion of personal data",
                "Object to certain processing activities",
            ],
            note: "Requests may be submitted to: 📧 privacy@skymaintain.ai",
        },
        {
            id: "cookies",
            heading: "9. Cookies & Tracking",
            paragraphs: [
                "SkyMaintain may use essential cookies necessary for platform functionality.",
                "We do not use third-party advertising trackers at this time.",
                "If analytics or optional cookies are introduced, this policy will be updated accordingly.",
            ],
        },
        {
            id: "international",
            heading: "10. International Users",
            paragraphs: [
                "SkyMaintain is operated from the United States. By using the Services, you consent to the transfer and processing of information in the United States, subject to applicable safeguards.",
            ],
        },
        {
            id: "children",
            heading: "11. Children's Privacy",
            paragraphs: [
                "SkyMaintain is intended for professional use only. We do not knowingly collect data from individuals under 18 years of age.",
            ],
        },
        {
            id: "changes",
            heading: "12. Changes to This Policy",
            paragraphs: [
                "We may update this Privacy Policy from time to time. Material changes will be communicated via the platform or website.",
                "Continued use of SkyMaintain after updates constitutes acceptance of the revised policy.",
            ],
        },
        {
            id: "contact",
            heading: "13. Contact Information",
            paragraphs: ["For privacy-related inquiries, please contact:"],
        },
    ],
    contact_info: {
        team_name: "SkyMaintain Privacy Team",
        email: "privacy@skymaintain.ai",
        company: "EncycloAMTs LLC",
        location: "United States",
    },
    questions_banner: {
        title: "Questions about privacy?",
        subtitle: "We're committed to transparency and protecting your data.",
        cta_label: "Contact Us",
        cta_href: CONTACT_GENERAL,
    },
};

let mockStore: PrivacyPolicyDoc = structuredClone(DEFAULT_DOC);

/* ----------------------------- API ----------------------------- */
async function apiGetPolicy(signal?: AbortSignal): Promise<PrivacyPolicyDoc> {
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

    const res = await fetch(`${base}/v1/public/privacy`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/privacy failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<PrivacyPolicyDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/privacy");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

/* ----------------------------- Components ----------------------------- */
function LoadingSkeleton(): React.ReactElement {
    return (
        <div className="animate-pulse min-h-screen">
            {/* Header skeleton */}
            <div
                className="fixed top-0 left-0 right-0 z-50 px-6 flex items-center justify-between"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    height: "80.8px",
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-[14px] bg-blue-200" />
                    <div>
                        <div className="h-6 w-28 rounded bg-gray-200" />
                        <div className="mt-1 h-3 w-36 rounded bg-gray-200" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-24 rounded-lg bg-gray-200" />
                    <div className="h-9 w-28 rounded-lg bg-blue-200" />
                </div>
            </div>
            {/* Hero skeleton */}
            <div
                className="px-[126px] pt-[128px]"
                style={{
                    background: "linear-gradient(161.15deg, #eff6ff 0%, #faf5ff 100%)",
                    height: "392px",
                }}
            >
                <div className="mx-auto max-w-[848px] text-center">
                    <div className="mx-auto h-10 w-40 rounded-full bg-blue-200" />
                    <div className="mx-auto mt-8 h-12 w-96 rounded bg-gray-200" />
                    <div className="mx-auto mt-8 h-6 w-64 rounded bg-gray-200" />
                    <div className="mx-auto mt-2 h-6 w-60 rounded bg-gray-200" />
                </div>
            </div>
            {/* Content skeleton */}
            <div className="mx-auto max-w-[848px] px-[150px] py-16">
                <div className="rounded-[14px] border bg-white p-[41.6px]">
                    <div className="h-6 w-full rounded bg-gray-200" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-gray-200" />
                    <div className="mt-12 h-6 w-5/6 rounded bg-gray-200" />
                    <div className="mt-12 h-6 w-full rounded bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

function SectionBlock({ section }: { section: PolicySection }): React.ReactElement {
    return (
        <div className="mt-12">
            {/* Section Heading */}
            <h2
                className="font-bold"
                style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
            >
                {section.heading}
            </h2>

            {/* Section paragraphs */}
            {section.paragraphs && (
                <div className="mt-[60px]" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {section.paragraphs.map((p, idx) => {
                        // Bold styling for specific statements
                        if (p.startsWith("We do not sell")) {
                            return (
                                <p
                                    key={idx}
                                    className="font-bold"
                                    style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}
                                >
                                    {p}
                                </p>
                            );
                        }
                        return (
                            <p
                                key={idx}
                                style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}
                            >
                                {p}
                            </p>
                        );
                    })}
                </div>
            )}

            {/* Section items list - matches Figma 39:9446 */}
            {section.items && (
                <ul className="mt-4 ml-6" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start" style={{ height: "32px", gap: "12px" }}>
                            <span
                                style={{ color: "#155dfc", fontSize: "18px", lineHeight: "28px", marginTop: "4px" }}
                            >
                                •
                            </span>
                            <span
                                style={{ color: "#364153", fontSize: "18px", lineHeight: "28px" }}
                            >
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Subheadings */}
            {section.subheadings &&
                section.subheadings.map((sub, subIdx) => (
                    <div key={subIdx} className="mt-8">
                        <h3
                            className="font-bold"
                            style={{ color: "#101828", fontSize: "24px", lineHeight: "32px" }}
                        >
                            {sub.title}
                        </h3>

                        {sub.paragraphs && (
                            <div className="mt-4" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {sub.paragraphs.map((p, pIdx) => (
                                    <p
                                        key={pIdx}
                                        style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}
                                    >
                                        {p}
                                    </p>
                                ))}
                            </div>
                        )}

                        {sub.items && (
                            <ul className="mt-4 ml-6" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {sub.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start" style={{ height: "32px", gap: "12px" }}>
                                        <span
                                            style={{ color: "#155dfc", fontSize: "18px", lineHeight: "28px", marginTop: "4px" }}
                                        >
                                            •
                                        </span>
                                        <span
                                            style={{ color: "#364153", fontSize: "18px", lineHeight: "28px" }}
                                        >
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {sub.note && (
                            <p className="mt-4" style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}>
                                <span className="font-bold">Important:</span> {sub.note}
                            </p>
                        )}
                    </div>
                ))}

            {/* Section note */}
            {section.note && (
                <p className="mt-4" style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}>
                    {section.note}
                </p>
            )}
        </div>
    );
}

/* ----------------------------- Page Component ----------------------------- */
export default function PrivacyPage(): React.ReactElement {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<PrivacyPolicyDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetPolicy(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load Privacy Policy.";
                setError(msg);
                setDoc(structuredClone(DEFAULT_DOC));
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    if (loading) {
        return <LoadingSkeleton />;
    }

    const content = doc;

    return (
        <div className="w-full bg-white min-h-screen relative">
            {/* Fixed Header - matches Figma 39:9794 */}
            <header
                className="fixed top-0 left-0 right-0 z-50 px-6 pt-4 pb-4"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)",
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
                                boxShadow: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div className="h-7 w-7 overflow-hidden">
                                <img
                                    src={imgVectorLarge}
                                    alt=""
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

                    {/* Nav Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center justify-center rounded-lg px-4 py-2"
                            style={{ height: "36px" }}
                        >
                            <span style={{ color: "#364153", fontSize: "14px", lineHeight: "20px" }}>
                                Back to Home
                            </span>
                        </Link>
                        <Link
                            href="/get-started"
                            className="flex items-center gap-1 rounded-lg px-4 py-2"
                            style={{ backgroundColor: "#155dfc", height: "36px" }}
                        >
                            <span style={{ color: "#ffffff", fontSize: "14px", lineHeight: "20px" }}>
                                Get Started
                            </span>
                            <img
                                src={imgIconArrowSmall}
                                alt=""
                                className="h-4 w-4"
                            />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section - matches Figma 39:9418 */}
            <section
                className="px-[126px] pt-[128px]"
                style={{
                    background: "linear-gradient(161.15deg, #eff6ff 0%, #faf5ff 100%)",
                    height: "392px",
                }}
            >
                <div className="mx-auto max-w-[848px] relative h-[200px]">
                    {/* Badge - centered */}
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2 top-0 flex items-center gap-2 rounded-full px-5 py-2.5"
                        style={{ backgroundColor: "#155dfc", height: "40px" }}
                    >
                        <img
                            src={imgIconShield}
                            alt=""
                            className="h-5 w-5"
                        />
                        <span
                            style={{ color: "#ffffff", fontSize: "14px", lineHeight: "20px" }}
                        >
                            {content.badge}
                        </span>
                    </div>

                    {/* Title - centered */}
                    <h1
                        className="absolute left-0 right-0 text-center font-bold"
                        style={{ color: "#101828", fontSize: "48px", lineHeight: "48px", top: "64px" }}
                    >
                        {content.title}
                    </h1>

                    {/* Dates - stacked */}
                    <div className="absolute left-0 right-0 flex flex-col gap-2" style={{ top: "136px" }}>
                        <p
                            className="text-center"
                            style={{ color: "#4a5565", fontSize: "18px", lineHeight: "28px" }}
                        >
                            {content.effective_date}
                        </p>
                        <p
                            className="text-center"
                            style={{ color: "#4a5565", fontSize: "18px", lineHeight: "28px" }}
                        >
                            {content.last_updated}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - matches Figma 39:9433 */}
            <section className="bg-white pt-16 px-[150px] pb-12" style={{ gap: "48px" }}>
                <div className="mx-auto max-w-[848px]">
                    {/* Intro Card - matches Figma 39:9434 */}
                    <div
                        className="rounded-[14px] p-[41.6px]"
                        style={{ 
                            border: "1.6px solid rgba(0,0,0,0.1)",
                            backgroundColor: "#ffffff"
                        }}
                    >
                        <p
                            style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}
                        >
                            {content.lead}
                        </p>
                        <p
                            className="font-bold mt-[50.4px]"
                            style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}
                        >
                            {content.product_note}
                        </p>
                        <p
                            className="mt-[50.4px]"
                            style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}
                        >
                            {content.intro}
                        </p>
                    </div>

                    {error && (
                        <div className="mt-8 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                            {error}
                        </div>
                    )}

                    {/* Policy Sections */}
                    <div className="mt-12" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                        {content.sections.slice(0, -1).map((section) => (
                            <SectionBlock key={section.id} section={section} />
                        ))}

                        {/* Contact Information Section (last section) - matches Figma 39:9750 */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <h2
                                className="font-bold"
                                style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                            >
                                13. Contact Information
                            </h2>
                            <p
                                style={{ color: "#364153", fontSize: "18px", lineHeight: "29.25px" }}
                            >
                                For privacy-related inquiries, please contact:
                            </p>

                            {/* Contact Card - matches Figma 39:9755 */}
                            <div
                                className="rounded-[14px]"
                                style={{
                                    backgroundColor: "#eff6ff",
                                    border: "0.8px solid #bedbff",
                                    padding: "24.8px",
                                }}
                            >
                                <p
                                    className="font-bold"
                                    style={{ color: "#101828", fontSize: "18px", lineHeight: "28px" }}
                                >
                                    {content.contact_info.team_name}
                                </p>
                                <p style={{ color: "#364153", fontSize: "18px", lineHeight: "28px", marginTop: "8px" }}>
                                    📧{" "}
                                    <a
                                        href={`mailto:${content.contact_info.email}`}
                                        style={{ color: "#155dfc", fontSize: "18px", lineHeight: "28px" }}
                                    >
                                        {content.contact_info.email}
                                    </a>
                                </p>
                                <p
                                    className="font-bold"
                                    style={{ color: "#364153", fontSize: "18px", lineHeight: "28px", marginTop: "16px" }}
                                >
                                    {content.contact_info.company}
                                </p>
                                <p
                                    style={{ color: "#364153", fontSize: "18px", lineHeight: "28px", marginTop: "8px" }}
                                >
                                    {content.contact_info.location}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Questions CTA Banner - matches Figma 39:9767 */}
            <section
                className="px-[126px] pt-24"
                style={{
                    background: "linear-gradient(162.41deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                    height: "364px",
                }}
            >
                <div className="mx-auto max-w-[848px] px-6 flex flex-col items-center" style={{ gap: "24px" }}>
                    <h2
                        className="font-bold text-center"
                        style={{ color: "#ffffff", fontSize: "36px", lineHeight: "40px" }}
                    >
                        {content.questions_banner.title}
                    </h2>
                    <p
                        className="text-center opacity-90"
                        style={{ color: "#ffffff", fontSize: "20px", lineHeight: "28px" }}
                    >
                        {content.questions_banner.subtitle}
                    </p>
                    <div>
                        <Link
                            href={content.questions_banner.cta_href}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3"
                            style={{
                                color: "#155dfc",
                                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                                height: "48px",
                            }}
                        >
                            <span style={{ fontSize: "18px", lineHeight: "28px" }}>
                                {content.questions_banner.cta_label}
                            </span>
                            <img
                                src={imgIconArrow}
                                alt=""
                                className="h-5 w-5"
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer - matches Figma 39:9779 */}
            <footer
                className="px-6"
                style={{ backgroundColor: "#101828", height: "168.8px" }}
            >
                <div className="mx-auto max-w-[1100px] flex flex-col" style={{ gap: "24px" }}>
                    {/* Logo & tagline */}
                    <div className="flex flex-col items-center" style={{ gap: "16px", height: "72px" }}>
                        <div className="flex items-center justify-center gap-3">
                            <div
                                className="flex items-center justify-center rounded-[10px]"
                                style={{
                                    background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                    width: "36px",
                                    height: "36px",
                                }}
                            >
                                <div className="h-5 w-5 overflow-hidden">
                                    <img
                                        src={imgVector}
                                        alt=""
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </div>
                            <span
                                className="font-bold text-center"
                                style={{ color: "#ffffff", fontSize: "20px", lineHeight: "28px" }}
                            >
                                SkyMaintain
                            </span>
                        </div>
                        <p
                            className="text-center"
                            style={{ color: "#99a1af", fontSize: "14px", lineHeight: "20px" }}
                        >
                            Regulatory-Compliant AI-Assisted Aircraft Maintenance Decision Support
                        </p>
                    </div>

                    {/* Bottom bar */}
                    <div
                        className="text-center"
                        style={{ borderTop: "0.8px solid #1e2939", height: "72.8px", paddingTop: "24px" }}
                    >
                        <p
                            className="text-center"
                            style={{ color: "#d1d5dc", fontSize: "14px", lineHeight: "20px" }}
                        >
                            © 2026 SkyMaintain. All rights reserved.
                        </p>
                        <p
                            className="text-center"
                            style={{ color: "#51a2ff", fontSize: "14px", lineHeight: "20px", marginTop: "8px" }}
                        >
                            SkyMaintain is a product of EncycloAMTs LLC.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

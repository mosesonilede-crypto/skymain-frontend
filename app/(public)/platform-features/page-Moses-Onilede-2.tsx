"use client";
/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 39:11010
 * nodeName: Product Features in Sign in Page
 * Figma URL: https://www.figma.com/design/qz3ERP8jfbTpTHQrdPSawI/SkyMaintain-Design?node-id=39-11010
 */

import { useRouter } from "next/navigation";
import { CONTACT_DEMO } from "@/lib/routes";

// Figma asset URLs
const imgIconPredictive1 = "https://www.figma.com/api/mcp/asset/318c797a-e99c-40e8-af98-2878bb058c76";
const imgIconPredictive2 = "https://www.figma.com/api/mcp/asset/9c52ad02-79ad-4fe1-aade-b1232fbc4e9a";
const imgIconPredictive3 = "https://www.figma.com/api/mcp/asset/a08c300b-47a7-499e-b104-4c2c2b671f24";
const imgIconPredictive4 = "https://www.figma.com/api/mcp/asset/db6b14db-0172-4a24-abce-792221803e83";
const imgIconPredictive5 = "https://www.figma.com/api/mcp/asset/0b660bf1-b260-4f36-ac3c-af4b3b4b2727";
const imgIconPredictive6 = "https://www.figma.com/api/mcp/asset/9db6c05c-874c-4a32-9b6e-f30afa7e1e56";
const imgIconPredictive7 = "https://www.figma.com/api/mcp/asset/9930cf31-b298-443e-aa9f-5a5e89a8f490";
const imgIconPredictive8 = "https://www.figma.com/api/mcp/asset/49e753e9-8816-4440-ba6a-f1bdac262899";
const imgIconPredictive9 = "https://www.figma.com/api/mcp/asset/0031806c-7bca-45a1-9bed-b2534577f2b1";
const imgIconCheck = "https://www.figma.com/api/mcp/asset/f88d6d3d-5524-40f1-95ae-2e8b92735f14";
const imgIconData1 = "https://www.figma.com/api/mcp/asset/9899919a-fce2-47ad-95c5-635c27e871b6";
const imgIconData2 = "https://www.figma.com/api/mcp/asset/c42c3a4b-7d92-40d3-a665-cd1118451b79";
const imgIconData3 = "https://www.figma.com/api/mcp/asset/2192a162-0f80-48f8-90c1-94116bce439e";
const imgIconShield = "https://www.figma.com/api/mcp/asset/a0501cce-a1c3-4a61-a15d-f4fc5cc843e9";
const imgIconTech1 = "https://www.figma.com/api/mcp/asset/0ff31a63-eb9c-487a-937a-928abb1c3ad9";
const imgIconTech2 = "https://www.figma.com/api/mcp/asset/83458da9-dcb8-4f92-a5e9-e184b5369d3a";
const imgIconTech3 = "https://www.figma.com/api/mcp/asset/2a22c49b-9226-462a-aad0-dceb9eadbbe6";
const imgIconTech4 = "https://www.figma.com/api/mcp/asset/19ca017f-6a72-42b6-ade0-6dc1f07b4975";
const imgIconCloud1 = "https://www.figma.com/api/mcp/asset/b61b84ea-5810-4408-a05c-fb65e2ff8696";
const imgIconCloud2 = "https://www.figma.com/api/mcp/asset/ef97d2c4-081b-4132-8730-eaf6cd06a574";
const imgIconArrowCta = "https://www.figma.com/api/mcp/asset/8eea28f0-50d1-4fb8-b152-9b17f3bcbc9b";
const imgVectorLogo = "https://www.figma.com/api/mcp/asset/50314aeb-5704-48ff-b90d-a5dfa2f8a2af";
const imgVectorLogoHeader = "https://www.figma.com/api/mcp/asset/990944bd-4571-4cc3-8bf0-0b0aaa6c470f";
const imgIconArrow = "https://www.figma.com/api/mcp/asset/03465991-d678-400f-aaa5-1253f75c9bae";

// Feature data
const features = [
    {
        title: "Predictive Maintenance Intelligence",
        description: "SkyMaintain analyzes maintenance data to identify recurring issues, emerging risks, and performance trends across aircraft systems.",
        bullets: [
            "AI-assisted pattern recognition",
            "Early identification of high-risk components",
            "Trend analysis across maintenance events",
            "Decision-support insights, not automated decisions",
        ],
        iconParts: [imgIconPredictive1, imgIconPredictive2, imgIconPredictive3, imgIconPredictive4, imgIconPredictive5, imgIconPredictive6, imgIconPredictive7, imgIconPredictive8, imgIconPredictive9],
        height: "349.7px",
    },
    {
        title: "Maintenance Data Integration",
        description: "Designed to work with structured maintenance records and operational data.",
        bullets: [
            "Supports ingestion of inspection records, defect reports, and maintenance logs",
            "Modular architecture for system-specific analysis (hydraulics, landing gear, powerplant, etc.)",
            "Built to evolve with operator data maturity",
        ],
        iconParts: [imgIconData1, imgIconData2, imgIconData3],
        height: "284.45px",
    },
    {
        title: "Regulatory-Aligned Architecture",
        description: "SkyMaintain is built with regulatory awareness at its core.",
        bullets: [
            "Architecture informed by FAA and EASA maintenance principles",
            "Supports traceability, documentation, and audit readiness",
            "Designed to complement — not replace — approved maintenance programs",
        ],
        iconParts: [imgIconShield],
        height: "284.45px",
    },
    {
        title: "Technician & Engineer Support",
        description: "Clear, intuitive dashboards reduce cognitive load and information fragmentation.",
        bullets: [
            "Human-centered design for maintenance professionals",
            "Visual insights to support troubleshooting and planning",
            "Encourages consistent, informed decision-making",
        ],
        iconParts: [imgIconTech1, imgIconTech2, imgIconTech3, imgIconTech4],
        height: "284.45px",
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
        iconParts: [imgIconCloud1, imgIconCloud2],
        height: "320.45px",
    },
];

export default function PlatformFeaturesPage() {
    const router = useRouter();

    return (
        <div style={{ backgroundColor: "#ffffff", position: "relative", width: "100%", minHeight: "100vh" }}>
            {/* Fixed Header - 80.8px */}
            <header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "80.8px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)",
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px 0.8px 24px",
                }}
            >
                {/* Logo Section */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "48px" }}>
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                            boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px",
                        }}
                    >
                        <img src={imgVectorLogoHeader} alt="SkyMaintain" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
                    </div>
                    <div>
                        <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#101828", margin: 0 }}>
                            SkyMaintain
                        </p>
                        <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#4a5565", margin: 0 }}>
                            Regulatory-Compliant AI Platform
                        </p>
                    </div>
                </div>

                {/* Header Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button
                        onClick={() => router.push("/")}
                        style={{
                            height: "36px",
                            padding: "8px 16px",
                            background: "transparent",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "#364153",
                        }}
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => router.push("/get-started")}
                        style={{
                            height: "36px",
                            padding: "8px 16px",
                            backgroundColor: "#155dfc",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "#ffffff" }}>
                            Get Started
                        </span>
                        <img src={imgIconArrow} alt="" style={{ width: "16px", height: "16px" }} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ paddingTop: "80.8px" }}>
                {/* Hero Section - 523.1px */}
                <section
                    style={{
                        minHeight: "523.1px",
                        background: "linear-gradient(155.5deg, #eff6ff 0%, #faf5ff 100%)",
                        padding: "128px 126px 64px 126px",
                    }}
                >
                    <div style={{ width: "100%", maxWidth: "896px", margin: "0 auto", textAlign: "center" }}>
                        {/* Badge */}
                        <div
                            style={{
                                display: "inline-block",
                                backgroundColor: "#155dfc",
                                borderRadius: "8px",
                                padding: "8.8px 20px",
                                marginBottom: "24px",
                            }}
                        >
                            <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "#ffffff" }}>
                                Platform Features
                            </span>
                        </div>

                        {/* Heading */}
                        <h1
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: "48px",
                                lineHeight: "48px",
                                color: "#101828",
                                margin: "0 0 24px 0",
                                maxWidth: "729px",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            Intelligent tools built to support aircraft maintenance decision-making
                        </h1>

                        {/* Subheading */}
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: "20px",
                                lineHeight: "32.5px",
                                color: "#4a5565",
                                margin: 0,
                                maxWidth: "735px",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            SkyMaintain is an AI-assisted software platform designed to help maintenance professionals analyze data, identify trends, and support informed decisions — while maintaining full compliance with aviation regulatory frameworks.
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "80px 24px",
                    }}
                >
                    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "64px" }}>
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                style={{
                                    backgroundColor: "#ffffff",
                                    border: "1.6px solid rgba(0,0,0,0.1)",
                                    borderRadius: "14px",
                                    padding: "41.6px",
                                    display: "flex",
                                    gap: "32px",
                                    alignItems: "flex-start",
                                }}
                            >
                                {/* Icon */}
                                <div style={{ width: "48px", height: "48px", flexShrink: 0, position: "relative" }}>
                                    {feature.iconParts.length === 1 ? (
                                        <img src={feature.iconParts[0]} alt="" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                                    ) : (
                                        <div style={{ width: "48px", height: "48px", position: "relative" }}>
                                            {/* For complex icons, show first part as representative */}
                                            <img src={feature.iconParts[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    {/* Title */}
                                    <h2
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "30px",
                                            lineHeight: "36px",
                                            color: "#101828",
                                            margin: "0 0 16px 0",
                                        }}
                                    >
                                        {feature.title}
                                    </h2>

                                    {/* Description */}
                                    <p
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: "18px",
                                            lineHeight: "29.25px",
                                            color: "#4a5565",
                                            margin: "0 0 16px 0",
                                        }}
                                    >
                                        {feature.description}
                                    </p>

                                    {/* Bullet List */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {feature.bullets.map((bullet, bulletIdx) => (
                                            <div key={bulletIdx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <img src={imgIconCheck} alt="" style={{ width: "20px", height: "20px", flexShrink: 0 }} />
                                                <span
                                                    style={{
                                                        fontFamily: "Arial, sans-serif",
                                                        fontWeight: 400,
                                                        fontSize: "16px",
                                                        lineHeight: "24px",
                                                        color: "#364153",
                                                    }}
                                                >
                                                    {bullet}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section - 304px */}
                <section
                    style={{
                        height: "304px",
                        background: "linear-gradient(165.2deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                        padding: "96px 126px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 700,
                            fontSize: "36px",
                            lineHeight: "40px",
                            color: "#ffffff",
                            textAlign: "center",
                            margin: "0 0 24px 0",
                        }}
                    >
                        Ready to see SkyMaintain in action?
                    </h2>

                    <div style={{ display: "flex", gap: "16px" }}>
                        <button
                            onClick={() => router.push("/get-started")}
                            style={{
                                height: "48px",
                                padding: "10px 24px",
                                backgroundColor: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontSize: "18px", lineHeight: "28px", color: "#155dfc" }}>
                                Start Your Free Trial
                            </span>
                            <img src={imgIconArrowCta} alt="" style={{ width: "20px", height: "20px" }} />
                        </button>
                        <button
                            onClick={() => router.push(CONTACT_DEMO)}
                            style={{
                                height: "48px",
                                padding: "24px 40px",
                                backgroundColor: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontSize: "18px", lineHeight: "28px", color: "#155dfc" }}>
                                Schedule a Demo
                            </span>
                        </button>
                    </div>
                </section>

                {/* Footer - 128px */}
                <footer
                    style={{
                        height: "128px",
                        backgroundColor: "#101828",
                        padding: "0 24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Logo Row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                backgroundColor: "#155dfc",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px",
                            }}
                        >
                            <img src={imgVectorLogo} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                        </div>
                        <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "18px", lineHeight: "28px", color: "#ffffff" }}>
                            SkyMaintain
                        </span>
                    </div>

                    {/* Tagline */}
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "#99a1af",
                            textAlign: "center",
                            margin: "0 0 8px 0",
                        }}
                    >
                        AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                    </p>

                    {/* Copyright */}
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "#d1d5dc",
                            textAlign: "center",
                            margin: "0 0 8px 0",
                        }}
                    >
                        © 2026{" "}
                        <span style={{ color: "#51a2ff" }}>SkyMaintain</span>
                        . All Rights Reserved.
                    </p>

                    {/* Company Info */}
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "#6a7282",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        SkyMaintain is a product of EncycloAMTs LLC.
                    </p>
                </footer>
            </main>
        </div>
    );
}

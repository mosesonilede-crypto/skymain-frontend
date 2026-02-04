"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

// Figma asset URLs for node 40:12273
const imgIconScale = "https://www.figma.com/api/mcp/asset/801ff1ef-547a-4767-bfe4-334802a1b726";
const imgIconWarning = "https://www.figma.com/api/mcp/asset/60f5888e-7fde-45c1-b5fe-af26334e9215";
const imgVectorSmall = "https://www.figma.com/api/mcp/asset/f58c0725-5f2b-40d4-a15b-de1e2b2d5fbe";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/10c3222b-78e1-484f-a788-b9c964c5c6ca";
const imgIconArrowLeft = "https://www.figma.com/api/mcp/asset/4bc052ee-701d-4299-98c1-670eea67f2e1";

export default function TermsOfServicePage(): React.ReactElement {
    const router = useRouter();

    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                position: "relative",
                width: "100%",
                minHeight: "100vh",
            }}
        >
            {/* Fixed Header */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 80.8,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px 0px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    zIndex: 1000,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: "pointer",
                    }}
                    onClick={() => router.push("/")}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                            boxShadow: "0px 10px 15px 0px rgba(0,0,0,0.1), 0px 4px 6px 0px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 10,
                        }}
                    >
                        <img
                            src={imgVectorLarge}
                            alt="SkyMaintain"
                            style={{ width: 28, height: 28, objectFit: "contain" }}
                        />
                    </div>
                    <div>
                        <div
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 24,
                                lineHeight: "32px",
                                color: "#101828",
                                textAlign: "center",
                            }}
                        >
                            SkyMaintain
                        </div>
                        <div
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 12,
                                lineHeight: "16px",
                                color: "#4a5565",
                                textAlign: "center",
                            }}
                        >
                            Regulatory-Compliant AI Platform
                        </div>
                    </div>
                </div>

                {/* Back to Home Button */}
                <button
                    onClick={() => router.push("/")}
                    style={{
                        height: 36,
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: "transparent",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "#364153",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <img
                        src={imgIconArrowLeft}
                        alt=""
                        style={{ width: 16, height: 16 }}
                    />
                    Back to Home
                </button>
            </div>

            {/* Main Content */}
            <div
                style={{
                    paddingTop: 80.8,
                    width: "100%",
                    maxWidth: 1148,
                    margin: "0 auto",
                }}
            >
                {/* Hero Section */}
                <div
                    style={{
                        background: "linear-gradient(158.1deg, #eff6ff 0%, #faf5ff 100%)",
                        padding: "128px 126px 64px",
                        textAlign: "center",
                    }}
                >
                    {/* Scale Icon */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src={imgIconScale}
                            alt=""
                            style={{ width: 80, height: 80 }}
                        />
                    </div>

                    {/* Badge */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#155dfc",
                            borderRadius: 8,
                            padding: "10.8px 20px",
                            marginTop: 24,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#ffffff",
                            }}
                        >
                            Legal
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 700,
                            fontSize: 48,
                            lineHeight: "48px",
                            color: "#101828",
                            marginTop: 24,
                            marginBottom: 0,
                        }}
                    >
                        Terms of Service
                    </h1>

                    {/* Last Updated */}
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: 18,
                            lineHeight: "28px",
                            color: "#4a5565",
                            marginTop: 24,
                            marginBottom: 0,
                        }}
                    >
                        Last Updated: January 31, 2026
                    </p>
                </div>

                {/* Content Section */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "80px 86px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 48,
                    }}
                >
                    {/* Section Cards Container */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 32,
                        }}
                    >
                        {/* Section 1: Overview */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                padding: "33.6px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                1. Overview
                            </h2>
                            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    SkyMaintain is a software-as-a-service (SaaS) platform providing AI-assisted decision-support tools for aircraft maintenance professionals.
                                </p>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    SkyMaintain is a product of EncycloAMTs LLC.
                                </p>
                            </div>
                        </div>

                        {/* Section 2: No Replacement of Certified Judgment */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                padding: "33.6px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                2. No Replacement of Certified Judgment
                            </h2>
                            <div style={{ marginTop: 40 }}>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    SkyMaintain provides decision-support insights only.
                                </p>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: "16px 0 0 0",
                                    }}
                                >
                                    SkyMaintain does not:
                                </p>
                                <ul style={{ paddingLeft: 16, marginTop: 16, marginBottom: 0, listStyle: "none" }}>
                                    {[
                                        "Replace certified maintenance personnel",
                                        "Issue maintenance approvals or certifications",
                                        "Replace approved maintenance programs",
                                        "Make autonomous maintenance decisions",
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                marginBottom: 8,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily: "Arial, sans-serif",
                                                    fontWeight: 400,
                                                    fontSize: 16,
                                                    lineHeight: "24px",
                                                    color: "#155dfc",
                                                }}
                                            >
                                                •
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: "Arial, sans-serif",
                                                    fontWeight: 400,
                                                    fontSize: 16,
                                                    lineHeight: "24px",
                                                    color: "#364153",
                                                }}
                                            >
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: "16px 0 0 0",
                                    }}
                                >
                                    All maintenance actions remain the responsibility of appropriately certified personnel and organizations.
                                </p>
                            </div>
                        </div>

                        {/* Section 3: Regulatory Disclaimer */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                padding: "33.6px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                3. Regulatory Disclaimer
                            </h2>
                            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    SkyMaintain is not certified, approved, or endorsed by the FAA, EASA, or any aviation authority.
                                </p>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    Use of SkyMaintain does not relieve users of their regulatory obligations.
                                </p>
                            </div>
                        </div>

                        {/* Section 4: Limitation of Liability */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                padding: "33.6px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                4. Limitation of Liability
                            </h2>
                            <div style={{ marginTop: 40 }}>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    {`SkyMaintain is provided "as-is" for decision-support purposes only. EncycloAMTs LLC shall not be liable for operational decisions made based on platform outputs.`}
                                </p>
                            </div>
                        </div>

                        {/* Section 5: Data Responsibility */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                padding: "33.6px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                5. Data Responsibility
                            </h2>
                            <div style={{ marginTop: 40 }}>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    Users are responsible for ensuring that data entered into SkyMaintain is accurate, authorized, and compliant with applicable regulations.
                                </p>
                            </div>
                        </div>

                        {/* Section 6: Termination */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                padding: "33.6px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                6. Termination
                            </h2>
                            <div style={{ marginTop: 40 }}>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    Accounts may be suspended or terminated for misuse, violation of terms, or unauthorized use.
                                </p>
                            </div>
                        </div>

                        {/* Section 7: Governing Law */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                padding: "33.6px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                7. Governing Law
                            </h2>
                            <div style={{ marginTop: 40 }}>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        lineHeight: "26px",
                                        color: "#364153",
                                        margin: 0,
                                    }}
                                >
                                    These terms are governed by the laws of the United States.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Important Notice Card */}
                    <div
                        style={{
                            backgroundColor: "#fffbeb",
                            border: "1.6px solid #fee685",
                            borderRadius: 14,
                            padding: "33.6px",
                            display: "flex",
                            gap: 16,
                        }}
                    >
                        <img
                            src={imgIconWarning}
                            alt=""
                            style={{ width: 32, height: 32, flexShrink: 0 }}
                        />
                        <div>
                            <h3
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 20,
                                    lineHeight: "28px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                Important Notice
                            </h3>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 16,
                                    lineHeight: "26px",
                                    color: "#364153",
                                    margin: "8px 0 0 0",
                                }}
                            >
                                By using SkyMaintain, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the platform.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        backgroundColor: "#101828",
                        padding: "0 24px",
                        height: 128,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* Logo Row */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: "#155dfc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 8,
                            }}
                        >
                            <img
                                src={imgVectorSmall}
                                alt="SkyMaintain"
                                style={{ width: 20, height: 20, objectFit: "contain" }}
                            />
                        </div>
                        <span
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 18,
                                lineHeight: "28px",
                                color: "#ffffff",
                            }}
                        >
                            SkyMaintain
                        </span>
                    </div>

                    {/* Tagline */}
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: "20px",
                            color: "#99a1af",
                            margin: "16px 0 0 0",
                            textAlign: "center",
                        }}
                    >
                        AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                    </p>

                    {/* Copyright */}
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: "20px",
                            color: "#d1d5dc",
                            margin: "8px 0 0 0",
                            textAlign: "center",
                        }}
                    >
                        © 2026{" "}
                        <span style={{ color: "#51a2ff" }}>SkyMaintain</span>
                        . All Rights Reserved.
                    </p>

                    {/* Product Note */}
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: "20px",
                            color: "#6a7282",
                            margin: "8px 0 0 0",
                            textAlign: "center",
                        }}
                    >
                        SkyMaintain is a product of EncycloAMTs LLC.
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CONTACT_DEMO } from "@/lib/routes";

const GET_STARTED = "/get-started";

// Figma asset URLs for node 40:11874
const imgIconPrivacy = "https://www.figma.com/api/mcp/asset/dca9a5ba-03e2-477a-b2f0-b4b4e083dce7";
const imgIconArrowBlue = "https://www.figma.com/api/mcp/asset/5e0bc1e6-9e5e-431d-9234-b281a9d23bf7";
const imgVectorSmall = "https://www.figma.com/api/mcp/asset/2aeb7f44-d99c-4d7e-b170-e2895a4f3c42";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/3cec6438-5dfd-4710-b1f9-d7e53b1f1f01";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/f6e5a5d2-ef5f-4bbd-9724-6a5319aed60e";

export default function PrivacyPolicyPage(): React.ReactElement {
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

                {/* Nav Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                        }}
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => router.push(GET_STARTED)}
                        style={{
                            height: 36,
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: "none",
                            backgroundColor: "#155dfc",
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: "20px",
                            color: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        Get Started
                        <img
                            src={imgIconArrowWhite}
                            alt=""
                            style={{ width: 16, height: 16 }}
                        />
                    </button>
                </div>
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
                        background: "linear-gradient(161.15deg, #eff6ff 0%, #faf5ff 100%)",
                        padding: "128px 126px 64px",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        {/* Badge */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                backgroundColor: "#155dfc",
                                borderRadius: 26843500,
                                padding: "10px 20px",
                            }}
                        >
                            <img
                                src={imgIconPrivacy}
                                alt=""
                                style={{ width: 20, height: 20 }}
                            />
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 14,
                                    lineHeight: "20px",
                                    color: "#ffffff",
                                }}
                            >
                                Privacy Policy
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
                                marginTop: 64,
                                marginBottom: 0,
                            }}
                        >
                            SkyMaintain Privacy Policy
                        </h1>

                        {/* Dates */}
                        <div style={{ marginTop: 24 }}>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#4a5565",
                                    margin: 0,
                                }}
                            >
                                Effective Date: January 27, 2026
                            </p>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#4a5565",
                                    margin: "8px 0 0 0",
                                }}
                            >
                                Last Updated: January 27, 2026
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "64px 150px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 48,
                    }}
                >
                    {/* Intro Card */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            border: "1.6px solid rgba(0,0,0,0.1)",
                            borderRadius: 14,
                            padding: "41.6px 41.6px 41.6px 41.6px",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: 0,
                            }}
                        >
                            {`SkyMaintain ("SkyMaintain," "we," "us," or "our") respects your privacy and is committed to protecting the personal and operational information you share with us.`}
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "50.4px 0 0 0",
                            }}
                        >
                            SkyMaintain is a product of EncycloAMTs LLC.
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "50.4px 0 0 0",
                            }}
                        >
                            {`This Privacy Policy explains how information is collected, used, disclosed, and protected when you access or use the SkyMaintain platform, website, or related services (collectively, the "Services").`}
                        </p>
                    </div>

                    {/* Section 1: Scope */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            1. Scope of This Policy
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "60px 0 0 0",
                            }}
                        >
                            This Privacy Policy applies to:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16 }}>
                            {[
                                "The SkyMaintain website",
                                "The SkyMaintain SaaS platform",
                                "Trial, demo, and production environments",
                                "Communications with SkyMaintain (email, support, demos)",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
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
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            This policy does not apply to third-party services you may access through integrations.
                        </p>
                    </div>

                    {/* Section 2: Information We Collect */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            2. Information We Collect
                        </h2>

                        {/* 2.1 */}
                        <h3
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 24,
                                lineHeight: "32px",
                                color: "#101828",
                                margin: "60px 0 0 0",
                            }}
                        >
                            2.1 Information You Provide
                        </h3>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            We may collect information you voluntarily provide, including:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16, listStyle: "none" }}>
                            {[
                                "Name",
                                "Business email address",
                                "Organization or company name",
                                "Job title or role",
                                "Support requests and communications",
                                "Account credentials",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#364153",
                                        }}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* 2.2 */}
                        <h3
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 24,
                                lineHeight: "32px",
                                color: "#101828",
                                margin: "32px 0 0 0",
                            }}
                        >
                            2.2 Operational & Platform Data
                        </h3>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            When using the platform, SkyMaintain may process:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16, listStyle: "none" }}>
                            {[
                                "Maintenance records or structured operational data uploaded by users",
                                "System usage data (features accessed, timestamps)",
                                "Configuration preferences",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
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
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            <strong style={{ fontWeight: 700 }}>Important:</strong> SkyMaintain does not require personally identifiable aircraft ownership data unless explicitly provided by the user.
                        </p>

                        {/* 2.3 */}
                        <h3
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 24,
                                lineHeight: "32px",
                                color: "#101828",
                                margin: "32px 0 0 0",
                            }}
                        >
                            2.3 Technical & Log Data
                        </h3>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            We may automatically collect:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16, listStyle: "none" }}>
                            {[
                                "IP address",
                                "Browser type and device information",
                                "Session identifiers",
                                "Security logs and audit logs",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
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
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            This data is used strictly for security, reliability, and platform improvement.
                        </p>
                    </div>

                    {/* Section 3: How We Use Information */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            3. How We Use Information
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "60px 0 0 0",
                            }}
                        >
                            We use collected information to:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16, listStyle: "none" }}>
                            {[
                                "Provide and operate the SkyMaintain platform",
                                "Authenticate users and manage accounts",
                                "Deliver support and respond to inquiries",
                                "Improve system performance and reliability",
                                "Maintain security and prevent misuse",
                                "Meet legal and contractual obligations",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#364153",
                                        }}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 4: AI & Data Use Transparency */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            4. AI & Data Use Transparency
                        </h2>

                        <h3
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 24,
                                lineHeight: "32px",
                                color: "#101828",
                                margin: "60px 0 0 0",
                            }}
                        >
                            4.1 No Autonomous Decision-Making
                        </h3>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            SkyMaintain provides AI-assisted decision support only. The platform does not make autonomous maintenance decisions.
                        </p>

                        <h3
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 24,
                                lineHeight: "32px",
                                color: "#101828",
                                margin: "32px 0 0 0",
                            }}
                        >
                            4.2 No Model Training on Customer Data
                        </h3>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            Customer-provided data is not used to train AI models unless explicitly agreed to in writing.
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            All AI outputs are generated for the specific user environment and are not shared across organizations.
                        </p>
                    </div>

                    {/* Section 5: Data Sharing & Disclosure */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            5. Data Sharing & Disclosure
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "60px 0 0 0",
                            }}
                        >
                            We do not sell personal or operational data.
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            We may share information only in the following circumstances:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16, listStyle: "none" }}>
                            {[
                                "With trusted service providers (hosting, security, infrastructure)",
                                "To comply with legal obligations",
                                "To protect the rights, safety, or security of SkyMaintain, users, or others",
                                "With explicit user consent",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
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
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            All service providers are contractually obligated to protect data confidentiality.
                        </p>
                    </div>

                    {/* Section 6: Data Security */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            6. Data Security
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "60px 0 0 0",
                            }}
                        >
                            SkyMaintain employs reasonable administrative, technical, and organizational safeguards, including:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16, listStyle: "none" }}>
                            {[
                                "Encryption in transit and at rest",
                                "Role-based access controls",
                                "Secure authentication mechanisms",
                                "Audit logging and monitoring",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
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
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            While no system is 100% secure, we actively work to protect your information.
                        </p>
                    </div>

                    {/* Section 7: Data Retention */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            7. Data Retention
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "60px 0 0 0",
                            }}
                        >
                            We retain information only as long as necessary to:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16, listStyle: "none" }}>
                            {[
                                "Provide the Services",
                                "Meet legal, regulatory, or contractual obligations",
                                "Resolve disputes",
                                "Enforce agreements",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
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
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            Users may request deletion of their data, subject to legal or regulatory retention requirements.
                        </p>
                    </div>

                    {/* Section 8: Your Rights & Choices */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            8. Your Rights & Choices
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "60px 0 0 0",
                            }}
                        >
                            Depending on your jurisdiction, you may have the right to:
                        </p>
                        <ul style={{ paddingLeft: 24, marginTop: 16, listStyle: "none" }}>
                            {[
                                "Access your personal data",
                                "Correct inaccurate information",
                                "Request deletion of personal data",
                                "Object to certain processing activities",
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
                                            color: "#155dfc",
                                        }}
                                    >
                                        •
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontWeight: 400,
                                            fontSize: 18,
                                            lineHeight: "28px",
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
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            Requests may be submitted to:
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "8px 0 0 0",
                            }}
                        >
                            📧{" "}
                            <a
                                href="mailto:privacy@skymaintain.ai"
                                style={{ color: "#155dfc", textDecoration: "none" }}
                            >
                                privacy@skymaintain.ai
                            </a>
                        </p>
                    </div>

                    {/* Section 9: Cookies & Tracking */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            9. Cookies & Tracking
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "60px 0 0 0",
                            }}
                        >
                            SkyMaintain may use essential cookies necessary for platform functionality.
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            We do not use third-party advertising trackers at this time.
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            If analytics or optional cookies are introduced, this policy will be updated accordingly.
                        </p>
                    </div>

                    {/* Section 10: International Users */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            10. International Users
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "24px 0 0 0",
                            }}
                        >
                            SkyMaintain is operated from the United States. By using the Services, you consent to the transfer and processing of information in the United States, subject to applicable safeguards.
                        </p>
                    </div>

                    {/* Section 11: Children's Privacy */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            {`11. Children's Privacy`}
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "24px 0 0 0",
                            }}
                        >
                            SkyMaintain is intended for professional use only. We do not knowingly collect data from individuals under 18 years of age.
                        </p>
                    </div>

                    {/* Section 12: Changes to This Policy */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            12. Changes to This Policy
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "24px 0 0 0",
                            }}
                        >
                            We may update this Privacy Policy from time to time. Material changes will be communicated via the platform or website.
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "16px 0 0 0",
                            }}
                        >
                            Continued use of SkyMaintain after updates constitutes acceptance of the revised policy.
                        </p>
                    </div>

                    {/* Section 13: Contact Information */}
                    <div>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            13. Contact Information
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: "24px 0 0 0",
                            }}
                        >
                            For privacy-related inquiries, please contact:
                        </p>

                        {/* Contact Card */}
                        <div
                            style={{
                                backgroundColor: "#eff6ff",
                                border: "0.8px solid #bedbff",
                                borderRadius: 14,
                                padding: "24.8px",
                                marginTop: 24,
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#101828",
                                    margin: 0,
                                }}
                            >
                                SkyMaintain Privacy Team
                            </p>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#364153",
                                    margin: "8px 0 0 0",
                                }}
                            >
                                📧{" "}
                                <a
                                    href="mailto:privacy@skymaintain.ai"
                                    style={{ color: "#155dfc", textDecoration: "none" }}
                                >
                                    privacy@skymaintain.ai
                                </a>
                            </p>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#364153",
                                    margin: "16px 0 0 0",
                                }}
                            >
                                EncycloAMTs LLC
                            </p>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#364153",
                                    margin: "8px 0 0 0",
                                }}
                            >
                                United States
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div
                    style={{
                        background: "linear-gradient(162.41deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                        padding: "96px 126px",
                    }}
                >
                    <div style={{ textAlign: "center", padding: "0 24px" }}>
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 36,
                                lineHeight: "40px",
                                color: "#ffffff",
                                margin: 0,
                            }}
                        >
                            Questions about privacy?
                        </h2>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 20,
                                lineHeight: "28px",
                                color: "#ffffff",
                                opacity: 0.9,
                                margin: "24px 0 0 0",
                            }}
                        >
                            {`We're committed to transparency and protecting your data.`}
                        </p>
                        <div style={{ marginTop: 24 }}>
                            <button
                                onClick={() => router.push(CONTACT_DEMO)}
                                style={{
                                    height: 48,
                                    padding: "0 24px",
                                    borderRadius: 8,
                                    border: "none",
                                    backgroundColor: "#ffffff",
                                    boxShadow: "0px 25px 50px 0px rgba(0,0,0,0.25)",
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#155dfc",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                Contact Us
                                <img
                                    src={imgIconArrowBlue}
                                    alt=""
                                    style={{ width: 20, height: 20 }}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        backgroundColor: "#101828",
                        padding: "24px 24px",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 12,
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
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
                                    fontSize: 20,
                                    lineHeight: "28px",
                                    color: "#ffffff",
                                }}
                            >
                                SkyMaintain
                            </span>
                        </div>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#99a1af",
                                margin: "16px 0 0 0",
                            }}
                        >
                            Regulatory-Compliant AI-Assisted Aircraft Maintenance Decision Support
                        </p>
                    </div>

                    <div
                        style={{
                            borderTop: "0.8px solid #1e2939",
                            marginTop: 24,
                            paddingTop: 24,
                            textAlign: "center",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#d1d5dc",
                                margin: 0,
                            }}
                        >
                            © 2026 SkyMaintain. All rights reserved.
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#51a2ff",
                                margin: "8px 0 0 0",
                            }}
                        >
                            SkyMaintain is a product of EncycloAMTs LLC.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

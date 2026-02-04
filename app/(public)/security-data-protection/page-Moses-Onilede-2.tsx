/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { CONTACT_DEMO } from "@/lib/routes";

// Figma assets from node 39:11398
const imgIconShield = "https://www.figma.com/api/mcp/asset/912ac0c3-487e-45f6-a5ab-5620a4e97a40";
const imgIconPlatformSecurity = "https://www.figma.com/api/mcp/asset/571231bf-2299-448e-909d-ffcd7c5b9a8c";
const imgIconPlatformSecurityAlt = "https://www.figma.com/api/mcp/asset/87aa32f7-1092-455c-8354-c16461c088c0";
const imgIconCheck = "https://www.figma.com/api/mcp/asset/fb38705f-2f79-48a9-a20d-b2fac0ed1e49";
const imgIconOperational = "https://www.figma.com/api/mcp/asset/80d4a3d9-ea03-4e8c-a4c4-7431c581e377";
const imgIconOperationalAlt1 = "https://www.figma.com/api/mcp/asset/2228338c-0c81-47a5-8a15-32f9849021b4";
const imgIconOperationalAlt2 = "https://www.figma.com/api/mcp/asset/72461d0b-5a3a-4cad-a94e-59e68b1f30eb";
const imgIconOperationalAlt3 = "https://www.figma.com/api/mcp/asset/f5ffcc18-f775-43bd-bdd6-a7c67d155e52";
const imgIconCheckAlt = "https://www.figma.com/api/mcp/asset/ac8ffae4-5c10-45fc-8478-685b7b68f449";
const imgIconSecureDev = "https://www.figma.com/api/mcp/asset/a6ccc1bc-1256-4a2e-b5c5-54d532f66e06";
const imgIconSecureDevAlt = "https://www.figma.com/api/mcp/asset/a8c2ef5a-8e81-4161-8bc3-5494f90f7634";
const imgIconKey = "https://www.figma.com/api/mcp/asset/5469ab5b-ec85-4146-a7e5-e17fa08c1bf6";
const imgIconArrowBlue = "https://www.figma.com/api/mcp/asset/7713a94d-fb3b-4967-b60c-b72bf280c53b";
const imgVector = "https://www.figma.com/api/mcp/asset/8f86ebf5-a9f3-40da-9ad8-f6db9cf85376";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/9ff37364-4f68-4c0a-b40a-7829242fffa6";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/e9b1d313-aa74-4e6c-9b97-b0321386dff7";

type SecurityColumn = {
    heading: string;
    bullets: string[];
};

const SECURITY_COLUMNS: SecurityColumn[] = [
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
        bullets: [
            "Secure development lifecycle principles",
            "Regular system monitoring",
            "Ongoing platform improvement",
        ],
    },
];

function SecurityCard({ column, index }: { column: SecurityColumn; index: number }) {
    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                border: "1.6px solid rgba(0,0,0,0.1)",
                borderRadius: 14,
                padding: "33.6px 33.6px 1.6px 33.6px",
                width: 345,
                height: 423,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 48,
            }}
        >
            {/* Icon */}
            <div style={{ width: 48, height: 48 }}>
                {index === 0 && (
                    <div style={{ position: "relative", width: 48, height: 48 }}>
                        <div
                            style={{
                                position: "absolute",
                                top: "8.33%",
                                left: "8.33%",
                                right: "8.33%",
                                bottom: "58.33%",
                                display: "flex",
                            }}
                        >
                            <img src={imgIconPlatformSecurity} alt="" style={{ width: "100%", height: "100%" }} />
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                top: "58.33%",
                                left: "8.33%",
                                right: "8.33%",
                                bottom: "8.33%",
                                display: "flex",
                            }}
                        >
                            <img src={imgIconPlatformSecurity} alt="" style={{ width: "100%", height: "100%" }} />
                        </div>
                    </div>
                )}
                {index === 1 && (
                    <div style={{ position: "relative", width: 48, height: 48 }}>
                        <img src={imgIconOperational} alt="" style={{ width: 32, height: 40, marginTop: 4, marginLeft: 8 }} />
                    </div>
                )}
                {index === 2 && (
                    <div style={{ position: "relative", width: 48, height: 48 }}>
                        <img src={imgIconSecureDev} alt="" style={{ width: 36, height: 22, marginTop: 22, marginLeft: 6 }} />
                        <img src={imgIconSecureDevAlt} alt="" style={{ position: "absolute", top: 4, left: 14, width: 20, height: 18 }} />
                    </div>
                )}
            </div>

            {/* Title */}
            <h3
                style={{
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 24,
                    lineHeight: "32px",
                    color: "#101828",
                    margin: 0,
                }}
            >
                {column.heading}
            </h3>

            {/* Bullets */}
            <ul
                style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                }}
            >
                {column.bullets.map((bullet, bulletIndex) => (
                    <li
                        key={bulletIndex}
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                        }}
                    >
                        <img
                            src={index === 0 ? imgIconCheck : imgIconCheckAlt}
                            alt=""
                            style={{
                                width: 20,
                                height: 20,
                                marginTop: 2,
                                flexShrink: 0,
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 16,
                                lineHeight: "24px",
                                color: "#364153",
                            }}
                        >
                            {bullet}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function SecurityDataProtectionPage() {
    const router = useRouter();

    function handleBackToHome() {
        router.push("/");
    }

    function handleGetStarted() {
        router.push("/get-started");
    }

    function handleStartFreeTrial() {
        router.push("/get-started");
    }

    function handleScheduleDemo() {
        router.push(CONTACT_DEMO);
    }

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#ffffff",
            }}
        >
            {/* Main Content Container */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 1148,
                    margin: "0 auto",
                    backgroundColor: "#ffffff",
                }}
            >
                {/* Hero Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 498.6,
                        paddingTop: 128,
                        paddingLeft: 126,
                        paddingRight: 126,
                        boxSizing: "border-box",
                        background: "linear-gradient(157deg, #eff6ff 0%, #faf5ff 100%)",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: 896,
                            margin: "0 auto",
                            textAlign: "center",
                        }}
                    >
                        {/* Shield Icon */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 24,
                            }}
                        >
                            <img
                                src={imgIconShield}
                                alt="Security"
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
                                padding: "8.8px 16px",
                                height: 41.6,
                                boxSizing: "border-box",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 14,
                                    lineHeight: "20px",
                                    color: "#ffffff",
                                    textAlign: "center",
                                }}
                            >
                                Security & Data Protection
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 48,
                                lineHeight: "48px",
                                color: "#101828",
                                textAlign: "center",
                                marginTop: 24,
                                marginBottom: 0,
                            }}
                        >
                            Security & Data Protection
                        </h1>

                        {/* Subheadline */}
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 20,
                                lineHeight: "32.5px",
                                color: "#4a5565",
                                textAlign: "center",
                                marginTop: 24,
                                marginBottom: 0,
                                maxWidth: 728,
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            SkyMaintain is designed with security-first principles to support enterprise aviation environments.
                        </p>
                    </div>
                </section>

                {/* Security Cards Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 788,
                        backgroundColor: "#ffffff",
                        paddingTop: 80,
                        paddingLeft: 24,
                        paddingRight: 24,
                        paddingBottom: 64,
                        boxSizing: "border-box",
                    }}
                >
                    {/* Cards Grid */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 32,
                            flexWrap: "wrap",
                            maxWidth: 1100,
                            margin: "0 auto",
                        }}
                    >
                        {SECURITY_COLUMNS.map((column, index) => (
                            <SecurityCard key={index} column={column} index={index} />
                        ))}
                    </div>

                    {/* Info Card */}
                    <div
                        style={{
                            marginTop: 64,
                            maxWidth: 1100,
                            marginLeft: "auto",
                            marginRight: "auto",
                            backgroundColor: "#eff6ff",
                            border: "1.6px solid #bedbff",
                            borderRadius: 14,
                            padding: "41.6px 41.6px 1.6px 41.6px",
                            boxSizing: "border-box",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                textAlign: "center",
                                margin: 0,
                            }}
                        >
                            SkyMaintain is designed to support aviation safety and data protection requirements, while recognizing the sensitive nature of maintenance information.
                        </p>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 392,
                        paddingTop: 96,
                        paddingLeft: 126,
                        paddingRight: 126,
                        boxSizing: "border-box",
                        background: "linear-gradient(161deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            maxWidth: 848,
                            margin: "0 auto",
                        }}
                    >
                        {/* Key Icon */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 24,
                            }}
                        >
                            <img
                                src={imgIconKey}
                                alt="Security Key"
                                style={{ width: 64, height: 64 }}
                            />
                        </div>

                        {/* CTA Headline */}
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 36,
                                lineHeight: "40px",
                                color: "#ffffff",
                                textAlign: "center",
                                margin: 0,
                            }}
                        >
                            Enterprise-grade security for aviation operations
                        </h2>

                        {/* CTA Buttons */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 16,
                                marginTop: 24,
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Start Your Free Trial Button */}
                            <button
                                type="button"
                                onClick={handleStartFreeTrial}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    backgroundColor: "#ffffff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "10px 24px",
                                    height: 48,
                                    minWidth: 227,
                                    boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                    cursor: "pointer",
                                    transition: "opacity 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.95")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                <span
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 18,
                                        lineHeight: "28px",
                                        color: "#155dfc",
                                        textAlign: "center",
                                    }}
                                >
                                    Start Your Free Trial
                                </span>
                                <img
                                    src={imgIconArrowBlue}
                                    alt=""
                                    style={{ width: 20, height: 20 }}
                                />
                            </button>

                            {/* Schedule a Demo Button */}
                            <button
                                type="button"
                                onClick={handleScheduleDemo}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#ffffff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "12px 40px",
                                    height: 48,
                                    minWidth: 222,
                                    boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                    cursor: "pointer",
                                    transition: "opacity 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.95")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                <span
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 18,
                                        lineHeight: "28px",
                                        color: "#155dfc",
                                        textAlign: "center",
                                    }}
                                >
                                    Schedule a Demo
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer
                    style={{
                        width: "100%",
                        height: 128,
                        backgroundColor: "#101828",
                        paddingTop: 0,
                        paddingLeft: 24,
                        paddingRight: 24,
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 1100,
                            margin: "0 auto",
                            textAlign: "center",
                        }}
                    >
                        {/* Logo Row */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                height: 36,
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    backgroundColor: "#155dfc",
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 8,
                                    boxSizing: "border-box",
                                }}
                            >
                                <img
                                    src={imgVector}
                                    alt="SkyMaintain"
                                    style={{ width: 20, height: 20 }}
                                />
                            </div>
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#ffffff",
                                    textAlign: "center",
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
                                textAlign: "center",
                                marginTop: 16,
                                marginBottom: 0,
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
                                textAlign: "center",
                                marginTop: 8,
                                marginBottom: 0,
                            }}
                        >
                            © 2026{" "}
                            <span style={{ color: "#51a2ff" }}>SkyMaintain</span>
                            . All Rights Reserved.
                        </p>

                        {/* EncycloAMTs */}
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#6a7282",
                                textAlign: "center",
                                marginTop: 8,
                                marginBottom: 0,
                            }}
                        >
                            SkyMaintain is a product of EncycloAMTs LLC.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Fixed Header */}
            <header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)",
                    height: 80.8,
                    paddingTop: 16,
                    paddingBottom: 0.8,
                    paddingLeft: 24,
                    paddingRight: 24,
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        maxWidth: 1148,
                        margin: "0 auto",
                        height: 48,
                    }}
                >
                    {/* Logo */}
                    <button
                        type="button"
                        onClick={handleBackToHome}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 10,
                                boxSizing: "border-box",
                            }}
                        >
                            <img
                                src={imgVectorLarge}
                                alt="SkyMaintain"
                                style={{ width: 28, height: 28 }}
                            />
                        </div>
                        <div>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    textAlign: "center",
                                    margin: 0,
                                }}
                            >
                                SkyMaintain
                            </p>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 12,
                                    lineHeight: "16px",
                                    color: "#4a5565",
                                    textAlign: "center",
                                    margin: 0,
                                }}
                            >
                                Regulatory-Compliant AI Platform
                            </p>
                        </div>
                    </button>

                    {/* Right Buttons */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        {/* Back to Home */}
                        <button
                            type="button"
                            onClick={handleBackToHome}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "transparent",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 16px",
                                height: 36,
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 14,
                                    lineHeight: "20px",
                                    color: "#364153",
                                    textAlign: "center",
                                }}
                            >
                                Back to Home
                            </span>
                        </button>

                        {/* Get Started */}
                        <button
                            type="button"
                            onClick={handleGetStarted}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                                backgroundColor: "#155dfc",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 16px",
                                height: 36,
                                cursor: "pointer",
                                transition: "opacity 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 14,
                                    lineHeight: "20px",
                                    color: "#ffffff",
                                    textAlign: "center",
                                }}
                            >
                                Get Started
                            </span>
                            <img
                                src={imgIconArrowWhite}
                                alt=""
                                style={{ width: 16, height: 16 }}
                            />
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}

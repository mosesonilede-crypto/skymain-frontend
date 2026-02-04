/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";

// Figma assets from node 40:11668
const imgIconMaintenance = "https://www.figma.com/api/mcp/asset/4949406c-f52f-4ca3-8f12-5e5de2133020";
const imgIconSafety = "https://www.figma.com/api/mcp/asset/6aec631a-063d-43b7-9af0-3c48345c6016";
const imgIconData = "https://www.figma.com/api/mcp/asset/38436f22-e02a-444b-b92a-34e42470d7c1";
const imgIconProduct = "https://www.figma.com/api/mcp/asset/090fd11b-f90e-4cf2-837a-bf6c64b7a803";
const imgIconMail = "https://www.figma.com/api/mcp/asset/7a3ba1f3-6711-4f94-bcec-a47b70e3ecc1";
const imgIconMailSmall = "https://www.figma.com/api/mcp/asset/d442fa81-e232-4c87-9cb2-97c84f7f0050";
const imgVector = "https://www.figma.com/api/mcp/asset/4e579b78-4875-4847-bc08-24db4722dedc";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/1b216ab1-b5d8-4074-9f36-3d161e4f4673";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/82dc0500-0229-4912-b107-f30e9e999421";

type AreaOfInterest = {
    id: string;
    title: string;
    icon: string;
};

const AREAS: AreaOfInterest[] = [
    { id: "maintenance", title: "Aircraft Maintenance & Engineering", icon: imgIconMaintenance },
    { id: "safety", title: "Aviation Safety & Compliance", icon: imgIconSafety },
    { id: "data", title: "Data & AI Systems", icon: imgIconData },
    { id: "product", title: "Product, UX, and Platform Design", icon: imgIconProduct },
];

function AreaCard({ area, position }: { area: AreaOfInterest; position: "left" | "right" }) {
    return (
        <div
            style={{
                position: "absolute",
                left: position === "left" ? 0 : 500,
                width: 476,
                height: 107.2,
                backgroundColor: "#ffffff",
                border: "1.6px solid rgba(0,0,0,0.1)",
                borderRadius: 14,
                paddingTop: 33.6,
                paddingLeft: 33.6,
                paddingRight: 33.6,
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    height: 40,
                }}
            >
                <img
                    src={area.icon}
                    alt=""
                    style={{ width: 40, height: 40 }}
                />
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
                    {area.title}
                </h3>
            </div>
        </div>
    );
}

export default function CareersPage() {
    const router = useRouter();

    function handleBackToHome() {
        router.push("/");
    }

    function handleGetStarted() {
        router.push("/get-started");
    }

    function handleEmailClick() {
        window.location.href = "mailto:careers@skymaintain.ai";
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
                        minHeight: 394.6,
                        paddingTop: 128,
                        paddingLeft: 126,
                        paddingRight: 126,
                        boxSizing: "border-box",
                        background: "linear-gradient(161deg, #eff6ff 0%, #faf5ff 100%)",
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
                        {/* Careers Badge */}
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
                                Careers
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
                                marginTop: 65.6,
                                marginBottom: 0,
                            }}
                        >
                            Careers at SkyMaintain
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
                                maxWidth: 742,
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            SkyMaintain is building the next generation of AI-assisted decision-support tools for aviation maintenance professionals.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 1137.688,
                        backgroundColor: "#ffffff",
                        paddingTop: 80,
                        paddingLeft: 86,
                        paddingRight: 86,
                        boxSizing: "border-box",
                    }}
                >
                    {/* Blue Info Card */}
                    <div
                        style={{
                            width: "100%",
                            minHeight: 141.7,
                            backgroundColor: "#eff6ff",
                            border: "1.6px solid rgba(0,0,0,0.1)",
                            borderRadius: 14,
                            paddingTop: 41.6,
                            paddingLeft: 41.6,
                            paddingRight: 41.6,
                            paddingBottom: 41.6,
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
                                maxWidth: 869,
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            While we are a growing platform, we are always interested in connecting with individuals who share a passion for aviation safety, engineering excellence, and responsible technology development.
                        </p>
                    </div>

                    {/* Areas of Interest Section */}
                    <div style={{ marginTop: 64 }}>
                        {/* Section Title */}
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#101828",
                                textAlign: "center",
                                margin: 0,
                            }}
                        >
                            Areas of Interest
                        </h2>

                        {/* Areas Grid */}
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: 238.4,
                                marginTop: 32,
                            }}
                        >
                            {/* Top Row */}
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                                <AreaCard area={AREAS[0]} position="left" />
                                <AreaCard area={AREAS[1]} position="right" />
                            </div>

                            {/* Bottom Row */}
                            <div style={{ position: "absolute", top: 131.2, left: 0, right: 0 }}>
                                <AreaCard area={AREAS[2]} position="left" />
                                <AreaCard area={AREAS[3]} position="right" />
                            </div>
                        </div>
                    </div>

                    {/* Get in Touch Card */}
                    <div
                        style={{
                            marginTop: 64,
                            width: "100%",
                            minHeight: 401.587,
                            background: "linear-gradient(158deg, #155dfc 0%, #9810fa 100%)",
                            border: "0.8px solid rgba(0,0,0,0.1)",
                            borderRadius: 14,
                            position: "relative",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Mail Icon */}
                        <div
                            style={{
                                position: "absolute",
                                top: 48,
                                left: "50%",
                                transform: "translateX(-50%)",
                            }}
                        >
                            <img
                                src={imgIconMail}
                                alt=""
                                style={{ width: 64, height: 64 }}
                            />
                        </div>

                        {/* Title */}
                        <h2
                            style={{
                                position: "absolute",
                                top: 160,
                                left: 48,
                                right: 48,
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 30,
                                lineHeight: "36px",
                                color: "#ffffff",
                                textAlign: "center",
                                margin: 0,
                            }}
                        >
                            Get in Touch
                        </h2>

                        {/* Subtitle */}
                        <p
                            style={{
                                position: "absolute",
                                top: 236,
                                left: 48,
                                right: 48,
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 20,
                                lineHeight: "28px",
                                color: "#dbeafe",
                                textAlign: "center",
                                margin: 0,
                            }}
                        >
                            Interested in joining our team or learning more about opportunities?
                        </p>

                        {/* Email Link */}
                        <button
                            type="button"
                            onClick={handleEmailClick}
                            style={{
                                position: "absolute",
                                top: 320,
                                left: 48,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <img
                                src={imgIconMailSmall}
                                alt=""
                                style={{ width: 24, height: 24 }}
                            />
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#ffffff",
                                    textAlign: "center",
                                }}
                            >
                                careers@skymaintain.ai
                            </span>
                        </button>
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

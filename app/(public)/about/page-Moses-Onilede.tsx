/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { CONTACT_DEMO } from "@/lib/routes";

// Figma assets from node 40:11557
const imgIconMission = "https://www.figma.com/api/mcp/asset/502f640a-66ce-4dff-ae32-93840d3df2ee";
const imgIconApproach = "https://www.figma.com/api/mcp/asset/715ef24a-3c35-428e-b4d5-2777cd11dbea";
const imgIconCheckGreen = "https://www.figma.com/api/mcp/asset/1cece772-5933-4963-b12a-c3efc74925a9";
const imgIconArrowBlue = "https://www.figma.com/api/mcp/asset/009219eb-e45f-436a-9f0b-7ecc801adc39";
const imgVector = "https://www.figma.com/api/mcp/asset/84b41b81-b38e-4d59-a70d-5bdf875afdd9";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/c7679f54-450d-4559-a8e7-429635e6cc0a";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/97d59403-b044-40ac-8065-f2794dd83986";

const APPROACH_BULLETS = [
    "Human-in-the-loop design",
    "Regulatory-aware architecture",
    "Practical, operationally grounded insights",
    "Continuous improvement driven by industry feedback",
];

export default function AboutPage() {
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
                        minHeight: 427.1,
                        paddingTop: 128,
                        paddingLeft: 126,
                        paddingRight: 126,
                        boxSizing: "border-box",
                        background: "linear-gradient(160deg, #eff6ff 0%, #faf5ff 100%)",
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
                        {/* About Us Badge */}
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
                                About Us
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
                            About SkyMaintain
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
                                maxWidth: 763,
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            SkyMaintain is an AI-assisted aircraft maintenance decision-support platform designed to enhance safety, efficiency, and regulatory alignment in aviation maintenance operations.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 993.1,
                        backgroundColor: "#ffffff",
                        paddingTop: 80,
                        paddingLeft: 86,
                        paddingRight: 86,
                        boxSizing: "border-box",
                    }}
                >
                    {/* EncycloAMTs Card */}
                    <div
                        style={{
                            width: "100%",
                            minHeight: 240.2,
                            background: "linear-gradient(166deg, #eff6ff 0%, #faf5ff 100%)",
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
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                margin: 0,
                            }}
                        >
                            <span style={{ fontWeight: 700, color: "#101828" }}>
                                SkyMaintain is a product of EncycloAMTs LLC
                            </span>
                            , an aviation technology and training company focused on advancing maintenance knowledge, decision support, and workforce capability.
                        </p>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "29.25px",
                                color: "#364153",
                                marginTop: 40,
                                marginBottom: 0,
                            }}
                        >
                            Built by professionals with deep experience in aircraft maintenance, engineering, logistics, and regulatory environments, SkyMaintain bridges operational expertise with modern AI-driven analytics.
                        </p>
                    </div>

                    {/* Our Mission Section */}
                    <div style={{ marginTop: 48 }}>
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                height: 40,
                            }}
                        >
                            <img
                                src={imgIconMission}
                                alt=""
                                style={{ width: 40, height: 40 }}
                            />
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
                                Our Mission
                            </h2>
                        </div>

                        {/* Mission Card */}
                        <div
                            style={{
                                marginTop: 24,
                                width: "100%",
                                minHeight: 125.7,
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                paddingTop: 33.6,
                                paddingLeft: 33.6,
                                paddingRight: 33.6,
                                paddingBottom: 33.6,
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
                                    margin: 0,
                                    maxWidth: 880,
                                }}
                            >
                                To support aircraft maintenance professionals with intelligent tools that enhance human decision-making while respecting regulatory boundaries.
                            </p>
                        </div>
                    </div>

                    {/* Our Approach Section */}
                    <div style={{ marginTop: 48 }}>
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                height: 40,
                            }}
                        >
                            <img
                                src={imgIconApproach}
                                alt=""
                                style={{ width: 40, height: 40 }}
                            />
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
                                Our Approach
                            </h2>
                        </div>

                        {/* Approach Card */}
                        <div
                            style={{
                                marginTop: 24,
                                width: "100%",
                                minHeight: 227.2,
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 14,
                                paddingTop: 33.6,
                                paddingLeft: 33.6,
                                paddingRight: 33.6,
                                paddingBottom: 33.6,
                                boxSizing: "border-box",
                            }}
                        >
                            <ul
                                style={{
                                    listStyle: "none",
                                    margin: 0,
                                    padding: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 16,
                                }}
                            >
                                {APPROACH_BULLETS.map((bullet, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 12,
                                            height: 28,
                                        }}
                                    >
                                        <img
                                            src={imgIconCheckGreen}
                                            alt=""
                                            style={{
                                                width: 24,
                                                height: 24,
                                                marginTop: 2,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontFamily: "Arial, sans-serif",
                                                fontWeight: 400,
                                                fontSize: 18,
                                                lineHeight: "28px",
                                                color: "#364153",
                                            }}
                                        >
                                            {bullet}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 304,
                        paddingTop: 96,
                        paddingLeft: 126,
                        paddingRight: 126,
                        boxSizing: "border-box",
                        background: "linear-gradient(165deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            maxWidth: 848,
                            margin: "0 auto",
                            padding: "0 24px",
                        }}
                    >
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
                            Join us in advancing aviation maintenance
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

"use client";
/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 39:10912
 * nodeName: Contact SkyMaintain
 * Figma URL: https://www.figma.com/design/qz3ERP8jfbTpTHQrdPSawI/SkyMaintain-Design?node-id=39-10912
 */

import { useRouter } from "next/navigation";
import { CONTACT_DEMO, CONTACT_GENERAL } from "@/lib/routes";

// Figma asset URLs
const imgIconChat = "https://www.figma.com/api/mcp/asset/cc8618ac-6a54-4d2b-956a-7dc973862fa9";
const imgIconEmail = "https://www.figma.com/api/mcp/asset/881b98b6-d0a4-4fa4-a9e0-75bd4b5af9ef";
const imgIconEnvelope = "https://www.figma.com/api/mcp/asset/cd453d62-78c9-44e0-8087-5e0012248060";
const imgIconBriefcase = "https://www.figma.com/api/mcp/asset/ead6040e-05fb-434e-ac15-40066be9fef1";
const imgVectorLogo = "https://www.figma.com/api/mcp/asset/527b5d4c-0011-4788-a0b9-c81507e2a4d0";
const imgVectorLogoHeader = "https://www.figma.com/api/mcp/asset/ca88c7b6-dce8-4252-8bcf-9117d093d40b";
const imgIconArrow = "https://www.figma.com/api/mcp/asset/78c44eac-b65c-4e1d-a294-729d60af767c";

export default function ContactSkyMaintainPage() {
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
                {/* Hero Section - 362.1px */}
                <section
                    style={{
                        height: "362.1px",
                        background: "linear-gradient(162.5deg, #eff6ff 0%, #faf5ff 100%)",
                        padding: "128px 126px 0 126px",
                    }}
                >
                    <div style={{ width: "100%", maxWidth: "896px", margin: "0 auto", textAlign: "center" }}>
                        {/* Badge */}
                        <div
                            style={{
                                display: "inline-block",
                                backgroundColor: "#155dfc",
                                borderRadius: "8px",
                                padding: "8.8px 16px",
                                marginBottom: "24px",
                            }}
                        >
                            <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "#ffffff" }}>
                                Contact Us
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
                            }}
                        >
                            Contact SkyMaintain
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
                            }}
                        >
                            We'd love to hear from you.
                        </p>
                    </div>
                </section>

                {/* Contact Cards Section - 575.188px */}
                <section
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "80px 24px",
                        minHeight: "575.188px",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "32px",
                            maxWidth: "1100px",
                            margin: "0 auto",
                        }}
                    >
                        {/* Card 1: General Inquiries */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: "14px",
                                padding: "32px",
                                minHeight: "351.188px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ width: "48px", height: "48px", marginBottom: "48px" }}>
                                <img src={imgIconChat} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            </div>
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    lineHeight: "32px",
                                    color: "#101828",
                                    textAlign: "center",
                                    margin: "0 0 36px 0",
                                }}
                            >
                                General Inquiries
                            </h2>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    color: "#4a5565",
                                    textAlign: "center",
                                    margin: "0 0 48px 0",
                                }}
                            >
                                Questions about SkyMaintain or general information
                            </p>
                            <a
                                href="mailto:contact@skymaintain.ai"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    textDecoration: "none",
                                    marginTop: "auto",
                                }}
                            >
                                <img src={imgIconEmail} alt="" style={{ width: "16px", height: "16px" }} />
                                <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "16px", lineHeight: "24px", color: "#155dfc" }}>
                                    contact@skymaintain.ai
                                </span>
                            </a>
                        </div>

                        {/* Card 2: Support */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: "14px",
                                padding: "32px",
                                minHeight: "351.188px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ width: "48px", height: "48px", marginBottom: "48px" }}>
                                <img src={imgIconEnvelope} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            </div>
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    lineHeight: "32px",
                                    color: "#101828",
                                    textAlign: "center",
                                    margin: "0 0 36px 0",
                                }}
                            >
                                Support
                            </h2>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    color: "#4a5565",
                                    textAlign: "center",
                                    margin: "0 0 48px 0",
                                }}
                            >
                                Technical support and customer assistance
                            </p>
                            <a
                                href="mailto:support@skymaintain.ai"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    textDecoration: "none",
                                    marginTop: "auto",
                                }}
                            >
                                <img src={imgIconEmail} alt="" style={{ width: "16px", height: "16px" }} />
                                <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "16px", lineHeight: "24px", color: "#155dfc" }}>
                                    support@skymaintain.ai
                                </span>
                            </a>
                        </div>

                        {/* Card 3: Business & Partnerships */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: "14px",
                                padding: "32px",
                                minHeight: "351.188px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ width: "48px", height: "48px", marginBottom: "48px" }}>
                                <img src={imgIconBriefcase} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            </div>
                            <h2
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    lineHeight: "32px",
                                    color: "#101828",
                                    textAlign: "center",
                                    margin: "0 0 36px 0",
                                }}
                            >
                                Business & Partnerships
                            </h2>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    color: "#4a5565",
                                    textAlign: "center",
                                    margin: "0 0 48px 0",
                                }}
                            >
                                Partnership opportunities and business inquiries
                            </p>
                            <a
                                href="mailto:partnerships@skymaintain.ai"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    textDecoration: "none",
                                    marginTop: "auto",
                                }}
                            >
                                <img src={imgIconEmail} alt="" style={{ width: "16px", height: "16px" }} />
                                <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "16px", lineHeight: "24px", color: "#155dfc" }}>
                                    partnerships@skymaintain.ai
                                </span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* CTA Section - 304px */}
                <section
                    style={{
                        height: "304px",
                        background: "linear-gradient(165.2deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                        padding: "96px 126px 96px 126px",
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
                        Ready to get started?
                    </h2>

                    <div style={{ display: "flex", gap: "16px" }}>
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
                                Request a Demo
                            </span>
                        </button>
                        <button
                            onClick={() => router.push(CONTACT_GENERAL)}
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
                                Contact Us
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

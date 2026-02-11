import { ImageResponse } from "next/og";
export const alt = "SkyMaintain - AI-Powered Aircraft Maintenance Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    padding: "60px 80px",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                {/* Logo and Title */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    {/* Shield with checkmark */}
                    <svg width="100" height="120" viewBox="0 0 100 130" fill="none">
                        <path d="M50 0L100 25V60C100 90 75 115 50 130C25 115 0 90 0 60V25L50 0Z" fill="#3b82f6" />
                        <path d="M50 10L90 30V58C90 82 70 102 50 115C30 102 10 82 10 58V30L50 10Z" fill="#1e40af" />
                        <path d="M25 60L42 77L75 44" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span style={{ fontSize: "72px", fontWeight: "700", color: "white" }}>
                        SkyMaintain
                    </span>
                </div>

                {/* Tagline */}
                <div style={{ fontSize: "36px", color: "#94a3b8", marginTop: "32px" }}>
                    AI-Powered Aircraft Maintenance Intelligence
                </div>

                {/* Features */}
                <div style={{ display: "flex", gap: "20px", marginTop: "48px" }}>
                    <div style={{
                        background: "rgba(59, 130, 246, 0.2)",
                        color: "#60a5fa",
                        padding: "12px 28px",
                        borderRadius: "24px",
                        fontSize: "18px",
                    }}>
                        FAA Compliant
                    </div>
                    <div style={{
                        background: "rgba(34, 197, 94, 0.2)",
                        color: "#4ade80",
                        padding: "12px 28px",
                        borderRadius: "24px",
                        fontSize: "18px",
                    }}>
                        EASA Certified
                    </div>
                    <div style={{
                        background: "rgba(168, 85, 247, 0.2)",
                        color: "#c084fc",
                        padding: "12px 28px",
                        borderRadius: "24px",
                        fontSize: "18px",
                    }}>
                        Predictive Analytics
                    </div>
                </div>

                {/* Domain */}
                <div style={{ fontSize: "24px", color: "#64748b", marginTop: "auto" }}>
                    skymaintain.ai
                </div>
            </div>
        ),
        { ...size }
    );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CONTACT_DEMO } from "@/lib/routes";

// Figma asset URLs for node 39:10565
const imgIcon = "https://www.figma.com/api/mcp/asset/b70c7f7e-06e7-4ec2-b0fa-6d2799ed72ec";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/a554a9f0-4258-4ed9-b209-7fa3e9917dd2";
const imgVector = "https://www.figma.com/api/mcp/asset/a3ec0081-df3c-4d9a-a6d2-06fe100b849c";
const imgVector1 = "https://www.figma.com/api/mcp/asset/59ebbcdf-b79a-4eee-b0d9-28a0474697bd";
const imgVector2 = "https://www.figma.com/api/mcp/asset/2e72b2d3-70cd-405a-b370-6b692fb9ffe6";
const imgVector3 = "https://www.figma.com/api/mcp/asset/50718dd1-4dc1-46ae-971a-b2d1448f50b3";
const imgVector4 = "https://www.figma.com/api/mcp/asset/5fa4facb-c708-47ee-b15a-bacfd745ae0c";
const imgVector5 = "https://www.figma.com/api/mcp/asset/dd3fecf2-81f3-4ca4-a798-11e991c4c635";
const imgVector6 = "https://www.figma.com/api/mcp/asset/e9608c39-0e31-4e50-9bfb-5432eb2c3ad8";
const imgVector7 = "https://www.figma.com/api/mcp/asset/986f1d6d-c91f-4442-984a-4d6868efe8dc";
const imgVector8 = "https://www.figma.com/api/mcp/asset/4e3fc4ad-8805-4447-ac6d-dff810567641";
const imgIcon2 = "https://www.figma.com/api/mcp/asset/d878af81-0a9e-4522-886f-452a748fd781";
const imgIcon3 = "https://www.figma.com/api/mcp/asset/f8792ecd-9f96-49d9-ad0f-0e153d9e74f0";
const imgIcon4 = "https://www.figma.com/api/mcp/asset/55240eb8-814d-43fc-aed3-a75df729deba";
const imgIcon5 = "https://www.figma.com/api/mcp/asset/1bfa600e-7509-4642-ade2-197ff2ad129e";
const imgIcon6 = "https://www.figma.com/api/mcp/asset/6b4038ec-b0b5-4766-8fbd-1f08ac4f0aba";
const imgIcon7 = "https://www.figma.com/api/mcp/asset/2831f041-39e0-40e4-990f-effa6971d899";
const imgIcon8 = "https://www.figma.com/api/mcp/asset/9555d71a-877f-4394-ac19-8041f279608a";
const imgIcon9 = "https://www.figma.com/api/mcp/asset/18bd3007-3b7f-415a-9c41-5389566664a9";
const imgIcon10 = "https://www.figma.com/api/mcp/asset/0d7425b9-af3e-4817-a208-bd8515434e9b";
const imgVector9 = "https://www.figma.com/api/mcp/asset/1ac7a971-6f8a-472b-b4c3-d1023488ba0e";
const imgVector10 = "https://www.figma.com/api/mcp/asset/d9c20a54-d090-4e4c-816a-dd62898c5dd8";
const imgIcon11 = "https://www.figma.com/api/mcp/asset/3500639d-9951-4391-8a2f-90ce8dfb13d7";
const imgIcon12 = "https://www.figma.com/api/mcp/asset/ed61789d-e109-466b-b099-65dfe00cbf75";

export default function RegulatoryComplianceAutomationPage(): React.ReactElement {
    const router = useRouter();

    return (
        <div className="relative min-h-screen w-full" style={{ backgroundColor: "#ffffff" }}>
            {/* Fixed Header - 80.8px */}
            <header
                className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6"
                style={{
                    height: "80.8px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px 0px rgba(0,0,0,0.1)",
                }}
            >
                <Link href="/" className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center rounded-[14px]"
                        style={{
                            width: "48px",
                            height: "48px",
                            background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                            boxShadow: "0px 10px 15px 0px rgba(0,0,0,0.1), 0px 4px 6px 0px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div className="relative" style={{ width: "28px", height: "28px" }}>
                            <Image alt="Logo" src={imgVector10} width={28} height={28} unoptimized className="size-full object-contain" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span
                            className="font-bold text-center"
                            style={{ fontSize: "24px", lineHeight: "32px", color: "#101828" }}
                        >
                            SkyMaintain
                        </span>
                        <span
                            className="text-center"
                            style={{ fontSize: "12px", lineHeight: "16px", color: "#4a5565" }}
                        >
                            Regulatory-Compliant AI Platform
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 rounded-lg px-3"
                        style={{ height: "36px" }}
                    >
                        <Image alt="Back" src={imgIcon11} width={16} height={16} unoptimized style={{ width: "16px", height: "16px" }} />
                        <span style={{ fontSize: "14px", lineHeight: "20px", color: "#364153" }}>Back</span>
                    </button>
                    <Link
                        href="/get-started"
                        className="flex items-center gap-2 rounded-lg px-3"
                        style={{ height: "36px", backgroundColor: "#155dfc" }}
                    >
                        <span className="text-white" style={{ fontSize: "14px", lineHeight: "20px" }}>
                            Get Started
                        </span>
                        <Image alt="Arrow" src={imgIcon12} width={16} height={16} unoptimized style={{ width: "16px", height: "16px" }} />
                    </Link>
                </div>
            </header>

            {/* Main Content - starts after header */}
            <main style={{ paddingTop: "80.8px" }}>
                {/* Hero Section - 455.6px */}
                <section
                    className="flex flex-col items-center px-16"
                    style={{
                        height: "455.6px",
                        paddingTop: "128px",
                        background: "linear-gradient(158.35deg, #f0fdf4 0%, #eff6ff 50%, #ecfdf5 100%)",
                    }}
                >
                    {/* Badge */}
                    <div
                        className="flex items-center justify-center rounded-lg overflow-hidden"
                        style={{
                            width: "269.413px",
                            height: "41.6px",
                            backgroundColor: "#00a63e",
                        }}
                    >
                        <span
                            className="text-center text-white"
                            style={{ fontSize: "14px", lineHeight: "20px" }}
                        >
                            Regulatory Compliance Automation
                        </span>
                    </div>

                    {/* Heading */}
                    <h1
                        className="text-center font-bold mt-6"
                        style={{
                            fontSize: "48px",
                            lineHeight: "48px",
                            color: "#101828",
                            maxWidth: "664px",
                        }}
                    >
                        Simplify Compliance Without Compromising Oversight
                    </h1>

                    {/* Subheading */}
                    <p
                        className="text-center mt-6"
                        style={{
                            fontSize: "24px",
                            lineHeight: "39px",
                            color: "#364153",
                            maxWidth: "851px",
                        }}
                    >
                        Automated visibility and tracking tools that help maintenance organizations stay
                        aligned with regulatory requirements--without replacing professional judgment.
                    </p>
                </section>

                {/* What It Does Section - 940.2px */}
                <section
                    className="flex flex-col gap-8 px-[86px]"
                    style={{
                        paddingTop: "80px",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <h2
                        className="text-center font-bold"
                        style={{ fontSize: "36px", lineHeight: "40px", color: "#101828" }}
                    >
                        What It Does
                    </h2>

                    <div
                        className="flex flex-col gap-12 rounded-[14px] px-[41.6px] py-[41.6px]"
                        style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                    >
                        <p style={{ fontSize: "18px", lineHeight: "29.25px", color: "#364153", maxWidth: "830px" }}>
                            SkyMaintain&apos;s Regulatory Compliance Automation module helps maintenance teams
                            track, organize, and manage regulatory obligations more efficiently.
                        </p>

                        <p style={{ fontSize: "18px", lineHeight: "29.25px", color: "#364153" }}>
                            The platform provides structured visibility into compliance-related information so
                            organizations can:
                        </p>

                        <div className="flex flex-col gap-3">
                            {[
                                "Monitor applicable FAA and EASA requirements",
                                "Track airworthiness directives and compliance deadlines",
                                "Maintain organized compliance records",
                                "Reduce administrative burden and missed obligations",
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 rounded-[10px] px-4"
                                    style={{ height: "60px", backgroundColor: "#f0fdf4" }}
                                >
                                    <Image alt="Check" src={imgIcon} width={24} height={24} unoptimized style={{ width: "24px", height: "24px" }} />
                                    <span style={{ fontSize: "18px", lineHeight: "28px", color: "#101828" }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div
                            className="flex items-center rounded-[4px] px-7"
                            style={{
                                height: "77.25px",
                                backgroundColor: "#eff6ff",
                                borderLeft: "4px solid #155dfc",
                            }}
                        >
                            <p className="font-bold" style={{ fontSize: "18px", lineHeight: "29.25px", color: "#1e2939" }}>
                                SkyMaintain supports compliance management, not regulatory decision-making.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section - 857px */}
                <section
                    className="flex flex-col items-start px-16 pt-20"
                    style={{
                        background: "linear-gradient(143.26deg, #f9fafb 0%, #f0fdf4 100%)",
                    }}
                >
                    <div className="flex flex-col gap-8 px-6 w-full">
                        <h2
                            className="text-center font-bold w-full"
                            style={{ fontSize: "36px", lineHeight: "40px", color: "#101828" }}
                        >
                            How It Works
                        </h2>

                        <div
                            className="flex flex-col gap-12 rounded-[14px] px-[41.6px] py-[41.6px] bg-white"
                            style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                        >
                            <p style={{ fontSize: "18px", lineHeight: "29.25px", color: "#364153", maxWidth: "889px" }}>
                                The system aggregates regulatory references and compliance-related data into a
                                centralized dashboard, helping teams stay informed of:
                            </p>

                            <div className="flex flex-col gap-3">
                                {[
                                    "Applicable airworthiness directives (ADs)",
                                    "Compliance timelines and status indicators",
                                    "Maintenance actions linked to regulatory items",
                                    "Documentation and audit-readiness signals",
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 rounded-[10px] px-4 bg-white"
                                        style={{ height: "59.2px", border: "1.6px solid rgba(0,0,0,0.1)" }}
                                    >
                                        <Image alt="Check" src={imgIcon1} width={20} height={20} unoptimized style={{ width: "20px", height: "20px" }} />
                                        <span style={{ fontSize: "16px", lineHeight: "24px", color: "#101828" }}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="flex flex-col justify-center rounded-[4px] px-7 pt-6"
                                style={{
                                    height: "106.5px",
                                    backgroundColor: "#f0fdf4",
                                    borderLeft: "4px solid #00a63e",
                                }}
                            >
                                <p style={{ fontSize: "18px", lineHeight: "29.25px", color: "#1e2939" }}>
                                    Automated alerts and reminders help ensure nothing is overlooked, while
                                </p>
                                <p className="font-bold" style={{ fontSize: "18px", lineHeight: "29.25px", color: "#1e2939" }}>
                                    final compliance determinations remain with authorized personnel.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Benefits Section - 843.375px */}
                <section className="flex flex-col gap-12 px-[86px] pt-20 bg-white">
                    <h2
                        className="text-center font-bold"
                        style={{ fontSize: "36px", lineHeight: "40px", color: "#101828" }}
                    >
                        Key Benefits
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Card 1: Improved Compliance Visibility */}
                        <div
                            className="flex flex-col gap-10 rounded-[14px] px-[33.6px] py-[33.6px]"
                            style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                        >
                            <div className="relative" style={{ width: "48px", height: "48px" }}>
                                <Image alt="Vector" src={imgVector} width={40} height={28} unoptimized className="absolute" style={{ inset: "20.84% 8.33%", width: "40px", height: "28px" }} />
                                <Image alt="Vector" src={imgVector1} width={12} height={12} unoptimized className="absolute" style={{ left: "37.5%", top: "37.5%", width: "12px", height: "12px" }} />
                            </div>
                            <h3 className="font-bold" style={{ fontSize: "24px", lineHeight: "32px", color: "#101828" }}>
                                Improved Compliance Visibility
                            </h3>
                            <p style={{ fontSize: "18px", lineHeight: "29.25px", color: "#364153", maxWidth: "383px" }}>
                                See regulatory obligations clearly across aircraft, components, and maintenance
                                programs.
                            </p>
                        </div>

                        {/* Card 2: Reduced Administrative Overhead */}
                        <div
                            className="flex flex-col gap-10 rounded-[14px] px-[33.6px] py-[33.6px]"
                            style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                        >
                            <div className="relative" style={{ width: "48px", height: "48px" }}>
                                <Image alt="Vector" src={imgVector2} width={40} height={40} unoptimized className="absolute" style={{ inset: "8.33%", width: "40px", height: "40px" }} />
                                <Image alt="Vector" src={imgVector3} width={8} height={16} unoptimized className="absolute" style={{ left: "50%", top: "25%", width: "8px", height: "16px" }} />
                            </div>
                            <h3 className="font-bold" style={{ fontSize: "24px", lineHeight: "32px", color: "#101828" }}>
                                Reduced Administrative Overhead
                            </h3>
                            <p style={{ fontSize: "18px", lineHeight: "29.25px", color: "#364153", maxWidth: "396px" }}>
                                Minimize manual tracking and spreadsheet-based compliance management.
                            </p>
                        </div>

                        {/* Card 3: Audit-Ready Documentation */}
                        <div
                            className="flex flex-col gap-10 rounded-[14px] px-[33.6px] py-[33.6px]"
                            style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                        >
                            <div className="relative" style={{ width: "48px", height: "48px" }}>
                                <Image alt="Vector" src={imgVector4} width={40} height={34} unoptimized className="absolute" style={{ inset: "12.5% 8.33% 16.67%", width: "40px", height: "34px" }} />
                            </div>
                            <h3 className="font-bold" style={{ fontSize: "24px", lineHeight: "32px", color: "#101828" }}>
                                Audit-Ready Documentation
                            </h3>
                            <p style={{ fontSize: "18px", lineHeight: "29.25px", color: "#364153", maxWidth: "372px" }}>
                                Maintain organized records to support internal reviews and external audits.
                            </p>
                        </div>

                        {/* Card 4: Clear Accountability */}
                        <div
                            className="flex flex-col gap-10 rounded-[14px] px-[33.6px] py-[33.6px]"
                            style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                        >
                            <div className="relative" style={{ width: "48px", height: "48px" }}>
                                <Image alt="Vector" src={imgVector5} width={28} height={12} unoptimized className="absolute" style={{ left: "8.33%", top: "62.5%", width: "28px", height: "12px" }} />
                                <Image alt="Vector" src={imgVector6} width={16} height={16} unoptimized className="absolute" style={{ left: "20.83%", top: "12.5%", width: "16px", height: "16px" }} />
                                <Image alt="Vector" src={imgVector7} width={6} height={12} unoptimized className="absolute" style={{ left: "79.17%", top: "63.04%", width: "6px", height: "12px" }} />
                                <Image alt="Vector" src={imgVector8} width={6} height={15} unoptimized className="absolute" style={{ left: "66.67%", top: "13.04%", width: "6px", height: "15px" }} />
                            </div>
                            <h3 className="font-bold" style={{ fontSize: "24px", lineHeight: "32px", color: "#101828" }}>
                                Clear Accountability
                            </h3>
                            <p style={{ fontSize: "18px", lineHeight: "29.25px", color: "#364153", maxWidth: "386px" }}>
                                Ensure compliance actions are assigned, tracked, and reviewed by responsible
                                personnel.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Designed for Regulated Environments Section - 854.188px */}
                <section
                    className="flex flex-col gap-12 px-16 pt-20"
                    style={{
                        background: "linear-gradient(143.35deg, #eff6ff 0%, #f0fdf4 100%)",
                    }}
                >
                    <div className="flex flex-col gap-12 px-6 w-full">
                        {/* Header with Icon */}
                        <div className="flex flex-col items-center gap-4">
                            <Image alt="Shield" src={imgIcon2} width={48} height={48} unoptimized style={{ width: "48px", height: "48px" }} />
                            <h2
                                className="text-center font-bold"
                                style={{ fontSize: "36px", lineHeight: "40px", color: "#101828" }}
                            >
                                Designed for Regulated Environments
                            </h2>
                            <p
                                className="text-center"
                                style={{ fontSize: "20px", lineHeight: "32.5px", color: "#364153" }}
                            >
                                SkyMaintain is built with the realities of aviation regulation in mind.
                            </p>
                        </div>

                        <div
                            className="flex flex-col gap-12 rounded-[14px] px-[41.6px] py-[41.6px] bg-white"
                            style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                        >
                            <h3 className="font-bold" style={{ fontSize: "24px", lineHeight: "32px", color: "#101828" }}>
                                The platform:
                            </h3>

                            <div className="flex flex-col gap-4">
                                {[
                                    "Supports FAA and EASA maintenance governance frameworks",
                                    "Preserves clear audit trails and traceability",
                                    "Avoids automated regulatory determinations",
                                    "Reinforces documented, human-approved compliance actions",
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3" style={{ height: "28px" }}>
                                        <Image alt="Check" src={imgIcon} width={24} height={24} unoptimized style={{ width: "24px", height: "24px" }} />
                                        <span style={{ fontSize: "18px", lineHeight: "28px", color: "#364153" }}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="flex flex-col justify-center rounded-[4px] px-7 pt-[26.4px]"
                                style={{
                                    height: "106.5px",
                                    backgroundColor: "#fef2f2",
                                    borderLeft: "4px solid #e7000b",
                                }}
                            >
                                <p className="font-bold" style={{ fontSize: "18px", lineHeight: "29.25px", color: "#1e2939", maxWidth: "817px" }}>
                                    SkyMaintain does not issue regulatory approvals, certify compliance, or replace
                                    authority-mandated oversight.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Human-in-the-Loop Compliance Section - 829.45px */}
                <section className="flex flex-col gap-12 px-[86px] pt-20 bg-white">
                    {/* Header with Icon */}
                    <div className="flex flex-col items-center gap-4">
                        <Image alt="Users" src={imgIcon3} width={48} height={48} unoptimized style={{ width: "48px", height: "48px" }} />
                        <h2
                            className="text-center font-bold"
                            style={{ fontSize: "36px", lineHeight: "40px", color: "#101828" }}
                        >
                            Human-in-the-Loop Compliance
                        </h2>
                        <p
                            className="text-center"
                            style={{ fontSize: "20px", lineHeight: "32.5px", color: "#364153", maxWidth: "679px" }}
                        >
                            SkyMaintain is intentionally designed to support--not substitute--regulatory
                            accountability.
                        </p>
                    </div>

                    <div
                        className="flex flex-col gap-14 rounded-[14px] px-[41.6px] py-[41.6px]"
                        style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                    >
                        <div className="flex flex-col gap-4">
                            {[
                                "No automated compliance sign-offs",
                                "No override of approved maintenance programs",
                                "No substitution for required inspections or certifications",
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 rounded-[10px] px-4"
                                    style={{ height: "60px", backgroundColor: "#eff6ff" }}
                                >
                                    <Image alt="X" src={imgIcon4} width={24} height={24} unoptimized style={{ width: "24px", height: "24px" }} />
                                    <span style={{ fontSize: "18px", lineHeight: "28px", color: "#101828" }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div
                            className="flex items-center rounded-[4px] px-7"
                            style={{
                                height: "77.25px",
                                backgroundColor: "#eff6ff",
                                borderLeft: "4px solid #155dfc",
                            }}
                        >
                            <p className="font-bold" style={{ fontSize: "18px", lineHeight: "29.25px", color: "#1e2939" }}>
                                Every compliance-related action remains under the control of qualified, authorized
                                professionals.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Transparency & Trust Section - 744.95px */}
                <section
                    className="flex flex-col gap-12 px-16 pt-20"
                    style={{
                        background: "linear-gradient(147.02deg, #f9fafb 0%, #eff6ff 100%)",
                    }}
                >
                    <div className="flex flex-col gap-12 px-6 w-full">
                        {/* Header with Icon */}
                        <div className="flex flex-col items-center gap-4">
                            <Image alt="Trust" src={imgIcon5} width={48} height={48} unoptimized style={{ width: "48px", height: "48px" }} />
                            <h2
                                className="text-center font-bold"
                                style={{ fontSize: "36px", lineHeight: "40px", color: "#101828" }}
                            >
                                Transparency &amp; Trust
                            </h2>
                            <p
                                className="text-center"
                                style={{ fontSize: "20px", lineHeight: "32.5px", color: "#364153" }}
                            >
                                SkyMaintain emphasizes responsible system design:
                            </p>
                        </div>

                        <div
                            className="flex flex-col gap-14 rounded-[14px] px-[41.6px] py-[41.6px] bg-white"
                            style={{ border: "1.6px solid rgba(0,0,0,0.1)" }}
                        >
                            <div className="flex flex-col gap-4">
                                {[
                                    "Clear separation between automation and decision authority",
                                    "Transparent compliance status indicators",
                                    "Customer ownership of compliance data",
                                    "No sale or external monetization of regulatory information",
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3" style={{ height: "28px" }}>
                                        <Image alt="Check" src={imgIcon6} width={24} height={24} unoptimized style={{ width: "24px", height: "24px" }} />
                                        <span style={{ fontSize: "18px", lineHeight: "28px", color: "#364153" }}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="flex items-center rounded-[4px] px-7 py-6"
                                style={{
                                    height: "77.25px",
                                    backgroundColor: "#eef2ff",
                                    borderLeft: "4px solid #4f39f6",
                                }}
                            >
                                <p className="italic" style={{ fontSize: "18px", lineHeight: "29.25px", color: "#1e2939" }}>
                                    Compliance insights are informational tools, not regulatory judgments.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For Section - 778.55px */}
                <section className="flex flex-col gap-12 px-[86px] pt-20 bg-white">
                    {/* Header with Icon */}
                    <div className="flex flex-col items-center gap-4">
                        <Image alt="Who" src={imgIcon7} width={48} height={48} unoptimized style={{ width: "48px", height: "48px" }} />
                        <h2
                            className="text-center font-bold"
                            style={{ fontSize: "36px", lineHeight: "40px", color: "#101828" }}
                        >
                            Who It&apos;s For
                        </h2>
                        <p
                            className="text-center"
                            style={{ fontSize: "20px", lineHeight: "32.5px", color: "#364153" }}
                        >
                            This capability supports:
                        </p>
                    </div>

                    {/* Grid of Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { text: "Airlines and fleet operators", height: "79.2px" },
                            { text: "MRO compliance departments", height: "79.2px" },
                            { text: "Continuing airworthiness management organizations (CAMOs)", height: "107.2px", multiline: true },
                            { text: "Engineering and quality assurance teams", height: "107.2px" },
                            { text: "Safety and compliance leadership", height: "79.2px" },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 rounded-[14px] px-[25.6px]"
                                style={{
                                    height: item.height,
                                    border: "1.6px solid rgba(0,0,0,0.1)",
                                    gridColumn: idx === 4 ? "span 1" : undefined,
                                }}
                            >
                                <Image alt="Building" src={imgIcon8} width={24} height={24} unoptimized style={{ width: "24px", height: "24px" }} />
                                <span
                                    className="font-bold"
                                    style={{
                                        fontSize: "18px",
                                        lineHeight: "28px",
                                        color: "#101828",
                                        maxWidth: item.multiline ? "319px" : undefined,
                                    }}
                                >
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Closing Card */}
                    <div
                        className="flex items-center justify-center rounded-[14px] px-[25.6px]"
                        style={{
                            height: "80.45px",
                            backgroundColor: "#f0fdf4",
                            border: "1.6px solid #b9f8cf",
                        }}
                    >
                        <p
                            className="text-center"
                            style={{ fontSize: "18px", lineHeight: "29.25px", color: "#364153" }}
                        >
                            Whether managing a single fleet or multiple operators, SkyMaintain helps teams
                            maintain clarity and control.
                        </p>
                    </div>
                </section>

                {/* CTA Section - 412.2px */}
                <section
                    className="flex flex-col items-center px-[126px] pt-24"
                    style={{
                        height: "412.2px",
                        background: "linear-gradient(160.25deg, #00a63e 0%, #009966 50%, #00786f 100%)",
                    }}
                >
                    <div className="flex flex-col items-center gap-6 px-6">
                        <h2
                            className="text-center font-bold text-white"
                            style={{ fontSize: "36px", lineHeight: "40px" }}
                        >
                            Ready to Modernize Compliance Management?
                        </h2>

                        <p
                            className="text-center text-white opacity-90"
                            style={{ fontSize: "20px", lineHeight: "32.5px", maxWidth: "838px" }}
                        >
                            Discover how structured automation can improve oversight, accountability, and audit
                            readiness--without sacrificing regulatory integrity.
                        </p>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/get-started"
                                className="flex items-center gap-2 rounded-lg bg-white px-4"
                                style={{
                                    height: "48px",
                                    boxShadow: "0px 25px 50px 0px rgba(0,0,0,0.25)",
                                }}
                            >
                                <span style={{ fontSize: "18px", lineHeight: "28px", color: "#00a63e" }}>
                                    Start a Free Trial
                                </span>
                                <Image alt="Arrow" src={imgIcon9} width={20} height={20} unoptimized style={{ width: "20px", height: "20px" }} />
                            </Link>

                            <Link
                                href={CONTACT_DEMO}
                                className="flex items-center gap-2 rounded-lg px-4"
                                style={{
                                    height: "51.2px",
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    border: "1.6px solid white",
                                    boxShadow: "0px 25px 50px 0px rgba(0,0,0,0.25)",
                                }}
                            >
                                <span className="text-white" style={{ fontSize: "18px", lineHeight: "28px" }}>
                                    Schedule a Demo
                                </span>
                                <Image alt="Arrow" src={imgIcon10} width={20} height={20} unoptimized style={{ width: "20px", height: "20px" }} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer - 168.8px */}
                <footer
                    className="flex flex-col gap-6 px-6"
                    style={{ height: "168.8px", backgroundColor: "#101828" }}
                >
                    {/* Logo and Tagline */}
                    <div className="flex flex-col gap-4 items-center pt-6">
                        <div className="flex items-center justify-center gap-3">
                            <div
                                className="flex items-center justify-center rounded-[10px]"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                }}
                            >
                                <div className="relative" style={{ width: "20px", height: "20px" }}>
                                    <Image alt="Logo" src={imgVector9} width={20} height={20} unoptimized className="size-full object-contain" />
                                </div>
                            </div>
                            <span
                                className="font-bold text-center text-white"
                                style={{ fontSize: "20px", lineHeight: "28px" }}
                            >
                                SkyMaintain
                            </span>
                        </div>
                        <p
                            className="text-center"
                            style={{ fontSize: "14px", lineHeight: "20px", color: "#99a1af" }}
                        >
                            Regulatory-Compliant AI-Assisted Aircraft Maintenance Decision Support
                        </p>
                    </div>

                    {/* Bottom Border and Copyright */}
                    <div
                        className="flex flex-col items-center gap-2 pt-6"
                        style={{ borderTop: "0.8px solid #1e2939" }}
                    >
                        <p
                            className="text-center"
                            style={{ fontSize: "14px", lineHeight: "20px", color: "#d1d5dc" }}
                        >
                            (c) 2026 SkyMaintain. All rights reserved.
                        </p>
                        <p
                            className="text-center"
                            style={{ fontSize: "14px", lineHeight: "20px", color: "#51a2ff" }}
                        >
                            SkyMaintain is a product of EncycloAMTs LLC.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}

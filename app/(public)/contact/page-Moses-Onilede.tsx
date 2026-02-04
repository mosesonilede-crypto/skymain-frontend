/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_DEMO, CONTACT_GENERAL } from "@/lib/routes";

// Figma assets (node 39:10236)
const imgIconGeneral = "https://www.figma.com/api/mcp/asset/b6e7f8ed-9d1f-484f-b42a-2b0c22dd6351";
const imgIconEmail = "https://www.figma.com/api/mcp/asset/c37edcac-0997-4bef-89fd-e0df2eddc1a4";
const imgIconSupport = "https://www.figma.com/api/mcp/asset/31a5a439-3d3e-4437-9a30-b7a50996061b";
const imgIconPartnership = "https://www.figma.com/api/mcp/asset/2cfc22b2-084c-490e-9245-c840caf2dfc6";
const imgVector = "https://www.figma.com/api/mcp/asset/52296905-57fd-4609-bc00-e63c997805ea";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/d0989e11-6a41-442f-aba1-89c7810efdf4";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/ec2881c7-385c-4d82-b474-bd9d672670b0";

type DataMode = "mock" | "live" | "hybrid";

type ContactCard = {
    title: string;
    description: string;
    email: string;
};

type ContactDoc = {
    badge: string;
    headline: string;
    subhead: string;
    cards: ContactCard[];
    cta_band: {
        headline: string;
        primary: { label: string; href: string };
        secondary: { label: string; href: string };
    };
};

type ApiEnvelope<T> = { ok: boolean; data: T; meta?: { request_id?: string } };

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
    if (raw === "mock" || raw === "live" || raw === "hybrid") return raw;
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
}

const DEFAULT_DOC: ContactDoc = {
    badge: "Contact Us",
    headline: "Contact SkyMaintain",
    subhead: "We'd love to hear from you.",
    cards: [
        {
            title: "General Inquiries",
            description: "Questions about SkyMaintain or general information",
            email: "contact@skymaintain.ai",
        },
        {
            title: "Support",
            description: "Technical support and customer assistance",
            email: "support@skymaintain.ai",
        },
        {
            title: "Business & Partnerships",
            description: "Partnership opportunities and business inquiries",
            email: "partnerships@skymaintain.ai",
        },
    ],
    cta_band: {
        headline: "Ready to get started?",
        primary: { label: "Request a Demo", href: CONTACT_DEMO },
        secondary: { label: "Contact Us", href: CONTACT_GENERAL },
    },
};

let mockStore: ContactDoc = structuredClone(DEFAULT_DOC);

async function apiGetContact(signal?: AbortSignal): Promise<ContactDoc> {
    const mode = getDataMode();

    if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 80));
        return structuredClone(mockStore);
    }

    const base = getApiBaseUrl();
    if (!base) {
        await new Promise((r) => setTimeout(r, 60));
        return structuredClone(mockStore);
    }

    const res = await fetch(`${base}/v1/public/contact`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/contact failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<ContactDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/contact");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

export default function ContactPage(): React.ReactElement {
    const [loading, setLoading] = React.useState(true);
    const [doc, setDoc] = React.useState<ContactDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            try {
                const data = await apiGetContact(ac.signal);
                setDoc(data);
            } catch {
                // Fallback to default doc on error
                setDoc(structuredClone(DEFAULT_DOC));
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    return (
        <div className="w-full bg-white">
            {/* Header - 80.8px height per Figma */}
            <header
                className="fixed left-0 right-0 top-0 z-50 flex flex-col items-start"
                style={{
                    height: "80.8px",
                    paddingTop: "16px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    paddingBottom: "0.8px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)",
                }}
            >
                <div className="flex w-full items-center justify-between" style={{ height: "48px" }}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center" style={{ gap: "12px" }}>
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "14px",
                                background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            <img
                                src={imgVectorLarge}
                                alt="SkyMaintain"
                                style={{ width: "28px", height: "28px" }}
                            />
                        </div>
                        <div style={{ height: "47.975px" }}>
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

                    {/* Right buttons - 261.363px container, 12px gap */}
                    <div className="flex items-center" style={{ gap: "12px" }}>
                        {/* Back to Home button - 121.225px width, 36px height */}
                        <Link
                            href="/"
                            className="flex items-center justify-center transition-colors hover:bg-gray-100"
                            style={{
                                width: "121.225px",
                                height: "36px",
                                borderRadius: "8px",
                                padding: "8px 16px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#364153", fontSize: "14px", lineHeight: "20px" }}
                            >
                                Back to Home
                            </span>
                        </Link>
                        {/* Get Started button - 128.137px width, 36px height */}
                        <Link
                            href="/get-started"
                            className="flex items-center justify-center transition-colors hover:opacity-90"
                            style={{
                                width: "128.137px",
                                height: "36px",
                                backgroundColor: "#155dfc",
                                borderRadius: "8px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#ffffff", fontSize: "14px", lineHeight: "20px" }}
                            >
                                Get Started
                            </span>
                            <img
                                src={imgIconArrowWhite}
                                alt=""
                                style={{ width: "16px", height: "16px", marginLeft: "4px" }}
                            />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section - 362.1px height per Figma */}
            <section
                className="flex flex-col items-start w-full"
                style={{
                    height: "362.1px",
                    paddingTop: "128px",
                    paddingLeft: "126px",
                    paddingRight: "126px",
                    background: "linear-gradient(162.49deg, #eff6ff 0%, #faf5ff 100%)",
                }}
            >
                <div className="relative w-full" style={{ height: "170.1px" }}>
                    {/* Badge - 110.563px width, 41.6px height */}
                    <div className="flex justify-center w-full">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                backgroundColor: "#155dfc",
                                borderRadius: "8px",
                                height: "41.6px",
                                paddingLeft: "16px",
                                paddingRight: "16px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#ffffff", fontSize: "14px", lineHeight: "20px" }}
                            >
                                {doc.badge}
                            </span>
                        </div>
                    </div>

                    {/* Title - 65.6px top margin */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px" }}>
                        <h1
                            className="font-bold text-center"
                            style={{ color: "#101828", fontSize: "48px", lineHeight: "48px" }}
                        >
                            {doc.headline}
                        </h1>
                    </div>

                    {/* Subtitle - 24px top margin */}
                    <div className="flex justify-center w-full" style={{ marginTop: "24px" }}>
                        <p
                            className="text-center"
                            style={{ color: "#4a5565", fontSize: "20px", lineHeight: "32.5px" }}
                        >
                            {doc.subhead}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Cards Section - 575.188px height, 80px top padding */}
            <section
                className="bg-white relative w-full"
                style={{ height: "575.188px" }}
            >
                {loading ? (
                    <div className="absolute flex" style={{ left: "24px", top: "80px", gap: "32px" }}>
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="bg-white"
                                style={{
                                    width: "345.325px",
                                    height: "351.188px",
                                    borderRadius: "14px",
                                    border: "1.6px solid rgba(0,0,0,0.1)",
                                    padding: "32px",
                                }}
                            >
                                <div className="flex justify-center">
                                    <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-100" />
                                </div>
                                <div className="mx-auto mt-12 h-8 w-2/3 animate-pulse rounded bg-slate-100" />
                                <div className="mt-8 h-12 w-full animate-pulse rounded bg-slate-100" />
                                <div className="mx-auto mt-12 h-6 w-2/3 animate-pulse rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Card 1 - General Inquiries */}
                        <div
                            className="absolute bg-white"
                            style={{
                                left: "24px",
                                top: "80px",
                                width: "345.325px",
                                height: "351.188px",
                                borderRadius: "14px",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="absolute flex justify-center"
                                style={{ left: "32px", top: "32px", width: "278.125px", height: "48px" }}
                            >
                                <img
                                    src={imgIconGeneral}
                                    alt=""
                                    style={{ width: "48px", height: "48px" }}
                                />
                            </div>
                            {/* Title */}
                            <p
                                className="absolute font-bold text-center"
                                style={{
                                    left: "32px",
                                    top: "128px",
                                    width: "278.125px",
                                    color: "#101828",
                                    fontSize: "24px",
                                    lineHeight: "32px",
                                }}
                            >
                                {doc.cards[0]?.title}
                            </p>
                            {/* Description */}
                            <p
                                className="absolute text-center"
                                style={{
                                    left: "32px",
                                    top: "195.99px",
                                    width: "278.125px",
                                    color: "#4a5565",
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                }}
                            >
                                {doc.cards[0]?.description}
                            </p>
                            {/* Email link */}
                            <div
                                className="absolute flex items-center"
                                style={{ left: "32px", top: "291.99px", width: "278.125px" }}
                            >
                                <img
                                    src={imgIconEmail}
                                    alt=""
                                    style={{ width: "16px", height: "16px" }}
                                />
                                <a
                                    href={`mailto:${doc.cards[0]?.email}`}
                                    className="font-bold text-center transition-colors hover:underline"
                                    style={{
                                        color: "#155dfc",
                                        fontSize: "16px",
                                        lineHeight: "24px",
                                        marginLeft: "8px",
                                    }}
                                >
                                    {doc.cards[0]?.email}
                                </a>
                            </div>
                        </div>

                        {/* Card 2 - Support */}
                        <div
                            className="absolute bg-white"
                            style={{
                                left: "401.33px",
                                top: "80px",
                                width: "345.337px",
                                height: "351.188px",
                                borderRadius: "14px",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="absolute flex justify-center"
                                style={{ left: "32px", top: "32px", width: "278.138px", height: "48px" }}
                            >
                                <img
                                    src={imgIconSupport}
                                    alt=""
                                    style={{ width: "48px", height: "48px" }}
                                />
                            </div>
                            {/* Title */}
                            <p
                                className="absolute font-bold text-center"
                                style={{
                                    left: "32px",
                                    top: "128px",
                                    width: "278.138px",
                                    color: "#101828",
                                    fontSize: "24px",
                                    lineHeight: "32px",
                                }}
                            >
                                {doc.cards[1]?.title}
                            </p>
                            {/* Description */}
                            <p
                                className="absolute text-center"
                                style={{
                                    left: "32px",
                                    top: "195.99px",
                                    width: "278.138px",
                                    color: "#4a5565",
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                }}
                            >
                                {doc.cards[1]?.description}
                            </p>
                            {/* Email link */}
                            <div
                                className="absolute flex items-center"
                                style={{ left: "32px", top: "291.99px", width: "278.138px" }}
                            >
                                <img
                                    src={imgIconEmail}
                                    alt=""
                                    style={{ width: "16px", height: "16px" }}
                                />
                                <a
                                    href={`mailto:${doc.cards[1]?.email}`}
                                    className="font-bold text-center transition-colors hover:underline"
                                    style={{
                                        color: "#155dfc",
                                        fontSize: "16px",
                                        lineHeight: "24px",
                                        marginLeft: "8px",
                                    }}
                                >
                                    {doc.cards[1]?.email}
                                </a>
                            </div>
                        </div>

                        {/* Card 3 - Business & Partnerships */}
                        <div
                            className="absolute bg-white"
                            style={{
                                left: "778.66px",
                                top: "80px",
                                width: "345.325px",
                                height: "351.188px",
                                borderRadius: "14px",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="absolute flex justify-center"
                                style={{ left: "32px", top: "32px", width: "278.125px", height: "48px" }}
                            >
                                <img
                                    src={imgIconPartnership}
                                    alt=""
                                    style={{ width: "48px", height: "48px" }}
                                />
                            </div>
                            {/* Title */}
                            <p
                                className="absolute font-bold text-center"
                                style={{
                                    left: "32px",
                                    top: "128px",
                                    width: "278.125px",
                                    color: "#101828",
                                    fontSize: "24px",
                                    lineHeight: "32px",
                                }}
                            >
                                {doc.cards[2]?.title}
                            </p>
                            {/* Description */}
                            <p
                                className="absolute text-center"
                                style={{
                                    left: "32px",
                                    top: "195.99px",
                                    width: "278.125px",
                                    color: "#4a5565",
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                }}
                            >
                                {doc.cards[2]?.description}
                            </p>
                            {/* Email link */}
                            <div
                                className="absolute flex items-center"
                                style={{ left: "32px", top: "291.99px", width: "278.125px" }}
                            >
                                <img
                                    src={imgIconEmail}
                                    alt=""
                                    style={{ width: "16px", height: "16px" }}
                                />
                                <a
                                    href={`mailto:${doc.cards[2]?.email}`}
                                    className="font-bold text-center transition-colors hover:underline"
                                    style={{
                                        color: "#155dfc",
                                        fontSize: "16px",
                                        lineHeight: "24px",
                                        marginLeft: "8px",
                                    }}
                                >
                                    {doc.cards[2]?.email}
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* CTA Section - 304px height, 96px top padding */}
            <section
                className="flex flex-col items-start w-full"
                style={{
                    height: "304px",
                    paddingTop: "96px",
                    paddingLeft: "126px",
                    paddingRight: "126px",
                    background: "linear-gradient(165.17deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                }}
            >
                <div
                    className="flex flex-col items-start w-full"
                    style={{ height: "112px", paddingLeft: "24px", paddingRight: "24px", gap: "24px" }}
                >
                    {/* Headline */}
                    <div className="w-full" style={{ height: "40px" }}>
                        <p
                            className="font-bold text-center"
                            style={{ color: "#ffffff", fontSize: "36px", lineHeight: "40px" }}
                        >
                            {doc.cta_band.headline}
                        </p>
                    </div>

                    {/* Buttons - centered */}
                    <div className="relative w-full" style={{ height: "48px" }}>
                        {/* Request a Demo - 213.938px width */}
                        <Link
                            href={doc.cta_band.primary.href}
                            className="absolute flex items-center justify-center bg-white transition-colors hover:bg-gray-100"
                            style={{
                                left: "224.69px",
                                top: "0",
                                width: "213.938px",
                                height: "48px",
                                borderRadius: "8px",
                                boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                padding: "24px 40px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#155dfc", fontSize: "18px", lineHeight: "28px" }}
                            >
                                {doc.cta_band.primary.label}
                            </span>
                        </Link>
                        {/* Contact Us - 168.675px width */}
                        <Link
                            href={doc.cta_band.secondary.href}
                            className="absolute flex items-center justify-center bg-white transition-colors hover:bg-gray-100"
                            style={{
                                left: "454.63px",
                                top: "0",
                                width: "168.675px",
                                height: "48px",
                                borderRadius: "8px",
                                boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                padding: "24px 40px",
                            }}
                        >
                            <span
                                className="text-center"
                                style={{ color: "#155dfc", fontSize: "18px", lineHeight: "28px" }}
                            >
                                {doc.cta_band.secondary.label}
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer - 128px height per Figma */}
            <footer
                className="relative w-full"
                style={{ height: "128px", backgroundColor: "#101828" }}
            >
                {/* Logo row */}
                <div
                    className="absolute flex items-center justify-center"
                    style={{ left: "24px", top: "0", width: "1100px", height: "36px", gap: "8px" }}
                >
                    <div
                        className="flex items-center justify-center"
                        style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#155dfc",
                            borderRadius: "10px",
                        }}
                    >
                        <img
                            src={imgVector}
                            alt="SkyMaintain"
                            style={{ width: "20px", height: "20px" }}
                        />
                    </div>
                    <span
                        className="font-bold text-center"
                        style={{ color: "#ffffff", fontSize: "18px", lineHeight: "28px" }}
                    >
                        SkyMaintain
                    </span>
                </div>

                {/* Tagline */}
                <p
                    className="absolute text-center"
                    style={{
                        left: "24px",
                        top: "52px",
                        width: "1100px",
                        color: "#99a1af",
                        fontSize: "14px",
                        lineHeight: "20px",
                    }}
                >
                    AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                </p>

                {/* Copyright */}
                <div
                    className="absolute flex items-center justify-center"
                    style={{ left: "24px", top: "80px", width: "1100px", height: "20px" }}
                >
                    <span style={{ color: "#d1d5dc", fontSize: "14px", lineHeight: "20px" }}>© 2026</span>
                    <span style={{ color: "#51a2ff", fontSize: "14px", lineHeight: "20px", marginLeft: "4px" }}>SkyMaintain</span>
                    <span style={{ color: "#d1d5dc", fontSize: "14px", lineHeight: "20px" }}>. All Rights Reserved.</span>
                </div>

                {/* EncycloAMTs */}
                <p
                    className="absolute text-center"
                    style={{
                        left: "24px",
                        top: "108px",
                        width: "1100px",
                        color: "#6a7282",
                        fontSize: "14px",
                        lineHeight: "20px",
                    }}
                >
                    SkyMaintain is a product of EncycloAMTs LLC.
                </p>
            </footer>
        </div>
    );
}

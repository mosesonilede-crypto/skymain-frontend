import Link from "next/link";
import { CONTACT_DEMO, CONTACT_PRICING } from "@/lib/routes";

export const metadata = {
    title: "Compliance Statement | SkyMaintain",
    description:
        "Compliance & Regulatory Alignment statement for the SkyMaintain Regulatory-Compliant AI Platform.",
};

type CompliancePayload = {
    headlineTop: string;
    backToHomeLabel: string;
    subhead: string;
    pageTitle: string;
    heroKicker: string;
    heroBody: string;
    keyPrinciplesTitle: string;
    keyPrinciples: string[];
    regulatoryAlignmentTitle: string;
    regulatoryAlignmentIntro: string;
    regulatoryAlignmentBullets: string[];
    importantNoticeTitle: string;
    importantNoticeIntro: string;
    importantNoticeBullets: string[];
    importantNoticeClosingLine1: string;
    importantNoticeClosingLine2: string;
    lastUpdated?: string;
};

function getEnv(name: string, fallback: string) {
    const v = process.env[name];
    return (v ?? fallback).trim();
}

function mockCompliance(): CompliancePayload {
    return {
        headlineTop: "SkyMaintain",
        backToHomeLabel: "Back to Home",
        subhead: "Regulatory-Compliant AI Platform",
        pageTitle: "Compliance Statement",
        heroKicker: "Compliance & Regulatory Alignment",
        heroBody:
            "SkyMaintain is designed as a decision-support platform aligned with aviation maintenance best practices and regulatory frameworks.",
        keyPrinciplesTitle: "Key Principles",
        keyPrinciples: [
            "Human-in-the-loop decision support",
            "No autonomous maintenance actions",
            "No certification authority",
            "No airworthiness approvals",
        ],
        regulatoryAlignmentTitle: "Regulatory Alignment",
        regulatoryAlignmentIntro: "SkyMaintain architecture is informed by:",
        regulatoryAlignmentBullets: [
            "FAA maintenance and continuing airworthiness principles",
            "EASA maintenance organization concepts",
            "Industry safety management practices",
        ],
        importantNoticeTitle: "Important Notice",
        importantNoticeIntro: "SkyMaintain does not replace:",
        importantNoticeBullets: [
            "Approved Maintenance Programs",
            "Regulatory authority oversight",
            "Certified maintenance judgment",
        ],
        importantNoticeClosingLine1: "SkyMaintain supports maintenance professionals —",
        importantNoticeClosingLine2: "it does not substitute them.",
    };
}

async function fetchComplianceLive(baseUrl: string): Promise<CompliancePayload> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/public/compliance`;
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`GET /v1/public/compliance failed: ${res.status}`);

    const data = (await res.json()) as Partial<CompliancePayload>;

    if (
        !data ||
        typeof data.subhead !== "string" ||
        typeof data.pageTitle !== "string" ||
        typeof data.heroKicker !== "string" ||
        typeof data.heroBody !== "string" ||
        !Array.isArray(data.keyPrinciples) ||
        !Array.isArray(data.regulatoryAlignmentBullets) ||
        !Array.isArray(data.importantNoticeBullets)
    ) {
        throw new Error("Invalid compliance payload shape");
    }

    return {
        ...mockCompliance(),
        ...data,
    };
}

async function loadCompliance(): Promise<{ payload: CompliancePayload; source: "mock" | "live" }> {
    const mode = getEnv("NEXT_PUBLIC_DATA_MODE", "mock");
    const baseUrl = getEnv("NEXT_PUBLIC_API_BASE_URL", "");

    if (mode === "mock") return { payload: mockCompliance(), source: "mock" };
    if (!baseUrl) return { payload: mockCompliance(), source: "mock" };

    if (mode === "live") {
        const payload = await fetchComplianceLive(baseUrl);
        return { payload, source: "live" };
    }

    try {
        const payload = await fetchComplianceLive(baseUrl);
        return { payload, source: "live" };
    } catch {
        return { payload: mockCompliance(), source: "mock" };
    }
}

export default async function CompliancePage() {
    const { payload, source } = await loadCompliance();

    return (
        <div className="bg-white">
            <div className="border-b border-slate-200 bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {payload.headlineTop}
                            </div>

                            <div className="mt-2 text-sm font-semibold text-slate-900">{payload.subhead}</div>

                            <div className="mt-6 space-y-1">
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                                    {payload.pageTitle}
                                </h1>
                                <div className="mt-1 text-xs text-slate-500">Source: {source}</div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <Link
                                href="/"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                {payload.backToHomeLabel}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 py-10">
                <div className="space-y-5">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                        <div className="text-sm font-semibold text-slate-900">{payload.heroKicker}</div>
                        <p className="mt-3 text-sm text-slate-700">{payload.heroBody}</p>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                        <div className="text-sm font-semibold text-slate-900">{payload.keyPrinciplesTitle}</div>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {payload.keyPrinciples.map((b, idx) => (
                                <li key={idx}>{b}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                        <div className="text-sm font-semibold text-slate-900">
                            {payload.regulatoryAlignmentTitle}
                        </div>
                        <p className="mt-3 text-sm text-slate-700">{payload.regulatoryAlignmentIntro}</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {payload.regulatoryAlignmentBullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 md:p-6">
                        <div className="text-sm font-semibold text-slate-900">{payload.importantNoticeTitle}</div>
                        <p className="mt-3 text-sm text-slate-700">{payload.importantNoticeIntro}</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {payload.importantNoticeBullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                            ))}
                        </ul>

                        <div className="mt-4 text-sm text-slate-900">
                            <div className="font-medium">{payload.importantNoticeClosingLine1}</div>
                            <div className="font-medium">{payload.importantNoticeClosingLine2}</div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                        <div className="text-sm font-semibold text-slate-900">Related</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Link
                                href="/terms"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="/privacy"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href={CONTACT_PRICING}
                                className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                            >
                                Request Pricing
                            </Link>
                            <Link
                                href={CONTACT_DEMO}
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                Request Demo
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

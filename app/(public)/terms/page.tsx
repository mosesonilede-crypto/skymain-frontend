import Link from "next/link";
import { CONTACT_DEMO, CONTACT_GENERAL, CONTACT_PRICING } from "@/lib/routes";

export const metadata = {
    title: "Terms of Service | SkyMaintain",
    description:
        "SkyMaintain Terms of Service for use of the Regulatory-Compliant AI Platform.",
};

type TermsPayload = {
    lastUpdated: string;
    sections: Array<{
        number: number;
        title: string;
        paragraphs: string[];
        bullets?: string[];
    }>;
    importantNoticeTitle: string;
    importantNoticeBody: string;
};

function getEnv(name: string, fallback: string) {
    const v = process.env[name];
    return (v ?? fallback).trim();
}

function mockTerms(): TermsPayload {
    return {
        lastUpdated: "January 31, 2026",
        sections: [
            {
                number: 1,
                title: "Overview",
                paragraphs: [
                    "SkyMaintain is a software-as-a-service (SaaS) platform providing AI-assisted decision-support tools for aircraft maintenance professionals.",
                    "SkyMaintain is a product of EncycloAMTs LLC.",
                ],
            },
            {
                number: 2,
                title: "No Replacement of Certified Judgment",
                paragraphs: ["SkyMaintain provides decision-support insights only.", "SkyMaintain does not:"],
                bullets: [
                    "Replace certified maintenance personnel",
                    "Issue maintenance approvals or certifications",
                    "Replace approved maintenance programs",
                    "Make autonomous maintenance decisions",
                ],
            },
            {
                number: 3,
                title: "Regulatory Disclaimer",
                paragraphs: [
                    "SkyMaintain is not certified, approved, or endorsed by the FAA, EASA, or any aviation authority.",
                    "Use of SkyMaintain does not relieve users of their regulatory obligations.",
                ],
            },
            {
                number: 4,
                title: "Limitation of Liability",
                paragraphs: [
                    'SkyMaintain is provided "as-is" for decision-support purposes only. EncycloAMTs LLC shall not be liable for operational decisions made based on platform outputs.',
                ],
            },
            {
                number: 5,
                title: "Data Responsibility",
                paragraphs: [
                    "Users are responsible for ensuring that data entered into SkyMaintain is accurate, authorized, and compliant with applicable regulations.",
                ],
            },
            {
                number: 6,
                title: "Termination",
                paragraphs: [
                    "Accounts may be suspended or terminated for misuse, violation of terms, or unauthorized use.",
                ],
            },
            {
                number: 7,
                title: "Governing Law",
                paragraphs: ["These terms are governed by the laws of the United States."],
            },
        ],
        importantNoticeTitle: "Important Notice",
        importantNoticeBody:
            "By using SkyMaintain, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the platform.",
    };
}

async function fetchTermsLive(baseUrl: string): Promise<TermsPayload> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/public/terms`;
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) {
        throw new Error(`GET /v1/public/terms failed: ${res.status}`);
    }

    const data = (await res.json()) as Partial<TermsPayload>;

    if (
        !data ||
        typeof data.lastUpdated !== "string" ||
        !Array.isArray(data.sections) ||
        data.sections.length === 0 ||
        typeof data.importantNoticeTitle !== "string" ||
        typeof data.importantNoticeBody !== "string"
    ) {
        throw new Error("Invalid terms payload shape");
    }

    return data as TermsPayload;
}

async function loadTerms(): Promise<{ payload: TermsPayload; source: "mock" | "live" }> {
    // const mode = getEnv("NEXT_PUBLIC_DATA_MODE", "mock");
    // const baseUrl = getEnv("NEXT_PUBLIC_API_BASE_URL", "");




    const rawMode = getEnv("NEXT_PUBLIC_DATA_MODE", "").toLowerCase();
    const mode = (rawMode === "mock" || rawMode === "live" || rawMode === "hybrid")
        ? rawMode
        : "hybrid";
    const baseUrl = getEnv("NEXT_PUBLIC_API_BASE_URL", "");

    if (mode === "mock") return { payload: mockTerms(), source: "mock" };
    if (!baseUrl) return { payload: mockTerms(), source: "mock" };

    try {
        const payload = await fetchTermsLive(baseUrl);
        return { payload, source: "live" };
    } catch {
        return { payload: mockTerms(), source: "mock" };
    }
}

function SectionBlock({
    number,
    title,
    paragraphs,
    bullets,
}: {
    number: number;
    title: string;
    paragraphs: string[];
    bullets?: string[];
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-sm font-semibold text-slate-900">
                {number}. {title}
            </h2>

            <div className="mt-3 space-y-3 text-sm text-slate-700">
                {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                ))}

                {bullets && bullets.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                        {bullets.map((b, idx) => (
                            <li key={idx}>{b}</li>
                        ))}
                    </ul>
                ) : null}

                {number === 2 ? (
                    <p className="pt-1">
                        All maintenance actions remain the responsibility of appropriately certified personnel
                        and organizations.
                    </p>
                ) : null}
            </div>
        </section>
    );
}

export default async function TermsPage() {
    const { payload, source } = await loadTerms();

    return (
        <div className="bg-white">
            <div className="border-b border-slate-200 bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                SkyMaintain
                            </div>

                            <div className="mt-2 text-sm font-semibold text-slate-900">
                                Regulatory-Compliant AI Platform
                            </div>

                            <div className="mt-6 space-y-1">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Legal
                                </div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                                    Terms of Service
                                </h1>
                                <div className="mt-2 text-sm text-slate-600">
                                    Last Updated:{" "}
                                    <span className="font-medium text-slate-900">{payload.lastUpdated}</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-500">Source: {source}</div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <Link
                                href="/"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 py-10">
                <div className="grid gap-10 md:grid-cols-12">
                    <aside className="md:col-span-4 lg:col-span-3">
                        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Sections
                            </div>
                            <nav className="mt-3 space-y-2">
                                {payload.sections.map((s) => {
                                    const id = `section-${s.number}`;
                                    return (
                                        <a
                                            key={s.number}
                                            href={`#${id}`}
                                            className="block text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                        >
                                            {s.number}. {s.title}
                                        </a>
                                    );
                                })}
                                <a
                                    href="#important-notice"
                                    className="block text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Important Notice
                                </a>
                            </nav>

                            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="text-sm font-semibold text-slate-900">Commercial routing</div>
                                <p className="mt-1 text-sm text-slate-600">
                                    Pricing and procurement requests should route through the pricing intake.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
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
                            </div>
                        </div>
                    </aside>

                    <article className="md:col-span-8 lg:col-span-9">
                        <div className="space-y-5">
                            {payload.sections.map((s) => (
                                <div key={s.number} id={`section-${s.number}`} className="scroll-mt-24">
                                    <SectionBlock
                                        number={s.number}
                                        title={s.title}
                                        paragraphs={s.paragraphs}
                                        bullets={s.bullets}
                                    />
                                </div>
                            ))}

                            <section
                                id="important-notice"
                                className="scroll-mt-24 rounded-2xl border border-amber-200 bg-amber-50 p-5 md:p-6"
                            >
                                <h2 className="text-sm font-semibold text-slate-900">
                                    {payload.importantNoticeTitle}
                                </h2>
                                <p className="mt-3 text-sm text-slate-700">{payload.importantNoticeBody}</p>
                            </section>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                                <div className="text-sm font-semibold text-slate-900">Related</div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Link
                                        href="/privacy"
                                        className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <Link
                                        href="/compliance"
                                        className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                                    >
                                        Compliance Statement
                                    </Link>
                                    <Link
                                        href={CONTACT_GENERAL}
                                        className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                                    >
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}

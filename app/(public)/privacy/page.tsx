"use client";

import * as React from "react";
import { CONTACT_GENERAL } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";

type PolicySection = {
    heading: string;
    body: Array<
        | { type: "p"; text: string }
        | { type: "ul"; items: string[] }
        | { type: "note"; text: string }
    >;
};

type PrivacyPolicyDoc = {
    badge: string;
    title: string;
    effective_date: string;
    last_updated: string;
    lead: string;
    product_note: string;
    intro: string;
    sections: PolicySection[];
    questions_banner: {
        title: string;
        subtitle: string;
        cta_label: string;
        cta_href: string;
    };
};

type ApiEnvelope<T> = { ok: boolean; data: T; meta?: { request_id?: string } };

function cx(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
    if (raw === "mock" || raw === "live" || raw === "hybrid") return raw;
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
}

const DEFAULT_DOC: PrivacyPolicyDoc = {
    badge: "Privacy Policy",
    title: "SkyMaintain Privacy Policy",
    effective_date: "Effective Date: January 27, 2026",
    last_updated: "Last Updated: January 27, 2026",
    lead:
        'SkyMaintain ("SkyMaintain," "we," "us," or "our") respects your privacy and is committed to protecting the personal and operational information you share with us.',
    product_note: "SkyMaintain is a product of EncycloAMTs LLC.",
    intro:
        'This Privacy Policy explains how information is collected, used, disclosed, and protected when you access or use the SkyMaintain platform, website, or related services (collectively, the "Services").',
    sections: [
        {
            heading: "1. Scope of This Policy",
            body: [
                { type: "p", text: "This Privacy Policy applies to:" },
                {
                    type: "ul",
                    items: [
                        "The SkyMaintain website",
                        "The SkyMaintain SaaS platform",
                        "Trial, demo, and production environments",
                        "Communications with SkyMaintain (email, support, demos)",
                    ],
                },
                {
                    type: "p",
                    text: "This policy does not apply to third-party services you may access through integrations.",
                },
            ],
        },
        {
            heading: "2. Information We Collect",
            body: [
                { type: "p", text: "2.1 Information You Provide" },
                { type: "p", text: "We may collect information you voluntarily provide, including:" },
                {
                    type: "ul",
                    items: [
                        "Name",
                        "Business email address",
                        "Organization or company name",
                        "Job title or role",
                        "Support requests and communications",
                        "Account credentials",
                    ],
                },
                { type: "p", text: "2.2 Operational & Platform Data" },
                { type: "p", text: "When using the platform, SkyMaintain may process:" },
                {
                    type: "ul",
                    items: [
                        "Maintenance records or structured operational data uploaded by users",
                        "System usage data (features accessed, timestamps)",
                        "Configuration preferences",
                    ],
                },
                {
                    type: "note",
                    text:
                        "SkyMaintain does not require personally identifiable aircraft ownership data unless explicitly provided by the user.",
                },
                { type: "p", text: "2.3 Technical & Log Data" },
                { type: "p", text: "We may automatically collect:" },
                {
                    type: "ul",
                    items: [
                        "IP address",
                        "Browser type and device information",
                        "Session identifiers",
                        "Security logs and audit logs",
                    ],
                },
                {
                    type: "p",
                    text: "This data is used strictly for security, reliability, and platform improvement.",
                },
            ],
        },
        {
            heading: "3. How We Use Information",
            body: [
                { type: "p", text: "We use collected information to:" },
                {
                    type: "ul",
                    items: [
                        "Provide and operate the SkyMaintain platform",
                        "Authenticate users and manage accounts",
                        "Deliver support and respond to inquiries",
                        "Improve system performance and reliability",
                        "Maintain security and prevent misuse",
                        "Meet legal and contractual obligations",
                    ],
                },
            ],
        },
        {
            heading: "4. AI & Data Use Transparency",
            body: [
                { type: "p", text: "4.1 No Autonomous Decision-Making" },
                {
                    type: "p",
                    text:
                        "SkyMaintain provides AI-assisted decision support only. The platform does not make autonomous maintenance decisions.",
                },
                { type: "p", text: "4.2 No Model Training on Customer Data" },
                {
                    type: "p",
                    text: "Customer-provided data is not used to train AI models unless explicitly agreed to in writing.",
                },
                {
                    type: "p",
                    text:
                        "All AI outputs are generated for the specific user environment and are not shared across organizations.",
                },
            ],
        },
        {
            heading: "5. Data Sharing & Disclosure",
            body: [
                { type: "p", text: "We do not sell personal or operational data." },
                { type: "p", text: "We may share information only in the following circumstances:" },
                {
                    type: "ul",
                    items: [
                        "With trusted service providers (hosting, security, infrastructure)",
                        "To comply with legal obligations",
                        "To protect the rights, safety, or security of SkyMaintain, users, or others",
                        "With explicit user consent",
                    ],
                },
                { type: "p", text: "All service providers are contractually obligated to protect data confidentiality." },
            ],
        },
        {
            heading: "6. Data Security",
            body: [
                {
                    type: "p",
                    text: "SkyMaintain employs reasonable administrative, technical, and organizational safeguards, including:",
                },
                {
                    type: "ul",
                    items: [
                        "Encryption in transit and at rest",
                        "Role-based access controls",
                        "Secure authentication mechanisms",
                        "Audit logging and monitoring",
                    ],
                },
                {
                    type: "p",
                    text: "While no system is 100% secure, we actively work to protect your information.",
                },
            ],
        },
        {
            heading: "7. Data Retention",
            body: [
                { type: "p", text: "We retain information only as long as necessary to:" },
                {
                    type: "ul",
                    items: [
                        "Provide the Services",
                        "Meet legal, regulatory, or contractual obligations",
                        "Resolve disputes",
                        "Enforce agreements",
                    ],
                },
                {
                    type: "p",
                    text:
                        "Users may request deletion of their data, subject to legal or regulatory retention requirements.",
                },
            ],
        },
        {
            heading: "8. Your Rights & Choices",
            body: [
                { type: "p", text: "Depending on your jurisdiction, you may have the right to:" },
                {
                    type: "ul",
                    items: [
                        "Access your personal data",
                        "Correct inaccurate information",
                        "Request deletion of personal data",
                        "Object to certain processing activities",
                    ],
                },
                { type: "p", text: "Requests may be submitted to:" },
                { type: "p", text: "📧 privacy@skymaintain.ai" },
            ],
        },
        {
            heading: "9. Cookies & Tracking",
            body: [
                { type: "p", text: "SkyMaintain may use essential cookies necessary for platform functionality." },
                { type: "p", text: "We do not use third-party advertising trackers at this time." },
                {
                    type: "p",
                    text: "If analytics or optional cookies are introduced, this policy will be updated accordingly.",
                },
            ],
        },
        {
            heading: "10. International Users",
            body: [
                {
                    type: "p",
                    text:
                        "SkyMaintain is operated from the United States. By using the Services, you consent to the transfer and processing of information in the United States, subject to applicable safeguards.",
                },
            ],
        },
        {
            heading: "11. Children's Privacy",
            body: [
                {
                    type: "p",
                    text:
                        "SkyMaintain is intended for professional use only. We do not knowingly collect data from individuals under 18 years of age.",
                },
            ],
        },
        {
            heading: "12. Changes to This Policy",
            body: [
                {
                    type: "p",
                    text:
                        "We may update this Privacy Policy from time to time. Material changes will be communicated via the platform or website.",
                },
                {
                    type: "p",
                    text:
                        "Continued use of SkyMaintain after updates constitutes acceptance of the revised policy.",
                },
            ],
        },
        {
            heading: "13. Contact Information",
            body: [
                { type: "p", text: "For privacy-related inquiries, please contact:" },
                { type: "p", text: "SkyMaintain Privacy Team" },
                { type: "p", text: "📧 privacy@skymaintain.ai" },
                { type: "p", text: "EncycloAMTs LLC" },
                { type: "p", text: "United States" },
            ],
        },
    ],
    questions_banner: {
        title: "Questions about privacy?",
        subtitle: "We're committed to transparency and protecting your data.",
        cta_label: "Contact Us",
        cta_href: CONTACT_GENERAL,
    },
};

let mockStore: PrivacyPolicyDoc = structuredClone(DEFAULT_DOC);

async function apiGetPolicy(signal?: AbortSignal): Promise<PrivacyPolicyDoc> {
    const mode = getDataMode();

    if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 90));
        return structuredClone(mockStore);
    }

    const base = getApiBaseUrl();
    if (!base) {
        await new Promise((r) => setTimeout(r, 70));
        return structuredClone(mockStore);
    }

    const res = await fetch(`${base}/v1/public/privacy`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error(`GET /v1/public/privacy failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<PrivacyPolicyDoc>;
    if (!json?.ok || !json?.data) {
        if (mode === "hybrid") return structuredClone(mockStore);
        throw new Error("Unexpected response shape from GET /v1/public/privacy");
    }

    if (mode === "hybrid") mockStore = structuredClone(json.data);
    return json.data;
}

function SectionBlock({ section }: { section: PolicySection }): React.ReactElement {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">{section.heading}</h2>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                {section.body.map((b, idx) => {
                    if (b.type === "p") return <p key={idx}>{b.text}</p>;
                    if (b.type === "note")
                        return (
                            <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                                <span className="font-semibold">Important:</span> {b.text}
                            </div>
                        );
                    if (b.type === "ul")
                        return (
                            <ul key={idx} className="list-disc space-y-2 pl-5">
                                {b.items.map((it) => (
                                    <li key={it}>{it}</li>
                                ))}
                            </ul>
                        );
                    return null;
                })}
            </div>
        </div>
    );
}

export default function PrivacyPage(): React.ReactElement {
    const mode = getDataMode();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<PrivacyPolicyDoc>(structuredClone(DEFAULT_DOC));

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetPolicy(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load Privacy Policy.";
                setError(msg);
                setDoc(structuredClone(DEFAULT_DOC));
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    const content = loading ? DEFAULT_DOC : doc;

    return (
        <div className="w-full">
            <section className="rounded-2xl bg-gradient-to-b from-slate-50 to-white px-6 py-12 text-center">
                <div className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    {content.badge}
                </div>

                <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    {content.title}
                </h1>

                <div className="mx-auto mt-4 max-w-4xl space-y-2 text-sm text-slate-600">
                    <div>{content.effective_date}</div>
                    <div>{content.last_updated}</div>
                </div>

                <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
                    <p className="text-sm leading-relaxed text-slate-800">{content.lead}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{content.product_note}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">{content.intro}</p>
                </div>

                <div className="mt-4">
                    <span
                        className={cx(
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                            mode === "live"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : mode === "hybrid"
                                    ? "border-amber-200 bg-amber-50 text-amber-800"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                        )}
                        title="Data mode is controlled by NEXT_PUBLIC_DATA_MODE"
                    >
                        Data: {mode.toUpperCase()}
                    </span>
                </div>

                {error && (
                    <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {error}
                    </div>
                )}
            </section>

            <section className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6">
                {content.sections.map((s) => (
                    <SectionBlock key={s.heading} section={s} />
                ))}
            </section>

            <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-12 text-center text-white">
                    <h3 className="text-3xl font-semibold tracking-tight">{content.questions_banner.title}</h3>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90">{content.questions_banner.subtitle}</p>

                    <div className="mt-7">
                        <a
                            href={content.questions_banner.cta_href}
                            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                            {content.questions_banner.cta_label}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

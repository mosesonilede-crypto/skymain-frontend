"use client";

import * as React from "react";
import { CONTACT_DEMO, CONTACT_GENERAL, ContactIntent } from "@/lib/routes";

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

type ContactFormPayload = {
    intent: ContactIntent;
    name: string;
    email: string;
    organization?: string;
    subject: string;
    message: string;
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

function getQueryParam(name: string): string | null {
    if (typeof window === "undefined") return null;
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function parseIntent(raw: string | null): ContactIntent | null {
    if (!raw) return null;
    const v = raw.trim().toLowerCase();
    if (v === "pricing") return "pricing";
    if (v === "demo") return "demo";
    if (v === "support") return "support";
    if (v === "partnerships") return "partnerships";
    if (v === "general") return "general";
    return null;
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

async function apiSubmitContact(payload: ContactFormPayload): Promise<void> {
    const mode = getDataMode();

    if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 350));
        return;
    }

    const base = getApiBaseUrl();
    if (!base) {
        if (mode === "hybrid") {
            await new Promise((r) => setTimeout(r, 250));
            return;
        }
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set.");
    }

    const res = await fetch(`${base}/v1/public/contact`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        if (mode === "hybrid") return;
        throw new Error(`POST /v1/public/contact failed (${res.status})`);
    }

    const json = (await res.json()) as ApiEnvelope<{ received: true }>;
    if (!json?.ok) throw new Error("Unexpected response shape from POST /v1/public/contact");
}

function CardIcon({ variant }: { variant: "general" | "support" | "biz" }): React.ReactElement {
    const color =
        variant === "general" ? "text-blue-600" : variant === "support" ? "text-emerald-600" : "text-purple-600";

    return (
        <div className={cx("flex h-12 w-12 items-center justify-center rounded-xl border bg-white", "border-slate-200")}>
            <svg viewBox="0 0 24 24" className={cx("h-6 w-6", color)} fill="none" aria-hidden="true">
                {variant === "general" && (
                    <path
                        d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                )}
                {variant === "support" && (
                    <path
                        d="M4 8a8 8 0 0 1 16 0v4a4 4 0 0 1-4 4h-1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                )}
                {variant === "support" && (
                    <path
                        d="M6 12h2a2 2 0 0 0 2-2V8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                )}
                {variant === "biz" && (
                    <path
                        d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14M7 21v-8m10 8v-8M9 9h6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                )}
            </svg>
        </div>
    );
}

function intentLabel(intent: ContactIntent): string {
    switch (intent) {
        case "pricing":
            return "Pricing Request";
        case "demo":
            return "Demo Request";
        case "support":
            return "Support";
        case "partnerships":
            return "Business & Partnerships";
        default:
            return "General Inquiry";
    }
}

function defaultSubjectForIntent(intent: ContactIntent): string {
    switch (intent) {
        case "pricing":
            return "Pricing request";
        case "demo":
            return "Request a demo";
        case "support":
            return "Support request";
        case "partnerships":
            return "Partnership inquiry";
        default:
            return "General inquiry";
    }
}

export default function ContactPage(): React.ReactElement {
    const mode = getDataMode();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [doc, setDoc] = React.useState<ContactDoc>(structuredClone(DEFAULT_DOC));

    const [intent, setIntent] = React.useState<ContactIntent>("general");

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [organization, setOrganization] = React.useState("");
    const [subject, setSubject] = React.useState(defaultSubjectForIntent("general"));
    const [message, setMessage] = React.useState("");

    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [submitOk, setSubmitOk] = React.useState(false);

    React.useEffect(() => {
        const parsed = parseIntent(getQueryParam("intent"));
        if (parsed) {
            setIntent(parsed);
            setSubject(defaultSubjectForIntent(parsed));
        }
    }, []);

    React.useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetContact(ac.signal);
                setDoc(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Failed to load Contact page.";
                setError(msg);
                setDoc(structuredClone(DEFAULT_DOC));
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    React.useEffect(() => {
        const defaults = ["Pricing request", "Request a demo", "Support request", "Partnership inquiry", "General inquiry"];
        if (defaults.includes(subject)) setSubject(defaultSubjectForIntent(intent));
    }, [intent, subject]);

    const canSubmit =
        name.trim().length >= 2 &&
        email.trim().includes("@") &&
        subject.trim().length >= 3 &&
        message.trim().length >= 10;

    async function onSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        setSubmitError(null);
        setSubmitOk(false);

        if (!canSubmit) {
            setSubmitError("Please complete all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            const payload: ContactFormPayload = {
                intent,
                name: name.trim(),
                email: email.trim(),
                organization: organization.trim() ? organization.trim() : undefined,
                subject: subject.trim(),
                message: message.trim(),
            };

            await apiSubmitContact(payload);

            setSubmitOk(true);
            setName("");
            setEmail("");
            setOrganization("");
            setSubject(defaultSubjectForIntent(intent));
            setMessage("");
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Submission failed.");
        } finally {
            setSubmitting(false);
        }
    }

    const pricingMode = intent === "pricing";
    const heroHint = pricingMode
        ? "Tell us about your operation and we’ll respond with a pricing package aligned to fleet scale and integration scope."
        : doc.subhead;

    const primaryCtaLabel = pricingMode ? "Request Pricing" : "Submit Request";

    return (
        <div className="w-full">
            <section className="rounded-2xl bg-gradient-to-b from-slate-50 to-white px-6 py-12 text-center">
                <div className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    {doc.badge}
                </div>

                <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    {doc.headline}
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">{heroHint}</p>

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
                    <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {error}
                    </div>
                )}
            </section>

            <section className="mx-auto mt-10 max-w-5xl">
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-100" />
                                <div className="mt-6 h-6 w-2/3 animate-pulse rounded bg-slate-100" />
                                <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
                                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                                <div className="mt-6 h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {doc.cards.map((c) => {
                            const variant = c.title === "Support" ? "support" : c.title.startsWith("Business") ? "biz" : "general";
                            return (
                                <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                                    <div className="flex items-center justify-center">
                                        <CardIcon variant={variant} />
                                    </div>

                                    <h2 className="mt-6 text-center text-xl font-semibold text-slate-900">{c.title}</h2>
                                    <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">{c.description}</p>

                                    <div className="mt-6 flex items-center justify-center">
                                        <a
                                            href={`mailto:${c.email}`}
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            <span aria-hidden="true">✉</span>
                                            <span>{c.email}</span>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="mx-auto mt-10 max-w-5xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Submit a request</h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Select the request type and provide enough detail for a compliant, actionable response.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Intent</span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                                {intentLabel(intent)}
                            </span>
                        </div>
                    </div>

                    <form className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={onSubmit}>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-800">Request type</label>
                            <select
                                value={intent}
                                onChange={(e) => setIntent(e.target.value as ContactIntent)}
                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="general">General inquiry</option>
                                <option value="pricing">Pricing</option>
                                <option value="demo">Request a demo</option>
                                <option value="support">Support</option>
                                <option value="partnerships">Business & partnerships</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800">Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Business email"
                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-800">Organization (optional)</label>
                            <input
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                                placeholder="Operator / MRO / organization"
                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-800">Subject</label>
                            <input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-800">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={
                                    pricingMode
                                        ? "Describe fleet size, environment (airline/MRO/training), integration needs, and preferred timeline."
                                        : "Provide details so we can route and respond appropriately."
                                }
                                rows={6}
                                className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                We’ll respond using the contact information you provide. Do not include sensitive operational data.
                            </p>
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm">
                                {submitOk && (
                                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800">
                                        Request received. We’ll follow up shortly.
                                    </div>
                                )}
                                {submitError && (
                                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-rose-800">
                                        {submitError}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!canSubmit || submitting}
                                className={cx(
                                    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold",
                                    !canSubmit || submitting
                                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                )}
                            >
                                {submitting ? "Submitting..." : primaryCtaLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-12 text-center text-white">
                    <h3 className="text-3xl font-semibold tracking-tight">{doc.cta_band.headline}</h3>

                    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href={doc.cta_band.primary.href}
                            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                            {doc.cta_band.primary.label}
                        </a>

                        <a
                            href={doc.cta_band.secondary.href}
                            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
                        >
                            {doc.cta_band.secondary.label}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

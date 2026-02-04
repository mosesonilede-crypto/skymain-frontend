import Link from "next/link";
import { CONTACT_DEMO, CONTACT_PARTNERSHIPS, CONTACT_SUPPORT } from "@/lib/routes";

type Stat = { value: string; label: string };
type Capability = { title: string; description: string; href: string };
type Testimonial = { quote: string; name: string; title: string; company: string };
type PartnerAd = {
    badge: string;
    sponsoredLabel: string;
    name: string;
    quote: string;
    bullets: string[];
    ctaText: string;
    ctaHref: string;
    secondaryText?: string;
    secondaryHref?: string;
    devInfo: string;
};

const stats: Stat[] = [
    { value: "35%", label: "Reduction in Downtime" },
    { value: "99.8%", label: "Compliance Rate" },
    { value: "60%", label: "Faster Task Completion" },
    { value: "$250K", label: "Annual Cost Savings" },
];

const capabilities: Capability[] = [
    {
        title: "AI-Powered Predictive Analytics",
        description:
            "Advanced machine learning algorithms predict maintenance needs before failures occur, reducing unplanned downtime by up to 35%.",
        href: "/platform#predictive-analytics",
    },
    {
        title: "Regulatory Compliance Automation",
        description:
            "Automated tracking of FAA/EASA airworthiness directives with real-time alerts and compliance deadline management.",
        href: "/compliance#ad-tracking",
    },
    {
        title: "Real-Time IoT Monitoring",
        description:
            "Continuous aircraft health monitoring through integrated sensor data providing instant visibility into all critical systems.",
        href: "/platform#iot-monitoring",
    },
    {
        title: "Smart Maintenance Workflows",
        description:
            "Interactive digital checklists with photo documentation requirements and team collaboration features for efficient task management.",
        href: "/platform#workflows",
    },
];

const testimonials: Testimonial[] = [
    {
        quote:
            "SkyMaintain's AI predictions helped us avoid two major engine failures, saving over $400,000 in emergency repairs.",
        name: "Michael Rodriguez",
        title: "Director of Maintenance",
        company: "Global Airways",
    },
    {
        quote:
            "The regulatory compliance tracking is exceptional. We've achieved 100% AD compliance since implementation.",
        name: "Sarah Chen",
        title: "Fleet Manager",
        company: "Pacific Aviation",
    },
];

const partnerAds: PartnerAd[] = [
    {
        badge: "FEATURED PARTNER",
        sponsoredLabel: "Sponsored",
        name: "GlobalAero Airlines",
        quote:
            "Partnering with the world's leading carriers. Experience excellence in aviation with our premium fleet services and 24/7 maintenance support.",
        bullets: ["500+ Aircraft Fleet", "Global Coverage", "ISO Certified"],
        ctaText: "Learn More",
        ctaHref: "/partners/globalaero",
        devInfo:
            "Ad ID: ad-001-globalaero | Contract: 2026-01-01 to 2026-12-31 | Annual contract - Premium airline partner",
    },
    {
        badge: "INDUSTRY PARTNER",
        sponsoredLabel: "Sponsored",
        name: "AeroTech Parts & Supply",
        quote:
            "Your trusted source for certified aircraft parts and components. Fast delivery, competitive pricing, and unmatched quality assurance.",
        bullets: ["FAA/EASA Certified", "24-Hour Shipping", "50,000+ Parts"],
        secondaryText: "Special Offer: 15% Off First Order - Use Code: SKYMAINT15",
        secondaryHref: "/partners/aerotech#offer",
        ctaText: "Shop Parts Catalog",
        ctaHref: "/partners/aerotech",
        devInfo:
            "Ad ID: ad-002-aerotech | Contract: 2026-01-15 to 2026-07-15 | 6-month contract with promo code tracking",
    },
];

const faqs: { q: string; a: string }[] = [
    {
        q: "Does SkyMaintain replace approved maintenance manuals?",
        a:
            "No.\n\nSkyMaintain does not replace AMM, MEL, SRM, IPC, or any approved maintenance documentation.\n\nSkyMaintain works with the manuals you are authorized to use and assists by organizing, cross-referencing, and interpreting them. The manuals remain the sole technical authority.",
    },
    {
        q: "Does SkyMaintain need FAA or EASA approval?",
        a:
            "No.\n\nSkyMaintain is a maintenance decision-support tool, not a maintenance approval or certification system.\n\nIt does not issue approvals, certify work, modify aircraft configuration, or replace regulatory authority. Therefore, FAA or EASA approval is not required.",
    },
    {
        q: "Can SkyMaintain give answers without manuals?",
        a:
            'No.\n\nSkyMaintain enforces a strict "No Docs, No Answer" rule.\n\nIf no applicable, authorized manual is available, the AI Mechanic will refuse to answer and will instead tell the user which documents are required to proceed.',
    },
    {
        q: "Where do the manuals come from?",
        a:
            "Manuals are provided by your organization based on authorized access and controlled document distribution. SkyMaintain does not source manuals independently.",
    },
    {
        q: "Does SkyMaintain store or modify original manuals?",
        a:
            "SkyMaintain does not modify original manuals. Document handling preserves source integrity while enabling controlled indexing and traceable retrieval.",
    },
    {
        q: "How does SkyMaintain ensure accuracy?",
        a:
            "Outputs are designed to be traceable and governed by policy boundaries. Human authority remains the final decision point.",
    },
    {
        q: "Who is responsible for the maintenance decision?",
        a:
            "The authorized maintenance organization and certifying personnel remain responsible. SkyMaintain provides decision support, not approvals or sign-off authority.",
    },
    {
        q: "Can SkyMaintain be used in regulated airline or MRO environments?",
        a:
            "Yes. The platform is designed for compliance-driven workflows, auditability, and governance controls typical in airline and MRO environments.",
    },
    {
        q: "Is SkyMaintain an AI chatbot?",
        a:
            "No. SkyMaintain is an enterprise decision-support platform built for regulated aviation maintenance, including guided workflows, traceable outputs, and governance controls.",
    },
    {
        q: "What happens if the wrong document or revision is uploaded?",
        a:
            "SkyMaintain surfaces document identity and revision context. If inconsistencies are detected, users are prompted to correct the source set before proceeding.",
    },
];

export default function GetStartedPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <main>
                {/* HERO (purple) */}
                <section className="relative overflow-hidden">
                    <div aria-hidden="true" className="absolute inset-0">
                        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-violet-200/60 blur-3xl" />
                        <div className="absolute right-[-260px] top-[80px] h-[520px] w-[700px] rounded-full bg-fuchsia-200/50 blur-3xl" />
                    </div>

                    <div className="relative">
                        <div className="mx-auto max-w-6xl px-6 pt-16">
                            <div className="mx-auto max-w-4xl text-center">
                                <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Regulatory-Compliant AI Platform
                                </div>

                                <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                                    AI-Powered Predictive Aircraft Maintenance
                                </h1>

                                <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-slate-600 md:text-xl">
                                    Built for Safety, Compliance, and Scale
                                </p>

                                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Link
                                        href="/signin"
                                        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 sm:w-auto"
                                    >
                                        Start Your Free Trial
                                    </Link>
                                    <Link
                                        href={CONTACT_DEMO}
                                        className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 sm:w-auto"
                                    >
                                        Request Demo
                                    </Link>
                                </div>

                                <div className="mt-4 text-sm text-slate-600">
                                    <span className="inline-flex items-center gap-2">
                                        <Dot /> 14-day free trial
                                    </span>
                                    <span className="mx-3 text-slate-300">•</span>
                                    <span className="inline-flex items-center gap-2">
                                        <Dot /> No credit card required
                                    </span>
                                    <span className="mx-3 text-slate-300">•</span>
                                    <span className="inline-flex items-center gap-2">
                                        <Dot /> Full platform access
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Purple band with stats */}
                        <div className="mt-14 bg-gradient-to-r from-violet-700 via-fuchsia-700 to-violet-700">
                            <div className="mx-auto max-w-6xl px-6 py-10">
                                <div className="grid grid-cols-2 gap-4 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 sm:grid-cols-4">
                                    {stats.map((s) => (
                                        <div key={s.label} className="rounded-2xl bg-white/10 px-4 py-4">
                                            <div className="text-2xl font-semibold tracking-tight text-white">
                                                {s.value}
                                            </div>
                                            <div className="mt-1 text-xs text-white/80">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURED PARTNER */}
                <section className="bg-white">
                    <div className="mx-auto max-w-6xl px-6 py-12">
                        <PartnerAdCard ad={partnerAds[0]} tone="blue" />
                    </div>
                </section>

                {/* CAPABILITIES */}
                <section className="bg-white">
                    <div className="mx-auto max-w-6xl px-6 pb-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Platform Capabilities
                            </div>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                                Comprehensive AI-Driven Maintenance Solution
                            </h2>
                            <p className="mt-3 text-sm text-slate-600 md:text-base">
                                Built specifically for aviation maintenance operations with regulatory compliance at its core
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            {capabilities.map((c, idx) => (
                                <div key={c.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                                            {idx === 0 ? <WaveIcon className="h-5 w-5 text-violet-700" /> : null}
                                            {idx === 1 ? <BadgeIcon className="h-5 w-5 text-emerald-700" /> : null}
                                            {idx === 2 ? <PulseIcon className="h-5 w-5 text-blue-700" /> : null}
                                            {idx === 3 ? <ChecklistIcon className="h-5 w-5 text-amber-700" /> : null}
                                        </span>

                                        <div>
                                            <h3 className="text-lg font-semibold tracking-tight text-slate-900">{c.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.description}</p>
                                            <div className="mt-4">
                                                <Link href={c.href} className="text-sm font-semibold text-slate-900 hover:underline">
                                                    Learn More <span aria-hidden="true">→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CUSTOMER SUCCESS */}
                <section className="bg-slate-50">
                    <div className="mx-auto max-w-6xl px-6 py-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Customer Success
                            </div>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                                Trusted by Aviation Professionals
                            </h2>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            {testimonials.map((t) => (
                                <div key={t.name} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                    <p className="text-sm leading-relaxed text-slate-700">“{t.quote}”</p>
                                    <div className="mt-6 flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                                            <div className="text-xs text-slate-600">{t.title}</div>
                                        </div>
                                        <div className="text-xs font-semibold text-slate-700">{t.company}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* INDUSTRY PARTNER */}
                <section className="bg-white">
                    <div className="mx-auto max-w-6xl px-6 py-12">
                        <PartnerAdCard ad={partnerAds[1]} tone="orange" />
                    </div>
                </section>

                {/* INDUSTRY PARTNERS */}
                <section className="bg-white">
                    <div className="mx-auto max-w-6xl px-6 py-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Industry Partners
                            </div>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                                Connecting Aviation Excellence
                            </h2>
                            <p className="mt-3 text-sm text-slate-600 md:text-base">
                                Featured partners providing trusted solutions to the aviation maintenance community
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sponsored</div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        Sponsored
                                    </span>
                                </div>
                                <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                                    AeroTech Solutions
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    Advanced diagnostic tools and predictive analytics for modern aircraft fleets.
                                </p>
                                <div className="mt-6 flex items-center justify-between gap-4">
                                    <Link
                                        href="/partners/aerotech-solutions"
                                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                                    >
                                        Learn More
                                    </Link>
                                    <span className="text-xs text-slate-500">
                                        Sponsored content. SkyMaintain does not endorse products.
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-7 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                                        Partner Slot Available
                                    </div>
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15">
                                        Sponsored
                                    </span>
                                </div>
                                <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                                    Partner Slot Available
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-white/80">
                                    Join our network of industry partners and reach aviation maintenance professionals worldwide.
                                </p>
                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <Link
                                        href={CONTACT_PARTNERSHIPS}
                                        className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
                                    >
                                        Become a Partner
                                    </Link>
                                    <span className="text-xs text-white/60">
                                        Sponsored content. SkyMaintain does not endorse products.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Partner disclosure */}
                        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Partner Disclosure
                            </div>
                            <p className="mt-2 leading-relaxed">
                                SkyMaintain displays sponsored partner content. Sponsorship does not influence AI responses, maintenance
                                recommendations, or compliance assessments. All partnerships are reviewed for aviation industry relevance
                                and quality standards.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-white">
                    <div className="mx-auto max-w-6xl px-6 py-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Compliance &amp; Trust — Frequently Asked Questions
                            </div>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                                How SkyMaintain supports maintenance professionals safely, responsibly, and in line with regulations.
                            </h2>
                        </div>

                        <div className="mt-10 space-y-3">
                            {faqs.map((f) => (
                                <details
                                    key={f.q}
                                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                                        <span className="text-sm font-semibold text-slate-900">{f.q}</span>
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-transform group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>
                                    <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                                        {f.a}
                                    </div>
                                </details>
                            ))}
                        </div>

                        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Have more questions?</div>
                                    <div className="text-sm text-slate-600">Contact our compliance team</div>
                                </div>
                                <Link
                                    href={CONTACT_SUPPORT}
                                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA (purple) */}
                <section className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-violet-700">
                    <div className="mx-auto max-w-6xl px-6 py-14">
                        <div className="grid gap-8 md:grid-cols-2 md:items-center">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-white/80">
                                    Ready to Transform Your Maintenance Operations?
                                </div>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                    Join 50+ airlines and operators using SkyMaintain to improve safety, reduce costs, and ensure 100%
                                    regulatory compliance.
                                </h2>
                                <div className="mt-4 text-sm text-white/80">
                                    ✓ 14-day free trial • ✓ No credit card required • ✓ Full platform access
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
                                <Link
                                    href="/trial"
                                    className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
                                >
                                    Start Your Free Trial
                                </Link>
                                <Link
                                    href={CONTACT_DEMO}
                                    className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-4 text-base font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
                                >
                                    Schedule a Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

/* ---------------- components ---------------- */

function PartnerAdCard({
    ad,
    tone,
}: {
    ad: PartnerAd;
    tone: "blue" | "orange";
}) {
    const badgeBg = tone === "orange" ? "bg-orange-50" : "bg-blue-50";
    const badgeText = tone === "orange" ? "text-orange-700" : "text-blue-700";
    const badgeRing = tone === "orange" ? "ring-orange-200" : "ring-blue-200";

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                            {ad.badge}
                        </span>
                        <span className={`rounded-full ${badgeBg} px-3 py-1 text-xs font-semibold ${badgeText} ring-1 ${badgeRing}`}>
                            {ad.sponsoredLabel}
                        </span>
                    </div>

                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{ad.name}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                        “{ad.quote}”
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {ad.bullets.map((b) => (
                            <span
                                key={b}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                            >
                                {b}
                            </span>
                        ))}
                    </div>

                    {ad.secondaryText ? (
                        <div className="mt-4 text-sm font-semibold text-slate-900">
                            <Link href={ad.secondaryHref ?? "#"} className="hover:underline">
                                {ad.secondaryText}
                            </Link>
                        </div>
                    ) : null}

                    <div className="mt-5">
                        <Link href={ad.ctaHref} className="text-sm font-semibold text-slate-900 hover:underline">
                            {ad.ctaText} <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>

                <div className="md:pt-1">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">DEV INFO:</div>
                    <div className="mt-2 max-w-md text-xs text-slate-500">{ad.devInfo}</div>
                </div>
            </div>
        </div>
    );
}

function Dot() {
    return <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />;
}

/* ---------------- icons (no external deps) ---------------- */

function WaveIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 8c3 0 3-2 6-2s3 2 6 2 3-2 6-2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 14c3 0 3-2 6-2s3 2 6 2 3-2 6-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function BadgeIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4l3-3z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 12.2l2.2 2.2 4.8-4.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PulseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 12h4l2-6 4 12 2-6h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ChecklistIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 6h12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12h12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 18h12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 6l1.5 1.5L7.5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 12l1.5 1.5L7.5 11" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 18l1.5 1.5L7.5 17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

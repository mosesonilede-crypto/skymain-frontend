import Link from "next/link";

import { CONTACT_DEMO } from "@/lib/routes";

const iconBadge = "https://www.figma.com/api/mcp/asset/fb365520-68d7-47d6-8419-3d34ef6e46c7";
const iconArrow = "https://www.figma.com/api/mcp/asset/7ad69a69-38b2-41dc-99e9-c1478ea111a8";
const iconBlue = "https://www.figma.com/api/mcp/asset/b24d705e-368f-410d-abce-453b975831cf";
const iconGreen = "https://www.figma.com/api/mcp/asset/353735e6-f732-4d5f-877a-a749c330401e";
const iconPurple = "https://www.figma.com/api/mcp/asset/394ea64f-dbf3-4f8b-bead-065b350a6328";
const iconViolet = "https://www.figma.com/api/mcp/asset/448d3829-b161-4afd-9c7d-aa471443664d";
const iconAmber = "https://www.figma.com/api/mcp/asset/5f18e9ea-4e71-4b2e-b9c4-27bbc9eaf37e";
const iconBlueAlt = "https://www.figma.com/api/mcp/asset/06380371-3b04-4409-a57c-c7ab2360f430";
const iconGreenAlt = "https://www.figma.com/api/mcp/asset/610881b8-4623-4401-aab6-dda41d8cb308";
const iconLavender = "https://www.figma.com/api/mcp/asset/dd9125a0-e766-4639-8e6f-6bd3f30a055e";
const iconIndigo = "https://www.figma.com/api/mcp/asset/07aceece-5206-45c9-87aa-7f9ea94e5707";
const iconRose = "https://www.figma.com/api/mcp/asset/4902465b-7003-4294-9257-b791f8b7cda4";
const iconCircleBlue = "https://www.figma.com/api/mcp/asset/841e4c4d-e2de-4149-96a1-a744253bae6a";
const iconCircleGreen = "https://www.figma.com/api/mcp/asset/e3b27890-b97d-4a41-adcf-88acca6bebd5";
const iconCirclePurple = "https://www.figma.com/api/mcp/asset/36fe6bbc-b25f-439f-96ab-f27a0e40e9c8";
const iconCircleAmber = "https://www.figma.com/api/mcp/asset/17d04944-b0ce-446a-b942-0a31db46eff1";
const iconCircleViolet = "https://www.figma.com/api/mcp/asset/62e4aa8f-cfd7-4465-ae17-590c9f576393";
const iconCircleRose = "https://www.figma.com/api/mcp/asset/f707a4cc-dc3d-48ee-af51-856785be6d22";
const iconCardBlue = "https://www.figma.com/api/mcp/asset/031aef08-7a5b-463c-adda-e9b5a01e356d";

export const metadata = {
    title: "SkyMaintain | Enterprise Aircraft Maintenance Intelligence",
    description:
        "Regulatory-grade, deterministic, and auditable AI decision support for aircraft maintenance operations.",
};

export default function PublicHomePage() {
    return (
        <div className="bg-gradient-to-b from-slate-50 to-white">
            <section className="mx-auto max-w-[1084px] px-8 pb-24 pt-16 text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
                    <img src={iconBadge} alt="" className="h-4 w-4" />
                    <span>Enterprise Aircraft Maintenance Intelligence</span>
                </div>

                <h1 className="mt-8 text-5xl font-bold leading-[1.15] text-slate-900 md:text-6xl">
                    Regulatory-Grade AI for
                    <br />
                    Aircraft Maintenance Operations
                </h1>

                <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-600">
                    Deterministic, auditable, and policy-aligned decision support for airlines, MROs, and regulated maintenance
                    environments.
                </p>

                <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-500">
                    Designed to support compliance-driven maintenance workflows without compromising human authority, safety, or
                    regulatory accountability.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href={CONTACT_DEMO}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-8 py-4 text-lg font-medium text-white"
                    >
                        Request Enterprise Demo
                        <img src={iconArrow} alt="" className="h-4 w-4" />
                    </Link>

                    <Link
                        href="#capabilities"
                        className="inline-flex items-center rounded-lg border border-black/10 bg-white px-8 py-4 text-lg font-medium text-slate-950"
                    >
                        View Platform Capabilities
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-[1024px] rounded-2xl bg-slate-900 px-8 py-8 text-center text-white">
                <h2 className="text-2xl font-bold">Built for Aviation. Designed for Accountability.</h2>
                <p className="mx-auto mt-4 max-w-4xl text-lg text-slate-200">
                    SkyMaintain is not a general-purpose AI tool. It is an enterprise maintenance intelligence platform engineered
                    for environments governed by FAA, EASA, and organizational maintenance control requirements.
                </p>
                <p className="mx-auto mt-3 max-w-4xl text-lg text-white">
                    Every output is traceable. Every decision is explainable. Every workflow respects regulatory boundaries.
                </p>
            </section>

            <section id="capabilities" className="mx-auto max-w-[1084px] px-8 py-24">
                <h2 className="text-center text-3xl font-bold text-slate-900">
                    Operational Intelligence for Aircraft Maintenance
                </h2>

                <div className="mt-12 grid gap-8 md:grid-cols-2">
                    {[
                        {
                            title: "Deterministic Maintenance Reasoning",
                            body: "SkyMaintain provides AI-assisted reasoning grounded exclusively in approved technical documentation, maintenance data, and policy constraints. Outputs are deterministic, explainable, and suitable for regulated decision-support use.",
                            icon: iconBlue,
                            tint: "bg-blue-50",
                        },
                        {
                            title: "Policy-Aligned Decision Support",
                            body: "All recommendations are generated within clearly defined policy boundaries, ensuring alignment with organizational procedures, regulatory requirements, and approved maintenance practices. No autonomous actions. No opaque logic. Human authority remains absolute.",
                            icon: iconGreen,
                            tint: "bg-emerald-50",
                        },
                        {
                            title: "Source-Anchored Traceability",
                            body: "Every response is linked to its originating technical sources, enabling engineers, inspectors, and auditors to review, validate, and defend decisions with confidence. This supports internal audits, regulatory reviews, and quality assurance processes.",
                            icon: iconPurple,
                            tint: "bg-violet-50",
                        },
                        {
                            title: "Predictive Maintenance Alerts (Advisory Only)",
                            body: "SkyMaintain surfaces predictive insights based on historical and operational data trends to support maintenance planning and risk awareness. Alerts are advisory, not prescriptive—designed to inform engineers, not replace judgment.",
                            icon: iconViolet,
                            tint: "bg-amber-50",
                        },
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-8">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.tint}`}>
                                <img src={item.icon} alt="" className="h-6 w-6" />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-slate-900">{item.title}</h3>
                            <p className="mt-3 text-base text-slate-600">{item.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto max-w-[1084px] px-8 py-20 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Why SkyMaintain Is Different</h2>
                    <p className="mx-auto mt-4 max-w-3xl text-xl text-slate-600">
                        Most AI platforms prioritize speed and automation. SkyMaintain prioritizes safety, traceability, and
                        regulatory confidence.
                    </p>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {[
                            {
                                title: "Built for Regulated Aviation",
                                body: "Specifically engineered for regulated aviation maintenance environments",
                                icon: iconCircleBlue,
                                tint: "bg-blue-100",
                            },
                            {
                                title: "Deterministic Outputs",
                                body: "Outputs suitable for audit and regulatory review",
                                icon: iconCircleGreen,
                                tint: "bg-emerald-100",
                            },
                            {
                                title: "No Black-Box ML",
                                body: "No black-box machine learning in safety-critical decision paths",
                                icon: iconCirclePurple,
                                tint: "bg-violet-100",
                            },
                            {
                                title: "Human-in-the-Loop",
                                body: "Human-in-the-loop design by default",
                                icon: iconCircleAmber,
                                tint: "bg-amber-100",
                            },
                            {
                                title: "Clear Separation",
                                body: "Advisory intelligence separated from maintenance authority",
                                icon: iconCircleViolet,
                                tint: "bg-indigo-100",
                            },
                            {
                                title: "Safety First",
                                body: "Safety and accountability over automation speed",
                                icon: iconCircleRose,
                                tint: "bg-rose-100",
                            },
                        ].map((item) => (
                            <div key={item.title} className="flex flex-col items-center gap-4 px-4 py-6">
                                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${item.tint}`}>
                                    <img src={item.icon} alt="" className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-600">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1084px] px-8 py-24">
                <h2 className="text-center text-3xl font-bold text-slate-900">
                    Designed for Regulated Maintenance Environments
                </h2>

                <div className="mt-12 grid gap-8 md:grid-cols-4">
                    {[
                        {
                            title: "Regulatory Alignment",
                            body: "Designed with FAA and EASA maintenance philosophies in mind, supporting Part 145, airline, and CAMO operational structures.",
                            icon: iconCircleBlue,
                            tint: "bg-blue-50",
                        },
                        {
                            title: "Audit-Ready Architecture",
                            body: "Every interaction is logged, traceable, and reviewable to support quality systems, audits, and compliance oversight.",
                            icon: iconCircleGreen,
                            tint: "bg-emerald-50",
                        },
                        {
                            title: "Security & Tenant Isolation",
                            body: "Enterprise-grade access control, organization-level isolation, and role-based permissions protect operational integrity.",
                            icon: iconCirclePurple,
                            tint: "bg-violet-50",
                        },
                        {
                            title: "Operational Transparency",
                            body: "No hidden decision logic. No uncontrolled automation. SkyMaintain operates as a controlled, inspectable system.",
                            icon: iconCircleAmber,
                            tint: "bg-amber-50",
                        },
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-6 text-center">
                            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${item.tint}`}>
                                <img src={item.icon} alt="" className="h-7 w-7" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-slate-900">{item.title}</h3>
                            <p className="mt-4 text-sm text-slate-600">{item.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto max-w-[1084px] px-8 py-20">
                    <h2 className="text-center text-3xl font-bold text-slate-900">
                        Supporting Maintenance Across the Operation
                    </h2>

                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        {[
                            {
                                title: "Maintenance Engineering",
                                body: "Assist engineers in interpreting manuals, troubleshooting recurring defects, and validating maintenance pathways using traceable references.",
                                icon: iconBlueAlt,
                                tint: "bg-blue-50",
                            },
                            {
                                title: "Maintenance Control & Planning",
                                body: "Support informed planning decisions with advisory insights derived from operational patterns and historical data.",
                                icon: iconGreenAlt,
                                tint: "bg-emerald-50",
                            },
                            {
                                title: "Quality Assurance & Compliance",
                                body: "Enable transparent review of AI-assisted decisions with full traceability for internal and external audits.",
                                icon: iconLavender,
                                tint: "bg-violet-50",
                            },
                            {
                                title: "Technical Leadership",
                                body: "Provide leadership with confidence that digital intelligence supports—not undermines—regulatory accountability.",
                                icon: iconIndigo,
                                tint: "bg-amber-50",
                            },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-8">
                                <div className="flex items-start gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.tint}`}>
                                        <img src={item.icon} alt="" className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                        <p className="mt-3 text-base text-slate-600">{item.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950">
                <div className="mx-auto max-w-[1148px] px-8 py-20 text-center text-white">
                    <h2 className="text-3xl font-bold">AI That Respects Aviation Realities</h2>
                    <p className="mx-auto mt-6 max-w-4xl text-xl text-blue-100">
                        SkyMaintain is engineered with the understanding that aircraft maintenance is not a domain for
                        experimentation.
                    </p>
                    <p className="mx-auto mt-4 max-w-4xl text-xl text-blue-100">
                        It is a controlled, high-consequence environment where technology must enhance discipline, not bypass it.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-[896px] px-8 py-24 text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                    Evaluate SkyMaintain for Your Maintenance Operation
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600">
                    See how a deterministic, audit-ready AI platform can support compliance-driven aircraft maintenance without
                    compromising safety, authority, or regulatory trust.
                </p>
                <div className="mt-10 flex justify-center">
                    <Link
                        href={CONTACT_DEMO}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-8 py-4 text-lg font-medium text-white"
                    >
                        Schedule a Technical Walkthrough
                        <img src={iconArrow} alt="" className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

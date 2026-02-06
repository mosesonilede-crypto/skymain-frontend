/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 122:24
 * specHash: sha256:main-landing-page-v1
 */

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";

// Figma assets for main landing page (node 122:24)
const imgLogo = "https://www.figma.com/api/mcp/asset/939d6895-e188-4c6a-9a81-e9f7b56b6c7d";
const imgBadgeIcon = "https://www.figma.com/api/mcp/asset/e0ae766b-7a5a-46f9-bd69-192a0cda41e2";
const imgArrowIcon = "https://www.figma.com/api/mcp/asset/d6f65647-ba5e-4535-b693-43f4051c83c8";

// Feature card icons
const imgIconDeterministic = "https://www.figma.com/api/mcp/asset/3ce4cea8-59d4-4126-887b-6463468ad821";
const imgIconPolicy = "https://www.figma.com/api/mcp/asset/b3b36910-7498-4164-b455-835964b9fbe8";
const imgIconTraceability = "https://www.figma.com/api/mcp/asset/2cff7679-845e-4a94-9547-ba1b283ef279";
const imgIconPredictive = "https://www.figma.com/api/mcp/asset/7c494395-abb7-493a-a0b7-92be3b11a157";

// Differentiator icons
const imgIconRegulated = "https://www.figma.com/api/mcp/asset/73d8cfdc-1a01-425e-864a-bb5ad1848aa9";
const imgIconOutputs = "https://www.figma.com/api/mcp/asset/7974906a-01fc-412b-9d27-7e91408f7fbf";
const imgIconNoBlackBox = "https://www.figma.com/api/mcp/asset/7a41edb6-877b-48b7-84b9-a9486166db05";
const imgIconHuman = "https://www.figma.com/api/mcp/asset/6ea5bdc2-8ad5-43e2-a6aa-5d5bece6896a";
const imgIconSeparation = "https://www.figma.com/api/mcp/asset/ec2bdc3a-6cd4-4e6e-ab74-172946c42def";
const imgIconSafety = "https://www.figma.com/api/mcp/asset/6cad8ada-44e8-4ac3-aaab-70a57dfc398a";

// Environment card icons
const imgIconRegulatoryAlign = "https://www.figma.com/api/mcp/asset/dc47e107-ee38-47ea-852e-7b85e1af3019";
const imgIconAudit = "https://www.figma.com/api/mcp/asset/d8f54e16-8a22-41a8-8f46-f3f66b12fe5c";
const imgIconSecurityTenant = "https://www.figma.com/api/mcp/asset/d094e828-f5e5-4e25-9a36-ceec3174f8d4";
const imgIconTransparency = "https://www.figma.com/api/mcp/asset/0ee240b2-071a-453c-b4ff-6cf4e6444612";

// Use case icons
const imgIconEngineering = "https://www.figma.com/api/mcp/asset/8306a2db-84f3-41bb-b893-784d891e62d4";
const imgIconPlanning = "https://www.figma.com/api/mcp/asset/e989c93c-9b85-4d15-b529-87973b83045a";
const imgIconQuality = "https://www.figma.com/api/mcp/asset/d5b50c2a-3304-4207-a31b-8e127755cb57";
const imgIconLeadership = "https://www.figma.com/api/mcp/asset/9434e4f9-ae3d-40a0-b57d-6e9f19466132";

export const metadata: Metadata = {
    title: "SkyMaintain | Regulatory-Grade AI for Aircraft Maintenance",
    description:
        "Deterministic, auditable, and policy-aligned decision support for airlines, MROs, and regulated maintenance environments.",
};

export default function MainLandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="mx-auto max-w-[1084px] px-8 pb-20 pt-16 text-center">
                {/* Badge */}
                <div className="mx-auto inline-flex items-center gap-3 rounded-full bg-blue-50 px-4 py-1.5">
                    <img src={imgBadgeIcon} alt="" className="h-4 w-4" />
                    <span className="text-sm font-medium text-blue-600">
                        Enterprise Aircraft Maintenance Intelligence
                    </span>
                </div>

                {/* Headline */}
                <h1 className="mt-10 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
                    Regulatory-Grade AI for
                    <br />
                    Aircraft Maintenance Operations
                </h1>

                {/* Subheadline */}
                <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-600">
                    Deterministic, auditable, and policy-aligned decision support for airlines, MROs, and regulated
                    maintenance environments.
                </p>

                {/* Supporting text */}
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Designed to support compliance-driven maintenance workflows without compromising human authority,
                    safety, or regulatory accountability.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/get-started"
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-8 py-5 text-lg font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        Get Started
                        <img src={imgArrowIcon} alt="" className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/contact?intent=demo"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-5 text-lg font-medium text-slate-900 transition-colors hover:bg-slate-50"
                    >
                        Request Enterprise Demo
                    </Link>
                </div>
            </section>

            {/* Built for Aviation Section */}
            <section className="bg-slate-900 py-12">
                <div className="mx-auto max-w-[1024px] px-8 text-center">
                    <h2 className="text-3xl font-bold text-white">
                        Built for Aviation. Designed for Accountability.
                    </h2>
                    <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-slate-300">
                        SkyMaintain is not a general-purpose AI tool. It is an enterprise maintenance intelligence
                        platform engineered for environments governed by FAA, EASA, and organizational maintenance
                        control requirements.
                    </p>
                    <p className="mt-4 text-lg text-white">
                        Every output is traceable. Every decision is explainable. Every workflow respects regulatory
                        boundaries.
                    </p>
                </div>
            </section>

            {/* Operational Intelligence Section */}
            <section className="mx-auto max-w-[1084px] px-8 py-20">
                <h2 className="text-center text-4xl font-bold text-slate-900">
                    Operational Intelligence for Aircraft Maintenance
                </h2>

                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    {/* Card 1 - Deterministic Maintenance Reasoning */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                            <img src={imgIconDeterministic} alt="" className="h-6 w-6" />
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-slate-900">
                            Deterministic Maintenance Reasoning
                        </h3>
                        <p className="mt-12 text-base leading-relaxed text-slate-600">
                            SkyMaintain provides AI-assisted reasoning grounded exclusively in approved technical
                            documentation, maintenance data, and policy constraints. Outputs are deterministic,
                            explainable, and suitable for regulated decision-support use.
                        </p>
                    </div>

                    {/* Card 2 - Policy-Aligned Decision Support */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                            <img src={imgIconPolicy} alt="" className="h-6 w-6" />
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-slate-900">
                            Policy-Aligned Decision Support
                        </h3>
                        <p className="mt-12 text-base leading-relaxed text-slate-600">
                            All recommendations are generated within clearly defined policy boundaries, ensuring
                            alignment with organizational procedures, regulatory requirements, and approved maintenance
                            practices. No autonomous actions. No opaque logic. Human authority remains absolute.
                        </p>
                    </div>

                    {/* Card 3 - Source-Anchored Traceability */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                            <img src={imgIconTraceability} alt="" className="h-6 w-6" />
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-slate-900">Source-Anchored Traceability</h3>
                        <p className="mt-12 text-base leading-relaxed text-slate-600">
                            Every response is linked to its originating technical sources, enabling engineers,
                            inspectors, and auditors to review, validate, and defend decisions with confidence. This
                            supports internal audits, regulatory reviews, and quality assurance processes.
                        </p>
                    </div>

                    {/* Card 4 - Predictive Maintenance Alerts */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                            <img src={imgIconPredictive} alt="" className="h-6 w-6" />
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-slate-900">
                            Predictive Maintenance Alerts (Advisory Only)
                        </h3>
                        <p className="mt-12 text-base leading-relaxed text-slate-600">
                            SkyMaintain surfaces predictive insights based on historical and operational data trends to
                            support maintenance planning and risk awareness. Alerts are advisory, not
                            prescriptive—designed to inform engineers, not replace judgment.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why SkyMaintain Is Different Section */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-[1024px] px-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-slate-900">Why SkyMaintain Is Different</h2>
                        <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-600">
                            Most AI platforms prioritize speed and automation. SkyMaintain prioritizes safety,
                            traceability, and regulatory confidence.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Differentiator 1 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <img src={imgIconRegulated} alt="" className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Built for Regulated Aviation</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Specifically engineered for regulated aviation maintenance environments
                            </p>
                        </div>

                        {/* Differentiator 2 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <img src={imgIconOutputs} alt="" className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Deterministic Outputs</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Outputs suitable for audit and regulatory review
                            </p>
                        </div>

                        {/* Differentiator 3 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                <img src={imgIconNoBlackBox} alt="" className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">No Black-Box ML</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                No black-box machine learning in safety-critical decision paths
                            </p>
                        </div>

                        {/* Differentiator 4 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <img src={imgIconHuman} alt="" className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Human-in-the-Loop</h3>
                            <p className="mt-2 text-sm text-slate-600">Human-in-the-loop design by default</p>
                        </div>

                        {/* Differentiator 5 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                                <img src={imgIconSeparation} alt="" className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Clear Separation</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Advisory intelligence separated from maintenance authority
                            </p>
                        </div>

                        {/* Differentiator 6 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <img src={imgIconSafety} alt="" className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Safety First</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Safety and accountability over automation speed
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Designed for Regulated Maintenance Environments */}
            <section className="mx-auto max-w-[1084px] px-8 py-20">
                <h2 className="text-center text-4xl font-bold text-slate-900">
                    Designed for Regulated Maintenance Environments
                </h2>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Environment Card 1 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                            <img src={imgIconRegulatoryAlign} alt="" className="h-7 w-7" />
                        </div>
                        <h3 className="mt-10 text-lg font-bold text-slate-900">Regulatory Alignment</h3>
                        <p className="mt-10 text-sm leading-relaxed text-slate-600">
                            Designed with FAA and EASA maintenance philosophies in mind, supporting Part 145, airline,
                            and CAMO operational structures.
                        </p>
                    </div>

                    {/* Environment Card 2 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                            <img src={imgIconAudit} alt="" className="h-7 w-7" />
                        </div>
                        <h3 className="mt-10 text-lg font-bold text-slate-900">Audit-Ready Architecture</h3>
                        <p className="mt-10 text-sm leading-relaxed text-slate-600">
                            Every interaction is logged, traceable, and reviewable to support quality systems, audits,
                            and compliance oversight.
                        </p>
                    </div>

                    {/* Environment Card 3 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
                            <img src={imgIconSecurityTenant} alt="" className="h-7 w-7" />
                        </div>
                        <h3 className="mt-10 text-lg font-bold text-slate-900">Security & Tenant Isolation</h3>
                        <p className="mt-10 text-sm leading-relaxed text-slate-600">
                            Enterprise-grade access control, organization-level isolation, and role-based permissions
                            protect operational integrity.
                        </p>
                    </div>

                    {/* Environment Card 4 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                            <img src={imgIconTransparency} alt="" className="h-7 w-7" />
                        </div>
                        <h3 className="mt-10 text-lg font-bold text-slate-900">Operational Transparency</h3>
                        <p className="mt-10 text-sm leading-relaxed text-slate-600">
                            No hidden decision logic. No uncontrolled automation. SkyMaintain operates as a controlled,
                            inspectable system.
                        </p>
                    </div>
                </div>
            </section>

            {/* Supporting Maintenance Across the Operation */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-[1084px] px-8">
                    <h2 className="text-center text-4xl font-bold text-slate-900">
                        Supporting Maintenance Across the Operation
                    </h2>

                    <div className="mt-16 grid gap-8 md:grid-cols-2">
                        {/* Use Case 1 */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                    <img src={imgIconEngineering} alt="" className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Maintenance Engineering</h3>
                                    <p className="mt-3 text-base leading-relaxed text-slate-600">
                                        Assist engineers in interpreting manuals, troubleshooting recurring defects, and
                                        validating maintenance pathways using traceable references.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 2 */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                    <img src={imgIconPlanning} alt="" className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Maintenance Control & Planning
                                    </h3>
                                    <p className="mt-3 text-base leading-relaxed text-slate-600">
                                        Support informed planning decisions with advisory insights derived from
                                        operational patterns and historical data.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 3 */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                                    <img src={imgIconQuality} alt="" className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Quality Assurance & Compliance
                                    </h3>
                                    <p className="mt-3 text-base leading-relaxed text-slate-600">
                                        Enable transparent review of AI-assisted decisions with full traceability for
                                        internal and external audits.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 4 */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                                    <img src={imgIconLeadership} alt="" className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Technical Leadership</h3>
                                    <p className="mt-3 text-base leading-relaxed text-slate-600">
                                        Provide leadership with confidence that digital intelligence supports—not
                                        undermines—regulatory accountability.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI That Respects Aviation Realities */}
            <section
                className="py-20"
                style={{
                    background: "linear-gradient(162deg, rgb(28, 57, 142) 0%, rgb(15, 23, 43) 100%)",
                }}
            >
                <div className="mx-auto max-w-[896px] px-8 text-center">
                    <h2 className="text-4xl font-bold text-white">AI That Respects Aviation Realities</h2>
                    <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-blue-100">
                        SkyMaintain is engineered with the understanding that aircraft maintenance is not a domain for
                        experimentation.
                    </p>
                    <p className="mx-auto mt-4 max-w-3xl text-xl leading-relaxed text-blue-100">
                        It is a controlled, high-consequence environment where technology must enhance discipline, not
                        bypass it.
                    </p>
                </div>
            </section>

            {/* Evaluate SkyMaintain CTA */}
            <section className="py-20">
                <div className="mx-auto max-w-[896px] px-8 text-center">
                    <h2 className="text-4xl font-bold text-slate-900">
                        Evaluate SkyMaintain for Your Maintenance Operation
                    </h2>
                    <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-slate-600">
                        See how a deterministic, audit-ready AI platform can support compliance-driven aircraft
                        maintenance without compromising safety, authority, or regulatory trust.
                    </p>
                    <div className="mt-10">
                        <Link
                            href="/contact?intent=demo"
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-10 py-5 text-lg font-medium text-white transition-colors hover:bg-slate-800"
                        >
                            Schedule a Technical Walkthrough
                            <img src={imgArrowIcon} alt="" className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-12">
                <div className="mx-auto max-w-[1084px] px-8">
                    {/* Logo and tagline */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <img src={imgLogo} alt="SkyMaintain" className="h-8 w-12 object-contain" />
                            <span className="text-2xl font-bold text-white">SkyMaintain</span>
                        </div>
                        <p className="mt-4 text-base text-slate-400">
                            Enterprise AI for regulated aircraft maintenance operations.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Built for compliance. Designed for accountability.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="mt-8 border-t border-slate-800 pt-8">
                        <div className="flex flex-wrap items-center justify-center gap-6 text-base text-slate-400">
                            <Link href="/privacy" className="hover:text-slate-200">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-slate-200">
                                Terms of Service
                            </Link>
                            <Link href="/regulatory-governance-accountability" className="hover:text-slate-200">
                                Regulatory Governance &amp; Accountability
                            </Link>
                            <Link href="/compliance" className="hover:text-slate-200">
                                Compliance
                            </Link>
                            <Link href="/security" className="hover:text-slate-200">
                                Security
                            </Link>
                            <Link href="/contact" className="hover:text-slate-200">
                                Contact
                            </Link>
                        </div>
                        <p className="mt-6 text-center text-sm text-slate-500">
                            © 2026 SkyMaintain. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

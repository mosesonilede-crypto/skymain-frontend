/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 122:24
 * specHash: sha256:main-landing-page-v1
 */

import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowRight, ClipboardList, FileCheck, Plane, Shield, Star, Tag, Users, Zap } from "lucide-react";
import LandingSignupForm from "@/components/public/LandingSignupForm";

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
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                        Enterprise Aircraft Maintenance Decision Intelligence
                    </span>
                </div>

                {/* Headline */}
                <h1 className="mt-10 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
                    Regulatory-Grade AI Decision Support for
                    <br />
                    Aircraft Maintenance Operations
                </h1>

                {/* Subheadline */}
                <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-600">
                    Deterministic, auditable, and policy-aligned decision support for airlines, MROs, and other
                    regulated aircraft maintenance organizations—built for multi-aircraft fleet operations with
                    per-aircraft drilldowns.
                </p>

                {/* Supporting text */}
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Designed to support compliance-driven maintenance workflows without replacing certificated
                    personnel or compromising human authority, safety, or regulatory accountability.
                </p>
                <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
                    SkyMaintain does not issue maintenance instructions or approvals and does not replace
                    certificated personnel or regulatory authority.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="#signup"
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-8 py-5 text-lg font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        Start Free Trial
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/get-started"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-5 text-lg font-medium text-slate-900 transition-colors hover:bg-slate-50"
                    >
                        Partner with Us
                    </Link>
                    <Link
                        href="/demo"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-8 py-5 text-lg font-medium text-slate-900 transition-colors hover:bg-slate-50"
                    >
                        <svg className="h-5 w-5 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Demo
                    </Link>
                    <Link
                        href="/contact?intent=demo"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-5 text-lg font-medium text-slate-900 transition-colors hover:bg-slate-50"
                    >
                        Request Enterprise Demo
                    </Link>
                </div>
                <p className="mt-3 text-xs text-slate-500">For regulated aviation organizations only</p>
            </section>

            <section id="signup" className="mx-auto max-w-[1084px] px-8 pb-16">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Get started</div>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900">Start a 14-day evaluation</h2>
                        <p className="mt-4 text-base text-slate-600">
                            Start onboarding immediately, or explore partnerships and compliance details before committing.
                        </p>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-sm font-semibold text-slate-900">For Operators</div>
                                <p className="mt-2 text-xs text-slate-600">Launch a trial, verify email, and begin onboarding.</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-sm font-semibold text-slate-900">For Partners</div>
                                <p className="mt-2 text-xs text-slate-600">Visit the partnerships page for integration or reseller paths.</p>
                                <Link href="/get-started" className="mt-3 inline-flex text-xs font-semibold text-slate-900 underline">
                                    Partnership details
                                </Link>
                            </div>
                        </div>
                    </div>
                    <LandingSignupForm />
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
                            <FileCheck className="h-6 w-6 text-blue-600" />
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
                            <Shield className="h-6 w-6 text-green-600" />
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
                            <ClipboardList className="h-6 w-6 text-purple-600" />
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
                            <Activity className="h-6 w-6 text-amber-600" />
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
                                <Shield className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Built for Regulated Aviation</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Specifically engineered for regulated aviation maintenance environments
                            </p>
                        </div>

                        {/* Differentiator 2 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <FileCheck className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Deterministic Outputs</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Outputs suitable for audit and regulatory review
                            </p>
                        </div>

                        {/* Differentiator 3 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                <Zap className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">No Black-Box ML</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                No black-box machine learning in safety-critical decision paths
                            </p>
                        </div>

                        {/* Differentiator 4 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <Users className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Human-in-the-Loop</h3>
                            <p className="mt-2 text-sm text-slate-600">Human-in-the-loop design by default</p>
                        </div>

                        {/* Differentiator 5 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                                <Tag className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Clear Separation</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Advisory intelligence separated from maintenance authority
                            </p>
                        </div>

                        {/* Differentiator 6 */}
                        <div className="flex flex-col items-center py-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <Star className="h-8 w-8 text-red-600" />
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
                            <Shield className="h-7 w-7 text-blue-600" />
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
                            <ClipboardList className="h-7 w-7 text-green-600" />
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
                            <Shield className="h-7 w-7 text-purple-600" />
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
                            <FileCheck className="h-7 w-7 text-amber-600" />
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
                                    <Activity className="h-6 w-6 text-blue-600" />
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
                                    <ClipboardList className="h-6 w-6 text-green-600" />
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
                                    <FileCheck className="h-6 w-6 text-purple-600" />
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
                                    <Star className="h-6 w-6 text-amber-600" />
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
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#101828] py-12">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#155dfc]">
                                    <Plane className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-white">SkyMaintain</span>
                            </div>
                            <p className="mt-4 text-sm text-[#99a1af]">
                                AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                            </p>
                        </div>

                        <div>
                            <h4 className="mb-4 font-bold text-white">Product</h4>
                            <ul className="space-y-2">
                                <li><Link href="/platform-features" className="text-[#d1d5dc] hover:text-white">Features</Link></li>
                                <li><Link href="/pricing" className="text-[#d1d5dc] hover:text-white">Pricing</Link></li>
                                <li><Link href="/security" className="text-[#d1d5dc] hover:text-white">Security</Link></li>
                                <li><Link href="/user-guide" className="text-[#d1d5dc] hover:text-white">User Guide</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 font-bold text-white">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-[#d1d5dc] hover:text-white">About Us</Link></li>
                                <li><Link href="/careers" className="text-[#d1d5dc] hover:text-white">Careers</Link></li>
                                <li><Link href="/contact" className="text-[#d1d5dc] hover:text-white">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 font-bold text-white">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-[#d1d5dc] hover:text-white">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-[#d1d5dc] hover:text-white">Terms of Service</Link></li>
                                <li><Link href="/compliance" className="text-[#d1d5dc] hover:text-white">Compliance</Link></li>
                                <li><Link href="/regulatory-compliance-automation" className="text-[#d1d5dc] hover:text-white">Regulatory Compliance</Link></li>
                                <li><Link href="/regulatory-governance-accountability" className="text-[#d1d5dc] hover:text-white">Regulatory Governance</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-[#1e2939] pt-8 text-center">
                        <p className="text-sm text-[#d1d5dc]">
                            © 2026 <span className="text-[#51a2ff]">SkyMaintain</span>. All Rights Reserved.
                        </p>
                        <p className="mt-2 text-xs text-[#6a7282]">SkyMaintain is a product of EncycloAMTs LLC.</p>
                        <p className="mt-1 text-xs text-[#6a7282]">
                            A Regulatory-Compliant Architecture for AI-Assisted Aircraft Maintenance Decision Support
                        </p>
                        <p className="mt-4 text-xs text-[#6a7282]">
                            <strong>Partner Disclosure:</strong> SkyMaintain displays sponsored partner content. Sponsorship does not
                            influence AI responses, maintenance recommendations, or compliance assessments.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

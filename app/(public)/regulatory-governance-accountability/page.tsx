"use client";

import Link from "next/link";

export default function RegulatoryGovernanceAccountabilityPage() {
    return (
        <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="border-b border-slate-200 bg-white px-6 py-16 sm:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-semibold text-blue-600">Regulatory Governance &amp; Accountability</div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Back to Home
                        </Link>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Regulatory Governance & Accountability
                    </h1>
                    <p className="mt-6 text-xl text-slate-600">
                        SkyMaintain is designed for use in regulated aviation maintenance environments, where decision support systems must operate within clearly defined regulatory, safety, and accountability boundaries.
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        Accordingly, SkyMaintain follows a compliance-first, human-in-the-loop governance model, ensuring that all system outputs support — but do not replace — licensed maintenance judgment and regulatory responsibility.
                    </p>
                </div>
            </section>

            {/* Technical Accountability Section */}
            <section className="border-b border-slate-200 px-6 py-16 sm:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Technical Accountability and Oversight
                        </h2>

                        <p className="mt-6 text-slate-700">
                            The system architecture and regulatory decision logic were designed under the technical leadership of{" "}
                            <span className="font-semibold text-slate-900">Moses Onilede</span>, an{" "}
                            <span className="font-semibold text-slate-900">FAA-certified Aircraft Maintenance Engineer</span> with extensive senior-level experience in aircraft engineering, maintenance operations, and technical training.
                        </p>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-slate-900">System design aligns with:</h3>
                            <ul className="mt-4 space-y-3">
                                <li className="flex gap-3">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span className="text-slate-700">
                                        <span className="font-semibold text-slate-900">FAA Airman Certification Standards (ACS)</span>
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span className="text-slate-700">
                                        <span className="font-semibold text-slate-900">FAA Part 145 maintenance philosophy</span>
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span className="text-slate-700">
                                        <span className="font-semibold text-slate-900">Manufacturer maintenance frameworks and approved data concepts</span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <p className="mt-8 text-slate-700">
                            This governance model reflects established aviation practice, where accountability, traceability, and regulatory compliance are essential.
                        </p>
                    </div>
                </div>
            </section>

            {/* Human-in-the-Loop Section */}
            <section className="border-b border-slate-200 px-6 py-16 sm:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Human-in-the-Loop Design Philosophy
                        </h2>

                        <div className="mt-6 space-y-6">
                            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                                <p className="font-semibold text-blue-900">
                                    SkyMaintain does not perform autonomous maintenance actions.
                                </p>
                            </div>

                            <p className="text-slate-700">
                                Instead, it provides structured, explainable decision support, enabling licensed personnel to:
                            </p>

                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <span className="text-blue-600 font-bold">✓</span>
                                    <span className="text-slate-700">Evaluate maintenance options</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-600 font-bold">✓</span>
                                    <span className="text-slate-700">Understand regulatory constraints</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-600 font-bold">✓</span>
                                    <span className="text-slate-700">Maintain full operational authority</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-600 font-bold">✓</span>
                                    <span className="text-slate-700">Preserve regulatory accountability</span>
                                </li>
                            </ul>

                            <p className="mt-6 text-slate-700">
                                <span className="font-semibold text-slate-900">All maintenance decisions remain the responsibility of appropriately authorized personnel</span>, consistent with FAA and international aviation standards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Auditability Section */}
            <section className="px-6 py-16 sm:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Auditability and Compliance Integrity
                        </h2>

                        <p className="mt-6 text-slate-700">
                            System reasoning pathways are designed to support:
                        </p>

                        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                            <li className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                                <div className="font-semibold text-slate-900">Decision Traceability</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Full audit trail of system recommendations and reasoning
                                </p>
                            </li>
                            <li className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                                <div className="font-semibold text-slate-900">Compliance Review</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Documentation for regulatory inspection and oversight
                                </p>
                            </li>
                            <li className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                                <div className="font-semibold text-slate-900">Organizational Accountability</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Clear responsibility pathways for maintenance actions
                                </p>
                            </li>
                            <li className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                                <div className="font-semibold text-slate-900">Safety Oversight</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Monitoring and verification of system recommendations
                                </p>
                            </li>
                        </ul>

                        <p className="mt-8 text-slate-700">
                            <span className="font-semibold text-slate-900">This approach ensures SkyMaintain functions as a decision-support tool, not a decision-making authority.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-slate-200 bg-slate-50 px-6 py-16">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Learn More About SkyMaintain
                    </h2>
                    <p className="mt-4 text-slate-600">
                        Explore our compliance framework and platform features
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/compliance"
                            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                        >
                            Compliance Overview
                        </Link>
                        <Link
                            href="/platform-features"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50"
                        >
                            Platform Features
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

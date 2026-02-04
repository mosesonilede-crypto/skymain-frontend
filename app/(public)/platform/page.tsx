"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_DEMO } from "@/lib/routes";

export default function PlatformPage() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="rounded-2xl bg-gradient-to-b from-slate-50 to-white px-6 py-16 text-center md:py-24">
                <div className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    SkyMaintain Platform
                </div>

                <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                    Enterprise-Grade Aircraft Maintenance Intelligence
                </h1>

                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">
                    SkyMaintain combines AI-powered predictive analytics with comprehensive compliance management to transform aircraft maintenance operations. Built for operators, MROs, and maintenance professionals who demand precision, safety, and regulatory certainty.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href={CONTACT_DEMO}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700"
                    >
                        Request a Demo
                    </Link>
                    <Link
                        href="/platform-features"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50"
                    >
                        View Features
                    </Link>
                </div>
            </section>

            {/* Core Capabilities */}
            <section className="mx-auto mt-20 max-w-6xl px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Core Platform Capabilities</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                        Four foundational pillars powering intelligent maintenance operations
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Predictive Intelligence */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="inline-flex items-center justify-center rounded-lg bg-blue-100 p-3">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Predictive Intelligence</h3>
                        <p className="mt-2 text-slate-600">
                            AI-powered analysis identifies maintenance trends, predicts component failures, and recommends proactive interventions before issues impact operations.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>✓ Component lifecycle analysis</li>
                            <li>✓ Failure prediction algorithms</li>
                            <li>✓ Maintenance optimization</li>
                            <li>✓ Resource planning</li>
                        </ul>
                    </div>

                    {/* Compliance Management */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="inline-flex items-center justify-center rounded-lg bg-emerald-100 p-3">
                            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Compliance Management</h3>
                        <p className="mt-2 text-slate-600">
                            Automated tracking of regulatory requirements, airworthiness directives, and compliance documentation ensures your operation meets all aviation standards.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>✓ Regulatory requirement tracking</li>
                            <li>✓ Airworthiness directive management</li>
                            <li>✓ Audit documentation</li>
                            <li>✓ Compliance reporting</li>
                        </ul>
                    </div>

                    {/* Data Integration */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="inline-flex items-center justify-center rounded-lg bg-purple-100 p-3">
                            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Seamless Data Integration</h3>
                        <p className="mt-2 text-slate-600">
                            Connect maintenance logs, flight data, work orders, and historical records into a unified platform for comprehensive analysis and decision-making.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>✓ Multi-source data aggregation</li>
                            <li>✓ Real-time data synchronization</li>
                            <li>✓ Historical analytics</li>
                            <li>✓ API integrations</li>
                        </ul>
                    </div>

                    {/* Security & Privacy */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="inline-flex items-center justify-center rounded-lg bg-red-100 p-3">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Security & Privacy</h3>
                        <p className="mt-2 text-slate-600">
                            Enterprise-grade security with end-to-end encryption, role-based access control, and audit logs to protect sensitive operational data.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>✓ End-to-end encryption</li>
                            <li>✓ Role-based access control</li>
                            <li>✓ Audit logging</li>
                            <li>✓ Data residency compliance</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Key Benefits */}
            <section className="mx-auto mt-20 max-w-6xl px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8">
                        <div className="text-3xl font-bold text-blue-600">40%</div>
                        <p className="mt-2 text-slate-900">Average reduction in unplanned maintenance</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8">
                        <div className="text-3xl font-bold text-emerald-600">99.9%</div>
                        <p className="mt-2 text-slate-900">Regulatory compliance accuracy</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8">
                        <div className="text-3xl font-bold text-purple-600">60%</div>
                        <p className="mt-2 text-slate-900">Faster decision-making with AI insights</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto mt-20 max-w-6xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-16 text-center text-white md:py-20">
                    <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to transform your maintenance operations?</h3>

                    <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
                        Join leading operators and MROs who trust SkyMaintain for intelligent maintenance management.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href={CONTACT_DEMO}
                            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100"
                        >
                            Schedule Demo
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white hover:bg-white/15"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const YOUTUBE_VIDEO_ID = "oMcy-bTjvJ0";
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`;
const YOUTUBE_WATCH_URL = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`;

export default function DemoPage() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="mx-auto max-w-5xl px-8 pb-16 pt-16 text-center">
                {/* Badge */}
                <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5">
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-600">Product Demo</span>
                </div>

                {/* Headline */}
                <h1 className="mt-8 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                    See SkyMaintain in Action
                </h1>

                {/* Subheadline */}
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
                    Watch how SkyMaintain transforms aircraft maintenance operations with regulatory-grade AI
                    decision support, real-time compliance tracking, and predictive maintenance intelligence.
                </p>
            </section>

            {/* Video Section */}
            <section className="mx-auto max-w-5xl px-8 pb-16">
                <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
                    {/* Video Container with 16:9 Aspect Ratio */}
                    <div className="relative aspect-video w-full">
                        {!isPlaying ? (
                            /* Thumbnail with Play Button */
                            <div
                                className="absolute inset-0 cursor-pointer group"
                                onClick={() => setIsPlaying(true)}
                            >
                                {/* YouTube Thumbnail */}
                                <Image
                                    src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                                    alt="SkyMaintain Demo Video"
                                    fill
                                    unoptimized
                                    sizes="100vw"
                                    className="object-cover"
                                    onError={(event) => {
                                        const target = event.currentTarget as HTMLImageElement;
                                        target.src = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;
                                    }}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
                                        <svg className="ml-1 h-8 w-8 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Duration Badge */}
                                <div className="absolute bottom-4 right-4 rounded bg-black/70 px-2 py-1 text-sm font-medium text-white">
                                    Watch Demo
                                </div>
                            </div>
                        ) : (
                            /* YouTube Embed */
                            <iframe
                                src={`${YOUTUBE_EMBED_URL}&autoplay=1`}
                                title="SkyMaintain Demo Video"
                                className="absolute inset-0 h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>
                </div>

                {/* Video Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <a
                        href={YOUTUBE_WATCH_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        Watch on YouTube
                    </a>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(YOUTUBE_WATCH_URL);
                            alert("Link copied to clipboard!");
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                    </button>
                </div>
            </section>

            {/* What You'll See Section */}
            <section className="bg-slate-50 py-16">
                <div className="mx-auto max-w-5xl px-8">
                    <h2 className="text-center text-3xl font-bold text-slate-900">
                        What You&apos;ll See in This Demo
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
                        A comprehensive walkthrough of SkyMaintain&apos;s key capabilities for aircraft maintenance operations
                    </p>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Fleet Dashboard</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Real-time overview of your entire fleet with status indicators, upcoming maintenance, and compliance scores.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
                                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Compliance Tracking</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Monitor AD compliance, service bulletins, and regulatory requirements with automated tracking and alerts.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Predictive Alerts</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                AI-powered predictions for potential maintenance issues before they become critical problems.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Reports & Analytics</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Generate comprehensive maintenance reports with full audit trails and regulatory documentation.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50">
                                <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Document Management</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Centralized repository for all maintenance documentation with version control and easy search.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Admin Panel</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Manage fleet, users, and organizational settings with role-based access control.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="mx-auto max-w-3xl px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Ready to Get Started?</h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Experience the future of aircraft maintenance operations with SkyMaintain&apos;s regulatory-grade AI platform.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/get-started"
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-slate-800"
                        >
                            Start Free Trial
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <Link
                            href="/contact?intent=demo"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-4 text-lg font-medium text-slate-900 transition-colors hover:bg-slate-50"
                        >
                            Request Enterprise Demo
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-slate-500">
                        Have questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact our team</Link> for a personalized walkthrough.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8">
                <div className="mx-auto max-w-5xl px-8 text-center text-sm text-slate-500">
                    © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
                </div>
            </footer>
        </div>
    );
}

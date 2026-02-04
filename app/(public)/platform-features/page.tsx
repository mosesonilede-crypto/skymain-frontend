"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function PlatformFeaturesPage() {
    const [features, setFeatures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with live API endpoint
        // fetch('/api/features').then(res => res.json()).then(setFeatures)
        setLoading(false);
    }, []);

    return (
        <div className="w-full">
            <section className="px-6 py-16 text-center md:py-24">
                <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Platform Features
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">
                    Explore the capabilities that power intelligent aircraft maintenance
                </p>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                {loading ? (
                    <div className="text-center">Loading features...</div>
                ) : features.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{/* Render live data here */}</div>
                ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                        <p className="text-slate-600">Features data will load from live API</p>
                    </div>
                )}
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
                    <h3 className="text-2xl font-bold text-slate-900">Ready to get started?</h3>
                    <p className="mt-4 text-slate-600">Request a demo or start your free trial today</p>
                    <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/contact?intent=demo" className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                            Request Demo
                        </Link>
                        <Link href="/get-started" className="rounded-lg border border-slate-300 px-6 py-3 hover:bg-slate-50">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

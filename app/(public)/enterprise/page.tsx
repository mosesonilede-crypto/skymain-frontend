"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function EnterprisePage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with live API endpoint
        // fetch('/api/enterprise').then(res => res.json()).then(setData)
        setLoading(false);
    }, []);

    return (
        <div className="w-full">
            <section className="px-6 py-16 text-center md:py-24">
                <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold text-slate-900">Enterprise Solutions</h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-700">
                    Scalable platform built for large-scale aircraft maintenance operations
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href="/contact?intent=demo" className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700">
                        Request Demo
                    </Link>
                    <Link href="/contact" className="rounded-lg border border-slate-300 px-8 py-3 hover:bg-slate-50">
                        Contact Sales
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                {loading ? (
                    <div className="text-center">Loading enterprise data...</div>
                ) : data ? (
                    <div>{/* Render live data here */}</div>
                ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                        <p className="text-slate-600">Enterprise data will load from live API</p>
                    </div>
                )}
            </section>
        </div>
    );
}

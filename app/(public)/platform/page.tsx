"use client";

import * as React from "react";
import Link from "next/link";

export default function PlatformPage() {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // TODO: Replace with live API endpoint
        // fetch('/api/platform').then(res => res.json()).then(setData)
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading platform data...</div>;
    }

    return (
        <div className="w-full">
            <section className="px-6 py-16 text-center md:py-24">
                <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                    SkyMaintain Platform
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">
                    Enterprise aircraft maintenance intelligence platform
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href="/contact?intent=demo" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700">
                        Request Demo
                    </Link>
                    <Link href="/platform-features" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50">
                        View Features
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                {data ? (
                    <div>{/* Render live data here */}</div>
                ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                        <p className="text-slate-600">Platform data will load from live API</p>
                    </div>
                )}
            </section>
        </div>
    );
}

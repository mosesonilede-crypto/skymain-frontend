"use client";

import React from "react";
import Link from "next/link";

export default function CareersPage() {
    return (
        <div className="w-full">
            <section className="px-6 py-16 text-center md:py-24">
                <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold text-slate-900">Join Our Team</h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-700">Help us build the future of aircraft maintenance</p>
                <Link href="/contact" className="mt-10 inline-flex rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700">
                    Contact Us
                </Link>
            </section>
            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-slate-600">Open positions will load from live API</p>
                </div>
            </section>
        </div>
    );
}

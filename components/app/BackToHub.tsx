/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

export default function BackToHub({ title }: { title?: string }) {
    return (
        <div className="mb-6 flex items-center gap-2">
            <Link
                href="/app/welcome"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Hub
            </Link>
            {title && <span className="text-sm text-slate-500">/ {title}</span>}
        </div>
    );
}

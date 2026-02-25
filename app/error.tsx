"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Send error to tracking service
        import("@/lib/errorTracker").then(({ captureException }) => {
            captureException(error, { digest: error.digest });
        });
    }, [error]);

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 text-center">
            <div className="mx-auto max-w-md">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <svg
                        className="h-24 w-24 text-red-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-slate-900">Something went wrong</h1>
                <p className="mt-3 text-slate-600">
                    We encountered an unexpected error. Our team has been notified.
                </p>

                {error.digest && (
                    <p className="mt-2 text-xs text-slate-400">
                        Error ID: {error.digest}
                    </p>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={reset}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>

            <p className="mt-16 text-xs text-slate-400">
                SkyMaintain &bull; Aircraft Maintenance Intelligence
            </p>
        </div>
    );
}

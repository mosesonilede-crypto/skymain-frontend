/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function PublicHeader() {
    const router = useRouter();
    const { isAuthenticated, logout, isLoading } = useAuth();

    function handleLogout() {
        logout();
        router.push("/");
    }

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-[1148px] items-center justify-between px-8 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/brand/SkyMaintain_logo.png" alt="SkyMaintain" className="h-8 w-8" />
                    <span className="text-xl font-bold text-slate-900">SkyMaintain</span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    <Link href="/platform" className="text-base text-slate-600 hover:text-slate-900">
                        Platform
                    </Link>
                    <Link href="/enterprise" className="text-base text-slate-600 hover:text-slate-900">
                        Enterprise
                    </Link>
                    <Link href="/compliance" className="text-base text-slate-600 hover:text-slate-900">
                        Compliance
                    </Link>
                    <Link href="/security" className="text-base text-slate-600 hover:text-slate-900">
                        Security
                    </Link>
                    <Link href="/get-started" className="text-base text-slate-600 hover:text-slate-900">
                        Partnerships
                    </Link>
                    <Link href="/contact" className="text-base text-slate-600 hover:text-slate-900">
                        Contact
                    </Link>

                    {/* Auth-aware Sign In / Log Out button */}
                    {isLoading ? (
                        <span className="text-sm text-slate-400">...</span>
                    ) : isAuthenticated ? (
                        <>
                            <Link
                                href="/app/welcome"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                Go to Hub
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <Link href="/signin" className="text-sm text-slate-600 hover:text-slate-900">
                            Sign In
                        </Link>
                    )}

                    {/* Show "Get Started" for non-authenticated, "Go to Hub" button for authenticated */}
                    {isAuthenticated ? (
                        <Link
                            href="/app/welcome"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                        >
                            Open Platform
                        </Link>
                    ) : (
                        <Link
                            href="/#signup"
                            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                        >
                            Start Free Trial
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

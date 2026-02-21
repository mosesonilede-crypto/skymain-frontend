"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function SubscriptionExpiredPage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="w-8 h-8 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    {/* Header */}
                    <h1 className="text-2xl font-bold text-slate-900 mb-3">
                        Your Free Trial Has Ended
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Your 14-day free trial period has expired. To continue using SkyMaintain&apos;s
                        AI-powered maintenance intelligence platform, please upgrade to a paid plan.
                    </p>

                    {/* User Info */}
                    {user && (
                        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                            <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                                Account
                            </div>
                            <div className="text-sm text-slate-900 font-medium">{user.email}</div>
                            {user.orgName && (
                                <div className="text-sm text-slate-600">{user.orgName}</div>
                            )}
                        </div>
                    )}

                    {/* Benefits Reminder */}
                    <div className="text-left mb-6">
                        <div className="text-sm font-semibold text-slate-900 mb-3">
                            What you&apos;ll get with a paid plan:
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                AI-powered maintenance predictions and insights
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Full regulatory compliance documentation
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Access to aircraft maintenance manuals database
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Priority support and dedicated account management
                            </li>
                        </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/app/subscription-billing"
                            className="block w-full bg-[#155dfc] hover:bg-[#1447e6] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            Choose a Plan
                        </Link>
                        <Link
                            href="/contact?intent=support"
                            className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            Contact Sales
                        </Link>
                    </div>

                    {/* Secondary Actions */}
                    <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-center gap-4 text-sm">
                        <button
                            onClick={() => logout()}
                            className="text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Sign Out
                        </button>
                        <span className="text-slate-300">•</span>
                        <Link
                            href="/support"
                            className="text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Need Help?
                        </Link>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    Have a license code?{" "}
                    <Link href="/signin" className="text-[#155dfc] hover:underline">
                        Sign in with your license
                    </Link>
                </p>
            </div>
        </div>
    );
}

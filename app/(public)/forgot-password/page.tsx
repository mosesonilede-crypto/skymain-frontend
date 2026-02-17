"use client";

import Link from "next/link";
import * as React from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const emailTrimmed = email.trim().toLowerCase();

        if (!emailTrimmed) {
            setError("Please enter your email address.");
            return;
        }

        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
            setError("Please enter a valid email address.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailTrimmed }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to send reset email. Please try again.");
                return;
            }

            setSuccess(true);
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (success) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-white px-4 py-10">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-center text-2xl font-bold text-slate-900">Check Your Email</h1>
                        <p className="mt-4 text-center text-sm text-slate-600">
                            If an account exists with <strong className="text-slate-900">{email}</strong>,
                            you will receive a password reset link shortly.
                        </p>
                        <p className="mt-4 text-center text-sm text-slate-500">
                            Didn&apos;t receive an email? Check your spam folder or try again with a different email address.
                        </p>
                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail("");
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Try Another Email
                            </button>
                            <Link
                                href="/signin"
                                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-white px-4 py-10">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-center text-2xl font-bold text-slate-900">Forgot Password?</h1>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                placeholder="e.g., operations@example.com"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {submitting ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/signin" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                            ← Back to Sign In
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Remember your password?{" "}
                    <Link href="/signin" className="font-semibold text-slate-700 hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </main>
    );
}

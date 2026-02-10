"use client";

import Link from "next/link";
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LandingSignupForm() {
    const [fullName, setFullName] = React.useState("");
    const [orgName, setOrgName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [accept, setAccept] = React.useState(false);

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [verificationSent, setVerificationSent] = React.useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const eTrim = email.trim();
        const oTrim = orgName.trim();
        const nTrim = fullName.trim();

        if (!nTrim || !oTrim || !eTrim || !password) {
            setError("Enter your full name, organization name, email, and password.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (!accept) {
            setError("You must accept the terms to continue.");
            return;
        }

        if (!supabase) {
            setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
            return;
        }

        setSubmitting(true);
        const { error: signUpError } = await supabase.auth.signUp({
            email: eTrim,
            password,
            options: {
                data: { full_name: nTrim, org_name: oTrim },
                emailRedirectTo: `${window.location.origin}/signin?verified=1`,
            },
        });
        setSubmitting(false);

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        setVerificationSent(true);
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Start your free trial</div>
            <div className="mt-1 text-sm text-slate-600">
                Create an account to access the platform. Email verification is required.
            </div>

            {error ? (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                </div>
            ) : null}

            {verificationSent ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    <div className="font-semibold">Verification email sent</div>
                    <p className="mt-1 text-emerald-800">
                        Check {email || "your inbox"} for the verification email (OTP or link) to activate your account.
                    </p>
                    <div className="mt-3 text-xs text-emerald-800">
                        Already verified? <Link className="font-semibold underline" href="/signin">Sign in here</Link>.
                    </div>
                </div>
            ) : (
                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                            placeholder="e.g., Jordan Blake"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Organization Name</label>
                        <input
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            type="text"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                            placeholder="e.g., SkyWings Operators"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Work Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                            placeholder="e.g., operations@skywings.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                            placeholder="Create a password"
                        />
                    </div>

                    <label className="flex items-start gap-2 text-xs text-slate-600">
                        <input
                            type="checkbox"
                            checked={accept}
                            onChange={(e) => setAccept(e.target.checked)}
                            className="mt-0.5"
                        />
                        I agree to the <Link href="/terms" className="font-semibold text-slate-700 underline">Terms of Service</Link> and
                        <Link href="/privacy" className="ml-1 font-semibold text-slate-700 underline">Privacy Policy</Link>.
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {submitting ? "Creating account..." : "Start free trial"}
                    </button>

                    <div className="text-xs text-slate-500">
                        Already have an account? <Link className="font-semibold underline" href="/signin">Sign in</Link>.
                    </div>
                </form>
            )}
        </div>
    );
}

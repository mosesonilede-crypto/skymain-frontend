"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";
import { getPublicSiteUrl } from "@/lib/siteUrl";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";

export default function SignUpPage() {
    const router = useRouter();

    const [fullName, setFullName] = React.useState("");
    const [orgName, setOrgName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [accept, setAccept] = React.useState(false);

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [verificationSent, setVerificationSent] = React.useState(false);

    async function resendVerification() {
        const eTrim = email.trim();
        if (!eTrim) return;
        if (!supabase) {
            setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
            return;
        }
        const siteUrl = getPublicSiteUrl();
        const emailRedirectTo = siteUrl ? `${siteUrl}/signin?verified=1` : undefined;
        setSubmitting(true);
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: eTrim,
            options: emailRedirectTo ? { emailRedirectTo } : undefined,
        });
        setSubmitting(false);
        if (error) {
            setError(error.message);
        }
    }

    function markVerified() {
        router.push("/signin?verified=1");
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!supabase) {
            setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
            return;
        }

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

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        if (!accept) {
            setError("You must accept the terms to continue.");
            return;
        }

        const siteUrl = getPublicSiteUrl();
        const emailRedirectTo = siteUrl ? `${siteUrl}/signin?verified=1` : undefined;

        setSubmitting(true);
        const { error } = await supabase.auth.signUp({
            email: eTrim,
            password,
            options: {
                data: { full_name: nTrim, org_name: oTrim },
                emailRedirectTo,
            },
        });
        setSubmitting(false);

        if (error) {
            setError(error.message);
            return;
        }

        setVerificationSent(true);
    }

    return (
        <div className="min-h-dvh bg-white text-slate-900">
            <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2">
                <section className="order-2 lg:order-1">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create your account</h1>
                        <p className="mt-3 text-base text-slate-600">
                            Start a 14-day evaluation of SkyMaintain. Email verification is required before access is activated.
                        </p>

                        <div className="mt-6 space-y-4 text-sm text-slate-700">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="font-semibold text-slate-900">Verification required</div>
                                <div className="mt-1 text-slate-600">
                                    We send a verification link to confirm your organization’s email ownership.
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="font-semibold text-slate-900">Trial access</div>
                                <div className="mt-1 text-slate-600">
                                    The trial is free and time-limited. License code is only required after trial.
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="font-semibold text-slate-900">Regulatory alignment</div>
                                <div className="mt-1 text-slate-600">
                                    SkyMaintain provides decision support only—certified personnel remain the final authority.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="order-1 lg:order-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Sign Up</div>
                        <div className="mt-1 text-sm text-slate-600">
                            Enter your details to create an account and verify your email.
                        </div>

                        {error ? (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {error}
                            </div>
                        ) : null}

                        {verificationSent ? (
                            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
                                <div className="font-semibold">Verification email sent</div>
                                <p className="mt-1 text-emerald-800">
                                    Check {email || "your inbox"} for the verification email (OTP or link) to activate your account.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={resendVerification}
                                        className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50"
                                    >
                                        Resend verification
                                    </button>
                                    <button
                                        type="button"
                                        onClick={markVerified}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                                    >
                                        I’ve verified my email
                                    </button>
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
                                        placeholder="e.g., SkyWings Airlines"
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
                                    <div className="relative mt-1">
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={showPassword ? "text" : "password"}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                            placeholder="Create a password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-slate-900"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            aria-pressed={showPassword}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <PasswordStrengthIndicator password={password} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                                    <div className="relative mt-1">
                                        <input
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                            placeholder="Re-enter password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-slate-900"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                            aria-pressed={showConfirmPassword}
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <label className="flex items-start gap-2 text-sm text-slate-600">
                                    <input
                                        checked={accept}
                                        onChange={(e) => setAccept(e.target.checked)}
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 rounded border-slate-300"
                                    />
                                    <span>
                                        I agree to the <Link href="/terms" className="font-semibold text-slate-900 hover:underline">Terms</Link> and
                                        <Link href="/privacy" className="ml-1 font-semibold text-slate-900 hover:underline">Privacy Policy</Link>.
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {submitting ? "Creating account..." : "Create Account"}
                                </button>

                                <div className="text-center text-sm text-slate-600">
                                    Already have an account?{" "}
                                    <Link href="/signin" className="font-semibold text-slate-900 hover:underline">
                                        Sign in
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

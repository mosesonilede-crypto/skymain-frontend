"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";
import { PasswordStrengthIndicator, calculatePasswordStrength } from "@/components/ui/PasswordStrengthIndicator";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [sessionError, setSessionError] = React.useState<string | null>(null);

    // Check if we have a valid session from the reset link
    React.useEffect(() => {
        const errorCode = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorCode) {
            setSessionError(errorDescription || "The password reset link is invalid or has expired.");
        }
    }, [searchParams]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!password) {
            setError("Please enter a new password.");
            return;
        }

        const strength = calculatePasswordStrength(password);
        if (strength.level === "weak") {
            setError("Please choose a stronger password. It must include uppercase, lowercase, numbers, and special characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!supabase) {
            setError("Supabase is not configured.");
            return;
        }

        setSubmitting(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                setError(updateError.message || "Failed to reset password. Please try again.");
                return;
            }

            setSuccess(true);

            // Redirect to signin after 3 seconds
            setTimeout(() => {
                router.push("/signin");
            }, 3000);
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (sessionError) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-white px-4 py-10">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                            <svg className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-center text-2xl font-bold text-slate-900">Link Expired</h1>
                        <p className="mt-4 text-center text-sm text-slate-600">
                            {sessionError}
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/forgot-password"
                                className="block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                            >
                                Request New Reset Link
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (success) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-white px-4 py-10">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-center text-2xl font-bold text-slate-900">Password Reset!</h1>
                        <p className="mt-4 text-center text-sm text-slate-600">
                            Your password has been successfully updated. You will be redirected to sign in shortly.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/signin"
                                className="block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                            >
                                Sign In Now
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
                    <h1 className="text-center text-2xl font-bold text-slate-900">Reset Your Password</h1>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Enter your new password below.
                    </p>

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">New Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                    placeholder="Create a new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-slate-900"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <PasswordStrengthIndicator password={password} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                    placeholder="Re-enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-slate-900"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
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
                            {submitting ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

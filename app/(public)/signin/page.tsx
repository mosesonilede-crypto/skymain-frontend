"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useAuth } from "@/lib/AuthContext";
import { getTrialStatus, startTrialIfMissing } from "@/lib/trial";
import { supabase } from "@/lib/supabaseClient";

export default function SignInPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = React.useState("");
    const [orgName, setOrgName] = React.useState("");
    const [licenseCode, setLicenseCode] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [remember, setRemember] = React.useState(true);

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    function applyDemo(role: "fleet_manager" | "maintenance_engineer") {
        setError(null);
        setOrgName("SkyWings Airlines");
        setLicenseCode("DEMO-LICENSE");
        if (role === "fleet_manager") {
            setEmail("manager@skywings.com");
            setPassword("TestLogin!234");
            return;
        }
        setEmail("engineer@skywings.com");
        setPassword("TestLogin!234");
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const trial = getTrialStatus();
        if (trial?.expired) {
            setError("Your 14-day trial has ended. Please contact sales to continue.");
            return;
        }

        const eTrim = email.trim();
        const oTrim = orgName.trim();
        const lTrim = licenseCode.trim();

        if (!trial && !lTrim) {
            startTrialIfMissing();
        }

        const activeTrial = getTrialStatus();
        const trialActive = Boolean(activeTrial && !activeTrial.expired);

        if (!eTrim || !oTrim || !password || (!lTrim && !trialActive)) {
            setError(
                trialActive
                    ? "Enter your email, organization name, and password. License code is required after trial."
                    : "Enter your email, organization name, license code, and password."
            );
            return;
        }

        setSubmitting(true);
        const result = await supabase.auth.signInWithPassword({ email: eTrim, password });
        setSubmitting(false);

        if (result.error) {
            setError(result.error.message || "Sign in failed.");
            return;
        }

        const user = result.data.user;
        const orgNameMeta = (user?.user_metadata?.org_name as string | undefined) || oTrim;

        // Persist authentication state
        login({ email: eTrim, orgName: orgNameMeta, role: "fleet_manager" });
        startTrialIfMissing();

        router.push("/2fa");
    }

    return (
        <div className="min-h-dvh bg-white text-slate-900">
            <main className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2">
                <section className="order-2 lg:order-1">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome Back</h1>
                        <p className="mt-3 text-base text-slate-600">
                            Sign in to access your organization’s controlled maintenance intelligence environment.
                        </p>

                        <div className="mt-6 space-y-4 text-sm text-slate-700">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="font-semibold text-slate-900">Regulatory-grade controls</div>
                                <div className="mt-1 text-slate-600">
                                    Human-in-the-loop decision support. No autonomous maintenance actions. Audit-ready traceability.
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="font-semibold text-slate-900">Tenant isolation</div>
                                <div className="mt-1 text-slate-600">
                                    Organization name is required to enforce licensed access boundaries and data segregation.
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="font-semibold text-slate-900">Security posture</div>
                                <div className="mt-1 text-slate-600">
                                    2FA enforcement supported. Secure-by-default visibility with on-demand access.
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <section className="order-1 lg:order-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Sign In</div>
                        <div className="mt-1 text-sm text-slate-600">
                            Enter your credentials. Organization name must match your licensed tenant.
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
                            <Link href="/#signup" className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50">
                                Start free trial
                            </Link>
                            <Link href="/partnerships" className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50">
                                Partnership info
                            </Link>
                        </div>

                        {error ? (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {error}
                            </div>
                        ) : null}

                        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    autoComplete="email"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                    placeholder="e.g., manager@skywings.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Organization Name</label>
                                <input
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    type="text"
                                    autoComplete="organization"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                    placeholder="e.g., SkyWings Airlines"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">License Code (required after trial)</label>
                                <input
                                    value={licenseCode}
                                    onChange={(e) => setLicenseCode(e.target.value)}
                                    type="text"
                                    autoComplete="off"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                    placeholder="Enter your license code"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    autoComplete="current-password"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300"
                                    />
                                    Remember me
                                </label>

                                <Link
                                    href="/contact?intent=support&topic=access"
                                    className="text-sm font-semibold text-slate-900 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {submitting ? "Signing in..." : "Sign In"}
                            </button>

                            <div className="text-center text-sm text-slate-600">
                                Don’t have an account?{" "}
                                <Link href="/signup" className="font-semibold text-slate-900 hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </form>

                        {/* Demo accounts - only shown in mock/development mode */}
                        {mode === "mock" && (
                            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-sm font-semibold text-slate-900">Try Demo Accounts</div>
                                <div className="mt-2 text-sm text-slate-600">
                                    Prefills credentials for deterministic testing in mock mode.
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:bg-slate-50"
                                        onClick={() => applyDemo("fleet_manager")}
                                    >
                                        <div className="font-semibold text-slate-900">Fleet Manager</div>
                                        <div className="mt-1 text-xs text-slate-600">SkyWings Airlines</div>
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:bg-slate-50"
                                        onClick={() => applyDemo("maintenance_engineer")}
                                    >
                                        <div className="font-semibold text-slate-900">Maintenance Engineer</div>
                                        <div className="mt-1 text-xs text-slate-600">SkyWings Airlines</div>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-xs text-slate-500">
                            By signing in, you acknowledge the operational decision-support nature of SkyMaintain and that final
                            authority remains with certified personnel.
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

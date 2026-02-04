"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

type DataMode = "mock" | "live" | "hybrid";

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
    if (raw === "live" || raw === "hybrid" || raw === "mock") return raw;
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");
}

async function loginRequest(payload: { email: string; password: string; orgName: string }) {
    const mode = getDataMode();

    if (mode === "mock") {
        return { ok: true as const };
    }

    const base = getApiBaseUrl();
    if (!base) {
        return { ok: false as const, error: "NEXT_PUBLIC_API_BASE_URL is not set." };
    }

    try {
        const res = await fetch(`${base}/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                org_name: payload.orgName,
            }),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            return { ok: false as const, error: text || `Login failed (${res.status})` };
        }

        return { ok: true as const };
    } catch (e) {
        return { ok: false as const, error: e instanceof Error ? e.message : "Network error" };
    }
}

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = React.useState("");
    const [orgName, setOrgName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [remember, setRemember] = React.useState(true);

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const mode = getDataMode();

    function applyDemo(role: "fleet_manager" | "maintenance_engineer") {
        setError(null);
        setOrgName("SkyWings Airlines");
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

        const eTrim = email.trim();
        const oTrim = orgName.trim();

        if (!eTrim || !oTrim || !password) {
            setError("Enter your email, organization name, and password.");
            return;
        }

        setSubmitting(true);
        const result = await loginRequest({ email: eTrim, password, orgName: oTrim });
        setSubmitting(false);

        if (!result.ok) {
            setError(result.error || "Sign in failed.");
            return;
        }

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

                        <div className="mt-6 text-xs text-slate-500">
                            Data mode: <span className="font-semibold text-slate-700">{mode}</span>
                        </div>
                    </div>
                </section>

                <section className="order-1 lg:order-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Sign In</div>
                        <div className="mt-1 text-sm text-slate-600">
                            Enter your credentials. Organization name must match your licensed tenant.
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
                                <Link href="/get-started" className="font-semibold text-slate-900 hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </form>

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

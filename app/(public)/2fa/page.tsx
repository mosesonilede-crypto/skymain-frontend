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

async function verify2faRequest(code: string) {
    const mode = getDataMode();

    // Deterministic prototype behavior for local testing
    if (mode === "mock") {
        return { ok: code === "612843", error: code === "612843" ? null : "Invalid code. Use 612843 for testing." };
    }

    const base = getApiBaseUrl();
    if (!base) {
        return { ok: false, error: "NEXT_PUBLIC_API_BASE_URL is not set." };
    }

    try {
        const res = await fetch(`${base}/v1/auth/2fa/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code }),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            return { ok: false, error: text || `Verification failed (${res.status})` };
        }

        return { ok: true, error: null };
    } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Network error" };
    }
}

function HelpCenterFab() {
    // Route all help into /contact unless a dedicated page exists
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <details className="group">
                <summary
                    role="button"
                    aria-label="Help"
                    className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-lg hover:bg-slate-50"
                >
                    <span className="text-lg font-semibold">?</span>
                </summary>

                <div className="mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Help Center</div>
                    <div className="border-t border-slate-200">
                        <Link href="/contact?intent=support" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Contact support
                        </Link>
                        <Link
                            href="/contact?intent=support&topic=access"
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            Account & access
                        </Link>
                        <Link href="/contact?intent=demo" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Request a demo
                        </Link>
                        <Link href="/contact?intent=pricing" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Request pricing
                        </Link>
                        <Link href="/terms" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Legal summary
                        </Link>
                    </div>
                </div>
            </details>
        </div>
    );
}

export default function TwoFactorPage() {
    const router = useRouter();
    const mode = getDataMode();

    const [method, setMethod] = React.useState<"email" | "sms" | "authenticator">("email");
    const [email] = React.useState("manager@skywings.com");

    const [code, setCode] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const isComplete = code.replace(/\D/g, "").length === 6;

    function setDigit(index: number, digit: string) {
        const d = digit.replace(/\D/g, "").slice(-1);
        const digits = code.replace(/\D/g, "").padEnd(6, " ").split("").slice(0, 6);
        digits[index] = d || " ";
        setCode(digits.join("").replace(/\s/g, ""));
    }

    function onPaste(e: React.ClipboardEvent) {
        const text = e.clipboardData.getData("text") || "";
        const digits = text.replace(/\D/g, "").slice(0, 6);
        if (digits) {
            e.preventDefault();
            setCode(digits);
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const normalized = code.replace(/\D/g, "").slice(0, 6);
        if (normalized.length !== 6) {
            setError("Enter the 6-digit verification code.");
            return;
        }

        setSubmitting(true);
        const result = await verify2faRequest(normalized);
        setSubmitting(false);

        if (!result.ok) {
            setError(result.error || "Verification failed.");
            return;
        }

        // Chronology: 2FA -> /app (zero-state entry; user then chooses a menu)
        router.push("/app");
    }

    return (
        <div className="min-h-dvh bg-white text-slate-900">
            <main className="mx-auto max-w-5xl px-6 py-10">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Two-Factor Authentication</h1>
                    <p className="mt-2 text-sm text-slate-600">Verify your identity to continue.</p>

                    <div className="mt-6">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Choose verification method
                        </div>

                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                            <button
                                type="button"
                                onClick={() => setMethod("email")}
                                className={[
                                    "rounded-2xl border px-5 py-4 text-left",
                                    method === "email"
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                <div className="text-sm font-semibold">Email OTP</div>
                                <div className={method === "email" ? "mt-1 text-xs text-white/80" : "mt-1 text-xs text-slate-600"}>
                                    Receive code via email
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMethod("sms")}
                                className={[
                                    "rounded-2xl border px-5 py-4 text-left",
                                    method === "sms"
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                <div className="text-sm font-semibold">SMS OTP</div>
                                <div className={method === "sms" ? "mt-1 text-xs text-white/80" : "mt-1 text-xs text-slate-600"}>
                                    Receive code via text message
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMethod("authenticator")}
                                className={[
                                    "rounded-2xl border px-5 py-4 text-left",
                                    method === "authenticator"
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                <div className="text-sm font-semibold">Authenticator</div>
                                <div
                                    className={
                                        method === "authenticator" ? "mt-1 text-xs text-white/80" : "mt-1 text-xs text-slate-600"
                                    }
                                >
                                    Use authenticator app
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                        {method === "email" ? (
                            <>
                                We sent a code to <span className="font-semibold text-slate-900">{email}</span>.
                            </>
                        ) : method === "sms" ? (
                            <>We sent a code to your registered mobile number.</>
                        ) : (
                            <>Enter the current 6-digit code from your authenticator app.</>
                        )}
                    </div>

                    {error ? (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {error}
                        </div>
                    ) : null}

                    <form className="mt-6" onSubmit={onSubmit}>
                        <div className="text-sm font-semibold text-slate-900">Enter 6-digit code</div>

                        <div className="mt-3 flex items-center gap-3" onPaste={onPaste}>
                            {Array.from({ length: 6 }).map((_, i) => {
                                const digit = code.replace(/\D/g, "").padEnd(6, " ")[i] || "";
                                return (
                                    <input
                                        key={i}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit.trim()}
                                        onChange={(e) => setDigit(i, e.target.value)}
                                        className="h-14 w-14 rounded-2xl border border-slate-200 bg-white text-center text-xl font-semibold text-slate-900 outline-none focus:border-slate-400"
                                        aria-label={`Digit ${i + 1}`}
                                    />
                                );
                            })}
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Demo Mode</div>
                                    <div className="mt-1 text-sm text-slate-600">Use this code for testing.</div>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                    onClick={() => setCode("612843")}
                                >
                                    Use 612843
                                </button>
                            </div>

                            <div className="mt-4 rounded-2xl bg-slate-900 px-6 py-4 text-center text-2xl font-bold tracking-widest text-white">
                                612843
                            </div>

                            <div className="mt-3 text-xs text-slate-500">
                                Data mode: <span className="font-semibold text-slate-700">{mode}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="submit"
                                disabled={!isComplete || submitting}
                                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Verifying..." : "Verify Code"}
                            </button>

                            <Link
                                href="/contact?intent=support&topic=access"
                                className="text-sm font-semibold text-slate-900 hover:underline"
                            >
                                Trouble verifying? Contact support
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            <HelpCenterFab />
        </div>
    );
}

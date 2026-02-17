"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useAuth, type UserRole } from "@/lib/AuthContext";
import { resolveSessionRole } from "@/lib/auth/roles";
import { supabase } from "@/lib/supabaseClient";

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
    const { user, login } = useAuth();

    const [method, setMethod] = React.useState<"email" | "authenticator">("email");
    const [email, setEmail] = React.useState("");
    const [sendError, setSendError] = React.useState<string | null>(null);
    const [sendStatus, setSendStatus] = React.useState<string | null>(null);
    const [sending, setSending] = React.useState(false);
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const [code, setCode] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    React.useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
            return;
        }

        if (typeof window !== "undefined") {
            const storedEmail = window.localStorage.getItem("skymaintain.userEmail") || "";
            if (storedEmail) {
                setEmail(storedEmail);
            }
        }
    }, [user?.email]);


    const isComplete = code.replace(/\D/g, "").length === 6;

    function resolveRole(rawRole?: string | null, licenseCode?: string | null, emailValue?: string | null): UserRole {
        return resolveSessionRole({ rawRole, licenseCode, email: emailValue }) as UserRole;
    }

    function setDigit(index: number, digit: string) {
        const d = digit.replace(/\D/g, "").slice(-1);
        const digits = code.replace(/\D/g, "").padEnd(6, " ").split("").slice(0, 6);
        digits[index] = d || " ";
        setCode(digits.join("").replace(/\s/g, ""));

        // Auto-focus next input when digit is entered
        if (d && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        // Move to previous input on backspace if current is empty
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function onPaste(e: React.ClipboardEvent) {
        const text = e.clipboardData.getData("text") || "";
        const digits = text.replace(/\D/g, "").slice(0, 6);
        if (digits) {
            e.preventDefault();
            setCode(digits);
        }
    }

    async function sendOtp({ showError }: { showError?: boolean } = {}) {
        setSendError(null);
        setSendStatus(null);
        const destination = email.trim();

        if (!destination && method !== "authenticator") {
            if (showError) {
                setSendError("Missing destination for verification.");
            }
            return;
        }

        setSending(true);
        try {
            const res = await fetch("/api/2fa/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ method: "email", destination }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setSendError(data?.error || "Failed to send code.");
                return;
            }
            if (data?.mockCode) {
                setSendError("Email delivery is not configured. Contact support to enable 2FA delivery.");
                return;
            }
            if (data?.email?.accepted?.length) {
                setSendStatus("Email accepted by provider. Check your inbox or spam folder.");
            } else {
                setSendStatus("Request sent. If it doesn’t arrive, check your spam folder or provider logs.");
            }
        } catch (sendErrorCaught) {
            setSendError(sendErrorCaught instanceof Error ? sendErrorCaught.message : "Failed to send code.");
        } finally {
            setSending(false);
        }
    }

    React.useEffect(() => {
        if (method === "authenticator") return;
        if (!email.trim()) return;
        sendOtp();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [method, email]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const normalized = code.replace(/\D/g, "").slice(0, 6);
        if (normalized.length !== 6) {
            setError("Enter the 6-digit verification code.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/2fa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    method: method === "authenticator" ? "auth" : "email",
                    code: normalized,
                    destination: email.trim(),
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.ok) {
                setError(data?.error || "Verification failed.");
                return;
            }

            let authUser = user;
            const storedRoleHint = typeof window !== "undefined" ? window.localStorage.getItem("skymaintain.userRole") : undefined;
            const storedLicenseCode = typeof window !== "undefined" ? window.localStorage.getItem("skymaintain.licenseCode") : undefined;
            const storedEmail = typeof window !== "undefined" ? window.localStorage.getItem("skymaintain.userEmail") : undefined;
            const storedOrg = typeof window !== "undefined"
                ? window.localStorage.getItem("skymaintain.orgName") || window.sessionStorage.getItem("skymaintain.orgName")
                : undefined;

            if (!authUser && typeof window !== "undefined") {
                const storedUser = localStorage.getItem("SKYMAINTAIN_USER");
                if (storedUser) {
                    try {
                        authUser = JSON.parse(storedUser);
                    } catch {
                        localStorage.removeItem("SKYMAINTAIN_USER");
                    }
                }
            }

            if (!authUser && storedEmail && storedOrg) {
                authUser = {
                    email: storedEmail,
                    orgName: storedOrg,
                    role: resolveRole(storedRoleHint, storedLicenseCode, storedEmail),
                };
            }
            if (authUser) {
                authUser = {
                    ...authUser,
                    orgName: authUser.orgName || storedOrg || "SkyMaintain",
                    role: resolveRole(authUser.role || storedRoleHint, storedLicenseCode, authUser.email),
                };
            }

            if (!authUser && supabase) {
                const { data: supabaseData } = await supabase.auth.getUser();
                const supabaseUser = supabaseData?.user;
                if (supabaseUser?.email) {
                    const rawRole =
                        (supabaseUser.app_metadata?.role as string | undefined) ||
                        (supabaseUser.user_metadata?.role as string | undefined) ||
                        storedRoleHint ||
                        "fleet_manager";

                    authUser = {
                        email: supabaseUser.email,
                        orgName: (supabaseUser.user_metadata?.org_name as string | undefined) || "SkyMaintain",
                        role: resolveRole(rawRole, storedLicenseCode, supabaseUser.email),
                    };
                }
            }

            if (!authUser) {
                setError("Unable to resolve your session. Please sign in again.");
                return;
            }

            const loginSuccess = await login(authUser);
            if (!loginSuccess) {
                setError("Failed to create session. Please try again.");
                return;
            }

            // Chronology: 2FA -> welcome (post-login landing)
            router.push("/app/welcome");
        } catch (verifyError) {
            setError(verifyError instanceof Error ? verifyError.message : "Verification failed.");
            return;
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-dvh bg-white text-slate-900">
            <main className="mx-auto max-w-5xl px-6 py-10">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Two-Factor Authentication</h1>
                    <p className="mt-2 text-sm text-slate-600">Verify your identity to continue (email OTP or authenticator).</p>

                    <div className="mt-6">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Choose verification method
                        </div>

                        <div className="mt-3 grid gap-3 md:grid-cols-2">
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

                    {sendError ? (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {sendError}
                        </div>
                    ) : null}
                    {sendStatus ? (
                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                            {sendStatus}
                        </div>
                    ) : null}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                        {method === "email" ? (
                            <>
                                We sent a code to <span className="font-semibold text-slate-900">{email}</span>.
                            </>
                        ) : (
                            <>Enter the current 6-digit code from your authenticator app.</>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            {method !== "authenticator" ? (
                                <button
                                    type="button"
                                    onClick={() => sendOtp({ showError: true })}
                                    disabled={sending}
                                    className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {sending ? "Sending..." : "Resend code"}
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-500">
                        Need help? <Link href="/contact?intent=support" className="font-semibold text-slate-700 underline">Contact support</Link>.
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
                                        ref={(el) => { inputRefs.current[i] = el; }}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit.trim()}
                                        onChange={(e) => setDigit(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className="h-14 w-14 rounded-2xl border border-slate-200 bg-white text-center text-xl font-semibold text-slate-900 outline-none focus:border-slate-400"
                                        aria-label={`Digit ${i + 1}`}
                                    />
                                );
                            })}
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

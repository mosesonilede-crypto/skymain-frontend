"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useAuth, type UserRole } from "@/lib/AuthContext";
import { resolveSessionRole, isSuperAdmin } from "@/lib/auth/roles";
import { getTrialStatus, startTrialIfMissing, clearTrial } from "@/lib/trial";
import { supabase } from "@/lib/supabaseClient";
import { getPublicSiteUrl } from "@/lib/siteUrl";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";

export default function LandingSignupForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [mode, setMode] = React.useState<"signup" | "signin">("signup");
    const [fullName, setFullName] = React.useState("");
    const [orgName, setOrgName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [licenseCode, setLicenseCode] = React.useState("");
    const [showLicenseCode, setShowLicenseCode] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [accept, setAccept] = React.useState(false);

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [verificationSent, setVerificationSent] = React.useState(false);

    // Proactively clear any stale/expired trial data from localStorage
    // whenever the super admin email is present. This ensures that even if
    // an old expired-trial entry lingers in localStorage it never blocks
    // the super admin from signing in — the fix persists across refreshes.
    React.useEffect(() => {
        if (isSuperAdmin({ email: email.trim() })) {
            clearTrial();
        }
    }, [email]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (mode === "signin") {
            const eTrim = email.trim();
            const oTrim = orgName.trim();
            const lTrim = licenseCode.trim();

            // Super admins bypass all trial and license checks
            const _isSuperAdmin = isSuperAdmin({ email: eTrim, licenseCode: lTrim });

            // Belt-and-suspenders: clear any stale trial state immediately
            // so the check below can never fire for a super admin.
            if (_isSuperAdmin) {
                clearTrial();
            }

            if (!_isSuperAdmin) {
                const trial = getTrialStatus();
                if (trial?.expired) {
                    setError("Your 14-day trial has ended. Please contact sales to continue.");
                    return;
                }

                if (!trial && !lTrim) {
                    await startTrialIfMissing();
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
            } else if (!eTrim || !oTrim || !password) {
                setError("Enter your email, organization name, and password.");
                return;
            }

            if (!supabase) {
                setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
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

            // Check if this user is the first from their org → auto-admin
            let dbRole = "fleet_manager";
            try {
                const orgRoleRes = await fetch("/api/auth/org-role", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user?.id, orgName: orgNameMeta, email: eTrim }),
                });
                if (orgRoleRes.ok) {
                    const orgRoleData = await orgRoleRes.json();
                    dbRole = orgRoleData.role || "fleet_manager";
                }
            } catch {
                // Non-blocking — fall back to metadata role
            }

            const rawRole =
                dbRole !== "fleet_manager"
                    ? dbRole
                    : (user?.app_metadata?.role as string | undefined) ||
                    (user?.user_metadata?.role as string | undefined) ||
                    "fleet_manager";
            const role = resolveSessionRole({ rawRole, licenseCode: lTrim, email: eTrim }) as UserRole;

            if (typeof window !== "undefined") {
                window.localStorage.setItem("skymaintain.userRole", role);
                window.localStorage.setItem("skymaintain.licenseCode", lTrim);
                window.localStorage.setItem("skymaintain.userEmail", eTrim);
                window.localStorage.setItem("skymaintain.orgName", orgNameMeta);
            }

            const loginSuccess = await login({ email: eTrim, orgName: orgNameMeta, role });
            if (!loginSuccess) {
                setError("Failed to initialize session. Please try again.");
                return;
            }
            // Super admins have perpetual access — no trial setup needed
            if (!_isSuperAdmin) {
                await startTrialIfMissing();
            }
            router.push("/2fa");
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

        if (!accept) {
            setError("You must accept the terms to continue.");
            return;
        }

        if (!supabase) {
            setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
            return;
        }

        const siteUrl = getPublicSiteUrl();
        const emailRedirectTo = siteUrl ? `${siteUrl}/signin?verified=1` : undefined;

        setSubmitting(true);
        const { error: signUpError, data } = await supabase.auth.signUp({
            email: eTrim,
            password,
            options: {
                data: { full_name: nTrim, org_name: oTrim },
                emailRedirectTo,
            },
        });
        setSubmitting(false);

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        // Auto-assign admin role if first user in their organization
        let resolvedSignupRole = "trial_user";
        try {
            const orgRoleRes = await fetch("/api/auth/org-role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: data?.user?.id, orgName: oTrim, email: eTrim }),
            });
            if (orgRoleRes.ok) {
                const orgRoleData = await orgRoleRes.json();
                resolvedSignupRole = orgRoleData.role || "trial_user";
            }
        } catch {
            // Non-blocking
        }

        // Notify Super Admin about new signup
        try {
            await fetch("/api/admin/signup-notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: eTrim,
                    full_name: nTrim,
                    org_name: oTrim,
                    user_id: data?.user?.id || null,
                    resolved_role: resolvedSignupRole,
                    metadata: {
                        signup_source: "landing_page",
                        is_first_org_user: resolvedSignupRole === "admin",
                    },
                }),
            });
        } catch {
            // Non-blocking - don't fail signup if notification fails
            console.warn("Failed to send signup notification to admin");
        }

        setVerificationSent(true);
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">
                {mode === "signup" ? "Start your free trial" : "Sign in"}
            </div>
            <div className="mt-1 text-sm text-slate-600">
                {mode === "signup"
                    ? "Create an account to access the platform. Email verification is required."
                    : "Access your account without leaving the landing page."}
            </div>

            {error ? (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                </div>
            ) : null}

            {mode === "signup" && verificationSent ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    <div className="font-semibold">Verification email sent</div>
                    <p className="mt-1 text-emerald-800">
                        Check {email || "your inbox"} for the verification email (OTP or link) to activate your account.
                    </p>
                    <div className="mt-3 text-xs text-emerald-800">
                        Already verified?{" "}
                        <button
                            type="button"
                            onClick={() => setMode("signin")}
                            className="font-semibold underline"
                        >
                            Sign in here
                        </button>
                        .
                    </div>
                </div>
            ) : (
                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    {mode === "signup" ? (
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
                    ) : null}

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

                    {mode === "signin" ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-700">License Code (required after trial)</label>
                            <div className="relative mt-1">
                                <input
                                    value={licenseCode}
                                    onChange={(e) => setLicenseCode(e.target.value)}
                                    type={showLicenseCode ? "text" : "password"}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                                    placeholder="Enter your license code"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLicenseCode((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-slate-900"
                                    aria-label={showLicenseCode ? "Hide license code" : "Show license code"}
                                    aria-pressed={showLicenseCode}
                                >
                                    {showLicenseCode ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                            placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                        />
                        {mode === "signup" && <PasswordStrengthIndicator password={password} />}
                    </div>

                    {mode === "signup" ? (
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
                    ) : null}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {submitting
                            ? mode === "signup" ? "Creating account..." : "Signing in..."
                            : mode === "signup" ? "Start free trial" : "Sign in"}
                    </button>

                    <div className="text-xs text-slate-500">
                        {mode === "signup" ? (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("signin")}
                                    className="font-semibold underline"
                                >
                                    Sign in
                                </button>
                                .
                            </>
                        ) : (
                            <>
                                Need an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("signup")}
                                    className="font-semibold underline"
                                >
                                    Start free trial
                                </button>
                                .
                            </>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}

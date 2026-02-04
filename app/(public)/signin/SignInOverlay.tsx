/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { CONTACT_SUPPORT } from "@/lib/routes";

const imgVector22 = "https://www.figma.com/api/mcp/asset/e5b2a959-7f57-42ab-94cc-9040775c2796";
const imgIcon23 = "https://www.figma.com/api/mcp/asset/b7a54d66-e02b-4057-b1f4-54610111e27a";
const imgIcon24 = "https://www.figma.com/api/mcp/asset/adb461ed-3581-4528-8ba6-73a2072cf2c7";
const imgIcon25 = "https://www.figma.com/api/mcp/asset/aea83b5c-d5b9-402a-a8d3-05c0b26bf24a";
const imgIcon26 = "https://www.figma.com/api/mcp/asset/9219b256-e730-4592-9ccc-e83305d7d13e";
const imgIcon27 = "https://www.figma.com/api/mcp/asset/f443bf24-f6dc-4527-ae10-a8e18564f076";
const imgIcon28 = "https://www.figma.com/api/mcp/asset/ff69b9aa-edca-4462-aeb4-d16534a42f50";
const imgIcon29 = "https://www.figma.com/api/mcp/asset/3a85baf1-9147-4b25-9ed7-ab17831e6589";

const DEMO_FLEET = {
    email: "manager@skywings.com",
    org: "SkyWings Airlines",
    password: "TestLogin!234",
};

const DEMO_ENGINEER = {
    email: "engineer@skywings.com",
    org: "SkyWings Airlines",
    password: "TestLogin!234",
};

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

export default function SignInOverlay() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [orgName, setOrgName] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const disabled = useMemo(
        () => !email.trim() || !orgName.trim() || !password || submitting,
        [email, orgName, password, submitting]
    );

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);

        if (disabled) {
            setError("Enter your email, organization name, and password.");
            return;
        }

        setSubmitting(true);
        const result = await loginRequest({
            email: email.trim(),
            orgName: orgName.trim(),
            password,
        });
        setSubmitting(false);

        if (!result.ok) {
            setError(result.error || "Sign in failed.");
            return;
        }

        if (typeof window !== "undefined") {
            window.localStorage.setItem("skymaintain.userEmail", email.trim());
            const trimmedOrg = orgName.trim();
            if (remember) {
                window.localStorage.setItem("skymaintain.orgName", trimmedOrg);
                window.sessionStorage.removeItem("skymaintain.orgName");
            } else {
                window.sessionStorage.setItem("skymaintain.orgName", trimmedOrg);
                window.localStorage.removeItem("skymaintain.orgName");
            }
        }

        router.push("/2fa");
    }

    return (
        <div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60"
            data-name="ProfessionalLandingPage"
            data-node-id="1:1128"
        >
            <div className="mt-[64px] w-[448px] rounded-[14px] border border-black/10 bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="p-[24px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[12px]">
                            <div
                                className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px]"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, rgb(21, 93, 252) 0%, rgb(20, 71, 230) 100%)",
                                }}
                            >
                                <img src={imgVector22} alt="" className="h-[24px] w-[24px]" />
                            </div>
                            <div>
                                <div className="text-[20px] font-['Arial:Bold',sans-serif] text-[#0a0a0a]">
                                    Welcome Back
                                </div>
                                <div className="text-[12px] text-[#4a5565]">Sign in to your account</div>
                            </div>
                        </div>
                        <Link
                            href="/pre-login"
                            className="flex h-[32px] w-[40px] items-center justify-center rounded-[8px]"
                            aria-label="Close login"
                        >
                            <img src={imgIcon24} alt="" className="h-[20px] w-[20px]" />
                        </Link>
                    </div>

                    <form className="mt-[24px] flex flex-col gap-[16px]" onSubmit={onSubmit}>
                        <label className="flex flex-col gap-[4px] text-[14px] text-[#0a0a0a]">
                            Email Address
                            <div className="relative">
                                <img src={imgIcon25} alt="" className="absolute left-[12px] top-[10px] h-[16px] w-[16px]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="john@company.com"
                                    className="h-[36px] w-full rounded-[8px] bg-[#f3f3f5] pl-[40px] pr-[12px] text-[14px] text-[#0a0a0a] outline-none"
                                />
                            </div>
                        </label>

                        <label className="flex flex-col gap-[4px] text-[14px] text-[#0a0a0a]">
                            Organization Name
                            <div className="relative">
                                <img src={imgIcon26} alt="" className="absolute left-[12px] top-[10px] h-[16px] w-[16px]" />
                                <input
                                    type="text"
                                    value={orgName}
                                    onChange={(event) => setOrgName(event.target.value)}
                                    placeholder="Your Company Name"
                                    className="h-[36px] w-full rounded-[8px] bg-[#f3f3f5] pl-[40px] pr-[12px] text-[14px] text-[#0a0a0a] outline-none"
                                />
                            </div>
                            <span className="text-[12px] text-[#6a7282]">
                                Must match your organization&apos;s license agreement
                            </span>
                        </label>

                        <label className="flex flex-col gap-[4px] text-[14px] text-[#0a0a0a]">
                            Password
                            <div className="relative">
                                <img src={imgIcon27} alt="" className="absolute left-[12px] top-[10px] h-[16px] w-[16px]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="••••••••"
                                    className="h-[36px] w-full rounded-[8px] bg-[#f3f3f5] pl-[40px] pr-[12px] text-[14px] text-[#0a0a0a] outline-none"
                                />
                            </div>
                        </label>

                        <div className="flex items-center justify-between text-[14px]">
                            <label className="flex items-center gap-[8px] text-[#4a5565]">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(event) => setRemember(event.target.checked)}
                                    className="h-[13px] w-[13px] rounded border border-[#cbd5e1]"
                                />
                                Remember me
                            </label>
                            <Link href={CONTACT_SUPPORT} className="text-[#155dfc]">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="flex h-[36px] items-center justify-center gap-[8px] rounded-[8px] bg-[#155dfc] text-[14px] text-white disabled:opacity-60"
                            disabled={disabled}
                        >
                            {submitting ? "Signing In..." : "Sign In"}
                            <img src={imgIcon23} alt="" className="h-[16px] w-[16px]" />
                        </button>

                        {error && <div className="text-[12px] text-[#b42318]">{error}</div>}
                    </form>

                    <div className="mt-[16px] text-center text-[14px] text-[#155dfc]">
                        <Link href="/get-started">Don&apos;t have an account? Sign up</Link>
                    </div>

                    <div className="mt-[16px] rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-[16.8px] py-[16.8px]">
                        <div className="text-[12px] font-['Arial:Bold',sans-serif] text-[#364153]">
                            Try Demo Accounts:
                        </div>
                        <div className="mt-[12px] flex flex-col gap-[8px]">
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail(DEMO_FLEET.email);
                                    setOrgName(DEMO_FLEET.org);
                                    setPassword(DEMO_FLEET.password);
                                }}
                                className="flex h-[32px] items-center gap-[8px] rounded-[8px] border border-black/10 bg-white px-[10px] text-[12px] text-[#0a0a0a]"
                            >
                                <img src={imgIcon28} alt="" className="h-[12px] w-[12px]" />
                                Fleet Manager - SkyWings Airlines
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail(DEMO_ENGINEER.email);
                                    setOrgName(DEMO_ENGINEER.org);
                                    setPassword(DEMO_ENGINEER.password);
                                }}
                                className="flex h-[32px] items-center gap-[8px] rounded-[8px] border border-black/10 bg-white px-[10px] text-[12px] text-[#0a0a0a]"
                            >
                                <img src={imgIcon29} alt="" className="h-[12px] w-[12px]" />
                                Maintenance Engineer - SkyWings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

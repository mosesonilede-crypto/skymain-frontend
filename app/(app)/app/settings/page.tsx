"use client";

import React, { useMemo, useState } from "react";

type SettingsSection =
    | "Account & Profile"
    | "Aircraft & Fleet"
    | "Regulatory Compliance"
    | "Notifications & Alerts"
    | "AI & Predictive Maintenance"
    | "Maintenance Workflow"
    | "Documents & Records"
    | "Security & Audit Logs"
    | "Appearance"
    | "About SkyMaintain";

export default function SettingsPage() {
    const sections: { label: SettingsSection; icon: React.ReactNode }[] = useMemo(
        () => [
            { label: "Account & Profile", icon: <UserIcon /> },
            { label: "Aircraft & Fleet", icon: <PlaneIcon /> },
            { label: "Regulatory Compliance", icon: <ShieldIcon /> },
            { label: "Notifications & Alerts", icon: <BellIcon /> },
            { label: "AI & Predictive Maintenance", icon: <SparkIcon /> },
            { label: "Maintenance Workflow", icon: <WrenchIcon /> },
            { label: "Documents & Records", icon: <DocIcon /> },
            { label: "Security & Audit Logs", icon: <LockIcon /> },
            { label: "Appearance", icon: <PaletteIcon /> },
            { label: "About SkyMaintain", icon: <InfoIcon /> },
        ],
        []
    );

    const [active, setActive] = useState<SettingsSection>("Account & Profile");

    const [fullName, setFullName] = useState("John Mitchell");
    const [email, setEmail] = useState("manager@skywings.com");
    const [phone, setPhone] = useState("+1 (555) 123-4567");
    const [role] = useState("Fleet Manager");
    const [readOnly] = useState(true);

    const [twoFAEnabled, setTwoFAEnabled] = useState(true);
    const [saving, setSaving] = useState(false);

    async function save() {
        setSaving(true);
        try {
            await new Promise((r) => setTimeout(r, 500));
            alert("Saved (demo). Wire to backend settings endpoint when available.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 px-2 pb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                            <GearIcon />
                        </div>
                        <div className="text-sm font-semibold text-slate-900">Settings</div>
                    </div>

                    <div className="mt-2 flex flex-col gap-1">
                        {sections.map((s) => {
                            const isActive = s.label === active;
                            return (
                                <button
                                    key={s.label}
                                    type="button"
                                    onClick={() => setActive(s.label)}
                                    className={[
                                        "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm font-semibold",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                                            : "text-slate-700 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={isActive ? "text-indigo-700" : "text-slate-500"}>{s.icon}</span>
                                        <span className="text-left">{s.label}</span>
                                    </span>
                                    {isActive ? <ChevronRightIcon /> : null}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {active === "Account & Profile" ? (
                        <>
                            <h2 className="text-xl font-semibold text-slate-900">Account &amp; Profile</h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Manage your personal information and security settings
                            </p>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <Field label="Full Name" value={fullName} onChange={setFullName} icon={<UserSmallIcon />} />
                                <Field label="Email Address" value={email} onChange={setEmail} icon={<MailIcon />} />
                                <Field label="Phone Number" value={phone} onChange={setPhone} icon={<PhoneIcon />} />

                                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="text-xs font-semibold text-slate-600">User Role</div>
                                    <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <IdBadgeIcon />
                                            {role}
                                        </span>
                                        {readOnly ? (
                                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                                                Read-only
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7">
                                <h3 className="text-base font-semibold text-slate-900">Security</h3>

                                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Two-Factor Authentication</div>
                                            <div className="mt-1 text-sm text-slate-600">Additional security for your account</div>
                                        </div>

                                        <Toggle checked={twoFAEnabled} onChange={setTwoFAEnabled} ariaLabel="Toggle two-factor authentication" />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="mt-4 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                    onClick={() => alert("Change Password (wire to password reset flow)")}
                                >
                                    Change Password
                                </button>
                            </div>

                            <div className="mt-8 flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={save}
                                    disabled={saving}
                                    className={[
                                        "inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm",
                                        saving ? "opacity-70" : "hover:opacity-95",
                                    ].join(" ")}
                                >
                                    <SaveIcon />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <PlaceholderPanel title={active} />
                    )}
                </div>
            </div>

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

function Field({
    label,
    value,
    onChange,
    icon,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-slate-500">{icon}</span>
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
            </div>
        </div>
    );
}

function Toggle({
    checked,
    onChange,
    ariaLabel,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    ariaLabel: string;
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={() => onChange(!checked)}
            className={[
                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                checked ? "bg-indigo-600" : "bg-slate-300",
            ].join(" ")}
        >
            <span
                className={[
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
                    checked ? "translate-x-6" : "translate-x-1",
                ].join(" ")}
            />
        </button>
    );
}

function PlaceholderPanel({ title }: { title: string }) {
    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">
                This section is stubbed for now. We’ll wire it to backend settings and policy controls as endpoints become available.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Placeholder content for <span className="font-semibold">{title}</span>.
            </div>
        </div>
    );
}

function GearIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
            <path d="M19.4 15a8 8 0 0 0 .1-2l2-1.3-2-3.4-2.3.7a7.8 7.8 0 0 0-1.7-1l-.3-2.4H11l-.3 2.4a7.8 7.8 0 0 0-1.7 1L6.7 8.3l-2 3.4 2 1.3a8 8 0 0 0 .1 2l-2 1.3 2 3.4 2.3-.7a7.8 7.8 0 0 0 1.7 1l.3 2.4h4l.3-2.4a7.8 7.8 0 0 0 1.7-1l2.3.7 2-3.4-2-1.3z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 21a8 8 0 1 0-16 0" />
            <circle cx="12" cy="8" r="4" />
        </svg>
    );
}

function PlaneIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 14L21 3l-7 11-4-4z" />
            <path d="M21 3l-9 9" />
            <path d="M6 18l4-4" />
            <path d="M3 21l3-3" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
    );
}

function SparkIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
        </svg>
    );
}

function WrenchIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 7a6 6 0 0 1-8 5.7L7 18.7a2 2 0 0 1-2.8 0l-.9-.9a2 2 0 0 1 0-2.8l6-6A6 6 0 0 1 21 7z" />
        </svg>
    );
}

function DocIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            <path d="M14 3v4h4" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

function PaletteIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a9 9 0 1 0 0 18h3a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h1a4 4 0 0 0 0-8h-3z" />
            <circle cx="7.5" cy="10.5" r="1" />
            <circle cx="10.5" cy="7.5" r="1" />
            <circle cx="15.5" cy="8.5" r="1" />
            <circle cx="8.5" cy="14.5" r="1" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="10" x2="12" y2="16" strokeLinecap="round" />
            <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 6l6 6-6 6" />
        </svg>
    );
}

function UserSmallIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6h16v12H4z" />
            <path d="M4 7l8 6 8-6" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 3h4l2 5-3 2c1.5 3 3.5 5 6.5 6.5l2-3 5 2v4c0 1-1 2-2 2-10 0-18-8-18-18 0-1 1-2 2-2z" />
        </svg>
    );
}

function IdBadgeIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="6" width="16" height="12" rx="2" />
            <path d="M8 10h8" />
            <path d="M8 14h5" />
        </svg>
    );
}

function SaveIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
            <path d="M8 5v6h8V5" />
        </svg>
    );
}

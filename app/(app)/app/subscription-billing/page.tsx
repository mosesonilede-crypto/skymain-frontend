"use client";

import { useEffect, useMemo, useState } from "react";
import { CONTACT_SUPPORT } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";

type BillingCycle = "Monthly" | "Annual";

type Plan = {
    id: "starter" | "professional" | "enterprise";
    name: string;
    tagline: string;
    priceYear: number;
    savePerYear: number;
    bullets: string[];
    badge?: "Most Popular" | "Current Plan";
    isCurrent?: boolean;
};

type PaymentMethod = {
    id: string;
    label: string;
    expires: string;
    isDefault: boolean;
};

type BillingInvoice = {
    date: string;
    description: string;
    amount: string;
    status: "Paid" | "Unpaid" | string;
};

type SubscriptionBillingPayload = {
    status: "Active" | "Inactive" | string;
    currentPlanLabel: string;
    currentPlanPriceYear: number;
    nextBilling: string;
    autoRenewEnabled: boolean;
    teamMembers: number;
    teamMembersAllowed: number;
    billingCycle: BillingCycle;
    plans: Plan[];
    paymentMethods: PaymentMethod[];
    billingHistory: BillingInvoice[];
};

function getPublicEnv(name: string, fallback: string) {
    const v = process.env[name];
    return (v ?? fallback).trim();
}

function normalizeMode(value: string): DataMode {
    if (value === "live" || value === "hybrid" || value === "mock") return value;
    return "mock";
}

function mockPayload(): SubscriptionBillingPayload {
    return {
        status: "Active",
        currentPlanLabel: "professional",
        currentPlanPriceYear: 4990,
        nextBilling: "Feb 1, 2026",
        autoRenewEnabled: true,
        teamMembers: 5,
        teamMembersAllowed: 25,
        billingCycle: "Annual",
        plans: [
            {
                id: "starter",
                name: "Starter",
                tagline: "Perfect for small operations",
                priceYear: 1990,
                savePerYear: 398,
                bullets: [
                    "Up to 5 aircraft",
                    "Basic maintenance tracking",
                    "Email support",
                    "Standard compliance reports",
                    "1 GB cloud storage",
                    "Mobile app access",
                ],
            },
            {
                id: "professional",
                name: "Professional",
                tagline: "For growing fleets",
                priceYear: 4990,
                savePerYear: 998,
                bullets: [
                    "Up to 25 aircraft",
                    "Advanced AI insights",
                    "Priority support",
                    "Real-time IoT integration",
                    "Custom compliance reports",
                    "50 GB cloud storage",
                    "API access",
                    "Multi-location support",
                ],
                badge: "Most Popular",
                isCurrent: true,
            },
            {
                id: "enterprise",
                name: "Enterprise",
                tagline: "For large airlines",
                priceYear: 14990,
                savePerYear: 2998,
                bullets: [
                    "Unlimited aircraft",
                    "Advanced AI mechanic",
                    "24/7 dedicated support",
                    "Custom integrations",
                    "White-label options",
                    "Unlimited storage",
                    "Advanced analytics",
                    "On-premise deployment option",
                    "SLA guarantee",
                    "Custom training",
                ],
            },
        ],
        paymentMethods: [{ id: "pm_1", label: "Visa •••• 4242", expires: "12/25", isDefault: true }],
        billingHistory: [
            {
                date: "12/31/2024",
                description: "SkyMaintain Professional - Annual Subscription",
                amount: "$49.99",
                status: "Paid",
            },
            {
                date: "11/30/2024",
                description: "SkyMaintain Professional - Monthly Subscription",
                amount: "$4.99",
                status: "Paid",
            },
            {
                date: "10/31/2024",
                description: "SkyMaintain Professional - Monthly Subscription",
                amount: "$4.99",
                status: "Paid",
            },
        ],
    };
}

async function fetchLive(baseUrl: string): Promise<SubscriptionBillingPayload> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/admin/billing/summary`;
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`GET /v1/admin/billing/summary failed: ${res.status}`);

    const data = (await res.json()) as Partial<SubscriptionBillingPayload>;
    if (
        !data ||
        typeof data.currentPlanLabel !== "string" ||
        typeof data.currentPlanPriceYear !== "number" ||
        typeof data.nextBilling !== "string" ||
        !Array.isArray(data.plans) ||
        !Array.isArray(data.paymentMethods) ||
        !Array.isArray(data.billingHistory)
    ) {
        throw new Error("Invalid billing payload shape");
    }

    return data as SubscriptionBillingPayload;
}

function StatCard({
    title,
    value,
    subline,
    tone,
}: {
    title: string;
    value: string;
    subline: string;
    tone: "slate" | "purple" | "green";
}) {
    const bg =
        tone === "purple"
            ? "bg-violet-50 border-violet-200"
            : tone === "green"
                ? "bg-emerald-50 border-emerald-200"
                : "bg-slate-50 border-slate-200";

    return (
        <div className={`rounded-2xl border ${bg} p-4`}>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{value}</div>
            <div className="mt-1 text-sm text-slate-600">{subline}</div>
        </div>
    );
}

function Badge({ label }: { label: string }) {
    const cls = label === "Most Popular" ? "bg-violet-600 text-white" : "bg-slate-900 text-white";

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
            {label}
        </span>
    );
}

function PlanCard({
    plan,
    onUpgrade,
}: {
    plan: Plan;
    onUpgrade: (planId: Plan["id"]) => void;
}) {
    const isCurrent = !!plan.isCurrent;

    return (
        <div
            className={[
                "relative rounded-2xl border bg-white p-5",
                isCurrent ? "border-violet-300 shadow-[0_0_0_2px_rgba(167,139,250,0.35)]" : "border-slate-200",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{plan.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{plan.tagline}</div>
                </div>
                {plan.badge ? <Badge label={plan.badge} /> : null}
            </div>

            <div className="mt-4 flex items-baseline gap-2">
                <div className="text-2xl font-semibold text-slate-900">${plan.priceYear}</div>
                <div className="text-sm text-slate-600">/year</div>
            </div>

            <div className="mt-2 text-sm text-emerald-700">Save ${plan.savePerYear}/year</div>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {plan.bullets.map((b, idx) => (
                    <li key={idx} className="flex gap-2">
                        <span aria-hidden="true" className="mt-0.5 text-emerald-600">
                            ✓
                        </span>
                        <span>{b}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-5">
                {isCurrent ? (
                    <button
                        type="button"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600"
                        disabled
                    >
                        Current Plan
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                        onClick={() => onUpgrade(plan.id)}
                    >
                        Upgrade
                    </button>
                )}
            </div>
        </div>
    );
}

export default function SubscriptionBillingPage() {
    const mode = useMemo(() => normalizeMode(getPublicEnv("NEXT_PUBLIC_DATA_MODE", "mock")), []);
    const baseUrl = useMemo(() => getPublicEnv("NEXT_PUBLIC_API_BASE_URL", ""), []);

    const [source, setSource] = useState<"mock" | "live">("mock");
    const [payload, setPayload] = useState<SubscriptionBillingPayload>(() => mockPayload());
    const [loading, setLoading] = useState<boolean>(mode !== "mock");
    const [error, setError] = useState<string>("");

    const [cycle, setCycle] = useState<BillingCycle>(() => mockPayload().billingCycle);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setError("");

            if (mode === "mock") {
                const p = mockPayload();
                if (cancelled) return;
                setPayload(p);
                setCycle(p.billingCycle);
                setSource("mock");
                setLoading(false);
                return;
            }

            if (!baseUrl) {
                const p = mockPayload();
                if (cancelled) return;
                setPayload(p);
                setCycle(p.billingCycle);
                setSource("mock");
                setLoading(false);
                return;
            }

            setLoading(true);

            if (mode === "live") {
                try {
                    const live = await fetchLive(baseUrl);
                    if (cancelled) return;
                    setPayload(live);
                    setCycle(live.billingCycle ?? "Annual");
                    setSource("live");
                } catch (e) {
                    if (cancelled) return;
                    const p = mockPayload();
                    setPayload(p);
                    setCycle(p.billingCycle);
                    setSource("mock");
                    setError(e instanceof Error ? e.message : "Failed to load billing data");
                } finally {
                    if (!cancelled) setLoading(false);
                }
                return;
            }

            try {
                const live = await fetchLive(baseUrl);
                if (cancelled) return;
                setPayload(live);
                setCycle(live.billingCycle ?? "Annual");
                setSource("live");
            } catch (e) {
                if (cancelled) return;
                const p = mockPayload();
                setPayload(p);
                setCycle(p.billingCycle);
                setSource("mock");
                setError(e instanceof Error ? e.message : "Failed to load billing data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [mode, baseUrl]);

    function onUpgrade(planId: Plan["id"]) {
        void planId;
    }

    function onAddPaymentMethod() {
        return;
    }

    function onContactSupport() {
        window.location.assign(CONTACT_SUPPORT);
    }

    return (
        <div className="px-4 pb-10 pt-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm font-semibold text-slate-900">Admin Panel</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">Subscription &amp; Billing</div>
                    <div className="mt-1 text-sm text-slate-600">
                        Manage your subscription, payment methods, and billing history
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        Data: {source}
                        {loading ? " • loading…" : ""}
                    </div>
                    {error ? (
                        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {payload.status}
                    </span>
                </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Current Plan"
                    value={payload.currentPlanLabel}
                    subline={`$${payload.currentPlanPriceYear}/year`}
                    tone="slate"
                />
                <StatCard
                    title="Next Billing"
                    value={payload.nextBilling}
                    subline={payload.autoRenewEnabled ? "Auto-renew enabled" : "Auto-renew disabled"}
                    tone="purple"
                />
                <StatCard
                    title="Team Members"
                    value={String(payload.teamMembers)}
                    subline={`of ${payload.teamMembersAllowed} allowed`}
                    tone="green"
                />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Billing Cycle</div>
                        <div className="mt-1 text-sm text-slate-600">Save $998 per year with annual billing</div>
                    </div>

                    <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
                        <button
                            type="button"
                            className={[
                                "rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                                cycle === "Monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
                            ].join(" ")}
                            onClick={() => setCycle("Monthly")}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            className={[
                                "rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                                cycle === "Annual" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900",
                            ].join(" ")}
                            onClick={() => setCycle("Annual")}
                        >
                            Annual
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="text-sm font-semibold text-slate-900">Available Plans</div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {payload.plans.map((p) => (
                        <PlanCard key={p.id} plan={p} onUpgrade={onUpgrade} />
                    ))}
                </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Payment Methods</div>
                        <div className="mt-1 text-sm text-slate-600">Manage your payment methods and billing information</div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                        onClick={onAddPaymentMethod}
                    >
                        + Add Payment Method
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {payload.paymentMethods.map((pm) => (
                        <div
                            key={pm.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                            <div>
                                <div className="text-sm font-semibold text-slate-900">
                                    {pm.label}{" "}
                                    {pm.isDefault ? (
                                        <span className="ml-2 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700">
                                            Default
                                        </span>
                                    ) : null}
                                </div>
                                <div className="mt-1 text-sm text-slate-600">Expires {pm.expires}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="text-sm text-slate-600">billing@skywings.com</div>
                                {!pm.isDefault ? (
                                    <button
                                        type="button"
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                    >
                                        Set Default
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-400"
                                        disabled
                                    >
                                        Set Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
                <div>
                    <div className="text-sm font-semibold text-slate-900">Billing History</div>
                    <div className="mt-1 text-sm text-slate-600">Download invoices and view past payments</div>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {payload.billingHistory.map((row, idx) => (
                                <tr key={`${row.date}-${idx}`} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 text-slate-700">{row.date}</td>
                                    <td className="px-4 py-3 text-slate-900">{row.description}</td>
                                    <td className="px-4 py-3 text-slate-900">{row.amount}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                        >
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {payload.billingHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-sm text-slate-600">
                                        No billing history available.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="text-sm font-semibold text-slate-900">Need Help?</div>
                    <div className="mt-1 text-sm text-slate-600">Our support team is here</div>
                    <p className="mt-3 text-sm text-slate-600">
                        Have questions about billing or subscriptions? Contact our support team for assistance.
                    </p>
                    <button
                        type="button"
                        className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                        onClick={onContactSupport}
                    >
                        Contact Support
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="text-sm font-semibold text-slate-900">Secure Payments</div>
                    <div className="mt-1 text-sm text-slate-600">Your data is protected</div>
                    <p className="mt-3 text-sm text-slate-600">
                        All transactions are encrypted and secure. We never store your full card details.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            PCI DSS
                        </span>
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            SSL Encrypted
                        </span>
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            256-bit
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CONTACT_SUPPORT } from "@/lib/routes";
import { useAuth } from "@/lib/AuthContext";

type BillingCycle = "Monthly" | "Annual";

type Plan = {
    id: "starter" | "professional" | "enterprise";
    name: string;
    tagline: string;
    priceMonth: number;
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
    invoiceUrl?: string;
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
    stripeCustomerId?: string;
    priceSyncStatus?: "stripe" | "fallback";
    plans: Plan[];
    paymentMethods: PaymentMethod[];
    billingHistory: BillingInvoice[];
};
const EMPTY_PAYLOAD: SubscriptionBillingPayload = {
    status: "Inactive",
    currentPlanLabel: "Not available",
    currentPlanPriceYear: 0,
    nextBilling: "Not available",
    autoRenewEnabled: false,
    teamMembers: 0,
    teamMembersAllowed: 0,
    billingCycle: "Annual",
    priceSyncStatus: "fallback",
    plans: [],
    paymentMethods: [],
    billingHistory: [],
};

async function fetchLive(): Promise<SubscriptionBillingPayload> {
    // Use local API endpoint
    const url = "/api/billing";
    const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`GET /api/billing failed: ${res.status}`);

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
    billingCycle,
    onSelectPlan,
    isLoading,
}: {
    plan: Plan;
    billingCycle: BillingCycle;
    onSelectPlan: (planId: string, interval: "monthly" | "yearly") => void;
    isLoading: boolean;
}) {
    const isCurrent = !!plan.isCurrent;
    const interval = billingCycle === "Annual" ? "yearly" : "monthly";
    const displayPrice = billingCycle === "Annual"
        ? `$${(plan.priceYear / 100).toFixed(0)}`
        : `$${(plan.priceMonth / 100).toFixed(0)}`;

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

            <div className="mt-4">
                <div className="text-lg font-semibold text-slate-900">
                    {displayPrice}<span className="text-sm font-normal text-slate-500">/{billingCycle === "Annual" ? "year" : "month"}</span>
                </div>
                {billingCycle === "Annual" && plan.savePerYear > 0 && (
                    <div className="text-sm text-emerald-600">Save ${(plan.savePerYear / 100).toFixed(0)}/year</div>
                )}
            </div>

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
                        className="w-full rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700"
                        disabled
                    >
                        Current Plan
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onSelectPlan(plan.id, interval)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : plan.id === "enterprise" ? "Contact Sales" : "Subscribe"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function SubscriptionBillingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const [payload, setPayload] = useState<SubscriptionBillingPayload>(EMPTY_PAYLOAD);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const [cycle, setCycle] = useState<BillingCycle>("Annual");

    // Handle checkout success/cancel from URL params
    useEffect(() => {
        const success = searchParams.get("success");
        const canceled = searchParams.get("canceled");

        if (success === "true") {
            setSuccessMessage("🎉 Subscription successful! Thank you for your purchase.");
            // Clear URL params after showing message
            router.replace("/app/subscription-billing");
        } else if (canceled === "true") {
            setError("Checkout was canceled. No charges were made.");
            router.replace("/app/subscription-billing");
        }
    }, [searchParams, router]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setError("");
            setLoading(true);
            try {
                const live = await fetchLive();
                if (cancelled) return;
                setPayload(live);
                setCycle(live.billingCycle ?? "Annual");
            } catch (e) {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : "Failed to load billing data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, []);

    const [checkoutLoading, setCheckoutLoading] = useState(false);

    async function onSelectPlan(planId: string, interval: "monthly" | "yearly") {
        // Enterprise plan goes to contact sales
        if (planId === "enterprise") {
            window.location.assign(CONTACT_SUPPORT);
            return;
        }

        setCheckoutLoading(true);
        try {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: planId,
                    interval,
                    customerEmail: user?.email,
                    orgName: user?.orgName,
                }),
            });

            const data = await res.json();

            if (data.ok && data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                setError(data.error || "Failed to create checkout session");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Checkout failed");
        } finally {
            setCheckoutLoading(false);
        }
    }

    async function onManageBilling() {
        if (!payload.stripeCustomerId) {
            setError("No Stripe customer found. Please subscribe to a plan first.");
            return;
        }
        setCheckoutLoading(true);
        try {
            const res = await fetch("/api/billing/portal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: payload.stripeCustomerId,
                }),
            });

            const data = await res.json();

            if (data.ok && data.url) {
                window.location.href = data.url;
            } else {
                setError(data.error || "Failed to open billing portal");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Portal access failed");
        } finally {
            setCheckoutLoading(false);
        }
    }

    function onAddPaymentMethod() {
        router.push("/app/subscription-billing/add-payment");
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
                        Data: live
                        {loading ? " • loading…" : ""}
                    </div>
                    {error ? (
                        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            {error}
                        </div>
                    ) : null}
                    {successMessage ? (
                        <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                            {successMessage}
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
                    subline="Enterprise subscription"
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
                        <div className="mt-1 text-sm text-slate-600">Save with annual billing — contact us for details</div>
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">Available Plans</div>
                        <span
                            className={[
                                "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                                payload.priceSyncStatus === "stripe"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-amber-200 bg-amber-50 text-amber-700",
                            ].join(" ")}
                        >
                            {payload.priceSyncStatus === "stripe" ? "Stripe prices loaded" : "Fallback prices"}
                        </span>
                    </div>
                    {payload.status === "Active" && (
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            onClick={onManageBilling}
                            disabled={checkoutLoading}
                        >
                            Manage Subscription →
                        </button>
                    )}
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {payload.plans.map((p) => (
                        <PlanCard
                            key={p.id}
                            plan={p}
                            billingCycle={cycle}
                            onSelectPlan={onSelectPlan}
                            isLoading={checkoutLoading}
                        />
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
                                        {row.invoiceUrl ? (
                                            <a
                                                href={row.invoiceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                            >
                                                Download
                                            </a>
                                        ) : (
                                            <span className="text-sm text-slate-400">—</span>
                                        )}
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

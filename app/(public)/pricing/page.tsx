"use client";

import * as React from "react";
import Link from "next/link";
import { CONTACT_DEMO, CONTACT_SUPPORT } from "@/lib/routes";
import { PLAN_DETAILS } from "@/lib/stripe";

type BillingInterval = "monthly" | "yearly";
type PlanId = "starter" | "professional" | "enterprise";

type BillingPlan = {
    id: PlanId;
    name: string;
    tagline: string;
    priceMonth: number;
    priceYear: number;
    bullets: string[];
    badge?: "Most Popular" | "Current Plan";
};

type BillingApiResponse = {
    plans: BillingPlan[];
};

function cx(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

function CheckIcon(): React.ReactElement {
    return (
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path
                    d="M20 6 9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}

function PricingCard({
    planId,
    plan,
    interval,
    isPopular,
    onSelectPlan,
    isLoading,
}: {
    planId: PlanId;
    plan: BillingPlan;
    interval: BillingInterval;
    isPopular: boolean;
    onSelectPlan: (planId: PlanId) => void;
    isLoading: boolean;
}) {
    const price = interval === "yearly" ? plan.priceYear : plan.priceMonth;
    const displayPrice = `$${(price / 100).toLocaleString()}`;
    const period = interval === "yearly" ? "/year" : "/month";

    const monthlySavings = interval === "yearly"
        ? Math.round((plan.priceMonth * 12 - plan.priceYear) / 100)
        : 0;

    const isEnterprise = planId === "enterprise";

    return (
        <div
            className={cx(
                "relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm transition-shadow hover:shadow-md",
                isPopular ? "border-blue-600 ring-2 ring-blue-200" : "border-slate-200"
            )}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="text-left">
                <h2 className="text-xl font-semibold text-slate-900">{plan.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.tagline}</p>
            </div>

            <div className="mt-5">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                        {displayPrice}
                    </span>
                    <span className="text-sm font-medium text-slate-500">{period}</span>
                </div>
                {interval === "yearly" && monthlySavings > 0 && (
                    <p className="mt-1 text-sm font-medium text-emerald-600">
                        Save ${monthlySavings}/year vs monthly
                    </p>
                )}
                {interval === "monthly" && (
                    <p className="mt-1 text-sm text-slate-500">
                        ${(plan.priceYear / 100 / 12).toFixed(0)}/mo billed annually
                    </p>
                )}
            </div>

            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
                {plan.bullets.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">{CheckIcon()}</div>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-7">
                {isEnterprise ? (
                    <a
                        href={CONTACT_SUPPORT}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                        Contact Sales
                    </a>
                ) : (
                    <button
                        type="button"
                        onClick={() => onSelectPlan(planId)}
                        disabled={isLoading}
                        className={cx(
                            "inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                            isPopular
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                        )}
                    >
                        {isLoading ? "Redirecting..." : "Get Started"}
                    </button>
                )}
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                type="button"
                className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-slate-900 hover:text-slate-700"
                onClick={() => setOpen(!open)}
            >
                <span>{question}</span>
                <span className="ml-4 shrink-0 text-slate-400">{open ? "−" : "+"}</span>
            </button>
            {open && (
                <div className="pb-4 text-sm leading-relaxed text-slate-600">{answer}</div>
            )}
        </div>
    );
}

const FAQS = [
    {
        question: "Can I switch plans at any time?",
        answer: "Yes. You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged a prorated amount for the remainder of your billing cycle. Downgrades take effect at the next billing period.",
    },
    {
        question: "Is there a free trial?",
        answer: "Yes — all new accounts start with a 14-day free trial with full access to Professional features. No credit card required to get started.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and bank transfers for Enterprise plans. All payments are processed securely through Stripe.",
    },
    {
        question: "Can I cancel at any time?",
        answer: "Absolutely. There are no long-term contracts. Cancel anytime and you'll retain access until the end of your current billing period.",
    },
    {
        question: "Do you offer discounts for annual billing?",
        answer: "Yes — annual plans save approximately 17% compared to monthly billing. The savings are reflected in the pricing toggle above.",
    },
    {
        question: "What happens when my trial expires?",
        answer: "When your 14-day trial ends, you'll be prompted to choose a plan to continue. Your data is preserved for 30 days, giving you time to decide.",
    },
];

export default function PricingPage(): React.ReactElement {
    const [interval, setInterval] = React.useState<BillingInterval>("yearly");
    const [plansById, setPlansById] = React.useState<Record<PlanId, BillingPlan>>(() => ({
        starter: {
            id: "starter",
            name: PLAN_DETAILS.starter.name,
            tagline: PLAN_DETAILS.starter.tagline,
            priceMonth: PLAN_DETAILS.starter.monthlyPrice,
            priceYear: PLAN_DETAILS.starter.yearlyPrice,
            bullets: [...PLAN_DETAILS.starter.features],
        },
        professional: {
            id: "professional",
            name: PLAN_DETAILS.professional.name,
            tagline: PLAN_DETAILS.professional.tagline,
            priceMonth: PLAN_DETAILS.professional.monthlyPrice,
            priceYear: PLAN_DETAILS.professional.yearlyPrice,
            bullets: [...PLAN_DETAILS.professional.features],
            badge: "Most Popular",
        },
        enterprise: {
            id: "enterprise",
            name: PLAN_DETAILS.enterprise.name,
            tagline: PLAN_DETAILS.enterprise.tagline,
            priceMonth: PLAN_DETAILS.enterprise.monthlyPrice,
            priceYear: PLAN_DETAILS.enterprise.yearlyPrice,
            bullets: [...PLAN_DETAILS.enterprise.features],
        },
    }));
    const [checkoutLoadingPlan, setCheckoutLoadingPlan] = React.useState<PlanId | null>(null);
    const [checkoutError, setCheckoutError] = React.useState<string | null>(null);

    const plans: { id: PlanId; isPopular: boolean }[] = [
        { id: "starter", isPopular: false },
        { id: "professional", isPopular: true },
        { id: "enterprise", isPopular: false },
    ];

    React.useEffect(() => {
        let cancelled = false;

        async function loadLivePricing() {
            try {
                const response = await fetch("/api/billing", { cache: "no-store" });
                if (!response.ok) return;

                const payload = (await response.json()) as BillingApiResponse;
                if (cancelled || !Array.isArray(payload.plans)) return;

                setPlansById((prev) => {
                    const next = { ...prev };
                    payload.plans.forEach((plan) => {
                        if (plan.id && next[plan.id]) {
                            next[plan.id] = {
                                id: plan.id,
                                name: plan.name,
                                tagline: plan.tagline,
                                priceMonth: plan.priceMonth,
                                priceYear: plan.priceYear,
                                bullets: plan.bullets,
                                badge: plan.badge,
                            };
                        }
                    });
                    return next;
                });
            } catch {
                // Keep local fallback pricing
            }
        }

        loadLivePricing();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleSelectPlan(planId: PlanId) {
        if (planId === "enterprise") {
            window.location.assign(CONTACT_SUPPORT);
            return;
        }

        setCheckoutError(null);
        setCheckoutLoadingPlan(planId);
        try {
            const response = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: planId,
                    interval,
                }),
            });

            const data = (await response.json()) as { ok?: boolean; url?: string; error?: string };
            if (data.ok && data.url) {
                window.location.href = data.url;
                return;
            }

            setCheckoutError(data.error || "Unable to start checkout right now.");
        } catch {
            setCheckoutError("Unable to start checkout right now.");
        } finally {
            setCheckoutLoadingPlan(null);
        }
    }

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="rounded-2xl bg-gradient-to-b from-slate-50 to-white px-6 py-16 text-center">
                <div className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    Pricing
                </div>

                <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    Simple, transparent pricing
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                    Choose the plan that fits your operation. Start with a 14-day free trial — no credit card required.
                </p>

                {/* Billing interval toggle */}
                <div className="mx-auto mt-8 flex items-center justify-center gap-3">
                    <span
                        className={cx(
                            "text-sm font-medium",
                            interval === "monthly" ? "text-slate-900" : "text-slate-500"
                        )}
                    >
                        Monthly
                    </span>
                    <button
                        type="button"
                        className={cx(
                            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                            interval === "yearly" ? "bg-blue-600" : "bg-slate-300"
                        )}
                        onClick={() => setInterval(interval === "monthly" ? "yearly" : "monthly")}
                        role="switch"
                        aria-checked={interval === "yearly"}
                    >
                        <span
                            className={cx(
                                "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                interval === "yearly" ? "translate-x-5" : "translate-x-0"
                            )}
                        />
                    </button>
                    <span
                        className={cx(
                            "text-sm font-medium",
                            interval === "yearly" ? "text-slate-900" : "text-slate-500"
                        )}
                    >
                        Annual
                    </span>
                    {interval === "yearly" && (
                        <span className="ml-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            Save ~17%
                        </span>
                    )}
                </div>
            </section>

            {/* Plan cards */}
            <section className="mx-auto mt-10 max-w-5xl px-4">
                {checkoutError && (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {checkoutError}
                    </div>
                )}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {plans.map(({ id, isPopular }) => (
                        <PricingCard
                            key={id}
                            planId={id}
                            plan={plansById[id]}
                            interval={interval}
                            isPopular={isPopular}
                            onSelectPlan={handleSelectPlan}
                            isLoading={checkoutLoadingPlan === id}
                        />
                    ))}
                </div>

                <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-slate-500">
                    All plans include SSL encryption, 99.9% uptime SLA, and GDPR-compliant data handling.
                    Pricing is in USD. Volume discounts available for Enterprise.
                </p>
            </section>

            {/* Feature comparison table */}
            <section className="mx-auto mt-16 max-w-4xl px-4">
                <h2 className="text-center text-2xl font-semibold text-slate-900">Compare Plans</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    See which plan is right for your operation
                </p>

                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-slate-900">Feature</th>
                                <th className="px-5 py-3 text-center font-semibold text-slate-900">Starter</th>
                                <th className="px-5 py-3 text-center font-semibold text-blue-600">Professional</th>
                                <th className="px-5 py-3 text-center font-semibold text-slate-900">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {[
                                ["Aircraft Fleet Management", "✓", "✓", "✓"],
                                ["Work Orders & Job Cards", "✓", "✓", "✓"],
                                ["Parts Inventory", "✓", "✓", "✓"],
                                ["Maintenance Calendar", "✓", "✓", "✓"],
                                ["AI Insights & Reports", "—", "✓", "✓"],
                                ["Regulatory Compliance", "—", "✓", "✓"],
                                ["API & Ingestion Contracts", "—", "✓", "✓"],
                                ["Predictive Alerts", "—", "—", "✓"],
                                ["Dedicated Support", "—", "—", "✓"],
                                ["Custom Integrations", "—", "—", "✓"],
                                ["Aircraft Limit", "Up to 5", "Up to 25", "Unlimited"],
                                ["Cloud Storage", "1 GB", "50 GB", "Unlimited"],
                                ["Team Members", "Up to 5", "Up to 25", "Unlimited"],
                                ["Support", "Email", "Priority", "24/7 Dedicated"],
                            ].map(([feature, starter, pro, enterprise], i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="px-5 py-3 font-medium text-slate-700">{feature}</td>
                                    <td className="px-5 py-3 text-center text-slate-600">{starter}</td>
                                    <td className="px-5 py-3 text-center text-slate-900 font-medium">{pro}</td>
                                    <td className="px-5 py-3 text-center text-slate-600">{enterprise}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQ */}
            <section className="mx-auto mt-16 max-w-3xl px-4">
                <h2 className="text-center text-2xl font-semibold text-slate-900">
                    Frequently Asked Questions
                </h2>
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6">
                    {FAQS.map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-12 text-center text-white">
                    <h3 className="text-3xl font-semibold tracking-tight">Ready to get started?</h3>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
                        Start your 14-day free trial today. No credit card required. Full access to Professional features.
                    </p>

                    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                            Start Free Trial
                        </Link>

                        <a
                            href={CONTACT_DEMO}
                            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                        >
                            Schedule a Demo
                        </a>
                    </div>
                </div>
            </section>

            <div className="h-12" />
        </div>
    );
}

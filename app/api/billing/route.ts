import { NextRequest, NextResponse } from "next/server";
import { getDataMode } from "@/lib/dataService";
import { getStripe, PLAN_DETAILS, STRIPE_PRICES } from "@/lib/stripe";
import { verifyPayload } from "@/lib/twoFactor";
import { resolveSessionRole } from "@/lib/auth/roles";
import { getLicenseByEmail, getLicenseByKey } from "@/lib/licenseService";
import type { LicenseRecord } from "@/lib/license";

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

type PlanId = Plan["id"];
type PlanPricing = Record<PlanId, { monthly: number; yearly: number }>;
type PriceSyncStatus = "stripe" | "fallback";

type SessionPayload = {
    email: string;
    role?: string;
    licenseCode?: string;
    exp: number;
};

const SESSION_COOKIE = "sm_session";

const PLAN_IDS: PlanId[] = ["starter", "professional", "enterprise"];

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

function isSuperAdminSession(req: NextRequest): boolean {
    const session = getSession(req);
    if (!session) return false;

    const resolved = resolveSessionRole({
        rawRole: session.role,
        licenseCode: session.licenseCode,
        email: session.email,
    });

    return resolved === "super_admin";
}

function forceEnterprise(payload: SubscriptionBillingPayload, pricing: PlanPricing): SubscriptionBillingPayload {
    const plans: Plan[] = payload.plans.map((plan): Plan => {
        const badge: Plan["badge"] = plan.id === "enterprise"
            ? "Current Plan"
            : plan.badge === "Current Plan"
                ? undefined
                : plan.badge;

        return {
            ...plan,
            isCurrent: plan.id === "enterprise",
            badge,
        };
    });

    return {
        ...payload,
        status: "Active",
        currentPlanLabel: "enterprise",
        currentPlanPriceYear: pricing.enterprise.yearly,
        teamMembersAllowed: 999,
        plans,
    };
}

function defaultPlanPricing(): PlanPricing {
    return {
        starter: {
            monthly: PLAN_DETAILS.starter.monthlyPrice,
            yearly: PLAN_DETAILS.starter.yearlyPrice,
        },
        professional: {
            monthly: PLAN_DETAILS.professional.monthlyPrice,
            yearly: PLAN_DETAILS.professional.yearlyPrice,
        },
        enterprise: {
            monthly: PLAN_DETAILS.enterprise.monthlyPrice,
            yearly: PLAN_DETAILS.enterprise.yearlyPrice,
        },
    };
}

function resolvePlanFromPrice(priceId?: string | null): PlanId | undefined {
    if (!priceId) return undefined;
    for (const planId of PLAN_IDS) {
        const mapped = STRIPE_PRICES[planId];
        if (mapped.monthly === priceId || mapped.yearly === priceId) {
            return planId;
        }
    }
    return undefined;
}

function toCentsFromStripe(unitAmount?: number | null): number | null {
    if (typeof unitAmount !== "number") return null;
    return unitAmount;
}

async function fetchStripePlanPricing(): Promise<{ pricing: PlanPricing; priceSyncStatus: PriceSyncStatus }> {
    const stripe = getStripe();
    const pricing = defaultPlanPricing();
    if (!stripe) return { pricing, priceSyncStatus: "fallback" };

    let syncedCount = 0;

    for (const planId of PLAN_IDS) {
        const monthlyId = STRIPE_PRICES[planId].monthly;
        const yearlyId = STRIPE_PRICES[planId].yearly;

        if (monthlyId) {
            try {
                const monthlyPrice = await stripe.prices.retrieve(monthlyId);
                const cents = toCentsFromStripe(monthlyPrice.unit_amount);
                if (cents !== null) {
                    pricing[planId].monthly = cents;
                    syncedCount += 1;
                }
            } catch {
                // Keep fallback defaults for this plan interval
            }
        }

        if (yearlyId) {
            try {
                const yearlyPrice = await stripe.prices.retrieve(yearlyId);
                const cents = toCentsFromStripe(yearlyPrice.unit_amount);
                if (cents !== null) {
                    pricing[planId].yearly = cents;
                    syncedCount += 1;
                }
            } catch {
                // Keep fallback defaults for this plan interval
            }
        }
    }

    return {
        pricing,
        priceSyncStatus: syncedCount > 0 ? "stripe" : "fallback",
    };
}

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
    plans: Plan[];
    paymentMethods: PaymentMethod[];
    billingHistory: BillingInvoice[];
    priceSyncStatus: PriceSyncStatus;
};

function generateMockBillingData(pricing?: PlanPricing, priceSyncStatus: PriceSyncStatus = "fallback"): SubscriptionBillingPayload {
    const effectivePricing = pricing ?? defaultPlanPricing();
    return {
        status: "Active",
        currentPlanLabel: "professional",
        currentPlanPriceYear: effectivePricing.professional.yearly,
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
                priceMonth: effectivePricing.starter.monthly,
                priceYear: effectivePricing.starter.yearly,
                savePerYear: effectivePricing.starter.monthly * 12 - effectivePricing.starter.yearly,
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
                priceMonth: effectivePricing.professional.monthly,
                priceYear: effectivePricing.professional.yearly,
                savePerYear: effectivePricing.professional.monthly * 12 - effectivePricing.professional.yearly,
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
                isCurrent: true,
                badge: "Current Plan",
            },
            {
                id: "enterprise",
                name: "Enterprise",
                tagline: "For large-scale operations",
                priceMonth: effectivePricing.enterprise.monthly,
                priceYear: effectivePricing.enterprise.yearly,
                savePerYear: effectivePricing.enterprise.monthly * 12 - effectivePricing.enterprise.yearly,
                bullets: [
                    "Unlimited aircraft",
                    "Advanced AI insights",
                    "24/7 dedicated support",
                    "Real-time IoT integration",
                    "Custom compliance reports",
                    "Unlimited cloud storage",
                    "Full API access",
                    "Multi-location support",
                    "Custom integrations",
                    "SLA guarantee",
                ],
                badge: "Most Popular",
            },
        ],
        paymentMethods: [
            {
                id: "pm_1",
                label: "Visa ending in 4242",
                expires: "12/2025",
                isDefault: true,
            },
            {
                id: "pm_2",
                label: "American Express ending in 8899",
                expires: "06/2027",
                isDefault: false,
            },
        ],
        billingHistory: [
            {
                date: "Jan 1, 2026",
                description: "Annual subscription renewal - Professional Plan",
                amount: "$4,990.00",
                status: "Paid",
            },
            {
                date: "Jan 1, 2025",
                description: "Annual subscription renewal - Professional Plan",
                amount: "$4,990.00",
                status: "Paid",
            },
            {
                date: "Dec 1, 2024",
                description: "Additional team member",
                amount: "$99.00",
                status: "Paid",
            },
            {
                date: "Nov 1, 2024",
                description: "Storage upgrade (50GB → 100GB)",
                amount: "$50.00",
                status: "Paid",
            },
        ],
        priceSyncStatus,
    };
}

// Stripe integration - when STRIPE_SECRET_KEY is set, fetch real data
async function fetchStripeBillingData(customerId?: string): Promise<SubscriptionBillingPayload | null> {
    const stripe = getStripe();
    if (!stripe) return null;

    try {
        const { pricing, priceSyncStatus } = await fetchStripePlanPricing();

        const toPlans = (currentPlan?: PlanId): Plan[] => {
            return [
                {
                    id: "starter",
                    name: PLAN_DETAILS.starter.name,
                    tagline: PLAN_DETAILS.starter.tagline,
                    priceMonth: pricing.starter.monthly,
                    priceYear: pricing.starter.yearly,
                    savePerYear: pricing.starter.monthly * 12 - pricing.starter.yearly,
                    bullets: [...PLAN_DETAILS.starter.features],
                    isCurrent: currentPlan === "starter",
                    badge: currentPlan === "starter" ? "Current Plan" : undefined,
                },
                {
                    id: "professional",
                    name: PLAN_DETAILS.professional.name,
                    tagline: PLAN_DETAILS.professional.tagline,
                    priceMonth: pricing.professional.monthly,
                    priceYear: pricing.professional.yearly,
                    savePerYear: pricing.professional.monthly * 12 - pricing.professional.yearly,
                    bullets: [...PLAN_DETAILS.professional.features],
                    isCurrent: currentPlan === "professional",
                    badge: currentPlan === "professional" ? "Current Plan" : "Most Popular",
                },
                {
                    id: "enterprise",
                    name: PLAN_DETAILS.enterprise.name,
                    tagline: PLAN_DETAILS.enterprise.tagline,
                    priceMonth: pricing.enterprise.monthly,
                    priceYear: pricing.enterprise.yearly,
                    savePerYear: pricing.enterprise.monthly * 12 - pricing.enterprise.yearly,
                    bullets: [...PLAN_DETAILS.enterprise.features],
                    isCurrent: currentPlan === "enterprise",
                    badge: currentPlan === "enterprise" ? "Current Plan" : undefined,
                },
            ];
        };

        if (!customerId) {
            const mockWithLivePrices = generateMockBillingData(pricing, priceSyncStatus);
            return {
                ...mockWithLivePrices,
                plans: toPlans("professional"),
            };
        }

        // Fetch customer's subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "all",
            limit: 1,
        });

        const subscription = subscriptions.data[0];
        if (!subscription) {
            return {
                status: "Inactive",
                currentPlanLabel: "not_subscribed",
                currentPlanPriceYear: 0,
                nextBilling: "Not scheduled",
                autoRenewEnabled: false,
                teamMembers: 0,
                teamMembersAllowed: 0,
                billingCycle: "Annual",
                stripeCustomerId: customerId,
                plans: toPlans(undefined),
                paymentMethods: [],
                billingHistory: [],
                priceSyncStatus,
            };
        }

        // Fetch payment methods
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });

        // Fetch invoices
        const invoices = await stripe.invoices.list({
            customer: customerId,
            limit: 10,
        });

        const priceId = subscription.items.data[0]?.price.id;
        const currentPlan: PlanId = resolvePlanFromPrice(priceId) ?? "professional";
        let billingCycle: BillingCycle = "Annual";

        // Map price ID to plan (you'll need to set these)
        const interval = subscription.items.data[0]?.price.recurring?.interval;
        billingCycle = interval === "year" ? "Annual" : "Monthly";

        return {
            status: subscription.status === "active" ? "Active" : "Inactive",
            currentPlanLabel: currentPlan,
            currentPlanPriceYear: pricing[currentPlan].yearly,
            nextBilling: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            autoRenewEnabled: !subscription.cancel_at_period_end,
            teamMembers: 5, // TODO: Get from your database
            teamMembersAllowed: currentPlan === "starter" ? 5 : currentPlan === "professional" ? 25 : 999,
            billingCycle,
            stripeCustomerId: customerId,
            plans: toPlans(currentPlan),
            paymentMethods: paymentMethods.data.map((pm) => ({
                id: pm.id,
                label: `${pm.card?.brand?.charAt(0).toUpperCase()}${pm.card?.brand?.slice(1)} ending in ${pm.card?.last4}`,
                expires: `${pm.card?.exp_month}/${pm.card?.exp_year}`,
                isDefault: pm.id === subscription.default_payment_method,
            })),
            billingHistory: invoices.data.map((inv) => ({
                date: new Date(inv.created * 1000).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                description: inv.lines.data[0]?.description || "Subscription",
                amount: `$${((inv.amount_paid ?? 0) / 100).toFixed(2)}`,
                status: inv.status === "paid" ? "Paid" : "Unpaid",
                invoiceUrl: inv.invoice_pdf || inv.hosted_invoice_url || undefined,
            })),
            priceSyncStatus,
        };
    } catch (error) {
        console.error("Error fetching Stripe data:", error);
        return null;
    }
}

// ── Enrich billing payload with real license data ───────────────────
function enrichFromLicense(
    payload: SubscriptionBillingPayload,
    license: LicenseRecord,
    hasRealStripeData: boolean
): SubscriptionBillingPayload {
    const result = { ...payload };

    // Use license expiry for next billing date
    if (license.expires_at) {
        result.nextBilling = new Date(license.expires_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    // Auto-renew reflects whether the license is active
    result.autoRenewEnabled = license.status === "active";

    // Attach Stripe customer ID from license if not already present
    if (license.stripe_customer_id && !result.stripeCustomerId) {
        result.stripeCustomerId = license.stripe_customer_id;
    }

    // When there's no real Stripe subscription, clear mock payment methods & invoices
    if (!hasRealStripeData) {
        result.paymentMethods = [];
        result.billingHistory = [];
    }

    return result;
}

// ── Resolve the user's active license from session ──────────────────
async function resolveSessionLicense(session: SessionPayload | null): Promise<LicenseRecord | null> {
    if (!session?.email) return null;

    try {
        // 1. Try by email
        const { license } = await getLicenseByEmail(session.email);
        if (license) return license;

        // 2. Fallback: try by licenseCode in JWT
        if (session.licenseCode) {
            const { license: codeLicense } = await getLicenseByKey(session.licenseCode);
            if (codeLicense) return codeLicense;
        }
    } catch {
        // License lookup is non-critical for billing
    }

    return null;
}

export async function GET(request: NextRequest) {
    const mode = getDataMode();
    const { searchParams } = new URL(request.url);
    const queryCustomerId = searchParams.get("customerId");
    const session = getSession(request);
    const forceEnterprisePlan = isSuperAdminSession(request);

    // Resolve license from session → DB
    const sessionLicense = await resolveSessionLicense(session);

    // Resolve Stripe customer ID: query param > license DB > none
    const stripeCustomerId =
        queryCustomerId ||
        sessionLicense?.stripe_customer_id ||
        undefined;

    const hasRealStripeData = !!stripeCustomerId;

    try {
        // In live mode, try to fetch from Stripe first
        if (mode === "live" || mode === "hybrid") {
            const stripeData = await fetchStripeBillingData(stripeCustomerId);
            if (stripeData) {
                const pricing = defaultPlanPricing();
                let resolvedPayload = forceEnterprisePlan ? forceEnterprise(stripeData, pricing) : stripeData;

                // Enrich with real license data (dates, customer ID)
                if (sessionLicense) {
                    resolvedPayload = enrichFromLicense(resolvedPayload, sessionLicense, hasRealStripeData);
                }

                return NextResponse.json(resolvedPayload, {
                    headers: {
                        "Cache-Control": "private, no-cache",
                    },
                });
            }
            // If Stripe not configured in live mode, return error
            if (mode === "live" && !process.env.STRIPE_SECRET_KEY) {
                return NextResponse.json(
                    { error: "Billing provider not configured" },
                    { status: 503 }
                );
            }
        }

        // Mock/hybrid mode: return mock data (prefer live Stripe catalog prices if available)
        const { pricing, priceSyncStatus } = await fetchStripePlanPricing();
        const baseBillingData = generateMockBillingData(pricing, priceSyncStatus);
        let billingData = forceEnterprisePlan ? forceEnterprise(baseBillingData, pricing) : baseBillingData;

        // Enrich with real license data
        if (sessionLicense) {
            billingData = enrichFromLicense(billingData, sessionLicense, hasRealStripeData);
        }

        return NextResponse.json(billingData, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("Error fetching billing data:", error);
        return NextResponse.json(
            { error: "Failed to fetch billing data" },
            { status: 500 }
        );
    }
}

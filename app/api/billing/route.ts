import { NextRequest, NextResponse } from "next/server";
import { getDataMode } from "@/lib/dataService";
import { getStripe, PLAN_DETAILS } from "@/lib/stripe";

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

function generateMockBillingData(): SubscriptionBillingPayload {
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
                isCurrent: true,
                badge: "Current Plan",
            },
            {
                id: "enterprise",
                name: "Enterprise",
                tagline: "For large-scale operations",
                priceYear: 9990,
                savePerYear: 1998,
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
    };
}

// Stripe integration - when STRIPE_SECRET_KEY is set, fetch real data
async function fetchStripeBillingData(customerId?: string): Promise<SubscriptionBillingPayload | null> {
    const stripe = getStripe();
    if (!stripe || !customerId) return null;

    try {
        // Fetch customer's subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "all",
            limit: 1,
        });

        const subscription = subscriptions.data[0];
        if (!subscription) return null;

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

        // Determine current plan from price
        const priceId = subscription.items.data[0]?.price.id;
        type PlanType = "starter" | "professional" | "enterprise";
        const determinePlan = (): PlanType => {
            // TODO: Map priceId to actual plan
            // For now, default to professional
            void priceId; // suppress unused warning
            return "professional";
        };
        const currentPlan: PlanType = determinePlan();
        let billingCycle: BillingCycle = "Annual";

        // Map price ID to plan (you'll need to set these)
        const interval = subscription.items.data[0]?.price.recurring?.interval;
        billingCycle = interval === "year" ? "Annual" : "Monthly";

        return {
            status: subscription.status === "active" ? "Active" : "Inactive",
            currentPlanLabel: currentPlan,
            currentPlanPriceYear: PLAN_DETAILS[currentPlan].yearlyPrice,
            nextBilling: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            autoRenewEnabled: !subscription.cancel_at_period_end,
            teamMembers: 5, // TODO: Get from your database
            teamMembersAllowed: currentPlan === "starter" ? 5 : currentPlan === "professional" ? 25 : 999,
            billingCycle,
            plans: [
                {
                    id: "starter",
                    name: PLAN_DETAILS.starter.name,
                    tagline: PLAN_DETAILS.starter.tagline,
                    priceYear: PLAN_DETAILS.starter.yearlyPrice,
                    savePerYear: PLAN_DETAILS.starter.monthlyPrice * 12 - PLAN_DETAILS.starter.yearlyPrice,
                    bullets: [...PLAN_DETAILS.starter.features],
                    isCurrent: currentPlan === "starter",
                    badge: currentPlan === "starter" ? "Current Plan" : undefined,
                },
                {
                    id: "professional",
                    name: PLAN_DETAILS.professional.name,
                    tagline: PLAN_DETAILS.professional.tagline,
                    priceYear: PLAN_DETAILS.professional.yearlyPrice,
                    savePerYear: PLAN_DETAILS.professional.monthlyPrice * 12 - PLAN_DETAILS.professional.yearlyPrice,
                    bullets: [...PLAN_DETAILS.professional.features],
                    isCurrent: currentPlan === "professional",
                    badge: currentPlan === "professional" ? "Current Plan" : "Most Popular",
                },
                {
                    id: "enterprise",
                    name: PLAN_DETAILS.enterprise.name,
                    tagline: PLAN_DETAILS.enterprise.tagline,
                    priceYear: PLAN_DETAILS.enterprise.yearlyPrice,
                    savePerYear: PLAN_DETAILS.enterprise.monthlyPrice * 12 - PLAN_DETAILS.enterprise.yearlyPrice,
                    bullets: [...PLAN_DETAILS.enterprise.features],
                    isCurrent: currentPlan === "enterprise",
                    badge: currentPlan === "enterprise" ? "Current Plan" : undefined,
                },
            ],
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
            })),
        };
    } catch (error) {
        console.error("Error fetching Stripe data:", error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const mode = getDataMode();
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    try {
        // In live mode, try to fetch from Stripe first
        if (mode === "live" || mode === "hybrid") {
            const stripeData = await fetchStripeBillingData(customerId || undefined);
            if (stripeData) {
                return NextResponse.json(stripeData, {
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

        // Mock/hybrid mode: return mock data
        const billingData = generateMockBillingData();

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

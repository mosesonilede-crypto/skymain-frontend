import Stripe from "stripe";

// Initialize Stripe with secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export function getStripe(): Stripe | null {
    if (!stripeSecretKey) {
        return null;
    }
    return new Stripe(stripeSecretKey, {
        typescript: true,
    });
}

// Your Stripe Price IDs - set these in Vercel env vars
export const STRIPE_PRICES = {
    starter: {
        monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || "",
        yearly: process.env.STRIPE_PRICE_STARTER_YEARLY || "",
    },
    professional: {
        monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || "",
        yearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY || "",
    },
    enterprise: {
        monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "",
        yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || "",
    },
} as const;

export type PlanId = keyof typeof STRIPE_PRICES;
export type BillingInterval = "monthly" | "yearly";

export function getPriceId(plan: PlanId, interval: BillingInterval): string {
    return STRIPE_PRICES[plan][interval];
}

// Plan display info
export const PLAN_DETAILS = {
    starter: {
        name: "Starter",
        tagline: "Perfect for small operations",
        monthlyPrice: 199,
        yearlyPrice: 1990,
        features: [
            "Up to 5 aircraft",
            "Aircraft Fleet Management",
            "Work Orders & Job Cards",
            "Parts Inventory",
            "Maintenance Calendar",
            "Email support",
            "1 GB cloud storage",
            "Mobile app access",
        ],
    },
    professional: {
        name: "Professional",
        tagline: "For growing fleets",
        monthlyPrice: 499,
        yearlyPrice: 4990,
        features: [
            "Up to 25 aircraft",
            "Everything in Starter, plus:",
            "AI Insights & Reports",
            "Regulatory Compliance tools",
            "API & Ingestion Contracts",
            "Priority support",
            "50 GB cloud storage",
            "Multi-location support",
        ],
    },
    enterprise: {
        name: "Enterprise",
        tagline: "For large-scale operations",
        monthlyPrice: 999,
        yearlyPrice: 9990,
        features: [
            "Unlimited aircraft",
            "Everything in Professional, plus:",
            "Predictive Alerts",
            "24/7 dedicated support",
            "Custom integrations",
            "Unlimited cloud storage",
            "Full API access",
            "Multi-location support",
            "SLA guarantee",
        ],
    },
} as const;

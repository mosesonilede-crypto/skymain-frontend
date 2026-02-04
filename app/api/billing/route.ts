import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
    try {
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

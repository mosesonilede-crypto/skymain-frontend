/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

// Figma assets from node 6:6079
const imgIconCurrentPlan = "https://www.figma.com/api/mcp/asset/c7d88c3a-b8fb-4564-b441-80ec83e2d1b3";
const imgIconNextBilling = "https://www.figma.com/api/mcp/asset/c64c1de5-6e5a-4f93-83fa-c3e17e66468f";
const imgIconTeamMembers = "https://www.figma.com/api/mcp/asset/04e847d5-0aea-4182-a605-f76334a4232a";
const imgIconCheck = "https://www.figma.com/api/mcp/asset/2310af2b-9bca-4c8c-bb17-7eda83c10fb3";
const imgIconCheckActive = "https://www.figma.com/api/mcp/asset/997ae211-46bc-483b-8b6d-8b55759a1800";
const imgIconStarter = "https://www.figma.com/api/mcp/asset/997ae211-46bc-483b-8b6d-8b55759a1800";
const imgIconPro = "https://www.figma.com/api/mcp/asset/6cab696a-b234-4042-ac6b-bed01f68a846";
const imgIconEnterprise = "https://www.figma.com/api/mcp/asset/b338ed30-9126-4d7d-a602-593e7050f052";
const imgIconAddPayment = "https://www.figma.com/api/mcp/asset/0e0e5ad0-a5d5-4bf7-8dda-b6c905966b09";
const imgIconEdit = "https://www.figma.com/api/mcp/asset/89bad8ef-5d91-4c8d-a97e-272f567aadec";
const imgIconDownload = "https://www.figma.com/api/mcp/asset/3e80e150-ccab-4bf6-9b90-eb1378fe873d";
const imgIconHelp = "https://www.figma.com/api/mcp/asset/89d53aad-c55c-41b8-88fb-82ab4a1e818a";
const imgIconSecure = "https://www.figma.com/api/mcp/asset/e7bb68dd-35ee-4106-9f65-cd2c17e513ef";

type BillingCycle = "monthly" | "annual";

type Plan = {
    id: string;
    name: string;
    tagline: string;
    priceAnnual: number;
    priceMonthly: number;
    savings: number;
    features: string[];
    isCurrent: boolean;
    isPopular?: boolean;
};

type PaymentMethod = {
    id: string;
    type: "visa" | "mastercard" | "paypal";
    label: string;
    expires?: string;
    email?: string;
    isDefault: boolean;
};

type BillingHistoryItem = {
    date: string;
    description: string;
    amount: string;
    status: "Paid" | "Pending" | "Failed";
};

const PLANS: Plan[] = [
    {
        id: "starter",
        name: "Starter",
        tagline: "Perfect for small operations",
        priceAnnual: 1990,
        priceMonthly: 199,
        savings: 398,
        features: [
            "Up to 5 aircraft",
            "Basic maintenance tracking",
            "Email support",
            "Standard compliance reports",
            "1 GB cloud storage",
            "Mobile app access",
        ],
        isCurrent: false,
    },
    {
        id: "professional",
        name: "Professional",
        tagline: "For growing fleets",
        priceAnnual: 4990,
        priceMonthly: 499,
        savings: 998,
        features: [
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
        isPopular: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        tagline: "For large airlines",
        priceAnnual: 14990,
        priceMonthly: 1499,
        savings: 2998,
        features: [
            "Unlimited aircraft",
            "Advanced AI assistant",
            "24/7 dedicated support",
            "Custom integrations",
            "White-label options",
            "Unlimited storage",
            "Advanced analytics",
            "On-premise deployment option",
            "SLA guarantee",
            "Custom training",
        ],
        isCurrent: false,
    },
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: "pm_1", type: "visa", label: "Visa •••• 4242", expires: "12/25", isDefault: true },
    { id: "pm_2", type: "paypal", label: "billing@skywings.com", isDefault: false },
];

const MOCK_BILLING_HISTORY: BillingHistoryItem[] = [
    { date: "12/31/2024", description: "SkyMaintain Professional - Annual Subscription", amount: "$49.99", status: "Paid" },
    { date: "11/30/2024", description: "SkyMaintain Professional - Monthly Subscription", amount: "$4.99", status: "Paid" },
    { date: "10/31/2024", description: "SkyMaintain Professional - Monthly Subscription", amount: "$4.99", status: "Paid" },
];

export default function BillingTabContent() {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
    const [billingHistory] = useState<BillingHistoryItem[]>(MOCK_BILLING_HISTORY);

    // Current subscription data
    const currentPlan = PLANS.find((p) => p.isCurrent) || PLANS[1];
    const nextBillingDate = "Feb 1, 2026";
    const teamMembers = 5;
    const maxTeamMembers = 25;

    function handleSetDefault(id: string) {
        setPaymentMethods((prev) =>
            prev.map((pm) => ({ ...pm, isDefault: pm.id === id }))
        );
    }

    function handleAddPaymentMethod() {
        // In a real implementation, this would open a payment form modal
        alert("Add Payment Method functionality would open a form here.");
    }

    function handleDownloadInvoice(date: string) {
        // In a real implementation, this would trigger a download
        alert(`Downloading invoice for ${date}...`);
    }

    function handleUpgrade(planId: string) {
        if (planId === currentPlan.id) return;
        alert(`Upgrade to ${planId} plan initiated. This would process the upgrade.`);
    }

    function handleContactSupport() {
        window.location.href = "/contact?intent=support";
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Subscription & Billing Header Card */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "0.8px solid rgba(0,0,0,0.1)",
                    borderRadius: "14px",
                    padding: "24.8px",
                }}
            >
                {/* Header with Active Badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "48px" }}>
                    <div>
                        <h2 style={{ fontSize: "24px", lineHeight: "32px", fontWeight: "bold", color: "#0a0a0a", margin: 0 }}>
                            Subscription &amp; Billing
                        </h2>
                        <p style={{ fontSize: "16px", lineHeight: "24px", color: "#4a5565", margin: "8px 0 0 0" }}>
                            Manage your subscription, payment methods, and billing history
                        </p>
                    </div>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#dcfce7",
                            color: "#008236",
                            borderRadius: "8px",
                            padding: "4px 12px",
                            fontSize: "12px",
                            lineHeight: "16px",
                        }}
                    >
                        <img src={imgIconCheck} alt="" style={{ width: "12px", height: "12px" }} />
                        Active
                    </span>
                </div>

                {/* Summary Cards Grid */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
                    {/* Current Plan Card */}
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#eff6ff",
                            border: "0.8px solid #bedbff",
                            borderRadius: "10px",
                            padding: "16px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <img src={imgIconCurrentPlan} alt="" style={{ width: "20px", height: "20px" }} />
                            <span style={{ fontSize: "14px", lineHeight: "20px", color: "#1c398e" }}>Current Plan</span>
                        </div>
                        <p style={{ fontSize: "24px", lineHeight: "32px", fontWeight: "bold", color: "#1c398e", margin: "0 0 8px 0", textTransform: "capitalize" }}>
                            {currentPlan.name.toLowerCase()}
                        </p>
                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#1447e6", margin: 0 }}>
                            ${currentPlan.priceAnnual}/year
                        </p>
                    </div>

                    {/* Next Billing Card */}
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#faf5ff",
                            border: "0.8px solid #e9d4ff",
                            borderRadius: "10px",
                            padding: "16px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <img src={imgIconNextBilling} alt="" style={{ width: "20px", height: "20px" }} />
                            <span style={{ fontSize: "14px", lineHeight: "20px", color: "#59168b" }}>Next Billing</span>
                        </div>
                        <p style={{ fontSize: "24px", lineHeight: "32px", fontWeight: "bold", color: "#59168b", margin: "0 0 8px 0" }}>
                            {nextBillingDate}
                        </p>
                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#8200db", margin: 0 }}>
                            Auto-renew enabled
                        </p>
                    </div>

                    {/* Team Members Card */}
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#f0fdf4",
                            border: "0.8px solid #b9f8cf",
                            borderRadius: "10px",
                            padding: "16px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <img src={imgIconTeamMembers} alt="" style={{ width: "20px", height: "20px" }} />
                            <span style={{ fontSize: "14px", lineHeight: "20px", color: "#0d542b" }}>Team Members</span>
                        </div>
                        <p style={{ fontSize: "24px", lineHeight: "32px", fontWeight: "bold", color: "#0d542b", margin: "0 0 8px 0" }}>
                            {teamMembers}
                        </p>
                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#008236", margin: 0 }}>
                            of {maxTeamMembers} allowed
                        </p>
                    </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div
                    style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "10px",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <h3 style={{ fontSize: "18px", lineHeight: "27px", fontWeight: "bold", color: "#0a0a0a", margin: 0 }}>
                            Billing Cycle
                        </h3>
                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "4px 0 0 0" }}>
                            Save $998 per year with annual billing
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            type="button"
                            onClick={() => setBillingCycle("monthly")}
                            style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                border: billingCycle === "monthly" ? "none" : "0.8px solid rgba(0,0,0,0.1)",
                                backgroundColor: billingCycle === "monthly" ? "#030213" : "#ffffff",
                                color: billingCycle === "monthly" ? "#ffffff" : "#0a0a0a",
                                fontSize: "14px",
                                lineHeight: "20px",
                                cursor: "pointer",
                            }}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => setBillingCycle("annual")}
                            style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                border: billingCycle === "annual" ? "none" : "0.8px solid rgba(0,0,0,0.1)",
                                backgroundColor: billingCycle === "annual" ? "#030213" : "#ffffff",
                                color: billingCycle === "annual" ? "#ffffff" : "#0a0a0a",
                                fontSize: "14px",
                                lineHeight: "20px",
                                cursor: "pointer",
                            }}
                        >
                            Annual
                        </button>
                    </div>
                </div>
            </div>

            {/* Available Plans Section */}
            <div>
                <h3 style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "bold", color: "#0a0a0a", margin: "0 0 16px 0" }}>
                    Available Plans
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            style={{
                                backgroundColor: "#ffffff",
                                border: plan.isCurrent ? "1.6px solid #9810fa" : "0.8px solid rgba(0,0,0,0.1)",
                                borderRadius: "14px",
                                padding: "24px",
                                position: "relative",
                                boxShadow: plan.isCurrent ? "0px 10px 15px rgba(0,0,0,0.1)" : "none",
                            }}
                        >
                            {/* Badges */}
                            {(plan.isPopular || plan.isCurrent) && (
                                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "4px" }}>
                                    {plan.isPopular && (
                                        <span
                                            style={{
                                                backgroundColor: "#9810fa",
                                                color: "#ffffff",
                                                borderRadius: "8px",
                                                padding: "2px 8px",
                                                fontSize: "12px",
                                                lineHeight: "16px",
                                            }}
                                        >
                                            Most Popular
                                        </span>
                                    )}
                                    {plan.isCurrent && (
                                        <span
                                            style={{
                                                backgroundColor: "#155dfc",
                                                color: "#ffffff",
                                                borderRadius: "8px",
                                                padding: "2px 8px",
                                                fontSize: "12px",
                                                lineHeight: "16px",
                                            }}
                                        >
                                            Current Plan
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Plan Icon */}
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "16px",
                                }}
                            >
                                <img
                                    src={plan.id === "starter" ? imgIconStarter : plan.id === "professional" ? imgIconPro : imgIconEnterprise}
                                    alt=""
                                    style={{ width: "24px", height: "24px" }}
                                />
                            </div>

                            {/* Plan Name & Tagline */}
                            <h4 style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "bold", color: "#0a0a0a", margin: "0 0 8px 0" }}>
                                {plan.name}
                            </h4>
                            <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "0 0 16px 0" }}>
                                {plan.tagline}
                            </p>

                            {/* Price */}
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                                <span style={{ fontSize: "30px", lineHeight: "36px", fontWeight: "bold", color: "#0a0a0a" }}>
                                    ${billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly}
                                </span>
                                <span style={{ fontSize: "16px", lineHeight: "24px", color: "#4a5565" }}>
                                    /{billingCycle === "annual" ? "year" : "month"}
                                </span>
                            </div>
                            {billingCycle === "annual" && (
                                <p style={{ fontSize: "14px", lineHeight: "20px", color: "#00a63e", margin: "0 0 24px 0" }}>
                                    Save ${plan.savings}/year
                                </p>
                            )}

                            {/* Features */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                        <img src={imgIconCheckActive} alt="" style={{ width: "20px", height: "20px", marginTop: "2px" }} />
                                        <span style={{ fontSize: "14px", lineHeight: "20px", color: "#0a0a0a" }}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button */}
                            <button
                                type="button"
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={plan.isCurrent}
                                style={{
                                    width: "100%",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: plan.isCurrent ? "0.8px solid rgba(0,0,0,0.1)" : "none",
                                    backgroundColor: plan.isCurrent ? "#ffffff" : "#030213",
                                    color: plan.isCurrent ? "#0a0a0a" : "#ffffff",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    cursor: plan.isCurrent ? "not-allowed" : "pointer",
                                    opacity: plan.isCurrent ? 0.5 : 1,
                                }}
                            >
                                {plan.isCurrent ? "Current Plan" : "Upgrade"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Methods Card */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "0.8px solid rgba(0,0,0,0.1)",
                    borderRadius: "14px",
                    padding: "24.8px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
                    <div>
                        <h3 style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "bold", color: "#0a0a0a", margin: 0 }}>
                            Payment Methods
                        </h3>
                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "8px 0 0 0" }}>
                            Manage your payment methods and billing information
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddPaymentMethod}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#030213",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            fontSize: "14px",
                            lineHeight: "20px",
                            cursor: "pointer",
                        }}
                    >
                        <img src={imgIconAddPayment} alt="" style={{ width: "16px", height: "16px" }} />
                        Add Payment Method
                    </button>
                </div>

                {/* Payment Methods List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {paymentMethods.map((pm) => (
                        <div
                            key={pm.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "16px",
                                borderRadius: "10px",
                                border: pm.isDefault ? "0.8px solid #155dfc" : "0.8px solid #e5e7eb",
                                backgroundColor: pm.isDefault ? "#eff6ff" : "#ffffff",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "10px",
                                        border: "0.8px solid #e5e7eb",
                                        backgroundColor: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {pm.type === "visa" && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#1447e6" strokeWidth="1.5" />
                                            <path d="M3 10H21" stroke="#1447e6" strokeWidth="1.5" />
                                        </svg>
                                    )}
                                    {pm.type === "paypal" && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="9" stroke="#1447e6" strokeWidth="1.5" />
                                            <path d="M12 8V12M12 16H12.01" stroke="#1447e6" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "16px", lineHeight: "24px", color: "#0a0a0a" }}>{pm.label}</span>
                                        {pm.isDefault && (
                                            <span
                                                style={{
                                                    backgroundColor: "#dbeafe",
                                                    color: "#1447e6",
                                                    borderRadius: "8px",
                                                    padding: "2px 8px",
                                                    fontSize: "12px",
                                                    lineHeight: "16px",
                                                }}
                                            >
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    {pm.expires && (
                                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: 0 }}>
                                            Expires {pm.expires}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {!pm.isDefault && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetDefault(pm.id)}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "8px",
                                            border: "0.8px solid rgba(0,0,0,0.1)",
                                            backgroundColor: "#ffffff",
                                            color: "#0a0a0a",
                                            fontSize: "14px",
                                            lineHeight: "20px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Set Default
                                    </button>
                                )}
                                <button
                                    type="button"
                                    style={{
                                        padding: "8px",
                                        borderRadius: "8px",
                                        border: "none",
                                        backgroundColor: "transparent",
                                        cursor: "pointer",
                                    }}
                                >
                                    <img src={imgIconEdit} alt="Edit" style={{ width: "16px", height: "16px" }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Billing History Card */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "0.8px solid rgba(0,0,0,0.1)",
                    borderRadius: "14px",
                    padding: "24.8px",
                }}
            >
                <div style={{ marginBottom: "48px" }}>
                    <h3 style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "bold", color: "#0a0a0a", margin: 0 }}>
                        Billing History
                    </h3>
                    <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "8px 0 0 0" }}>
                        Download invoices and view past payments
                    </p>
                </div>

                {/* Table */}
                <div style={{ overflow: "hidden", borderRadius: "10px" }}>
                    {/* Header */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "100px 1fr 80px 100px 150px",
                            gap: "16px",
                            padding: "8px 0",
                            borderBottom: "0.8px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        <span style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565" }}>Date</span>
                        <span style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565" }}>Description</span>
                        <span style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565" }}>Amount</span>
                        <span style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565" }}>Status</span>
                        <span style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565" }}>Invoice</span>
                    </div>

                    {/* Rows */}
                    {billingHistory.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "100px 1fr 80px 100px 150px",
                                gap: "16px",
                                padding: "22px 0",
                                borderBottom: idx < billingHistory.length - 1 ? "0.8px solid rgba(0,0,0,0.1)" : "none",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ fontSize: "14px", lineHeight: "20px", color: "#0a0a0a" }}>{item.date}</span>
                            <span style={{ fontSize: "14px", lineHeight: "20px", color: "#0a0a0a" }}>{item.description}</span>
                            <span style={{ fontSize: "14px", lineHeight: "20px", color: "#0a0a0a" }}>{item.amount}</span>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    backgroundColor: item.status === "Paid" ? "#dcfce7" : item.status === "Pending" ? "#fef3c7" : "#fecaca",
                                    color: item.status === "Paid" ? "#008236" : item.status === "Pending" ? "#d97706" : "#dc2626",
                                    borderRadius: "8px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    lineHeight: "16px",
                                    width: "fit-content",
                                }}
                            >
                                {item.status === "Paid" && <img src={imgIconCheck} alt="" style={{ width: "12px", height: "12px" }} />}
                                {item.status}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleDownloadInvoice(item.date)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "6px 10px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "transparent",
                                    color: "#0a0a0a",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    cursor: "pointer",
                                }}
                            >
                                <img src={imgIconDownload} alt="" style={{ width: "16px", height: "16px" }} />
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help & Security Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Need Help Card */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "0.8px solid rgba(0,0,0,0.1)",
                        borderRadius: "14px",
                        padding: "24.8px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "10px",
                                backgroundColor: "#dbeafe",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img src={imgIconHelp} alt="" style={{ width: "24px", height: "24px" }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: "18px", lineHeight: "27px", fontWeight: "bold", color: "#0a0a0a", margin: 0 }}>
                                Need Help?
                            </h4>
                            <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: 0 }}>
                                Our support team is here
                            </p>
                        </div>
                    </div>
                    <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "0 0 40px 0" }}>
                        Have questions about billing or subscriptions? Contact our support team for assistance.
                    </p>
                    <button
                        type="button"
                        onClick={handleContactSupport}
                        style={{
                            width: "100%",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "0.8px solid rgba(0,0,0,0.1)",
                            backgroundColor: "#ffffff",
                            color: "#0a0a0a",
                            fontSize: "14px",
                            lineHeight: "20px",
                            cursor: "pointer",
                        }}
                    >
                        Contact Support
                    </button>
                </div>

                {/* Secure Payments Card */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "0.8px solid rgba(0,0,0,0.1)",
                        borderRadius: "14px",
                        padding: "24.8px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "10px",
                                backgroundColor: "#dcfce7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img src={imgIconSecure} alt="" style={{ width: "24px", height: "24px" }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: "18px", lineHeight: "27px", fontWeight: "bold", color: "#0a0a0a", margin: 0 }}>
                                Secure Payments
                            </h4>
                            <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: 0 }}>
                                Your data is protected
                            </p>
                        </div>
                    </div>
                    <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "0 0 40px 0" }}>
                        All transactions are encrypted and secure. We never store your full card details.
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <span
                            style={{
                                backgroundColor: "#f3f4f6",
                                color: "#364153",
                                borderRadius: "8px",
                                padding: "2px 8px",
                                fontSize: "12px",
                                lineHeight: "16px",
                            }}
                        >
                            PCI DSS
                        </span>
                        <span
                            style={{
                                backgroundColor: "#f3f4f6",
                                color: "#364153",
                                borderRadius: "8px",
                                padding: "2px 8px",
                                fontSize: "12px",
                                lineHeight: "16px",
                            }}
                        >
                            SSL Encrypted
                        </span>
                        <span
                            style={{
                                backgroundColor: "#f3f4f6",
                                color: "#364153",
                                borderRadius: "8px",
                                padding: "2px 8px",
                                fontSize: "12px",
                                lineHeight: "16px",
                            }}
                        >
                            256-bit
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

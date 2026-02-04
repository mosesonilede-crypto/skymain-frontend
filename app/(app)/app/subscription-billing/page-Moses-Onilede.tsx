/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_PRICING, CONTACT_DEMO } from "@/lib/routes";

// Figma assets from node 39:11241
const imgIconCheck = "https://www.figma.com/api/mcp/asset/4b16b27b-4fec-4046-b394-387fb4605baf";
const imgIconCheckBlue = "https://www.figma.com/api/mcp/asset/9d264107-a78c-4e04-a92d-2d93b7b3210f";
const imgIconArrowBlue = "https://www.figma.com/api/mcp/asset/a520de0c-7a61-4862-bb23-d535c4e53996";
const imgVector = "https://www.figma.com/api/mcp/asset/4b44707f-9e75-447c-a275-75115ebe5113";
const imgVectorLarge = "https://www.figma.com/api/mcp/asset/1b14a41b-514e-4144-86f6-1187d794c459";
const imgIconArrowWhite = "https://www.figma.com/api/mcp/asset/84309fab-e551-4fa6-a314-bafdcdfe919b";

type TierId = "starter" | "professional" | "enterprise";

type PricingTier = {
    id: TierId;
    name: string;
    tagline: string;
    bullets: string[];
    is_popular?: boolean;
};

type PaymentFormData = {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
    city: string;
    postalCode: string;
    country: string;
};

const TIERS: PricingTier[] = [
    {
        id: "starter",
        name: "Starter (Pilot Program)",
        tagline: "Ideal for evaluation and proof-of-concept use.",
        bullets: [
            "Limited user access",
            "Core analytics and dashboards",
            "Initial data ingestion support",
        ],
    },
    {
        id: "professional",
        name: "Professional",
        tagline: "Designed for active operational use.",
        bullets: [
            "Expanded user access",
            "Advanced analytics",
            "Compliance-aligned reporting",
            "Priority support",
        ],
        is_popular: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        tagline: "For large operators and complex environments.",
        bullets: [
            "Custom integrations",
            "Dedicated support",
            "SLA options",
            "Flexible deployment models",
        ],
    },
];

// Payment Form Modal Component
function PaymentFormModal({
    isOpen,
    onClose,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PaymentFormData) => void;
}) {
    const [formData, setFormData] = useState<PaymentFormData>({
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        cvv: "",
        billingAddress: "",
        city: "",
        postalCode: "",
        country: "United States",
    });
    const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    function formatCardNumber(value: string): string {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        const groups = digits.match(/.{1,4}/g);
        return groups ? groups.join(" ") : digits;
    }

    function formatExpiryDate(value: string): string {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 2) {
            return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }
        return digits;
    }

    function handleInputChange(field: keyof PaymentFormData, value: string) {
        let formattedValue = value;

        if (field === "cardNumber") {
            formattedValue = formatCardNumber(value);
        } else if (field === "expiryDate") {
            formattedValue = formatExpiryDate(value);
        } else if (field === "cvv") {
            formattedValue = value.replace(/\D/g, "").slice(0, 4);
        }

        setFormData((prev) => ({ ...prev, [field]: formattedValue }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }

    function validateForm(): boolean {
        const newErrors: Partial<PaymentFormData> = {};

        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 16) {
            newErrors.cardNumber = "Please enter a valid 16-digit card number";
        }

        if (!formData.cardholderName.trim()) {
            newErrors.cardholderName = "Cardholder name is required";
        }

        if (!formData.expiryDate || formData.expiryDate.length < 5) {
            newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
        }

        if (!formData.cvv || formData.cvv.length < 3) {
            newErrors.cvv = "Please enter a valid CVV";
        }

        if (!formData.billingAddress.trim()) {
            newErrors.billingAddress = "Billing address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.postalCode.trim()) {
            newErrors.postalCode = "Postal code is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsProcessing(false);
        onSubmit(formData);
    }

    if (!isOpen) return null;

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px 16px",
        border: "1.6px solid rgba(0,0,0,0.1)",
        borderRadius: 8,
        fontFamily: "Arial, sans-serif",
        fontSize: 14,
        lineHeight: "20px",
        color: "#101828",
        boxSizing: "border-box",
        outline: "none",
        transition: "border-color 0.2s ease",
    };

    const labelStyle: React.CSSProperties = {
        fontFamily: "Arial, sans-serif",
        fontWeight: 600,
        fontSize: 14,
        lineHeight: "20px",
        color: "#364153",
        marginBottom: 8,
        display: "block",
    };

    const errorStyle: React.CSSProperties = {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        lineHeight: "16px",
        color: "#dc2626",
        marginTop: 4,
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 16,
                    boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                    width: "100%",
                    maxWidth: 520,
                    maxHeight: "90vh",
                    overflow: "auto",
                    margin: 16,
                }}
            >
                {/* Modal Header */}
                <div
                    style={{
                        padding: "24px 24px 0 24px",
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                        paddingBottom: 16,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 24,
                                lineHeight: "32px",
                                color: "#101828",
                                margin: 0,
                            }}
                        >
                            Add Payment Method
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                width: 32,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "transparent",
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontSize: 20,
                                color: "#6b7280",
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: "20px",
                            color: "#4a5565",
                            marginTop: 8,
                            marginBottom: 0,
                        }}
                    >
                        Enter your payment details to add a new payment method.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: 24 }}>
                    {/* Card Number */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Card Number</label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                            style={{
                                ...inputStyle,
                                borderColor: errors.cardNumber ? "#dc2626" : "rgba(0,0,0,0.1)",
                            }}
                        />
                        {errors.cardNumber && <p style={errorStyle}>{errors.cardNumber}</p>}
                    </div>

                    {/* Cardholder Name */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Cardholder Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.cardholderName}
                            onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                            style={{
                                ...inputStyle,
                                borderColor: errors.cardholderName ? "#dc2626" : "rgba(0,0,0,0.1)",
                            }}
                        />
                        {errors.cardholderName && <p style={errorStyle}>{errors.cardholderName}</p>}
                    </div>

                    {/* Expiry and CVV Row */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Expiry Date</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.expiryDate ? "#dc2626" : "rgba(0,0,0,0.1)",
                                }}
                            />
                            {errors.expiryDate && <p style={errorStyle}>{errors.expiryDate}</p>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>CVV</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange("cvv", e.target.value)}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.cvv ? "#dc2626" : "rgba(0,0,0,0.1)",
                                }}
                            />
                            {errors.cvv && <p style={errorStyle}>{errors.cvv}</p>}
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Billing Address</label>
                        <input
                            type="text"
                            placeholder="123 Main Street, Suite 100"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                            style={{
                                ...inputStyle,
                                borderColor: errors.billingAddress ? "#dc2626" : "rgba(0,0,0,0.1)",
                            }}
                        />
                        {errors.billingAddress && <p style={errorStyle}>{errors.billingAddress}</p>}
                    </div>

                    {/* City and Postal Code Row */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>City</label>
                            <input
                                type="text"
                                placeholder="New York"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.city ? "#dc2626" : "rgba(0,0,0,0.1)",
                                }}
                            />
                            {errors.city && <p style={errorStyle}>{errors.city}</p>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Postal Code</label>
                            <input
                                type="text"
                                placeholder="10001"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.postalCode ? "#dc2626" : "rgba(0,0,0,0.1)",
                                }}
                            />
                            {errors.postalCode && <p style={errorStyle}>{errors.postalCode}</p>}
                        </div>
                    </div>

                    {/* Country */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Country</label>
                        <select
                            value={formData.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                            style={{
                                ...inputStyle,
                                cursor: "pointer",
                            }}
                        >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Australia">Australia</option>
                            <option value="Japan">Japan</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Security Note */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 16px",
                            backgroundColor: "#eff6ff",
                            borderRadius: 8,
                            marginBottom: 24,
                        }}
                    >
                        <span style={{ fontSize: 16 }}>🔒</span>
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontSize: 12,
                                lineHeight: "16px",
                                color: "#364153",
                                margin: 0,
                            }}
                        >
                            Your payment information is encrypted and secure. We never store your full card details.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: "12px 24px",
                                backgroundColor: "transparent",
                                border: "1.6px solid rgba(0,0,0,0.1)",
                                borderRadius: 8,
                                fontFamily: "Arial, sans-serif",
                                fontSize: 14,
                                fontWeight: 600,
                                lineHeight: "20px",
                                color: "#364153",
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            style={{
                                flex: 1,
                                padding: "12px 24px",
                                backgroundColor: isProcessing ? "#93c5fd" : "#155dfc",
                                border: "none",
                                borderRadius: 8,
                                fontFamily: "Arial, sans-serif",
                                fontSize: 14,
                                fontWeight: 600,
                                lineHeight: "20px",
                                color: "#ffffff",
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                transition: "opacity 0.2s ease",
                            }}
                        >
                            {isProcessing ? "Processing..." : "Add Payment Method"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function TierCard({ tier }: { tier: PricingTier }) {
    const router = useRouter();
    const isPopular = Boolean(tier.is_popular);
    const isStarter = tier.id === "starter";

    function handleContactPricing() {
        router.push(CONTACT_PRICING);
    }

    return (
        <div
            style={{
                position: "relative",
                backgroundColor: "#ffffff",
                border: isPopular ? "4px solid #155dfc" : "1.6px solid rgba(0,0,0,0.1)",
                borderRadius: 14,
                boxShadow: isPopular ? "0px 25px 50px rgba(0,0,0,0.25)" : "none",
                width: 345,
                height: 455,
                padding: 32,
                boxSizing: "border-box",
            }}
        >
            {/* Most Popular Badge */}
            {isPopular && (
                <div
                    style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#155dfc",
                        borderRadius: 8,
                        padding: "4.8px 16.8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontSize: 12,
                            lineHeight: "16px",
                            color: "#ffffff",
                        }}
                    >
                        Most Popular
                    </span>
                </div>
            )}

            {/* Title */}
            <h2
                style={{
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 24,
                    lineHeight: "32px",
                    color: "#101828",
                    margin: 0,
                }}
            >
                {tier.name}
            </h2>

            {/* Tagline */}
            <p
                style={{
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#4a5565",
                    marginTop: 68,
                    marginBottom: 0,
                    width: isPopular ? 273 : 278,
                }}
            >
                {tier.tagline}
            </p>

            {/* Features List */}
            <ul
                style={{
                    listStyle: "none",
                    margin: 0,
                    marginTop: isPopular ? 72 : 96,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                }}
            >
                {tier.bullets.map((bullet, index) => (
                    <li
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            height: 24,
                        }}
                    >
                        <img
                            src={isPopular ? imgIconCheckBlue : imgIconCheck}
                            alt=""
                            style={{
                                width: 20,
                                height: 20,
                                marginTop: 2,
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 16,
                                lineHeight: "24px",
                                color: "#364153",
                            }}
                        >
                            {bullet}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                type="button"
                onClick={handleContactPricing}
                style={{
                    position: "absolute",
                    bottom: isPopular ? 60 : isStarter ? 72 : 36,
                    left: 32,
                    width: isPopular ? 273 : 278,
                    height: 36,
                    backgroundColor: isPopular ? "#155dfc" : "#101828",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
                <span
                    style={{
                        fontFamily: "Arial, sans-serif",
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "#ffffff",
                        textAlign: "center",
                    }}
                >
                    Contact us for pricing
                </span>
            </button>
        </div>
    );
}

export default function SubscriptionBillingPage() {
    const router = useRouter();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([
        { id: "pm_1", label: "Visa •••• 4242", expires: "12/25", isDefault: true },
    ]);
    const [successMessage, setSuccessMessage] = useState("");

    function handleBackToHome() {
        router.push("/");
    }

    function handleGetStarted() {
        router.push("/get-started");
    }

    function handleRequestPricing() {
        router.push(CONTACT_PRICING);
    }

    function handleScheduleDemo() {
        router.push(CONTACT_DEMO);
    }

    function handleAddPaymentMethod() {
        setIsPaymentModalOpen(true);
    }

    function handlePaymentSubmit(data: PaymentFormData) {
        // Add the new payment method
        const last4 = data.cardNumber.replace(/\s/g, "").slice(-4);
        const newMethod = {
            id: `pm_${Date.now()}`,
            label: `Card •••• ${last4}`,
            expires: data.expiryDate,
            isDefault: paymentMethods.length === 0,
        };

        setPaymentMethods((prev) => [...prev, newMethod]);
        setIsPaymentModalOpen(false);
        setSuccessMessage("Payment method added successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
    }

    function handleSetDefault(id: string) {
        setPaymentMethods((prev) =>
            prev.map((pm) => ({
                ...pm,
                isDefault: pm.id === id,
            }))
        );
    }

    function handleRemovePaymentMethod(id: string) {
        setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    }

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#ffffff",
            }}
        >
            {/* Payment Form Modal */}
            <PaymentFormModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSubmit={handlePaymentSubmit}
            />

            {/* Success Message Toast */}
            {successMessage && (
                <div
                    style={{
                        position: "fixed",
                        top: 100,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 100,
                        backgroundColor: "#10b981",
                        color: "#ffffff",
                        padding: "12px 24px",
                        borderRadius: 8,
                        boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
                        fontFamily: "Arial, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                    }}
                >
                    ✓ {successMessage}
                </div>
            )}

            {/* Main Content Container */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 1148,
                    margin: "0 auto",
                    backgroundColor: "#ffffff",
                }}
            >
                {/* Hero Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 486.6,
                        paddingTop: 128,
                        paddingLeft: 126,
                        paddingRight: 126,
                        boxSizing: "border-box",
                        background: "linear-gradient(157deg, #eff6ff 0%, #faf5ff 100%)",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: 896,
                            margin: "0 auto",
                            textAlign: "center",
                        }}
                    >
                        {/* Pricing Badge */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#155dfc",
                                borderRadius: 8,
                                padding: "8.8px 16px",
                                height: 41.6,
                                boxSizing: "border-box",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 14,
                                    lineHeight: "20px",
                                    color: "#ffffff",
                                    textAlign: "center",
                                }}
                            >
                                Pricing
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 48,
                                lineHeight: "48px",
                                color: "#101828",
                                textAlign: "center",
                                marginTop: 65.6,
                                marginBottom: 0,
                                maxWidth: 664,
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            Pricing Designed for Aviation Operations
                        </h1>

                        {/* Subheadline */}
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 20,
                                lineHeight: "32.5px",
                                color: "#4a5565",
                                textAlign: "center",
                                marginTop: 24,
                                marginBottom: 0,
                                maxWidth: 765,
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            Flexible pricing models to support operators, MROs, and maintenance organizations of all sizes.
                        </p>

                        {/* Note */}
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 18,
                                lineHeight: "28px",
                                color: "#4a5565",
                                textAlign: "center",
                                marginTop: 16,
                                marginBottom: 0,
                            }}
                        >
                            SkyMaintain pricing is tailored based on operational scale, data scope, and integration requirements.
                        </p>
                    </div>
                </section>

                {/* Pricing Cards Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 735,
                        backgroundColor: "#ffffff",
                        paddingTop: 80,
                        paddingLeft: 24,
                        paddingRight: 24,
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 32,
                            flexWrap: "wrap",
                            maxWidth: 1100,
                            margin: "0 auto",
                        }}
                    >
                        {TIERS.map((tier) => (
                            <TierCard key={tier.id} tier={tier} />
                        ))}
                    </div>

                    {/* Footer Note */}
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 400,
                            fontSize: 18,
                            lineHeight: "28px",
                            color: "#4a5565",
                            textAlign: "center",
                            marginTop: 64,
                            maxWidth: 694,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        SkyMaintain pricing is customized to ensure alignment with operational complexity and regulatory requirements.
                    </p>
                </section>

                {/* Payment Methods Section */}
                <section
                    style={{
                        width: "100%",
                        backgroundColor: "#f9fafb",
                        paddingTop: 64,
                        paddingBottom: 64,
                        paddingLeft: 24,
                        paddingRight: 24,
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 800,
                            margin: "0 auto",
                        }}
                    >
                        {/* Section Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 24,
                                flexWrap: "wrap",
                                gap: 16,
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 700,
                                        fontSize: 24,
                                        lineHeight: "32px",
                                        color: "#101828",
                                        margin: 0,
                                    }}
                                >
                                    Payment Methods
                                </h2>
                                <p
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 14,
                                        lineHeight: "20px",
                                        color: "#4a5565",
                                        marginTop: 4,
                                        marginBottom: 0,
                                    }}
                                >
                                    Manage your payment methods and billing information
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddPaymentMethod}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    backgroundColor: "#155dfc",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "12px 20px",
                                    cursor: "pointer",
                                    transition: "opacity 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                <span
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        lineHeight: "20px",
                                        color: "#ffffff",
                                    }}
                                >
                                    + Add Payment Method
                                </span>
                            </button>
                        </div>

                        {/* Payment Methods List */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}
                        >
                            {paymentMethods.length === 0 ? (
                                <div
                                    style={{
                                        backgroundColor: "#ffffff",
                                        border: "1.6px solid rgba(0,0,0,0.1)",
                                        borderRadius: 12,
                                        padding: 32,
                                        textAlign: "center",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontFamily: "Arial, sans-serif",
                                            fontSize: 14,
                                            lineHeight: "20px",
                                            color: "#6b7280",
                                            margin: 0,
                                        }}
                                    >
                                        No payment methods added yet. Click &quot;Add Payment Method&quot; to get started.
                                    </p>
                                </div>
                            ) : (
                                paymentMethods.map((pm) => (
                                    <div
                                        key={pm.id}
                                        style={{
                                            backgroundColor: "#ffffff",
                                            border: pm.isDefault ? "2px solid #155dfc" : "1.6px solid rgba(0,0,0,0.1)",
                                            borderRadius: 12,
                                            padding: 20,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                            gap: 12,
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            {/* Card Icon */}
                                            <div
                                                style={{
                                                    width: 48,
                                                    height: 32,
                                                    backgroundColor: "#eff6ff",
                                                    borderRadius: 6,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontFamily: "Arial, sans-serif",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    color: "#155dfc",
                                                }}
                                            >
                                                💳
                                            </div>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <span
                                                        style={{
                                                            fontFamily: "Arial, sans-serif",
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                            lineHeight: "20px",
                                                            color: "#101828",
                                                        }}
                                                    >
                                                        {pm.label}
                                                    </span>
                                                    {pm.isDefault && (
                                                        <span
                                                            style={{
                                                                backgroundColor: "#dbeafe",
                                                                color: "#1e40af",
                                                                fontSize: 11,
                                                                fontWeight: 600,
                                                                padding: "2px 8px",
                                                                borderRadius: 4,
                                                            }}
                                                        >
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p
                                                    style={{
                                                        fontFamily: "Arial, sans-serif",
                                                        fontSize: 12,
                                                        lineHeight: "16px",
                                                        color: "#6b7280",
                                                        marginTop: 2,
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    Expires {pm.expires}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            {!pm.isDefault && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetDefault(pm.id)}
                                                    style={{
                                                        backgroundColor: "transparent",
                                                        border: "1px solid rgba(0,0,0,0.1)",
                                                        borderRadius: 6,
                                                        padding: "6px 12px",
                                                        fontFamily: "Arial, sans-serif",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        color: "#364153",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Set Default
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePaymentMethod(pm.id)}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "1px solid #fecaca",
                                                    borderRadius: 6,
                                                    padding: "6px 12px",
                                                    fontFamily: "Arial, sans-serif",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: "#dc2626",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Security Badge */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 16,
                                marginTop: 24,
                                flexWrap: "wrap",
                            }}
                        >
                            {["PCI DSS", "SSL Encrypted", "256-bit Security"].map((badge) => (
                                <span
                                    key={badge}
                                    style={{
                                        backgroundColor: "#ffffff",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                        borderRadius: 20,
                                        padding: "6px 14px",
                                        fontFamily: "Arial, sans-serif",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#6b7280",
                                    }}
                                >
                                    🔒 {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    style={{
                        width: "100%",
                        minHeight: 304,
                        paddingTop: 96,
                        paddingLeft: 126,
                        paddingRight: 126,
                        boxSizing: "border-box",
                        background: "linear-gradient(165deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            maxWidth: 848,
                            margin: "0 auto",
                            padding: "0 24px",
                        }}
                    >
                        {/* CTA Headline */}
                        <h2
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: 36,
                                lineHeight: "40px",
                                color: "#ffffff",
                                textAlign: "center",
                                margin: 0,
                            }}
                        >
                            Ready to get started?
                        </h2>

                        {/* CTA Buttons */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 16,
                                marginTop: 24,
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Request Pricing Button */}
                            <button
                                type="button"
                                onClick={handleRequestPricing}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    backgroundColor: "#ffffff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "10px 24px",
                                    height: 48,
                                    minWidth: 194,
                                    boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                    cursor: "pointer",
                                    transition: "opacity 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.95")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                <span
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 18,
                                        lineHeight: "28px",
                                        color: "#155dfc",
                                        textAlign: "center",
                                    }}
                                >
                                    Request Pricing
                                </span>
                                <img
                                    src={imgIconArrowBlue}
                                    alt=""
                                    style={{ width: 20, height: 20 }}
                                />
                            </button>

                            {/* Schedule a Demo Button */}
                            <button
                                type="button"
                                onClick={handleScheduleDemo}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#ffffff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "12px 40px",
                                    height: 48,
                                    minWidth: 222,
                                    boxShadow: "0px 25px 50px rgba(0,0,0,0.25)",
                                    cursor: "pointer",
                                    transition: "opacity 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.95")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                <span
                                    style={{
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 400,
                                        fontSize: 18,
                                        lineHeight: "28px",
                                        color: "#155dfc",
                                        textAlign: "center",
                                    }}
                                >
                                    Schedule a Demo
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer
                    style={{
                        width: "100%",
                        height: 128,
                        backgroundColor: "#101828",
                        paddingTop: 0,
                        paddingLeft: 24,
                        paddingRight: 24,
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 1100,
                            margin: "0 auto",
                            textAlign: "center",
                        }}
                    >
                        {/* Logo Row */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                height: 36,
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    backgroundColor: "#155dfc",
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 8,
                                    boxSizing: "border-box",
                                }}
                            >
                                <img
                                    src={imgVector}
                                    alt="SkyMaintain"
                                    style={{ width: 20, height: 20 }}
                                />
                            </div>
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                    color: "#ffffff",
                                    textAlign: "center",
                                }}
                            >
                                SkyMaintain
                            </span>
                        </div>

                        {/* Tagline */}
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#99a1af",
                                textAlign: "center",
                                marginTop: 16,
                                marginBottom: 0,
                            }}
                        >
                            AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                        </p>

                        {/* Copyright */}
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#d1d5dc",
                                textAlign: "center",
                                marginTop: 8,
                                marginBottom: 0,
                            }}
                        >
                            © 2026{" "}
                            <span style={{ color: "#51a2ff" }}>SkyMaintain</span>
                            . All Rights Reserved.
                        </p>

                        {/* EncycloAMTs */}
                        <p
                            style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#6a7282",
                                textAlign: "center",
                                marginTop: 8,
                                marginBottom: 0,
                            }}
                        >
                            SkyMaintain is a product of EncycloAMTs LLC.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Fixed Header */}
            <header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderBottom: "0.8px solid #e5e7eb",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)",
                    height: 80.8,
                    paddingTop: 16,
                    paddingBottom: 0.8,
                    paddingLeft: 24,
                    paddingRight: 24,
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        maxWidth: 1148,
                        margin: "0 auto",
                        height: 48,
                    }}
                >
                    {/* Logo */}
                    <button
                        type="button"
                        onClick={handleBackToHome}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 10,
                                boxSizing: "border-box",
                            }}
                        >
                            <img
                                src={imgVectorLarge}
                                alt="SkyMaintain"
                                style={{ width: 28, height: 28 }}
                            />
                        </div>
                        <div>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 24,
                                    lineHeight: "32px",
                                    color: "#101828",
                                    textAlign: "center",
                                    margin: 0,
                                }}
                            >
                                SkyMaintain
                            </p>
                            <p
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 12,
                                    lineHeight: "16px",
                                    color: "#4a5565",
                                    textAlign: "center",
                                    margin: 0,
                                }}
                            >
                                Regulatory-Compliant AI Platform
                            </p>
                        </div>
                    </button>

                    {/* Right Buttons */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        {/* Back to Home */}
                        <button
                            type="button"
                            onClick={handleBackToHome}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "transparent",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 16px",
                                height: 36,
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 14,
                                    lineHeight: "20px",
                                    color: "#364153",
                                    textAlign: "center",
                                }}
                            >
                                Back to Home
                            </span>
                        </button>

                        {/* Get Started */}
                        <button
                            type="button"
                            onClick={handleGetStarted}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                                backgroundColor: "#155dfc",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 16px",
                                height: 36,
                                cursor: "pointer",
                                transition: "opacity 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                            <span
                                style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 14,
                                    lineHeight: "20px",
                                    color: "#ffffff",
                                    textAlign: "center",
                                }}
                            >
                                Get Started
                            </span>
                            <img
                                src={imgIconArrowWhite}
                                alt=""
                                style={{ width: 16, height: 16 }}
                            />
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}

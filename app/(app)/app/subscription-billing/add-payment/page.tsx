"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PaymentType = "card" | "bank" | "wire";

export default function AddPaymentMethodPage() {
    const router = useRouter();
    const [paymentType, setPaymentType] = useState<PaymentType>("card");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Card fields
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [billingAddress, setBillingAddress] = useState("");
    const [billingCity, setBillingCity] = useState("");
    const [billingState, setBillingState] = useState("");
    const [billingZip, setBillingZip] = useState("");
    const [billingCountry, setBillingCountry] = useState("United States");

    // Bank fields
    const [bankName, setBankName] = useState("");
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [routingNumber, setRoutingNumber] = useState("");
    const [accountType, setAccountType] = useState<"checking" | "savings">("checking");

    // Wire fields
    const [wireBank, setWireBank] = useState("");
    const [wireAccountName, setWireAccountName] = useState("");
    const [wireAccountNumber, setWireAccountNumber] = useState("");
    const [swiftCode, setSwiftCode] = useState("");
    const [wireBankAddress, setWireBankAddress] = useState("");

    const [setAsDefault, setSetAsDefault] = useState(true);

    function formatCardNumber(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCardNumber(formatCardNumber(e.target.value));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSuccess(true);

        // Redirect back to billing page after success
        setTimeout(() => {
            router.push("/app/subscription-billing");
        }, 2000);
    }

    if (success) {
        return (
            <div className="px-4 pb-10 pt-6">
                <div className="mx-auto max-w-lg text-center">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-emerald-900">Payment Method Added</h2>
                        <p className="mt-2 text-sm text-emerald-700">
                            Your payment method has been securely saved. Redirecting to billing...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 pb-10 pt-6">
            <div className="mb-6">
                <Link
                    href="/app/subscription-billing"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Billing
                </Link>
            </div>

            <div className="mb-6">
                <h1 className="text-lg font-semibold text-slate-900">Add Payment Method</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Add a new payment method for your organization&apos;s subscription billing.
                </p>
            </div>

            {/* Payment Type Selector */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900 mb-4">Select Payment Type</div>
                <div className="grid gap-3 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={() => setPaymentType("card")}
                        className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${paymentType === "card"
                                ? "border-violet-300 bg-violet-50 shadow-[0_0_0_2px_rgba(167,139,250,0.35)]"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                    >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${paymentType === "card" ? "bg-violet-100" : "bg-slate-100"}`}>
                            <svg className={`h-5 w-5 ${paymentType === "card" ? "text-violet-600" : "text-slate-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className={`text-sm font-semibold ${paymentType === "card" ? "text-violet-900" : "text-slate-900"}`}>Credit/Debit Card</div>
                            <div className="text-xs text-slate-500">Visa, Mastercard, Amex</div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setPaymentType("bank")}
                        className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${paymentType === "bank"
                                ? "border-violet-300 bg-violet-50 shadow-[0_0_0_2px_rgba(167,139,250,0.35)]"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                    >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${paymentType === "bank" ? "bg-violet-100" : "bg-slate-100"}`}>
                            <svg className={`h-5 w-5 ${paymentType === "bank" ? "text-violet-600" : "text-slate-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className={`text-sm font-semibold ${paymentType === "bank" ? "text-violet-900" : "text-slate-900"}`}>Bank Account (ACH)</div>
                            <div className="text-xs text-slate-500">Direct debit from bank</div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setPaymentType("wire")}
                        className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${paymentType === "wire"
                                ? "border-violet-300 bg-violet-50 shadow-[0_0_0_2px_rgba(167,139,250,0.35)]"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                    >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${paymentType === "wire" ? "bg-violet-100" : "bg-slate-100"}`}>
                            <svg className={`h-5 w-5 ${paymentType === "wire" ? "text-violet-600" : "text-slate-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className={`text-sm font-semibold ${paymentType === "wire" ? "text-violet-900" : "text-slate-900"}`}>Wire Transfer</div>
                            <div className="text-xs text-slate-500">International payments</div>
                        </div>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Credit/Debit Card Form */}
                {paymentType === "card" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900 mb-4">Card Details</div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="cardName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    id="cardName"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="John Smith"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="expiryMonth" className="block text-sm font-medium text-slate-700 mb-1">
                                        Expiry Month
                                    </label>
                                    <select
                                        id="expiryMonth"
                                        value={expiryMonth}
                                        onChange={(e) => setExpiryMonth(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                        required
                                    >
                                        <option value="">Month</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                            <option key={m} value={String(m).padStart(2, "0")}>
                                                {String(m).padStart(2, "0")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="expiryYear" className="block text-sm font-medium text-slate-700 mb-1">
                                        Expiry Year
                                    </label>
                                    <select
                                        id="expiryYear"
                                        value={expiryYear}
                                        onChange={(e) => setExpiryYear(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                        required
                                    >
                                        <option value="">Year</option>
                                        {Array.from({ length: 10 }, (_, i) => 2026 + i).map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 mb-1">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        placeholder="123"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4 mt-4">
                                <div className="text-sm font-semibold text-slate-900 mb-4">Billing Address</div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="billingAddress" className="block text-sm font-medium text-slate-700 mb-1">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            id="billingAddress"
                                            value={billingAddress}
                                            onChange={(e) => setBillingAddress(e.target.value)}
                                            placeholder="123 Main Street"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="billingCity" className="block text-sm font-medium text-slate-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                id="billingCity"
                                                value={billingCity}
                                                onChange={(e) => setBillingCity(e.target.value)}
                                                placeholder="New York"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="billingState" className="block text-sm font-medium text-slate-700 mb-1">
                                                State/Province
                                            </label>
                                            <input
                                                type="text"
                                                id="billingState"
                                                value={billingState}
                                                onChange={(e) => setBillingState(e.target.value)}
                                                placeholder="NY"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="billingZip" className="block text-sm font-medium text-slate-700 mb-1">
                                                ZIP/Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                id="billingZip"
                                                value={billingZip}
                                                onChange={(e) => setBillingZip(e.target.value)}
                                                placeholder="10001"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="billingCountry" className="block text-sm font-medium text-slate-700 mb-1">
                                                Country
                                            </label>
                                            <select
                                                id="billingCountry"
                                                value={billingCountry}
                                                onChange={(e) => setBillingCountry(e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                                required
                                            >
                                                <option value="United States">United States</option>
                                                <option value="Canada">Canada</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Germany">Germany</option>
                                                <option value="France">France</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bank Account (ACH) Form */}
                {paymentType === "bank" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900 mb-4">Bank Account Details</div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="bankName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    id="bankName"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="Chase Bank"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="accountName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Account Holder Name
                                </label>
                                <input
                                    type="text"
                                    id="accountName"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder="SkyWings Aviation LLC"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="routingNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                        Routing Number
                                    </label>
                                    <input
                                        type="text"
                                        id="routingNumber"
                                        value={routingNumber}
                                        onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                                        placeholder="021000021"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                        placeholder="123456789012"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Account Type
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="accountType"
                                            value="checking"
                                            checked={accountType === "checking"}
                                            onChange={() => setAccountType("checking")}
                                            className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-slate-700">Checking</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="accountType"
                                            value="savings"
                                            checked={accountType === "savings"}
                                            onChange={() => setAccountType("savings")}
                                            className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-slate-700">Savings</span>
                                    </label>
                                </div>
                            </div>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <div className="flex gap-3">
                                    <svg className="h-5 w-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-amber-800">
                                        <strong>ACH Authorization:</strong> By providing your bank account information, you authorize SkyMaintain to debit your account for subscription payments.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wire Transfer Form */}
                {paymentType === "wire" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900 mb-4">Wire Transfer Details</div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="wireBank" className="block text-sm font-medium text-slate-700 mb-1">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    id="wireBank"
                                    value={wireBank}
                                    onChange={(e) => setWireBank(e.target.value)}
                                    placeholder="Deutsche Bank"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="wireAccountName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Account Holder Name
                                </label>
                                <input
                                    type="text"
                                    id="wireAccountName"
                                    value={wireAccountName}
                                    onChange={(e) => setWireAccountName(e.target.value)}
                                    placeholder="SkyWings Aviation GmbH"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="wireAccountNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                        Account Number / IBAN
                                    </label>
                                    <input
                                        type="text"
                                        id="wireAccountNumber"
                                        value={wireAccountNumber}
                                        onChange={(e) => setWireAccountNumber(e.target.value)}
                                        placeholder="DE89370400440532013000"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="swiftCode" className="block text-sm font-medium text-slate-700 mb-1">
                                        SWIFT/BIC Code
                                    </label>
                                    <input
                                        type="text"
                                        id="swiftCode"
                                        value={swiftCode}
                                        onChange={(e) => setSwiftCode(e.target.value.toUpperCase())}
                                        placeholder="DEUTDEDB"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="wireBankAddress" className="block text-sm font-medium text-slate-700 mb-1">
                                    Bank Address
                                </label>
                                <textarea
                                    id="wireBankAddress"
                                    value={wireBankAddress}
                                    onChange={(e) => setWireBankAddress(e.target.value)}
                                    placeholder="Taunusanlage 12, 60325 Frankfurt am Main, Germany"
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none"
                                    required
                                />
                            </div>

                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <div className="flex gap-3">
                                    <svg className="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-800">
                                        <strong>Wire Transfer Note:</strong> Wire transfers typically take 2-5 business days to process. You will receive confirmation once the payment is received.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Set as Default & Submit */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={setAsDefault}
                            onChange={(e) => setSetAsDefault(e.target.checked)}
                            className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        />
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Set as default payment method</div>
                            <div className="text-sm text-slate-600">This payment method will be used for all future transactions</div>
                        </div>
                    </label>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            "Add Payment Method"
                        )}
                    </button>
                    <Link
                        href="/app/subscription-billing"
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>

                {/* Security Notice */}
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <svg className="h-5 w-5 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div className="text-sm text-slate-600">
                        <strong className="text-slate-900">Your payment information is secure.</strong> We use industry-standard encryption (256-bit SSL) and are PCI DSS compliant. Your full card details are never stored on our servers.
                    </div>
                </div>
            </form>
        </div>
    );
}

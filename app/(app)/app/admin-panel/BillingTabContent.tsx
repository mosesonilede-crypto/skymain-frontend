"use client";

import Link from "next/link";
import { CreditCard, ExternalLink } from "lucide-react";

/**
 * BillingTabContent - lightweight stub that directs admins to the
 * full Subscription & Billing page at /app/subscription-billing.
 *
 * The previous 800-line inline-styled version has been retired in favor
 * of the consolidated billing page which integrates with Stripe.
 */
export default function BillingTabContent() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
                <CreditCard className="h-7 w-7 text-violet-600" />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900">
                    Subscription &amp; Billing
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                    Manage your plan, payment methods, and billing history
                </p>
            </div>

            <Link
                href="/app/subscription-billing"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
                Open Billing
                <ExternalLink className="h-4 w-4" />
            </Link>
        </div>
    );
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, getPriceId, PlanId, BillingInterval } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
    plan: PlanId;
    interval: BillingInterval;
    customerEmail?: string;
    customerId?: string;
};

export async function POST(req: NextRequest) {
    const stripe = getStripe();

    if (!stripe) {
        return NextResponse.json(
            { ok: false, error: "Stripe is not configured" },
            { status: 503 }
        );
    }

    try {
        const body = (await req.json()) as CheckoutBody;

        if (!body.plan || !body.interval) {
            return NextResponse.json(
                { ok: false, error: "Missing plan or interval" },
                { status: 400 }
            );
        }

        const priceId = getPriceId(body.plan, body.interval);

        if (!priceId) {
            return NextResponse.json(
                { ok: false, error: "Invalid plan configuration" },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skymaintain.ai";

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${baseUrl}/app/subscription-billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
            cancel_url: `${baseUrl}/app/subscription-billing?canceled=true`,
            allow_promotion_codes: true,
            billing_address_collection: "required",
            metadata: {
                plan: body.plan,
                interval: body.interval,
            },
        };

        // Set customer info
        if (body.customerId) {
            sessionParams.customer = body.customerId;
        } else if (body.customerEmail) {
            sessionParams.customer_email = body.customerEmail;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({
            ok: true,
            sessionId: session.id,
            url: session.url,
        });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json(
            { ok: false, error: error instanceof Error ? error.message : "Checkout failed" },
            { status: 500 }
        );
    }
}

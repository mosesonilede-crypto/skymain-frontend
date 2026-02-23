import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendWelcomeEmail } from "@/lib/email";
import { sendLicenseEmail } from "@/lib/licenseEmail";
import { issueLicense, renewLicense, suspendLicense } from "@/lib/licenseService";
import type { LicensePlan, BillingInterval } from "@/lib/license";
import Stripe from "stripe";

export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function resolvePlanFromPrice(priceId?: string | null): string | undefined {
    if (!priceId) return undefined;
    for (const [plan, prices] of Object.entries(STRIPE_PRICES)) {
        if (prices.monthly === priceId || prices.yearly === priceId) {
            return plan;
        }
    }
    return undefined;
}

async function upsertProfileByEmail(payload: {
    email: string;
    fullName?: string | null;
    orgName?: string | null;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string | null;
    subscriptionPlan?: string | null;
    paymentDetails?: string | null;
}) {
    if (!supabaseServer) return;

    const { email, fullName, orgName, stripeCustomerId, stripeSubscriptionId, subscriptionStatus, subscriptionPlan, paymentDetails } = payload;
    await supabaseServer
        .from("user_profiles")
        .upsert(
            {
                email,
                full_name: fullName || undefined,
                org_name: orgName || undefined,
                stripe_customer_id: stripeCustomerId || undefined,
                stripe_subscription_id: stripeSubscriptionId || undefined,
                subscription_status: subscriptionStatus || undefined,
                subscription_plan: subscriptionPlan || undefined,
                payment_details: paymentDetails || undefined,
            },
            { onConflict: "email" }
        );
}

async function updateProfileByCustomerId(payload: {
    stripeCustomerId: string;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string | null;
    subscriptionPlan?: string | null;
    paymentDetails?: string | null;
}) {
    if (!supabaseServer) return;

    const { stripeCustomerId, stripeSubscriptionId, subscriptionStatus, subscriptionPlan, paymentDetails } = payload;
    await supabaseServer
        .from("user_profiles")
        .update({
            stripe_subscription_id: stripeSubscriptionId || undefined,
            subscription_status: subscriptionStatus || undefined,
            subscription_plan: subscriptionPlan || undefined,
            payment_details: paymentDetails || undefined,
        })
        .eq("stripe_customer_id", stripeCustomerId);
}

export async function POST(req: NextRequest) {
    const stripe = getStripe();

    if (!stripe || !webhookSecret) {
        return NextResponse.json(
            { error: "Stripe webhook not configured" },
            { status: 503 }
        );
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing stripe-signature header" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }

    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutComplete(session);
                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionChange(subscription);
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionCanceled(subscription);
                break;
            }

            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePaid(invoice);
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentFailed(invoice);
                break;
            }

            default:
                // Unhandled event types are silently ignored in production
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook handler error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}

// Handler functions - integrate with your database/backend
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
    // Checkout completed — upsert profile

    if (!supabaseServer) return;
    const stripe = getStripe();
    if (!stripe) return;

    const customerId = typeof session.customer === "string" ? session.customer : null;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

    let email = session.customer_email || session.metadata?.userEmail || null;
    if (!email && customerId) {
        try {
            const customer = await stripe.customers.retrieve(customerId);
            if (!("deleted" in customer) && customer.email) {
                email = customer.email;
            }
        } catch (error) {
            console.error("Stripe customer lookup failed:", error);
        }
    }

    let paymentDetails: string | null = null;
    let planFromStripe: string | undefined = session.metadata?.plan;

    if (subscriptionId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
                expand: ["default_payment_method", "items.data.price"],
            });
            const card = (subscription.default_payment_method as Stripe.PaymentMethod | null)?.card;
            if (card) {
                paymentDetails = `${card.brand.toUpperCase()} •••• ${card.last4} exp ${card.exp_month}/${card.exp_year}`;
            }
            planFromStripe = planFromStripe || resolvePlanFromPrice(subscription.items.data[0]?.price?.id);
        } catch (error) {
            console.error("Stripe subscription lookup failed:", error);
        }
    }

    if (email) {
        await upsertProfileByEmail({
            email,
            fullName: session.customer_details?.name || null,
            orgName: session.metadata?.orgName || null,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: "active",
            subscriptionPlan: planFromStripe || null,
            paymentDetails,
        });

        // Send welcome email for paid subscription
        try {
            const subscriptionType = (planFromStripe?.toLowerCase() || "starter") as "starter" | "professional" | "enterprise";
            await sendWelcomeEmail({
                email,
                name: session.customer_details?.name || undefined,
                orgName: session.metadata?.orgName || undefined,
                subscriptionType,
            });
            console.info("Welcome email sent successfully");
        } catch (emailError) {
            console.warn("Failed to send welcome email:", emailError);
            // Don't fail the webhook if email fails
        }

        // Generate and send license key
        try {
            const licensePlan: LicensePlan = (planFromStripe?.toLowerCase() || "starter") as LicensePlan;
            const interval = session.metadata?.interval as BillingInterval || "monthly";

            const licenseResult = await issueLicense({
                email,
                plan: licensePlan,
                billingInterval: interval,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                orgName: session.metadata?.orgName || email,
                issuedBy: "stripe_checkout",
            });

            if (licenseResult.success && licenseResult.license) {
                await sendLicenseEmail({
                    email,
                    name: session.customer_details?.name || undefined,
                    orgName: session.metadata?.orgName || undefined,
                    licenseKey: licenseResult.license.license_key,
                    plan: licensePlan,
                    billingInterval: interval,
                    expiresAt: licenseResult.license.expires_at,
                });
                console.info("License key generated and emailed");
            } else {
                console.warn("License generation failed:", licenseResult.error);
            }
        } catch (licenseError) {
            console.warn("License generation/email failed:", licenseError);
            // Don't fail the webhook if license generation fails
        }
    }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
    // Subscription updated — sync status

    const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
    if (!customerId) return;

    const card = (subscription.default_payment_method as Stripe.PaymentMethod | null)?.card;
    const paymentDetails = card
        ? `${card.brand.toUpperCase()} •••• ${card.last4} exp ${card.exp_month}/${card.exp_year}`
        : null;

    await updateProfileByCustomerId({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPlan: resolvePlanFromPrice(subscription.items.data[0]?.price?.id),
        paymentDetails,
    });
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    // Subscription canceled — mark as canceled

    const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
    if (!customerId) return;

    await updateProfileByCustomerId({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: "canceled",
        subscriptionPlan: resolvePlanFromPrice(subscription.items.data[0]?.price?.id),
    });

    // Suspend the license
    try {
        await suspendLicense({
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            reason: "subscription_canceled",
        });
        console.info("License suspended due to cancellation");
    } catch (err) {
        console.warn("Failed to suspend license on cancellation:", err);
    }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    // Invoice paid — mark as active

    const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
    if (!customerId) return;

    await updateProfileByCustomerId({
        stripeCustomerId: customerId,
        subscriptionStatus: "active",
    });

    // Renew the license expiry
    try {
        const rawSub = (invoice as unknown as Record<string, unknown>).subscription;
        const subId = typeof rawSub === "string" ? rawSub : undefined;
        await renewLicense({
            stripeCustomerId: customerId,
            stripeSubscriptionId: subId,
        });
        console.info("License renewed on invoice paid");
    } catch (err) {
        console.warn("Failed to renew license on invoice paid:", err);
    }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    // Payment failed — mark as past_due

    const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
    if (!customerId) return;

    await updateProfileByCustomerId({
        stripeCustomerId: customerId,
        subscriptionStatus: "past_due",
    });

    // Suspend the license on payment failure
    try {
        await suspendLicense({
            stripeCustomerId: customerId,
            reason: "payment_failed",
        });
        console.info("License suspended due to payment failure");
    } catch (err) {
        console.warn("Failed to suspend license on payment failure:", err);
    }
}

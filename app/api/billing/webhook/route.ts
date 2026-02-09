import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
                console.log(`Unhandled event type: ${event.type}`);
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
    console.log("✅ Checkout completed:", {
        sessionId: session.id,
        customerId: session.customer,
        customerEmail: session.customer_email,
        subscriptionId: session.subscription,
        plan: session.metadata?.plan,
        interval: session.metadata?.interval,
    });

    // TODO: Create/update user subscription in your database
    // await db.subscriptions.create({
    //     stripeCustomerId: session.customer,
    //     stripeSubscriptionId: session.subscription,
    //     email: session.customer_email,
    //     plan: session.metadata?.plan,
    //     status: 'active',
    // });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
    console.log("📝 Subscription updated:", {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    });

    // TODO: Update subscription status in your database
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    console.log("❌ Subscription canceled:", {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
    });

    // TODO: Mark subscription as canceled in your database
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    console.log("💰 Invoice paid:", {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        amountPaid: invoice.amount_paid / 100,
        currency: invoice.currency,
    });

    // TODO: Record payment in your database
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log("⚠️ Payment failed:", {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        attemptCount: invoice.attempt_count,
    });

    // TODO: Notify user of failed payment, possibly via email
}

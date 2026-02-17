import { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { allowMockFallback } from "@/lib/runtimeFlags";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";
import { normalizeRole } from "@/lib/auth/roles";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";

type AdminKpis = {
    totalAircraft: number;
    activeUsers: number;
    maintenanceRecords: number;
    complianceRatePct: number;
};

type AdminUser = {
    id: string;
    name: string;
    email: string;
    role?: string;
    status?: string;
    subscriptionStatus?: string;
    subscriptionPlan?: string;
    paymentDetails?: string;
    createdAt?: string;
    lastLoginAt?: string | null;
    phone?: string;
    organization?: string;
    country?: string;
};

type SystemConfig = {
    licenseStatus: "Active" | "Inactive" | string;
    licenseExpires: string;
    storageUsedGb: number;
    storageTotalGb: number;
};

type AdminPanelPayload = {
    kpis: AdminKpis;
    users: AdminUser[];
    system: SystemConfig;
};

const TRIAL_LENGTH_DAYS = 14;

function computeSubscriptionStatus(
    profileStatus: string | null | undefined,
    trialStartedAt: string | null | undefined,
    trialExpiresAt: string | null | undefined,
    stripeStatus: string | null | undefined,
    userCreatedAt: string
): string {
    // If user has active Stripe subscription, they're active
    if (stripeStatus === "active" || stripeStatus === "trialing") {
        return stripeStatus === "trialing" ? "trial" : "active";
    }

    // If profile explicitly says active, trust it
    if (profileStatus === "active") {
        return "active";
    }

    // If cancelled or expired, return that
    if (profileStatus === "cancelled" || profileStatus === "expired") {
        return profileStatus;
    }

    // Check trial dates
    const now = new Date();
    let expiresAt: Date | null = null;

    if (trialExpiresAt) {
        expiresAt = new Date(trialExpiresAt);
    } else if (trialStartedAt) {
        const startDate = new Date(trialStartedAt);
        expiresAt = new Date(startDate.getTime() + TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000);
    } else {
        // No trial dates - use user created_at as trial start
        const startDate = new Date(userCreatedAt);
        expiresAt = new Date(startDate.getTime() + TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000);
    }

    if (now >= expiresAt) {
        return "expired";
    }

    return "trial";
}

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

const SESSION_COOKIE = "sm_session";

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

function resolvePlanFromPrice(priceId?: string | null): string | undefined {
    if (!priceId) return undefined;
    for (const [plan, prices] of Object.entries(STRIPE_PRICES)) {
        if (prices.monthly === priceId || prices.yearly === priceId) {
            return plan;
        }
    }
    return undefined;
}

async function listAllUsers() {
    if (!supabaseServer) return [];
    const allUsers: User[] = [];
    const perPage = 200;
    const maxPages = 50;

    for (let page = 1; page <= maxPages; page += 1) {
        const { data, error } = await supabaseServer.auth.admin.listUsers({
            page,
            perPage,
        });
        if (error) throw error;

        const users = data?.users || [];
        allUsers.push(...users);

        if (users.length < perPage) break;
    }

    return allUsers;
}

async function fetchStripeSummary(customerId?: string | null) {
    const stripe = getStripe();
    if (!stripe || !customerId) return null;

    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "all",
            limit: 1,
        });
        const subscription = subscriptions.data[0];
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });
        const defaultMethodId = subscription?.default_payment_method as string | undefined;
        const defaultMethod = defaultMethodId
            ? paymentMethods.data.find((pm) => pm.id === defaultMethodId)
            : paymentMethods.data[0];

        const card = defaultMethod?.card;
        const paymentDetails = card
            ? `${card.brand.toUpperCase()} •••• ${card.last4} exp ${card.exp_month}/${card.exp_year}`
            : paymentMethods.data.length > 0
                ? "Payment method on file"
                : "No payment method";

        const planFromStripe = resolvePlanFromPrice(subscription?.items.data[0]?.price?.id);
        return {
            subscriptionStatus: subscription?.status,
            subscriptionPlan: planFromStripe,
            paymentDetails,
        };
    } catch (error) {
        console.error("Stripe admin summary error:", error);
        return null;
    }
}

function generateMockAdminData(): AdminPanelPayload {
    return {
        kpis: {
            totalAircraft: 24,
            activeUsers: 45,
            maintenanceRecords: 1234,
            complianceRatePct: 98,
        },
        users: [
            {
                id: "USR-001",
                name: "John Anderson",
                email: "john.anderson@skywings.com",
                role: "Admin",
                status: "Active",
                subscriptionStatus: "active",
                subscriptionPlan: "Professional",
                paymentDetails: "VISA •••• 4242 exp 12/2026",
                createdAt: "2025-11-12T10:14:00Z",
                lastLoginAt: "2026-02-12T08:22:00Z",
                organization: "SkyWings",
                country: "United States",
            },
            {
                id: "USR-002",
                name: "Sarah Mitchell",
                email: "sarah.mitchell@skywings.com",
                role: "Fleet Manager",
                status: "Active",
                subscriptionStatus: "trial",
                subscriptionPlan: "Starter",
                paymentDetails: "No payment method",
                createdAt: "2026-01-03T14:31:00Z",
                lastLoginAt: "2026-02-10T16:05:00Z",
                organization: "SkyWings",
                country: "United States",
            },
            {
                id: "USR-003",
                name: "Michael Chen",
                email: "michael.chen@skywings.com",
                role: "Maintenance Engineer",
                status: "Active",
                subscriptionStatus: "active",
                subscriptionPlan: "Professional",
                paymentDetails: "AMEX •••• 8899 exp 06/2027",
                createdAt: "2025-09-18T09:42:00Z",
                lastLoginAt: "2026-02-14T11:12:00Z",
                organization: "SkyWings",
                country: "United States",
            },
            {
                id: "USR-004",
                name: "Jennifer Lopez",
                email: "jennifer.lopez@skywings.com",
                role: "Maintenance Engineer",
                status: "Active",
                subscriptionStatus: "active",
                subscriptionPlan: "Enterprise",
                paymentDetails: "Mastercard •••• 5521 exp 03/2027",
                createdAt: "2025-08-07T07:50:00Z",
                lastLoginAt: "2026-02-13T19:42:00Z",
                organization: "SkyWings",
                country: "United States",
            },
            {
                id: "USR-005",
                name: "David Thompson",
                email: "david.thompson@skywings.com",
                role: "Fleet Manager",
                status: "Suspended",
                subscriptionStatus: "cancelled",
                subscriptionPlan: "Starter",
                paymentDetails: "No payment method",
                createdAt: "2025-06-25T13:18:00Z",
                lastLoginAt: null,
                organization: "SkyWings",
                country: "United States",
            },
        ],
        system: {
            licenseStatus: "Active",
            licenseExpires: "December 31, 2026",
            storageUsedGb: 42.5,
            storageTotalGb: 100,
        },
    };
}

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        if (!supabaseServer) {
            if (allowMockFallback()) {
                const data = generateMockAdminData();
                return NextResponse.json({ ...data, fallback: true }, {
                    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
                });
            }
            return NextResponse.json({ error: "Supabase admin client is not configured" }, { status: 503 });
        }

        const allUsers = await listAllUsers();

        let profiles: Array<{
            user_id?: string;
            email?: string | null;
            full_name?: string | null;
            org_name?: string | null;
            role?: string | null;
            phone?: string | null;
            country?: string | null;
            subscription_status?: string | null;
            subscription_plan?: string | null;
            stripe_customer_id?: string | null;
            payment_details?: string | null;
            created_at?: string | null;
            updated_at?: string | null;
            trial_started_at?: string | null;
            trial_expires_at?: string | null;
        }> = [];
        try {
            const { data: profilesData, error: profilesError } = await supabaseServer
                .from("user_profiles")
                .select("user_id,email,full_name,org_name,role,phone,country,subscription_status,subscription_plan,stripe_customer_id,payment_details,created_at,updated_at,trial_started_at,trial_expires_at");
            if (profilesError) {
                console.warn("Admin directory profiles unavailable:", profilesError);
            } else {
                profiles = profilesData || [];
            }
        } catch (profilesError) {
            console.warn("Admin directory profiles query failed:", profilesError);
        }

        const profileById = new Map((profiles || []).map((profile) => [profile.user_id, profile]));
        const profileByEmail = new Map(
            (profiles || [])
                .filter((profile) => profile.email)
                .map((profile) => [String(profile.email).toLowerCase(), profile])
        );

        const users = await Promise.all(
            allUsers
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map(async (user) => {
                    const metadata = (user.user_metadata || {}) as Record<string, unknown>;
                    const appMetadata = (user.app_metadata || {}) as Record<string, unknown>;
                    const profile = profileById.get(user.id)
                        || (user.email ? profileByEmail.get(user.email.toLowerCase()) : undefined);
                    const stripeCustomerId =
                        profile?.stripe_customer_id
                        || (metadata.stripe_customer_id as string | undefined)
                        || (metadata.stripeCustomerId as string | undefined)
                        || (appMetadata.stripe_customer_id as string | undefined)
                        || (appMetadata.stripeCustomerId as string | undefined);

                    const stripeSummary = profile?.payment_details
                        ? null
                        : await fetchStripeSummary(stripeCustomerId);

                    return {
                        id: user.id,
                        name:
                            (profile?.full_name as string | undefined)
                            || (metadata.full_name as string | undefined)
                            || (metadata.name as string | undefined)
                            || (metadata.displayName as string | undefined)
                            || (appMetadata.full_name as string | undefined)
                            || (appMetadata.name as string | undefined)
                            || user.email?.split("@")[0]
                            || "Unknown User",
                        email: user.email || "Not available",
                        role:
                            (profile?.role as string | undefined)
                            || (metadata.role as string | undefined)
                            || (appMetadata.role as string | undefined)
                            || "Viewer",
                        status: (metadata.status as string | undefined) || "Active",
                        subscriptionStatus: computeSubscriptionStatus(
                            (profile?.subscription_status as string | undefined)
                            || (metadata.subscription_status as string | undefined)
                            || (appMetadata.subscription_status as string | undefined),
                            profile?.trial_started_at,
                            profile?.trial_expires_at,
                            stripeSummary?.subscriptionStatus,
                            user.created_at
                        ),
                        subscriptionPlan:
                            (profile?.subscription_plan as string | undefined)
                            || (metadata.subscription_plan as string | undefined)
                            || (appMetadata.subscription_plan as string | undefined)
                            || stripeSummary?.subscriptionPlan
                            || "Not available",
                        paymentDetails:
                            (profile?.payment_details as string | undefined)
                            || (metadata.payment_details as string | undefined)
                            || stripeSummary?.paymentDetails
                            || "Not available",
                        createdAt: user.created_at,
                        lastLoginAt: user.last_sign_in_at,
                        phone: (profile?.phone as string | undefined) || (metadata.phone as string | undefined) || "Not available",
                        organization:
                            (profile?.org_name as string | undefined)
                            || (metadata.orgName as string | undefined)
                            || (metadata.organization as string | undefined)
                            || (appMetadata.orgName as string | undefined)
                            || "Not available",
                        country:
                            (profile?.country as string | undefined)
                            || (metadata.country as string | undefined)
                            || (appMetadata.country as string | undefined)
                            || "Not available",
                    } satisfies AdminUser;
                })
        );

        return NextResponse.json(
            {
                kpis: {
                    totalAircraft: 0,
                    activeUsers: users.length,
                    maintenanceRecords: 0,
                    complianceRatePct: 0,
                },
                users,
                system: {
                    licenseStatus: "Active",
                    licenseExpires: "Not available",
                    storageUsedGb: 0,
                    storageTotalGb: 0,
                },
            },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        if (allowMockFallback()) {
            const data = generateMockAdminData();
            return NextResponse.json({ ...data, fallback: true }, {
                headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
            });
        }

        console.error("Error fetching admin data:", error);
        const detail = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Admin directory is not configured", detail },
            { status: 503 }
        );
    }
}

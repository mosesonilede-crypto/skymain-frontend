import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";
import { sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";
const TRIAL_LENGTH_DAYS = 14;

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

export type TrialStatusResponse = {
    status: "trial" | "active" | "expired" | "pending";
    daysRemaining: number;
    trialStartedAt: string | null;
    trialExpiresAt: string | null;
    hasActiveSubscription: boolean;
};

// GET - Check trial status for current user
export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        // Find user profile by email
        const { data: profile, error } = await supabaseServer
            .from("user_profiles")
            .select("subscription_status, trial_started_at, trial_expires_at, stripe_subscription_id")
            .eq("email", session.email.toLowerCase())
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("Trial status lookup error:", error);
            return NextResponse.json({ error: "Failed to check trial status" }, { status: 500 });
        }

        const now = new Date();

        // No profile found - return pending status
        if (!profile) {
            return NextResponse.json<TrialStatusResponse>({
                status: "pending",
                daysRemaining: 0,
                trialStartedAt: null,
                trialExpiresAt: null,
                hasActiveSubscription: false,
            });
        }

        const hasActiveSubscription =
            profile.subscription_status === "active" ||
            (profile.stripe_subscription_id && profile.subscription_status !== "cancelled" && profile.subscription_status !== "expired");

        // Has active subscription - not on trial
        if (hasActiveSubscription) {
            return NextResponse.json<TrialStatusResponse>({
                status: "active",
                daysRemaining: 0,
                trialStartedAt: profile.trial_started_at,
                trialExpiresAt: profile.trial_expires_at,
                hasActiveSubscription: true,
            });
        }

        // Check trial status
        const trialExpiresAt = profile.trial_expires_at ? new Date(profile.trial_expires_at) : null;

        if (!trialExpiresAt) {
            // No trial info - treat as pending
            return NextResponse.json<TrialStatusResponse>({
                status: "pending",
                daysRemaining: 0,
                trialStartedAt: profile.trial_started_at,
                trialExpiresAt: null,
                hasActiveSubscription: false,
            });
        }

        const msRemaining = trialExpiresAt.getTime() - now.getTime();
        const daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
        const expired = now >= trialExpiresAt;

        return NextResponse.json<TrialStatusResponse>({
            status: expired ? "expired" : "trial",
            daysRemaining,
            trialStartedAt: profile.trial_started_at,
            trialExpiresAt: profile.trial_expires_at,
            hasActiveSubscription: false,
        });
    } catch (error) {
        console.error("Trial status error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Start or refresh trial for current user
export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const now = new Date();
        const trialExpiresAt = new Date(now.getTime() + TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000);

        // Look up user by email
        const { data: existingProfile } = await supabaseServer
            .from("user_profiles")
            .select("user_id, trial_started_at, subscription_status, stripe_subscription_id")
            .eq("email", session.email.toLowerCase())
            .single();

        // If user has active subscription, don't start trial
        if (existingProfile?.subscription_status === "active" || existingProfile?.stripe_subscription_id) {
            return NextResponse.json({
                ok: false,
                message: "User already has an active subscription",
            });
        }

        // If user already has a trial, don't restart it
        if (existingProfile?.trial_started_at) {
            return NextResponse.json({
                ok: true,
                message: "Trial already active",
                trialStartedAt: existingProfile.trial_started_at,
            });
        }

        // Find the user in auth.users to get their UUID
        const { data: authUsers } = await supabaseServer.auth.admin.listUsers({
            page: 1,
            perPage: 1,
        });

        // Try to find by email match
        const authUser = authUsers?.users?.find(
            u => u.email?.toLowerCase() === session.email.toLowerCase()
        );

        if (existingProfile?.user_id) {
            // Update existing profile with trial info
            const { error: updateError } = await supabaseServer
                .from("user_profiles")
                .update({
                    trial_started_at: now.toISOString(),
                    trial_expires_at: trialExpiresAt.toISOString(),
                    subscription_status: "trial",
                })
                .eq("user_id", existingProfile.user_id);

            if (updateError) {
                console.error("Failed to update trial:", updateError);
                return NextResponse.json({ error: "Failed to start trial" }, { status: 500 });
            }
        } else if (authUser) {
            // Create new profile with trial info
            const { error: insertError } = await supabaseServer
                .from("user_profiles")
                .upsert({
                    user_id: authUser.id,
                    email: session.email.toLowerCase(),
                    org_name: session.orgName,
                    role: session.role || "user",
                    subscription_status: "trial",
                    trial_started_at: now.toISOString(),
                    trial_expires_at: trialExpiresAt.toISOString(),
                }, { onConflict: "user_id" });

            if (insertError) {
                console.error("Failed to create trial profile:", insertError);
                return NextResponse.json({ error: "Failed to start trial" }, { status: 500 });
            }
        } else {
            // No auth user found - can't create profile without user_id
            // This happens for demo/non-Supabase users
            return NextResponse.json({
                ok: true,
                message: "Trial tracked client-side only (no Supabase user)",
            });
        }

        // Send welcome email (best effort - don't fail if email fails)
        try {
            await sendWelcomeEmail({
                email: session.email,
                orgName: session.orgName,
                subscriptionType: "trial",
                trialExpiresAt: trialExpiresAt.toISOString(),
            });
        } catch (emailError) {
            console.warn("Failed to send welcome email:", emailError);
            // Don't fail the trial creation if email fails
        }

        return NextResponse.json({
            ok: true,
            trialStartedAt: now.toISOString(),
            trialExpiresAt: trialExpiresAt.toISOString(),
        });
    } catch (error) {
        console.error("Trial start error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

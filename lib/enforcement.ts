/**
 * Server-side entitlement enforcement.
 *
 * Use this in API routes to check plan limits before allowing resource creation.
 * Unlike the client-side useEntitlements hook, this reads directly from the DB.
 */

import { supabaseServer } from "@/lib/supabaseServer";
import { getEntitlementsForTier, type SubscriptionEntitlements } from "@/lib/entitlements";

export type EnforcementResult =
    | { allowed: true }
    | { allowed: false; code: string; message: string; current: number; max: number };

/**
 * Resolve the subscription tier for an org from user_profiles.
 */
async function resolveOrgTier(orgName: string): Promise<string> {
    if (!supabaseServer || !orgName) return "starter";

    try {
        // Get the admin (or first user) of the org to determine plan
        const { data } = await supabaseServer
            .from("user_profiles")
            .select("subscription_plan, subscription_status")
            .ilike("org_name", orgName)
            .order("created_at", { ascending: true })
            .limit(1)
            .single();

        return data?.subscription_plan || "starter";
    } catch {
        return "starter";
    }
}

/**
 * Get entitlements for a given org.
 */
export async function getOrgEntitlements(orgName: string): Promise<SubscriptionEntitlements> {
    const tier = await resolveOrgTier(orgName);
    return getEntitlementsForTier(tier);
}

/**
 * Enforce aircraft limit for an org.
 */
export async function enforceAircraftLimit(orgName: string): Promise<EnforcementResult> {
    const entitlements = await getOrgEntitlements(orgName);
    const max = entitlements.limits.max_aircraft;

    if (max === null) return { allowed: true }; // Unlimited (enterprise)

    if (!supabaseServer) return { allowed: true }; // Can't check, allow

    const { count, error } = await supabaseServer
        .from("aircraft")
        .select("id", { count: "exact", head: true })
        .eq("org_name", orgName)
        .is("deleted_at", null);

    if (error) return { allowed: true }; // Can't check, allow with warning

    const current = count || 0;

    if (current >= max) {
        return {
            allowed: false,
            code: "AIRCRAFT_LIMIT_REACHED",
            message: `Aircraft limit reached for your plan (${current}/${max}). Upgrade to add more.`,
            current,
            max,
        };
    }

    return { allowed: true };
}

/**
 * Enforce team member limit for an org.
 */
export async function enforceTeamMemberLimit(orgName: string): Promise<EnforcementResult> {
    const entitlements = await getOrgEntitlements(orgName);
    const max = entitlements.limits.max_team_members;

    if (max === null) return { allowed: true };

    if (!supabaseServer) return { allowed: true };

    const { count, error } = await supabaseServer
        .from("user_profiles")
        .select("user_id", { count: "exact", head: true })
        .ilike("org_name", orgName);

    if (error) return { allowed: true };

    const current = count || 0;

    if (current >= max) {
        return {
            allowed: false,
            code: "TEAM_MEMBER_LIMIT_REACHED",
            message: `Team member limit reached for your plan (${current}/${max}). Upgrade to add more.`,
            current,
            max,
        };
    }

    return { allowed: true };
}

/**
 * Enforce storage limit for an org (approximate — based on document count).
 */
export async function enforceStorageLimit(orgName: string): Promise<EnforcementResult> {
    const entitlements = await getOrgEntitlements(orgName);
    const maxGb = entitlements.limits.max_storage_gb;

    if (maxGb === null) return { allowed: true };

    // Storage enforcement is best-effort; Supabase doesn't expose
    // per-folder storage size easily. This is a placeholder for
    // future integration with Supabase storage metrics API.
    return { allowed: true };
}

/**
 * Check if a feature is enabled for an org.
 */
export async function isFeatureEnabled(
    orgName: string,
    feature: keyof SubscriptionEntitlements["features"]
): Promise<boolean> {
    const entitlements = await getOrgEntitlements(orgName);
    return !!entitlements.features[feature];
}

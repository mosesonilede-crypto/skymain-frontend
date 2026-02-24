/**
 * License Service — Database operations for subscription licenses.
 *
 * Called by the Stripe webhook handler after payment, and by API
 * routes that need to query/validate licenses.
 */

import { supabaseServer } from "@/lib/supabaseServer";
import {
    generateLicenseKey,
    computeExpiresAt,
    verifyLicenseKeyFormat,
    type LicensePlan,
    type BillingInterval,
    type LicenseRecord,
} from "@/lib/license";

// ── Issue a new license ─────────────────────────────────────────────
export async function issueLicense(params: {
    email: string;
    plan: LicensePlan;
    billingInterval: BillingInterval;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    orgName: string;
    issuedBy?: string;
}): Promise<{ success: boolean; license?: LicenseRecord; error?: string }> {
    if (!supabaseServer) {
        return { success: false, error: "Supabase not configured" };
    }

    const {
        email,
        plan,
        billingInterval,
        stripeCustomerId,
        stripeSubscriptionId,
        orgName,
        issuedBy = "system",
    } = params;

    if (!orgName || !orgName.trim()) {
        return { success: false, error: "Organisation name is required to issue a license" };
    }

    // Check if there's already an active license for this organisation
    const { data: existingOrgLicense } = await supabaseServer
        .from("subscription_licenses")
        .select("*")
        .eq("org_name", orgName.trim())
        .eq("status", "active")
        .maybeSingle();

    if (existingOrgLicense) {
        // This org already has an active license — return it (single-org enforcement)
        return { success: true, license: existingOrgLicense as LicenseRecord };
    }

    // Check if there's already an active license for this subscription
    if (stripeSubscriptionId) {
        const { data: existing } = await supabaseServer
            .from("subscription_licenses")
            .select("*")
            .eq("stripe_subscription_id", stripeSubscriptionId)
            .eq("status", "active")
            .maybeSingle();

        if (existing) {
            // Already has an active license for this subscription — return it
            return { success: true, license: existing as LicenseRecord };
        }
    }

    // Also check by email — avoid duplicate active licenses
    const { data: existingByEmail } = await supabaseServer
        .from("subscription_licenses")
        .select("*")
        .eq("email", email)
        .eq("status", "active")
        .maybeSingle();

    if (existingByEmail) {
        // Expire the old one before issuing new
        await supabaseServer
            .from("subscription_licenses")
            .update({ status: "expired" })
            .eq("id", existingByEmail.id);
    }

    // Generate a unique license key (retry up to 3 times on collision)
    let licenseKey = "";
    for (let attempt = 0; attempt < 3; attempt++) {
        const candidate = generateLicenseKey(plan);
        const { data: collision } = await supabaseServer
            .from("subscription_licenses")
            .select("id")
            .eq("license_key", candidate)
            .maybeSingle();

        if (!collision) {
            licenseKey = candidate;
            break;
        }
    }

    if (!licenseKey) {
        return { success: false, error: "Failed to generate unique license key" };
    }

    const now = new Date();
    const expiresAt = computeExpiresAt(billingInterval, now);

    const record = {
        license_key: licenseKey,
        email,
        stripe_customer_id: stripeCustomerId || null,
        stripe_subscription_id: stripeSubscriptionId || null,
        org_name: orgName.trim(),
        plan,
        billing_interval: billingInterval,
        status: "active" as const,
        issued_at: now.toISOString(),
        activated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        created_by: issuedBy,
        metadata: {
            issued_via: "stripe_webhook",
        },
    };

    const { data, error } = await supabaseServer
        .from("subscription_licenses")
        .insert(record)
        .select()
        .single();

    if (error) {
        console.error("License insert failed:", error);
        return { success: false, error: error.message };
    }

    return { success: true, license: data as LicenseRecord };
}

// ── Renew an existing license (on invoice.paid) ────────────────────
export async function renewLicense(params: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    email?: string;
}): Promise<{ success: boolean; license?: LicenseRecord; error?: string }> {
    if (!supabaseServer) {
        return { success: false, error: "Supabase not configured" };
    }

    const { stripeCustomerId, stripeSubscriptionId, email } = params;

    // Find the active license
    let query = supabaseServer
        .from("subscription_licenses")
        .select("*")
        .eq("status", "active");

    if (stripeSubscriptionId) {
        query = query.eq("stripe_subscription_id", stripeSubscriptionId);
    } else if (stripeCustomerId) {
        query = query.eq("stripe_customer_id", stripeCustomerId);
    } else if (email) {
        query = query.eq("email", email);
    } else {
        return { success: false, error: "No identifier provided" };
    }

    const { data: license } = await query.maybeSingle();

    if (!license) {
        return { success: false, error: "No active license found" };
    }

    const now = new Date();
    const newExpiry = computeExpiresAt(license.billing_interval, now);

    const { data: updated, error } = await supabaseServer
        .from("subscription_licenses")
        .update({
            expires_at: newExpiry.toISOString(),
            renewed_at: now.toISOString(),
            status: "active",
        })
        .eq("id", license.id)
        .select()
        .single();

    if (error) {
        console.error("License renewal failed:", error);
        return { success: false, error: error.message };
    }

    return { success: true, license: updated as LicenseRecord };
}

// ── Suspend license (on subscription canceled or payment_failed) ───
export async function suspendLicense(params: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    reason?: string;
}): Promise<{ success: boolean; error?: string }> {
    if (!supabaseServer) {
        return { success: false, error: "Supabase not configured" };
    }

    const { stripeCustomerId, stripeSubscriptionId, reason } = params;

    let query = supabaseServer
        .from("subscription_licenses")
        .update({
            status: "suspended",
            revocation_reason: reason || "subscription_event",
        })
        .eq("status", "active");

    if (stripeSubscriptionId) {
        query = query.eq("stripe_subscription_id", stripeSubscriptionId);
    } else if (stripeCustomerId) {
        query = query.eq("stripe_customer_id", stripeCustomerId);
    } else {
        return { success: false, error: "No identifier provided" };
    }

    const { error } = await query;

    if (error) {
        console.error("License suspension failed:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// ── Validate a license key (full DB check + org binding) ────────────
export async function validateLicense(licenseKey: string, orgName?: string): Promise<{
    valid: boolean;
    license?: LicenseRecord;
    error?: string;
}> {
    // Step 1: Format check (HMAC integrity)
    const formatCheck = verifyLicenseKeyFormat(licenseKey);
    if (!formatCheck.valid) {
        return { valid: false, error: formatCheck.error };
    }

    if (!supabaseServer) {
        // Can't check DB, but format is valid
        return { valid: true, error: "Database unavailable — format valid only" };
    }

    // Step 2: DB lookup
    const { data: license, error } = await supabaseServer
        .from("subscription_licenses")
        .select("*")
        .eq("license_key", licenseKey.toUpperCase())
        .maybeSingle();

    if (error) {
        return { valid: false, error: "Database lookup failed" };
    }

    if (!license) {
        return { valid: false, error: "License key not found" };
    }

    // Step 3: Status check
    if (license.status !== "active") {
        return {
            valid: false,
            license: license as LicenseRecord,
            error: `License is ${license.status}`,
        };
    }

    // Step 4: Expiration check
    if (new Date(license.expires_at) < new Date()) {
        // Auto-expire in DB
        await supabaseServer
            .from("subscription_licenses")
            .update({ status: "expired" })
            .eq("id", license.id);

        return {
            valid: false,
            license: { ...license, status: "expired" } as LicenseRecord,
            error: "License has expired",
        };
    }

    // Step 5: Organisation binding check
    if (orgName && license.org_name) {
        const boundOrg = license.org_name.trim().toLowerCase();
        const requestOrg = orgName.trim().toLowerCase();
        if (boundOrg !== requestOrg) {
            return {
                valid: false,
                license: license as LicenseRecord,
                error: "This license key is bound to a different organisation",
            };
        }
    }

    return { valid: true, license: license as LicenseRecord };
}

// ── Get license for a user by email ────────────────────────────────
export async function getLicenseByEmail(email: string): Promise<{
    license: LicenseRecord | null;
    error?: string;
}> {
    if (!supabaseServer) {
        return { license: null, error: "Supabase not configured" };
    }

    const { data, error } = await supabaseServer
        .from("subscription_licenses")
        .select("*")
        .eq("email", email)
        .eq("status", "active")
        .order("issued_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        return { license: null, error: error.message };
    }

    return { license: data as LicenseRecord | null };
}

// ── Get active license by license key ──────────────────────────────
export async function getLicenseByKey(licenseKey: string): Promise<{
    license: LicenseRecord | null;
    error?: string;
}> {
    if (!supabaseServer) {
        return { license: null, error: "Supabase not configured" };
    }

    const { data, error } = await supabaseServer
        .from("subscription_licenses")
        .select("*")
        .eq("license_key", licenseKey.toUpperCase())
        .eq("status", "active")
        .maybeSingle();

    if (error) {
        return { license: null, error: error.message };
    }

    return { license: data as LicenseRecord | null };
}

// ── Get the active license for an organisation ─────────────────────
export async function getLicenseByOrg(orgName: string): Promise<{
    license: LicenseRecord | null;
    error?: string;
}> {
    if (!supabaseServer) {
        return { license: null, error: "Supabase not configured" };
    }

    const { data, error } = await supabaseServer
        .from("subscription_licenses")
        .select("*")
        .eq("org_name", orgName.trim())
        .eq("status", "active")
        .order("issued_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        return { license: null, error: error.message };
    }

    return { license: data as LicenseRecord | null };
}

// ── Get all licenses for a user (including expired/suspended) ──────
export async function getLicenseHistory(email: string): Promise<{
    licenses: LicenseRecord[];
    error?: string;
}> {
    if (!supabaseServer) {
        return { licenses: [], error: "Supabase not configured" };
    }

    const { data, error } = await supabaseServer
        .from("subscription_licenses")
        .select("*")
        .eq("email", email)
        .order("issued_at", { ascending: false });

    if (error) {
        return { licenses: [], error: error.message };
    }

    return { licenses: (data || []) as LicenseRecord[] };
}

/**
 * License Code Generation & Validation
 *
 * Generates cryptographically secure, plan-aware license keys for paid subscribers.
 * Format: SKM-<PLAN_CODE>-<8_CHAR_RANDOM>-<2_CHAR_CHECK>
 *
 * Examples:
 *   SKM-STR-A7K9X2M4-R3   (Starter)
 *   SKM-PRO-B2F8N6J1-Q7   (Professional)
 *   SKM-ENT-C4D9P3W5-T1   (Enterprise)
 */

import { randomBytes, createHmac } from "crypto";

// ── Plan Codes ──────────────────────────────────────────────────────
export type LicensePlan = "starter" | "professional" | "enterprise";
export type BillingInterval = "monthly" | "yearly";

const PLAN_CODES: Record<LicensePlan, string> = {
    starter: "STR",
    professional: "PRO",
    enterprise: "ENT",
};

// ── Renewal Periods (in days) ───────────────────────────────────────
const RENEWAL_DAYS: Record<BillingInterval, number> = {
    monthly: 31,
    yearly: 366,
};

// ── HMAC secret for check digits (falls back to a static salt if env not set) ─
function getHmacSecret(): string {
    return process.env.SKYMAINTAIN_LICENSE_HMAC_SECRET || process.env.TWO_FA_SECRET || "skymaintain-license-default-secret-2026";
}

// ── Generate 8-character random alphanumeric (uppercase) ────────────
function randomAlphaNum(length: number): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excludes ambiguous: 0/O, 1/I
    const bytes = randomBytes(length);
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}

// ── Compute 2-character check code (HMAC-based) ────────────────────
function computeCheckDigits(body: string): string {
    const hmac = createHmac("sha256", getHmacSecret());
    hmac.update(body);
    const digest = hmac.digest("hex");
    // Take first 2 chars from the hex, map to our charset
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const c1 = chars[parseInt(digest.substring(0, 2), 16) % chars.length];
    const c2 = chars[parseInt(digest.substring(2, 4), 16) % chars.length];
    return `${c1}${c2}`;
}

// ── Generate a License Key ──────────────────────────────────────────
export function generateLicenseKey(plan: LicensePlan): string {
    const planCode = PLAN_CODES[plan] || "STR";
    const random = randomAlphaNum(8);
    const body = `SKM-${planCode}-${random}`;
    const check = computeCheckDigits(body);
    return `${body}-${check}`;
}

// ── Verify a license key's check digits (integrity check) ──────────
export function verifyLicenseKeyFormat(licenseKey: string): {
    valid: boolean;
    plan?: LicensePlan;
    error?: string;
} {
    // Expected format: SKM-XXX-YYYYYYYY-ZZ
    const pattern = /^SKM-(STR|PRO|ENT)-([A-Z2-9]{8})-([A-Z2-9]{2})$/;
    const match = licenseKey.trim().toUpperCase().match(pattern);

    if (!match) {
        return { valid: false, error: "Invalid license key format" };
    }

    const [, planCode, , checkDigits] = match;
    const body = licenseKey.substring(0, licenseKey.lastIndexOf("-"));
    const expectedCheck = computeCheckDigits(body.toUpperCase());

    if (checkDigits !== expectedCheck) {
        return { valid: false, error: "License key check digits do not match" };
    }

    const planMap: Record<string, LicensePlan> = {
        STR: "starter",
        PRO: "professional",
        ENT: "enterprise",
    };

    return { valid: true, plan: planMap[planCode] };
}

// ── Compute expiration date from plan ───────────────────────────────
export function computeExpiresAt(
    billingInterval: BillingInterval,
    fromDate?: Date
): Date {
    const base = fromDate || new Date();
    const days = RENEWAL_DAYS[billingInterval];
    return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

// ── License record type ─────────────────────────────────────────────
export type LicenseRecord = {
    license_key: string;
    email: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    org_name: string;
    plan: LicensePlan;
    billing_interval: BillingInterval;
    status: "active" | "suspended" | "expired" | "revoked";
    issued_at: string;
    activated_at: string | null;
    expires_at: string;
    renewed_at: string | null;
    metadata: Record<string, unknown>;
};

// ── Plan display names ──────────────────────────────────────────────
export const PLAN_DISPLAY_NAMES: Record<LicensePlan, string> = {
    starter: "Starter",
    professional: "Professional",
    enterprise: "Enterprise",
};

// ── Format license key for display (e.g., with dashes highlighted) ──
export function formatLicenseForDisplay(key: string): string {
    return key.toUpperCase();
}

export function normalizeRole(role?: string | null): string {
    const normalized = (role || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
    if (normalized === "superadmin") return "super_admin";
    return normalized;
}

function normalizeLicenseCode(code?: string | null): string {
    return (code || "").trim().toUpperCase();
}

function normalizeEmail(email?: string | null): string {
    return (email || "").trim().toLowerCase();
}

function parseCsvCodes(codes?: string): string[] {
    return (codes || "")
        .split(",")
        .map((item) => normalizeLicenseCode(item))
        .filter(Boolean);
}

export function isAdminRole(role?: string | null): boolean {
    const normalized = normalizeRole(role);
    return normalized === "admin" || normalized === "super_admin";
}

function getSuperAdminCodes(): Set<string> {
    return new Set([
        "MOSES-SUPER-ADMIN-LICENSE",
        "ADMIN-SUPER-ACCESS",
        ...parseCsvCodes(process.env.NEXT_PUBLIC_SUPER_ADMIN_LICENSE_CODES),
    ]);
}

function getSuperAdminEmails(): Set<string> {
    return new Set([
        "mosesonilede@gmail.com",
        ...((process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || "")
            .split(",")
            .map((item) => normalizeEmail(item))
            .filter(Boolean)),
    ]);
}

/**
 * Returns true if the given email or license code identifies a super admin.
 * Super admins have unrestricted access — no trial or subscription required.
 */
export function isSuperAdmin(input: { email?: string | null; licenseCode?: string | null }): boolean {
    const normalizedEmail = normalizeEmail(input.email);
    const normalizedCode = normalizeLicenseCode(input.licenseCode);
    if (normalizedEmail && getSuperAdminEmails().has(normalizedEmail)) return true;
    if (normalizedCode && getSuperAdminCodes().has(normalizedCode)) return true;
    return false;
}

export function resolveSessionRole(input: { rawRole?: string | null; licenseCode?: string | null; email?: string | null }): string {
    const normalizedRole = normalizeRole(input.rawRole);
    const normalizedCode = normalizeLicenseCode(input.licenseCode);

    if (isSuperAdmin({ email: input.email, licenseCode: input.licenseCode })) {
        return "super_admin";
    }

    const adminCodes = new Set([
        ...parseCsvCodes(process.env.NEXT_PUBLIC_ADMIN_LICENSE_CODES),
    ]);

    if (normalizedCode && adminCodes.has(normalizedCode)) {
        return "admin";
    }

    return normalizedRole || "fleet_manager";
}

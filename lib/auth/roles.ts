export function normalizeRole(role?: string | null): string {
    return (role || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
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

export function resolveSessionRole(input: { rawRole?: string | null; licenseCode?: string | null; email?: string | null }): string {
    const normalizedRole = normalizeRole(input.rawRole);
    const normalizedCode = normalizeLicenseCode(input.licenseCode);
    const normalizedEmail = normalizeEmail(input.email);

    const superAdminCodes = new Set([
        "MOSES-SUPER-ADMIN-LICENSE",
        "ADMIN-SUPER-ACCESS",
        ...parseCsvCodes(process.env.NEXT_PUBLIC_SUPER_ADMIN_LICENSE_CODES),
    ]);

    const adminCodes = new Set([
        ...parseCsvCodes(process.env.NEXT_PUBLIC_ADMIN_LICENSE_CODES),
    ]);

    const superAdminEmails = new Set([
        "mosesonilede@gmail.com",
        "manager@skywings.com",
        ...((process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || "")
            .split(",")
            .map((item) => normalizeEmail(item))
            .filter(Boolean)),
    ]);

    if (normalizedEmail && superAdminEmails.has(normalizedEmail)) {
        return "super_admin";
    }

    if (normalizedCode && superAdminCodes.has(normalizedCode)) {
        return "super_admin";
    }

    if (normalizedCode && adminCodes.has(normalizedCode)) {
        return "admin";
    }

    return normalizedRole || "fleet_manager";
}

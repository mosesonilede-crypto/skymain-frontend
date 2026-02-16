const SUPER_ADMIN_LICENSE_CODES = new Set([
    "admin_super_access",
    "skymaintain_superadmin_2026",
]);

export function normalizeRole(value?: string): string {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
}

export function normalizeLicenseCode(value?: string): string {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

export function deriveRoleFromLicenseCode(licenseCode?: string, fallbackRole?: string): string {
    const normalizedCode = normalizeLicenseCode(licenseCode);
    if (
        normalizedCode &&
        (SUPER_ADMIN_LICENSE_CODES.has(normalizedCode) ||
            normalizedCode.includes("super_admin") ||
            normalizedCode.includes("superadmin"))
    ) {
        return "super_admin";
    }

    if (normalizedCode && normalizedCode.includes("admin")) {
        return "admin";
    }

    const normalizedFallback = normalizeRole(fallbackRole);
    return normalizedFallback || "fleet_manager";
}

export function hasAdminPanelAccess(role?: string): boolean {
    const normalized = normalizeRole(role);
    return normalized === "admin" || normalized === "super_admin" || normalized === "superadmin";
}

export function getStoredLicenseCode(): string {
    if (typeof window === "undefined") return "";
    return (
        window.localStorage.getItem("skymaintain.licenseCode") ||
        window.sessionStorage.getItem("skymaintain.licenseCode") ||
        ""
    );
}
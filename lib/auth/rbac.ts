export type UserContext = {
    userId: string;
    role: string;
    orgId?: string;
};

const ROLE_PRIORITY: Record<string, number> = {
    Admin: 4,
    "Compliance Officer": 3,
    "Fleet Manager": 3,
    "Maintenance Engineer": 2,
    Viewer: 1,
};

export function getUserContext(headers: Headers): UserContext {
    const userId = headers.get("x-user-id") || "anonymous";
    const role = headers.get("x-user-role") || "Viewer";
    const orgId = headers.get("x-org-id") || undefined;
    return { userId, role, orgId };
}

export function requireRole(user: UserContext, minimumRole: string): void {
    const userPriority = ROLE_PRIORITY[user.role] ?? 0;
    const requiredPriority = ROLE_PRIORITY[minimumRole] ?? 0;
    if (userPriority < requiredPriority) {
        throw new Error("Insufficient role for this action.");
    }
}

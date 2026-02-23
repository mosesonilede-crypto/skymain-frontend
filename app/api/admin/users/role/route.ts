import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";
import { normalizeRole } from "@/lib/auth/roles";

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

const SESSION_COOKIE = "sm_session";

/** All roles the Super Admin is allowed to assign. */
const ASSIGNABLE_ROLES = new Set([
    "admin",
    "technician",
    "supervisor",
    "maintenance_manager",
    "safety_qa",
    "fleet_manager",
    "maintenance_engineer",
    "user",
]);

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

/**
 * PATCH /api/admin/users/role
 *
 * Body: { userId: string; newRole: string }
 *
 * Updates the user's role in:
 *   1. Supabase Auth user_metadata.role + app_metadata.role
 *   2. user_profiles table (role column)
 *
 * Only accessible to super_admin.
 */
export async function PATCH(req: NextRequest) {
    // ── Auth gate ──────────────────────────────────────────────
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden — Super Admin access required" }, { status: 403 });
    }

    // ── Validate body ──────────────────────────────────────────
    let body: { userId?: string; newRole?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { userId, newRole } = body;

    if (!userId || typeof userId !== "string") {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!newRole || typeof newRole !== "string") {
        return NextResponse.json({ error: "newRole is required" }, { status: 400 });
    }

    const normalized = normalizeRole(newRole);

    if (!ASSIGNABLE_ROLES.has(normalized)) {
        return NextResponse.json(
            { error: `Invalid role "${newRole}". Allowed: ${[...ASSIGNABLE_ROLES].join(", ")}` },
            { status: 400 },
        );
    }

    // Never allow assigning super_admin through this endpoint
    if (normalized === "super_admin") {
        return NextResponse.json({ error: "Cannot assign super_admin role via this endpoint" }, { status: 403 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Supabase admin client is not configured" }, { status: 503 });
    }

    // ── Verify user exists ────────────────────────────────────
    const { data: targetUser, error: getUserError } = await supabaseServer.auth.admin.getUserById(userId);
    if (getUserError || !targetUser?.user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent downgrading another super_admin
    const currentRole = normalizeRole(
        (targetUser.user.user_metadata as Record<string, unknown>)?.role as string
        || (targetUser.user.app_metadata as Record<string, unknown>)?.role as string
    );
    if (currentRole === "super_admin") {
        return NextResponse.json(
            { error: "Cannot change the role of a Super Admin user" },
            { status: 403 },
        );
    }

    // ── 1. Update Supabase Auth metadata ──────────────────────
    const { error: updateAuthError } = await supabaseServer.auth.admin.updateUserById(userId, {
        user_metadata: {
            ...(targetUser.user.user_metadata || {}),
            role: normalized,
        },
        app_metadata: {
            ...(targetUser.user.app_metadata || {}),
            role: normalized,
        },
    });

    if (updateAuthError) {
        console.error("Failed to update auth metadata:", updateAuthError);
        return NextResponse.json(
            { error: "Failed to update user role in auth system", detail: updateAuthError.message },
            { status: 500 },
        );
    }

    // ── 2. Update user_profiles table ─────────────────────────
    try {
        // Try by user_id first
        const { data: profileById } = await supabaseServer
            .from("user_profiles")
            .select("user_id")
            .eq("user_id", userId)
            .maybeSingle();

        if (profileById) {
            const { error: profileError } = await supabaseServer
                .from("user_profiles")
                .update({ role: normalized, updated_at: new Date().toISOString() })
                .eq("user_id", userId);

            if (profileError) {
                console.warn("user_profiles update by user_id failed:", profileError);
            }
        } else {
            // Fall back to matching by email
            const email = targetUser.user.email;
            if (email) {
                const { error: profileError } = await supabaseServer
                    .from("user_profiles")
                    .update({ role: normalized, updated_at: new Date().toISOString() })
                    .eq("email", email);

                if (profileError) {
                    console.warn("user_profiles update by email failed:", profileError);
                }
            }
        }
    } catch (err) {
        // Profile update is best-effort; auth metadata is the source of truth
        console.warn("user_profiles update failed silently:", err);
    }

    return NextResponse.json({
        ok: true,
        userId,
        previousRole: currentRole,
        newRole: normalized,
        email: targetUser.user.email,
    });
}

/**
 * API Key Management — POST/GET/DELETE /api/v1/api-keys
 *
 * Admin-only endpoints to create, list, and revoke ingestion API keys.
 * Authenticated via session cookie (same as other admin routes).
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateApiKey, hashApiKey } from "@/lib/ingestion/auth";
import { verifyPayload } from "@/lib/twoFactor";

type SessionPayload = {
    email: string;
    role?: string;
    orgName?: string;
    org_name?: string;
    exp: number;
};

// ─── Helper: extract session from cookie ────────────────────────

function getSessionUser(request: NextRequest): {
    email: string;
    orgName: string;
    role: string;
} | null {
    try {
        const cookie = request.cookies.get("sm_session")?.value;
        if (!cookie) return null;

        const payload = verifyPayload<SessionPayload>(cookie);
        if (!payload) return null;
        if (payload.exp < Math.floor(Date.now() / 1000)) return null;

        return {
            email: payload.email || "",
            orgName: payload.orgName || payload.org_name || "",
            role: payload.role || "",
        };
    } catch {
        return null;
    }
}

function isAdmin(role: string): boolean {
    const adminRoles = ["super_admin", "admin", "org_admin", "superadmin"];
    return adminRoles.includes(role.toLowerCase());
}

// ─── POST: Create new API key ───────────────────────────────────

export async function POST(request: NextRequest) {
    const user = getSessionUser(request);
    if (!user || !isAdmin(user.role)) {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const sb = supabaseServer;
    if (!sb) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    let body: { label?: string; allowed_tables?: string[] };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const label = body.label?.trim();
    if (!label) {
        return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    const allowedTables = body.allowed_tables || [];

    // Generate key
    const plainKey = generateApiKey();
    const keyHash = await hashApiKey(plainKey);
    const keyPrefix = plainKey.substring(0, 16); // "sk_live_" + 8 hex

    const { data, error } = await sb.from("ingestion_api_keys").insert({
        org_name: user.orgName,
        label,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        allowed_tables: allowedTables,
        is_active: true,
        created_by: user.email,
    }).select("id, label, key_prefix, allowed_tables, created_at").single();

    if (error) {
        if (error.code === "23505") {
            return NextResponse.json(
                { error: `An API key with label "${label}" already exists` },
                { status: 409 }
            );
        }
        console.error("Failed to create API key:", error);
        return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
    }

    // Return the plain key ONCE — it cannot be retrieved again
    return NextResponse.json({
        ...data,
        key: plainKey,
        warning: "Save this key now. It will not be shown again.",
    }, { status: 201 });
}

// ─── GET: List API keys for the org ─────────────────────────────

export async function GET(request: NextRequest) {
    const user = getSessionUser(request);
    if (!user || !isAdmin(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sb = supabaseServer;
    if (!sb) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { data, error } = await sb
        .from("ingestion_api_keys")
        .select("id, label, key_prefix, allowed_tables, is_active, created_by, created_at, last_used_at, revoked_at")
        .eq("org_name", user.orgName)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to list API keys:", error);
        return NextResponse.json({ error: "Failed to list API keys" }, { status: 500 });
    }

    return NextResponse.json({ keys: data || [] });
}

// ─── DELETE: Revoke an API key ──────────────────────────────────

export async function DELETE(request: NextRequest) {
    const user = getSessionUser(request);
    if (!user || !isAdmin(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sb = supabaseServer;
    if (!sb) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    let body: { key_id?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body.key_id) {
        return NextResponse.json({ error: "key_id is required" }, { status: 400 });
    }

    const { error } = await sb
        .from("ingestion_api_keys")
        .update({ is_active: false, revoked_at: new Date().toISOString() })
        .eq("id", body.key_id)
        .eq("org_name", user.orgName); // org scoping prevents cross-tenant revocation

    if (error) {
        console.error("Failed to revoke API key:", error);
        return NextResponse.json({ error: "Failed to revoke API key" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "API key revoked" });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { verifyPayload } from "@/lib/twoFactor";
import { normalizeRole } from "@/lib/auth/roles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabaseAdmin() {
    if (!supabaseUrl || !supabaseServiceKey) {
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

const SESSION_COOKIE = "sm_session";

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

export type AccessCodeType = "regulator" | "partner" | "demo" | "trial" | "special";
export type UsageLimit = "single" | "multi" | "unlimited";
export type AccessCodeStatus = "active" | "expired" | "revoked" | "exhausted";

export type AccessCode = {
    id: string;
    code: string;
    type: AccessCodeType;
    recipient_name: string;
    recipient_email: string;
    recipient_org: string;
    purpose: string;
    created_at: string;
    expires_at: string;
    usage_limit: UsageLimit;
    usage_count: number;
    max_usage_count: number | null;
    status: AccessCodeStatus;
    created_by: string;
};

// Generate a cryptographically secure access code
function generateAccessCode(type: AccessCodeType): string {
    const prefix = {
        regulator: "REG",
        partner: "PTR",
        demo: "DMO",
        trial: "TRL",
        special: "SPL",
    }[type];

    const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase();
    return `${prefix}-${randomPart.slice(0, 4)}-${randomPart.slice(4, 8)}-${randomPart.slice(8)}`;
}

// GET: List all access codes
export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const { data: codes, error } = await supabase
            .from("access_codes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching access codes:", error);
            return NextResponse.json({ error: "Failed to fetch access codes" }, { status: 500 });
        }

        // Update expired codes
        const now = new Date();
        const updatedCodes = (codes || []).map((code) => {
            if (code.status === "active" && new Date(code.expires_at) < now) {
                return { ...code, status: "expired" };
            }
            if (code.status === "active" && code.max_usage_count && code.usage_count >= code.max_usage_count) {
                return { ...code, status: "exhausted" };
            }
            return code;
        });

        return NextResponse.json({ codes: updatedCodes });
    } catch (error) {
        console.error("Access codes fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST: Create new access code
export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const body = await req.json();
        const {
            type,
            recipientName,
            recipientEmail,
            recipientOrg,
            purpose,
            expiresInDays = 30,
            usageLimit = "single",
            maxUsageCount,
        } = body;

        // Validate required fields
        if (!type || !["regulator", "partner", "demo", "trial", "special"].includes(type)) {
            return NextResponse.json({ error: "Invalid code type" }, { status: 400 });
        }

        if (!recipientName?.trim()) {
            return NextResponse.json({ error: "Recipient name is required" }, { status: 400 });
        }

        if (!recipientEmail?.trim()) {
            return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
        }

        // Generate unique code
        const code = generateAccessCode(type);

        // Calculate expiration
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 30));

        const accessCodeRecord = {
            code,
            type,
            recipient_name: recipientName.trim(),
            recipient_email: recipientEmail.trim(),
            recipient_org: recipientOrg?.trim() || "",
            purpose: purpose?.trim() || "",
            expires_at: expiresAt.toISOString(),
            usage_limit: usageLimit,
            usage_count: 0,
            max_usage_count: usageLimit === "unlimited" ? null : (maxUsageCount || (usageLimit === "single" ? 1 : 10)),
            status: "active",
            created_by: session.email,
        };

        const { data, error } = await supabase
            .from("access_codes")
            .insert(accessCodeRecord)
            .select()
            .single();

        if (error) {
            console.error("Error creating access code:", error);
            return NextResponse.json({ error: "Failed to create access code" }, { status: 500 });
        }

        return NextResponse.json({ code: data, message: "Access code created successfully" });
    } catch (error) {
        console.error("Access code creation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH: Update access code (revoke, etc.)
export async function PATCH(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const body = await req.json();
        const { id, action } = body;

        if (!id) {
            return NextResponse.json({ error: "Code ID is required" }, { status: 400 });
        }

        if (action === "revoke") {
            const { error } = await supabase
                .from("access_codes")
                .update({ status: "revoked" })
                .eq("id", id);

            if (error) {
                console.error("Error revoking access code:", error);
                return NextResponse.json({ error: "Failed to revoke access code" }, { status: 500 });
            }

            return NextResponse.json({ message: "Access code revoked successfully" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Access code update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE: Delete access code
export async function DELETE(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Code ID is required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("access_codes")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting access code:", error);
            return NextResponse.json({ error: "Failed to delete access code" }, { status: 500 });
        }

        return NextResponse.json({ message: "Access code deleted successfully" });
    } catch (error) {
        console.error("Access code deletion error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

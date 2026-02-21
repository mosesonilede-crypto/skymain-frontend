import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

type ProfileFields = {
    full_name: string;
    email: string;
    phone: string;
    country: string;
    org_name: string;
    role: string;
    avatar_url: string;
};

function getSessionPayload(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

function defaultProfile(email: string, role?: string, orgName?: string): ProfileFields {
    return {
        full_name: "",
        email,
        phone: "",
        country: "",
        org_name: orgName || "",
        role: role || "user",
        avatar_url: "",
    };
}

// GET - Fetch user profile
export async function GET(req: NextRequest) {
    const session = getSessionPayload(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If Supabase is not configured, return defaults from session
    if (!supabaseServer) {
        return NextResponse.json(defaultProfile(session.email, session.role, session.orgName));
    }

    try {
        const { data, error } = await supabaseServer
            .from("user_profiles")
            .select("full_name, email, phone, country, org_name, role, avatar_url")
            .eq("email", session.email)
            .single();

        if (error || !data) {
            return NextResponse.json(defaultProfile(session.email, session.role, session.orgName));
        }

        return NextResponse.json(data);
    } catch (e) {
        console.error("Profile fetch error:", e);
        return NextResponse.json(defaultProfile(session.email, session.role, session.orgName));
    }
}

// PATCH - Update user profile
export async function PATCH(req: NextRequest) {
    const session = getSessionPayload(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Only allow certain fields to be updated
    const allowedFields = ["full_name", "phone", "country", "avatar_url"];
    const updates: Record<string, string> = {};
    for (const key of allowedFields) {
        if (body[key] !== undefined) {
            updates[key] = body[key];
        }
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // If Supabase is not configured, accept the changes client-side only
    if (!supabaseServer) {
        return NextResponse.json({
            ...defaultProfile(session.email, session.role, session.orgName),
            ...updates,
        });
    }

    try {
        // First try update
        const { data: updated, error: updateError } = await supabaseServer
            .from("user_profiles")
            .update(updates)
            .eq("email", session.email)
            .select("full_name, email, phone, country, org_name, role, avatar_url")
            .single();

        if (!updateError && updated) {
            return NextResponse.json(updated);
        }

        // If update failed (no existing row), try upsert with email as key
        console.warn("Profile update found no row, attempting upsert:", updateError?.message);
        const upsertData = {
            email: session.email,
            org_name: session.orgName || "",
            role: session.role || "user",
            ...updates,
        };

        const { data: upserted, error: upsertError } = await supabaseServer
            .from("user_profiles")
            .upsert(upsertData, { onConflict: "email" })
            .select("full_name, email, phone, country, org_name, role, avatar_url")
            .single();

        if (upsertError) {
            console.error("Profile upsert error:", upsertError);
            // Return the updates anyway so the UI stays responsive
            return NextResponse.json({
                ...defaultProfile(session.email, session.role, session.orgName),
                ...updates,
            });
        }

        return NextResponse.json(upserted);
    } catch (e) {
        console.error("Profile save error:", e);
        // Graceful fallback — return the updates so the client can still show them
        return NextResponse.json({
            ...defaultProfile(session.email, session.role, session.orgName),
            ...updates,
        });
    }
}

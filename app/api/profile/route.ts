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

function getSessionEmail(req: NextRequest): string | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.email;
}

// GET - Fetch user profile
export async function GET(req: NextRequest) {
    const email = getSessionEmail(req);
    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { data, error } = await supabaseServer
        .from("user_profiles")
        .select("full_name, email, phone, country, org_name, role, avatar_url")
        .eq("email", email)
        .single();

    if (error) {
        // If no profile row exists, return defaults from session
        return NextResponse.json({
            full_name: "",
            email,
            phone: "",
            country: "",
            org_name: "",
            role: "user",
            avatar_url: "",
        });
    }

    return NextResponse.json(data);
}

// PATCH - Update user profile
export async function PATCH(req: NextRequest) {
    const email = getSessionEmail(req);
    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
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

    const { data, error } = await supabaseServer
        .from("user_profiles")
        .update(updates)
        .eq("email", email)
        .select("full_name, email, phone, country, org_name, role, avatar_url")
        .single();

    if (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json(data);
}

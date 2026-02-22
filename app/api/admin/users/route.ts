import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";
import { normalizeRole } from "@/lib/auth/roles";
import { getEntitlementsForTier, normalizeTier } from "@/lib/entitlements";

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

type BillingPlanResponse = {
    currentPlanLabel?: string;
};

type CreateAdminUserBody = {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
};

const SESSION_COOKIE = "sm_session";

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

async function resolveMaxTeamMembersLimit(request: NextRequest): Promise<number | null> {
    try {
        const billingUrl = new URL("/api/billing", request.url);
        const response = await fetch(billingUrl.toString(), {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: AbortSignal.timeout(6000),
        });

        if (!response.ok) return null;

        const payload = (await response.json()) as BillingPlanResponse;
        const tier = normalizeTier(payload.currentPlanLabel);
        return getEntitlementsForTier(tier).limits.max_team_members;
    } catch {
        return null;
    }
}

async function getCurrentTeamMemberCount(): Promise<number | null> {
    if (!supabaseServer) return null;

    try {
        const perPage = 200;
        const maxPages = 50;
        let count = 0;

        for (let page = 1; page <= maxPages; page += 1) {
            const { data, error } = await supabaseServer.auth.admin.listUsers({ page, perPage });
            if (error) return null;
            const users = data?.users || [];
            count += users.length;
            if (users.length < perPage) break;
        }

        return count;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    const session = getSession(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const normalizedRole = normalizeRole(session.role);
    if (normalizedRole !== "admin" && normalizedRole !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Supabase admin client is not configured" }, { status: 503 });
    }

    const maxTeamMembers = await resolveMaxTeamMembersLimit(request);
    if (typeof maxTeamMembers === "number") {
        const currentCount = await getCurrentTeamMemberCount();
        if (typeof currentCount === "number" && currentCount >= maxTeamMembers) {
            return NextResponse.json(
                {
                    error: `Team member limit reached for current plan (${currentCount}/${maxTeamMembers}). Upgrade to add more users.`,
                    code: "TEAM_MEMBER_LIMIT_REACHED",
                    currentCount,
                    maxTeamMembers,
                },
                { status: 403 }
            );
        }
    }

    let body: CreateAdminUserBody;
    try {
        body = (await request.json()) as CreateAdminUserBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const role = (body.role || "Viewer").trim();
    const userStatus = (body.status || "Active").trim();

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    try {
        const { data, error } = await supabaseServer.auth.admin.inviteUserByEmail(email, {
            data: {
                full_name: name,
                role,
                status: userStatus,
                org_name: session.orgName,
            },
        });

        if (error) {
            const message = (error.message || "").toLowerCase();
            if (message.includes("already") || message.includes("exists") || message.includes("registered")) {
                return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
            }
            return NextResponse.json({ error: error.message || "Failed to add user" }, { status: 400 });
        }

        return NextResponse.json(
            {
                user: {
                    id: data.user?.id || null,
                    name,
                    email,
                    role,
                    status: userStatus,
                },
            },
            { status: 201 }
        );
    } catch (caught) {
        return NextResponse.json(
            { error: caught instanceof Error ? caught.message : "Failed to add user" },
            { status: 500 }
        );
    }
}

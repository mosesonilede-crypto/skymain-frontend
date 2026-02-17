import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { sendWelcomeEmail, type WelcomeEmailData } from "@/lib/email";

export const runtime = "nodejs";

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

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            subscriptionType = "trial",
            name,
            trialExpiresAt,
        } = body as {
            subscriptionType?: "trial" | "starter" | "professional" | "enterprise";
            name?: string;
            trialExpiresAt?: string;
        };

        // Calculate trial expiry if not provided
        const expiresAt = trialExpiresAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

        const emailData: WelcomeEmailData = {
            email: session.email,
            name: name || undefined,
            orgName: session.orgName,
            subscriptionType,
            trialExpiresAt: subscriptionType === "trial" ? expiresAt : undefined,
        };

        const result = await sendWelcomeEmail(emailData);

        if (!result.success) {
            console.error("Failed to send welcome email:", result.error);
            return NextResponse.json({
                ok: false,
                error: result.error || "Failed to send welcome email"
            }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Welcome email error:", error);
        return NextResponse.json({
            ok: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyPayload, verifyTotp } from "@/lib/twoFactor";

export const runtime = "nodejs";

const COOKIE_NAME = "sm2fa";

type VerifyBody = {
    method: "email" | "sms" | "auth";
    code: string;
    destination?: string;
};

export async function POST(req: NextRequest) {
    const body = (await req.json()) as VerifyBody;

    if (!body?.method || !body?.code) {
        return NextResponse.json({ ok: false, error: "Missing method or code." }, { status: 400 });
    }

    const mode = (process.env.NEXT_PUBLIC_DATA_MODE ?? "live").toLowerCase();
    const allowMock = process.env.NODE_ENV !== "production" && (mode === "mock" || mode === "hybrid");
    const mockCode = (process.env.NEXT_PUBLIC_MOCK_2FA_CODE || "").trim();

    if (allowMock && mockCode && body.code === mockCode) {
        return NextResponse.json({ ok: true, mockCode });
    }

    if (body.method === "auth") {
        const authToken = req.cookies.get("sm2fa_totp")?.value;
        if (!authToken) {
            return NextResponse.json({ ok: false, error: "Authenticator not enrolled." }, { status: 400 });
        }
        const payload = verifyPayload<{ secret: string }>(authToken);
        if (!payload?.secret) {
            return NextResponse.json({ ok: false, error: "Authenticator token invalid." }, { status: 400 });
        }
        const ok = verifyTotp(payload.secret, body.code);
        return NextResponse.json({ ok });
    }

    // Use NextRequest.cookies for better cookie handling
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        console.warn("2FA verify: No sm2fa cookie found", {
            cookies: req.cookies.getAll().map(c => c.name),
            destination: body.destination
        });
        return NextResponse.json({ ok: false, error: "Verification code expired. Please request a new code." }, { status: 400 });
    }

    const payload = verifyPayload<{ method: string; destination: string; code: string; expires: number }>(token);
    if (!payload) {
        console.warn("2FA verify: Token verification failed");
        return NextResponse.json({ ok: false, error: "Verification token invalid. Please request a new code." }, { status: 400 });
    }

    if (payload.method !== body.method) {
        return NextResponse.json({ ok: false, error: "Verification method mismatch." }, { status: 400 });
    }

    if (payload.expires < Math.floor(Date.now() / 1000)) {
        return NextResponse.json({ ok: false, error: "Verification code expired. Please request a new code." }, { status: 400 });
    }

    // Normalize codes for comparison (remove any whitespace)
    const storedCode = String(payload.code).trim();
    const enteredCode = String(body.code).trim();

    if (storedCode !== enteredCode) {
        console.warn("2FA verify: Code mismatch", {
            expected: storedCode.slice(0, 2) + "****",
            received: enteredCode.slice(0, 2) + "****",
            destination: body.destination
        });
        return NextResponse.json({ ok: false, error: "Invalid verification code. Please check the code and try again." }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.delete(COOKIE_NAME);
    return response;
}

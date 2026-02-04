import { NextResponse } from "next/server";
import { verifyPayload, verifyTotp } from "@/lib/twoFactor";

export const runtime = "nodejs";

const COOKIE_NAME = "sm2fa";
const AUTH_COOKIE = "sm2fa_totp";

type VerifyBody = {
    method: "email" | "sms" | "auth";
    code: string;
    destination?: string;
};

export async function POST(req: Request) {
    const body = (await req.json()) as VerifyBody;

    if (!body?.method || !body?.code) {
        return NextResponse.json({ ok: false, error: "Missing method or code." }, { status: 400 });
    }

    const mode = (process.env.NEXT_PUBLIC_DATA_MODE ?? "mock").toLowerCase();
    const allowMock = mode === "mock" || mode === "hybrid";
    const mockCode = (process.env.NEXT_PUBLIC_MOCK_2FA_CODE || "123456").trim();

    if (allowMock && mockCode && body.code === mockCode) {
        return NextResponse.json({ ok: true, mockCode });
    }

    if (body.method === "auth") {
        const authToken = req.headers.get("cookie")?.match(/sm2fa_totp=([^;]+)/)?.[1];
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

    const token = req.headers.get("cookie")?.match(/sm2fa=([^;]+)/)?.[1];
    if (!token) {
        return NextResponse.json({ ok: false, error: "Verification code expired." }, { status: 400 });
    }

    const payload = verifyPayload<{ method: string; destination: string; code: string; expires: number }>(token);
    if (!payload) {
        return NextResponse.json({ ok: false, error: "Verification token invalid." }, { status: 400 });
    }

    if (payload.method !== body.method) {
        return NextResponse.json({ ok: false, error: "Verification method mismatch." }, { status: 400 });
    }

    if (payload.expires < Math.floor(Date.now() / 1000)) {
        return NextResponse.json({ ok: false, error: "Verification code expired." }, { status: 400 });
    }

    if (payload.code !== body.code) {
        return NextResponse.json({ ok: false, error: "Invalid verification code." }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.delete(COOKIE_NAME);
    return response;
}

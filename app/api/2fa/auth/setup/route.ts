import { NextResponse } from "next/server";
import { generateBase32Secret, signPayload } from "@/lib/twoFactor";

export const runtime = "nodejs";

const AUTH_COOKIE = "sm2fa_totp";

export async function POST() {
    const secret = generateBase32Secret();
    const issuer = "SkyMaintain";
    const label = encodeURIComponent("SkyMaintain");
    const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

    const token = signPayload({ secret });
    const response = NextResponse.json({ ok: true, secret, otpauth });
    response.cookies.set({
        name: AUTH_COOKIE,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });
    return response;
}

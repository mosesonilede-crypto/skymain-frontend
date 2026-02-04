import { NextResponse } from "next/server";
import { generateOtp, getOtpExpiry, signPayload } from "@/lib/twoFactor";

export const runtime = "nodejs";

const COOKIE_NAME = "sm2fa";

type SendBody = {
    method: "email" | "sms";
    destination: string;
};

function isConfigured(method: "email" | "sms") {
    if (method === "email") {
        return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM);
    }
    return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM);
}

async function sendEmail(code: string, destination: string) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;

    if (!host || !from) return;

    const { createTransport } = await import("nodemailer");
    const transport = createTransport({
        host,
        port,
        secure: port === 465,
        auth: user && pass ? { user, pass } : undefined,
    });

    await transport.sendMail({
        from,
        to: destination,
        subject: "Your SkyMaintain verification code",
        text: `Your SkyMaintain verification code is ${code}. It expires in 5 minutes.`,
    });
}

async function sendSms(code: string, destination: string) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;

    if (!sid || !token || !from) return;

    const body = new URLSearchParams({
        From: from,
        To: destination,
        Body: `Your SkyMaintain verification code is ${code}. It expires in 5 minutes.`,
    });

    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || "Failed to send SMS.");
    }
}

export async function POST(req: Request) {
    const body = (await req.json()) as SendBody;

    if (!body?.destination || !body?.method) {
        return NextResponse.json({ ok: false, error: "Missing destination or method." }, { status: 400 });
    }

    const code = generateOtp();
    const expires = getOtpExpiry();
    const token = signPayload({ method: body.method, destination: body.destination, code, expires });

    const mode = (process.env.NEXT_PUBLIC_DATA_MODE ?? "mock").toLowerCase();
    const allowMockFallback = mode === "mock" || mode === "hybrid";
    let usedMock = false;

    if (!isConfigured(body.method)) {
        if (!allowMockFallback) {
            return NextResponse.json({ ok: false, error: "2FA provider not configured." }, { status: 500 });
        }
        usedMock = true;
    }

    if (!usedMock) {
        try {
            if (body.method === "email") {
                await sendEmail(code, body.destination);
            } else {
                await sendSms(code, body.destination);
            }
        } catch (error) {
            if (allowMockFallback) {
                usedMock = true;
            } else {
                return NextResponse.json(
                    { ok: false, error: error instanceof Error ? error.message : "Unable to send code." },
                    { status: 500 }
                );
            }
        }
    }

    const response = NextResponse.json({ ok: true, mockCode: usedMock ? code : undefined });
    response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 300,
        path: "/",
    });
    return response;
}

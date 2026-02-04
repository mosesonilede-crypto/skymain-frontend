import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const DEFAULT_SECRET = "dev-twofa-secret";
const TOKEN_TTL_SECONDS = 5 * 60;

function getSecret() {
    const secret = process.env.TWO_FA_SECRET || DEFAULT_SECRET;
    if (process.env.NODE_ENV === "production" && secret === DEFAULT_SECRET) {
        throw new Error("TWO_FA_SECRET is not set.");
    }
    return secret;
}

function base64UrlEncode(input: Buffer) {
    return input
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function base64UrlDecode(input: string) {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (padded.length % 4)) % 4;
    return Buffer.from(padded + "=".repeat(padLength), "base64");
}

export function signPayload(payload: Record<string, unknown>) {
    const secret = getSecret();
    const body = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
    const sig = createHmac("sha256", secret).update(body).digest("base64");
    const sigUrl = sig.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    return `${body}.${sigUrl}`;
}

export function verifyPayload<T>(token: string): T | null {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const secret = getSecret();
    const expected = createHmac("sha256", secret).update(body).digest("base64");
    const expectedUrl = expected.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    const sigBuffer = Buffer.from(sig);
    const expectedBuffer = Buffer.from(expectedUrl);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;
    try {
        return JSON.parse(base64UrlDecode(body).toString("utf8")) as T;
    } catch {
        return null;
    }
}

export function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

export function getOtpExpiry(seconds = TOKEN_TTL_SECONDS) {
    return Math.floor(Date.now() / 1000) + seconds;
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateBase32Secret(bytes = 20) {
    const buffer = randomBytes(bytes);
    let bits = 0;
    let value = 0;
    let output = "";

    for (const byte of buffer) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }

    if (bits > 0) {
        output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
    }

    return output;
}

function base32ToBuffer(secret: string) {
    const cleaned = secret.replace(/=+$/g, "").toUpperCase();
    let bits = 0;
    let value = 0;
    const out: number[] = [];

    for (const char of cleaned) {
        const idx = BASE32_ALPHABET.indexOf(char);
        if (idx === -1) continue;
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
            out.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }

    return Buffer.from(out);
}

export function generateTotp(secret: string, window = 0, step = 30) {
    const counter = Math.floor(Date.now() / 1000 / step) + window;
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));
    const key = base32ToBuffer(secret);
    const hmac = createHmac("sha1", key).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0xf;
    const code = ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);
    return String(code % 1000000).padStart(6, "0");
}

export function verifyTotp(secret: string, token: string) {
    if (!/^[0-9]{6}$/.test(token)) return false;
    for (const window of [-1, 0, 1]) {
        if (generateTotp(secret, window) === token) return true;
    }
    return false;
}

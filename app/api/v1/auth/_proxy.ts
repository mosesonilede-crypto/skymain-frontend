import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = process.env.SKYMAINTAIN_BACKEND_URL ?? "http://127.0.0.1:8000";

function buildHeaders(req: NextRequest, extra?: Record<string, string>): Headers {
    const headers = new Headers();

    const contentType = req.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);

    const cookie = req.headers.get("cookie");
    if (cookie) headers.set("cookie", cookie);

    const orgSlug = req.headers.get("x-org-slug");
    if (orgSlug) headers.set("x-org-slug", orgSlug);

    const requestId = req.headers.get("x-request-id");
    if (requestId) headers.set("x-request-id", requestId);

    headers.set("accept", "application/json");

    if (extra) {
        Object.entries(extra).forEach(([key, value]) => headers.set(key, value));
    }

    return headers;
}

function applyUpstreamHeaders(res: NextResponse, upstream: Response) {
    const contentType = upstream.headers.get("content-type");
    if (contentType) res.headers.set("content-type", contentType);

    const requestId = upstream.headers.get("x-request-id");
    if (requestId) res.headers.set("x-request-id", requestId);

    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) {
        if (setCookie.includes(",")) {
            const parts = setCookie.split(/,\s(?=[^;]+?=)/g);
            parts.forEach((cookie) => res.headers.append("set-cookie", cookie));
        } else {
            res.headers.set("set-cookie", setCookie);
        }
    }
}

export async function proxyToBackend(req: NextRequest, path: string, init?: RequestInit) {
    const url = `${BACKEND_BASE}${path}`;
    const upstream = await fetch(url, {
        method: init?.method ?? req.method,
        headers: buildHeaders(req),
        body: init?.body,
        redirect: "manual",
    });

    const body = await upstream.text();
    const res = new NextResponse(body, { status: upstream.status });
    applyUpstreamHeaders(res, upstream);
    return res;
}

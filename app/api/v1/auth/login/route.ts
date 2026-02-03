import { NextRequest } from "next/server";

import { proxyToBackend } from "../_proxy";

export async function POST(req: NextRequest) {
    const body = await req.text();
    return proxyToBackend(req, "/v1/auth/login", { method: "POST", body });
}

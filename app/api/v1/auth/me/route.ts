import { NextRequest } from "next/server";

import { proxyToBackend } from "../_proxy";

export async function GET(req: NextRequest) {
    return proxyToBackend(req, "/v1/auth/me", { method: "GET" });
}

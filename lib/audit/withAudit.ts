/**
 * Audit wrapper for API mutation routes.
 *
 * Wraps any POST/PATCH/PUT/DELETE handler to automatically record
 * an audit event before and/or after execution.
 *
 * Usage:
 *   import { withAudit } from "@/lib/audit/withAudit";
 *   export const POST = withAudit("aircraft_create", "aircraft", async (req) => { ... });
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { verifyPayload } from "@/lib/twoFactor";
import { recordAuditEvent } from "@/lib/audit/logger";

type SessionPayload = {
  email: string;
  orgName: string;
  role: string;
  exp: number;
};

const SESSION_COOKIE = "sm_session";

function extractSession(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyPayload<SessionPayload>(token);
  if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

export function withAudit(
  action: string,
  resourceType: string,
  handler: RouteHandler
): RouteHandler {
  return async (req: NextRequest) => {
    const session = extractSession(req);
    const startMs = Date.now();

    let response: NextResponse;
    let responseStatus: number;
    let errorMessage: string | undefined;

    try {
      response = await handler(req);
      responseStatus = response.status;
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : String(err);
      responseStatus = 500;
      throw err;
    } finally {
      const durationMs = Date.now() - startMs;

      recordAuditEvent({
        id: randomUUID(),
        occurredAt: new Date().toISOString(),
        actorId: session?.email || "anonymous",
        actorRole: session?.role || "unknown",
        orgId: session?.orgName,
        action,
        resourceType,
        metadata: {
          method: req.method,
          path: new URL(req.url).pathname,
          statusCode: responseStatus!,
          durationMs,
          ...(errorMessage ? { error: errorMessage } : {}),
        },
      }).catch((e) => console.error("Audit middleware error:", e));
    }

    return response!;
  };
}

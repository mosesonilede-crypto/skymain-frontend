/**
 * Webhook dispatcher.
 *
 * Sends events to registered webhook endpoints for an org.
 * Signs payloads with HMAC-SHA256 using each endpoint's secret.
 *
 * Usage:
 *   import { dispatchWebhookEvent } from "@/lib/webhooks";
 *   await dispatchWebhookEvent("acme-corp", "aircraft.created", { id: "123", ... });
 */

import { createHmac } from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";
import { logger } from "@/lib/logger";

export type WebhookEvent = {
  type: string;
  data: Record<string, unknown>;
  occurredAt?: string;
};

type Endpoint = {
  id: string;
  url: string;
  secret: string;
  events: string[];
};

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function dispatchWebhookEvent(
  orgName: string,
  eventType: string,
  data: Record<string, unknown>
): Promise<void> {
  if (!supabaseServer) return;

  // Fetch active endpoints for this org that subscribe to this event
  const { data: endpoints, error } = await supabaseServer
    .from("webhook_endpoints")
    .select("id, url, secret, events")
    .eq("org_name", orgName)
    .eq("enabled", true);

  if (error || !endpoints?.length) return;

  const matching = (endpoints as Endpoint[]).filter(
    (ep) => ep.events.includes("*") || ep.events.includes(eventType)
  );

  if (!matching.length) return;

  const payload = JSON.stringify({
    type: eventType,
    data,
    occurred_at: new Date().toISOString(),
  });

  const deliveries = matching.map(async (ep) => {
    const signature = signPayload(payload, ep.secret);
    let responseStatus = 0;
    let responseBody = "";
    let success = false;

    try {
      const res = await fetch(ep.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SkyMaintain-Signature": `sha256=${signature}`,
          "X-SkyMaintain-Event": eventType,
        },
        body: payload,
        signal: AbortSignal.timeout(10_000),
      });
      responseStatus = res.status;
      responseBody = (await res.text()).slice(0, 1000);
      success = res.ok;
    } catch (err) {
      responseBody = err instanceof Error ? err.message : "Unknown error";
    }

    // Record delivery attempt
    await supabaseServer!
      .from("webhook_deliveries")
      .insert({
        endpoint_id: ep.id,
        event_type: eventType,
        payload: JSON.parse(payload),
        response_status: responseStatus,
        response_body: responseBody,
        success,
      })
      .then(({ error: insertErr }) => {
        if (insertErr) logger.error("Webhook delivery log failed", { error: insertErr.message });
      });

    if (!success) {
      logger.warn("Webhook delivery failed", {
        endpointId: ep.id,
        url: ep.url,
        eventType,
        status: responseStatus,
      });
    }
  });

  await Promise.allSettled(deliveries);
}

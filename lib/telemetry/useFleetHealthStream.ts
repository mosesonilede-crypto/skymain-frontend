/**
 * useFleetHealthStream — React hook for consuming fleet-health SSE.
 *
 * Opens an EventSource connection to /api/fleet-health/stream and
 * exposes the latest snapshot plus connection status.
 *
 * Usage:
 *   const { data, status, error } = useFleetHealthStream();
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface FleetHealthSnapshot {
    fleetHealthScore: number;
    totalAircraft: number;
    availableAircraft: number;
    overdueMaintenanceCount: number;
    openWorkOrders: number;
    urgentWorkOrders: number;
    alertsLast24h: number;
    aiDecisionsLast7d: number;
    timestamp: string;
}

export type StreamStatus = "connecting" | "open" | "closed" | "error";

export interface UseFleetHealthStreamReturn {
    data: FleetHealthSnapshot | null;
    status: StreamStatus;
    error: string | null;
    reconnect: () => void;
}

const ENDPOINT = "/api/fleet-health/stream";
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 2_000;

export function useFleetHealthStream(): UseFleetHealthStreamReturn {
    const [data, setData] = useState<FleetHealthSnapshot | null>(null);
    const [status, setStatus] = useState<StreamStatus>("connecting");
    const [error, setError] = useState<string | null>(null);
    const retriesRef = useRef(0);
    const esRef = useRef<EventSource | null>(null);
    const reconnectTriggerRef = useRef(0);
    const [reconnectTrigger, setReconnectTrigger] = useState(0);

    // The effect subscribes to an external system (EventSource).
    // All setState calls happen inside external-system callbacks
    // (onopen, onmessage, onerror), not synchronously in the effect body.
    useEffect(() => {
        esRef.current?.close();

        const es = new EventSource(ENDPOINT);
        esRef.current = es;

        es.addEventListener("fleet-health", (e: MessageEvent) => {
            try {
                const parsed = JSON.parse(e.data) as FleetHealthSnapshot;
                setData(parsed);
                setStatus("open");
                retriesRef.current = 0;
            } catch {
                setError("Failed to parse fleet health data");
            }
        });

        es.addEventListener("error", (e: MessageEvent) => {
            try {
                const parsed = JSON.parse(e.data);
                setError(parsed.message ?? "Stream error");
            } catch {
                // native EventSource error (connection lost)
            }
        });

        es.onerror = () => {
            es.close();
            if (retriesRef.current < MAX_RETRIES) {
                const delay = BASE_BACKOFF_MS * 2 ** retriesRef.current;
                retriesRef.current++;
                setStatus("connecting");
                setTimeout(() => {
                    reconnectTriggerRef.current++;
                    setReconnectTrigger(reconnectTriggerRef.current);
                }, delay);
            } else {
                setStatus("error");
                setError("Lost connection — max retries exceeded.");
            }
        };

        es.onopen = () => {
            setStatus("open");
        };

        return () => {
            es.close();
            setStatus("closed");
        };
    }, [reconnectTrigger]);

    const reconnect = useCallback(() => {
        retriesRef.current = 0;
        reconnectTriggerRef.current++;
        setReconnectTrigger(reconnectTriggerRef.current);
    }, []);

    return { data, status, error, reconnect };
}

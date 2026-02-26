import { describe, it, expect, vi, beforeEach } from "vitest";

/* ─── Mock supabaseServer so no real DB calls happen ─────────────── */
const mockFrom = vi.fn();
vi.mock("@/lib/supabaseServer", () => ({
    supabaseServer: {
        from: (...args: unknown[]) => mockFrom(...args),
    },
}));

import { ingestTelemetry, type TelemetryPayload } from "@/lib/telemetry/ingestionService";

describe("ingestionService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects entirely invalid payloads", async () => {
        const bad: TelemetryPayload[] = [
            { aircraftReg: "", source: "acms", readings: {} } as TelemetryPayload,
        ];

        const result = await ingestTelemetry("AcmeAir", bad);
        expect(result.success).toBe(false);
        expect(result.rowsInserted).toBe(0);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it("rejects payload with invalid source", async () => {
        const bad: TelemetryPayload[] = [
            {
                aircraftReg: "N12345",
                source: "invalid_source" as TelemetryPayload["source"],
                readings: { temp: 25 },
            },
        ];

        const result = await ingestTelemetry("AcmeAir", bad);
        expect(result.success).toBe(false);
        expect(result.errors.some((e) => e.includes("source"))).toBe(true);
    });

    it("rejects payload with empty readings object", async () => {
        const bad: TelemetryPayload[] = [
            { aircraftReg: "N12345", source: "acms", readings: {} },
        ];

        const result = await ingestTelemetry("AcmeAir", bad);
        expect(result.success).toBe(false);
        expect(result.errors.some((e) => e.includes("readings"))).toBe(true);
    });

    it("verifies aircraft ownership before inserting", async () => {
        // Mock ownership check: aircraft not found
        mockFrom.mockImplementation((table: string) => {
            if (table === "aircraft") {
                return {
                    select: () => ({
                        eq: () => ({
                            eq: () => ({
                                is: () => ({
                                    maybeSingle: () =>
                                        Promise.resolve({ data: null, error: null }),
                                }),
                            }),
                        }),
                    }),
                };
            }
            return {};
        });

        const payloads: TelemetryPayload[] = [
            {
                aircraftReg: "N99999",
                source: "iot_sensor",
                readings: { temp_c: 42 },
            },
        ];

        const result = await ingestTelemetry("AcmeAir", payloads);
        expect(result.success).toBe(false);
        expect(result.errors.some((e) => e.includes("not found"))).toBe(true);
    });

    it("inserts valid telemetry when ownership is confirmed", async () => {
        // Mock ownership check: aircraft found
        // Mock insert: success
        mockFrom.mockImplementation((table: string) => {
            if (table === "aircraft") {
                return {
                    select: () => ({
                        eq: () => ({
                            eq: () => ({
                                is: () => ({
                                    maybeSingle: () =>
                                        Promise.resolve({
                                            data: { id: "uuid-1" },
                                            error: null,
                                        }),
                                }),
                            }),
                        }),
                    }),
                };
            }
            if (table === "telemetry_readings") {
                return {
                    insert: () => Promise.resolve({ error: null }),
                };
            }
            return {};
        });

        const payloads: TelemetryPayload[] = [
            {
                aircraftReg: "N12345",
                source: "acms",
                readings: { engine_egt_c: 650, oil_pressure_psi: 72 },
                label: "cruise snapshot",
            },
        ];

        const result = await ingestTelemetry("AcmeAir", payloads);
        expect(result.success).toBe(true);
        expect(result.rowsInserted).toBe(1);
        expect(result.errors).toHaveLength(0);
    });

    it("handles partial failures in a batch", async () => {
        mockFrom.mockImplementation((table: string) => {
            if (table === "aircraft") {
                return {
                    select: () => ({
                        eq: () => ({
                            eq: () => ({
                                is: () => ({
                                    maybeSingle: (/* no args */) =>
                                        Promise.resolve({
                                            data: { id: "uuid-1" },
                                            error: null,
                                        }),
                                }),
                            }),
                        }),
                    }),
                };
            }
            if (table === "telemetry_readings") {
                return {
                    insert: () => Promise.resolve({ error: null }),
                };
            }
            return {};
        });

        const payloads: TelemetryPayload[] = [
            // valid
            { aircraftReg: "N12345", source: "acms", readings: { temp: 25 } },
            // invalid — missing aircraftReg
            { aircraftReg: "", source: "acms", readings: { temp: 30 } },
        ];

        const result = await ingestTelemetry("AcmeAir", payloads);
        expect(result.success).toBe(true);
        expect(result.rowsInserted).toBe(1);
        expect(result.errors.length).toBe(1); // one bad payload
    });
});

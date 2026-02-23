"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
    Aircraft,
    fetchAircraftList,
    addAircraft as addAircraftApi,
    updateAircraft as updateAircraftApi,
    deleteAircraft as deleteAircraftApi,
} from "./dataService";
import { supabase } from "./supabaseClient";

// Re-export Aircraft type for backwards compatibility
export type { Aircraft } from "./dataService";

interface AircraftContextType {
    // Core state
    selectedAircraft: Aircraft | null;
    setSelectedAircraft: (aircraft: Aircraft) => void;
    allAircraft: Aircraft[];

    // Data source info
    dataSource: "live" | "mock";
    isLoading: boolean;
    error: string | null;

    // CRUD operations (for live data management)
    refreshAircraft: () => Promise<void>;
    addAircraft: (aircraft: Omit<Aircraft, "id">) => Promise<{ success: boolean; error?: string }>;
    updateAircraft: (registration: string, updates: Partial<Aircraft>) => Promise<{ success: boolean; error?: string }>;
    deleteAircraft: (registration: string) => Promise<{ success: boolean; error?: string }>;
}

const AircraftContext = createContext<AircraftContextType | undefined>(undefined);

function getInitialAircraft(aircraftList: Aircraft[]): Aircraft | null {
    if (typeof window === "undefined") {
        return aircraftList[0] || null;
    }
    const stored = localStorage.getItem("SELECTED_AIRCRAFT");
    if (stored) {
        try {
            const storedAircraft = JSON.parse(stored) as Aircraft;
            // Verify the stored aircraft still exists in the list
            const exists = aircraftList.find(a => a.registration === storedAircraft.registration);
            if (exists) {
                return exists; // Return the fresh version from list
            }
        } catch {
            // Fall through to default
        }
    }
    return aircraftList[0] || null;
}

export function AircraftProvider({ children }: { children: ReactNode }) {
    const [allAircraft, setAllAircraft] = useState<Aircraft[]>([]);
    const [selectedAircraft, setSelectedAircraftState] = useState<Aircraft | null>(
        () => getInitialAircraft([])
    );
    const [dataSource, setDataSource] = useState<"live" | "mock">("live");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Direct Supabase fallback — reads from the aircraft table using the browser
    // client when the API route returns no results (handles missing service-role key,
    // column-name mismatches, or other server-side issues).
    const fetchAircraftDirectFromSupabase = useCallback(async (): Promise<Aircraft[]> => {
        if (!supabase) return [];
        try {
            const { data, error } = await supabase
                .from("aircraft")
                .select("*");

            if (error || !data) return [];

            return data.map((row: Record<string, unknown>) => ({
                id: String(row.id ?? ""),
                registration: String(row.registration_number ?? ""),
                model: `${row.manufacturer || ""} ${row.model || ""}`.trim(),
                manufacturer: row.manufacturer ? String(row.manufacturer) : undefined,
                serialNumber: row.serial_number ? String(row.serial_number) : undefined,
                yearOfManufacture: typeof row.year_of_manufacture === "number" ? row.year_of_manufacture : undefined,
                operator: row.operator ? String(row.operator) : undefined,
                baseLocation: row.current_location ? String(row.current_location) : undefined,
                totalFlightHours: typeof row.total_flight_hours === "number" ? row.total_flight_hours : undefined,
                totalCycles: typeof row.cycle_count === "number" ? row.cycle_count : undefined,
                status: (row.status as Aircraft["status"]) ?? undefined,
            }));
        } catch {
            return [];
        }
    }, []);

    // Fetch aircraft list on mount
    const refreshAircraft = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            let aircraftList: Aircraft[] = [];
            let source: "live" | "mock" = "live";

            // 1. Try the API route first
            try {
                const result = await fetchAircraftList();
                aircraftList = result.aircraft;
                source = result.source;
            } catch (apiErr) {
                console.warn("API aircraft fetch failed, trying direct Supabase:", apiErr);
            }

            // 2. If API returned empty results, fall back to direct Supabase read
            if (aircraftList.length === 0) {
                const directAircraft = await fetchAircraftDirectFromSupabase();
                if (directAircraft.length > 0) {
                    aircraftList = directAircraft;
                    source = "live";
                }
            }

            setAllAircraft(aircraftList);
            setDataSource(source);

            // If current selection is no longer valid, select first aircraft
            const currentValid = aircraftList.find(
                a => a.registration === selectedAircraft?.registration
            );
            if (!currentValid && aircraftList.length > 0) {
                setSelectedAircraftState(aircraftList[0]);
                localStorage.setItem("SELECTED_AIRCRAFT", JSON.stringify(aircraftList[0]));
            }
        } catch (err) {
            console.error("Failed to fetch aircraft:", err);
            setError(err instanceof Error ? err.message : "Failed to load aircraft");
            setAllAircraft([]);
            setDataSource("live");
        } finally {
            setIsLoading(false);
        }
    }, [selectedAircraft?.registration, fetchAircraftDirectFromSupabase]);

    // Initialize on mount
    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            refreshAircraft();
        }
    }, [initialized, refreshAircraft]);

    // Set selected aircraft with persistence
    const setSelectedAircraft = useCallback((aircraft: Aircraft) => {
        setSelectedAircraftState(aircraft);
        localStorage.setItem("SELECTED_AIRCRAFT", JSON.stringify(aircraft));
    }, []);

    // Add aircraft
    const addAircraft = useCallback(async (aircraft: Omit<Aircraft, "id">) => {
        const result = await addAircraftApi(aircraft);
        if (result.success && result.aircraft) {
            // Refresh list to get updated data
            await refreshAircraft();
        }
        return { success: result.success, error: result.error };
    }, [refreshAircraft]);

    // Update aircraft
    const updateAircraft = useCallback(async (registration: string, updates: Partial<Aircraft>) => {
        const result = await updateAircraftApi(registration, updates);
        if (result.success) {
            await refreshAircraft();
        }
        return result;
    }, [refreshAircraft]);

    // Delete aircraft
    const deleteAircraft = useCallback(async (registration: string) => {
        const result = await deleteAircraftApi(registration);
        if (result.success) {
            await refreshAircraft();
        }
        return result;
    }, [refreshAircraft]);

    return (
        <AircraftContext.Provider
            value={{
                selectedAircraft,
                setSelectedAircraft,
                allAircraft,
                dataSource,
                isLoading,
                error,
                refreshAircraft,
                addAircraft,
                updateAircraft,
                deleteAircraft,
            }}
        >
            {children}
        </AircraftContext.Provider>
    );
}

export function useAircraft() {
    const context = useContext(AircraftContext);
    if (context === undefined) {
        throw new Error("useAircraft must be used within AircraftProvider");
    }
    return context;
}

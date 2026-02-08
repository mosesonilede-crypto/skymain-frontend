"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
    Aircraft,
    DEFAULT_MOCK_AIRCRAFT,
    fetchAircraftList,
    addAircraft as addAircraftApi,
    updateAircraft as updateAircraftApi,
    deleteAircraft as deleteAircraftApi,
    getDataMode,
} from "./dataService";

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

function getInitialAircraft(aircraftList: Aircraft[]): Aircraft {
    if (typeof window === "undefined") {
        return aircraftList[0] || DEFAULT_MOCK_AIRCRAFT[0];
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
    return aircraftList[0] || DEFAULT_MOCK_AIRCRAFT[0];
}

export function AircraftProvider({ children }: { children: ReactNode }) {
    const [allAircraft, setAllAircraft] = useState<Aircraft[]>(DEFAULT_MOCK_AIRCRAFT);
    const [selectedAircraft, setSelectedAircraftState] = useState<Aircraft>(
        () => getInitialAircraft(DEFAULT_MOCK_AIRCRAFT)
    );
    const [dataSource, setDataSource] = useState<"live" | "mock">("mock");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Fetch aircraft list on mount
    const refreshAircraft = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchAircraftList();
            setAllAircraft(result.aircraft);
            setDataSource(result.source);

            // If current selection is no longer valid, select first aircraft
            const currentValid = result.aircraft.find(
                a => a.registration === selectedAircraft?.registration
            );
            if (!currentValid && result.aircraft.length > 0) {
                setSelectedAircraftState(result.aircraft[0]);
                localStorage.setItem("SELECTED_AIRCRAFT", JSON.stringify(result.aircraft[0]));
            }
        } catch (err) {
            console.error("Failed to fetch aircraft:", err);
            setError(err instanceof Error ? err.message : "Failed to load aircraft");
            // Keep using mock data on error
            setAllAircraft(DEFAULT_MOCK_AIRCRAFT);
            setDataSource("mock");
        } finally {
            setIsLoading(false);
        }
    }, [selectedAircraft?.registration]);

    // Initialize on mount
    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            // Only fetch from API if not in pure mock mode
            const mode = getDataMode();
            if (mode !== "mock") {
                refreshAircraft();
            }
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

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Aircraft {
    id: string;
    registration: string;
    model: string;
    lastService?: string;
}

interface AircraftContextType {
    selectedAircraft: Aircraft | null;
    setSelectedAircraft: (aircraft: Aircraft) => void;
    allAircraft: Aircraft[];
}

const AircraftContext = createContext<AircraftContextType | undefined>(undefined);

const DEFAULT_AIRCRAFT: Aircraft[] = [
    {
        id: "N872LM",
        registration: "N872LM",
        model: "Airbus A320",
        lastService: "2026-01-15",
    },
    {
        id: "N451KJ",
        registration: "N451KJ",
        model: "Boeing 737",
        lastService: "2026-01-20",
    },
    {
        id: "N789QW",
        registration: "N789QW",
        model: "Airbus A380",
        lastService: "2026-01-10",
    },
    {
        id: "N123XY",
        registration: "N123XY",
        model: "Boeing 777",
        lastService: "2026-01-22",
    },
];

function getInitialAircraft(): Aircraft {
    if (typeof window === "undefined") {
        return DEFAULT_AIRCRAFT[0];
    }
    const stored = localStorage.getItem("SELECTED_AIRCRAFT");
    if (stored) {
        try {
            return JSON.parse(stored) as Aircraft;
        } catch {
            return DEFAULT_AIRCRAFT[0];
        }
    }
    return DEFAULT_AIRCRAFT[0];
}

export function AircraftProvider({ children }: { children: ReactNode }) {
    const [selectedAircraft, setSelectedAircraftState] = useState<Aircraft>(
        () => getInitialAircraft()
    );

    const setSelectedAircraft = (aircraft: Aircraft) => {
        setSelectedAircraftState(aircraft);
        localStorage.setItem("SELECTED_AIRCRAFT", JSON.stringify(aircraft));
    };

    return (
        <AircraftContext.Provider
            value={{
                selectedAircraft,
                setSelectedAircraft,
                allAircraft: DEFAULT_AIRCRAFT,
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

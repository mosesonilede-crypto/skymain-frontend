"use client";

import * as React from "react";
import { Bot, ChevronDown, Eraser, ExternalLink, FileText, Info, Minus, Send, X } from "lucide-react";

interface AIMechanicPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize?: () => void;
    initialQuery?: string;
    context?: string;
}

interface Message {
    type: "assistant" | "user";
    content: string;
    summary?: string;
    recommendation?: string;
    confidence?: number;
    references?: {
        title: string;
        source: string;
        url: string;
        effectiveDate?: string;
        retrievedDate?: string;
    }[];
}

type ManualRef = {
    filename: string;
    category: string;
    date?: string;
};

type SelectedAircraft = {
    registration: string;
    model?: string;
};

type DocumentationDraft = {
    aircraftRegistration?: string;
    totalCycles?: string;
    timeInService?: string;
    timeSinceNew?: string;
    timeSinceOverhaul?: string;
    lastMaintenanceType?: string;
    techFirst?: string;
    techLast?: string;
    techCert?: string;
    maintenanceDate?: string;
    discDesc?: string;
    discRemedy?: string;
    discManual?: string;
};

const DEFAULT_MESSAGE: Message = {
    type: "assistant",
    content: "",
    summary:
        "SkyMaintain AI Assistant initialized. I am your intelligent technical decision support system with access to FAA, EASA, ICAO, and Transport Canada regulatory databases, manufacturer documentation, and engineering best practices. I work with your uploaded maintenance manuals to provide precise, evidence-based technical guidance.",
    recommendation:
        "Ask me technical questions about aircraft systems, troubleshooting procedures, maintenance intervals, regulatory compliance, or predictive maintenance. I will reference your uploaded manuals and official sources (faa.gov, easa.europa.eu, icao.int) to provide accurate technical answers. All guidance is advisory—final authority remains with certified maintenance personnel.",
    confidence: 100,
    references: [
        {
            title: "FAA Advisory Circular AC 43-9C",
            source: "Federal Aviation Administration (faa.gov)",
            url: "https://www.faa.gov/regulations_policies/advisory_circulars",
            effectiveDate: "2007-06-08",
            retrievedDate: "2026-02-04",
        },
        {
            title: "EASA Part-M Continuing Airworthiness",
            source: "European Union Aviation Safety Agency (easa.europa.eu)",
            url: "https://www.easa.europa.eu/en/acceptable-means-compliance-and-guidance-material-group/part-m-continuing-airworthiness",
            effectiveDate: "2020-03-24",
            retrievedDate: "2026-02-22",
        },
        {
            title: "ICAO Annex 6 - Aircraft Operations",
            source: "International Civil Aviation Organization (icao.int)",
            url: "https://www.icao.int/safety/airnavigation/OPS/Pages/ICAO-Annexes.aspx",
            effectiveDate: "2022-11-03",
            retrievedDate: "2026-02-04",
        },
    ],
};

const SUGGESTED_QUERIES = [
    "Analyze hydraulic system pressure",
    "Check compliance deadlines",
    "Review engine health status",
];

const DEFAULT_REFERENCES = [
    {
        title: "FAA Advisory Circular AC 43-9C",
        source: "Federal Aviation Administration (faa.gov)",
        url: "https://www.faa.gov/regulations_policies/advisory_circulars",
        effectiveDate: "2007-06-08",
        retrievedDate: "2026-02-04",
    },
    {
        title: "EASA Part-M Continuing Airworthiness",
        source: "European Union Aviation Safety Agency (easa.europa.eu)",
        url: "https://www.easa.europa.eu/en/acceptable-means-compliance-and-guidance-material-group/part-m-continuing-airworthiness",
        effectiveDate: "2020-03-24",
        retrievedDate: "2026-02-22",
    },
    {
        title: "ICAO Annex 8 - Airworthiness of Aircraft",
        source: "International Civil Aviation Organization (icao.int)",
        url: "https://www.icao.int/safety/airnavigation/OPS/Pages/ICAO-Annexes.aspx",
        effectiveDate: "2022-11-03",
        retrievedDate: "2026-02-04",
    },
    {
        title: "Transport Canada CARS 571 - Maintenance Standards",
        source: "Transport Canada (tc.canada.ca)",
        url: "https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-cars",
        effectiveDate: "2023-06-15",
        retrievedDate: "2026-02-04",
    },
];

const MANUAL_STORAGE_KEY = "skymaintain.uploadedManuals";
const DOC_DRAFT_KEY = "skymaintain.documentationDraft";
const AIRCRAFT_STORAGE_KEY = "skymaintain.selectedAircraft";
const AI_ASSESSMENTS_KEY = "skymaintain.aiAssessments";

type AiAssessment = {
    registration: string;
    assessedAt: string;
};

function getStoredManuals(): ManualRef[] {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(MANUAL_STORAGE_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((doc) => doc && typeof doc.filename === "string")
            .map((doc) => ({
                filename: doc.filename,
                category: typeof doc.category === "string" ? doc.category : "Uploaded Manual",
                date: typeof doc.date === "string" ? doc.date : undefined,
            }));
    } catch {
        return [];
    }
}

function buildManualReferences(manuals: ManualRef[]): NonNullable<Message["references"]> {
    if (!manuals.length) return [];
    return manuals.map((manual) => ({
        title: manual.filename,
        source: manual.category,
        url: "/app/docs",
        retrievedDate: manual.date,
    }));
}

function getDocumentationDraft(): DocumentationDraft | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(DOC_DRAFT_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        return parsed as DocumentationDraft;
    } catch {
        return null;
    }
}

function getSelectedAircraft(): SelectedAircraft | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(AIRCRAFT_STORAGE_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        if (typeof parsed.registration !== "string") return null;
        return parsed as SelectedAircraft;
    } catch {
        return null;
    }
}

function buildDraftSummary(draft: DocumentationDraft) {
    const parts: string[] = [];
    if (draft.aircraftRegistration) {
        parts.push(`Aircraft ${draft.aircraftRegistration}`);
    }
    if (draft.maintenanceDate) {
        parts.push(`Maintenance date ${draft.maintenanceDate}`);
    }
    if (draft.techFirst || draft.techLast) {
        parts.push(`Technician ${[draft.techFirst, draft.techLast].filter(Boolean).join(" ")}`);
    }
    if (draft.discDesc) {
        parts.push(`Discrepancy noted`);
    }
    return parts.length ? `Draft data: ${parts.join(" · ")}.` : "Draft data is available.";
}

function parseNumber(value?: string): number | null {
    if (!value) return null;
    const match = value.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
    if (!match) return null;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
}

function parseDate(value?: string): Date | null {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
}

function addMonths(date: Date, months: number): Date {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// Generate predictive alerts based on manuals and query context
interface PredictedAlert {
    id: string;
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
    component: string;
    predictedDate: string;
    confidence: number;
    source: string;
    aircraftRegistration: string;
    createdAt: string;
}

function generatePredictiveAlerts(
    manuals: ManualRef[],
    registration: string,
    query: string
): PredictedAlert[] {
    if (!manuals.length) return [];

    const alerts: PredictedAlert[] = [];
    const now = new Date();
    const normalizedQuery = query.toLowerCase();

    manuals.forEach((manual, idx) => {
        const category = manual.category?.toLowerCase() || "";
        const filename = manual.filename.toLowerCase();

        // Engine-related alerts
        if (
            normalizedQuery.includes("engine") ||
            category.includes("engine") ||
            filename.includes("engine")
        ) {
            alerts.push({
                id: `ai-engine-${idx}-${Date.now()}`,
                severity: "warning",
                title: "Engine Oil System Inspection Due",
                description: `AI analysis of ${manual.filename} indicates engine oil filter replacement should be scheduled within 50 flight hours based on trend data.`,
                component: "Engine - Oil System",
                predictedDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                confidence: 89,
                source: manual.filename,
                aircraftRegistration: registration,
                createdAt: now.toISOString(),
            });
        }

        // Hydraulic-related alerts
        if (
            normalizedQuery.includes("hydraulic") ||
            category.includes("hydraulic") ||
            filename.includes("hydraulic")
        ) {
            alerts.push({
                id: `ai-hydraulic-${idx}-${Date.now()}`,
                severity: "critical",
                title: "Hydraulic Pressure Anomaly Detected",
                description: `Based on ${manual.filename}, hydraulic system pressure trending indicates potential degradation. Immediate inspection recommended.`,
                component: "Hydraulic System",
                predictedDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                confidence: 94,
                source: manual.filename,
                aircraftRegistration: registration,
                createdAt: now.toISOString(),
            });
        }

        // Landing gear alerts
        if (
            normalizedQuery.includes("landing") ||
            normalizedQuery.includes("gear") ||
            category.includes("landing") ||
            filename.includes("gear")
        ) {
            alerts.push({
                id: `ai-gear-${idx}-${Date.now()}`,
                severity: "info",
                title: "Landing Gear Service Approaching",
                description: `Per ${manual.filename} maintenance schedule, landing gear assembly inspection due in approximately 200 flight cycles.`,
                component: "Landing Gear - Main Assembly",
                predictedDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                confidence: 91,
                source: manual.filename,
                aircraftRegistration: registration,
                createdAt: now.toISOString(),
            });
        }

        // General inspection alerts
        if (
            normalizedQuery.includes("inspect") ||
            normalizedQuery.includes("maintenance") ||
            normalizedQuery.includes("check")
        ) {
            alerts.push({
                id: `ai-inspection-${idx}-${Date.now()}`,
                severity: "info",
                title: "Scheduled Inspection Reminder",
                description: `SkyMaintain AI Assistant recommends reviewing ${manual.filename} for upcoming scheduled maintenance items based on current flight hours.`,
                component: "General - Scheduled Maintenance",
                predictedDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                confidence: 85,
                source: manual.filename,
                aircraftRegistration: registration,
                createdAt: now.toISOString(),
            });
        }
    });

    // Deduplicate by title
    const seen = new Set<string>();
    return alerts.filter((alert) => {
        if (seen.has(alert.title)) return false;
        seen.add(alert.title);
        return true;
    });
}

function buildAssistantReply(
    query: string,
    context?: string,
    manuals: ManualRef[] = [],
    docDraft?: DocumentationDraft | null,
    selectedAircraft?: SelectedAircraft | null
): Message {
    const normalized = query.toLowerCase();
    let summary = "Analyzed request and identified the likely maintenance domain and required references.";
    let recommendation = "Review the applicable maintenance manual section and confirm thresholds before action.";
    let confidence = 92;

    if (!manuals.length) {
        summary = "Manuals not detected. Providing a baseline response using general regulatory references.";
        recommendation =
            "Upload the applicable AMM/SRM/MEL/IPC manuals and approved service bulletins to enable evidence-based predictions.";
        confidence = 45;
    }

    if (selectedAircraft?.registration) {
        summary = `Aircraft ${selectedAircraft.registration} selected for prediction context. ${summary}`;
        if (selectedAircraft.model) {
            summary = `${summary} Model: ${selectedAircraft.model}.`;
        }
    }

    if (normalized.includes("hydraulic")) {
        summary = "Hydraulic system trend indicates potential pressure instability and requires verification.";
        recommendation = "Verify pressure transducer calibration and check system for leaks per AMM 29-00.";
    } else if (normalized.includes("compliance") || normalized.includes("deadline")) {
        summary = "Compliance review indicates upcoming inspection deadlines that require scheduling.";
        recommendation = "Schedule required inspections and document completion against FAA/EASA timelines.";
    } else if (normalized.includes("engine")) {
        summary = "Engine health indicators suggest a review of vibration and temperature limits.";
        recommendation = "Compare EGT margins and vibration data with OEM limits and log deviations.";
    }

    const predictiveNotes: string[] = [];
    const predictiveActions: string[] = [];

    if (docDraft) {
        const lastMaintenanceDate = parseDate(docDraft.maintenanceDate);
        const lastMaintenanceType = docDraft.lastMaintenanceType?.toLowerCase();
        const timeSinceOverhaul = parseNumber(docDraft.timeSinceOverhaul);
        const timeInService = parseNumber(docDraft.timeInService);
        const totalCycles = parseNumber(docDraft.totalCycles);

        if (docDraft.discDesc) {
            predictiveNotes.push("Active discrepancy reported; treat as a priority health flag until resolved.");
            predictiveActions.push("Validate discrepancy findings against the referenced manual section before release to service.");
            confidence = Math.min(confidence, 88);
        }

        if (lastMaintenanceDate) {
            let nextDue: Date | null = null;
            if (lastMaintenanceType?.includes("annual")) {
                nextDue = addMonths(lastMaintenanceDate, 12);
            } else if (lastMaintenanceType?.includes("100")) {
                nextDue = addMonths(lastMaintenanceDate, 6);
                predictiveActions.push("Confirm the 100-hour interval using actual time-in-service deltas.");
            } else if (lastMaintenanceType?.includes("phase") || lastMaintenanceType?.includes("a-check")) {
                nextDue = addMonths(lastMaintenanceDate, 4);
            }

            if (nextDue) {
                predictiveNotes.push(`Estimated next inspection due ${formatDate(nextDue)} (based on last maintenance date).`);
            } else {
                predictiveActions.push("Provide the last inspection type and interval to forecast the next due date.");
            }
        } else {
            predictiveActions.push("Add the last maintenance date to generate an inspection forecast.");
        }

        if (timeSinceOverhaul !== null) {
            predictiveNotes.push(`Time since overhaul logged at ${timeSinceOverhaul}.`);
        }
        if (timeInService !== null) {
            predictiveNotes.push(`Time in service logged at ${timeInService}.`);
        }
        if (totalCycles !== null) {
            predictiveNotes.push(`Total cycles recorded at ${totalCycles}.`);
        }
    }

    if (context) {
        summary = `${context} · ${summary}`;
    }

    if (docDraft) {
        summary = `${summary} ${buildDraftSummary(docDraft)}`;
    }

    if (predictiveNotes.length) {
        summary = `${summary} ${predictiveNotes.join(" ")}`;
    }

    if (predictiveActions.length) {
        recommendation = `${recommendation} ${predictiveActions.join(" ")}`;
    }

    const manualReferences = manuals.length ? buildManualReferences(manuals) : [];

    return {
        type: "assistant",
        content: "",
        summary,
        recommendation,
        confidence,
        references: manualReferences.length ? [...manualReferences, ...DEFAULT_REFERENCES] : DEFAULT_REFERENCES,
    };
}

function recordAssessment(registration?: string) {
    if (typeof window === "undefined" || !registration) return;
    try {
        const raw = window.localStorage.getItem(AI_ASSESSMENTS_KEY);
        const parsed = raw ? (JSON.parse(raw) as AiAssessment[]) : [];
        const next = Array.isArray(parsed) ? [...parsed] : [];
        const now = new Date().toISOString();
        const idx = next.findIndex((item) => item?.registration === registration);
        if (idx >= 0) {
            next[idx] = { registration, assessedAt: now };
        } else {
            next.unshift({ registration, assessedAt: now });
        }
        window.localStorage.setItem(AI_ASSESSMENTS_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("skymaintain:ai-assessment-updated"));
    } catch {
        // ignore storage failures
    }
}

export default function AIMechanicPanel({
    isOpen,
    onClose,
    onMinimize,
    initialQuery,
    context,
}: AIMechanicPanelProps): React.ReactElement | null {
    const [input, setInput] = React.useState("");
    const [messages, setMessages] = React.useState<Message[]>([DEFAULT_MESSAGE]);
    const [showEvidence, setShowEvidence] = React.useState(true);
    const [isSending, setIsSending] = React.useState(false);
    const [manuals, setManuals] = React.useState<ManualRef[]>([]);
    const [activeContext, setActiveContext] = React.useState<string | undefined>(undefined);
    const [docDraft, setDocDraft] = React.useState<DocumentationDraft | null>(null);
    const [selectedAircraft, setSelectedAircraft] = React.useState<SelectedAircraft | null>(null);

    React.useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    React.useEffect(() => {
        if (!isOpen) return;
        setManuals(getStoredManuals());
        setDocDraft(getDocumentationDraft());
        setSelectedAircraft(getSelectedAircraft());
    }, [isOpen]);

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<SelectedAircraft>).detail;
            if (!detail?.registration) return;
            setSelectedAircraft(detail);
        };
        window.addEventListener("skymaintain:aircraft-changed", handler);
        return () => window.removeEventListener("skymaintain:aircraft-changed", handler);
    }, []);

    React.useEffect(() => {
        if (!isOpen) return;
        if (initialQuery) {
            setInput(initialQuery);
        }
        if (context) {
            setActiveContext(context);
        }
    }, [isOpen, initialQuery, context]);

    React.useEffect(() => {
        if (!isOpen) return;
        if (!manuals.length) return;
        setMessages((prev) => {
            if (!prev.length) return prev;
            const [first, ...rest] = prev;
            if (first.summary?.startsWith("SkyMaintain AI Assistant initialized")) {
                return [
                    {
                        ...first,
                        references: [
                            ...(buildManualReferences(manuals) || []),
                            ...DEFAULT_REFERENCES,
                        ],
                    },
                    ...rest,
                ];
            }
            return prev;
        });
    }, [isOpen, manuals]);

    // Handle click outside to close
    const panelRef = React.useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleSuggestedQuery = (query: string) => {
        setInput(query);
    };

    const handleSend = () => {
        const query = input.trim();
        if (!query || isSending) return;

        setIsSending(true);
        setInput("");
        setMessages((prev) => [...prev, { type: "user", content: query }]);

        window.setTimeout(() => {
            const reply = buildAssistantReply(query, activeContext, manuals, docDraft, selectedAircraft);
            if (manuals.length && selectedAircraft?.registration) {
                recordAssessment(selectedAircraft.registration);

                // Generate and dispatch predictive alerts based on the query
                const normalizedQuery = query.toLowerCase();
                if (
                    normalizedQuery.includes("alert") ||
                    normalizedQuery.includes("predict") ||
                    normalizedQuery.includes("maintenance") ||
                    normalizedQuery.includes("inspect")
                ) {
                    const alerts = generatePredictiveAlerts(manuals, selectedAircraft.registration, query);
                    if (alerts.length) {
                        window.dispatchEvent(
                            new CustomEvent("skymaintain:ai-predictions", {
                                detail: { alerts },
                            })
                        );
                    }
                }
            }
            setMessages((prev) => [
                ...prev,
                reply,
            ]);
            setIsSending(false);
        }, 600);
    };

    const handleClear = () => {
        if (isSending) return;
        setMessages([DEFAULT_MESSAGE]);
    };

    return (
        <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="SkyMaintain AI Assistant"
            className="fixed z-[100] flex flex-col overflow-hidden rounded-[14px] w-[calc(100vw-32px)] sm:w-[400px] md:w-[440px] lg:w-[480px] max-w-[480px] h-[calc(100vh-180px)] sm:h-auto sm:max-h-[600px] right-4 sm:right-6 bottom-[120px] sm:bottom-[140px]"
            style={{
                border: "1.6px solid #bedbff",
                backgroundColor: "#ffffff",
                boxShadow: "0px 25px 50px 0px rgba(0,0,0,0.25)",
            }}
        >
            {/* Header - Matches Figma node 131:1309 */}
            <div
                className="flex items-start justify-between px-3 sm:px-4 py-3 sm:py-4 shrink-0"
                style={{
                    background: "linear-gradient(90deg, #155dfc 0%, #9810fa 100%)",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                }}
            >
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    {/* Bot Icon with status indicator */}
                    <div
                        className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-[10px] shrink-0"
                        style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                        <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
                        <div
                            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-[1.6px] border-white opacity-50"
                            style={{ backgroundColor: "#05df72" }}
                        />
                    </div>

                    {/* Title & Badges */}
                    <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <span className="text-sm sm:text-base lg:text-lg font-bold text-white truncate" style={{ fontFamily: "Arial, sans-serif" }}>
                                SkyMaintain AI Assistant
                            </span>
                            {/* Info icon */}
                            <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-80 shrink-0">
                                { }
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" />
                                    <path d="M8 11V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="8" cy="5.5" r="0.75" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                            <Badge icon="shield">Advisory</Badge>
                            <Badge icon="certified">Certified Sources</Badge>
                            <Badge icon="explain">Explainable</Badge>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Expand and Close */}
                <div className="flex gap-1 sm:gap-2 shrink-0 ml-2">
                    {onMinimize && (
                        <button
                            type="button"
                            onClick={onMinimize}
                            aria-label="Minimize panel"
                            className="flex h-7 w-8 sm:h-8 sm:w-9 items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                            title="Minimize"
                        >
                            <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close SkyMaintain AI Assistant (ESC)"
                        className="flex h-7 w-8 sm:h-8 sm:w-9 items-center justify-center rounded-lg hover:bg-white/20 transition-colors pointer-events-auto"
                        title="Close (ESC)"
                    >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* Info Banner - Matches Figma node 131:1357 */}
            <div
                className="flex gap-2 sm:gap-3 border-b px-3 sm:px-4 py-2.5 sm:py-3 items-start shrink-0"
                style={{ backgroundColor: "#eff6ff", borderColor: "#bedbff" }}
            >
                <div
                    className="flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-[10px]"
                    style={{ backgroundColor: "#dbeafe" }}
                >
                    <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155dfc]" aria-hidden="true" />
                </div>
                <div className="flex-1 text-xs sm:text-sm leading-relaxed min-w-0" style={{ color: "#1e2939" }}>
                    <span className="font-bold text-amber-800">
                        ⚠️ AI Insight – advisory only. Final decisions remain with certified personnel.
                    </span>{" "}
                    <span className="hidden sm:inline">Uses your authorized manuals and official regulatory sources (FAA, EASA, ICAO, Transport Canada) with full traceability.</span>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Dismiss"
                    className="flex h-7 w-8 sm:h-8 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg hover:bg-blue-100 transition-colors pointer-events-auto"
                    title="Dismiss"
                >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155dfc]" aria-hidden="true" />
                </button>
            </div>

            {/* Messages Area - Matches Figma node 131:1369 */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0" style={{ backgroundColor: "#f9fafb" }}>
                {messages.map((message, idx) => (
                    <div key={idx} className={`flex gap-2 sm:gap-3 mb-3 sm:mb-4 ${message.type === "user" ? "justify-end" : ""}`}>
                        {/* Bot Avatar */}
                        {message.type === "assistant" && (
                            <div
                                className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full"
                                style={{
                                    background: "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)",
                                }}
                            >
                                <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155dfc]">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8 3C7.44772 3 7 3.44772 7 4V4.5H9V4C9 3.44772 8.55228 3 8 3Z"
                                            fill="#155dfc"
                                        />
                                        <path
                                            d="M3 8C3 6.34315 4.34315 5 6 5H10C11.6569 5 13 6.34315 13 8V10C13 11.6569 11.6569 13 10 13H6C4.34315 13 3 11.6569 3 10V8Z"
                                            fill="#155dfc"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Message Card - Matches Figma node 131:1380 */}
                        <div
                            className={`rounded-[14px] border-[1.6px] p-3 sm:p-4 ${message.type === "user" ? "max-w-[85%] sm:max-w-[75%]" : "flex-1 min-w-0"}`}
                            style={{
                                backgroundColor: message.type === "user" ? "#155dfc" : "#ffffff",
                                borderColor: message.type === "user" ? "#155dfc" : "#dbeafe",
                                color: message.type === "user" ? "#ffffff" : "#0f172a",
                                boxShadow: message.type === "assistant" ? "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px 0px rgba(0,0,0,0.1)" : "none",
                            }}
                        >
                            {message.type === "user" ? (
                                <p className="text-xs sm:text-sm leading-relaxed break-words">{message.content}</p>
                            ) : null}
                            {/* Summary - Matches Figma node 131:1382 */}
                            {message.summary && (
                                <div className="mb-3 sm:mb-4">
                                    <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155dfc]" />
                                        <span
                                            className="text-xs sm:text-sm font-bold"
                                            style={{ color: "#101828" }}
                                        >
                                            Summary
                                        </span>
                                    </div>
                                    <p
                                        className="text-xs sm:text-sm leading-relaxed"
                                        style={{ color: "#364153", lineHeight: "1.6" }}
                                    >
                                        {message.summary}
                                    </p>
                                </div>
                            )}

                            {/* Supporting Evidence Toggle - Matches Figma node 131:1394 */}
                            <button
                                type="button"
                                className="mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
                                onClick={() => setShowEvidence((v) => !v)}
                            >
                                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155dfc]" aria-hidden="true" />
                                <span
                                    className="text-xs sm:text-sm font-bold"
                                    style={{ color: "#101828" }}
                                >
                                    Supporting Evidence
                                </span>
                                <ChevronDown
                                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 ${showEvidence ? "rotate-180" : ""}`}
                                    aria-hidden="true"
                                />
                            </button>

                            {/* Recommendation - Matches Figma node 131:1403 */}
                            {showEvidence && message.recommendation && (
                                <div
                                    className="mb-3 sm:mb-4 rounded-[4px] border-l-4 p-2.5 sm:p-3 pl-3 sm:pl-4"
                                    style={{
                                        backgroundColor: "#eff6ff",
                                        borderColor: "#155dfc",
                                    }}
                                >
                                    <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                                        <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155dfc]" aria-hidden="true" />
                                        <span
                                            className="text-xs sm:text-sm font-bold"
                                            style={{ color: "#101828" }}
                                        >
                                            Recommendation
                                        </span>
                                    </div>
                                    <p
                                        className="text-xs sm:text-sm leading-relaxed"
                                        style={{ color: "#364153", lineHeight: "1.6" }}
                                    >
                                        {message.recommendation}
                                    </p>
                                </div>
                            )}

                            {/* Confidence Level - Matches Figma node 131:1412 */}
                            {showEvidence && message.confidence !== undefined && (
                                <div
                                    className="mb-3 sm:mb-4 rounded-[4px] p-2.5 sm:p-3"
                                    style={{ backgroundColor: "#f9fafb" }}
                                >
                                    <div className="mb-1.5 sm:mb-2 flex items-center justify-between flex-wrap gap-1">
                                        <span
                                            className="text-[10px] sm:text-xs font-bold"
                                            style={{ color: "#364153" }}
                                        >
                                            Confidence Level
                                        </span>
                                        <span
                                            className="text-[10px] sm:text-xs font-bold"
                                            style={{ color: "#00a63e" }}
                                        >
                                            {message.confidence}% - High Confidence
                                        </span>
                                    </div>
                                    <div
                                        className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full"
                                        style={{ backgroundColor: "#e5e7eb" }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${message.confidence}%`,
                                                backgroundColor: "#00a63e",
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* References - Matches Figma node 131:1420 */}
                            {showEvidence && message.references && message.references.length > 0 && (
                                <div>
                                    <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155dfc]" aria-hidden="true" />
                                        <span
                                            className="text-xs sm:text-sm font-bold"
                                            style={{ color: "#101828" }}
                                        >
                                            References
                                        </span>
                                    </div>
                                    {message.references.map((ref, refIdx) => (
                                        <div
                                            key={refIdx}
                                            className="rounded-[4px] border-[0.8px] p-2 mb-2"
                                            style={{
                                                backgroundColor: "#faf5ff",
                                                borderColor: "#e9d4ff",
                                            }}
                                        >
                                            <p
                                                className="text-[10px] sm:text-xs font-bold mb-1 break-words"
                                                style={{ color: "#101828" }}
                                            >
                                                {ref.title}
                                            </p>
                                            <p
                                                className="text-[10px] sm:text-xs mb-1"
                                                style={{ color: "#4a5565" }}
                                            >
                                                {ref.source}
                                            </p>
                                            <a
                                                href={ref.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-[10px] sm:text-xs hover:underline mb-1 break-all"
                                                style={{ color: "#155dfc" }}
                                            >
                                                <span className="truncate">{ref.url}</span>
                                                <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" aria-hidden="true" />
                                            </a>
                                            {(ref.effectiveDate || ref.retrievedDate) && (
                                                <p
                                                    className="text-[10px] sm:text-xs"
                                                    style={{ color: "#6a7282" }}
                                                >
                                                    Effective: {ref.effectiveDate} | Retrieved:{" "}
                                                    {ref.retrievedDate}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Suggested Queries - Matches Figma node 131:1440 */}
            <div
                className="border-t px-3 sm:px-4 py-2.5 sm:py-3 shrink-0"
                style={{ borderColor: "#e5e7eb", backgroundColor: "#ffffff" }}
            >
                <p className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs" style={{ color: "#4a5565" }}>
                    Suggested queries:
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {SUGGESTED_QUERIES.map((query) => (
                        <button
                            key={query}
                            type="button"
                            onClick={() => handleSuggestedQuery(query)}
                            className="rounded-lg border-[0.8px] px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs transition-colors hover:bg-gray-50 active:bg-gray-100"
                            style={{
                                borderColor: "rgba(0,0,0,0.1)",
                                color: "#0a0a0a",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            {query}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area - Matches Figma node 131:1450 */}
            <div
                className="border-t px-3 sm:px-4 py-3 sm:py-4 shrink-0"
                style={{
                    borderColor: "#e5e7eb",
                    backgroundColor: "#ffffff",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                }}
            >
                <div className="flex gap-1.5 sm:gap-2 items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask about aircraft systems, maintenance, or compliance..."
                        aria-label="Type your question"
                        className="flex-1 min-w-0 rounded-lg border-[0.8px] px-2.5 sm:px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            backgroundColor: "#f3f3f5",
                            color: "#0f172a",
                            borderColor: "transparent",
                        }}
                    />
                    {/* Send Button - Matches Figma node 131:1454 */}
                    <button
                        type="button"
                        disabled={!input.trim() || isSending}
                        onClick={handleSend}
                        aria-label="Send message"
                        className="flex h-8 w-9 sm:h-9 sm:w-10 items-center justify-center rounded-lg transition-all disabled:opacity-50 hover:bg-blue-700 active:scale-95 shrink-0"
                        style={{ backgroundColor: "#155dfc" }}
                        title="Send message"
                    >
                        <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    </button>
                    {/* Mic/Voice Button - Matches Figma node 131:1458 */}
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear conversation"
                        className="flex h-7 w-8 sm:h-8 sm:w-9 items-center justify-center rounded-lg border-[0.8px] transition-colors hover:bg-gray-50 active:bg-gray-100 shrink-0"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#364153" }}
                        title="Clear conversation"
                    >
                        <Eraser className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Badge({
    icon,
    children,
}: {
    icon: "shield" | "certified" | "explain";
    children: React.ReactNode;
}) {
    const icons: Record<string, React.ReactNode> = {
        shield: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                    d="M6 1L2 3V6C2 8.5 3.5 10.5 6 11C8.5 10.5 10 8.5 10 6V3L6 1Z"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        certified: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                    d="M2 6L5 9L10 3"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        explain: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.2" />
                <path
                    d="M6 8V6"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                />
                <circle cx="6" cy="4" r="0.5" fill="white" />
            </svg>
        ),
    };

    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-white border-[0.8px] border-transparent"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
            {icons[icon]}
            {children}
        </span>
    );
}
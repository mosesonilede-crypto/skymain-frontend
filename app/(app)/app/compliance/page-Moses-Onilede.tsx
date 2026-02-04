
"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";

// External regulatory URLs - REAL LIVE LINKS
const FAA_AD_DATABASE = "https://rgl.faa.gov/Regulatory_and_Guidance_Library/rgAD.nsf/MainFrame?OpenFrameSet";
const FAA_REGULATORY_LIBRARY = "https://www.faa.gov/regulations_policies/rulemaking/recently_published";
const FAA_AD_SEARCH = "https://rgl.faa.gov/Regulatory_and_Guidance_Library/rgAD.nsf/adSearch!OpenForm";
const FAA_SAFETY_ALERTS = "https://www.faa.gov/newsroom/safety-briefing";
const EASA_AD_PORTAL = "https://ad.easa.europa.eu/";
const EASA_AD_LIBRARY = "https://ad.easa.europa.eu/ad-listing";
const EASA_SAFETY_PUBLICATIONS = "https://www.easa.europa.eu/en/document-library/safety-publications";
const EASA_SAFETY_MANAGEMENT = "https://www.easa.europa.eu/en/domains/safety-management";
const ICAO_SAFETY_STANDARDS = "https://www.icao.int/safety/Pages/default.aspx";

// SVG Icons as inline components for reliability
const ShieldCheckIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const DocumentIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-5 h-5 text-[#155dfc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExternalLinkIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const RefreshIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const BellIcon = () => (
    <svg className="w-5 h-5 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const FileIcon = () => (
    <svg className="w-4 h-4 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const CertificateIcon = () => (
    <svg className="w-4 h-4 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-4 h-4 text-[#312c85]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

// Data types
interface RegulatoryUpdate {
    id: string;
    type: "AD" | "SB";
    date: string;
    effectiveDate: string;
    title: string;
    description: string;
    status: "new" | "acknowledged" | "task_created";
}

interface AirworthinessDirective {
    id: string;
    description: string;
    authority: string;
    effectiveDate: string;
    complianceDate: string;
    status: "Compliant" | "Pending" | "Overdue";
    notes?: string;
}

interface ServiceBulletin {
    id: string;
    description: string;
    priority: "Mandatory" | "Recommended";
    issueDate: string;
    complianceDate?: string;
    status: "Compliant" | "Pending";
    notes?: string;
}

interface Certificate {
    id: string;
    name: string;
    number: string;
    expires: string;
    authority: string;
    status: "Valid" | "Expiring Soon" | "Expired";
}

interface AnnualInspection {
    lastDate: string;
    nextDueDate: string;
    inspector: string;
    inspectorId: string;
    status: "Current" | "Due Soon" | "Overdue";
}

interface AircraftInfo {
    registration: string;
    model: string;
    certificateNumber: string;
    certificateExpiry: string;
    registrationStatus: "Valid" | "Expired";
    annualInspectionStatus: "Current" | "Due Soon" | "Overdue";
}

interface Task {
    id: string;
    title: string;
    type: "AD" | "SB" | "CERT" | "INSPECTION";
    dueDate: string;
    description: string;
    sourceId: string;
    priority: "High" | "Medium" | "Low";
    status: "Open" | "In Progress" | "Completed";
}

// Initial data - simulating real database
const initialAircraftInfo: AircraftInfo = {
    registration: "N123AB",
    model: "Boeing 737-800",
    certificateNumber: "AWC-2018-N123AB",
    certificateExpiry: "6/14/2026",
    registrationStatus: "Valid",
    annualInspectionStatus: "Current",
};

const initialRegulatoryUpdates: RegulatoryUpdate[] = [
    {
        id: "UPD-001",
        type: "AD",
        date: "2026-01-20",
        effectiveDate: "2026-02-15",
        title: "New Airworthiness Directive FAA-2026-0124",
        description: "Wing spar inspection requirement for Boeing 737-800 series",
        status: "new",
    },
    {
        id: "UPD-002",
        type: "SB",
        date: "2026-01-18",
        effectiveDate: "2026-02-01",
        title: "Service Bulletin Update: Hydraulic System Enhancement",
        description: "Updated procedures for hydraulic seal replacement",
        status: "new",
    },
];

const initialADs: AirworthinessDirective[] = [
    {
        id: "FAA-2025-0234",
        description: "Wing Spar Inspection",
        authority: "FAA",
        effectiveDate: "4/14/2025",
        complianceDate: "4/11/2025",
        status: "Compliant",
        notes: "Completed during scheduled maintenance",
    },
];

const initialSBs: ServiceBulletin[] = [
    {
        id: "SB-737-32-1234",
        description: "Hydraulic System Enhancement",
        priority: "Mandatory",
        issueDate: "6/14/2025",
        complianceDate: "8/19/2025",
        status: "Compliant",
    },
    {
        id: "SB-737-28-5678",
        description: "Fuel Tank Access Panel Inspection",
        priority: "Recommended",
        issueDate: "10/31/2025",
        status: "Pending",
    },
];

const initialCertificates: Certificate[] = [
    {
        id: "CERT-001",
        name: "Airworthiness Certificate",
        number: "AWC-2018-N123AB",
        expires: "6/14/2026",
        authority: "FAA",
        status: "Valid",
    },
    {
        id: "CERT-002",
        name: "Registration Certificate",
        number: "REG-N123AB",
        expires: "6/9/2029",
        authority: "FAA",
        status: "Valid",
    },
    {
        id: "CERT-003",
        name: "Insurance Certificate",
        number: "INS-SKY-2025-1234",
        expires: "12/31/2025",
        authority: "SkyInsure LLC",
        status: "Expiring Soon",
    },
];

const initialAnnualInspection: AnnualInspection = {
    lastDate: "6/9/2025",
    nextDueDate: "6/9/2026",
    inspector: "Michael Roberts",
    inspectorId: "FAA IA-45678",
    status: "Current",
};

export default function RegulatoryCompliancePage() {
    // State for all regulatory data
    const [aircraftInfo] = useState<AircraftInfo>(initialAircraftInfo);
    const [regulatoryUpdates, setRegulatoryUpdates] = useState<RegulatoryUpdate[]>(initialRegulatoryUpdates);
    const [airworthinessDirectives, setAirworthinessDirectives] = useState<AirworthinessDirective[]>(initialADs);
    const [serviceBulletins, setServiceBulletins] = useState<ServiceBulletin[]>(initialSBs);
    const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [annualInspection, _setAnnualInspection] = useState<AnnualInspection>(initialAnnualInspection);
    const [tasks, setTasks] = useState<Task[]>([]);

    // UI state
    const [showUpdates, setShowUpdates] = useState(true);
    const [expandedADs, setExpandedADs] = useState(true);
    const [expandedSBs, setExpandedSBs] = useState(true);
    const [expandedCerts, setExpandedCerts] = useState(true);
    const [lastChecked, setLastChecked] = useState(() => {
        if (typeof window !== 'undefined') {
            const now = new Date();
            return `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
        }
        return "";
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    // Modal states
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditADModal, setShowEditADModal] = useState(false);
    const [showEditSBModal, setShowEditSBModal] = useState(false);
    const [showEditCertModal, setShowEditCertModal] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState<RegulatoryUpdate | null>(null);
    const [selectedAD, setSelectedAD] = useState<AirworthinessDirective | null>(null);
    const [selectedSB, setSelectedSB] = useState<ServiceBulletin | null>(null);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    // Task form state
    const [taskForm, setTaskForm] = useState({
        title: "",
        dueDate: "",
        priority: "Medium" as "High" | "Medium" | "Low",
        notes: "",
    });

    // Refs for modal focus management
    const modalRef = useRef<HTMLDivElement>(null);

    // Calculate compliance score dynamically
    const complianceScore = useMemo(() => {
        const adCompliant = airworthinessDirectives.filter(ad => ad.status === "Compliant").length;
        const adTotal = airworthinessDirectives.length;
        const sbCompliant = serviceBulletins.filter(sb => sb.status === "Compliant").length;
        const sbTotal = serviceBulletins.length;
        const certValid = certificates.filter(c => c.status === "Valid").length;
        const certTotal = certificates.length;

        const totalItems = adTotal + sbTotal + certTotal;
        const compliantItems = adCompliant + sbCompliant + certValid;

        return totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 100;
    }, [airworthinessDirectives, serviceBulletins, certificates]);

    // Count statistics
    const stats = useMemo(() => ({
        compliant: airworthinessDirectives.filter(ad => ad.status === "Compliant").length +
            serviceBulletins.filter(sb => sb.status === "Compliant").length,
        pending: airworthinessDirectives.filter(ad => ad.status === "Pending").length +
            serviceBulletins.filter(sb => sb.status === "Pending").length,
        overdue: airworthinessDirectives.filter(ad => ad.status === "Overdue").length,
        newUpdates: regulatoryUpdates.filter(u => u.status === "new").length,
        expiringCerts: certificates.filter(c => c.status === "Expiring Soon").length,
    }), [airworthinessDirectives, serviceBulletins, regulatoryUpdates, certificates]);

    // Show notification
    const showNotification = useCallback((message: string, type: "success" | "error" | "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Handler for refreshing regulatory data
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        showNotification("Checking regulatory databases...", "info");

        // Simulate API call to regulatory databases
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update last checked time
        const now = new Date();
        setLastChecked(`${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`);
        setIsRefreshing(false);
        showNotification("Regulatory data updated successfully", "success");
    }, [showNotification]);

    // Handler for viewing update details
    const handleViewDetails = useCallback((update: RegulatoryUpdate) => {
        setSelectedUpdate(update);
        setShowDetailModal(true);

        // Mark as acknowledged
        setRegulatoryUpdates(prev =>
            prev.map(u => u.id === update.id ? { ...u, status: "acknowledged" as const } : u)
        );
    }, []);

    // Handler for creating a task from an update
    const handleCreateTask = useCallback((update: RegulatoryUpdate) => {
        setSelectedUpdate(update);
        setTaskForm({
            title: update.title,
            dueDate: update.effectiveDate,
            priority: update.type === "AD" ? "High" : "Medium",
            notes: update.description,
        });
        setShowTaskModal(true);
    }, []);

    // Submit task creation
    const handleSubmitTask = useCallback(() => {
        if (!selectedUpdate || !taskForm.title || !taskForm.dueDate) {
            showNotification("Please fill in all required fields", "error");
            return;
        }

        const newTask: Task = {
            id: `TASK-${Date.now()}`,
            title: taskForm.title,
            type: selectedUpdate.type,
            dueDate: taskForm.dueDate,
            description: taskForm.notes,
            sourceId: selectedUpdate.id,
            priority: taskForm.priority,
            status: "Open",
        };

        setTasks(prev => [...prev, newTask]);
        setRegulatoryUpdates(prev =>
            prev.map(u => u.id === selectedUpdate.id ? { ...u, status: "task_created" as const } : u)
        );

        setShowTaskModal(false);
        setSelectedUpdate(null);
        showNotification(`Task created: ${taskForm.title}`, "success");
    }, [selectedUpdate, taskForm, showNotification]);

    // Handler for updating AD status
    const handleUpdateADStatus = useCallback((ad: AirworthinessDirective, newStatus: AirworthinessDirective["status"]) => {
        setAirworthinessDirectives(prev =>
            prev.map(a => a.id === ad.id ? { ...a, status: newStatus } : a)
        );
        showNotification(`AD ${ad.id} marked as ${newStatus}`, "success");
    }, [showNotification]);

    // Handler for updating SB status
    const handleUpdateSBStatus = useCallback((sb: ServiceBulletin, newStatus: ServiceBulletin["status"]) => {
        setServiceBulletins(prev =>
            prev.map(s => s.id === sb.id ? { ...s, status: newStatus } : s)
        );
        showNotification(`SB ${sb.id} marked as ${newStatus}`, "success");
    }, [showNotification]);

    // Handler for opening external links
    const handleExternalLink = useCallback((url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    }, []);

    // Edit AD handler
    const handleEditAD = useCallback((ad: AirworthinessDirective) => {
        setSelectedAD(ad);
        setShowEditADModal(true);
    }, []);

    // Edit SB handler
    const handleEditSB = useCallback((sb: ServiceBulletin) => {
        setSelectedSB(sb);
        setShowEditSBModal(true);
    }, []);

    // Edit Certificate handler
    const handleEditCert = useCallback((cert: Certificate) => {
        setSelectedCert(cert);
        setShowEditCertModal(true);
    }, []);

    // Save AD changes
    const handleSaveAD = useCallback((updatedAD: AirworthinessDirective) => {
        setAirworthinessDirectives(prev =>
            prev.map(ad => ad.id === updatedAD.id ? updatedAD : ad)
        );
        setShowEditADModal(false);
        setSelectedAD(null);
        showNotification(`AD ${updatedAD.id} updated successfully`, "success");
    }, [showNotification]);

    // Save SB changes
    const handleSaveSB = useCallback((updatedSB: ServiceBulletin) => {
        setServiceBulletins(prev =>
            prev.map(sb => sb.id === updatedSB.id ? updatedSB : sb)
        );
        setShowEditSBModal(false);
        setSelectedSB(null);
        showNotification(`SB ${updatedSB.id} updated successfully`, "success");
    }, [showNotification]);

    // Save Certificate changes
    const handleSaveCert = useCallback((updatedCert: Certificate) => {
        setCertificates(prev =>
            prev.map(cert => cert.id === updatedCert.id ? updatedCert : cert)
        );
        setShowEditCertModal(false);
        setSelectedCert(null);
        showNotification(`Certificate updated successfully`, "success");
    }, [showNotification]);

    // Get score color
    const getScoreColor = (score: number) => {
        if (score >= 90) return "#00a63e";
        if (score >= 75) return "#d08700";
        return "#e7000b";
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* Notification */}
            {notification && (
                <div
                    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in ${notification.type === "success"
                        ? "bg-[#dcfce7] text-[#008236] border border-[#b9f8cf]"
                        : notification.type === "error"
                            ? "bg-[#fef2f2] text-[#e7000b] border border-[#ffc9c9]"
                            : "bg-[#eff6ff] text-[#155dfc] border border-[#bedbff]"
                        }`}
                >
                    <CheckIcon />
                    <span className="text-sm">{notification.message}</span>
                </div>
            )}

            <div className="p-6 space-y-6">
                {/* Page Title */}
                <h1 className="text-2xl font-normal text-[#0a0a0a]">Regulatory Compliance</h1>

                {/* Main Card */}
                <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] shadow-sm p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <div
                            className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-lg"
                            style={{
                                backgroundImage: "linear-gradient(135deg, rgb(0, 166, 62) 0%, rgb(0, 153, 102) 100%)",
                            }}
                        >
                            <ShieldCheckIcon />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-normal text-[#0a0a0a]">Regulatory Compliance</h2>
                                <span className="px-2 py-0.5 bg-[#00a63e] text-white text-xs rounded-lg">
                                    Live Status
                                </span>
                            </div>
                            <p className="text-sm text-[#4a5565]">
                                Aircraft: {aircraftInfo.registration} • {aircraftInfo.model}
                            </p>
                        </div>
                    </div>

                    {/* Airworthiness Status Section */}
                    <div
                        className="rounded-[14px] border-[1.6px] border-[#bedbff] p-6 space-y-4"
                        style={{
                            backgroundImage: "linear-gradient(163deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#155dfc] rounded-[10px] flex items-center justify-center">
                                <DocumentIcon />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-normal text-[#0a0a0a]">Airworthiness Status</h3>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00a63e] text-white text-xs rounded-lg">
                                        <CheckIcon />
                                        Airworthy
                                    </span>
                                    <span className="text-xs text-[#4a5565]">Certificate: {aircraftInfo.certificateNumber}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white border border-[#dbeafe] rounded-[10px] p-3 text-center">
                                <p className="text-xs text-[#4a5565] mb-2">Certificate Status</p>
                                <span className="px-2 py-0.5 bg-[#dcfce7] text-[#008236] text-xs rounded-lg">
                                    Valid
                                </span>
                            </div>
                            <div className="bg-white border border-[#dbeafe] rounded-[10px] p-3 text-center">
                                <p className="text-xs text-[#4a5565] mb-1">Certificate Expiry</p>
                                <p className="text-sm text-[#0a0a0a]">{aircraftInfo.certificateExpiry}</p>
                            </div>
                            <div className="bg-white border border-[#dbeafe] rounded-[10px] p-3 text-center">
                                <p className="text-xs text-[#4a5565] mb-2">Registration</p>
                                <span className="px-2 py-0.5 bg-[#dbeafe] text-[#1447e6] text-xs rounded-lg">
                                    {aircraftInfo.registrationStatus}
                                </span>
                            </div>
                            <div className="bg-white border border-[#dbeafe] rounded-[10px] p-3 text-center">
                                <p className="text-xs text-[#4a5565] mb-2">Annual Inspection</p>
                                <span className="px-2 py-0.5 bg-[#dcfce7] text-[#008236] text-xs rounded-lg">
                                    {aircraftInfo.annualInspectionStatus}
                                </span>
                            </div>
                        </div>

                        {/* Authority Info */}
                        <div className="bg-white border border-[#dbeafe] rounded-[10px] px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-[#4a5565]">Issuing Authority:</span>
                                <span className="text-xs text-[#0a0a0a]">FAA</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-[#4a5565]">Next Renewal:</span>
                                <span className="text-xs text-[#0a0a0a]">6/9/2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Live Regulatory Authority Updates */}
                    <div
                        className="rounded-[14px] border-[1.6px] border-[#e5e7eb] p-5 space-y-4"
                        style={{
                            backgroundImage: "linear-gradient(to right, rgb(249, 250, 251) 0%, rgb(248, 250, 252) 100%)",
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <GlobeIcon />
                            <h4 className="text-sm font-bold text-[#0a0a0a]">Live Regulatory Authority Updates</h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#155dfc] text-white text-xs rounded-lg">
                                <CheckIcon />
                                Official Sources
                            </span>
                        </div>

                        {/* FAA and EASA Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* FAA Card */}
                            <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#dbeafe] rounded-[10px] flex items-center justify-center">
                                        <span className="text-sm">🇺🇸</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#0a0a0a]">FAA (Federal Aviation Administration)</p>
                                        <p className="text-xs text-[#4a5565]">United States</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleExternalLink(FAA_AD_DATABASE)}
                                        className="w-full bg-[#eff6ff] border border-[#bedbff] rounded px-2 py-2 flex items-center justify-between hover:bg-[#dbeafe] transition-colors cursor-pointer"
                                    >
                                        <span className="text-xs text-[#0a0a0a]">Airworthiness Directives Database</span>
                                        <ExternalLinkIcon className="w-3 h-3 text-[#155dfc]" />
                                    </button>
                                    <button
                                        onClick={() => handleExternalLink(FAA_REGULATORY_LIBRARY)}
                                        className="w-full bg-[#eff6ff] border border-[#bedbff] rounded px-2 py-2 flex items-center justify-between hover:bg-[#dbeafe] transition-colors cursor-pointer"
                                    >
                                        <span className="text-xs text-[#0a0a0a]">Regulatory &amp; Guidance Library</span>
                                        <ExternalLinkIcon className="w-3 h-3 text-[#155dfc]" />
                                    </button>
                                    <button
                                        onClick={() => handleExternalLink(FAA_AD_SEARCH)}
                                        className="w-full bg-[#eff6ff] border border-[#bedbff] rounded px-2 py-2 flex items-center justify-between hover:bg-[#dbeafe] transition-colors cursor-pointer"
                                    >
                                        <span className="text-xs text-[#0a0a0a]">AD Search Tool</span>
                                        <ExternalLinkIcon className="w-3 h-3 text-[#155dfc]" />
                                    </button>
                                </div>
                            </div>

                            {/* EASA Card */}
                            <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#dcfce7] rounded-[10px] flex items-center justify-center">
                                        <span className="text-sm">🇪🇺</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#0a0a0a]">EASA (European Aviation Safety Agency)</p>
                                        <p className="text-xs text-[#4a5565]">European Union</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleExternalLink(EASA_AD_PORTAL)}
                                        className="w-full bg-[#f0fdf4] border border-[#b9f8cf] rounded px-2 py-2 flex items-center justify-between hover:bg-[#dcfce7] transition-colors cursor-pointer"
                                    >
                                        <span className="text-xs text-[#0a0a0a]">Airworthiness Directives Portal</span>
                                        <ExternalLinkIcon className="w-3 h-3 text-[#00a63e]" />
                                    </button>
                                    <button
                                        onClick={() => handleExternalLink(EASA_AD_LIBRARY)}
                                        className="w-full bg-[#f0fdf4] border border-[#b9f8cf] rounded px-2 py-2 flex items-center justify-between hover:bg-[#dcfce7] transition-colors cursor-pointer"
                                    >
                                        <span className="text-xs text-[#0a0a0a]">AD Document Library</span>
                                        <ExternalLinkIcon className="w-3 h-3 text-[#00a63e]" />
                                    </button>
                                    <button
                                        onClick={() => handleExternalLink(EASA_SAFETY_PUBLICATIONS)}
                                        className="w-full bg-[#f0fdf4] border border-[#b9f8cf] rounded px-2 py-2 flex items-center justify-between hover:bg-[#dcfce7] transition-colors cursor-pointer"
                                    >
                                        <span className="text-xs text-[#0a0a0a]">Safety Publications</span>
                                        <ExternalLinkIcon className="w-3 h-3 text-[#00a63e]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Other Resources */}
                        <div className="bg-[#eef2ff] border border-[#c6d2ff] rounded-[10px] p-3">
                            <div className="flex items-start gap-2">
                                <InfoIcon />
                                <div>
                                    <p className="text-xs font-bold text-[#312c85]">Other Regulatory Resources</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <a
                                            href={FAA_SAFETY_ALERTS}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#432dd7] underline hover:text-[#312c85] transition-colors"
                                        >
                                            FAA Safety Alerts
                                        </a>
                                        <span className="text-[#99a1af]">•</span>
                                        <a
                                            href={EASA_SAFETY_MANAGEMENT}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#432dd7] underline hover:text-[#312c85] transition-colors"
                                        >
                                            EASA Safety Management
                                        </a>
                                        <span className="text-[#99a1af]">•</span>
                                        <a
                                            href={ICAO_SAFETY_STANDARDS}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#432dd7] underline hover:text-[#312c85] transition-colors"
                                        >
                                            ICAO Safety Standards
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Last Updated and Refresh */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#6a7282]">🔄 Last checked: {lastChecked}</span>
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex items-center gap-1 px-2 py-1 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg text-xs text-[#0a0a0a] hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
                            >
                                <RefreshIcon className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>

                    {/* Overall Compliance Score */}
                    <div
                        className="rounded-[10px] border-[1.6px] border-[#b9f8cf] p-6 space-y-4"
                        style={{
                            backgroundImage: "linear-gradient(to right, rgb(240, 253, 244) 0%, rgb(236, 253, 245) 100%)",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[#0a0a0a]">Overall Compliance Score</p>
                            <span className="text-4xl" style={{ color: getScoreColor(complianceScore) }}>
                                {complianceScore}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-[#e5e7eb] rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-500"
                                style={{
                                    width: `${complianceScore}%`,
                                    backgroundColor: getScoreColor(complianceScore),
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-3 text-center">
                            <div>
                                <p className="text-sm text-[#00a63e]">{stats.compliant}</p>
                                <p className="text-xs text-[#4a5565]">Compliant</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#d08700]">{stats.pending}</p>
                                <p className="text-xs text-[#4a5565]">Pending</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#e7000b]">{stats.overdue}</p>
                                <p className="text-xs text-[#4a5565]">Overdue</p>
                            </div>
                        </div>
                    </div>

                    {/* Applicable Regulatory Updates */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BellIcon />
                                <span className="text-sm text-[#0a0a0a]">Applicable Regulatory Updates for {aircraftInfo.model}</span>
                                {stats.newUpdates > 0 && (
                                    <span className="px-2 py-0.5 bg-[#155dfc] text-white text-xs rounded-lg">
                                        {stats.newUpdates} New
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setShowUpdates(!showUpdates)}
                                className="text-sm text-[#0a0a0a] px-3 py-1 hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                {showUpdates ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {/* Update Cards */}
                        {showUpdates && regulatoryUpdates.map((update) => (
                            <div
                                key={update.id}
                                className={`rounded-[10px] border p-4 space-y-2 ${update.type === "AD"
                                    ? "bg-[#fef2f2] border-[#ffc9c9]"
                                    : "bg-[#fefce8] border-[#fff085]"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-0.5 text-white text-xs rounded-lg ${update.type === "AD" ? "bg-[#e7000b]" : "bg-[#d08700]"
                                                }`}
                                        >
                                            {update.type === "AD" ? "New AD" : "SB Update"}
                                        </span>
                                        <span className="text-xs text-[#4a5565]">{update.date}</span>
                                        {update.status === "task_created" && (
                                            <span className="px-2 py-0.5 bg-[#dcfce7] text-[#008236] text-xs rounded-lg">
                                                Task Created
                                            </span>
                                        )}
                                    </div>
                                    <span className="px-2 py-0.5 border border-[rgba(0,0,0,0.1)] text-xs text-[#0a0a0a] rounded-lg">
                                        Effective: {update.effectiveDate}
                                    </span>
                                </div>
                                <h5 className="text-sm text-[#0a0a0a]">{update.title}</h5>
                                <p className="text-xs text-[#364153]">{update.description}</p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleViewDetails(update)}
                                        className="px-3 py-2 bg-[#155dfc] text-white text-xs rounded-lg hover:bg-[#1447e6] transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleCreateTask(update)}
                                        disabled={update.status === "task_created"}
                                        className="px-3 py-2 bg-white border border-[rgba(0,0,0,0.1)] text-[#0a0a0a] text-xs rounded-lg hover:bg-[#f9fafb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {update.status === "task_created" ? "Task Created" : "Create Task"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Airworthiness Directives (ADs) */}
                    <div className="border-t border-[#e5e7eb] pt-4 space-y-3">
                        <button
                            onClick={() => setExpandedADs(!expandedADs)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <FileIcon />
                                <span className="text-sm text-[#0a0a0a]">Airworthiness Directives (ADs)</span>
                                <span className="px-2 py-0.5 bg-[#e5e7eb] text-[#364153] text-xs rounded-lg">
                                    {airworthinessDirectives.length}
                                </span>
                            </div>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${expandedADs ? 'rotate-0' : '-rotate-90'}`} />
                        </button>

                        {expandedADs && airworthinessDirectives.map((ad) => (
                            <div
                                key={ad.id}
                                className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-3 space-y-2"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-[#0a0a0a]">{ad.id}</p>
                                        <p className="text-xs text-[#4a5565]">{ad.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={ad.status}
                                            onChange={(e) => handleUpdateADStatus(ad, e.target.value as AirworthinessDirective["status"])}
                                            className={`px-2 py-0.5 text-xs rounded-lg border-none cursor-pointer ${ad.status === "Compliant"
                                                ? "bg-[#dcfce7] text-[#008236]"
                                                : ad.status === "Pending"
                                                    ? "bg-[#fef9c2] text-[#a65f00]"
                                                    : "bg-[#fef2f2] text-[#e7000b]"
                                                }`}
                                        >
                                            <option value="Compliant">Compliant</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Overdue">Overdue</option>
                                        </select>
                                        <button
                                            onClick={() => handleEditAD(ad)}
                                            className="p-1 hover:bg-[#e5e7eb] rounded transition-colors"
                                            title="Edit AD"
                                        >
                                            <EditIcon />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs text-[#4a5565]">
                                    <div>
                                        <span>Authority: </span>
                                        <span>{ad.authority}</span>
                                    </div>
                                    <div>
                                        <span>Effective: </span>
                                        <span>{ad.effectiveDate}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-[#4a5565]">
                                    <span>Compliance Date: </span>
                                    <span>{ad.complianceDate}</span>
                                </div>
                                {ad.notes && (
                                    <div className="text-xs text-[#6a7282] italic border-t border-[#e5e7eb] pt-2 mt-2">
                                        Note: {ad.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Service Bulletins (SBs) */}
                    <div className="border-t border-[#e5e7eb] pt-4 space-y-3">
                        <button
                            onClick={() => setExpandedSBs(!expandedSBs)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <FileIcon />
                                <span className="text-sm text-[#0a0a0a]">Service Bulletins (SBs)</span>
                                <span className="px-2 py-0.5 bg-[#e5e7eb] text-[#364153] text-xs rounded-lg">
                                    {serviceBulletins.length}
                                </span>
                            </div>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${expandedSBs ? 'rotate-0' : '-rotate-90'}`} />
                        </button>

                        {expandedSBs && serviceBulletins.map((sb) => (
                            <div
                                key={sb.id}
                                className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-3 space-y-2"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-[#0a0a0a]">{sb.id}</span>
                                            <span
                                                className={`px-2 py-0.5 border text-xs rounded-lg ${sb.priority === "Mandatory"
                                                    ? "border-[#ffa2a2] text-[#c10007]"
                                                    : "border-[#ffdf20] text-[#a65f00]"
                                                    }`}
                                            >
                                                {sb.priority}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#4a5565]">{sb.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={sb.status}
                                            onChange={(e) => handleUpdateSBStatus(sb, e.target.value as ServiceBulletin["status"])}
                                            className={`px-2 py-0.5 text-xs rounded-lg border-none cursor-pointer ${sb.status === "Compliant"
                                                ? "bg-[#dcfce7] text-[#008236]"
                                                : "bg-[#fef9c2] text-[#a65f00]"
                                                }`}
                                        >
                                            <option value="Compliant">Compliant</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                        <button
                                            onClick={() => handleEditSB(sb)}
                                            className="p-1 hover:bg-[#e5e7eb] rounded transition-colors"
                                            title="Edit SB"
                                        >
                                            <EditIcon />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs text-[#4a5565]">
                                    <div>
                                        <span>Issue Date: </span>
                                        <span>{sb.issueDate}</span>
                                    </div>
                                    {sb.complianceDate && (
                                        <div>
                                            <span>Compliance: </span>
                                            <span>{sb.complianceDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Certificates & Inspections */}
                    <div className="border-t border-[#e5e7eb] pt-4 space-y-3">
                        <button
                            onClick={() => setExpandedCerts(!expandedCerts)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <CertificateIcon />
                                <span className="text-sm text-[#0a0a0a]">Certificates &amp; Inspections</span>
                                {stats.expiringCerts > 0 && (
                                    <span className="px-2 py-0.5 bg-[#f54900] text-white text-xs rounded-lg">
                                        {stats.expiringCerts} Expiring
                                    </span>
                                )}
                            </div>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${expandedCerts ? 'rotate-0' : '-rotate-90'}`} />
                        </button>

                        {expandedCerts && (
                            <div className="space-y-4">
                                {/* Active Certificates */}
                                <div className="space-y-2">
                                    <p className="text-xs text-[#4a5565]">Active Certificates</p>
                                    {certificates.map((cert) => (
                                        <div
                                            key={cert.id}
                                            className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-3 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-[#0a0a0a]">{cert.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`px-2 py-0.5 text-xs rounded-lg ${cert.status === "Valid"
                                                            ? "bg-[#dcfce7] text-[#008236]"
                                                            : cert.status === "Expiring Soon"
                                                                ? "bg-[#ffedd4] text-[#ca3500]"
                                                                : "bg-[#fef2f2] text-[#e7000b]"
                                                            }`}
                                                    >
                                                        {cert.status}
                                                    </span>
                                                    <button
                                                        onClick={() => handleEditCert(cert)}
                                                        className="p-1 hover:bg-[#e5e7eb] rounded transition-colors"
                                                        title="Edit Certificate"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-xs text-[#4a5565] space-y-1">
                                                <p>Number: {cert.number}</p>
                                                <p>Expires: {cert.expires}</p>
                                                <p>Authority: {cert.authority}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Annual Inspection */}
                                <div className="space-y-2">
                                    <p className="text-xs text-[#4a5565]">Annual Inspection</p>
                                    <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#0a0a0a]">Annual Inspection Status</span>
                                            <span className={`px-2 py-0.5 text-xs rounded-lg ${annualInspection.status === "Current"
                                                ? "bg-[#dcfce7] text-[#008236]"
                                                : annualInspection.status === "Due Soon"
                                                    ? "bg-[#ffedd4] text-[#ca3500]"
                                                    : "bg-[#fef2f2] text-[#e7000b]"
                                                }`}>
                                                {annualInspection.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-[#4a5565] space-y-1">
                                            <p>Last: {annualInspection.lastDate}</p>
                                            <p>Next Due: {annualInspection.nextDueDate}</p>
                                            <p>Inspector: {annualInspection.inspector} ({annualInspection.inspectorId})</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-[#e5e7eb] pt-4">
                        <h4 className="text-sm font-medium text-[#0a0a0a] mb-3">Quick Actions</h4>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/app/logs"
                                className="inline-flex items-center gap-1 px-3 py-2 bg-[#155dfc] text-white text-xs rounded-lg hover:bg-[#1447e6] transition-colors"
                            >
                                <FileIcon />
                                View Maintenance Logs
                            </Link>
                            <Link
                                href="/app/alerts"
                                className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-[rgba(0,0,0,0.1)] text-[#0a0a0a] text-xs rounded-lg hover:bg-[#f9fafb] transition-colors"
                            >
                                <BellIcon />
                                View All Alerts
                            </Link>
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-[rgba(0,0,0,0.1)] text-[#0a0a0a] text-xs rounded-lg hover:bg-[#f9fafb] transition-colors"
                            >
                                Print Compliance Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tasks Created Section */}
                {tasks.length > 0 && (
                    <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] shadow-sm p-6">
                        <h3 className="text-lg font-medium text-[#0a0a0a] mb-4">Created Tasks ({tasks.length})</h3>
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg border border-[#e5e7eb]">
                                    <div>
                                        <p className="text-sm text-[#0a0a0a]">{task.title}</p>
                                        <p className="text-xs text-[#4a5565]">Due: {task.dueDate} • Priority: {task.priority}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs rounded-lg ${task.status === "Open"
                                        ? "bg-[#dbeafe] text-[#1447e6]"
                                        : task.status === "In Progress"
                                            ? "bg-[#fef9c2] text-[#a65f00]"
                                            : "bg-[#dcfce7] text-[#008236]"
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Task Creation Modal */}
            {showTaskModal && selectedUpdate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div ref={modalRef} className="bg-white rounded-[14px] w-full max-w-lg p-6 space-y-4 m-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-[#0a0a0a]">Create Compliance Task</h3>
                            <button
                                onClick={() => setShowTaskModal(false)}
                                className="p-1 hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Task Title *</label>
                                <input
                                    type="text"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Due Date *</label>
                                <input
                                    type="date"
                                    value={taskForm.dueDate}
                                    onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Priority</label>
                                <select
                                    value={taskForm.priority}
                                    onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as "High" | "Medium" | "Low" }))}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Notes</label>
                                <textarea
                                    value={taskForm.notes}
                                    onChange={(e) => setTaskForm(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc] resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowTaskModal(false)}
                                className="px-4 py-2 text-sm text-[#0a0a0a] hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitTask}
                                className="px-4 py-2 bg-[#155dfc] text-white text-sm rounded-lg hover:bg-[#1447e6] transition-colors"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedUpdate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[14px] w-full max-w-lg p-6 space-y-4 m-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-white text-xs rounded-lg ${selectedUpdate.type === "AD" ? "bg-[#e7000b]" : "bg-[#d08700]"
                                    }`}>
                                    {selectedUpdate.type === "AD" ? "Airworthiness Directive" : "Service Bulletin"}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-1 hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-[#0a0a0a]">{selectedUpdate.title}</h3>
                            <p className="text-sm text-[#4a5565] mt-2">{selectedUpdate.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[#4a5565]">Published Date</p>
                                <p className="text-[#0a0a0a]">{selectedUpdate.date}</p>
                            </div>
                            <div>
                                <p className="text-[#4a5565]">Effective Date</p>
                                <p className="text-[#0a0a0a]">{selectedUpdate.effectiveDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={() => {
                                    const url = selectedUpdate.type === "AD" ? FAA_AD_DATABASE : FAA_REGULATORY_LIBRARY;
                                    window.open(url, "_blank", "noopener,noreferrer");
                                }}
                                className="flex-1 px-4 py-2 bg-[#155dfc] text-white text-sm rounded-lg hover:bg-[#1447e6] transition-colors text-center"
                            >
                                View on Official Source
                            </button>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    handleCreateTask(selectedUpdate);
                                }}
                                disabled={selectedUpdate.status === "task_created"}
                                className="flex-1 px-4 py-2 bg-white border border-[rgba(0,0,0,0.1)] text-[#0a0a0a] text-sm rounded-lg hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit AD Modal */}
            {showEditADModal && selectedAD && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[14px] w-full max-w-lg p-6 space-y-4 m-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-[#0a0a0a]">Edit Airworthiness Directive</h3>
                            <button
                                onClick={() => setShowEditADModal(false)}
                                className="p-1 hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">AD ID</label>
                                <input
                                    type="text"
                                    value={selectedAD.id}
                                    disabled
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm bg-[#f9fafb]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Status</label>
                                <select
                                    value={selectedAD.status}
                                    onChange={(e) => setSelectedAD({ ...selectedAD, status: e.target.value as AirworthinessDirective["status"] })}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                >
                                    <option value="Compliant">Compliant</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Notes</label>
                                <textarea
                                    value={selectedAD.notes || ""}
                                    onChange={(e) => setSelectedAD({ ...selectedAD, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc] resize-none"
                                    placeholder="Add compliance notes..."
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowEditADModal(false)}
                                className="px-4 py-2 text-sm text-[#0a0a0a] hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveAD(selectedAD)}
                                className="px-4 py-2 bg-[#155dfc] text-white text-sm rounded-lg hover:bg-[#1447e6] transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit SB Modal */}
            {showEditSBModal && selectedSB && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[14px] w-full max-w-lg p-6 space-y-4 m-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-[#0a0a0a]">Edit Service Bulletin</h3>
                            <button
                                onClick={() => setShowEditSBModal(false)}
                                className="p-1 hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">SB ID</label>
                                <input
                                    type="text"
                                    value={selectedSB.id}
                                    disabled
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm bg-[#f9fafb]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Status</label>
                                <select
                                    value={selectedSB.status}
                                    onChange={(e) => setSelectedSB({ ...selectedSB, status: e.target.value as ServiceBulletin["status"] })}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                >
                                    <option value="Compliant">Compliant</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Compliance Date</label>
                                <input
                                    type="date"
                                    value={selectedSB.complianceDate || ""}
                                    onChange={(e) => setSelectedSB({ ...selectedSB, complianceDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Notes</label>
                                <textarea
                                    value={selectedSB.notes || ""}
                                    onChange={(e) => setSelectedSB({ ...selectedSB, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc] resize-none"
                                    placeholder="Add compliance notes..."
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowEditSBModal(false)}
                                className="px-4 py-2 text-sm text-[#0a0a0a] hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveSB(selectedSB)}
                                className="px-4 py-2 bg-[#155dfc] text-white text-sm rounded-lg hover:bg-[#1447e6] transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Certificate Modal */}
            {showEditCertModal && selectedCert && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[14px] w-full max-w-lg p-6 space-y-4 m-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-[#0a0a0a]">Edit Certificate</h3>
                            <button
                                onClick={() => setShowEditCertModal(false)}
                                className="p-1 hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Certificate Name</label>
                                <input
                                    type="text"
                                    value={selectedCert.name}
                                    disabled
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm bg-[#f9fafb]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Certificate Number</label>
                                <input
                                    type="text"
                                    value={selectedCert.number}
                                    onChange={(e) => setSelectedCert({ ...selectedCert, number: e.target.value })}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    value={selectedCert.expires}
                                    onChange={(e) => setSelectedCert({ ...selectedCert, expires: e.target.value })}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#4a5565] mb-1">Status</label>
                                <select
                                    value={selectedCert.status}
                                    onChange={(e) => setSelectedCert({ ...selectedCert, status: e.target.value as Certificate["status"] })}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                >
                                    <option value="Valid">Valid</option>
                                    <option value="Expiring Soon">Expiring Soon</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowEditCertModal(false)}
                                className="px-4 py-2 text-sm text-[#0a0a0a] hover:bg-[#f9fafb] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveCert(selectedCert)}
                                className="px-4 py-2 bg-[#155dfc] text-white text-sm rounded-lg hover:bg-[#1447e6] transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

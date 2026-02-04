/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 6:254
 * specHash: sha256:reports-analytics-page-v2
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

// Figma assets for Reports Page (node 6:254)
const imgIconDownload = "https://www.figma.com/api/mcp/asset/9b9df8cb-42e3-4103-80b2-cf5255907a12";
const imgIconPrint = "https://www.figma.com/api/mcp/asset/dd7a6f2c-00f4-4106-9aba-8cdd665ab0f7";
const imgIconRefresh = "https://www.figma.com/api/mcp/asset/26b70c61-de66-4a5a-8c9d-bc7b7fb8bac4";
const imgIconCalendar = "https://www.figma.com/api/mcp/asset/e5a390b2-4015-4e9f-9c01-71350cbb5b86";
const imgIconChart = "https://www.figma.com/api/mcp/asset/82a52274-7a37-4faa-b558-cb6300079e3a";
const imgIconExport = "https://www.figma.com/api/mcp/asset/9b9df8cb-42e3-4103-80b2-cf5255907a12";
const imgIconEdit = "https://www.figma.com/api/mcp/asset/96384e1b-be36-46fa-8ee4-f20fb52d2614";
const imgIconAlert = "https://www.figma.com/api/mcp/asset/cb22b977-535b-4c8a-8fd8-96859ea25832";
const imgIconCheck = "https://www.figma.com/api/mcp/asset/26b70c61-de66-4a5a-8c9d-bc7b7fb8bac4";

// Types
interface AircraftData {
    registration: string;
    model: string;
    healthStatus: number;
    flightHours: string;
    totalCycles: string;
}

interface MaintenanceSummary {
    activeAlerts: number;
    upcomingTasks: number;
    lastInspection: string;
    nextService: string;
}

interface SystemHealth {
    id: string;
    name: string;
    value: number;
    trend: "up" | "down" | "stable";
    lastUpdated: string;
}

interface ReportConfig {
    dateFrom: string;
    dateTo: string;
    includeSystemHealth: boolean;
    includeMaintenanceLogs: boolean;
    includeAlerts: boolean;
    includeCompliance: boolean;
    format: "PDF" | "CSV" | "Excel";
}

// Initial data
const initialAircraftData: AircraftData = {
    registration: "N123AB",
    model: "Boeing 737-800",
    healthStatus: 95,
    flightHours: "24,500",
    totalCycles: "15,200",
};

const initialMaintenanceSummary: MaintenanceSummary = {
    activeAlerts: 0,
    upcomingTasks: 0,
    lastInspection: "2025-12-10",
    nextService: "2026-03-15",
};

const initialSystemHealth: SystemHealth[] = [
    { id: "engine", name: "Engine", value: 94, trend: "stable", lastUpdated: "2026-01-20" },
    { id: "landing-gear", name: "Landing Gear", value: 96, trend: "up", lastUpdated: "2026-01-18" },
    { id: "hydraulic", name: "Hydraulic", value: 88, trend: "down", lastUpdated: "2026-01-19" },
    { id: "fuel-system", name: "Fuel System", value: 97, trend: "stable", lastUpdated: "2026-01-21" },
    { id: "avionics", name: "Avionics", value: 100, trend: "up", lastUpdated: "2026-01-22" },
    { id: "electrical", name: "Electrical", value: 93, trend: "stable", lastUpdated: "2026-01-20" },
    { id: "apu", name: "APU", value: 91, trend: "down", lastUpdated: "2026-01-17" },
];

const initialReportConfig: ReportConfig = {
    dateFrom: "",
    dateTo: "",
    includeSystemHealth: true,
    includeMaintenanceLogs: true,
    includeAlerts: true,
    includeCompliance: true,
    format: "PDF",
};

export default function ReportsPage() {
    // State
    const [aircraftData, setAircraftData] = useState<AircraftData>(initialAircraftData);
    const [maintenanceSummary] = useState<MaintenanceSummary>(initialMaintenanceSummary);
    const [systemHealth, setSystemHealth] = useState<SystemHealth[]>(initialSystemHealth);
    const [reportConfig, setReportConfig] = useState<ReportConfig>(initialReportConfig);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSystem, setEditingSystem] = useState<SystemHealth | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ flightHours: "", totalCycles: "" });
    const [systemEditValue, setSystemEditValue] = useState(0);
    const printRef = useRef<HTMLDivElement>(null);

    // Show notification
    const showNotification = useCallback((message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Calculate overall health
    const calculateOverallHealth = useCallback(() => {
        const total = systemHealth.reduce((sum, s) => sum + s.value, 0);
        return Math.round(total / systemHealth.length);
    }, [systemHealth]);

    // Refresh data
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Simulate data refresh with slight variations
        setSystemHealth((prev) =>
            prev.map((s) => ({
                ...s,
                value: Math.min(100, Math.max(80, s.value + Math.floor(Math.random() * 5) - 2)),
                lastUpdated: new Date().toISOString().split("T")[0],
            }))
        );
        
        setAircraftData((prev) => ({
            ...prev,
            healthStatus: calculateOverallHealth(),
        }));
        
        setIsRefreshing(false);
        showNotification("Data refreshed successfully!");
    };

    // Generate report
    const handleGenerateReport = async () => {
        if (!reportConfig.dateFrom || !reportConfig.dateTo) {
            showNotification("Please select date range for the report");
            return;
        }

        setIsGeneratingReport(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsGeneratingReport(false);
        setShowExportModal(false);
        showNotification(`${reportConfig.format} report generated successfully!`);
    };

    // Print report
    const handlePrintReport = () => {
        window.print();
        showNotification("Print dialog opened");
    };

    // Export data
    const handleExportData = (format: "PDF" | "CSV" | "Excel") => {
        showNotification(`Exporting data as ${format}...`);
        setTimeout(() => {
            showNotification(`${format} file downloaded successfully!`);
        }, 1500);
    };

    // Update aircraft data
    const handleUpdateAircraftData = () => {
        setAircraftData((prev) => ({
            ...prev,
            flightHours: editForm.flightHours || prev.flightHours,
            totalCycles: editForm.totalCycles || prev.totalCycles,
        }));
        setShowEditModal(false);
        showNotification("Aircraft data updated successfully!");
    };

    // Update system health
    const handleUpdateSystemHealth = () => {
        if (!editingSystem) return;
        
        setSystemHealth((prev) =>
            prev.map((s) =>
                s.id === editingSystem.id
                    ? { ...s, value: systemEditValue, lastUpdated: new Date().toISOString().split("T")[0] }
                    : s
            )
        );
        setEditingSystem(null);
        showNotification("System health updated successfully!");
    };

    // Get health color
    const getHealthColor = (value: number) => {
        if (value >= 90) return "text-[#00a63e]";
        if (value >= 75) return "text-[#a65f00]";
        return "text-[#c10007]";
    };

    // Get health bg color
    const getHealthBgColor = (value: number) => {
        if (value >= 90) return "bg-[#dcfce7]";
        if (value >= 75) return "bg-[#fef9c2]";
        return "bg-[#ffe2e2]";
    };

    // Get trend icon
    const getTrendIcon = (trend: "up" | "down" | "stable") => {
        if (trend === "up") return "↑";
        if (trend === "down") return "↓";
        return "→";
    };

    // Get trend color
    const getTrendColor = (trend: "up" | "down" | "stable") => {
        if (trend === "up") return "text-[#00a63e]";
        if (trend === "down") return "text-[#c10007]";
        return "text-[#6a7282]";
    };

    return (
        <div className="flex flex-col gap-6 p-6" data-name="SkyMaintain Reports" data-node-id="6:254" ref={printRef}>
            {/* Notification */}
            {notification && (
                <div className="fixed right-4 top-4 z-50 rounded-lg border border-[#22c55e] bg-[#dcfce7] px-4 py-3 shadow-lg">
                    <p className="text-[14px] text-[#008236]">{notification}</p>
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between" data-name="Container" data-node-id="6:258">
                <h1 className="text-[24px] font-bold leading-8 text-[#0a0a0a]" data-name="Heading 2" data-node-id="6:259">
                    Reports &amp; Analytics - {aircraftData.registration}
                </h1>
                <div className="flex items-center gap-3">
                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex h-9 items-center gap-2 rounded-lg border border-black/10 bg-white px-4 text-[14px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb] disabled:opacity-50"
                    >
                        <img
                            src={imgIconRefresh}
                            alt=""
                            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        {isRefreshing ? "Refreshing..." : "Refresh Data"}
                    </button>
                    {/* Export Button */}
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex h-9 items-center gap-2 rounded-lg border border-black/10 bg-white px-4 text-[14px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb]"
                    >
                        <img src={imgIconExport} alt="" className="h-4 w-4" />
                        Export Report
                    </button>
                    {/* Print Button */}
                    <button
                        onClick={handlePrintReport}
                        className="flex h-9 items-center gap-2 rounded-lg bg-[#030213] px-4 text-[14px] text-white transition-colors hover:bg-[#1a1a2e]"
                    >
                        <img src={imgIconPrint} alt="" className="h-4 w-4 brightness-0 invert" />
                        Print Report
                    </button>
                </div>
            </div>

            {/* Top Cards Row */}
            <div className="grid grid-cols-2 gap-6" data-name="Container" data-node-id="6:261">
                {/* Aircraft Overview Card */}
                <div className="flex flex-col gap-4 rounded-[10px] border border-[#e5e7eb] bg-white p-6" data-name="Container" data-node-id="6:262">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[18px] font-bold leading-7 text-[#0a0a0a]" data-name="Heading 3" data-node-id="6:263">
                            Aircraft Overview
                        </h2>
                        <button
                            onClick={() => {
                                setEditForm({
                                    flightHours: aircraftData.flightHours,
                                    totalCycles: aircraftData.totalCycles,
                                });
                                setShowEditModal(true);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#eff6ff]"
                            title="Edit Aircraft Data"
                        >
                            <img src={imgIconEdit} alt="" className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3" data-name="Container" data-node-id="6:265">
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:266">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:267">
                                Registration:
                            </span>
                            <span className="text-[16px] leading-6 text-[#0a0a0a]" data-name="Text" data-node-id="6:269">
                                {aircraftData.registration}
                            </span>
                        </div>
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:271">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:272">
                                Model:
                            </span>
                            <span className="text-[16px] leading-6 text-[#0a0a0a]" data-name="Text" data-node-id="6:274">
                                {aircraftData.model}
                            </span>
                        </div>
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:276">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:277">
                                Health Status:
                            </span>
                            <span
                                className={`rounded-lg px-2 py-[3px] text-[12px] leading-4 ${getHealthBgColor(calculateOverallHealth())} ${getHealthColor(calculateOverallHealth()).replace("text-", "text-")}`}
                                data-name="Badge"
                                data-node-id="6:279"
                            >
                                {calculateOverallHealth()}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:281">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:282">
                                Flight Hours:
                            </span>
                            <span className="text-[16px] leading-6 text-[#0a0a0a]" data-name="Text" data-node-id="6:284">
                                {aircraftData.flightHours}
                            </span>
                        </div>
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:286">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:287">
                                Total Cycles:
                            </span>
                            <span className="text-[16px] leading-6 text-[#0a0a0a]" data-name="Text" data-node-id="6:289">
                                {aircraftData.totalCycles}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Maintenance Summary Card */}
                <div className="flex flex-col gap-4 rounded-[10px] border border-[#e5e7eb] bg-white p-6" data-name="Container" data-node-id="6:291">
                    <h2 className="text-[18px] font-bold leading-7 text-[#0a0a0a]" data-name="Heading 3" data-node-id="6:292">
                        Maintenance Summary
                    </h2>

                    <div className="flex flex-col gap-3" data-name="Container" data-node-id="6:294">
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:295">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:296">
                                Active Alerts:
                            </span>
                            <Link href="/app/alerts" className="transition-transform hover:scale-105">
                                <span
                                    className="cursor-pointer rounded-lg bg-[#ffe2e2] px-2 py-[3px] text-[12px] leading-4 text-[#c10007]"
                                    data-name="Badge"
                                    data-node-id="6:298"
                                >
                                    {maintenanceSummary.activeAlerts}
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:300">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:301">
                                Upcoming Tasks:
                            </span>
                            <Link href="/app/logs" className="transition-transform hover:scale-105">
                                <span
                                    className="cursor-pointer rounded-lg bg-[#fef9c2] px-2 py-[3px] text-[12px] leading-4 text-[#a65f00]"
                                    data-name="Badge"
                                    data-node-id="6:303"
                                >
                                    {maintenanceSummary.upcomingTasks}
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:305">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:306">
                                Last Inspection:
                            </span>
                            <span className="text-[16px] leading-6 text-[#0a0a0a]" data-name="Text" data-node-id="6:308">
                                {maintenanceSummary.lastInspection}
                            </span>
                        </div>
                        <div className="flex items-center justify-between" data-name="Container" data-node-id="6:310">
                            <span className="text-[16px] leading-6 text-[#4a5565]" data-name="Text" data-node-id="6:311">
                                Next Service:
                            </span>
                            <span className="text-[16px] leading-6 text-[#0a0a0a]" data-name="Text" data-node-id="6:313">
                                {maintenanceSummary.nextService}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Health Breakdown Card */}
            <div className="flex flex-col gap-4 rounded-[10px] border border-[#e5e7eb] bg-white p-6" data-name="Container" data-node-id="6:315">
                <div className="flex items-center justify-between">
                    <h2 className="text-[18px] font-bold leading-7 text-[#0a0a0a]" data-name="Heading 3" data-node-id="6:316">
                        System Health Breakdown
                    </h2>
                    <span className="text-[12px] text-[#6a7282]">
                        Last updated: {new Date().toLocaleDateString()}
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-4" data-name="Container" data-node-id="6:318">
                    {systemHealth.map((system) => (
                        <button
                            key={system.id}
                            onClick={() => {
                                setEditingSystem(system);
                                setSystemEditValue(system.value);
                            }}
                            className="group flex flex-col items-center gap-2 rounded-[10px] bg-[#f9fafb] px-4 py-4 transition-all hover:bg-[#eff6ff] hover:shadow-md"
                            data-name="Container"
                        >
                            <span className="text-center text-[14px] leading-5 text-[#4a5565]">
                                {system.name}
                            </span>
                            <span className={`text-center text-[24px] leading-8 ${getHealthColor(system.value)}`}>
                                {system.value}%
                            </span>
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <span className={`text-[12px] ${getTrendColor(system.trend)}`}>
                                    {getTrendIcon(system.trend)}
                                </span>
                                <span className="text-[10px] text-[#6a7282]">Click to edit</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Health Summary */}
                <div className="mt-2 flex items-center justify-between rounded-lg bg-[#eff6ff] p-4">
                    <div className="flex items-center gap-2">
                        <img src={imgIconChart} alt="" className="h-5 w-5" />
                        <span className="text-[14px] font-medium text-[#1447e6]">Overall System Health</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-[20px] font-bold ${getHealthColor(calculateOverallHealth())}`}>
                            {calculateOverallHealth()}%
                        </span>
                        <span className="text-[12px] text-[#6a7282]">
                            Based on {systemHealth.length} systems
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Card */}
            <div className="flex flex-col gap-4 rounded-[10px] border border-[#e5e7eb] bg-white p-6">
                <h2 className="text-[18px] font-bold leading-7 text-[#0a0a0a]">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-4 gap-4">
                    <Link
                        href="/app/logs"
                        className="flex flex-col items-center gap-2 rounded-[10px] bg-[#f9fafb] p-4 transition-all hover:bg-[#eff6ff] hover:shadow-md"
                    >
                        <img src={imgIconCheck} alt="" className="h-8 w-8" />
                        <span className="text-[14px] text-[#0a0a0a]">View Logs</span>
                    </Link>
                    <Link
                        href="/app/alerts"
                        className="flex flex-col items-center gap-2 rounded-[10px] bg-[#f9fafb] p-4 transition-all hover:bg-[#eff6ff] hover:shadow-md"
                    >
                        <img src={imgIconAlert} alt="" className="h-8 w-8" />
                        <span className="text-[14px] text-[#0a0a0a]">View Alerts</span>
                    </Link>
                    <button
                        onClick={() => handleExportData("PDF")}
                        className="flex flex-col items-center gap-2 rounded-[10px] bg-[#f9fafb] p-4 transition-all hover:bg-[#eff6ff] hover:shadow-md"
                    >
                        <img src={imgIconDownload} alt="" className="h-8 w-8" />
                        <span className="text-[14px] text-[#0a0a0a]">Export PDF</span>
                    </button>
                    <button
                        onClick={() => handleExportData("Excel")}
                        className="flex flex-col items-center gap-2 rounded-[10px] bg-[#f9fafb] p-4 transition-all hover:bg-[#eff6ff] hover:shadow-md"
                    >
                        <img src={imgIconExport} alt="" className="h-8 w-8" />
                        <span className="text-[14px] text-[#0a0a0a]">Export Excel</span>
                    </button>
                </div>
            </div>

            {/* Export Report Modal */}
            {showExportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowExportModal(false)}>
                    <div className="w-full max-w-md rounded-[14px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-[20px] font-bold text-[#0a0a0a]">Generate Report</h2>
                        <p className="text-[14px] text-[#6a7282]">Configure your report parameters</p>

                        <div className="mt-6 flex flex-col gap-4">
                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">From Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={reportConfig.dateFrom}
                                            onChange={(e) => setReportConfig((prev) => ({ ...prev, dateFrom: e.target.value }))}
                                            className="h-10 w-full rounded-lg border border-[#e5e7eb] px-3 pl-10 text-[14px] outline-none focus:border-[#1447e6]"
                                        />
                                        <img src={imgIconCalendar} alt="" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">To Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={reportConfig.dateTo}
                                            onChange={(e) => setReportConfig((prev) => ({ ...prev, dateTo: e.target.value }))}
                                            className="h-10 w-full rounded-lg border border-[#e5e7eb] px-3 pl-10 text-[14px] outline-none focus:border-[#1447e6]"
                                        />
                                        <img src={imgIconCalendar} alt="" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                                    </div>
                                </div>
                            </div>

                            {/* Include Options */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[14px] font-medium text-[#0a0a0a]">Include in Report</label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeSystemHealth}
                                            onChange={(e) => setReportConfig((prev) => ({ ...prev, includeSystemHealth: e.target.checked }))}
                                            className="h-4 w-4 rounded border-[#e5e7eb]"
                                        />
                                        <span className="text-[14px] text-[#0a0a0a]">System Health Data</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeMaintenanceLogs}
                                            onChange={(e) => setReportConfig((prev) => ({ ...prev, includeMaintenanceLogs: e.target.checked }))}
                                            className="h-4 w-4 rounded border-[#e5e7eb]"
                                        />
                                        <span className="text-[14px] text-[#0a0a0a]">Maintenance Logs</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeAlerts}
                                            onChange={(e) => setReportConfig((prev) => ({ ...prev, includeAlerts: e.target.checked }))}
                                            className="h-4 w-4 rounded border-[#e5e7eb]"
                                        />
                                        <span className="text-[14px] text-[#0a0a0a]">Alert History</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeCompliance}
                                            onChange={(e) => setReportConfig((prev) => ({ ...prev, includeCompliance: e.target.checked }))}
                                            className="h-4 w-4 rounded border-[#e5e7eb]"
                                        />
                                        <span className="text-[14px] text-[#0a0a0a]">Compliance Status</span>
                                    </label>
                                </div>
                            </div>

                            {/* Format */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-medium text-[#0a0a0a]">Export Format</label>
                                <div className="flex gap-3">
                                    {(["PDF", "CSV", "Excel"] as const).map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setReportConfig((prev) => ({ ...prev, format }))}
                                            className={`flex-1 rounded-lg border px-4 py-2 text-[14px] transition-colors ${
                                                reportConfig.format === format
                                                    ? "border-[#1447e6] bg-[#eff6ff] text-[#1447e6]"
                                                    : "border-[#e5e7eb] bg-white text-[#0a0a0a] hover:bg-[#f9fafb]"
                                            }`}
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleGenerateReport}
                                disabled={isGeneratingReport}
                                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#030213] text-[14px] text-white transition-colors hover:bg-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isGeneratingReport ? (
                                    "Generating..."
                                ) : (
                                    <>
                                        <img src={imgIconDownload} alt="" className="h-4 w-4 brightness-0 invert" />
                                        Generate Report
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="flex h-10 w-24 items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Aircraft Data Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEditModal(false)}>
                    <div className="w-full max-w-sm rounded-[14px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-[20px] font-bold text-[#0a0a0a]">Edit Aircraft Data</h2>
                        <p className="text-[14px] text-[#6a7282]">Update flight hours and cycles</p>

                        <div className="mt-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Flight Hours</label>
                                <input
                                    type="text"
                                    value={editForm.flightHours}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, flightHours: e.target.value }))}
                                    placeholder="e.g., 24,500"
                                    className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Total Cycles</label>
                                <input
                                    type="text"
                                    value={editForm.totalCycles}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, totalCycles: e.target.value }))}
                                    placeholder="e.g., 15,200"
                                    className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6]"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleUpdateAircraftData}
                                className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#030213] text-[14px] text-white transition-colors hover:bg-[#1a1a2e]"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex h-10 w-24 items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit System Health Modal */}
            {editingSystem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingSystem(null)}>
                    <div className="w-full max-w-sm rounded-[14px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-[20px] font-bold text-[#0a0a0a]">Edit {editingSystem.name} Health</h2>
                        <p className="text-[14px] text-[#6a7282]">Update the health percentage</p>

                        <div className="mt-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Health Percentage</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={systemEditValue}
                                        onChange={(e) => setSystemEditValue(Number(e.target.value))}
                                        className="h-2 flex-1 appearance-none rounded-lg bg-[#e5e7eb]"
                                    />
                                    <span className={`text-[24px] font-bold ${getHealthColor(systemEditValue)}`}>
                                        {systemEditValue}%
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-lg bg-[#f9fafb] p-3">
                                <p className="text-[12px] text-[#6a7282]">
                                    Last updated: {editingSystem.lastUpdated}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleUpdateSystemHealth}
                                className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#030213] text-[14px] text-white transition-colors hover:bg-[#1a1a2e]"
                            >
                                Update Health
                            </button>
                            <button
                                onClick={() => setEditingSystem(null)}
                                className="flex h-10 w-24 items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

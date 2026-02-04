/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 6:3
 * specHash: sha256:maintenance-logs-page-v2
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";

// Figma assets for Maintenance Logs Page (node 6:3)
const imgIcon = "https://www.figma.com/api/mcp/asset/26b70c61-de66-4a5a-8c9d-bc7b7fb8bac4"; // Check circle
const imgIcon1 = "https://www.figma.com/api/mcp/asset/0004aa6d-7855-449b-8d6a-5123feabc517"; // Wrench
const imgIconAdd = "https://www.figma.com/api/mcp/asset/f611f83d-0fcb-4ca7-a928-4518be1da012"; // Add icon
const imgIconSearch = "https://www.figma.com/api/mcp/asset/a5ba47cc-4cee-4c7c-88fd-52a18d0db2a6"; // Search
const imgIconFilter = "https://www.figma.com/api/mcp/asset/009f48a9-347e-435e-8b18-7659fddd1549"; // Filter/chevron
const imgIconDelete = "https://www.figma.com/api/mcp/asset/9c465959-c5a0-4a85-bd4a-ff737082f05a"; // Delete
const imgIconEdit = "https://www.figma.com/api/mcp/asset/96384e1b-be36-46fa-8ee4-f20fb52d2614"; // Edit
const imgIconView = "https://www.figma.com/api/mcp/asset/64dc51eb-eea4-475a-a4e1-21eb8c6a10a1"; // View/eye
const imgIconClock = "https://www.figma.com/api/mcp/asset/35406d2c-d82b-4932-88b4-3f26867349be"; // Clock
const imgIconCalendar = "https://www.figma.com/api/mcp/asset/e5a390b2-4015-4e9f-9c01-71350cbb5b86"; // Calendar
const imgIconUser = "https://www.figma.com/api/mcp/asset/1d55ad69-247a-462a-b2a8-da30cab89dc7"; // User

// Types
type LogStatus = "COMPLETED" | "IN_PROGRESS" | "SCHEDULED";

interface MaintenanceLog {
    id: string;
    title: string;
    description: string;
    technician: string;
    date: string;
    duration: string;
    status: LogStatus;
    category: string;
    parts?: string[];
    notes?: string;
}

interface UpcomingTask {
    id: string;
    title: string;
    description: string;
    scheduledDate: string;
    estimatedDuration: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    assignedTechnician: string;
}

interface NewLogForm {
    title: string;
    description: string;
    technician: string;
    date: string;
    duration: string;
    status: LogStatus;
    category: string;
    parts: string;
    notes: string;
}

// Category options
const categories = [
    "A-Check",
    "B-Check",
    "C-Check",
    "D-Check",
    "Line Maintenance",
    "Avionics",
    "Engine",
    "Landing Gear",
    "Hydraulics",
    "Electrical",
    "Structural",
    "Other",
];

// Status options
const statusOptions: LogStatus[] = ["COMPLETED", "IN_PROGRESS", "SCHEDULED"];

// Initial maintenance logs
const initialLogs: MaintenanceLog[] = [
    {
        id: "log-1",
        title: "A-Check Inspection",
        description: "Complete A-Check including visual inspection, lubrication, and minor repairs",
        technician: "John Anderson",
        date: "2025-12-10",
        duration: "18 hrs",
        status: "COMPLETED",
        category: "A-Check",
        parts: ["Oil Filter", "Brake Pads"],
        notes: "All inspections passed. Aircraft cleared for service.",
    },
    {
        id: "log-2",
        title: "Avionics Software Update",
        description: "Critical avionics software update for FMS and TCAS systems",
        technician: "Sarah Williams",
        date: "2025-11-05",
        duration: "4 hrs",
        status: "COMPLETED",
        category: "Avionics",
        parts: [],
        notes: "FMS updated to v3.2.1, TCAS updated to v2.1.0",
    },
    {
        id: "log-3",
        title: "Landing Gear Inspection",
        description: "Routine landing gear inspection and hydraulic fluid check",
        technician: "Mike Chen",
        date: "2025-12-15",
        duration: "6 hrs",
        status: "IN_PROGRESS",
        category: "Landing Gear",
        parts: ["Hydraulic Fluid MIL-PRF-5606"],
        notes: "In progress - hydraulic seals being replaced",
    },
    {
        id: "log-4",
        title: "Engine Borescope Inspection",
        description: "Scheduled borescope inspection of both engines",
        technician: "Emily Davis",
        date: "2025-12-20",
        duration: "8 hrs",
        status: "SCHEDULED",
        category: "Engine",
        parts: [],
        notes: "Scheduled for next week",
    },
];

// Initial upcoming tasks
const initialUpcomingTasks: UpcomingTask[] = [];

// Initial form state
const emptyForm: NewLogForm = {
    title: "",
    description: "",
    technician: "",
    date: "",
    duration: "",
    status: "SCHEDULED",
    category: "",
    parts: "",
    notes: "",
};

export default function MaintenanceLogsPage() {
    // State
    const [logs, setLogs] = useState<MaintenanceLog[]>(initialLogs);
    const [upcomingTasks] = useState<UpcomingTask[]>(initialUpcomingTasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<LogStatus | "ALL">("ALL");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState<MaintenanceLog | null>(null);
    const [formData, setFormData] = useState<NewLogForm>(emptyForm);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showCategoryFilterDropdown, setShowCategoryFilterDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    // Filter logs based on search and filters
    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.technician.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
        const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Show notification
    const showNotification = useCallback((message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Handle form input changes
    const handleFormChange = (field: keyof NewLogForm, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Reset form
    const resetForm = () => {
        setFormData(emptyForm);
        setShowStatusDropdown(false);
        setShowCategoryDropdown(false);
    };

    // Add new log
    const handleAddLog = async () => {
        if (!formData.title || !formData.technician || !formData.date) {
            showNotification("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newLog: MaintenanceLog = {
            id: `log-${Date.now()}`,
            title: formData.title,
            description: formData.description,
            technician: formData.technician,
            date: formData.date,
            duration: formData.duration || "TBD",
            status: formData.status,
            category: formData.category || "Other",
            parts: formData.parts ? formData.parts.split(",").map((p) => p.trim()) : [],
            notes: formData.notes,
        };

        setLogs((prev) => [newLog, ...prev]);
        setIsSubmitting(false);
        setShowAddModal(false);
        resetForm();
        showNotification("Maintenance log added successfully!");
    };

    // Edit log
    const handleEditLog = async () => {
        if (!selectedLog) return;

        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const updatedLog: MaintenanceLog = {
            ...selectedLog,
            title: formData.title,
            description: formData.description,
            technician: formData.technician,
            date: formData.date,
            duration: formData.duration,
            status: formData.status,
            category: formData.category,
            parts: formData.parts ? formData.parts.split(",").map((p) => p.trim()) : [],
            notes: formData.notes,
        };

        setLogs((prev) => prev.map((log) => (log.id === selectedLog.id ? updatedLog : log)));
        setIsSubmitting(false);
        setShowEditModal(false);
        setSelectedLog(null);
        resetForm();
        showNotification("Maintenance log updated successfully!");
    };

    // Delete log
    const handleDeleteLog = (id: string) => {
        setLogs((prev) => prev.filter((log) => log.id !== id));
        showNotification("Maintenance log deleted");
    };

    // View log details
    const openViewModal = (log: MaintenanceLog) => {
        setSelectedLog(log);
        setShowViewModal(true);
    };

    // Open edit modal
    const openEditModal = (log: MaintenanceLog) => {
        setSelectedLog(log);
        setFormData({
            title: log.title,
            description: log.description,
            technician: log.technician,
            date: log.date,
            duration: log.duration,
            status: log.status,
            category: log.category,
            parts: log.parts?.join(", ") || "",
            notes: log.notes || "",
        });
        setShowEditModal(true);
    };

    // Update log status directly
    const updateLogStatus = (id: string, newStatus: LogStatus) => {
        setLogs((prev) =>
            prev.map((log) => (log.id === id ? { ...log, status: newStatus } : log))
        );
        showNotification(`Log status updated to ${newStatus}`);
    };

    // Get status badge styles
    const getStatusStyles = (status: LogStatus) => {
        switch (status) {
            case "COMPLETED":
                return "bg-[#dcfce7] text-[#016630]";
            case "IN_PROGRESS":
                return "bg-[#fef9c2] text-[#a65f00]";
            case "SCHEDULED":
                return "bg-[#dbeafe] text-[#1447e6]";
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6" data-name="SkyMaintain Maintenance Logs" data-node-id="6:3">
            {/* Notification */}
            {notification && (
                <div className="fixed right-4 top-4 z-50 rounded-lg border border-[#22c55e] bg-[#dcfce7] px-4 py-3 shadow-lg">
                    <p className="text-[14px] text-[#008236]">{notification}</p>
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between" data-name="Container" data-node-id="6:8">
                <h1 className="text-[24px] font-bold leading-8 text-[#0a0a0a]" data-name="Heading 2" data-node-id="6:9">
                    Maintenance Logs - N123AB
                </h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex h-9 items-center gap-2 rounded-lg bg-[#030213] px-4 text-[14px] text-white transition-colors hover:bg-[#1a1a2e]"
                >
                    <img src={imgIconAdd} alt="" className="h-4 w-4 brightness-0 invert" />
                    Add New Log
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <img src={imgIconSearch} alt="" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search logs by title, description, or technician..."
                        className="h-10 w-full rounded-lg border border-[#e5e7eb] bg-white pl-10 pr-4 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowFilterDropdown(!showFilterDropdown);
                            setShowCategoryFilterDropdown(false);
                        }}
                        className="flex h-10 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 text-[14px] hover:border-[#1447e6]"
                    >
                        <span>Status: {statusFilter === "ALL" ? "All" : statusFilter}</span>
                        <img src={imgIconFilter} alt="" className={`h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showFilterDropdown && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                            <button
                                onClick={() => {
                                    setStatusFilter("ALL");
                                    setShowFilterDropdown(false);
                                }}
                                className="w-full px-4 py-2 text-left text-[14px] hover:bg-[#eff6ff]"
                            >
                                All
                            </button>
                            {statusOptions.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setShowFilterDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-[14px] hover:bg-[#eff6ff]"
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowCategoryFilterDropdown(!showCategoryFilterDropdown);
                            setShowFilterDropdown(false);
                        }}
                        className="flex h-10 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 text-[14px] hover:border-[#1447e6]"
                    >
                        <span>Category: {categoryFilter === "ALL" ? "All" : categoryFilter}</span>
                        <img src={imgIconFilter} alt="" className={`h-4 w-4 transition-transform ${showCategoryFilterDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showCategoryFilterDropdown && (
                        <div className="absolute right-0 top-full z-10 mt-1 max-h-60 w-48 overflow-auto rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                            <button
                                onClick={() => {
                                    setCategoryFilter("ALL");
                                    setShowCategoryFilterDropdown(false);
                                }}
                                className="w-full px-4 py-2 text-left text-[14px] hover:bg-[#eff6ff]"
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setCategoryFilter(cat);
                                        setShowCategoryFilterDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-[14px] hover:bg-[#eff6ff]"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Maintenance Logs Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6" data-name="Card" data-node-id="6:10">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4" data-name="MaintenanceLogsPanel" data-node-id="6:11">
                    <h2 className="text-[20px] font-bold leading-7 text-[#0a0a0a]" data-node-id="6:12">
                        Maintenance Logs
                    </h2>
                    <span className="text-[14px] text-[#6a7282]">
                        {filteredLogs.length} {filteredLogs.length === 1 ? "entry" : "entries"}
                    </span>
                </div>

                {/* Log Entries */}
                <div className="mt-6 flex flex-col gap-3" data-name="MaintenanceLogsPanel" data-node-id="6:13">
                    {filteredLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <img src={imgIcon1} alt="" className="h-12 w-12 opacity-30" />
                            <p className="mt-4 text-[16px] text-[#6a7282]">No maintenance logs found</p>
                            <p className="text-[14px] text-[#9ca3af]">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-start justify-between rounded-[10px] border border-[#e5e7eb] px-4 py-4 transition-colors hover:border-[#1447e6]/30 hover:bg-[#f9fafb]"
                                data-name="Container"
                                data-node-id="6:14"
                            >
                                <div className="flex gap-2" data-name="Container" data-node-id="6:16">
                                    <img
                                        src={imgIcon}
                                        alt=""
                                        className="h-4 w-4 shrink-0 mt-1"
                                        data-name="Icon"
                                        data-node-id="6:17"
                                    />
                                    <div className="flex flex-col gap-1" data-name="Container" data-node-id="6:20">
                                        <div className="flex items-center gap-2" data-name="Container" data-node-id="6:21">
                                            <h3 className="text-[14px] font-medium leading-5 text-[#0a0a0a]" data-name="Heading 3" data-node-id="6:22">
                                                {log.title}
                                            </h3>
                                            <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-[10px] text-[#6a7282]">
                                                {log.category}
                                            </span>
                                        </div>
                                        <p className="text-[12px] leading-4 text-[#4a5565]" data-name="Paragraph" data-node-id="6:24">
                                            {log.description}
                                        </p>
                                        <div className="flex items-center gap-3 text-[12px] leading-4 text-[#6a7282]" data-name="Container" data-node-id="6:26">
                                            <span className="flex items-center gap-1">
                                                <img src={imgIconUser} alt="" className="h-3 w-3" />
                                                {log.technician}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <img src={imgIconCalendar} alt="" className="h-3 w-3" />
                                                {log.date}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <img src={imgIconClock} alt="" className="h-3 w-3" />
                                                {log.duration}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Status Badge with dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                const nextStatus: Record<LogStatus, LogStatus> = {
                                                    SCHEDULED: "IN_PROGRESS",
                                                    IN_PROGRESS: "COMPLETED",
                                                    COMPLETED: "SCHEDULED",
                                                };
                                                updateLogStatus(log.id, nextStatus[log.status]);
                                            }}
                                            className={`cursor-pointer rounded-lg px-2 py-[3px] text-[12px] leading-4 transition-opacity hover:opacity-80 ${getStatusStyles(log.status)}`}
                                            title="Click to change status"
                                            data-name="Badge"
                                            data-node-id="6:37"
                                        >
                                            {log.status.replace("_", " ")}
                                        </button>
                                    </div>
                                    {/* View Button */}
                                    <button
                                        onClick={() => openViewModal(log)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#eff6ff]"
                                        title="View Details"
                                    >
                                        <img src={imgIconView} alt="" className="h-4 w-4" />
                                    </button>
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => openEditModal(log)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#eff6ff]"
                                        title="Edit"
                                    >
                                        <img src={imgIconEdit} alt="" className="h-4 w-4" />
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteLog(log.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#ffe2e2]"
                                        title="Delete"
                                    >
                                        <img src={imgIconDelete} alt="" className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Upcoming Maintenance Tasks Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6" data-name="Card" data-node-id="6:64">
                {/* Card Header */}
                <div className="border-b border-[#e5e7eb] pb-4" data-name="MaintenanceTasksPanel" data-node-id="6:65">
                    <h2 className="text-[20px] font-bold leading-7 text-[#0a0a0a]" data-node-id="6:66">
                        Upcoming Maintenance Tasks
                    </h2>
                </div>

                {/* Empty State or Tasks */}
                {upcomingTasks.length === 0 ? (
                    <div className="mt-6 flex flex-col items-center justify-center py-8" data-name="MaintenanceTasksPanel" data-node-id="6:67">
                        <img src={imgIcon1} alt="" className="h-12 w-12 opacity-30" data-name="Icon" data-node-id="6:68" />
                        <p className="mt-4 text-center text-[16px] leading-6 text-[#6a7282]" data-name="Paragraph" data-node-id="6:70">
                            No upcoming maintenance tasks for N123AB
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col gap-3">
                        {upcomingTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start justify-between rounded-[10px] border border-[#e5e7eb] px-4 py-4"
                            >
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[14px] font-medium text-[#0a0a0a]">{task.title}</h3>
                                    <p className="text-[12px] text-[#4a5565]">{task.description}</p>
                                    <div className="flex items-center gap-3 text-[12px] text-[#6a7282]">
                                        <span>Scheduled: {task.scheduledDate}</span>
                                        <span>•</span>
                                        <span>Est. {task.estimatedDuration}</span>
                                        <span>•</span>
                                        <span>Assigned: {task.assignedTechnician}</span>
                                    </div>
                                </div>
                                <span
                                    className={`rounded-lg px-2 py-[3px] text-[12px] ${
                                        task.priority === "HIGH"
                                            ? "bg-[#ffe2e2] text-[#e7000b]"
                                            : task.priority === "MEDIUM"
                                            ? "bg-[#fef9c2] text-[#a65f00]"
                                            : "bg-[#dbeafe] text-[#1447e6]"
                                    }`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Log Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
                    <div className="w-full max-w-lg rounded-[14px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-[20px] font-bold text-[#0a0a0a]">Add New Maintenance Log</h2>
                        <p className="text-[14px] text-[#6a7282]">Fill in the details for the new maintenance entry</p>

                        <div className="mt-6 flex flex-col gap-4">
                            {/* Title */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleFormChange("title", e.target.value)}
                                    placeholder="e.g., A-Check Inspection"
                                    className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleFormChange("description", e.target.value)}
                                    placeholder="Describe the maintenance work performed..."
                                    rows={3}
                                    className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Technician */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">Technician *</label>
                                    <input
                                        type="text"
                                        value={formData.technician}
                                        onChange={(e) => handleFormChange("technician", e.target.value)}
                                        placeholder="e.g., John Anderson"
                                        className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                    />
                                </div>

                                {/* Date */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">Date *</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleFormChange("date", e.target.value)}
                                        className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Duration */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">Duration</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => handleFormChange("duration", e.target.value)}
                                        placeholder="e.g., 4 hrs"
                                        className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                    />
                                </div>

                                {/* Status */}
                                <div className="relative flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                        className="flex h-10 items-center justify-between rounded-lg border border-[#e5e7eb] px-3 text-left text-[14px] hover:border-[#1447e6]"
                                    >
                                        <span>{formData.status.replace("_", " ")}</span>
                                        <img src={imgIconFilter} alt="" className={`h-4 w-4 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
                                    </button>
                                    {showStatusDropdown && (
                                        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                                            {statusOptions.map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        handleFormChange("status", status);
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-[14px] hover:bg-[#eff6ff]"
                                                >
                                                    {status.replace("_", " ")}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            <div className="relative flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Category</label>
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="flex h-10 items-center justify-between rounded-lg border border-[#e5e7eb] px-3 text-left text-[14px] hover:border-[#1447e6]"
                                >
                                    <span>{formData.category || "Select category..."}</span>
                                    <img src={imgIconFilter} alt="" className={`h-4 w-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showCategoryDropdown && (
                                    <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    handleFormChange("category", cat);
                                                    setShowCategoryDropdown(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-[14px] hover:bg-[#eff6ff]"
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Parts Used */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Parts Used (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.parts}
                                    onChange={(e) => handleFormChange("parts", e.target.value)}
                                    placeholder="e.g., Oil Filter, Brake Pads"
                                    className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                />
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleFormChange("notes", e.target.value)}
                                    placeholder="Additional notes or observations..."
                                    rows={2}
                                    className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                />
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleAddLog}
                                disabled={isSubmitting}
                                className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#030213] text-[14px] text-white transition-colors hover:bg-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? "Adding..." : "Add Log"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="flex h-10 w-24 items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Log Modal */}
            {showViewModal && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowViewModal(false)}>
                    <div className="w-full max-w-lg rounded-[14px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-[20px] font-bold text-[#0a0a0a]">{selectedLog.title}</h2>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-[12px] text-[#6a7282]">
                                        {selectedLog.category}
                                    </span>
                                    <span className={`rounded-lg px-2 py-[3px] text-[12px] ${getStatusStyles(selectedLog.status)}`}>
                                        {selectedLog.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-[20px] text-[#6a7282] hover:text-[#0a0a0a]"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            <div>
                                <h4 className="text-[12px] font-medium text-[#6a7282]">Description</h4>
                                <p className="mt-1 text-[14px] text-[#0a0a0a]">{selectedLog.description}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <h4 className="text-[12px] font-medium text-[#6a7282]">Technician</h4>
                                    <p className="mt-1 text-[14px] text-[#0a0a0a]">{selectedLog.technician}</p>
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-medium text-[#6a7282]">Date</h4>
                                    <p className="mt-1 text-[14px] text-[#0a0a0a]">{selectedLog.date}</p>
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-medium text-[#6a7282]">Duration</h4>
                                    <p className="mt-1 text-[14px] text-[#0a0a0a]">{selectedLog.duration}</p>
                                </div>
                            </div>

                            {selectedLog.parts && selectedLog.parts.length > 0 && (
                                <div>
                                    <h4 className="text-[12px] font-medium text-[#6a7282]">Parts Used</h4>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {selectedLog.parts.map((part, idx) => (
                                            <span key={idx} className="rounded-lg bg-[#dbeafe] px-2 py-1 text-[12px] text-[#1447e6]">
                                                {part}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedLog.notes && (
                                <div>
                                    <h4 className="text-[12px] font-medium text-[#6a7282]">Notes</h4>
                                    <p className="mt-1 text-[14px] text-[#0a0a0a]">{selectedLog.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    openEditModal(selectedLog);
                                }}
                                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#030213] text-[14px] text-white transition-colors hover:bg-[#1a1a2e]"
                            >
                                <img src={imgIconEdit} alt="" className="h-4 w-4 brightness-0 invert" />
                                Edit Log
                            </button>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="flex h-10 w-24 items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a] transition-colors hover:bg-[#f9fafb]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Log Modal */}
            {showEditModal && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEditModal(false)}>
                    <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-[14px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-[20px] font-bold text-[#0a0a0a]">Edit Maintenance Log</h2>
                        <p className="text-[14px] text-[#6a7282]">Update the maintenance log details</p>

                        <div className="mt-6 flex flex-col gap-4">
                            {/* Title */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleFormChange("title", e.target.value)}
                                    className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleFormChange("description", e.target.value)}
                                    rows={3}
                                    className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Technician */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">Technician *</label>
                                    <input
                                        type="text"
                                        value={formData.technician}
                                        onChange={(e) => handleFormChange("technician", e.target.value)}
                                        className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                    />
                                </div>

                                {/* Date */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">Date *</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleFormChange("date", e.target.value)}
                                        className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Duration */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">Duration</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => handleFormChange("duration", e.target.value)}
                                        className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                    />
                                </div>

                                {/* Status */}
                                <div className="relative flex flex-col gap-2">
                                    <label className="text-[14px] text-[#0a0a0a]">Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                        className="flex h-10 items-center justify-between rounded-lg border border-[#e5e7eb] px-3 text-left text-[14px] hover:border-[#1447e6]"
                                    >
                                        <span>{formData.status.replace("_", " ")}</span>
                                        <img src={imgIconFilter} alt="" className={`h-4 w-4 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
                                    </button>
                                    {showStatusDropdown && (
                                        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                                            {statusOptions.map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        handleFormChange("status", status);
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-[14px] hover:bg-[#eff6ff]"
                                                >
                                                    {status.replace("_", " ")}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            <div className="relative flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Category</label>
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="flex h-10 items-center justify-between rounded-lg border border-[#e5e7eb] px-3 text-left text-[14px] hover:border-[#1447e6]"
                                >
                                    <span>{formData.category || "Select category..."}</span>
                                    <img src={imgIconFilter} alt="" className={`h-4 w-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showCategoryDropdown && (
                                    <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    handleFormChange("category", cat);
                                                    setShowCategoryDropdown(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-[14px] hover:bg-[#eff6ff]"
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Parts Used */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Parts Used (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.parts}
                                    onChange={(e) => handleFormChange("parts", e.target.value)}
                                    className="h-10 rounded-lg border border-[#e5e7eb] px-3 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                />
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] text-[#0a0a0a]">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleFormChange("notes", e.target.value)}
                                    rows={2}
                                    className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]/20"
                                />
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleEditLog}
                                disabled={isSubmitting}
                                className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#030213] text-[14px] text-white transition-colors hover:bg-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedLog(null);
                                    resetForm();
                                }}
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

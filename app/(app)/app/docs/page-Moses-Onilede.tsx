/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 2:2101
 * specHash: sha256:documentation-page-v2
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useCallback } from "react";

// Figma assets for Documentation Page (node 2:2101)
const imgIcon = "https://www.figma.com/api/mcp/asset/91894b65-def4-419b-ba05-50aa8ce997c1";
const imgVector = "https://www.figma.com/api/mcp/asset/96384e1b-be36-46fa-8ee4-f20fb52d2614";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/3fc64b22-f049-4fde-84f9-35312516aba0";
const imgIcon2 = "https://www.figma.com/api/mcp/asset/009f48a9-347e-435e-8b18-7659fddd1549";
const imgIcon3 = "https://www.figma.com/api/mcp/asset/1d55ad69-247a-462a-b2a8-da30cab89dc7";
const imgIcon4 = "https://www.figma.com/api/mcp/asset/2e291a1d-3d08-4a2e-8747-9acd47b95ee0";
const imgIcon5 = "https://www.figma.com/api/mcp/asset/8cb066bd-292e-44c5-b36e-57443c6bd426";
const imgIcon6 = "https://www.figma.com/api/mcp/asset/e5a390b2-4015-4e9f-9c01-71350cbb5b86";
const imgIcon7 = "https://www.figma.com/api/mcp/asset/f611f83d-0fcb-4ca7-a928-4518be1da012";
const imgIcon8 = "https://www.figma.com/api/mcp/asset/ca729b02-c7dd-44a6-a06b-6dab7710af95";
const imgIcon9 = "https://www.figma.com/api/mcp/asset/76daf883-434e-4c16-a09b-fc852f81a05a";
const imgIcon10 = "https://www.figma.com/api/mcp/asset/35406d2c-d82b-4932-88b4-3f26867349be";
const imgIcon11 = "https://www.figma.com/api/mcp/asset/64dc51eb-eea4-475a-a4e1-21eb8c6a10a1";
const imgIcon12 = "https://www.figma.com/api/mcp/asset/9b9df8cb-42e3-4103-80b2-cf5255907a12";
const imgIcon13 = "https://www.figma.com/api/mcp/asset/9c465959-c5a0-4a85-bd4a-ff737082f05a";
const imgIcon14 = "https://www.figma.com/api/mcp/asset/cb22b977-535b-4c8a-8fd8-96859ea25832";
const imgIcon15 = "https://www.figma.com/api/mcp/asset/3c712b2f-0e83-4ab3-b5ed-09e29d7bc3f6";

// Types
interface MaintenanceFormData {
    aircraftRegistration: string;
    totalCycles: string;
    totalTimeInService: string;
    totalTimeSinceNew: string;
    totalTimeSinceOverhaul: string;
    maintenanceType: string;
    techFirstName: string;
    techLastName: string;
    techCertNumber: string;
    maintenanceDate: string;
}

interface DiscrepancyFormData {
    description: string;
    remedialAction: string;
    referenceManual: string;
}

interface UploadedDocument {
    id: string;
    name: string;
    date: string;
    size: string;
    category: string;
}

interface DiscrepancyReport {
    id: string;
    description: string;
    date: string;
    remedialAction: string;
    status: "Resolved" | "In Progress" | "Pending";
}

// Maintenance types dropdown options
const maintenanceTypes = [
    "A-Check",
    "B-Check",
    "C-Check",
    "D-Check",
    "Line Maintenance",
    "Heavy Maintenance",
    "Component Replacement",
    "Engine Overhaul",
    "Avionics Update",
    "Structural Repair",
];

// Reference manuals dropdown options
const referenceManuals = [
    "Aircraft Maintenance Manual (AMM)",
    "Illustrated Parts Catalog (IPC)",
    "Component Maintenance Manual (CMM)",
    "Structural Repair Manual (SRM)",
    "Wiring Diagram Manual (WDM)",
    "Fault Isolation Manual (FIM)",
    "Non-Destructive Testing Manual (NDTM)",
];

// Initial uploaded documents
const initialDocuments: UploadedDocument[] = [
    {
        id: "doc-1",
        name: "Engine_Inspection_Report_2025.pdf",
        date: "1/19/2025",
        size: "2.4 MB",
        category: "Inspection Reports",
    },
    {
        id: "doc-2",
        name: "Hydraulic_System_Maintenance.pdf",
        date: "1/17/2025",
        size: "1.8 MB",
        category: "Maintenance Records",
    },
    {
        id: "doc-3",
        name: "A-Check_Compliance_Certificate.pdf",
        date: "1/14/2025",
        size: "856 KB",
        category: "Compliance",
    },
];

// Initial discrepancy reports
const initialDiscrepancies: DiscrepancyReport[] = [
    {
        id: "disc-1",
        description: "Hydraulic fluid leak detected on left main landing gear",
        date: "1/19/2025",
        remedialAction: "Replaced faulty O-ring seal and replenished hydraulic fluid to specified level. Performed leak check - no leaks observed.",
        status: "Resolved",
    },
    {
        id: "disc-2",
        description: "Unusual vibration in engine #2 during high power settings",
        date: "1/21/2025",
        remedialAction: "Inspected engine mounts and performed borescope inspection. Pending detailed analysis.",
        status: "In Progress",
    },
];

export default function DocumentationPage() {
    // Maintenance Form State
    const [maintenanceForm, setMaintenanceForm] = useState<MaintenanceFormData>({
        aircraftRegistration: "N123AB",
        totalCycles: "",
        totalTimeInService: "",
        totalTimeSinceNew: "",
        totalTimeSinceOverhaul: "",
        maintenanceType: "",
        techFirstName: "",
        techLastName: "",
        techCertNumber: "",
        maintenanceDate: "",
    });

    // Discrepancy Form State
    const [discrepancyForm, setDiscrepancyForm] = useState<DiscrepancyFormData>({
        description: "",
        remedialAction: "",
        referenceManual: "",
    });

    // Documents State
    const [documents, setDocuments] = useState<UploadedDocument[]>(initialDocuments);
    const [discrepancies, setDiscrepancies] = useState<DiscrepancyReport[]>(initialDiscrepancies);

    // Dropdown states
    const [showMaintenanceTypeDropdown, setShowMaintenanceTypeDropdown] = useState(false);
    const [showReferenceManualDropdown, setShowReferenceManualDropdown] = useState(false);

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Drag and drop state
    const [isDragging, setIsDragging] = useState(false);

    // Form submission states
    const [maintenanceSubmitting, setMaintenanceSubmitting] = useState(false);
    const [discrepancySubmitting, setDiscrepancySubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    // Handle maintenance form changes
    const handleMaintenanceChange = (field: keyof MaintenanceFormData, value: string) => {
        setMaintenanceForm(prev => ({ ...prev, [field]: value }));
    };

    // Handle discrepancy form changes
    const handleDiscrepancyChange = (field: keyof DiscrepancyFormData, value: string) => {
        setDiscrepancyForm(prev => ({ ...prev, [field]: value }));
    };

    // Reset maintenance form
    const resetMaintenanceForm = () => {
        setMaintenanceForm({
            aircraftRegistration: "N123AB",
            totalCycles: "",
            totalTimeInService: "",
            totalTimeSinceNew: "",
            totalTimeSinceOverhaul: "",
            maintenanceType: "",
            techFirstName: "",
            techLastName: "",
            techCertNumber: "",
            maintenanceDate: "",
        });
    };

    // Reset discrepancy form
    const resetDiscrepancyForm = () => {
        setDiscrepancyForm({
            description: "",
            remedialAction: "",
            referenceManual: "",
        });
    };

    // Submit maintenance documentation
    const submitMaintenanceDocumentation = async () => {
        setMaintenanceSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMaintenanceSubmitting(false);
        setSubmitSuccess("Maintenance documentation submitted successfully!");
        setTimeout(() => setSubmitSuccess(null), 3000);
        resetMaintenanceForm();
    };

    // Submit discrepancy report
    const submitDiscrepancyReport = async () => {
        setDiscrepancySubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Add new discrepancy to list
        const newDiscrepancy: DiscrepancyReport = {
            id: `disc-${Date.now()}`,
            description: discrepancyForm.description,
            date: new Date().toLocaleDateString("en-US"),
            remedialAction: discrepancyForm.remedialAction,
            status: "Pending",
        };
        setDiscrepancies(prev => [newDiscrepancy, ...prev]);

        setDiscrepancySubmitting(false);
        setSubmitSuccess("Discrepancy report submitted successfully!");
        setTimeout(() => setSubmitSuccess(null), 3000);
        resetDiscrepancyForm();
    };

    // Handle file upload
    const handleFileUpload = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;

        const newDocs: UploadedDocument[] = Array.from(files).map(file => ({
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            date: new Date().toLocaleDateString("en-US"),
            size: file.size > 1024 * 1024
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                : `${Math.round(file.size / 1024)} KB`,
            category: file.name.toLowerCase().includes("compliance") ? "Compliance"
                : file.name.toLowerCase().includes("inspection") ? "Inspection Reports"
                    : "Maintenance Records",
        }));

        setDocuments(prev => [...newDocs, ...prev]);
    }, []);

    // Handle drag events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    // Delete document
    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    // Delete discrepancy
    const deleteDiscrepancy = (id: string) => {
        setDiscrepancies(prev => prev.filter(disc => disc.id !== id));
    };

    // View document (mock)
    const viewDocument = (name: string) => {
        alert(`Opening document: ${name}`);
    };

    // Download document (mock)
    const downloadDocument = (name: string) => {
        alert(`Downloading: ${name}`);
    };

    return (
        <div className="flex flex-col gap-6 p-6" data-name="SkyMaintain Documentation Page" data-node-id="2:2101">
            {/* Success notification */}
            {submitSuccess && (
                <div className="fixed top-4 right-4 z-50 rounded-lg bg-[#dcfce7] border border-[#22c55e] px-4 py-3 shadow-lg">
                    <p className="text-[14px] text-[#008236]">{submitSuccess}</p>
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between" data-name="Container" data-node-id="2:2106">
                <div data-name="Container" data-node-id="2:2107">
                    <h1 className="text-[24px] font-bold leading-8 text-[#0a0a0a]" data-name="Heading 2" data-node-id="2:2108">
                        Aircraft Documentation
                    </h1>
                    <p className="text-[16px] leading-6 text-[#4a5565]" data-name="Paragraph" data-node-id="2:2110">
                        Record maintenance activities and manage aircraft documentation
                    </p>
                </div>
                <div className="flex h-[34px] items-center gap-2 rounded-lg bg-[#dbeafe] px-4" data-name="Badge" data-node-id="2:2112">
                    <img src={imgIcon} alt="" className="h-3 w-3" />
                    <span className="text-[12px] leading-4 text-[#1447e6]">Official Records</span>
                </div>
            </div>

            {/* Maintenance Documentation Form Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6" data-name="Card" data-node-id="2:2120">
                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4" data-name="DocumentationPanel" data-node-id="2:2121">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#dbeafe]">
                        <img src={imgVector} alt="" className="h-[18px] w-[18px]" />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-bold leading-7 text-[#0a0a0a]">
                            Maintenance Documentation Form
                        </h2>
                        <p className="text-[14px] leading-5 text-[#4a5565]">
                            Complete all required fields for maintenance record submission
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <div className="mt-12 flex flex-col gap-6" data-name="DocumentationPanel" data-node-id="2:2130">
                    {/* Aircraft Information Section */}
                    <div className="flex flex-col gap-4" data-name="Container" data-node-id="2:2131">
                        <div className="flex items-center gap-2" data-name="Heading 4" data-node-id="2:2132">
                            <img src={imgIcon1} alt="" className="h-5 w-5" />
                            <h3 className="text-[18px] font-bold leading-7 text-[#0a0a0a]">
                                Aircraft Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4" data-name="Container" data-node-id="2:2136">
                            {/* Aircraft Registration */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Aircraft Registration *
                                </label>
                                <input
                                    type="text"
                                    value={maintenanceForm.aircraftRegistration}
                                    onChange={(e) => handleMaintenanceChange("aircraftRegistration", e.target.value)}
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>

                            {/* Total Cycles */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Total Cycles *
                                </label>
                                <input
                                    type="number"
                                    value={maintenanceForm.totalCycles}
                                    onChange={(e) => handleMaintenanceChange("totalCycles", e.target.value)}
                                    placeholder="e.g., 15000"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>

                            {/* Total Time in Service */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Total Time in Service (Hours) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={maintenanceForm.totalTimeInService}
                                    onChange={(e) => handleMaintenanceChange("totalTimeInService", e.target.value)}
                                    placeholder="e.g., 25000.5"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>

                            {/* Total Time Since New */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Total Time Since New (Hours) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={maintenanceForm.totalTimeSinceNew}
                                    onChange={(e) => handleMaintenanceChange("totalTimeSinceNew", e.target.value)}
                                    placeholder="e.g., 30000.0"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>
                        </div>

                        {/* Total Time Since Overhaul - Full Width */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Total Time Since Overhaul (Hours) *
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={maintenanceForm.totalTimeSinceOverhaul}
                                onChange={(e) => handleMaintenanceChange("totalTimeSinceOverhaul", e.target.value)}
                                placeholder="e.g., 5000.5"
                                className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                            />
                        </div>

                        {/* Last Maintenance Type - Dropdown */}
                        <div className="relative flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Last Maintenance Type *
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowMaintenanceTypeDropdown(!showMaintenanceTypeDropdown)}
                                className="flex h-[42px] items-center justify-between rounded-[10px] border border-[#d1d5dc] bg-white px-4 text-left hover:border-[#1447e6] focus:outline-none focus:ring-2 focus:ring-[#1447e6]"
                            >
                                <span className={`text-[16px] ${maintenanceForm.maintenanceType ? "text-[#0a0a0a]" : "text-[#6a7282]"}`}>
                                    {maintenanceForm.maintenanceType || "Select maintenance type..."}
                                </span>
                                <img src={imgIcon2} alt="" className={`h-5 w-5 transition-transform ${showMaintenanceTypeDropdown ? "rotate-180" : ""}`} />
                            </button>
                            {showMaintenanceTypeDropdown && (
                                <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-[10px] border border-[#e5e7eb] bg-white shadow-lg">
                                    {maintenanceTypes.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                handleMaintenanceChange("maintenanceType", type);
                                                setShowMaintenanceTypeDropdown(false);
                                            }}
                                            className="w-full px-4 py-3 text-left text-[14px] text-[#0a0a0a] hover:bg-[#eff6ff]"
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Technician Information Section */}
                    <div className="flex flex-col gap-4" data-name="Container" data-node-id="2:2170">
                        <div className="flex items-center gap-2" data-name="Heading 4" data-node-id="2:2171">
                            <img src={imgIcon3} alt="" className="h-5 w-5" />
                            <h3 className="text-[18px] font-bold leading-7 text-[#0a0a0a]">
                                Technician Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Technician First Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Technician First Name *
                                </label>
                                <input
                                    type="text"
                                    value={maintenanceForm.techFirstName}
                                    onChange={(e) => handleMaintenanceChange("techFirstName", e.target.value)}
                                    placeholder="e.g., John"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>

                            {/* Technician Last Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Technician Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={maintenanceForm.techLastName}
                                    onChange={(e) => handleMaintenanceChange("techLastName", e.target.value)}
                                    placeholder="e.g., Smith"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>
                        </div>

                        {/* Technician Certificate Number */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Technician Certificate Number *
                            </label>
                            <div className="flex items-center gap-2">
                                <img src={imgIcon4} alt="" className="h-10 w-10" />
                                <input
                                    type="text"
                                    value={maintenanceForm.techCertNumber}
                                    onChange={(e) => handleMaintenanceChange("techCertNumber", e.target.value)}
                                    placeholder="e.g., A&P-12345678"
                                    className="h-9 flex-1 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Date Section */}
                    <div className="flex flex-col gap-4" data-name="Container" data-node-id="2:2196">
                        <div className="flex items-center gap-2" data-name="Heading 4" data-node-id="2:2197">
                            <img src={imgIcon5} alt="" className="h-5 w-5" />
                            <h3 className="text-[18px] font-bold leading-7 text-[#0a0a0a]">
                                Maintenance Date
                            </h3>
                        </div>

                        <div className="relative flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Select Date *
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={maintenanceForm.maintenanceDate}
                                    onChange={(e) => handleMaintenanceChange("maintenanceDate", e.target.value)}
                                    className="h-[42px] w-full rounded-[10px] border border-[#d1d5dc] bg-white px-4 pl-10 text-[16px] text-[#0a0a0a] outline-none focus:border-[#1447e6] focus:ring-2 focus:ring-[#1447e6]"
                                />
                                <img src={imgIcon6} alt="" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 border-t border-[#e5e7eb] pt-4" data-name="Container" data-node-id="2:2218">
                        <button
                            type="button"
                            onClick={submitMaintenanceDocumentation}
                            disabled={maintenanceSubmitting}
                            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#030213] text-[14px] text-white hover:bg-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {maintenanceSubmitting ? (
                                <span>Submitting...</span>
                            ) : (
                                <>
                                    <img src={imgIcon7} alt="" className="h-4 w-4" />
                                    Submit Documentation
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={resetMaintenanceForm}
                            className="flex h-9 w-[105px] items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a] hover:bg-[#f9fafb] transition-colors"
                        >
                            Reset Form
                        </button>
                    </div>
                </div>
            </div>

            {/* Upload Supporting Documents Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6" data-name="Card" data-node-id="2:2226">
                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4" data-name="DocumentationPanel" data-node-id="2:2227">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#dcfce7]">
                        <img src={imgIcon8} alt="" className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-bold leading-7 text-[#0a0a0a]">
                            Upload Supporting Documents
                        </h2>
                        <p className="text-[14px] leading-5 text-[#4a5565]">
                            Upload maintenance reports, certificates, and compliance documentation
                        </p>
                    </div>
                </div>

                {/* Upload Zone */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-12 flex cursor-pointer flex-col items-center justify-center rounded-[10px] border-[1.6px] border-dashed py-8 transition-colors ${isDragging
                            ? "border-[#1447e6] bg-[#eff6ff]"
                            : "border-[#d1d5dc] bg-[#f9fafb] hover:border-[#1447e6] hover:bg-[#eff6ff]"
                        }`}
                    data-name="DocumentationPanel"
                    data-node-id="2:2238"
                >
                    <img src={imgIcon8} alt="" className="h-12 w-12" />
                    <p className="mt-4 text-[18px] leading-7 text-[#364153]">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-[14px] leading-5 text-[#6a7282]">
                        PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                    />
                </div>

                {/* Uploaded Documents */}
                <div className="mt-12 flex flex-col gap-4" data-name="DocumentationPanel" data-node-id="2:2248">
                    <div className="flex items-center gap-2" data-name="Heading 4" data-node-id="2:2249">
                        <img src={imgIcon9} alt="" className="h-5 w-5" />
                        <h3 className="text-[16px] font-bold leading-6 text-[#0a0a0a]">
                            Uploaded Documents ({documents.length})
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3" data-name="Container" data-node-id="2:2257">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white">
                                        <img src={imgIcon9} alt="" className="h-6 w-6" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[16px] leading-6 text-[#101828]">
                                            {doc.name}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <img src={imgIcon10} alt="" className="h-3 w-3" />
                                                <span className="text-[14px] leading-5 text-[#4a5565]">
                                                    {doc.date}
                                                </span>
                                            </div>
                                            <span className="text-[14px] leading-5 text-[#4a5565]">
                                                {doc.size}
                                            </span>
                                            <span className="rounded-lg bg-[#dbeafe] px-2 py-[3px] text-[12px] leading-4 text-[#1447e6]">
                                                {doc.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => viewDocument(doc.name)}
                                        className="flex h-8 w-9 items-center justify-center rounded-lg hover:bg-[#eff6ff] transition-colors"
                                        title="View"
                                    >
                                        <img src={imgIcon11} alt="" className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => downloadDocument(doc.name)}
                                        className="flex h-8 w-9 items-center justify-center rounded-lg hover:bg-[#eff6ff] transition-colors"
                                        title="Download"
                                    >
                                        <img src={imgIcon12} alt="" className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteDocument(doc.id)}
                                        className="flex h-8 w-9 items-center justify-center rounded-lg hover:bg-[#ffe2e2] transition-colors"
                                        title="Delete"
                                    >
                                        <img src={imgIcon13} alt="" className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Discrepancy Report Form Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6" data-name="Card" data-node-id="2:2375">
                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4" data-name="DocumentationPanel" data-node-id="2:2376">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#ffe2e2]">
                        <img src={imgIcon14} alt="" className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-bold leading-7 text-[#0a0a0a]">
                            Discrepancy Report Form
                        </h2>
                        <p className="text-[14px] leading-5 text-[#4a5565]">
                            Report any discrepancies found during maintenance
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <div className="mt-12 flex flex-col gap-6" data-name="DocumentationPanel" data-node-id="2:2387">
                    {/* Discrepancy Information Section */}
                    <div className="flex flex-col gap-4" data-name="Container" data-node-id="2:2388">
                        <div className="flex items-center gap-2" data-name="Heading 4" data-node-id="2:2389">
                            <img src={imgIcon14} alt="" className="h-5 w-5" />
                            <h3 className="text-[18px] font-bold leading-7 text-[#0a0a0a]">
                                Discrepancy Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Discrepancy Description */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Discrepancy Description *
                                </label>
                                <input
                                    type="text"
                                    value={discrepancyForm.description}
                                    onChange={(e) => handleDiscrepancyChange("description", e.target.value)}
                                    placeholder="e.g., Hydraulic fluid leak detected on left main landing gear"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>

                            {/* Remedial Action Taken */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Remedial Action Taken *
                                </label>
                                <input
                                    type="text"
                                    value={discrepancyForm.remedialAction}
                                    onChange={(e) => handleDiscrepancyChange("remedialAction", e.target.value)}
                                    placeholder="e.g., Replaced faulty O-ring seal and replenished hydraulic fluid to specified level."
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#1447e6]"
                                />
                            </div>
                        </div>

                        {/* Reference Manual - Dropdown */}
                        <div className="relative flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Reference Manual *
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowReferenceManualDropdown(!showReferenceManualDropdown)}
                                className="flex h-[42px] items-center justify-between rounded-[10px] border border-[#d1d5dc] bg-white px-4 text-left hover:border-[#1447e6] focus:outline-none focus:ring-2 focus:ring-[#1447e6]"
                            >
                                <span className={`text-[16px] ${discrepancyForm.referenceManual ? "text-[#0a0a0a]" : "text-[#6a7282]"}`}>
                                    {discrepancyForm.referenceManual || "Select reference manual..."}
                                </span>
                                <img src={imgIcon2} alt="" className={`h-5 w-5 transition-transform ${showReferenceManualDropdown ? "rotate-180" : ""}`} />
                            </button>
                            {showReferenceManualDropdown && (
                                <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-[10px] border border-[#e5e7eb] bg-white shadow-lg">
                                    {referenceManuals.map((manual) => (
                                        <button
                                            key={manual}
                                            type="button"
                                            onClick={() => {
                                                handleDiscrepancyChange("referenceManual", manual);
                                                setShowReferenceManualDropdown(false);
                                            }}
                                            className="w-full px-4 py-3 text-left text-[14px] text-[#0a0a0a] hover:bg-[#eff6ff]"
                                        >
                                            {manual}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 border-t border-[#e5e7eb] pt-4" data-name="Container" data-node-id="2:2414">
                        <button
                            type="button"
                            onClick={submitDiscrepancyReport}
                            disabled={discrepancySubmitting}
                            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#030213] text-[14px] text-white hover:bg-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {discrepancySubmitting ? (
                                <span>Submitting...</span>
                            ) : (
                                <>
                                    <img src={imgIcon7} alt="" className="h-4 w-4" />
                                    Submit Discrepancy Report
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={resetDiscrepancyForm}
                            className="flex h-9 w-[105px] items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a] hover:bg-[#f9fafb] transition-colors"
                        >
                            Reset Form
                        </button>
                    </div>
                </div>
            </div>

            {/* Discrepancy Reports List Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6" data-name="Card" data-node-id="2:2422">
                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4" data-name="DocumentationPanel" data-node-id="2:2423">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#ffe2e2]">
                        <img src={imgIcon14} alt="" className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-bold leading-7 text-[#0a0a0a]">
                            Discrepancy Reports
                        </h2>
                        <p className="text-[14px] leading-5 text-[#4a5565]">
                            View and manage discrepancy reports
                        </p>
                    </div>
                </div>

                {/* Reports List */}
                <div className="mt-12 flex flex-col gap-4" data-name="DocumentationPanel" data-node-id="2:2434">
                    <div className="flex items-center gap-2" data-name="Heading 4" data-node-id="2:2435">
                        <img src={imgIcon14} alt="" className="h-5 w-5" />
                        <h3 className="text-[16px] font-bold leading-6 text-[#0a0a0a]">
                            Discrepancy Reports ({discrepancies.length})
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3" data-name="Container" data-node-id="2:2441">
                        {discrepancies.map((report) => (
                            <div
                                key={report.id}
                                className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white">
                                        <img src={imgIcon14} alt="" className="h-6 w-6" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[16px] leading-6 text-[#101828]">
                                            {report.description}
                                        </span>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <img src={imgIcon10} alt="" className="h-3 w-3" />
                                                <span className="text-[14px] leading-5 text-[#4a5565]">
                                                    {report.date}
                                                </span>
                                            </div>
                                            <span className="max-w-[471px] text-[14px] leading-5 text-[#4a5565]">
                                                {report.remedialAction}
                                            </span>
                                            <span
                                                className={`rounded-lg px-2 py-[3px] text-[12px] leading-4 ${report.status === "Resolved"
                                                        ? "bg-[#dcfce7] text-[#008236]"
                                                        : report.status === "In Progress"
                                                            ? "bg-[#fef9c2] text-[#a65f00]"
                                                            : "bg-[#dbeafe] text-[#1447e6]"
                                                    }`}
                                            >
                                                {report.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => deleteDiscrepancy(report.id)}
                                    className="flex h-8 w-9 items-center justify-center rounded-lg hover:bg-[#ffe2e2] transition-colors"
                                    title="Delete"
                                >
                                    <img src={imgIcon13} alt="" className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Important Information Card */}
            <div className="rounded-[14px] border border-[#bedbff] bg-[#eff6ff] p-6" data-name="Card" data-node-id="2:2498">
                <div className="flex gap-3" data-name="DocumentationPanel" data-node-id="2:2499">
                    <img src={imgIcon15} alt="" className="h-6 w-6" />
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[16px] font-bold leading-6 text-[#1c398e]">
                            Important Information
                        </h3>
                        <ul className="flex flex-col gap-1" data-name="List" data-node-id="2:2507">
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8] relative before:content-['•'] before:absolute before:left-0">
                                All fields marked with * are required for regulatory compliance
                            </li>
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8] relative before:content-['•'] before:absolute before:left-0">
                                Ensure all documentation is accurate and complete before submission
                            </li>
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8] relative before:content-['•'] before:absolute before:left-0">
                                Uploaded documents will be reviewed by authorized personnel
                            </li>
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8] relative before:content-['•'] before:absolute before:left-0">
                                Maintain copies of all maintenance records for FAA/EASA audits
                            </li>
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8] relative before:content-['•'] before:absolute before:left-0">
                                Certificate numbers must be valid and current
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

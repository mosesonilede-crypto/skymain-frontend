"use client";

import React, { useMemo, useState, useEffect } from "react";

type UploadedDoc = {
    filename: string;
    date: string;
    size: string;
    category: string;
};

type Discrepancy = {
    title: string;
    date: string;
    summary: string;
    status: "Resolved" | "In Progress";
};

export default function DocumentationPage() {
    const aircraftReg = "N123AB";
    const MANUAL_STORAGE_KEY = "skymaintain.uploadedManuals";
    const DOC_DRAFT_KEY = "skymaintain.documentationDraft";

    const [docsData, setDocsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch live docs data
    async function fetchDocsData() {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/docs`);
            if (response.ok) {
                const data = await response.json();
                setDocsData(data);
            }
        } catch (error) {
            console.error("Error fetching docs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDocsData();
    }, []);

    const discrepancyReports: Discrepancy[] = useMemo(
        () => docsData?.discrepancies || [
            {
                title: "Hydraulic fluid leak detected on left main landing gear",
                date: "1/19/2025",
                summary:
                    "Replaced faulty O-ring seal and replenished hydraulic fluid to specified level. Performed leak check - no leaks observed.",
                status: "Resolved",
            },
            {
                title: "Unusual vibration in engine #2 during high power settings",
                date: "1/21/2025",
                summary:
                    "Inspected engine mounts and performed borescope inspection. Pending detailed analysis.",
                status: "In Progress",
            },
        ],
        [docsData]
    );

    const [aircraftRegistration, setAircraftRegistration] = useState(aircraftReg);
    const [totalCycles, setTotalCycles] = useState("");
    const [timeInService, setTimeInService] = useState("");
    const [timeSinceNew, setTimeSinceNew] = useState("");
    const [timeSinceOverhaul, setTimeSinceOverhaul] = useState("");
    const [lastMaintenanceType, setLastMaintenanceType] = useState("");

    const [techFirst, setTechFirst] = useState("");
    const [techLast, setTechLast] = useState("");
    const [techCert, setTechCert] = useState("");
    const [maintenanceDate, setMaintenanceDate] = useState("");

    const [discDesc, setDiscDesc] = useState("");
    const [discRemedy, setDiscRemedy] = useState("");
    const [discManual, setDiscManual] = useState("");
    const [localUploads, setLocalUploads] = useState<UploadedDoc[]>([]);

    const uploadedDocs: UploadedDoc[] = useMemo(() => {
        const base = docsData?.uploadedDocs || [
            {
                filename: "Engine_Inspection_Report_2025.pdf",
                date: "1/19/2025",
                size: "2.4 MB",
                category: "Inspection Reports",
            },
            {
                filename: "Hydraulic_System_Maintenance.pdf",
                date: "1/17/2025",
                size: "1.8 MB",
                category: "Maintenance Records",
            },
            {
                filename: "A-Check_Compliance_Certificate.pdf",
                date: "1/14/2025",
                size: "856 KB",
                category: "Compliance",
            },
        ];

        const merged = [...localUploads, ...base].filter(
            (doc) => doc && doc.filename
        );

        return merged.filter(
            (doc, idx, arr) => arr.findIndex((d) => d.filename === doc.filename) === idx
        );
    }, [docsData, localUploads]);

    function formatFileSize(bytes: number) {
        if (!Number.isFinite(bytes)) return "0 KB";
        if (bytes < 1024) return `${bytes} B`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(0)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
    }

    function handleUploadFiles(files: FileList | File[]) {
        const list = Array.from(files || []);
        if (!list.length) return;

        const newUploads: UploadedDoc[] = list.map((file) => ({
            filename: file.name,
            date: new Date().toLocaleDateString(),
            size: formatFileSize(file.size),
            category: "Maintenance Records",
        }));

        setLocalUploads((prev) => {
            const merged = [...newUploads, ...prev];
            return merged.filter(
                (doc, idx, arr) => arr.findIndex((d) => d.filename === doc.filename) === idx
            );
        });
    }

    function saveDocumentationToReservoir() {
        if (typeof window === "undefined") return;

        const draft = {
            aircraftRegistration,
            totalCycles,
            timeInService,
            timeSinceNew,
            timeSinceOverhaul,
            lastMaintenanceType,
            techFirst,
            techLast,
            techCert,
            maintenanceDate,
            discDesc,
            discRemedy,
            discManual,
        };

        window.localStorage.setItem(DOC_DRAFT_KEY, JSON.stringify(draft));

        const existing = (() => {
            try {
                const raw = window.localStorage.getItem(MANUAL_STORAGE_KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        })();

        const merged = [...uploadedDocs, ...existing]
            .filter((doc) => doc && doc.filename)
            .filter(
                (doc, idx, arr) =>
                    arr.findIndex((d) => d.filename === doc.filename) === idx
            );

        window.localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(merged));
    }

    function handleSubmitDocumentation() {
        saveDocumentationToReservoir();
        alert("Documentation saved for AI predictive analysis.");
    }

    function resetMaintenanceForm() {
        setAircraftRegistration(aircraftReg);
        setTotalCycles("");
        setTimeInService("");
        setTimeSinceNew("");
        setTimeSinceOverhaul("");
        setLastMaintenanceType("");
        setTechFirst("");
        setTechLast("");
        setTechCert("");
        setMaintenanceDate("");
    }

    function resetDiscrepancyForm() {
        setDiscDesc("");
        setDiscRemedy("");
        setDiscManual("");
    }

    return (
        <section className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Aircraft Documentation</h1>
                <div className="mt-1 text-sm font-semibold text-slate-700">Official Records</div>
                <p className="mt-2 text-sm text-slate-600">
                    Record maintenance activities and manage aircraft documentation
                </p>
            </div>

            <Panel
                title="Maintenance Documentation Form"
                subtitle="Complete all required fields for maintenance record submission"
            >
                <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900">Aircraft Information</div>

                        <div className="mt-4 grid gap-4">
                            <Field
                                label="Aircraft Registration *"
                                value={aircraftRegistration}
                                onChange={setAircraftRegistration}
                                placeholder="e.g., N123AB"
                            />
                            <Field
                                label="Total Cycles *"
                                value={totalCycles}
                                onChange={setTotalCycles}
                                placeholder="e.g., 15000"
                            />
                            <Field
                                label="Total Time in Service (Hours) *"
                                value={timeInService}
                                onChange={setTimeInService}
                                placeholder="e.g., 25000.5"
                            />
                            <Field
                                label="Total Time Since New (Hours) *"
                                value={timeSinceNew}
                                onChange={setTimeSinceNew}
                                placeholder="e.g., 30000.0"
                            />
                            <Field
                                label="Total Time Since Overhaul (Hours) *"
                                value={timeSinceOverhaul}
                                onChange={setTimeSinceOverhaul}
                                placeholder="e.g., 5000.5"
                            />

                            <SelectField
                                label="Last Maintenance Type *"
                                value={lastMaintenanceType}
                                onChange={setLastMaintenanceType}
                                placeholder="Select maintenance type..."
                                options={["A-Check", "B-Check", "C-Check", "Unscheduled", "Component Change"]}
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900">Technician Information</div>

                        <div className="mt-4 grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Technician First Name *"
                                    value={techFirst}
                                    onChange={setTechFirst}
                                    placeholder="e.g., John"
                                />
                                <Field
                                    label="Technician Last Name *"
                                    value={techLast}
                                    onChange={setTechLast}
                                    placeholder="e.g., Smith"
                                />
                            </div>

                            <Field
                                label="Technician Certificate Number *"
                                value={techCert}
                                onChange={setTechCert}
                                placeholder="e.g., A&P-12345678"
                            />

                            <DateField
                                label="Maintenance Date"
                                value={maintenanceDate}
                                onChange={setMaintenanceDate}
                            />

                            <div className="mt-2 flex flex-wrap gap-3">
                                <PrimaryButton
                                    onClick={handleSubmitDocumentation}
                                >
                                    Submit Documentation
                                </PrimaryButton>
                                <SecondaryButton onClick={resetMaintenanceForm}>Reset Form</SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="text-sm font-semibold text-slate-900">Upload Supporting Documents</div>
                    <p className="mt-1 text-sm text-slate-600">
                        Upload maintenance reports, certificates, and compliance documentation
                    </p>

                    <div className="mt-4">
                        <Dropzone
                            title="Click to upload or drag and drop"
                            subtitle="PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            multiple
                            onFilesSelected={handleUploadFiles}
                        />
                    </div>

                    <div className="mt-5">
                        <div className="text-sm font-semibold text-slate-900">Uploaded Documents (3)</div>

                        <div className="mt-3 space-y-3">
                            {uploadedDocs.map((d) => (
                                <UploadedDocRow key={d.filename} doc={d} />
                            ))}
                        </div>
                    </div>
                </div>
            </Panel>

            <Panel title="Discrepancy Report Form" subtitle="Report any discrepancies found during maintenance">
                <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900">Discrepancy Information</div>

                        <div className="mt-4 grid gap-4">
                            <TextareaField
                                label="Discrepancy Description *"
                                value={discDesc}
                                onChange={setDiscDesc}
                                placeholder="e.g., Hydraulic fluid leak detected on left main landing gear"
                            />
                            <TextareaField
                                label="Remedial Action Taken *"
                                value={discRemedy}
                                onChange={setDiscRemedy}
                                placeholder="e.g., Replaced faulty O-ring seal and replenished hydraulic fluid..."
                            />
                            <SelectField
                                label="Reference Manual *"
                                value={discManual}
                                onChange={setDiscManual}
                                placeholder="Select reference manual..."
                                options={[
                                    // 1. Regulatory and Mandatory Documents (Highest Legal Authority)
                                    "── REGULATORY & MANDATORY ──",
                                    "Airworthiness Directive (AD)",
                                    "Service Bulletin (SB)",
                                    "Service Letter (SL)",
                                    "Service Instruction (SI)",

                                    // 2. Manufacturer Aircraft Maintenance Manuals (Primary Technical Authority)
                                    "── AIRCRAFT MAINTENANCE MANUALS ──",
                                    "Aircraft Maintenance Manual (AMM)",
                                    "Illustrated Parts Catalog (IPC)",
                                    "Maintenance Planning Document (MPD)",
                                    "Fault Isolation Manual (FIM)",
                                    "Wiring Diagram Manual (WDM)",
                                    "Structural Repair Manual (SRM)",
                                    "Aircraft Operating Manual (AOM)",
                                    "Flight Crew Operating Manual (FCOM)",

                                    // 3. Component and Engine Manuals
                                    "── ENGINE & COMPONENT MANUALS ──",
                                    "Engine Maintenance Manual (EMM)",
                                    "Engine Overhaul Manual (EOM)",
                                    "Component Maintenance Manual (CMM)",
                                    "Component Illustrated Parts Catalog (CIPC)",

                                    // 4. Approved Maintenance Program
                                    "── APPROVED MAINTENANCE PROGRAM ──",
                                    "Continuous Airworthiness Maintenance Program (CAMP)",
                                    "Approved Maintenance Program (AMP)",
                                    "Minimum Equipment List (MEL)",
                                    "Master Minimum Equipment List (MMEL)",
                                    "Configuration Deviation List (CDL)",

                                    // 5. Operator and Organizational Manuals
                                    "── ORGANIZATIONAL MANUALS ──",
                                    "General Maintenance Manual (GMM)",
                                    "Maintenance Organization Exposition (MOE)",
                                    "Quality Control Manual (QCM)",
                                    "Training Manual (TM)",

                                    // 6. Standard Practices and General References
                                    "── STANDARD PRACTICES ──",
                                    "Standard Practices Manual (SPM)",
                                    "Non-Destructive Testing Manual (NDT)",
                                    "Corrosion Prevention and Control Program (CPCP)",
                                    "Weight and Balance Manual (WBM)",

                                    // 7. FAA/Authority Reference Handbooks
                                    "── FAA HANDBOOKS & CIRCULARS ──",
                                    "FAA-H-8083-30 AMT General Handbook",
                                    "FAA-H-8083-31 AMT Airframe Handbook",
                                    "FAA-H-8083-32 AMT Powerplant Handbook",
                                    "Advisory Circular (AC)",

                                    // 8. Records and Release Documents
                                    "── RECORDS & FORMS ──",
                                    "Aircraft Logbook - Airframe",
                                    "Aircraft Logbook - Engine",
                                    "Aircraft Logbook - Propeller",
                                    "Aircraft Logbook - Appliance",
                                    "FAA Form 8130-3",
                                    "EASA Form 1",
                                    "Maintenance Task Card",
                                    "Engineering Order (EO)",

                                    // 9. Digital and Integrated Manuals
                                    "── DIGITAL SYSTEMS ──",
                                    "Electronic Technical Log (ETL)",
                                    "OEM Digital Manual (AirbusWorld/MyBoeingFleet)",
                                    "Integrated Maintenance Information System (MIS)",
                                ]}
                            />

                            <div className="mt-2 flex flex-wrap gap-3">
                                <PrimaryButton
                                    onClick={() =>
                                        alert("Submit Discrepancy Report (wire to backend + audit log)")
                                    }
                                >
                                    Submit Discrepancy Report
                                </PrimaryButton>
                                <SecondaryButton onClick={resetDiscrepancyForm}>Reset Form</SecondaryButton>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900">Discrepancy Reports</div>
                        <p className="mt-1 text-sm text-slate-600">View and manage discrepancy reports</p>

                        <div className="mt-4 space-y-3">
                            {discrepancyReports.map((r, idx) => (
                                <DiscrepancyRow key={`${r.date}-${idx}`} item={r} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="text-sm font-semibold text-slate-900">Important Information</div>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                        <li>All fields marked with * are required for regulatory compliance</li>
                        <li>Ensure all documentation is accurate and complete before submission</li>
                        <li>Uploaded documents will be reviewed by authorized personnel</li>
                        <li>Maintain copies of all maintenance records for FAA/EASA audits</li>
                        <li>Certificate numbers must be valid and current</li>
                    </ul>
                </div>
            </Panel>

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

function Panel({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
            <div className="mt-5">{children}</div>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="block">
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-600 focus:ring-2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </label>
    );
}

function DateField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <label className="block">
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <input
                type="date"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-600 focus:ring-2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

function TextareaField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="block">
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <textarea
                className="mt-2 min-h-[110px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-600 focus:ring-2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </label>
    );
}

function SelectField({
    label,
    value,
    onChange,
    placeholder,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    options: string[];
}) {
    return (
        <label className="block">
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <select
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-600 focus:ring-2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{placeholder}</option>
                {options.map((o) => {
                    // Section headers (starting with ──) are disabled labels
                    const isHeader = o.startsWith("──");
                    return (
                        <option
                            key={o}
                            value={isHeader ? "" : o}
                            disabled={isHeader}
                            className={isHeader ? "font-bold text-slate-500 bg-slate-100" : ""}
                        >
                            {o}
                        </option>
                    );
                })}
            </select>
        </label>
    );
}

function Dropzone({
    title,
    subtitle,
    accept,
    multiple,
    onFilesSelected,
}: {
    title: string;
    subtitle: string;
    accept?: string;
    multiple?: boolean;
    onFilesSelected: (files: FileList) => void;
}) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    function handleClick() {
        inputRef.current?.click();
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length) {
            onFilesSelected(event.target.files);
            event.target.value = "";
        }
    }

    function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length) {
            onFilesSelected(event.dataTransfer.files);
        }
    }

    function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
        event.preventDefault();
    }

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
            />
            <button
                type="button"
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-left hover:bg-slate-100"
            >
                <div className="flex items-start gap-3">
                    <UploadIcon />
                    <div>
                        <div className="text-sm font-semibold text-slate-900">{title}</div>
                        <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
                    </div>
                </div>
            </button>
        </div>
    );
}

function UploadedDocRow({ doc }: { doc: UploadedDoc }) {
    return (
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{doc.filename}</div>
                <div className="mt-1 text-xs text-slate-600">
                    {doc.date} &nbsp;•&nbsp; {doc.size}
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {doc.category}
                </span>
                <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={() => alert(`Open ${doc.filename} (wire to viewer)`)}
                >
                    View
                </button>
            </div>
        </div>
    );
}

function DiscrepancyRow({ item }: { item: Discrepancy }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-xs text-slate-600">{item.date}</div>
                </div>
                <StatusPill status={item.status} />
            </div>

            <div className="mt-3 text-sm text-slate-600">{item.summary}</div>
        </div>
    );
}

function StatusPill({ status }: { status: Discrepancy["status"] }) {
    const cls =
        status === "Resolved"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-amber-50 text-amber-700 ring-amber-200";

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {status}
        </span>
    );
}

function PrimaryButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
        >
            {children}
        </button>
    );
}

function SecondaryButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
        >
            {children}
        </button>
    );
}

function UploadIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V4" />
            <path d="M7 9l5-5 5 5" />
            <path d="M4 20h16" />
        </svg>
    );
}

function RobotIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="8" width="16" height="12" rx="3" />
            <path d="M12 4v4" />
            <circle cx="9" cy="14" r="1" />
            <circle cx="15" cy="14" r="1" />
        </svg>
    );
}

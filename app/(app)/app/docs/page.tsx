"use client";

import React, { useMemo, useState } from "react";

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

    const uploadedDocs: UploadedDoc[] = useMemo(
        () => [
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
        ],
        []
    );

    const discrepancyReports: Discrepancy[] = useMemo(
        () => [
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
        []
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

                            <SelectField
                                label="Maintenance Date"
                                value={maintenanceDate}
                                onChange={setMaintenanceDate}
                                placeholder="Select maintenance date..."
                                options={["2025-01-19", "2025-01-17", "2025-01-14"]}
                            />

                            <div className="mt-2 flex flex-wrap gap-3">
                                <PrimaryButton
                                    onClick={() =>
                                        alert("Submit Documentation (wire to backend endpoint + audit trail)")
                                    }
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
                            onClick={() => alert("Open file picker (wire to upload)")}
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
                                options={["AMM", "MEL", "SRM", "IPC", "Engineering Order"]}
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

            <button
                type="button"
                aria-label="AI Assistant"
                className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90"
                onClick={() => alert("AI Assistant panel (wire to governed assistant)")}
            >
                <RobotIcon />
                AI Assistant
            </button>
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
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </label>
    );
}

function Dropzone({
    title,
    subtitle,
    onClick,
}: {
    title: string;
    subtitle: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
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

/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

// Figma assets for Documentation Page (node 2:2101)
const imgIconDocument = "https://www.figma.com/api/mcp/asset/4bc703c0-f9e1-4b14-92aa-a762debbf203";
const imgVectorPen = "https://www.figma.com/api/mcp/asset/abdd7123-24a3-4aef-84ab-1f6bfcb40849";
const imgIconAircraft = "https://www.figma.com/api/mcp/asset/de79f5a9-9eb4-48fd-a86c-0cfa2aeed035";
const imgIconChevron = "https://www.figma.com/api/mcp/asset/1fce14cf-1aea-4aeb-a781-edc230c78713";
const imgIconUser = "https://www.figma.com/api/mcp/asset/1a979c58-7e38-4a9d-859e-55cee9585e89";
const imgIconCertificate = "https://www.figma.com/api/mcp/asset/71ff569c-acf9-40a5-bdc7-0663146261d4";
const imgIconCalendar = "https://www.figma.com/api/mcp/asset/c210270c-19b0-460c-b671-a72bc875d3d1";
const imgIconSubmit = "https://www.figma.com/api/mcp/asset/ecfeffcc-a33c-44ce-bbd0-d145132b5f0e";
const imgIconUpload = "https://www.figma.com/api/mcp/asset/21744d5a-770f-467b-a733-248d5c8d8a27";
const imgIconFolder = "https://www.figma.com/api/mcp/asset/b7fe22df-18c2-4ce5-8d39-d4082a89821b";
const imgIconClock = "https://www.figma.com/api/mcp/asset/43970e82-c61e-4d2e-a851-e7a0a8fe228a";
const imgIconEye = "https://www.figma.com/api/mcp/asset/cbd72489-ae38-487c-b30e-93dcf3a85e4c";
const imgIconDownload = "https://www.figma.com/api/mcp/asset/4fba9cf2-1277-44f3-8972-270727761a84";
const imgIconTrash = "https://www.figma.com/api/mcp/asset/18396b03-7e87-4c5e-913a-1dd58596e88e";
const imgIconWarning = "https://www.figma.com/api/mcp/asset/82bc4606-fc08-42ec-b3e1-67280b512fb3";
const imgIconInfo = "https://www.figma.com/api/mcp/asset/8ed8c693-a6e2-4cbc-b80b-c408951e0ea0";

export const metadata: Metadata = {
    title: "SkyMaintain — Aircraft Documentation",
};

export default function DocumentationPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[24px] font-bold leading-8 text-[#0a0a0a]">
                        Aircraft Documentation
                    </h1>
                    <p className="text-[16px] leading-6 text-[#4a5565]">
                        Record maintenance activities and manage aircraft documentation
                    </p>
                </div>
                <div className="flex h-[34px] items-center gap-2 rounded-lg bg-[#dbeafe] px-4">
                    <img src={imgIconDocument} alt="" className="h-3 w-3" />
                    <span className="text-[12px] leading-4 text-[#1447e6]">Official Records</span>
                </div>
            </div>

            {/* Maintenance Documentation Form Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6">
                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#dbeafe]">
                        <img src={imgVectorPen} alt="" className="h-[18px] w-[18px]" />
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
                <div className="mt-12 flex flex-col gap-6">
                    {/* Aircraft Information Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <img src={imgIconAircraft} alt="" className="h-5 w-5" />
                            <h3 className="text-[18px] font-bold leading-7 text-[#0a0a0a]">
                                Aircraft Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Aircraft Registration */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Aircraft Registration *
                                </label>
                                <input
                                    type="text"
                                    defaultValue="N123AB"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] outline-none"
                                />
                            </div>

                            {/* Total Cycles */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Total Cycles *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 15000"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                                />
                            </div>

                            {/* Total Time in Service */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Total Time in Service (Hours) *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 25000.5"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                                />
                            </div>

                            {/* Total Time Since New */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Total Time Since New (Hours) *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 30000.0"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                                />
                            </div>
                        </div>

                        {/* Total Time Since Overhaul - Full Width */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Total Time Since Overhaul (Hours) *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 5000.5"
                                className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                            />
                        </div>

                        {/* Last Maintenance Type */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Last Maintenance Type *
                            </label>
                            <button className="flex h-[42px] items-center justify-between rounded-[10px] border border-[#d1d5dc] bg-white px-4">
                                <span className="text-[16px] text-[#6a7282]">
                                    Select maintenance type...
                                </span>
                                <img src={imgIconChevron} alt="" className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Technician Information Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <img src={imgIconUser} alt="" className="h-5 w-5" />
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
                                    placeholder="e.g., John"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                                />
                            </div>

                            {/* Technician Last Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Technician Last Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Smith"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                                />
                            </div>
                        </div>

                        {/* Technician Certificate Number */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Technician Certificate Number *
                            </label>
                            <div className="flex items-center gap-2">
                                <img src={imgIconCertificate} alt="" className="h-10 w-10" />
                                <input
                                    type="text"
                                    placeholder="e.g., A&P-12345678"
                                    className="h-9 flex-1 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Date Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <img src={imgIconCalendar} alt="" className="h-5 w-5" />
                            <h3 className="text-[18px] font-bold leading-7 text-[#0a0a0a]">
                                Maintenance Date
                            </h3>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Select Date *
                            </label>
                            <button className="flex h-[42px] items-center justify-between rounded-[10px] border border-[#d1d5dc] bg-white px-4">
                                <div className="flex items-center gap-2">
                                    <img src={imgIconCalendar} alt="" className="h-5 w-5" />
                                    <span className="text-[16px] text-[#6a7282]">
                                        Select maintenance date...
                                    </span>
                                </div>
                                <img src={imgIconChevron} alt="" className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 border-t border-[#e5e7eb] pt-4">
                        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#030213] text-[14px] text-white">
                            <img src={imgIconSubmit} alt="" className="h-4 w-4" />
                            Submit Documentation
                        </button>
                        <button className="flex h-9 w-[105px] items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a]">
                            Reset Form
                        </button>
                    </div>
                </div>
            </div>

            {/* Upload Supporting Documents Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6">
                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#dcfce7]">
                        <img src={imgIconUpload} alt="" className="h-6 w-6" />
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
                <div className="mt-12 flex flex-col items-center justify-center rounded-[10px] border-[1.6px] border-dashed border-[#d1d5dc] bg-[#f9fafb] py-8">
                    <img src={imgIconUpload} alt="" className="h-12 w-12" />
                    <p className="mt-4 text-[18px] leading-7 text-[#364153]">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-[14px] leading-5 text-[#6a7282]">
                        PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                    </p>
                </div>

                {/* Uploaded Documents */}
                <div className="mt-12 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <img src={imgIconFolder} alt="" className="h-5 w-5" />
                        <h3 className="text-[16px] font-bold leading-6 text-[#0a0a0a]">
                            Uploaded Documents (3)
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Document 1 */}
                        <div className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white">
                                    <img src={imgIconFolder} alt="" className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[16px] leading-6 text-[#101828]">
                                        Engine_Inspection_Report_2025.pdf
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <img src={imgIconClock} alt="" className="h-3 w-3" />
                                            <span className="text-[14px] leading-5 text-[#4a5565]">
                                                1/19/2025
                                            </span>
                                        </div>
                                        <span className="text-[14px] leading-5 text-[#4a5565]">
                                            2.4 MB
                                        </span>
                                        <span className="rounded-lg bg-[#dbeafe] px-2 py-[3px] text-[12px] leading-4 text-[#1447e6]">
                                            Inspection Reports
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconEye} alt="" className="h-4 w-4" />
                                </button>
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconDownload} alt="" className="h-4 w-4" />
                                </button>
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconTrash} alt="" className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Document 2 */}
                        <div className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white">
                                    <img src={imgIconFolder} alt="" className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[16px] leading-6 text-[#101828]">
                                        Hydraulic_System_Maintenance.pdf
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <img src={imgIconClock} alt="" className="h-3 w-3" />
                                            <span className="text-[14px] leading-5 text-[#4a5565]">
                                                1/17/2025
                                            </span>
                                        </div>
                                        <span className="text-[14px] leading-5 text-[#4a5565]">
                                            1.8 MB
                                        </span>
                                        <span className="rounded-lg bg-[#dbeafe] px-2 py-[3px] text-[12px] leading-4 text-[#1447e6]">
                                            Maintenance Records
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconEye} alt="" className="h-4 w-4" />
                                </button>
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconDownload} alt="" className="h-4 w-4" />
                                </button>
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconTrash} alt="" className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Document 3 */}
                        <div className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white">
                                    <img src={imgIconFolder} alt="" className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[16px] leading-6 text-[#101828]">
                                        A-Check_Compliance_Certificate.pdf
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <img src={imgIconClock} alt="" className="h-3 w-3" />
                                            <span className="text-[14px] leading-5 text-[#4a5565]">
                                                1/14/2025
                                            </span>
                                        </div>
                                        <span className="text-[14px] leading-5 text-[#4a5565]">
                                            856 KB
                                        </span>
                                        <span className="rounded-lg bg-[#dbeafe] px-2 py-[3px] text-[12px] leading-4 text-[#1447e6]">
                                            Compliance
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconEye} alt="" className="h-4 w-4" />
                                </button>
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconDownload} alt="" className="h-4 w-4" />
                                </button>
                                <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                    <img src={imgIconTrash} alt="" className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Discrepancy Report Form Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6">
                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#ffe2e2]">
                        <img src={imgIconWarning} alt="" className="h-6 w-6" />
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
                <div className="mt-12 flex flex-col gap-6">
                    {/* Discrepancy Information Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <img src={imgIconWarning} alt="" className="h-5 w-5" />
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
                                    placeholder="e.g., Hydraulic fluid leak detected on left main landing gear"
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                                />
                            </div>

                            {/* Remedial Action Taken */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                    Remedial Action Taken *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Replaced faulty O-ring seal and replenished hydraulic fluid to specified level."
                                    className="h-9 rounded-lg border-0 bg-[#f3f3f5] px-3 text-[14px] text-[#717182] placeholder:text-[#717182] outline-none"
                                />
                            </div>
                        </div>

                        {/* Reference Manual */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] leading-[14px] text-[#0a0a0a]">
                                Reference Manual *
                            </label>
                            <button className="flex h-[42px] items-center justify-between rounded-[10px] border border-[#d1d5dc] bg-white px-4">
                                <span className="text-[16px] text-[#6a7282]">
                                    Select reference manual...
                                </span>
                                <img src={imgIconChevron} alt="" className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 border-t border-[#e5e7eb] pt-4">
                        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#030213] text-[14px] text-white">
                            <img src={imgIconSubmit} alt="" className="h-4 w-4" />
                            Submit Discrepancy Report
                        </button>
                        <button className="flex h-9 w-[105px] items-center justify-center rounded-lg border border-black/10 bg-white text-[14px] text-[#0a0a0a]">
                            Reset Form
                        </button>
                    </div>
                </div>
            </div>

            {/* Discrepancy Reports List Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6">
                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#ffe2e2]">
                        <img src={imgIconWarning} alt="" className="h-6 w-6" />
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
                <div className="mt-12 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <img src={imgIconWarning} alt="" className="h-5 w-5" />
                        <h3 className="text-[16px] font-bold leading-6 text-[#0a0a0a]">
                            Discrepancy Reports (2)
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Report 1 - Resolved */}
                        <div className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white">
                                    <img src={imgIconWarning} alt="" className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[16px] leading-6 text-[#101828]">
                                        Hydraulic fluid leak detected on left main landing gear
                                    </span>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <img src={imgIconClock} alt="" className="h-3 w-3" />
                                            <span className="text-[14px] leading-5 text-[#4a5565]">
                                                1/19/2025
                                            </span>
                                        </div>
                                        <span className="max-w-[471px] text-[14px] leading-5 text-[#4a5565]">
                                            Replaced faulty O-ring seal and replenished hydraulic fluid to specified level. Performed leak check - no leaks observed.
                                        </span>
                                        <span className="rounded-lg bg-[#dcfce7] px-2 py-[3px] text-[12px] leading-4 text-[#008236]">
                                            Resolved
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                <img src={imgIconTrash} alt="" className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Report 2 - In Progress */}
                        <div className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white">
                                    <img src={imgIconWarning} alt="" className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[16px] leading-6 text-[#101828]">
                                        Unusual vibration in engine #2 during high power settings
                                    </span>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <img src={imgIconClock} alt="" className="h-3 w-3" />
                                            <span className="text-[14px] leading-5 text-[#4a5565]">
                                                1/21/2025
                                            </span>
                                        </div>
                                        <span className="max-w-[447px] text-[14px] leading-5 text-[#4a5565]">
                                            Inspected engine mounts and performed borescope inspection. Pending detailed analysis.
                                        </span>
                                        <span className="rounded-lg bg-[#fef9c2] px-2 py-[3px] text-[12px] leading-4 text-[#a65f00]">
                                            In Progress
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="flex h-8 w-9 items-center justify-center rounded-lg">
                                <img src={imgIconTrash} alt="" className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Important Information Card */}
            <div className="rounded-[14px] border border-[#bedbff] bg-[#eff6ff] p-6">
                <div className="flex gap-3">
                    <img src={imgIconInfo} alt="" className="h-6 w-6" />
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[16px] font-bold leading-6 text-[#1c398e]">
                            Important Information
                        </h3>
                        <ul className="flex flex-col gap-1">
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8]">
                                All fields marked with * are required for regulatory compliance
                            </li>
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8]">
                                Ensure all documentation is accurate and complete before submission
                            </li>
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8]">
                                Uploaded documents will be reviewed by authorized personnel
                            </li>
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8]">
                                Maintain copies of all maintenance records for FAA/EASA audits
                            </li>
                            <li className="pl-5 text-[14px] leading-5 text-[#193cb8]">
                                Certificate numbers must be valid and current
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

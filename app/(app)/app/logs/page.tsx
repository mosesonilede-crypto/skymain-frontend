/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

// Figma assets for Maintenance Logs Page (node 6:3)
const imgIconCheckCircle = "https://www.figma.com/api/mcp/asset/d85dad25-2a9f-43a4-ad26-d3c48b1f35ea";
const imgIconWrench = "https://www.figma.com/api/mcp/asset/69d0d3ca-8407-427a-b1f6-4313906480f4";

export const metadata: Metadata = {
    title: "SkyMaintain — Maintenance Logs",
};

// Log entry type
interface MaintenanceLog {
    id: string;
    title: string;
    description: string;
    technician: string;
    date: string;
    duration: string;
    status: "COMPLETED" | "IN_PROGRESS" | "SCHEDULED";
}

// Sample maintenance logs data
const maintenanceLogs: MaintenanceLog[] = [
    {
        id: "1",
        title: "A-Check Inspection",
        description: "Complete A-Check including visual inspection, lubrication, and minor repairs",
        technician: "John Anderson",
        date: "2025-12-10",
        duration: "18 hrs",
        status: "COMPLETED",
    },
    {
        id: "2",
        title: "Avionics Software Update",
        description: "Critical avionics software update for FMS and TCAS systems",
        technician: "Sarah Williams",
        date: "2025-11-05",
        duration: "4 hrs",
        status: "COMPLETED",
    },
];

export default function MaintenanceLogsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Page Header */}
            <h1 className="text-[24px] leading-8 text-[#0a0a0a]">
                Maintenance Logs - N123AB
            </h1>

            {/* Maintenance Logs Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6">
                {/* Card Header */}
                <h2 className="text-[20px] leading-7 text-[#0a0a0a]">
                    Maintenance Logs
                </h2>

                {/* Log Entries */}
                <div className="mt-10 flex flex-col gap-3">
                    {maintenanceLogs.map((log) => (
                        <div
                            key={log.id}
                            className="flex items-start justify-between rounded-[10px] border border-[#e5e7eb] px-4 py-4"
                        >
                            <div className="flex gap-2">
                                <img
                                    src={imgIconCheckCircle}
                                    alt=""
                                    className="h-4 w-4 shrink-0"
                                />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[14px] leading-5 text-[#0a0a0a]">
                                        {log.title}
                                    </h3>
                                    <p className="text-[12px] leading-4 text-[#4a5565]">
                                        {log.description}
                                    </p>
                                    <div className="flex items-center gap-3 text-[12px] leading-4 text-[#6a7282]">
                                        <span>Technician: {log.technician}</span>
                                        <span>•</span>
                                        <span>{log.date}</span>
                                        <span>•</span>
                                        <span>{log.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`rounded-lg px-2 py-[3px] text-[12px] leading-4 ${log.status === "COMPLETED"
                                        ? "bg-[#dcfce7] text-[#016630]"
                                        : log.status === "IN_PROGRESS"
                                            ? "bg-[#fef9c2] text-[#a65f00]"
                                            : "bg-[#dbeafe] text-[#1447e6]"
                                    }`}
                            >
                                {log.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Maintenance Tasks Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6">
                {/* Card Header */}
                <h2 className="text-[20px] leading-7 text-[#0a0a0a]">
                    Upcoming Maintenance Tasks
                </h2>

                {/* Empty State */}
                <div className="mt-10 flex flex-col items-center justify-center py-8">
                    <img
                        src={imgIconWrench}
                        alt=""
                        className="h-12 w-12 opacity-50"
                    />
                    <p className="mt-3 text-center text-[16px] leading-6 text-[#6a7282]">
                        No upcoming maintenance tasks for N123AB
                    </p>
                </div>
            </div>
        </div>
    );
}

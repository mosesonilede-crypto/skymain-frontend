/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAircraft } from "@/lib/AircraftContext";
import BackToHub from "@/components/app/BackToHub";

const headerMenuIcon = "https://www.figma.com/api/mcp/asset/1ba02178-1448-48df-9234-3cb753a781f9";
const headerAirlineIcon = "https://www.figma.com/api/mcp/asset/c5e0050e-5e2b-46dd-aaff-bc62e8570799";
const headerTailNumberIcon = "https://www.figma.com/api/mcp/asset/d9e35576-6fba-441c-9cc1-8927c29fba41";
const headerChevronIcon = "https://www.figma.com/api/mcp/asset/e61bf922-5b7b-4466-b25f-dbfff5899853";
const headerPrintIcon = "https://www.figma.com/api/mcp/asset/f060b66f-c7c9-45f0-bc6f-aed7233cfe64";
const headerPrivacyIcon = "https://www.figma.com/api/mcp/asset/85dff433-29e0-4aae-bd2a-afc2ec938029";
const headerBellIcon = "https://www.figma.com/api/mcp/asset/98216d52-73a3-4ff1-a1af-8de593febec3";

// Mock data for aircraft selection
const MOCK_AIRCRAFT = [
    { id: 1, tailNumber: "N123AB", model: "Boeing 737-800", airline: "SkyWings Airlines" },
    { id: 2, tailNumber: "N456CD", model: "Boeing 787-9", airline: "SkyWings Airlines" },
    { id: 3, tailNumber: "N789EF", model: "Airbus A320", airline: "SkyWings Airlines" },
    { id: 4, tailNumber: "N101GH", model: "Boeing 777-300ER", airline: "SkyWings Airlines" },
];

const MOCK_NOTIFICATIONS = [
    { id: 1, text: "Critical hydraulic system alert", severity: "critical" },
    { id: 2, text: "A-Check due in 50 days", severity: "warning" },
    { id: 3, text: "Avionics software update available", severity: "info" },
    { id: 4, text: "Engine oil change recommended", severity: "warning" },
    { id: 5, text: "Landing gear inspection passed", severity: "success" },
];

const kpiCriticalVector = "https://www.figma.com/api/mcp/asset/0434e497-f396-4a32-97ac-dc557bc87b82";
const kpiCriticalVector2 = "https://www.figma.com/api/mcp/asset/16a66917-0756-40b2-9311-ca084bc3721c";
const kpiCriticalVector3 = "https://www.figma.com/api/mcp/asset/da1a62e3-eb2f-44bf-9b51-9a9ffbf3af75";
const kpiScheduledVector1 = "https://www.figma.com/api/mcp/asset/943519eb-d62b-40cb-be70-60d04b4020ca";
const kpiScheduledVector2 = "https://www.figma.com/api/mcp/asset/ea271b81-e949-4e0f-a86e-8386fe24a8ca";
const kpiScheduledVector3 = "https://www.figma.com/api/mcp/asset/3303456a-7771-4d09-b46c-9d04bf6ba4d0";
const kpiScheduledVector4 = "https://www.figma.com/api/mcp/asset/130e6951-dfa4-4dd1-9deb-46129aa548dc";
const kpiGoodVector1 = "https://www.figma.com/api/mcp/asset/e81f497b-3548-4317-a7ae-cb35e64b0c12";
const kpiGoodVector2 = "https://www.figma.com/api/mcp/asset/dd2916d5-b363-4c82-bfb1-20135f4d0efa";
const kpiGoodVector3 = "https://www.figma.com/api/mcp/asset/045f4626-8111-4eeb-adc8-60daecce9570";
const kpiGoodVector4 = "https://www.figma.com/api/mcp/asset/00cf569e-72b2-4909-9fdb-022057f87575";

const aircraftLogoVector = "https://www.figma.com/api/mcp/asset/4c3ba46d-c68d-4694-9b8f-5f491fbea055";
const aircraftDetailsIcon = "https://www.figma.com/api/mcp/asset/5d5634c9-7f6d-49ec-b7b3-d61a9c6c29d4";
const aircraftHealthIcon = "https://www.figma.com/api/mcp/asset/445abd25-9075-45cc-aea5-02b2fa77ef2c";
const aircraftLocationIcon = "https://www.figma.com/api/mcp/asset/6c58086d-0ec6-40f8-ac07-d9b93e979245";
const aircraftStatusIcon = "https://www.figma.com/api/mcp/asset/5598ab0c-da41-49cc-8ae2-d4f67bdffe03";
const aircraftHoursIcon = "https://www.figma.com/api/mcp/asset/117f3207-2b92-42c4-b3c5-567e49a4bb2e";
const aircraftCyclesIcon = "https://www.figma.com/api/mcp/asset/0d167f3b-d2ab-48c9-95d7-ef62e525933b";
const aircraftEngineIcon = "https://www.figma.com/api/mcp/asset/de41db1f-a63b-4099-a746-f65360be3b23";
const aircraftUpcomingIcon = "https://www.figma.com/api/mcp/asset/4586edce-d80a-4b37-bcf4-062029c56459";

const systemHealthIcon = "https://www.figma.com/api/mcp/asset/e09c000f-5d31-47c6-ad8e-c18c30aec412";

const maintenanceLogoVector = "https://www.figma.com/api/mcp/asset/e6ed3b45-67b1-4a34-b32b-861a2eecce83";
const maintenanceCriticalIcon = "https://www.figma.com/api/mcp/asset/e9ed0ba7-855b-490f-9065-7a88c7fb1a32";
const maintenanceTimeIcon = "https://www.figma.com/api/mcp/asset/d5199cc0-b26c-4d5e-9826-63d32b2d24c8";
const maintenanceScheduleIcon = "https://www.figma.com/api/mcp/asset/cfee61ac-b47b-4536-a737-8e29268b1c28";
const maintenanceTasksIcon = "https://www.figma.com/api/mcp/asset/54e0c4d7-519b-448f-b1e3-6cbf64bc8ba5";
const maintenanceUserIcon = "https://www.figma.com/api/mcp/asset/184ac5a6-5f1d-4e66-ba0f-2502351c2730";
const maintenanceListIcon = "https://www.figma.com/api/mcp/asset/cdf0c906-5825-4a93-8e87-62b13e278382";
const maintenanceMoneyIcon = "https://www.figma.com/api/mcp/asset/e9268a7f-9269-428d-a498-33ba03565e12";

const aiMechanicIcon = "https://www.figma.com/api/mcp/asset/2277282f-6a56-423d-a502-2f06caf96cdf";

export default function DashboardPage() {
    const { selectedAircraft, setSelectedAircraft, allAircraft } = useAircraft();
    const [showAircraftMenu, setShowAircraftMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [privacyMode, setPrivacyMode] = useState(false);
    const aircraftDropdownRef = useRef<HTMLDivElement>(null);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);

    // Live data states
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch live dashboard data
    async function fetchDashboardData() {
        if (!selectedAircraft?.registration) return;

        setIsLoading(true);
        try {
            const [dashResponse, notifResponse] = await Promise.all([
                fetch(`/api/dashboard/${selectedAircraft.registration}`),
                fetch("/api/notifications"),
            ]);

            if (dashResponse.ok) {
                const data = await dashResponse.json();
                setDashboardData(data);
            }

            if (notifResponse.ok) {
                const data = await notifResponse.json();
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch data when aircraft changes
    useEffect(() => {
        fetchDashboardData();
    }, [selectedAircraft?.registration]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (aircraftDropdownRef.current && !aircraftDropdownRef.current.contains(event.target as Node)) {
                setShowAircraftMenu(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Add print styles to hide sidebar and adjust layout
    useEffect(() => {
        const printStyles = `
            @media print {
                aside {
                    display: none !important;
                }
                .fixed.left-0 {
                    display: none !important;
                }
                body {
                    margin: 0;
                    padding: 0;
                }
                div[class*="flex"] div:has(> aside) {
                    width: 100% !important;
                    margin-left: 0 !important;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = printStyles;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handlePrintReport = () => {
        console.log("Printing report for aircraft:", selectedAircraft?.registration);
        window.print();
    };

    const handlePrivacyMode = () => {
        setPrivacyMode(!privacyMode);
        console.log("Privacy mode toggled:", !privacyMode);
    };

    return (
        <div className="relative w-full">
            <div className="w-full max-w-[844px] mx-auto">
                <BackToHub title="Dashboard" />
                <div className="bg-white border-[#e5e7eb] border-b-[0.8px] border-solid rounded-[12px] px-6 pt-4 pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Menu Button */}
                            <button
                                className="flex h-8 w-[82px] items-center justify-center gap-2 rounded-[8px] border border-black/10 bg-white text-[14px] text-[#0a0a0a] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                onClick={() => console.log("Menu clicked")}
                                title="Open menu"
                            >
                                <img alt="Menu icon" className="h-4 w-4" src={headerMenuIcon} />
                                Menu
                            </button>

                            {/* Airline Info */}
                            <div className="flex items-center gap-2 pr-3 border-r border-[#e5e7eb]">
                                <img alt="Airline icon" className="h-4 w-4" src={headerAirlineIcon} />
                                <div className="text-[14px] text-[#0a0a0a]">
                                    SkyWings Airlines
                                    <div className="text-[12px] text-[#6a7282]">License: Active</div>
                                </div>
                            </div>

                            {/* Aircraft Selection Dropdown */}
                            <div className="relative" ref={aircraftDropdownRef}>
                                <button
                                    onClick={() => setShowAircraftMenu(!showAircraftMenu)}
                                    className="flex items-center gap-3 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                                    title="Select aircraft"
                                >
                                    <img alt="Aircraft icon" className="h-5 w-5" src={headerTailNumberIcon} />
                                    <div className="text-[14px] text-[#0a0a0a]">
                                        {selectedAircraft?.registration}
                                        <div className="text-[12px] text-[#6a7282]">{selectedAircraft?.model}</div>
                                    </div>
                                    <img
                                        alt="Dropdown arrow"
                                        className={`h-4 w-4 transition-transform ${showAircraftMenu ? 'rotate-180' : ''}`}
                                        src={headerChevronIcon}
                                    />
                                </button>

                                {/* Aircraft Dropdown Menu */}
                                {showAircraftMenu && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg z-50">
                                        <div className="p-2 max-h-80 overflow-y-auto">
                                            {allAircraft.map((aircraft) => (
                                                <button
                                                    key={aircraft.id}
                                                    onClick={() => {
                                                        setSelectedAircraft(aircraft);
                                                        setShowAircraftMenu(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-[6px] transition-colors ${selectedAircraft?.id === aircraft.id
                                                        ? 'bg-blue-50 border border-blue-200'
                                                        : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="font-semibold text-[14px] text-[#0a0a0a]">{aircraft.registration}</div>
                                                    <div className="text-[12px] text-[#6a7282]">{aircraft.model}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Print Report Button */}
                            <button
                                onClick={handlePrintReport}
                                className="flex h-8 items-center gap-2 rounded-[8px] border border-black/10 bg-white px-3 text-[12px] text-[#0a0a0a] hover:bg-gray-50 active:bg-gray-100 transition-colors whitespace-nowrap"
                                title="Print maintenance report"
                            >
                                <img alt="Print icon" className="h-4 w-4" src={headerPrintIcon} />
                                Print Report
                            </button>

                            {/* Privacy Mode Button */}
                            <button
                                onClick={handlePrivacyMode}
                                className={`flex h-8 items-center gap-2 rounded-[8px] border px-3 text-[12px] transition-colors ${privacyMode
                                    ? 'bg-blue-50 border-blue-300 text-blue-600'
                                    : 'bg-white border-black/10 text-[#0a0a0a] hover:bg-gray-50'
                                    }`}
                                title={privacyMode ? "Disable privacy mode" : "Enable privacy mode"}
                            >
                                <img alt="Privacy icon" className="h-4 w-4" src={headerPrivacyIcon} />
                                Privacy Mode
                            </button>

                            {/* Notifications Button */}
                            <div className="relative" ref={notificationDropdownRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative h-8 w-9 rounded-[8px] border border-black/10 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                    title="View notifications"
                                >
                                    <img alt="Notification bell" className="absolute left-[10px] top-[7px] h-4 w-4" src={headerBellIcon} />
                                    <div className="absolute -top-1 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e7000b] text-[12px] text-white font-semibold">
                                        {notifications.length}
                                    </div>
                                </button>

                                {/* Notifications Dropdown Menu */}
                                {showNotifications && (
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg z-50">
                                        <div className="border-b border-[#e5e7eb] px-4 py-3">
                                            <h3 className="font-semibold text-[14px] text-[#0a0a0a]">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className="px-4 py-3 border-b border-[#e5e7eb] last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notification.severity === 'critical' ? 'bg-[#e7000b]' :
                                                                notification.severity === 'warning' ? 'bg-[#a65f00]' :
                                                                    notification.severity === 'success' ? 'bg-[#008236]' :
                                                                        'bg-[#0a5dd4]'
                                                                }`} />
                                                            <p className="text-[13px] text-[#364153]">{notification.text}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-6 text-center text-[14px] text-[#6a7282]">
                                                    No notifications
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t border-[#e5e7eb] px-4 py-2">
                                            <button className="w-full text-center text-[12px] text-blue-600 hover:text-blue-700 py-2">
                                                View All Notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[10px] border border-[#e5e7eb] bg-white px-5 py-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-[10px] bg-[#fef2f2] p-2">
                                <div className="h-5 w-5 relative">
                                    <div className="absolute inset-[12.44%_8.34%_12.5%_8.26%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiCriticalVector} />
                                    </div>
                                    <div className="absolute bottom-[45.83%] left-1/2 right-1/2 top-[37.5%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiCriticalVector2} />
                                    </div>
                                    <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiCriticalVector3} />
                                    </div>
                                </div>
                            </div>
                            <span className="rounded-[8px] bg-[#ffe2e2] px-2 py-1 text-[12px] text-[#c10007]">Critical</span>
                        </div>
                        <div className="mt-3 text-[24px] text-[#0a0a0a]">0</div>
                        <div className="text-[14px] text-[#4a5565]">Active Alerts</div>
                    </div>

                    <div className="rounded-[10px] border border-[#e5e7eb] bg-white px-5 py-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-[10px] bg-[#fefce8] p-2">
                                <div className="h-5 w-5 relative">
                                    <div className="absolute inset-[8.33%_16.67%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiScheduledVector1} />
                                    </div>
                                    <div className="absolute inset-[8.33%_16.67%_66.67%_58.33%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiScheduledVector2} />
                                    </div>
                                    <div className="absolute inset-[37.5%_58.33%_62.5%_33.33%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiScheduledVector3} />
                                    </div>
                                    <div className="absolute inset-[54.17%_33.33%_45.83%_33.33%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiScheduledVector4} />
                                    </div>
                                    <div className="absolute inset-[70.83%_33.33%_29.17%_33.33%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiScheduledVector4} />
                                    </div>
                                </div>
                            </div>
                            <span className="rounded-[8px] bg-[#fef9c2] px-2 py-1 text-[12px] text-[#a65f00]">Scheduled</span>
                        </div>
                        <div className="mt-3 text-[24px] text-[#0a0a0a]">0</div>
                        <div className="text-[14px] text-[#4a5565]">Upcoming Tasks</div>
                    </div>

                    <div className="rounded-[10px] border border-[#e5e7eb] bg-white px-5 py-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-[10px] bg-[#f0fdf4] p-2">
                                <div className="h-5 w-5 relative">
                                    <div className="absolute inset-[12.5%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiGoodVector1} />
                                    </div>
                                    <div className="absolute bottom-[29.17%] left-3/4 right-1/4 top-[37.5%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiGoodVector2} />
                                    </div>
                                    <div className="absolute inset-[20.83%_45.83%_29.17%_54.17%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiGoodVector3} />
                                    </div>
                                    <div className="absolute inset-[58.33%_66.67%_29.17%_33.33%]">
                                        <img alt="" className="block max-w-none size-full" src={kpiGoodVector4} />
                                    </div>
                                </div>
                            </div>
                            <span className="rounded-[8px] bg-[#dcfce7] px-2 py-1 text-[12px] text-[#008236]">Good</span>
                        </div>
                        <div className="mt-3 text-[24px] text-[#0a0a0a]">95%</div>
                        <div className="text-[14px] text-[#4a5565]">Aircraft Health</div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[410px_410px]">
                    <div className="space-y-6">
                        <div className="rounded-[14px] border border-black/10 bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-[14px] bg-gradient-to-br from-[#155dfc] to-[#1447e6] p-3 shadow-lg">
                                        <img alt="" className="h-6 w-6" src={aircraftLogoVector} />
                                    </div>
                                    <div>
                                        <div className="text-[20px] text-[#0a0a0a]">Aircraft Details</div>
                                        <div className="text-[14px] text-[#4a5565]">Current Selection Overview</div>
                                    </div>
                                </div>
                                <Link
                                    href={`/app/logs?aircraft=${encodeURIComponent(selectedAircraft?.registration || "")}`}
                                    className="relative h-8 w-[115px] rounded-[8px] border border-black/10 bg-white text-[14px] text-[#0a0a0a] flex items-center justify-center hover:bg-gray-50"
                                >
                                    <img alt="" className="absolute left-2 top-[7px] h-4 w-4" src={aircraftDetailsIcon} />
                                    <span className="ml-4">Full Details</span>
                                </Link>
                            </div>

                            <div className="mt-6 rounded-[10px] border border-[#bedbff] bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[14px] text-[#4a5565]">Registration Number</div>
                                        <div className="text-[24px] text-[#0a0a0a]">{selectedAircraft?.registration || "--"}</div>
                                    </div>
                                    <span className="rounded-[8px] border border-[#b9f8cf] bg-[#dcfce7] px-2 py-1 text-[12px] text-[#008236]">Active</span>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-4 text-[14px]">
                                    <div>
                                        <div className="text-[#4a5565]">Model:</div>
                                        <div className="text-[#0a0a0a]">{selectedAircraft?.model || "--"}</div>
                                    </div>
                                    <div>
                                        <div className="text-[#4a5565]">Serial Number:</div>
                                        <div className="text-[#0a0a0a]">{dashboardData?.aircraft?.serialNumber || "--"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center justify-between text-[14px]">
                                    <div className="flex items-center gap-2">
                                        <img alt="" className="h-4 w-4" src={aircraftHealthIcon} />
                                        Overall Health Status
                                    </div>
                                    <div className="text-[#00a63e]">95%</div>
                                </div>
                                <div className="mt-3 h-3 rounded-full bg-[#e5e7eb]">
                                    <div className="h-3 w-full rounded-full bg-[#00a63e]" />
                                </div>
                                <div className="mt-2 text-[12px] text-[#4a5565]">Excellent condition - all systems nominal</div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-3">
                                    <div className="flex items-center gap-2 text-[12px] text-[#4a5565]">
                                        <img alt="" className="h-4 w-4" src={aircraftLocationIcon} />
                                        Location
                                    </div>
                                    <div className="mt-2 text-[14px] text-[#0a0a0a]">JFK International Airport</div>
                                </div>
                                <div className="rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-3">
                                    <div className="flex items-center gap-2 text-[12px] text-[#4a5565]">
                                        <img alt="" className="h-4 w-4" src={aircraftStatusIcon} />
                                        Status
                                    </div>
                                    <div className="mt-2 text-[14px] text-[#0a0a0a]">On Ground</div>
                                </div>
                                <div className="rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-3">
                                    <div className="flex items-center gap-2 text-[12px] text-[#4a5565]">
                                        <img alt="" className="h-4 w-4" src={aircraftHoursIcon} />
                                        Total Hours
                                    </div>
                                    <div className="mt-2 text-[14px] text-[#0a0a0a]">24,680 hrs</div>
                                </div>
                                <div className="rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-3">
                                    <div className="flex items-center gap-2 text-[12px] text-[#4a5565]">
                                        <img alt="" className="h-4 w-4" src={aircraftCyclesIcon} />
                                        Total Cycles
                                    </div>
                                    <div className="mt-2 text-[14px] text-[#0a0a0a]">12,450</div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
                                <div className="flex items-center gap-2 text-[14px] text-[#0a0a0a]">
                                    <img alt="" className="h-4 w-4" src={aircraftEngineIcon} />
                                    Engine Health
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-[14px]">
                                    <div>
                                        <div className="text-[#4a5565]">Health Score:</div>
                                        <div className="text-[#00a63e]">94%</div>
                                    </div>
                                    <div>
                                        <div className="text-[#4a5565]">Status:</div>
                                        <span className="rounded-[8px] bg-[#dcfce7] px-2 py-1 text-[12px] text-[#008236]">Normal</span>
                                    </div>
                                    <div>
                                        <div className="text-[#4a5565]">Temperature:</div>
                                        <div className="text-[#0a0a0a]">450°C</div>
                                    </div>
                                    <div>
                                        <div className="text-[#4a5565]">Oil Pressure:</div>
                                        <div className="text-[#0a0a0a]">45 PSI</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[10px] border border-[#bedbff] bg-[#eff6ff] p-4">
                                <div className="flex items-center gap-2 text-[14px] text-[#1c398e]">
                                    <img alt="" className="h-4 w-4" src={aircraftUpcomingIcon} />
                                    Upcoming Maintenance
                                </div>
                                <div className="mt-2 text-[14px] text-[#0a0a0a]">March 15, 2026</div>
                                <div className="text-[12px] text-[#4a5565]">A-Check due in 50 days</div>
                            </div>
                        </div>

                        <div className="rounded-[14px] border border-black/10 bg-white p-6">
                            <div className="text-[20px] text-[#0a0a0a]">System Health</div>
                            <div className="mt-6 space-y-4">
                                {[
                                    { label: "Engine", value: "94%", status: "OPERATIONAL" },
                                    { label: "Landing Gear", value: "96%", status: "OPERATIONAL" },
                                    { label: "Hydraulic System", value: "88%", status: "OPERATIONAL" },
                                    { label: "Fuel System", value: "97%", status: "OPERATIONAL" },
                                    { label: "Avionics", value: "100%", status: "OPERATIONAL" },
                                    { label: "Electrical System", value: "93%", status: "OPERATIONAL" },
                                    { label: "APU", value: "91%", status: "OPERATIONAL" },
                                ].map((row) => (
                                    <div key={row.label}>
                                        <div className="flex items-center justify-between text-[14px]">
                                            <div className="flex items-center gap-2">
                                                <img alt="" className="h-4 w-4" src={systemHealthIcon} />
                                                {row.label}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#4a5565]">{row.value}</span>
                                                <span className="rounded-[8px] bg-[#dcfce7] px-2 py-1 text-[12px] text-[#016630]">
                                                    {row.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-[#03021333]">
                                            <div className="h-2 rounded-full bg-[#030213]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[14px] border border-black/10 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="rounded-[14px] bg-gradient-to-br from-[#f54900] to-[#ca3500] p-3 shadow-lg">
                                <img alt="" className="h-6 w-6" src={maintenanceLogoVector} />
                            </div>
                            <div>
                                <div className="text-[20px] text-[#0a0a0a]">Maintenance Details</div>
                                <div className="text-[14px] text-[#4a5565]">Tasks, Alerts & Schedule</div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center gap-2">
                                <img alt="" className="h-5 w-5" src={maintenanceCriticalIcon} />
                                <span className="text-[14px] text-[#0a0a0a]">Critical Alerts</span>
                                <span className="rounded-[8px] bg-[#e7000b] px-2 py-1 text-[12px] text-white">1</span>
                            </div>
                            <div className="mt-3 rounded-[10px] border border-[#ffc9c9] bg-[#fef2f2] p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-[14px] text-[#0a0a0a]">Hydraulic System - Left Main Gear</div>
                                    <span className="rounded-[8px] bg-[#e7000b] px-2 py-1 text-[12px] text-white">78%</span>
                                </div>
                                <div className="mt-2 text-[12px] text-[#364153]">Seal failure likely within 200 flight hours</div>
                                <div className="mt-2 flex items-center gap-2 text-[12px] text-[#4a5565]">
                                    <img alt="" className="h-3 w-3" src={maintenanceTimeIcon} />
                                    Timeframe: 2-3 months
                                </div>
                                <div className="mt-3 rounded-[4px] bg-white p-2 text-[12px] text-[#0a0a0a]">
                                    <strong>Action:</strong> Schedule hydraulic seal replacement during next maintenance window
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center gap-2">
                                <img alt="" className="h-5 w-5" src={maintenanceScheduleIcon} />
                                <span className="text-[14px] text-[#0a0a0a]">Upcoming Scheduled Maintenance</span>
                            </div>
                            <div className="mt-3 space-y-3">
                                {[
                                    { name: "A-CHECK", next: "3/14/2026", days: "50 days", remaining: "425 hours / 180 cycles remaining" },
                                    { name: "B-CHECK", next: "8/19/2026", days: "208 days", remaining: "1850 hours / 720 cycles remaining" },
                                    { name: "C-CHECK", next: "5/14/2027", days: "476 days", remaining: "4200 hours / 1650 cycles remaining" },
                                ].map((item) => (
                                    <div key={item.name} className="rounded-[10px] border border-[#bedbff] bg-[#eff6ff] p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[14px] text-[#0a0a0a]">{item.name}</div>
                                            <span className="rounded-[8px] bg-[#dcfce7] px-2 py-1 text-[12px] text-[#008236]">Current</span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-4 text-[12px] text-[#4a5565]">
                                            <div>
                                                <div>Next Due:</div>
                                                <div className="text-[#0a0a0a]">{item.next}</div>
                                            </div>
                                            <div>
                                                <div>Days Until Due:</div>
                                                <div className="text-[#0a0a0a]">{item.days}</div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-[12px] text-[#4a5565]">{item.remaining}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center gap-2">
                                <img alt="" className="h-5 w-5" src={maintenanceTasksIcon} />
                                <span className="text-[14px] text-[#0a0a0a]">Recent Maintenance Tasks</span>
                            </div>
                            <div className="mt-3 space-y-3">
                                <div className="rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[14px] text-[#0a0a0a]">A-Check Inspection</span>
                                                <span className="rounded-[8px] bg-[#dcfce7] px-2 py-1 text-[12px] text-[#008236]">Completed</span>
                                            </div>
                                            <div className="text-[12px] text-[#4a5565]">12/9/2025</div>
                                        </div>
                                        <div className="text-right text-[12px] text-[#4a5565]">
                                            <div className="text-[#0a0a0a]">$8,500</div>
                                            18h
                                        </div>
                                    </div>
                                    <div className="mt-2 text-[12px] text-[#364153]">
                                        Complete A-Check including visual inspection, lubrication, and minor repairs
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-[12px] text-[#4a5565]">
                                        <img alt="" className="h-3 w-3" src={maintenanceUserIcon} />
                                        By: John Anderson
                                    </div>
                                    <div className="mt-3 border-t border-[#e5e7eb] pt-2 text-[12px] text-[#4a5565]">
                                        Parts Replaced:
                                        <div className="mt-1 flex items-center justify-between text-[#0a0a0a]">
                                            • Brake Pad Assembly (x4)
                                            <span className="text-[#4a5565]">$1200</span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between text-[#0a0a0a]">
                                            • Oil Filter (x2)
                                            <span className="text-[#4a5565]">$85</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[14px] text-[#0a0a0a]">Avionics Software Update</span>
                                                <span className="rounded-[8px] bg-[#dcfce7] px-2 py-1 text-[12px] text-[#008236]">Completed</span>
                                            </div>
                                            <div className="text-[12px] text-[#4a5565]">11/4/2025</div>
                                        </div>
                                        <div className="text-right text-[12px] text-[#4a5565]">
                                            <div className="text-[#0a0a0a]">$1,200</div>
                                            4h
                                        </div>
                                    </div>
                                    <div className="mt-2 text-[12px] text-[#364153]">
                                        Critical avionics software update for FMS and TCAS systems
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-[12px] text-[#4a5565]">
                                        <img alt="" className="h-3 w-3" src={maintenanceUserIcon} />
                                        By: Sarah Williams
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="rounded-[10px] border border-[#bedbff] bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] p-3">
                                <div className="flex items-center gap-2 text-[12px] text-[#4a5565]">
                                    <img alt="" className="h-4 w-4" src={maintenanceListIcon} />
                                    Total Tasks
                                </div>
                                <div className="mt-2 text-[24px] text-[#0a0a0a]">2</div>
                            </div>
                            <div className="rounded-[10px] border border-[#b9f8cf] bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] p-3">
                                <div className="flex items-center gap-2 text-[12px] text-[#4a5565]">
                                    <img alt="" className="h-4 w-4" src={maintenanceMoneyIcon} />
                                    Total Cost
                                </div>
                                <div className="mt-2 text-[24px] text-[#0a0a0a]">$9,700</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-[#e5e7eb] pt-4 text-center text-[12px] text-[#6a7282]">
                    © 2026 <span className="text-[#155dfc]">SkyMaintain</span> - All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
                </div>
            </div>

        </div>
    );
}

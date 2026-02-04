/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 2:1304
 * specHash: sha256:app-shell-sidebar-v1
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebarNav from "@/components/app/AppSidebarNav";

// Figma assets for sidebar (node 2:1304)
const imageManager = "https://www.figma.com/api/mcp/asset/24260c56-f8dd-4bdc-b2a8-85f82cd479e3";
const iconLogoVector = "https://www.figma.com/api/mcp/asset/c2589429-cbca-4426-b243-ced142d20273";
const iconClose = "https://www.figma.com/api/mcp/asset/edb5dc23-9416-4600-8b86-41177077c3a6";
const iconDashboard = "https://www.figma.com/api/mcp/asset/08664ca8-e181-414c-a9b1-059aeb35b9b4";
const iconDocs = "https://www.figma.com/api/mcp/asset/e4a4f705-46b6-4434-95c5-5a0c410927e0";
const iconAlerts = "https://www.figma.com/api/mcp/asset/5ecccd57-97a3-4155-a235-6e53d9b821bf";
const iconLogs = "https://www.figma.com/api/mcp/asset/ea746bb0-5784-499d-833b-29a86fa05446";
const iconReports = "https://www.figma.com/api/mcp/asset/b9d22aec-8217-4a33-8d99-c3c83850139b";
const iconCompliance = "https://www.figma.com/api/mcp/asset/5acc2a6a-13a2-4334-90e2-e2fb23c9b6c4";
const iconInsights = "https://www.figma.com/api/mcp/asset/c1b2b94d-4a9e-4a24-8f5a-e8fa4a9f4cdb";
const iconSettings = "https://www.figma.com/api/mcp/asset/d697a8f3-7c94-4d34-a5cf-fac0ebb940c6";
const iconAdmin = "https://www.figma.com/api/mcp/asset/646de6d3-3bbb-42f1-92a3-3bf5f7daf229";
const iconLogout = "https://www.figma.com/api/mcp/asset/33838f38-4cf8-4a76-8892-d866d4b75c45";

const navItems = [
    { href: "/app/dashboard", label: "Dashboard", icon: <img alt="" className="h-5 w-5" src={iconDashboard} /> },
    { href: "/app/docs", label: "Documentation", icon: <img alt="" className="h-5 w-5" src={iconDocs} /> },
    { href: "/app/alerts", label: "Predictive Alerts", icon: <img alt="" className="h-5 w-5" src={iconAlerts} /> },
    { href: "/app/logs", label: "Maintenance Logs", icon: <img alt="" className="h-5 w-5" src={iconLogs} /> },
    { href: "/app/reports", label: "Reports", icon: <img alt="" className="h-5 w-5" src={iconReports} /> },
    { href: "/app/compliance", label: "Regulatory Compliance", icon: <img alt="" className="h-5 w-5" src={iconCompliance} />, tall: true },
    { href: "/app/insights", label: "AI Insights", icon: <img alt="" className="h-5 w-5" src={iconInsights} /> },
    { href: "/app/settings", label: "Settings", icon: <img alt="" className="h-5 w-5" src={iconSettings} /> },
    { href: "/app/admin-panel", label: "Admin Panel", icon: <img alt="" className="h-5 w-5" src={iconAdmin} /> },
];

type AppShellClientProps = {
    children: React.ReactNode;
};

export default function AppShellClient({ children }: AppShellClientProps) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);

    // Scroll to top when route changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: "instant" });
        }
        // Also scroll window to top for fallback
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathname]);

    return (
        <div className="h-dvh overflow-hidden bg-white text-[#0a0a0a]">
            <div className="flex h-full">
                {sidebarVisible && (
                    <aside className="fixed left-0 top-0 z-20 h-dvh w-64 shrink-0 flex flex-col border-r border-[#e5e7eb] bg-white">
                        <div className="border-b border-[#e5e7eb]">
                            <div className="px-6 pt-6 pb-[0.8px]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-[10px] shadow-lg" style={{ background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)" }}>
                                            <div className="flex h-full w-full items-center justify-center">
                                                <img src={iconLogoVector} alt="" className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[18px] leading-7 text-[#0a0a0a]">SkyMaintain</div>
                                            <div className="text-[12px] leading-4 text-[#6a7282]">v1.0</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSidebarVisible(false)}
                                        className="h-8 w-9 rounded-[8px] flex items-center justify-center"
                                        aria-label="Collapse sidebar"
                                    >
                                        <img src={iconClose} alt="" className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <AppSidebarNav items={navItems} />

                        <div className="mt-auto border-t border-[#e5e7eb]">
                            <div className="px-4 pt-[16.8px]">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 overflow-hidden rounded-full">
                                        <img src={imageManager} alt="" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-[14px] leading-5 text-[#0a0a0a]">manager</div>
                                        <div className="text-[12px] leading-4 text-[#6a7282]">Fleet Manager</div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.push("/")}
                                    className="mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-[8px] border border-black/10 bg-white text-[14px] text-[#0a0a0a] hover:bg-gray-50"
                                >
                                    <img src={iconLogout} alt="" className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main content area - scrollable, with left margin when sidebar is visible */}
                <div
                    ref={contentRef}
                    className={`relative flex-1 overflow-y-auto bg-[#f9fafb] ${sidebarVisible ? "ml-64" : ""}`}
                    style={{ height: "100dvh" }}
                >
                    {!sidebarVisible && (
                        <button
                            type="button"
                            onClick={() => setSidebarVisible(true)}
                            className="fixed left-4 top-4 z-10 flex items-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-2 text-[12px] text-[#0a0a0a] shadow-sm"
                            aria-label="Open sidebar"
                        >
                            <img src={iconLogoVector} alt="" className="h-4 w-4" />
                            Menu
                        </button>
                    )}
                    <div
                        className="flex w-full items-start justify-center min-h-full"
                        style={{ background: "linear-gradient(143deg, #f3f4f6 0%, #e5e7eb 100%)" }}
                    >
                        <div className="w-full max-w-[907.2px] px-6 py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

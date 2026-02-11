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
import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    Bell,
    ClipboardList,
    FileBarChart2,
    ShieldCheck,
    Brain,
    Settings,
    Shield,
    LogOut,
    Menu,
    X,
    UserCircle,
    Wrench,
} from "lucide-react";
import AppSidebarNav from "@/components/app/AppSidebarNav";
import AIMechanicFAB from "@/components/ai/AIMechanicFAB";
import AIMechanicPanel from "@/components/ai/AIMechanicPanel";
import { useAuth } from "@/lib/AuthContext";
import { useSessionTimeout, SessionTimeoutWarning, clearSessionData } from "@/lib/SessionTimeout";

const navItems = [
    { href: "/app/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/app/docs", label: "Documentation", icon: <FileText className="h-5 w-5" /> },
    { href: "/app/alerts", label: "Predictive Alerts", icon: <Bell className="h-5 w-5" /> },
    { href: "/app/maintenance-intelligence", label: "Maintenance Intelligence", icon: <Wrench className="h-5 w-5" />, tall: true },
    { href: "/app/logs", label: "Maintenance Logs", icon: <ClipboardList className="h-5 w-5" /> },
    { href: "/app/reports", label: "Reports", icon: <FileBarChart2 className="h-5 w-5" /> },
    { href: "/app/compliance", label: "Regulatory Compliance", icon: <ShieldCheck className="h-5 w-5" />, tall: true },
    { href: "/app/insights", label: "AI Insights", icon: <Brain className="h-5 w-5" /> },
    { href: "/app/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { href: "/app/admin-panel", label: "Admin Panel", icon: <Shield className="h-5 w-5" /> },
];

type AppShellClientProps = {
    children: React.ReactNode;
};

export default function AppShellClient({ children }: AppShellClientProps) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [aiOpen, setAiOpen] = useState(false);
    const [aiInitialQuery, setAiInitialQuery] = useState<string | undefined>(undefined);
    const [aiContext, setAiContext] = useState<string | undefined>(undefined);
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
    const contentRef = useRef<HTMLDivElement>(null);

    // Session timeout management
    const { isWarningVisible, remainingSeconds, extendSession } = useSessionTimeout();

    // Handle manual logout with session cleanup
    const handleLogout = () => {
        clearSessionData();
        logout();
        router.push("/");
    };

    // Scroll to top when route changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: "instant" });
        }
        // Also scroll window to top for fallback
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathname]);

    useEffect(() => {
        const openHandler = (event: Event) => {
            const detail = (event as CustomEvent<{ query?: string; context?: string }>).detail;
            setAiInitialQuery(detail?.query);
            setAiContext(detail?.context);
            setAiOpen(true);
        };

        const legacyHandler = (event: Event) => {
            const detail = (event as CustomEvent<{ context?: string }>).detail;
            setAiInitialQuery(undefined);
            setAiContext(detail?.context);
            setAiOpen(true);
        };

        window.addEventListener("ai-mechanic:open", openHandler);
        window.addEventListener("openAIMechanic", legacyHandler);

        return () => {
            window.removeEventListener("ai-mechanic:open", openHandler);
            window.removeEventListener("openAIMechanic", legacyHandler);
        };
    }, []);

    return (
        <div className="h-dvh overflow-hidden bg-white text-[#0a0a0a]">
            <div className="flex h-full">
                {sidebarVisible && (
                    <aside className="fixed left-0 top-0 z-20 h-dvh w-64 shrink-0 flex flex-col border-r border-[#e5e7eb] bg-white">
                        <div className="border-b border-[#e5e7eb]">
                            <div className="px-6 pt-6 pb-[0.8px]">
                                <div className="flex items-center justify-between">
                                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                        <div className="size-9 rounded-[10px] overflow-hidden shadow-lg">
                                            <img src="/brand/SkyMaintain_logo.png" alt="SkyMaintain" className="h-full w-full object-contain" />
                                        </div>
                                        <div>
                                            <div className="text-[18px] leading-7 text-[#0a0a0a]">SkyMaintain</div>
                                            <div className="text-[12px] leading-4 text-[#6a7282]">v1.0</div>
                                        </div>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setSidebarVisible(false)}
                                        className="h-8 w-9 rounded-[8px] flex items-center justify-center"
                                        aria-label="Collapse sidebar"
                                    >
                                        <X className="h-4 w-4 text-[#6a7282]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <AppSidebarNav items={navItems} />

                        <div className="mt-auto border-t border-[#e5e7eb]">
                            <div className="px-4 pt-[16.8px]">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 overflow-hidden rounded-full">
                                        <UserCircle className="h-10 w-10 text-[#9ca3af]" />
                                    </div>
                                    <div>
                                        <div className="text-[14px] leading-5 text-[#0a0a0a]">manager</div>
                                        <div className="text-[12px] leading-4 text-[#6a7282]">Fleet Manager</div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-[8px] border border-black/10 bg-white text-[14px] text-[#0a0a0a] hover:bg-gray-50"
                                >
                                    <LogOut className="h-4 w-4" />
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
                            <Menu className="h-4 w-4" />
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
            <AIMechanicFAB
                onClick={() => setAiOpen((prev) => !prev)}
            />
            <AIMechanicPanel
                isOpen={aiOpen}
                onClose={() => setAiOpen(false)}
                initialQuery={aiInitialQuery}
                context={aiContext}
            />
            {/* Session Timeout Warning Modal */}
            <SessionTimeoutWarning
                isVisible={isWarningVisible}
                remainingSeconds={remainingSeconds}
                onExtend={extendSession}
            />
        </div>
    );
}

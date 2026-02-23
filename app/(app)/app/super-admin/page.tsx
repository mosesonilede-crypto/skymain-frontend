"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { normalizeRole } from "@/lib/auth/roles";

// Types
type SubscriptionStatus = "active" | "trial" | "expired" | "cancelled" | "pending";
type UserRole = "Admin" | "Fleet Manager" | "Maintenance Engineer" | "Compliance Officer" | "Viewer" | "Trial User";

type PlatformUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    organization: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    subscriptionPlan: string;
    paymentDetails: string;
    createdAt: string;
    lastLoginAt: string | null;
    isActive: boolean;
    country: string;
};

type AccessCodeType = "regulator" | "partner" | "demo" | "trial" | "special";

type GeneratedAccessCode = {
    id: string;
    code: string;
    type: AccessCodeType;
    recipientName: string;
    recipientEmail: string;
    recipientOrg: string;
    purpose: string;
    createdAt: string;
    expiresAt: string;
    usageLimit: "single" | "multi" | "unlimited";
    usageCount: number;
    maxUsageCount: number | null;
    status: "active" | "expired" | "revoked" | "exhausted";
    createdBy: string;
};

type PartnerCard = {
    name: string;
    quote: string;
    bullets: string[];
    ctaLabel: string;
    ctaHref: string;
    imageUrl: string;
};

type PartnerContent = {
    featured: PartnerCard;
    industry: PartnerCard;
};

type SignupNotification = {
    id: string;
    user_id: string | null;
    email: string;
    full_name: string | null;
    org_name: string | null;
    signup_at: string;
    read_at: string | null;
    dismissed_at: string | null;
    is_read: boolean;
    license_code_used: string | null;
    resolved_role: string | null;
    ip_address: string | null;
    metadata: Record<string, unknown>;
};

const PARTNER_STORAGE_KEY = "skymaintain.partnerContent";
const DEFAULT_DEMO_VIDEO_ID = "oMcy-bTjvJ0";
const DEMO_VIDEO_MAX_MB = Math.max(1, Number(process.env.NEXT_PUBLIC_DEMO_VIDEO_MAX_MB || "50") || 50);
const LARGE_VIDEO_FALLBACK_THRESHOLD_MB = 100;

type DemoVideoEntry = {
    id: string;
    source: "upload";
    videoUrl: string;
    fileName?: string;
    title?: string;
    mimeType?: string;
    updatedAt?: string;
    updatedBy?: string;
};

type DemoVideoApiResponse = {
    videos: DemoVideoEntry[];
};

const defaultPartnerContent: PartnerContent = {
    featured: {
        name: "GlobalAero Airlines",
        quote:
            "Partnering with the world's leading carriers. Experience excellence in aviation with our premium fleet services and 24/7 maintenance support.",
        bullets: ["500+ Aircraft Fleet", "Global Coverage", "ISO Certified"],
        ctaLabel: "Learn More",
        ctaHref: "/contact",
        imageUrl: "https://www.figma.com/api/mcp/asset/a3b53e9c-48fc-4c8b-9286-631c6b3c618c",
    },
    industry: {
        name: "AeroTech Parts & Supply",
        quote:
            "Your trusted source for certified aircraft parts and components. Fast delivery, competitive pricing, and unmatched quality assurance.",
        bullets: ["FAA/EASA Certified", "24-Hour Shipping", "50,000+ Parts"],
        ctaLabel: "Shop Parts Catalog",
        ctaHref: "/contact",
        imageUrl: "https://www.figma.com/api/mcp/asset/87a59d7e-ee4a-4616-88c1-ca5d1574a51e",
    },
};
type AdminSummaryResponse = {
    users?: Array<{
        id?: string;
        name?: string;
        email?: string;
        role?: string;
        status?: string;
        subscriptionStatus?: string;
        subscriptionPlan?: string;
        paymentDetails?: string;
        createdAt?: string;
        lastLoginAt?: string | null;
        phone?: string;
        organization?: string;
        country?: string;
    }>;
};

function mapSubscriptionStatus(value?: string): SubscriptionStatus {
    const normalized = (value || "").toLowerCase();
    if (normalized.includes("active")) return "active";
    if (normalized.includes("trial")) return "trial";
    if (normalized.includes("past_due")) return "expired";
    if (normalized.includes("cancel")) return "cancelled";
    if (normalized.includes("expire")) return "expired";
    return "pending";
}

function mapUserRole(value?: string): UserRole {
    const normalized = (value || "").toLowerCase();
    if (normalized.includes("admin")) return "Admin";
    if (normalized.includes("fleet")) return "Fleet Manager";
    if (normalized.includes("maintenance")) return "Maintenance Engineer";
    if (normalized.includes("compliance")) return "Compliance Officer";
    if (normalized.includes("trial")) return "Trial User";
    return "Viewer";
}

// Pill component for status badges
function Pill({ label, tone }: { label: string; tone: "green" | "amber" | "red" | "blue" | "slate" | "purple" }) {
    const colors = {
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-rose-50 text-rose-700 border-rose-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        slate: "bg-slate-50 text-slate-600 border-slate-200",
        purple: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors[tone]}`}>
            {label}
        </span>
    );
}

export default function SuperAdminPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
    const isSuperAdmin = normalizeRole(user?.role) === "super_admin";
    const adminName = user?.displayName || user?.email || "Super Admin";
    const [dataLoading, setDataLoading] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);

    // Data states
    const [users, setUsers] = useState<PlatformUser[]>([]);
    const [accessCodes, setAccessCodes] = useState<GeneratedAccessCode[]>([]);
    const [signupNotifications, setSignupNotifications] = useState<SignupNotification[]>([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"users" | "codes" | "notifications" | "partners" | "announcements" | "settings">("users");

    // Demo Video Settings
    const [demoVideos, setDemoVideos] = useState<DemoVideoEntry[]>([]);
    const [selectedDemoVideoFile, setSelectedDemoVideoFile] = useState<File | null>(null);
    const [demoVideoTitle, setDemoVideoTitle] = useState("");
    const [savingDemoVideo, setSavingDemoVideo] = useState(false);
    const [demoUploadProgress, setDemoUploadProgress] = useState<number | null>(null);

    // Announcements/Mass Email
    const [announcementSubject, setAnnouncementSubject] = useState("");
    const [announcementBody, setAnnouncementBody] = useState("");
    const [announcementType, setAnnouncementType] = useState<"announcement" | "update" | "maintenance" | "security" | "newsletter">("announcement");
    const [targetAudience, setTargetAudience] = useState<"all" | "active" | "trial" | "paid">("all");
    const [sendingAnnouncement, setSendingAnnouncement] = useState(false);
    const [recipientCount, setRecipientCount] = useState<number | null>(null);
    const [loadingRecipientCount, setLoadingRecipientCount] = useState(false);

    // User filters
    const [userSearch, setUserSearch] = useState("");
    const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
    const [userRoleFilter, setUserRoleFilter] = useState<string>("all");

    // View user modal
    const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    // Role editing
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [roleEditUser, setRoleEditUser] = useState<PlatformUser | null>(null);
    const [roleEditNewRole, setRoleEditNewRole] = useState<string>("");
    const [roleEditSaving, setRoleEditSaving] = useState(false);

    // Access code management
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [codeFormData, setCodeFormData] = useState({
        type: "partner" as AccessCodeType,
        recipientName: "",
        recipientEmail: "",
        recipientOrg: "",
        purpose: "",
        expiresInDays: 30,
        usageLimit: "single" as "single" | "multi" | "unlimited",
        maxUsageCount: 1,
    });
    const [creatingCode, setCreatingCode] = useState(false);
    const [accessCodesLoading, setAccessCodesLoading] = useState(false);
    const [accessCodesError, setAccessCodesError] = useState<string | null>(null);

    // UI Notification (toast)
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [partnerDraft, setPartnerDraft] = useState<PartnerContent>(defaultPartnerContent);

    useEffect(() => {
        if (!isAuthenticated || !isSuperAdmin) return;

        let cancelled = false;

        async function loadData() {
            setDataError(null);
            setDataLoading(true);
            try {
                const response = await fetch("/api/admin", { credentials: "include" });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "Failed to load admin data");
                }

                const data = (await response.json()) as AdminSummaryResponse;
                if (cancelled) return;

                const mappedUsers: PlatformUser[] = (data.users || []).map((item, index) => {
                    const subscriptionStatus = mapSubscriptionStatus(item.subscriptionStatus || item.status);
                    return {
                        id: item.id || `USR-${String(index + 1).padStart(3, "0")}`,
                        name: item.name || "Unknown User",
                        email: item.email || "Not available",
                        phone: item.phone || "Not available",
                        organization: item.organization || "Not available",
                        role: mapUserRole(item.role),
                        subscriptionStatus,
                        subscriptionPlan: item.subscriptionPlan || "Not available",
                        paymentDetails: item.paymentDetails || "Not available",
                        createdAt: item.createdAt || "",
                        lastLoginAt: item.lastLoginAt || null,
                        isActive: subscriptionStatus === "active",
                        country: item.country || "Not available",
                    };
                });

                setUsers(mappedUsers);
                setAccessCodes([]);
            } catch (errorCaught) {
                if (cancelled) return;
                setUsers([]);
                setAccessCodes([]);
                setDataError(errorCaught instanceof Error ? errorCaught.message : "Live admin data is not available.");
            } finally {
                if (!cancelled) setDataLoading(false);
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, isSuperAdmin]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(PARTNER_STORAGE_KEY);
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored) as PartnerContent;
            if (parsed?.featured && parsed?.industry) {
                const merged: PartnerContent = {
                    featured: { ...defaultPartnerContent.featured, ...parsed.featured },
                    industry: { ...defaultPartnerContent.industry, ...parsed.industry },
                };
                setPartnerDraft(merged);
            }
        } catch {
            // Ignore malformed storage content
        }
    }, []);

    // Load access codes
    useEffect(() => {
        if (!isAuthenticated || !isSuperAdmin) return;

        async function loadAccessCodes() {
            setAccessCodesLoading(true);
            setAccessCodesError(null);
            try {
                const response = await fetch("/api/admin/access-codes", { credentials: "include" });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "Failed to load access codes");
                }
                const data = await response.json();
                const mappedCodes: GeneratedAccessCode[] = (data.codes || []).map((code: {
                    id: string;
                    code: string;
                    type: AccessCodeType;
                    recipient_name: string;
                    recipient_email: string;
                    recipient_org: string;
                    purpose: string;
                    created_at: string;
                    expires_at: string;
                    usage_limit: "single" | "multi" | "unlimited";
                    usage_count: number;
                    max_usage_count: number | null;
                    status: "active" | "expired" | "revoked" | "exhausted";
                    created_by: string;
                }) => ({
                    id: code.id,
                    code: code.code,
                    type: code.type,
                    recipientName: code.recipient_name,
                    recipientEmail: code.recipient_email,
                    recipientOrg: code.recipient_org,
                    purpose: code.purpose,
                    createdAt: code.created_at,
                    expiresAt: code.expires_at,
                    usageLimit: code.usage_limit,
                    usageCount: code.usage_count,
                    maxUsageCount: code.max_usage_count,
                    status: code.status,
                    createdBy: code.created_by,
                }));
                setAccessCodes(mappedCodes);
            } catch (error) {
                console.error("Error loading access codes:", error);
                setAccessCodesError(error instanceof Error ? error.message : "Failed to load access codes");
            } finally {
                setAccessCodesLoading(false);
            }
        }

        loadAccessCodes();
    }, [isAuthenticated, isSuperAdmin]);

    // Load signup notifications
    useEffect(() => {
        if (!isAuthenticated || !isSuperAdmin) return;

        async function loadSignupNotifications() {
            setNotificationsLoading(true);
            try {
                const response = await fetch("/api/admin/signup-notifications", { credentials: "include" });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("Failed to load signup notifications:", errorData);
                    return;
                }
                const data = await response.json();
                // Filter out dismissed notifications
                const active = (data.notifications || []).filter(
                    (n: SignupNotification) => !n.dismissed_at
                );
                setSignupNotifications(active);
                setUnreadNotificationCount(data.unread_count || 0);
            } catch (error) {
                console.error("Error loading signup notifications:", error);
            } finally {
                setNotificationsLoading(false);
            }
        }

        loadSignupNotifications();
    }, [isAuthenticated, isSuperAdmin]);

    function handleLogout() {
        logout();
        router.push("/app/dashboard");
    }

    function showNotification(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    async function handleMarkNotificationsRead(notificationIds?: string[]) {
        try {
            const response = await fetch("/api/admin/signup-notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(notificationIds ? { notification_ids: notificationIds } : { mark_all_read: true }),
            });

            if (!response.ok) {
                throw new Error("Failed to mark notifications as read");
            }

            if (notificationIds) {
                setSignupNotifications(prev => prev.map(n =>
                    notificationIds.includes(n.id) ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
                ));
                setUnreadNotificationCount(prev => Math.max(0, prev - notificationIds.length));
            } else {
                setSignupNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
                setUnreadNotificationCount(0);
            }
        } catch (error) {
            showNotification("error", error instanceof Error ? error.message : "Failed to mark as read");
        }
    }

    async function handleDismissNotification(notificationId: string) {
        try {
            const response = await fetch(`/api/admin/signup-notifications?id=${notificationId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to dismiss notification");
            }

            setSignupNotifications(prev => prev.filter(n => n.id !== notificationId));
            // Update unread count if dismissed notification was unread
            const dismissed = signupNotifications.find(n => n.id === notificationId);
            if (dismissed && !dismissed.is_read) {
                setUnreadNotificationCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            showNotification("error", error instanceof Error ? error.message : "Failed to dismiss");
        }
    }

    async function handleRevokeCode(codeId: string) {
        try {
            const response = await fetch("/api/admin/access-codes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id: codeId, action: "revoke" }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to revoke access code");
            }

            setAccessCodes(prev => prev.map(c => c.id === codeId ? { ...c, status: "revoked" as const } : c));
            showNotification("success", "Access code revoked.");
        } catch (error) {
            showNotification("error", error instanceof Error ? error.message : "Failed to revoke access code");
        }
    }

    async function handleCreateAccessCode() {
        if (!codeFormData.recipientName.trim() || !codeFormData.recipientEmail.trim()) {
            showNotification("error", "Recipient name and email are required.");
            return;
        }

        setCreatingCode(true);
        try {
            const response = await fetch("/api/admin/access-codes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(codeFormData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create access code");
            }

            // Map the returned code to the UI format
            const newCode: GeneratedAccessCode = {
                id: data.code.id,
                code: data.code.code,
                type: data.code.type,
                recipientName: data.code.recipient_name,
                recipientEmail: data.code.recipient_email,
                recipientOrg: data.code.recipient_org,
                purpose: data.code.purpose,
                createdAt: data.code.created_at,
                expiresAt: data.code.expires_at,
                usageLimit: data.code.usage_limit,
                usageCount: data.code.usage_count,
                maxUsageCount: data.code.max_usage_count,
                status: data.code.status,
                createdBy: data.code.created_by,
            };

            setAccessCodes(prev => [newCode, ...prev]);
            setIsCodeModalOpen(false);
            setCodeFormData({
                type: "partner",
                recipientName: "",
                recipientEmail: "",
                recipientOrg: "",
                purpose: "",
                expiresInDays: 30,
                usageLimit: "single",
                maxUsageCount: 1,
            });
            showNotification("success", `Access code ${newCode.code} created successfully.`);
        } catch (error) {
            showNotification("error", error instanceof Error ? error.message : "Failed to create access code");
        } finally {
            setCreatingCode(false);
        }
    }

    // ── Role editing ──────────────────────────────────────────
    const ASSIGNABLE_ROLES: { value: string; label: string }[] = [
        { value: "admin", label: "Admin" },
        { value: "fleet_manager", label: "Fleet Manager" },
        { value: "maintenance_engineer", label: "Maintenance Engineer" },
        { value: "maintenance_manager", label: "Maintenance Manager" },
        { value: "technician", label: "Technician" },
        { value: "supervisor", label: "Supervisor" },
        { value: "safety_qa", label: "Safety / QA" },
        { value: "user", label: "Viewer" },
    ];

    function openRoleEditor(user: PlatformUser) {
        setRoleEditUser(user);
        // Map the display role back to a raw value for the select
        const mapped = ASSIGNABLE_ROLES.find(r => r.label === user.role);
        setRoleEditNewRole(mapped?.value || "fleet_manager");
        setIsRoleModalOpen(true);
    }

    async function handleUpdateRole() {
        if (!roleEditUser || !roleEditNewRole) return;
        setRoleEditSaving(true);
        try {
            const res = await fetch("/api/admin/users/role", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId: roleEditUser.id, newRole: roleEditNewRole }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to update role");
            }

            // Update the user in local state
            const displayLabel = ASSIGNABLE_ROLES.find(r => r.value === roleEditNewRole)?.label || "Viewer";
            setUsers(prev => prev.map(u =>
                u.id === roleEditUser.id ? { ...u, role: displayLabel as UserRole } : u
            ));

            // Also update the selected user if the view modal is open for the same user
            if (selectedUser?.id === roleEditUser.id) {
                setSelectedUser(prev => prev ? { ...prev, role: displayLabel as UserRole } : null);
            }

            setIsRoleModalOpen(false);
            setRoleEditUser(null);
            showNotification("success", `Role updated to ${displayLabel} for ${roleEditUser.name}`);
        } catch (error) {
            showNotification("error", error instanceof Error ? error.message : "Failed to update role");
        } finally {
            setRoleEditSaving(false);
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        showNotification("success", "Copied to clipboard.");
    }

    function updatePartnerField(section: "featured" | "industry", field: keyof PartnerCard, value: string) {
        setPartnerDraft((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    }

    function updatePartnerBullets(section: "featured" | "industry", value: string) {
        const bullets = value
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        setPartnerDraft((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                bullets,
            },
        }));
    }

    function savePartnerContent() {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify(partnerDraft));
        }
        showNotification("success", "Partner content updated.");
    }

    function resetPartnerContent() {
        setPartnerDraft(defaultPartnerContent);
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(PARTNER_STORAGE_KEY);
        }
        showNotification("success", "Partner content reset to default.");
    }

    // Load demo video configuration
    useEffect(() => {
        let cancelled = false;

        async function loadDemoVideoConfig() {
            try {
                const response = await fetch("/api/admin/demo-video", { credentials: "include" });
                if (!response.ok) return;
                const data = (await response.json()) as DemoVideoApiResponse;
                if (cancelled) return;

                setDemoVideos(data.videos || []);
            } catch {
                if (cancelled) return;
                setDemoVideos([]);
            }
        }

        loadDemoVideoConfig();

        return () => {
            cancelled = true;
        };
    }, []);

    // Upload demo video
    async function saveDemoVideoFile() {
        if (!selectedDemoVideoFile) {
            showNotification("error", "Please select a video file.");
            return;
        }

        if (selectedDemoVideoFile.size > DEMO_VIDEO_MAX_MB * 1024 * 1024) {
            showNotification("error", `Video must be ${DEMO_VIDEO_MAX_MB}MB or smaller.`);
            return;
        }

        setSavingDemoVideo(true);
        setDemoUploadProgress(null);
        try {
            const uploadViaSignedUrl = async (uploadUrl: string, file: File) => {
                await new Promise<void>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("PUT", uploadUrl);
                    xhr.timeout = 30 * 60 * 1000;
                    xhr.setRequestHeader("Content-Type", file.type);

                    xhr.upload.onprogress = (event) => {
                        if (!event.lengthComputable) return;
                        const pct = Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100)));
                        setDemoUploadProgress(pct);
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            setDemoUploadProgress(100);
                            resolve();
                            return;
                        }
                        reject(new Error(`Direct upload failed (${xhr.status})`));
                    };

                    xhr.onerror = () => reject(new Error("Direct upload failed due to a network or CORS error"));
                    xhr.ontimeout = () => reject(new Error("Direct upload timed out"));
                    xhr.send(file);
                });
            };

            let newEntry: DemoVideoEntry | null = null;
            let completed = false;
            const isLargeFile = selectedDemoVideoFile.size > LARGE_VIDEO_FALLBACK_THRESHOLD_MB * 1024 * 1024;
            const titleToUse = demoVideoTitle.trim() || selectedDemoVideoFile.name;

            const initResponse = await fetch("/api/admin/demo-video", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "init-upload",
                    fileName: selectedDemoVideoFile.name,
                    mimeType: selectedDemoVideoFile.type,
                    fileSize: selectedDemoVideoFile.size,
                    title: titleToUse,
                }),
            });

            if (!initResponse.ok && isLargeFile) {
                let initError = "Failed to initialize direct upload.";
                try {
                    const errorJson = (await initResponse.json()) as { error?: string };
                    if (errorJson.error) initError = errorJson.error;
                } catch {
                    // Ignore non-JSON error response.
                }
                throw new Error(initError);
            }

            if (initResponse.ok) {
                const initData = (await initResponse.json()) as {
                    uploadUrl?: string;
                    targetPath?: string;
                };

                if (initData.uploadUrl && initData.targetPath) {
                    await uploadViaSignedUrl(initData.uploadUrl, selectedDemoVideoFile);

                    const finalizeResponse = await fetch("/api/admin/demo-video", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            action: "finalize-upload",
                            targetPath: initData.targetPath,
                            fileName: selectedDemoVideoFile.name,
                            mimeType: selectedDemoVideoFile.type,
                            title: titleToUse,
                        }),
                    });

                    const finalizeData = (await finalizeResponse.json()) as DemoVideoEntry | { error?: string };
                    if (!finalizeResponse.ok) {
                        const message = "error" in finalizeData && finalizeData.error ? finalizeData.error : "Failed to finalize demo video upload.";
                        throw new Error(message);
                    }

                    if ("id" in finalizeData && finalizeData.source === "upload") {
                        newEntry = finalizeData as DemoVideoEntry;
                    }

                    completed = true;
                } else if (isLargeFile) {
                    throw new Error("Direct upload did not return a signed URL. Please redeploy and verify S3 provider settings.");
                }
            }

            if (!completed) {
                const formData = new FormData();
                formData.append("video", selectedDemoVideoFile);
                formData.append("title", titleToUse);

                const response = await fetch("/api/admin/demo-video", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });

                const data = (await response.json()) as DemoVideoEntry | { error?: string };
                if (!response.ok) {
                    const message = "error" in data && data.error ? data.error : "Failed to upload demo video.";
                    throw new Error(message);
                }

                if ("id" in data && data.source === "upload") {
                    newEntry = data as DemoVideoEntry;
                }
            }

            if (newEntry) {
                setDemoVideos((prev) => [...prev, newEntry!]);
            }

            setSelectedDemoVideoFile(null);
            setDemoVideoTitle("");
            setDemoUploadProgress(null);
            showNotification("success", "Demo video added successfully.");
        } catch (error) {
            showNotification("error", error instanceof Error ? error.message : "Failed to upload demo video.");
        } finally {
            setDemoUploadProgress(null);
            setSavingDemoVideo(false);
        }
    }

    async function deleteSingleDemoVideo(videoId: string) {
        setSavingDemoVideo(true);
        try {
            const response = await fetch(`/api/admin/demo-video?id=${encodeURIComponent(videoId)}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = (await response.json()) as DemoVideoApiResponse | { error?: string };
            if (!response.ok) {
                const message = "error" in data && data.error ? data.error : "Failed to delete video.";
                throw new Error(message);
            }

            if ("videos" in data) {
                setDemoVideos((data as DemoVideoApiResponse).videos);
            } else {
                setDemoVideos((prev) => prev.filter((v) => v.id !== videoId));
            }

            showNotification("success", "Video deleted.");
        } catch (error) {
            showNotification("error", error instanceof Error ? error.message : "Failed to delete video.");
        } finally {
            setSavingDemoVideo(false);
        }
    }

    async function resetDemoVideoFile() {
        setSavingDemoVideo(true);
        try {
            const response = await fetch("/api/admin/demo-video", {
                method: "DELETE",
                credentials: "include",
            });

            const data = (await response.json()) as DemoVideoApiResponse | { error?: string };
            if (!response.ok) {
                const message = "error" in data && data.error ? data.error : "Failed to reset demo videos.";
                throw new Error(message);
            }

            setDemoVideos([]);
            setSelectedDemoVideoFile(null);
            setDemoVideoTitle("");
            showNotification("success", "All demo videos removed. Public page will show default YouTube video.");
        } catch (error) {
            showNotification("error", error instanceof Error ? error.message : "Failed to reset demo videos.");
        } finally {
            setSavingDemoVideo(false);
        }
    }

    // Fetch recipient count for announcements
    async function fetchRecipientCount() {
        setLoadingRecipientCount(true);
        try {
            const response = await fetch(`/api/admin/mass-email?audience=${targetAudience}`);
            if (response.ok) {
                const data = await response.json();
                setRecipientCount(data.count);
            }
        } catch {
            setRecipientCount(null);
        } finally {
            setLoadingRecipientCount(false);
        }
    }

    // Send announcement
    async function handleSendAnnouncement() {
        if (!announcementSubject.trim() || !announcementBody.trim()) {
            showNotification("error", "Please fill in both subject and message body.");
            return;
        }

        setSendingAnnouncement(true);
        try {
            const response = await fetch("/api/admin/mass-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: announcementSubject,
                    body: announcementBody,
                    type: announcementType,
                    targetAudience,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification("success", `Announcement sent to ${data.sentCount} user(s).`);
                setAnnouncementSubject("");
                setAnnouncementBody("");
                setRecipientCount(null);
            } else {
                showNotification("error", data.error || "Failed to send announcement.");
            }
        } catch {
            showNotification("error", "Network error. Please try again.");
        } finally {
            setSendingAnnouncement(false);
        }
    }

    // Filter users
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.organization.toLowerCase().includes(userSearch.toLowerCase());
            const matchesStatus = userStatusFilter === "all" || user.subscriptionStatus === userStatusFilter;
            const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [users, userSearch, userStatusFilter, userRoleFilter]);

    // Analytics
    const analytics = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.subscriptionStatus === "active").length;
        const trial = users.filter(u => u.subscriptionStatus === "trial").length;
        const expired = users.filter(u => u.subscriptionStatus === "expired" || u.subscriptionStatus === "cancelled").length;
        const orgs = new Set(users.map(u => u.organization)).size;
        const countries = new Set(users.map(u => u.country)).size;
        return { total, active, trial, expired, orgs, countries };
    }, [users]);

    const subscriptionStatusColors: Record<SubscriptionStatus, "green" | "amber" | "red" | "blue" | "slate"> = {
        active: "green",
        trial: "amber",
        expired: "red",
        cancelled: "red",
        pending: "slate",
    };

    const codeTypeColors: Record<AccessCodeType, "green" | "amber" | "red" | "blue" | "slate" | "purple"> = {
        regulator: "blue",
        partner: "purple",
        demo: "amber",
        trial: "green",
        special: "red",
    };

    if (isAuthLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            </div>
        );
    }

    // Authorization gate
    if (!isAuthenticated || !isSuperAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="mt-4 text-xl font-bold text-slate-900">Super Admin Access</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Your account does not have Super Admin access.
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/app/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                            ← Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">Super Admin Console</h1>
                            <p className="text-sm text-slate-600">Welcome, {adminName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                        </span>
                        <Link
                            href="/app/dashboard"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Back to App
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`mx-6 mt-4 rounded-xl border px-4 py-3 text-sm ${notification.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}>
                    {notification.message}
                </div>
            )}

            {dataError && (
                <div className="mx-6 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {dataError}
                </div>
            )}

            {/* Analytics Cards */}
            <div className="px-6 py-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-slate-900">{analytics.total}</div>
                        <div className="text-sm text-slate-600">Total Users</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-emerald-600">{analytics.active}</div>
                        <div className="text-sm text-slate-600">Active Subscriptions</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-amber-600">{analytics.trial}</div>
                        <div className="text-sm text-slate-600">Trial Users</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-rose-600">{analytics.expired}</div>
                        <div className="text-sm text-slate-600">Expired/Cancelled</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-blue-600">{analytics.orgs}</div>
                        <div className="text-sm text-slate-600">Organizations</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-purple-600">{analytics.countries}</div>
                        <div className="text-sm text-slate-600">Countries</div>
                    </div>
                </div>
                {dataLoading && (
                    <div className="mt-3 text-xs text-slate-500">Loading live admin data...</div>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 bg-white px-6">
                <div className="flex gap-6 overflow-x-auto">
                    {[
                        { id: "users", label: "Platform Users", count: users.length, badge: null },
                        { id: "codes", label: "Access Codes", count: accessCodes.length, badge: null },
                        { id: "notifications", label: "Signups", count: signupNotifications.length, badge: unreadNotificationCount > 0 ? unreadNotificationCount : null },
                        { id: "partners", label: "Partners", count: null, badge: null },
                        { id: "announcements", label: "Announcements", count: null, badge: null },
                        { id: "settings", label: "Settings", count: null, badge: null },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as "users" | "codes" | "notifications" | "partners" | "announcements" | "settings")}
                            className={`relative border-b-2 pb-3 pt-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "border-slate-900 text-slate-900"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab.label}
                            {tab.count !== null && (
                                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs">{tab.count}</span>
                            )}
                            {tab.badge !== null && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                    {tab.badge > 9 ? "9+" : tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {activeTab === "users" && (
                    <div className="space-y-4">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Search users by name, email, or organization..."
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>
                            <select
                                value={userStatusFilter}
                                onChange={(e) => setUserStatusFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="trial">Trial</option>
                                <option value="pending">Pending</option>
                                <option value="expired">Expired</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <select
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                <option value="all">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Fleet Manager">Fleet Manager</option>
                                <option value="Maintenance Engineer">Maintenance Engineer</option>
                                <option value="Compliance Officer">Compliance Officer</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Login Identifier</th>
                                            <th className="px-4 py-3">Organization</th>
                                            <th className="px-4 py-3">Role</th>
                                            <th className="px-4 py-3">Subscription</th>
                                            <th className="px-4 py-3">Payment</th>
                                            <th className="px-4 py-3">Registered</th>
                                            <th className="px-4 py-3">Last Login</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500">
                                                    No live platform users are available.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                                                                {user.name.split(" ").map(n => n[0]).join("")}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                                <div className="text-xs text-slate-500">{user.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-slate-900">{user.email}</div>
                                                        <div className="text-xs text-slate-500">{user.phone}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-slate-900">{user.organization}</div>
                                                        <div className="text-xs text-slate-500">{user.country}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Pill label={user.role} tone="slate" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Pill label={user.subscriptionStatus} tone={subscriptionStatusColors[user.subscriptionStatus]} />
                                                        <div className="mt-1 text-xs text-slate-500">{user.subscriptionPlan}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {user.paymentDetails}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {user.createdAt
                                                            ? new Date(user.createdAt).toLocaleDateString()
                                                            : "Not available"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {user.lastLoginAt
                                                            ? new Date(user.lastLoginAt).toLocaleString()
                                                            : "Never"}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => { setSelectedUser(user); setIsUserModalOpen(true); }}
                                                                className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openRoleEditor(user)}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                                            >
                                                                Edit Role
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                    </div>
                )}

                {activeTab === "codes" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Generate and manage access codes for regulators, partners, and trial users
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                onClick={() => setIsCodeModalOpen(true)}
                            >
                                <span>+</span>
                                Generate Access Code
                            </button>
                        </div>

                        {accessCodesError && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                                {accessCodesError}
                            </div>
                        )}

                        {accessCodesLoading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                            </div>
                        )}

                        {/* Codes Table */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Code</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Recipient</th>
                                            <th className="px-4 py-3">Purpose</th>
                                            <th className="px-4 py-3">Usage</th>
                                            <th className="px-4 py-3">Expires</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {accessCodes.length === 0 && !accessCodesLoading ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                                                    No access codes generated yet. Click &quot;Generate Access Code&quot; to create one.
                                                </td>
                                            </tr>
                                        ) : (
                                            accessCodes.map((code) => (
                                                <tr key={code.id} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono">
                                                                {code.code}
                                                            </code>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(code.code)}
                                                                className="text-slate-400 hover:text-slate-600"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Pill label={code.type} tone={codeTypeColors[code.type]} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-slate-900">{code.recipientName}</div>
                                                        <div className="text-xs text-slate-500">{code.recipientOrg}</div>
                                                    </td>
                                                    <td className="px-4 py-3 max-w-[200px]">
                                                        <div className="text-sm text-slate-600 truncate" title={code.purpose}>
                                                            {code.purpose}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">
                                                        {code.usageLimit === "unlimited"
                                                            ? `${code.usageCount} uses`
                                                            : `${code.usageCount} / ${code.maxUsageCount}`}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {new Date(code.expiresAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Pill
                                                            label={code.status}
                                                            tone={
                                                                code.status === "active" ? "green" :
                                                                    code.status === "revoked" ? "red" :
                                                                        code.status === "exhausted" ? "amber" : "slate"
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {code.status === "active" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRevokeCode(code.id)}
                                                                className="text-sm font-medium text-rose-600 hover:text-rose-700"
                                                            >
                                                                Revoke
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                New user signups are displayed here. Review and track your platform growth.
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadNotificationCount > 0 && (
                                    <button
                                        type="button"
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        onClick={() => handleMarkNotificationsRead()}
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <span className="text-sm text-slate-500">
                                    {unreadNotificationCount} unread
                                </span>
                            </div>
                        </div>

                        {notificationsLoading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                            </div>
                        )}

                        {/* Notifications List */}
                        <div className="space-y-3">
                            {signupNotifications.length === 0 && !notificationsLoading ? (
                                <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
                                    <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm font-medium text-slate-900">No signup notifications</div>
                                    <div className="mt-1 text-sm text-slate-500">
                                        New user signups will appear here for your review.
                                    </div>
                                </div>
                            ) : (
                                signupNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`rounded-xl border bg-white p-4 transition-all ${notif.is_read
                                                ? "border-slate-200"
                                                : "border-emerald-200 bg-emerald-50/50"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${notif.is_read ? "bg-slate-100" : "bg-emerald-100"
                                                    }`}>
                                                    <svg className={`h-4 w-4 ${notif.is_read ? "text-slate-500" : "text-emerald-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-slate-900">
                                                            {notif.full_name || "Unknown User"}
                                                        </span>
                                                        {!notif.is_read && (
                                                            <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-0.5 text-sm text-slate-600">
                                                        {notif.email}
                                                    </div>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                        <span>{notif.org_name || "No organization"}</span>
                                                        <span>•</span>
                                                        <span>{new Date(notif.signup_at).toLocaleString()}</span>
                                                        {notif.resolved_role && (
                                                            <>
                                                                <span>•</span>
                                                                <Pill
                                                                    label={notif.resolved_role.replace(/_/g, " ")}
                                                                    tone={notif.resolved_role === "super_admin" ? "purple" : "blue"}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!notif.is_read && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMarkNotificationsRead([notif.id])}
                                                        className="rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                                                    >
                                                        Mark read
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDismissNotification(notif.id)}
                                                    className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                                    title="Dismiss notification"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Super Admin License Info */}
                        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium text-blue-900">Super Admin Access Control</div>
                                    <div className="mt-1 text-sm text-blue-800">
                                        Only users with a valid Super Admin license code can access this console.
                                        License codes are validated during sign-in. Contact the system administrator
                                        if you need to update authorized license codes or emails.
                                    </div>
                                    <div className="mt-2 text-xs text-blue-700">
                                        Authorized codes are configured via <code className="rounded bg-blue-100 px-1">NEXT_PUBLIC_SUPER_ADMIN_LICENSE_CODES</code> and
                                        <code className="ml-1 rounded bg-blue-100 px-1">NEXT_PUBLIC_SUPER_ADMIN_EMAILS</code> environment variables.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "partners" && (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Partner Content</h2>
                                    <p className="text-sm text-slate-600">
                                        Update sponsored partner content shown on the Partnerships page.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={resetPartnerContent}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Reset to default
                                    </button>
                                    <button
                                        type="button"
                                        onClick={savePartnerContent}
                                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-white p-6">
                                <div className="text-sm font-semibold text-slate-900">Featured Partner</div>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Name</label>
                                        <input
                                            type="text"
                                            value={partnerDraft.featured.name}
                                            onChange={(e) => updatePartnerField("featured", "name", e.target.value)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Quote</label>
                                        <textarea
                                            value={partnerDraft.featured.quote}
                                            onChange={(e) => updatePartnerField("featured", "quote", e.target.value)}
                                            rows={4}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Bullets (one per line)</label>
                                        <textarea
                                            value={partnerDraft.featured.bullets.join("\n")}
                                            onChange={(e) => updatePartnerBullets("featured", e.target.value)}
                                            rows={3}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 uppercase">CTA Label</label>
                                            <input
                                                type="text"
                                                value={partnerDraft.featured.ctaLabel}
                                                onChange={(e) => updatePartnerField("featured", "ctaLabel", e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 uppercase">CTA Link</label>
                                            <input
                                                type="text"
                                                value={partnerDraft.featured.ctaHref}
                                                onChange={(e) => updatePartnerField("featured", "ctaHref", e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Image URL</label>
                                        <input
                                            type="text"
                                            value={partnerDraft.featured.imageUrl}
                                            onChange={(e) => updatePartnerField("featured", "imageUrl", e.target.value)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-6">
                                <div className="text-sm font-semibold text-slate-900">Industry Partner</div>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Name</label>
                                        <input
                                            type="text"
                                            value={partnerDraft.industry.name}
                                            onChange={(e) => updatePartnerField("industry", "name", e.target.value)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Quote</label>
                                        <textarea
                                            value={partnerDraft.industry.quote}
                                            onChange={(e) => updatePartnerField("industry", "quote", e.target.value)}
                                            rows={4}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Bullets (one per line)</label>
                                        <textarea
                                            value={partnerDraft.industry.bullets.join("\n")}
                                            onChange={(e) => updatePartnerBullets("industry", e.target.value)}
                                            rows={3}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 uppercase">CTA Label</label>
                                            <input
                                                type="text"
                                                value={partnerDraft.industry.ctaLabel}
                                                onChange={(e) => updatePartnerField("industry", "ctaLabel", e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 uppercase">CTA Link</label>
                                            <input
                                                type="text"
                                                value={partnerDraft.industry.ctaHref}
                                                onChange={(e) => updatePartnerField("industry", "ctaHref", e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Image URL</label>
                                        <input
                                            type="text"
                                            value={partnerDraft.industry.imageUrl}
                                            onChange={(e) => updatePartnerField("industry", "imageUrl", e.target.value)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                            These updates are stored locally in your browser and will appear on the Partnerships page for
                            this device. To publish globally, connect this form to a live admin service.
                        </div>
                    </div>
                )}

                {activeTab === "announcements" && (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Send Announcement</h2>
                                    <p className="text-sm text-slate-600">
                                        Compose and send mass emails to platform users.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Type and Audience */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">
                                            Announcement Type
                                        </label>
                                        <select
                                            value={announcementType}
                                            onChange={(e) => setAnnouncementType(e.target.value as typeof announcementType)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                        >
                                            <option value="announcement">General Announcement</option>
                                            <option value="update">Platform Update</option>
                                            <option value="maintenance">Maintenance Notice</option>
                                            <option value="security">Security Alert</option>
                                            <option value="newsletter">Newsletter</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">
                                            Target Audience
                                        </label>
                                        <div className="flex gap-2 mt-2">
                                            <select
                                                value={targetAudience}
                                                onChange={(e) => {
                                                    setTargetAudience(e.target.value as typeof targetAudience);
                                                    setRecipientCount(null);
                                                }}
                                                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                            >
                                                <option value="all">All Users</option>
                                                <option value="active">Active Subscribers</option>
                                                <option value="trial">Trial Users</option>
                                                <option value="paid">Paid Users</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={fetchRecipientCount}
                                                disabled={loadingRecipientCount}
                                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                                            >
                                                {loadingRecipientCount ? "..." : "Count"}
                                            </button>
                                        </div>
                                        {recipientCount !== null && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {recipientCount} recipient{recipientCount !== 1 ? "s" : ""} will receive this email
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 uppercase">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={announcementSubject}
                                        onChange={(e) => setAnnouncementSubject(e.target.value)}
                                        placeholder="Enter email subject..."
                                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    />
                                </div>

                                {/* Body */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 uppercase">
                                        Message Body
                                    </label>
                                    <textarea
                                        value={announcementBody}
                                        onChange={(e) => setAnnouncementBody(e.target.value)}
                                        placeholder="Enter your announcement message..."
                                        rows={8}
                                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                                    />
                                    <p className="mt-1 text-xs text-slate-500">
                                        Use plain text. Line breaks will be preserved.
                                    </p>
                                </div>

                                {/* Send Button */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAnnouncementSubject("");
                                            setAnnouncementBody("");
                                            setRecipientCount(null);
                                        }}
                                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSendAnnouncement}
                                        disabled={sendingAnnouncement || !announcementSubject.trim() || !announcementBody.trim()}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sendingAnnouncement ? "Sending..." : "Send Announcement"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                            <strong>Note:</strong> Emails will be sent in batches to avoid overwhelming the mail server.
                            Large recipient lists may take a few minutes to complete.
                        </div>
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="space-y-6">
                        {/* Demo Video Settings */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Demo Videos</h2>
                                    <p className="text-sm text-slate-600">
                                        Upload demo videos for the public demo page. Visitors can browse and select any video to watch.
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                    {demoVideos.length} video{demoVideos.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* Current Videos Grid */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <label className="text-xs font-semibold text-slate-600 uppercase">
                                        Uploaded Demo Videos
                                    </label>
                                    {demoVideos.length > 0 ? (
                                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {demoVideos.map((video) => (
                                                <div
                                                    key={video.id}
                                                    className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white"
                                                >
                                                    <div className="aspect-video w-full bg-black">
                                                        <video
                                                            src={video.videoUrl}
                                                            controls
                                                            preload="metadata"
                                                            className="h-full w-full"
                                                        />
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-sm font-medium text-slate-900 truncate">
                                                            {video.title || video.fileName || "Untitled"}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-500 truncate">
                                                            {video.fileName}
                                                        </p>
                                                        {video.updatedAt && (
                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                {new Date(video.updatedAt).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteSingleDemoVideo(video.id)}
                                                            disabled={savingDemoVideo}
                                                            className="mt-2 inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                                        >
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mt-3 aspect-video w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-black">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${DEFAULT_DEMO_VIDEO_ID}?rel=0&modestbranding=1`}
                                                    title="Default Demo Video"
                                                    className="h-full w-full"
                                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500">
                                                No custom videos uploaded. Using default YouTube video.
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Upload Input */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 uppercase">
                                        Add New Video
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Video title (optional)"
                                            value={demoVideoTitle}
                                            onChange={(e) => setDemoVideoTitle(e.target.value)}
                                            className="w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400"
                                        />
                                        <div className="flex flex-wrap items-center gap-2">
                                            <input
                                                type="file"
                                                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                                onChange={(e) => setSelectedDemoVideoFile(e.target.files?.[0] || null)}
                                                className="flex-1 min-w-[240px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={saveDemoVideoFile}
                                                disabled={savingDemoVideo || !selectedDemoVideoFile}
                                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {savingDemoVideo ? "Uploading..." : "Upload"}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Accepted formats: MP4, WebM, OGG, MOV. Maximum file size: {DEMO_VIDEO_MAX_MB}MB.
                                    </p>
                                    {selectedDemoVideoFile && (
                                        <p className="mt-2 text-xs text-slate-600">
                                            Selected: {selectedDemoVideoFile.name}
                                        </p>
                                    )}
                                    {savingDemoVideo && demoUploadProgress !== null && (
                                        <p className="mt-1 text-xs text-blue-700">
                                            Upload progress: {demoUploadProgress}%
                                        </p>
                                    )}
                                </div>

                                {/* Reset Button */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={resetDemoVideoFile}
                                        disabled={savingDemoVideo || demoVideos.length === 0}
                                        className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Remove All Videos
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                            Uploaded demo videos are served globally and displayed as a gallery on the public demo page.
                            When no videos are uploaded, visitors see the default YouTube demo.
                        </div>
                    </div>
                )}
            </div>

            {/* Access Code Modal */}
            {isCodeModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
                    onClick={(e) => e.target === e.currentTarget && setIsCodeModalOpen(false)}
                >
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">Generate Access Code</h2>
                            <button
                                type="button"
                                onClick={() => setIsCodeModalOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Code Type</label>
                                    <select
                                        value={codeFormData.type}
                                        onChange={(e) => setCodeFormData(prev => ({ ...prev, type: e.target.value as AccessCodeType }))}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    >
                                        <option value="partner">Partner</option>
                                        <option value="regulator">Regulator</option>
                                        <option value="demo">Demo</option>
                                        <option value="trial">Trial</option>
                                        <option value="special">Special</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Expires In</label>
                                    <select
                                        value={codeFormData.expiresInDays}
                                        onChange={(e) => setCodeFormData(prev => ({ ...prev, expiresInDays: parseInt(e.target.value, 10) }))}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    >
                                        <option value={7}>7 days</option>
                                        <option value={14}>14 days</option>
                                        <option value={30}>30 days</option>
                                        <option value={60}>60 days</option>
                                        <option value={90}>90 days</option>
                                        <option value={365}>1 year</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Recipient Name *</label>
                                <input
                                    type="text"
                                    value={codeFormData.recipientName}
                                    onChange={(e) => setCodeFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                                    placeholder="John Smith"
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Recipient Email *</label>
                                <input
                                    type="email"
                                    value={codeFormData.recipientEmail}
                                    onChange={(e) => setCodeFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                                    placeholder="john@example.com"
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Organization</label>
                                <input
                                    type="text"
                                    value={codeFormData.recipientOrg}
                                    onChange={(e) => setCodeFormData(prev => ({ ...prev, recipientOrg: e.target.value }))}
                                    placeholder="ACME Aviation Inc."
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Purpose</label>
                                <input
                                    type="text"
                                    value={codeFormData.purpose}
                                    onChange={(e) => setCodeFormData(prev => ({ ...prev, purpose: e.target.value }))}
                                    placeholder="Partner demo access for evaluation"
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Usage Limit</label>
                                    <select
                                        value={codeFormData.usageLimit}
                                        onChange={(e) => setCodeFormData(prev => ({
                                            ...prev,
                                            usageLimit: e.target.value as "single" | "multi" | "unlimited",
                                            maxUsageCount: e.target.value === "single" ? 1 : (e.target.value === "multi" ? 10 : 0),
                                        }))}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    >
                                        <option value="single">Single Use</option>
                                        <option value="multi">Multi Use</option>
                                        <option value="unlimited">Unlimited</option>
                                    </select>
                                </div>
                                {codeFormData.usageLimit === "multi" && (
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Max Uses</label>
                                        <input
                                            type="number"
                                            value={codeFormData.maxUsageCount}
                                            onChange={(e) => setCodeFormData(prev => ({ ...prev, maxUsageCount: parseInt(e.target.value, 10) || 1 }))}
                                            min={1}
                                            max={1000}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
                            <button
                                type="button"
                                onClick={() => setIsCodeModalOpen(false)}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateAccessCode}
                                disabled={creatingCode}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                {creatingCode ? "Creating..." : "Generate Code"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Role Edit Modal */}
            {isRoleModalOpen && roleEditUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
                    onClick={(e) => e.target === e.currentTarget && setIsRoleModalOpen(false)}
                >
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">Edit User Role</h2>
                            <button
                                type="button"
                                onClick={() => setIsRoleModalOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* User info */}
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                                    {roleEditUser.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">{roleEditUser.name}</div>
                                    <div className="text-xs text-slate-500">{roleEditUser.email}</div>
                                    <div className="text-xs text-slate-500">{roleEditUser.organization}</div>
                                </div>
                            </div>

                            {/* Current role */}
                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase">Current Role</div>
                                <div className="mt-1">
                                    <Pill label={roleEditUser.role} tone="slate" />
                                </div>
                            </div>

                            {/* New role selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Assign New Role</label>
                                <select
                                    value={roleEditNewRole}
                                    onChange={(e) => setRoleEditNewRole(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    {ASSIGNABLE_ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Warning */}
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                                <strong>Important:</strong> Changing this user&apos;s role will take effect the next time they sign in.
                                The user will gain or lose permissions associated with the new role.
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
                            <button
                                type="button"
                                onClick={() => setIsRoleModalOpen(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateRole}
                                disabled={roleEditSaving}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {roleEditSaving ? "Saving..." : "Update Role"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {isUserModalOpen && selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
                    onClick={(e) => e.target === e.currentTarget && setIsUserModalOpen(false)}
                >
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <div className="flex items-start justify-between border-b border-slate-200 p-5">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-600">
                                    {selectedUser.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">{selectedUser.name}</div>
                                    <div className="text-xs text-slate-500">{selectedUser.id}</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsUserModalOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Login Identifier</div>
                                    <div className="mt-1 text-sm text-slate-900">{selectedUser.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Phone</div>
                                    <div className="mt-1 text-sm text-slate-900">{selectedUser.phone}</div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Organization</div>
                                    <div className="mt-1 text-sm text-slate-900">{selectedUser.organization}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Country</div>
                                    <div className="mt-1 text-sm text-slate-900">{selectedUser.country}</div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Role</div>
                                    <div className="mt-1">
                                        <Pill label={selectedUser.role} tone="slate" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Subscription</div>
                                    <div className="mt-1">
                                        <Pill label={selectedUser.subscriptionStatus} tone={subscriptionStatusColors[selectedUser.subscriptionStatus]} />
                                        <span className="ml-2 text-xs text-slate-500">{selectedUser.subscriptionPlan}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase">Payment Details</div>
                                <div className="mt-1 text-sm text-slate-900">
                                    {selectedUser.paymentDetails}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Joined</div>
                                    <div className="mt-1 text-sm text-slate-900">
                                        {selectedUser.createdAt
                                            ? new Date(selectedUser.createdAt).toLocaleDateString()
                                            : "Not available"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Last Login</div>
                                    <div className="mt-1 text-sm text-slate-900">
                                        {selectedUser.lastLoginAt
                                            ? new Date(selectedUser.lastLoginAt).toLocaleString()
                                            : "Never"}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase">Account Status</div>
                                <div className="mt-1">
                                    <Pill label={selectedUser.isActive ? "Active" : "Inactive"} tone={selectedUser.isActive ? "green" : "red"} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 p-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsUserModalOpen(false);
                                    openRoleEditor(selectedUser);
                                }}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Edit Role
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsUserModalOpen(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

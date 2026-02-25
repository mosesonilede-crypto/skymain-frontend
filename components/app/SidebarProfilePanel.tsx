"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    X,
    Camera,
    User,
    Mail,
    Phone,
    Globe,
    Building2,
    Shield,
    Check,
    Loader2,
} from "lucide-react";
import { csrfFetch } from "@/lib/csrfFetch";

interface ProfileData {
    full_name: string;
    email: string;
    phone: string;
    country: string;
    org_name: string;
    role: string;
    avatar_url: string;
}

interface SidebarProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
    userRole?: string;
}

export default function SidebarProfilePanel({
    isOpen,
    onClose,
    userEmail,
    userRole,
}: SidebarProfilePanelProps) {
    const [profile, setProfile] = useState<ProfileData>({
        full_name: "",
        email: userEmail || "",
        phone: "",
        country: "",
        org_name: "",
        role: userRole || "user",
        avatar_url: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const originalProfile = useRef<ProfileData | null>(null);

    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            // Try localStorage cache first for instant load
            const cached = localStorage.getItem("skymaintain.profile");
            let cachedProfile: ProfileData | null = null;
            if (cached) {
                try { cachedProfile = JSON.parse(cached); } catch { /* ignore */ }
            }

            const res = await fetch("/api/profile", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                const loaded: ProfileData = {
                    full_name: data.full_name || "",
                    email: data.email || userEmail || "",
                    phone: data.phone || "",
                    country: data.country || "",
                    org_name: data.org_name || "",
                    role: data.role || userRole || "user",
                    avatar_url: data.avatar_url || "",
                };
                setProfile(loaded);
                originalProfile.current = { ...loaded };
                if (loaded.avatar_url) {
                    setAvatarPreview(loaded.avatar_url);
                }
                localStorage.setItem("skymaintain.profile", JSON.stringify(loaded));
            } else if (cachedProfile) {
                // API failed but we have cached data
                setProfile(cachedProfile);
                originalProfile.current = { ...cachedProfile };
                if (cachedProfile.avatar_url) setAvatarPreview(cachedProfile.avatar_url);
            }
        } catch (e) {
            console.error("Failed to fetch profile:", e);
            // Try localStorage fallback
            const cached = localStorage.getItem("skymaintain.profile");
            if (cached) {
                try {
                    const cachedProfile = JSON.parse(cached);
                    setProfile(cachedProfile);
                    originalProfile.current = { ...cachedProfile };
                    if (cachedProfile.avatar_url) setAvatarPreview(cachedProfile.avatar_url);
                } catch { /* ignore */ }
            }
        } finally {
            setIsLoading(false);
        }
    }, [userEmail, userRole]);

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
            setHasChanges(false);
            setSaveStatus("idle");
        }
    }, [isOpen, fetchProfile]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node) && isOpen) {
                onClose();
            }
        };
        // Slight delay to avoid closing from the click that opens it
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 100);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleFieldChange = (field: keyof ProfileData, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
        setHasChanges(true);
        setSaveStatus("idle");
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarError("");

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setAvatarError("Please select a JPEG, PNG, GIF, or WebP image.");
            return;
        }

        // Validate file size (5 MB)
        if (file.size > 5 * 1024 * 1024) {
            setAvatarError("Image must be under 5 MB.");
            return;
        }

        // Show immediate preview
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload to server
        setAvatarUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const res = await csrfFetch("/api/profile/avatar", {
                method: "POST",
                body: form,
            });
            const data = await res.json();
            if (!res.ok) {
                setAvatarError(data.error || "Upload failed");
                return;
            }
            // Use the returned URL (Supabase Storage public URL)
            const url = data.avatar_url || "";
            setAvatarPreview(url);
            handleFieldChange("avatar_url", url);
        } catch {
            setAvatarError("Upload failed. Please try again.");
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleRemoveAvatar = async () => {
        setAvatarError("");
        setAvatarUploading(true);
        try {
            const res = await csrfFetch("/api/profile/avatar", {
                method: "DELETE",
            });
            if (res.ok) {
                setAvatarPreview(null);
                handleFieldChange("avatar_url", "");
            }
        } catch {
            setAvatarError("Failed to remove photo.");
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus("idle");

        // avatar_url is saved separately via /api/profile/avatar upload endpoint
        const updatedFields: Record<string, string> = {
            full_name: profile.full_name,
            phone: profile.phone,
            country: profile.country,
        };
        // Only include avatar_url if it's a proper URL (not base64)
        if (profile.avatar_url && !profile.avatar_url.startsWith("data:")) {
            updatedFields.avatar_url = profile.avatar_url;
        }

        // Always save to localStorage as immediate persistence
        const localProfile = { ...profile, ...updatedFields };
        localStorage.setItem("skymaintain.profile", JSON.stringify(localProfile));

        try {
            const res = await csrfFetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFields),
            });

            const data = res.ok ? await res.json() : null;
            const merged = data ? { ...profile, ...data } : localProfile;

            setProfile(merged);
            originalProfile.current = { ...merged };
            setSaveStatus("success");
            setHasChanges(false);

            // Dispatch event so other components can react to profile updates
            window.dispatchEvent(
                new CustomEvent("profile:updated", {
                    detail: {
                        full_name: merged.full_name,
                        avatar_url: merged.avatar_url,
                    },
                })
            );
            setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
            // Network error — localStorage save already done, still show success
            setProfile(localProfile);
            originalProfile.current = { ...localProfile };
            setSaveStatus("success");
            setHasChanges(false);
            window.dispatchEvent(
                new CustomEvent("profile:updated", {
                    detail: {
                        full_name: localProfile.full_name,
                        avatar_url: localProfile.avatar_url,
                    },
                })
            );
            setTimeout(() => setSaveStatus("idle"), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = (name: string, email: string) => {
        if (name) {
            return name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return (email?.split("@")[0]?.[0] || "U").toUpperCase();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-2xl border border-b-0 border-[#e5e7eb] bg-white shadow-2xl"
            style={{
                maxHeight: "calc(100dvh - 80px)",
                animation: "slideUpProfile 0.25s ease-out",
            }}
        >
            <style>{`
                @keyframes slideUpProfile {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-3">
                <h3 className="text-[15px] font-semibold text-[#0a0a0a]">Edit Profile</h3>
                <button
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#f3f4f6] transition-colors"
                    aria-label="Close profile editor"
                >
                    <X className="h-4 w-4 text-[#6a7282]" />
                </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(100dvh - 160px)" }}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-[#2563eb]" />
                    </div>
                ) : (
                    <>
                        {/* Avatar Section */}
                        <div className="mb-6 flex flex-col items-center">
                            <div className="group relative">
                                <button
                                    onClick={handleAvatarClick}
                                    className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#e5e7eb] bg-[#f3f4f6] transition-all hover:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                                    aria-label="Change profile picture"
                                >
                                    {avatarPreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={avatarPreview}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[#2563eb] text-white text-[22px] font-semibold">
                                            {getInitials(profile.full_name, profile.email)}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Camera className="h-5 w-5 text-white" />
                                    </div>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                                <button
                                    onClick={handleAvatarClick}
                                    disabled={avatarUploading}
                                    className="text-[12px] text-[#2563eb] hover:text-[#1d4ed8] transition-colors disabled:opacity-50"
                                >
                                    {avatarUploading ? "Uploading…" : "Change photo"}
                                </button>
                                {avatarPreview && (
                                    <button
                                        onClick={handleRemoveAvatar}
                                        disabled={avatarUploading}
                                        className="text-[12px] text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {avatarError && (
                                <p className="mt-1 text-[11px] text-red-500">{avatarError}</p>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-3">
                            {/* Full Name */}
                            <div>
                                <label className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#6a7282]">
                                    <User className="h-3.5 w-3.5" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => handleFieldChange("full_name", e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-[#0a0a0a] placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                                />
                            </div>

                            {/* Email (read-only) */}
                            <div>
                                <label className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#6a7282]">
                                    <Mail className="h-3.5 w-3.5" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    readOnly
                                    className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[13px] text-[#6a7282] cursor-not-allowed"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#6a7282]">
                                    <Phone className="h-3.5 w-3.5" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-[#0a0a0a] placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#6a7282]">
                                    <Globe className="h-3.5 w-3.5" />
                                    Country
                                </label>
                                <input
                                    type="text"
                                    value={profile.country}
                                    onChange={(e) => handleFieldChange("country", e.target.value)}
                                    placeholder="Enter your country"
                                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-[#0a0a0a] placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                                />
                            </div>

                            {/* Organization (read-only) */}
                            <div>
                                <label className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#6a7282]">
                                    <Building2 className="h-3.5 w-3.5" />
                                    Organization
                                </label>
                                <input
                                    type="text"
                                    value={profile.org_name}
                                    readOnly
                                    className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[13px] text-[#6a7282] cursor-not-allowed"
                                />
                            </div>

                            {/* Role (read-only) */}
                            <div>
                                <label className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#6a7282]">
                                    <Shield className="h-3.5 w-3.5" />
                                    Role
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={profile.role.replace(/_/g, " ")}
                                        readOnly
                                        className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[13px] text-[#6a7282] capitalize cursor-not-allowed"
                                    />
                                    <span className="shrink-0 rounded-md bg-[#eff6ff] px-2 py-1 text-[11px] font-medium text-[#2563eb]">
                                        Read-only
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-5 pb-2">
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium transition-all ${hasChanges && !isSaving
                                    ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-sm"
                                    : "bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed"
                                    }`}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : saveStatus === "success" ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Saved!
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                            {saveStatus === "error" && (
                                <p className="mt-2 text-center text-[12px] text-red-500">
                                    Failed to save. Please try again.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

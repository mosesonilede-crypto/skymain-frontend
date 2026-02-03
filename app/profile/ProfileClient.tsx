"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/src/lib/api";
import type { User, ToastType } from "@/src/types";
import Navigation from "@/src/components/Navigation";
import Toast from "@/src/components/Toast";

interface ProfileClientProps {
    user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
    } | null>(null);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            setToast({
                message: "Logout failed. Please try again.",
                type: "error",
            });
            setLoggingOut(false);
        }
    };

    return (
        <>
            <Navigation user={user} />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Profile Settings
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage your account information and preferences
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* User Information Card */}
                        <div className="bg-white rounded-2xl border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">
                                Account Information
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={user.role}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 capitalize"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Organization
                                    </label>
                                    <input
                                        type="text"
                                        value={user.organization_name}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Session Management Card */}
                        <div className="bg-white rounded-2xl border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">
                                Session Management
                            </h2>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Active Session
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        You are currently signed in
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loggingOut ? "Signing out..." : "Sign Out"}
                                </button>
                            </div>
                        </div>

                        {/* System Information Card */}
                        <div className="bg-white rounded-2xl border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">
                                System Information
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-600">
                                        Authentication Method
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                        Cookie-based (HttpOnly)
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-600">
                                        Session Security
                                    </span>
                                    <span className="text-sm font-medium text-green-600">
                                        Encrypted & Secure
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600">
                                        Environment
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                        Development
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}

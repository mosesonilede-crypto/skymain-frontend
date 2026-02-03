"use client";

import { useRouter } from "next/navigation";
import { logout, type User } from "@/src/lib/api";
import { useState } from "react";
import Navigation from "@/src/components/Navigation";
import Toast from "@/src/components/Toast";

interface DashboardClientProps {
    user: User;
}

export default function DashboardClient({ user }: DashboardClientProps) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            setLoggingOut(false);
        }
    };

    return (
        <>
            <Navigation user={user} />

            {error && (
                <Toast
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                />
            )}

            <main className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="mt-2 text-gray-600">
                                Welcome back, {user.email}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="px-6 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {loggingOut ? "Logging out..." : "Logout"}
                        </button>
                    </div>

                    {/* User Info Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900 text-sm">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="font-semibold text-gray-900 capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Organization</p>
                                    <p className="font-semibold text-gray-900 text-sm">{user.organization_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                            <p className="text-blue-100 text-sm mb-4">View your recent maintenance activities and updates</p>
                            <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium text-sm hover:bg-blue-50 transition-colors">
                                View Activity
                            </button>
                        </div>

                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Create Task</h3>
                            <p className="text-purple-100 text-sm mb-4">Start a new maintenance task or work order</p>
                            <button className="bg-white text-purple-600 px-4 py-2 rounded font-medium text-sm hover:bg-purple-50 transition-colors">
                                New Task
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

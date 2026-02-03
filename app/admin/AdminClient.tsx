"use client";

import { useState } from "react";
import type { User } from "@/src/types";
import Navigation from "@/src/components/Navigation";
import { formatDate } from "@/src/lib/utils";

interface AdminClientProps {
    user: User;
}

// Mock data for demonstration
const mockUsers = [
    {
        id: 1,
        email: "admin@skymaintain.com",
        role: "admin",
        organization: "Demo Org",
        status: "active",
        lastLogin: "2026-01-25T10:30:00Z",
    },
    {
        id: 2,
        email: "user@skymaintain.com",
        role: "user",
        organization: "Demo Org",
        status: "active",
        lastLogin: "2026-01-24T15:45:00Z",
    },
    {
        id: 3,
        email: "operator@skymaintain.com",
        role: "operator",
        organization: "Demo Org",
        status: "active",
        lastLogin: "2026-01-25T09:15:00Z",
    },
];

const mockStats = {
    totalUsers: 42,
    activeUsers: 38,
    adminUsers: 5,
    totalOrganizations: 3,
};

export default function AdminClient({ user }: AdminClientProps) {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    return (
        <>
            <Navigation user={user} />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage users, organizations, and system settings
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg border p-6 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">
                                Total Users
                            </p>
                            <p className="text-3xl font-semibold text-gray-900">
                                {mockStats.totalUsers}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border p-6 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">
                                Active Users
                            </p>
                            <p className="text-3xl font-semibold text-green-600">
                                {mockStats.activeUsers}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border p-6 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">
                                Admin Users
                            </p>
                            <p className="text-3xl font-semibold text-blue-600">
                                {mockStats.adminUsers}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border p-6 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">
                                Organizations
                            </p>
                            <p className="text-3xl font-semibold text-gray-900">
                                {mockStats.totalOrganizations}
                            </p>
                        </div>
                    </div>

                    {/* User Management Table */}
                    <div className="bg-white rounded-2xl border shadow-sm">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold">User Management</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                View and manage all users in the system
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Organization
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {mockUsers.map((mockUser) => (
                                        <tr
                                            key={mockUser.id}
                                            className={`hover:bg-gray-50 ${selectedUser === mockUser.id
                                                ? "bg-blue-50"
                                                : ""
                                                }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {mockUser.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                    {mockUser.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {mockUser.organization}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                                    {mockUser.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(mockUser.lastLogin)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() =>
                                                        setSelectedUser(
                                                            mockUser.id
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Showing {mockUsers.length} of{" "}
                                    {mockStats.totalUsers} users
                                </p>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-sm border rounded-md hover:bg-white">
                                        Previous
                                    </button>
                                    <button className="px-3 py-1 text-sm border rounded-md bg-white font-medium">
                                        1
                                    </button>
                                    <button className="px-3 py-1 text-sm border rounded-md hover:bg-white">
                                        2
                                    </button>
                                    <button className="px-3 py-1 text-sm border rounded-md hover:bg-white">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Health Section */}
                    <div className="mt-8 bg-white rounded-2xl border p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">System Health</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700 font-medium">
                                    Database
                                </p>
                                <p className="text-2xl font-semibold text-green-600 mt-1">
                                    Healthy
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700 font-medium">
                                    API Services
                                </p>
                                <p className="text-2xl font-semibold text-green-600 mt-1">
                                    Online
                                </p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700 font-medium">
                                    Cache Status
                                </p>
                                <p className="text-2xl font-semibold text-blue-600 mt-1">
                                    Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

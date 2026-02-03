"use client";

import { useState, useEffect } from "react";
import Navigation from "@/src/components/Navigation";
import Toast from "@/src/components/Toast";

// Define User locally since it's not exported from the API module
type User = {
    id: string;
    email: string;
    name?: string;
    role?: string;
};

// Define VersionInfo locally since it's not exported from the API module
type VersionInfo = {
    service: string;
    version: string;
    env: string;
};

// Define HealthStatus locally since it's not exported from the API module
type HealthStatus = {
    status: string;
    [key: string]: any;
};

// Define RuntimeInfo locally since it's not exported from the API module
type RuntimeInfo = {
    python_version: string;
    platform: string;
    hostname: string;
    process_id: number;
};

// Define CapabilitiesInfo locally since it's not exported from the API module
type CapabilitiesInfo = {
    api_version: string;
    features: string[];
};

// TODO: Import these functions once they are exported from @/src/lib/api
// For now, create placeholder functions
const getVersion = async (): Promise<VersionInfo> => ({ service: "N/A", version: "N/A", env: "N/A" });
const getBuildInfo = async (): Promise<BuildInfo> => ({});
const getRuntimeInfo = async (): Promise<RuntimeInfo> => ({ python_version: "N/A", platform: "N/A", hostname: "N/A", process_id: 0 });
const getCapabilities = async (): Promise<CapabilitiesInfo> => ({ api_version: "N/A", features: [] });
const getHealthz = async (): Promise<HealthStatus> => ({ status: "unknown" });
const getInternalHealthz = async (): Promise<HealthStatus> => ({ status: "unknown" });
const getReadiness = async (): Promise<HealthStatus> => ({ status: "unknown" });
const getLiveness = async (): Promise<HealthStatus> => ({ status: "unknown" });

interface SystemClientProps {
    user: User;
}

interface SystemData {
    version?: { service: string; version: string; env: string };
    build?: BuildInfo;
    runtime?: RuntimeInfo;
    capabilities?: CapabilitiesInfo;
    health?: HealthStatus;
    internalHealth?: HealthStatus;
    readiness?: HealthStatus;
    liveness?: HealthStatus;
}

export default function SystemClient({ user }: SystemClientProps) {
    const [data, setData] = useState<SystemData>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSystemData = async () => {
        try {
            setRefreshing(true);
            const [version, build, runtime, capabilities, health, internalHealth, readiness, liveness] =
                await Promise.allSettled([
                    getVersion(),
                    getBuildInfo(),
                    getRuntimeInfo(),
                    getCapabilities(),
                    getHealthz(),
                    getInternalHealthz(),
                    getReadiness(),
                    getLiveness(),
                ]);

            setData({
                version: version.status === "fulfilled" ? version.value as VersionInfo : undefined,
                build: build.status === "fulfilled" ? build.value as BuildInfo : undefined,
                runtime: runtime.status === "fulfilled" ? runtime.value as RuntimeInfo : undefined,
                capabilities: capabilities.status === "fulfilled" ? capabilities.value as CapabilitiesInfo : undefined,
                health: health.status === "fulfilled" ? health.value as unknown as HealthStatus : undefined,
                internalHealth: internalHealth.status === "fulfilled" ? internalHealth.value as HealthStatus : undefined,
                readiness: readiness.status === "fulfilled" ? readiness.value as HealthStatus : undefined,
                liveness: liveness.status === "fulfilled" ? liveness.value as HealthStatus : undefined,
            });

            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch system data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSystemData();
    }, []);

    const getStatusColor = (status?: string) => {
        if (!status) return "text-gray-500";
        return status === "ok" || status === "healthy" ? "text-green-600" : "text-red-600";
    };

    const getStatusBadge = (status?: string) => {
        if (!status) return <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">Unknown</span>;
        const color = status === "ok" || status === "healthy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
        return <span className={`px-2 py-1 ${color} rounded text-xs font-medium`}>{status.toUpperCase()}</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation user={user} />
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation user={user} />

            {error && (
                <Toast
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                />
            )}

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
                    <button
                        onClick={fetchSystemData}
                        disabled={refreshing}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* Health Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-medium text-gray-500">API Health</h3>
                            {getStatusBadge(data.health?.status)}
                        </div>
                        <p className={`text-2xl font-bold ${getStatusColor(data.health?.status)}`}>
                            {data.health?.status || "N/A"}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Internal Health</h3>
                            {getStatusBadge(data.internalHealth?.status)}
                        </div>
                        <p className={`text-2xl font-bold ${getStatusColor(data.internalHealth?.status)}`}>
                            {data.internalHealth?.status || "N/A"}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Readiness</h3>
                            {getStatusBadge(data.readiness?.status)}
                        </div>
                        <p className={`text-2xl font-bold ${getStatusColor(data.readiness?.status)}`}>
                            {data.readiness?.status || "N/A"}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Liveness</h3>
                            {getStatusBadge(data.liveness?.status)}
                        </div>
                        <p className={`text-2xl font-bold ${getStatusColor(data.liveness?.status)}`}>
                            {data.liveness?.status || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Service Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Version Information</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Service</span>
                                <span className="font-mono text-gray-900">{data.version?.service || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Version</span>
                                <span className="font-mono text-gray-900">{data.version?.version || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Environment</span>
                                <span className="font-mono text-gray-900">{data.version?.env || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Build Information</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {data.build ? (
                                Object.entries(data.build).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-gray-500 capitalize">{key.replace(/_/g, " ")}</span>
                                        <span className="font-mono text-gray-900 text-right max-w-xs truncate">
                                            {String(value)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 italic">Not available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Runtime Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Runtime Information</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {data.runtime ? (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Python Version</span>
                                        <span className="font-mono text-gray-900">{data.runtime.python_version}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Platform</span>
                                        <span className="font-mono text-gray-900">{data.runtime.platform}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Hostname</span>
                                        <span className="font-mono text-gray-900">{data.runtime.hostname}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Process ID</span>
                                        <span className="font-mono text-gray-900">{data.runtime.process_id}</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-400 italic">Not available</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">API Capabilities</h2>
                        </div>
                        <div className="p-6">
                            {data.capabilities ? (
                                <>
                                    <div className="mb-4">
                                        <span className="text-gray-500">API Version:</span>
                                        <span className="ml-2 font-mono text-gray-900">{data.capabilities.api_version}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-2">Features:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {data.capabilities.features?.map((feature: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-400 italic">Not available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Health Checks */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Detailed Health Checks</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Endpoint
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        /v1/healthz
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(data.health?.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <pre className="text-xs">{JSON.stringify(data.health, null, 2)}</pre>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        /internal/healthz
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(data.internalHealth?.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <pre className="text-xs">{JSON.stringify(data.internalHealth, null, 2)}</pre>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        /internal/readiness
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(data.readiness?.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <pre className="text-xs">{JSON.stringify(data.readiness, null, 2)}</pre>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        /internal/liveness
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(data.liveness?.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <pre className="text-xs">{JSON.stringify(data.liveness, null, 2)}</pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

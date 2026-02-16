"use client";

import { useState } from "react";
import { TrendIndicator } from "./TrendIndicator";
import { WhyThisMatters } from "./WhyThisMatters";

interface Metric {
    id: string;
    label: string;
    value: number;
    previousValue?: number;
    format?: "percentage" | "number" | "currency" | "time";
    goodDirection?: "up" | "down";
    icon?: string;
    priority: "primary" | "secondary"; // Controls default visibility
}

interface CondensedMetricsProps {
    metrics: Metric[];
    maxVisible?: number;
    title?: string;
}

/**
 * Displays a condensed set of metrics, limiting default view to reduce cognitive overload.
 * Shows 3-5 primary metrics by default with a "View more" expansion.
 */
export function CondensedMetrics({ metrics, maxVisible = 4, title }: CondensedMetricsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Separate primary and secondary metrics
    const primaryMetrics = metrics.filter((m) => m.priority === "primary");
    const secondaryMetrics = metrics.filter((m) => m.priority === "secondary");

    // Determine what to show
    const visibleMetrics = isExpanded
        ? metrics
        : primaryMetrics.slice(0, maxVisible);

    const hasMore = secondaryMetrics.length > 0 || primaryMetrics.length > maxVisible;

    return (
        <div className="space-y-4">
            {title && (
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    {hasMore && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {isExpanded ? "Show less" : `View ${metrics.length - visibleMetrics.length} more`}
                        </button>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {visibleMetrics.map((metric) => (
                    <CompactMetricCard key={metric.id} metric={metric} />
                ))}
            </div>

            {/* Collapsed indicator */}
            {!isExpanded && hasMore && !title && (
                <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="w-full py-2 text-center text-sm text-slate-500 hover:text-blue-600 border-t border-slate-100 transition"
                >
                    + {metrics.length - visibleMetrics.length} more metrics
                </button>
            )}
        </div>
    );
}

function CompactMetricCard({ metric }: { metric: Metric }) {
    const formatValue = () => {
        switch (metric.format) {
            case "percentage":
                return `${metric.value}%`;
            case "currency":
                return `$${metric.value.toLocaleString()}`;
            case "time":
                return `${metric.value}h`;
            default:
                return metric.value.toLocaleString();
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-slate-500">{metric.label}</span>
                        <WhyThisMatters metricKey={metric.id} position="right">
                            <span />
                        </WhyThisMatters>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{formatValue()}</div>
                </div>
                {metric.icon && <span className="text-xl">{metric.icon}</span>}
            </div>

            {metric.previousValue !== undefined && (
                <div className="mt-2">
                    <TrendIndicator
                        value={metric.value}
                        previousValue={metric.previousValue}
                        goodDirection={metric.goodDirection || "up"}
                        format={metric.format}
                        size="sm"
                    />
                </div>
            )}
        </div>
    );
}

/**
 * Pre-configured dashboard metrics for common roles
 */
export const DASHBOARD_METRICS: Record<string, Metric[]> = {
    technician: [
        { id: "open_work_orders", label: "My Work Orders", value: 3, icon: "📋", priority: "primary" },
        { id: "parts_availability", label: "Parts Ready", value: 2, icon: "📦", priority: "primary" },
        { id: "pending_signoff", label: "Pending Sign-off", value: 2, icon: "✍️", priority: "primary" },
    ],
    supervisor: [
        { id: "team_workload", label: "Team Workload", value: 8, previousValue: 10, goodDirection: "down", icon: "👥", priority: "primary" },
        { id: "priority_items", label: "Priority Items", value: 2, previousValue: 4, goodDirection: "down", icon: "🔴", priority: "primary" },
        { id: "pending_signoff", label: "Awaiting Sign-off", value: 3, icon: "✍️", priority: "primary" },
        { id: "parts_delays", label: "Parts Delays", value: 1, previousValue: 2, goodDirection: "down", icon: "📦", priority: "primary" },
        { id: "technician_utilization", label: "Tech Utilization", value: 78, format: "percentage", previousValue: 72, icon: "📊", priority: "secondary" },
    ],
    manager: [
        { id: "fleet_availability", label: "Fleet Availability", value: 94, format: "percentage", previousValue: 92, icon: "✈️", priority: "primary" },
        { id: "aircraft_on_ground", label: "AOG", value: 1, previousValue: 2, goodDirection: "down", icon: "🛑", priority: "primary" },
        { id: "open_work_orders", label: "Open Work Orders", value: 23, previousValue: 28, goodDirection: "down", icon: "📋", priority: "primary" },
        { id: "dispatch_reliability", label: "Dispatch Reliability", value: 99, format: "percentage", previousValue: 98, icon: "⏱️", priority: "primary" },
        { id: "mttr", label: "MTTR", value: 4.2, format: "time", previousValue: 5.1, goodDirection: "down", icon: "🔧", priority: "secondary" },
        { id: "repeat_defects", label: "Repeat Defects", value: 3, format: "percentage", previousValue: 5, goodDirection: "down", icon: "🔄", priority: "secondary" },
        { id: "parts_availability", label: "Parts Fill Rate", value: 96, format: "percentage", previousValue: 94, icon: "📦", priority: "secondary" },
        { id: "unscheduled_maintenance", label: "Unscheduled %", value: 12, format: "percentage", previousValue: 15, goodDirection: "down", icon: "⚠️", priority: "secondary" },
    ],
    safety_qa: [
        { id: "compliance_rate", label: "Compliance Rate", value: 100, format: "percentage", icon: "✅", priority: "primary" },
        { id: "overdue_tasks", label: "Overdue Items", value: 0, previousValue: 1, goodDirection: "down", icon: "⏰", priority: "primary" },
        { id: "repeat_defects", label: "Repeat Defects", value: 2, previousValue: 4, goodDirection: "down", icon: "🔄", priority: "primary" },
        { id: "ad_compliance", label: "AD Compliance", value: 100, format: "percentage", icon: "📋", priority: "primary" },
        { id: "audit_items", label: "Audit Items", value: 3, icon: "🔍", priority: "secondary" },
    ],
};

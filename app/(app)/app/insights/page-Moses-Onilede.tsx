/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";

// Figma asset URLs
const imgIconAI = "https://www.figma.com/api/mcp/asset/f2922ff1-3430-476d-bda0-e8a786c325ee";
const imgIconAI2 = "https://www.figma.com/api/mcp/asset/18fc8577-9b6d-477b-8d72-02902ec9b3ff";
const imgIconAI3 = "https://www.figma.com/api/mcp/asset/32b8fdb8-d5cc-47f2-b1fe-17273e2fa8ff";
const imgIconAI4 = "https://www.figma.com/api/mcp/asset/89bcf5c2-6172-4c96-9d30-3584b40f0243";
const imgIconAI5 = "https://www.figma.com/api/mcp/asset/5df530f3-762e-473e-bbd4-ce676bd9d07f";
const imgIconAI6 = "https://www.figma.com/api/mcp/asset/fdfd3641-20fe-4542-aaf7-7807371fbef3";
const imgIconAI7 = "https://www.figma.com/api/mcp/asset/f09d172c-408c-4e8b-ae17-8400fa2fed54";
const imgIconAI8 = "https://www.figma.com/api/mcp/asset/0bc9ca5a-5d6e-451b-9967-7815b4992fe6";
const imgIconAI9 = "https://www.figma.com/api/mcp/asset/a7a6ca8a-c2e8-4a31-afad-37875be08754";
const imgIconSparkles = "https://www.figma.com/api/mcp/asset/3874b604-cdda-4621-a4f1-42b18f8ee703";
const imgIconInfo = "https://www.figma.com/api/mcp/asset/22be1235-1328-47cc-b23f-6d3dccf74671";
const imgIconWarning = "https://www.figma.com/api/mcp/asset/f627c523-1441-4a78-9a6b-fc193af37395";
const imgIconChart = "https://www.figma.com/api/mcp/asset/ddd64c88-abe5-42b3-a907-1ddd3d604b72";
const imgIconChevronDown = "https://www.figma.com/api/mcp/asset/2323f58f-40cf-47b8-800e-ac6376202e71";

// Data types
interface PredictiveAlert {
    id: string;
    component: string;
    probability: number;
    description: string;
    timeframe: string;
    dataSources: string;
    recommendedAction: string;
    severity: "critical" | "warning" | "info";
}

// Sample data matching Figma design
const predictiveAlerts: PredictiveAlert[] = [
    {
        id: "PA-001",
        component: "Hydraulic System - Left Main Gear",
        probability: 78,
        description: "Seal failure likely within 200 flight hours",
        timeframe: "2-3 months",
        dataSources: "Pressure sensors, Visual inspection, Historical data",
        recommendedAction: "Schedule hydraulic seal replacement during next maintenance window",
        severity: "critical",
    },
];

export default function AIInsightsPage() {
    // State for expandable sections
    const [expandedAnalytics, setExpandedAnalytics] = useState(false);
    const [showModelInfo, setShowModelInfo] = useState(false);

    // Handler for Model Info button
    const handleModelInfo = useCallback(() => {
        setShowModelInfo(!showModelInfo);
        if (!showModelInfo) {
            alert("AI Model Information:\n\n• Model: SkyMaintain Predictive v2.1\n• Training Data: 15 years of maintenance records\n• Accuracy: 94.2% on historical predictions\n• Last Updated: January 2026\n• Features: Component failure prediction, maintenance scheduling optimization");
        }
    }, [showModelInfo]);

    // Calculate critical alerts count
    const criticalCount = predictiveAlerts.filter(a => a.severity === "critical").length;

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="p-6 space-y-6">
                {/* Page Title */}
                <h1 className="text-2xl font-normal text-[#0a0a0a]">AI Insights</h1>

                {/* Main Card */}
                <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] shadow-sm p-6 space-y-12">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div
                                className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-lg overflow-hidden"
                                style={{
                                    backgroundImage: "linear-gradient(135deg, rgb(152, 16, 250) 0%, rgb(79, 57, 246) 100%)",
                                }}
                            >
                                {/* AI Brain Icon */}
                                <div className="w-6 h-6 relative">
                                    <img src={imgIconAI} alt="" className="absolute left-0 top-0 w-[10px] h-5" />
                                    <img src={imgIconAI2} alt="" className="absolute right-0 top-0 w-[10px] h-5" />
                                    <img src={imgIconAI3} alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-1" />
                                    <img src={imgIconAI4} alt="" className="absolute left-[6px] top-[5px] w-px h-px" />
                                    <img src={imgIconAI5} alt="" className="absolute right-[6px] top-[5px] w-px h-px" />
                                    <img src={imgIconAI6} alt="" className="absolute left-[20px] top-[11px] w-px h-px" />
                                    <img src={imgIconAI7} alt="" className="absolute left-[3.5px] top-[11px] w-px h-px" />
                                    <img src={imgIconAI8} alt="" className="absolute left-[4px] bottom-[6px] w-[2px] h-px" />
                                    <img src={imgIconAI9} alt="" className="absolute right-[4px] bottom-[6px] w-[2px] h-px" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-normal text-[#0a0a0a]">AI Predictive Insights</h2>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#9810fa] text-white text-xs rounded-lg">
                                        <img src={imgIconSparkles} alt="" className="w-3 h-3" />
                                        AI-Powered
                                    </span>
                                </div>
                                <p className="text-sm text-[#4a5565]">Machine learning-based failure predictions</p>
                            </div>
                        </div>
                        <button
                            onClick={handleModelInfo}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg text-sm text-[#0a0a0a] hover:bg-[#f9fafb] transition-colors"
                        >
                            <img src={imgIconInfo} alt="" className="w-4 h-4" />
                            Model Info
                        </button>
                    </div>

                    {/* AI-Generated Predictive Alerts Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <img src={imgIconWarning} alt="" className="w-5 h-5" />
                            <span className="text-sm text-[#0a0a0a]">AI-Generated Predictive Alerts</span>
                            <span className="px-2 py-0.5 bg-[#f54900] text-white text-xs rounded-lg">
                                {criticalCount} Critical
                            </span>
                        </div>

                        {/* Alert Cards */}
                        {predictiveAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="rounded-[10px] border border-[#ffd6a7] p-4 space-y-2"
                                style={{
                                    backgroundImage: "linear-gradient(to right, rgb(255, 247, 237) 0%, rgb(254, 242, 242) 100%)",
                                }}
                            >
                                {/* Alert Header */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-[#0a0a0a]">{alert.component}</span>
                                            <span className="px-2 py-0.5 bg-[#e7000b] text-white text-xs rounded-lg">
                                                {alert.probability}% Probability
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#364153]">{alert.description}</p>
                                    </div>
                                </div>

                                {/* Alert Details */}
                                <div className="flex items-center gap-4 text-xs text-[#4a5565]">
                                    <span>⏱️ Timeframe: {alert.timeframe}</span>
                                    <span>📊 Data Sources: {alert.dataSources}</span>
                                </div>

                                {/* Recommended Action */}
                                <div className="bg-white border border-[#ffd6a7] rounded p-3 space-y-1">
                                    <p className="text-xs font-bold text-[#0a0a0a]">Recommended Action:</p>
                                    <p className="text-xs text-[#364153]">{alert.recommendedAction}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Advanced AI Analytics & Visualizations Section */}
                    <div className="border-t border-[#e5e7eb] pt-6">
                        <button
                            onClick={() => setExpandedAnalytics(!expandedAnalytics)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <img src={imgIconChart} alt="" className="w-4 h-4" />
                                <span className="text-sm text-[#0a0a0a]">Advanced AI Analytics &amp; Visualizations</span>
                            </div>
                            <img
                                src={imgIconChevronDown}
                                alt=""
                                className={`w-4 h-4 transition-transform ${expandedAnalytics ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Expanded Analytics Content */}
                        {expandedAnalytics && (
                            <div className="mt-4 p-4 bg-[#f9fafb] rounded-lg space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Model Accuracy Card */}
                                    <div className="bg-white rounded-lg p-4 border border-[#e5e7eb]">
                                        <p className="text-xs text-[#4a5565] mb-1">Model Accuracy</p>
                                        <p className="text-2xl font-bold text-[#00a63e]">94.2%</p>
                                        <p className="text-xs text-[#6a7282]">Based on historical predictions</p>
                                    </div>

                                    {/* Predictions Made Card */}
                                    <div className="bg-white rounded-lg p-4 border border-[#e5e7eb]">
                                        <p className="text-xs text-[#4a5565] mb-1">Predictions Made</p>
                                        <p className="text-2xl font-bold text-[#155dfc]">1,247</p>
                                        <p className="text-xs text-[#6a7282]">Last 12 months</p>
                                    </div>

                                    {/* Cost Savings Card */}
                                    <div className="bg-white rounded-lg p-4 border border-[#e5e7eb]">
                                        <p className="text-xs text-[#4a5565] mb-1">Estimated Cost Savings</p>
                                        <p className="text-2xl font-bold text-[#9810fa]">$2.4M</p>
                                        <p className="text-xs text-[#6a7282]">Preventive maintenance</p>
                                    </div>
                                </div>

                                {/* Feature Importance */}
                                <div className="bg-white rounded-lg p-4 border border-[#e5e7eb]">
                                    <p className="text-sm font-bold text-[#0a0a0a] mb-3">Feature Importance in Predictions</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[#4a5565]">Sensor Data Analysis</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-48 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#155dfc] w-[85%]" />
                                                </div>
                                                <span className="text-xs text-[#0a0a0a]">85%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[#4a5565]">Historical Maintenance Records</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-48 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#9810fa] w-[72%]" />
                                                </div>
                                                <span className="text-xs text-[#0a0a0a]">72%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[#4a5565]">Flight Hours &amp; Cycles</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-48 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#00a63e] w-[68%]" />
                                                </div>
                                                <span className="text-xs text-[#0a0a0a]">68%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[#4a5565]">Environmental Factors</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-48 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#d08700] w-[45%]" />
                                                </div>
                                                <span className="text-xs text-[#0a0a0a]">45%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

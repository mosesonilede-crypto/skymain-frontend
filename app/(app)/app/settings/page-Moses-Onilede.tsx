/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAircraft, type Aircraft } from "@/lib/AircraftContext";

/* ----------------------------- Icon Fallbacks ----------------------------- */
const makeLetterIcon = (label: string, bg = "#e2e8f0", fg = "#0f172a") => {
    const safeLabel = encodeURIComponent(label);
    const safeBg = encodeURIComponent(bg);
    const safeFg = encodeURIComponent(fg);
    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='${safeBg}'/><text x='16' y='21' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='${safeFg}'>${safeLabel}</text></svg>`;
};

const imgIconSettings = makeLetterIcon("S");
const imgIconUser = makeLetterIcon("U");
const imgIconChevron = makeLetterIcon("˅", "#f1f5f9", "#64748b");
const imgIconPlane = makeLetterIcon("A");
const imgIconShield = makeLetterIcon("R");
const imgIconBell = makeLetterIcon("N");
const imgIconAI = makeLetterIcon("AI", "#ede9fe", "#6d28d9");
const imgIconWrench = makeLetterIcon("W");
const imgIconDoc = makeLetterIcon("D");
const imgIconLock = makeLetterIcon("L");
const imgIconPalette = makeLetterIcon("P");
const imgIconInfo = makeLetterIcon("i", "#e0f2fe", "#0369a1");
const imgIconUserSmall = makeLetterIcon("U", "#e2e8f0", "#475569");
const imgIconMail = makeLetterIcon("@", "#e2e8f0", "#475569");
const imgIconPhone = makeLetterIcon("☎", "#e2e8f0", "#475569");
const imgIconBadge = makeLetterIcon("B", "#e2e8f0", "#475569");
const imgIcon2FA = makeLetterIcon("2", "#e2e8f0", "#475569");
const imgIconSave = makeLetterIcon("✔", "#dcfce7", "#166534");
const imgIconPressure = makeLetterIcon("PSI", "#f8fafc", "#475569");
const imgIconTemp = makeLetterIcon("°", "#f8fafc", "#475569");
const imgIconFlightHours = makeLetterIcon("FH", "#f8fafc", "#475569");

// Regulatory Compliance assets (node 6:2108)
const imgIconRegulatoryHeader = makeLetterIcon("R", "#dbeafe", "#1d4ed8");
const imgIconSelected = makeLetterIcon("✓", "#dcfce7", "#166534");
const imgIconDropdown = makeLetterIcon("▾", "#f1f5f9", "#64748b");
const imgIconAD = makeLetterIcon("AD", "#fff7ed", "#c2410c");
const imgIconSB = makeLetterIcon("SB", "#fff7ed", "#c2410c");
const imgIconLLP = makeLetterIcon("LL", "#fff7ed", "#c2410c");
const imgIconSaveRegulatory = makeLetterIcon("✔", "#dcfce7", "#166534");

// Notifications & Alerts assets (node 6:2596)
const imgIconCriticalAI = makeLetterIcon("!", "#fee2e2", "#b91c1c");
const imgIconMaintenance = makeLetterIcon("M", "#e2e8f0", "#475569");
const imgIconRegDeadlines = makeLetterIcon("RD", "#e2e8f0", "#475569");
const imgIconDocExpiration = makeLetterIcon("DX", "#e2e8f0", "#475569");
const imgIconInApp = makeLetterIcon("IA", "#e2e8f0", "#475569");
const imgIconEmailAlerts = makeLetterIcon("@", "#e2e8f0", "#475569");
const imgIconCheckSelected = makeLetterIcon("✓", "#dcfce7", "#166534");
const imgIconSaveNotifications = makeLetterIcon("✔", "#dcfce7", "#166534");

// AI & Predictive Maintenance assets (node 6:2986)
const imgIconAIHeader = makeLetterIcon("AI", "#ede9fe", "#6d28d9");
const imgIconAICheck = makeLetterIcon("✓", "#dcfce7", "#166534");
const imgIconPredictiveFailure = makeLetterIcon("PF", "#fee2e2", "#b91c1c");
const imgIconTaskPriority = makeLetterIcon("TP", "#e2e8f0", "#475569");
const imgIconAIRecommendations = makeLetterIcon("AR", "#e2e8f0", "#475569");
const imgIconSaveAI = makeLetterIcon("✔", "#dcfce7", "#166534");

// Maintenance Workflow assets (node 6:3377)
const imgIconWorkflowCheck = makeLetterIcon("✓", "#dcfce7", "#166534");
const imgIconArrowRight = makeLetterIcon("→", "#f1f5f9", "#64748b");
const imgIconSaveWorkflow = makeLetterIcon("✔", "#dcfce7", "#166534");

// Documents & Records assets (node 6:3736)
const imgIconMaintRecords = makeLetterIcon("MR", "#e2e8f0", "#475569");
const imgIconInspReports = makeLetterIcon("IR", "#e2e8f0", "#475569");
const imgIconComplianceDocs = makeLetterIcon("CD", "#e2e8f0", "#475569");
const imgIconTechPubs = makeLetterIcon("TP", "#e2e8f0", "#475569");
const imgIconCertifications = makeLetterIcon("C", "#e2e8f0", "#475569");
const imgIconTrainingRecords = makeLetterIcon("TR", "#e2e8f0", "#475569");
const imgIconSaveDocs = makeLetterIcon("✔", "#dcfce7", "#166534");

// Appearance Preferences assets (node 6:4496)
const imgIconLightMode = makeLetterIcon("☀", "#fef3c7", "#b45309");
const imgIconComfortableCheck = makeLetterIcon("✓", "#dcfce7", "#166534");
const imgIconSaveAppearance = makeLetterIcon("✔", "#dcfce7", "#166534");

type SettingsSection =
    | "Account & Profile"
    | "Aircraft & Fleet"
    | "Regulatory Compliance"
    | "Notifications & Alerts"
    | "AI & Predictive Maintenance"
    | "Maintenance Workflow"
    | "Documents & Records"
    | "Security & Audit Logs"
    | "Appearance"
    | "About SkyMaintain";

export default function SettingsPage() {
    const sections: { label: SettingsSection; icon: string }[] = useMemo(
        () => [
            { label: "Account & Profile", icon: imgIconUser },
            { label: "Aircraft & Fleet", icon: imgIconPlane },
            { label: "Regulatory Compliance", icon: imgIconShield },
            { label: "Notifications & Alerts", icon: imgIconBell },
            { label: "AI & Predictive Maintenance", icon: imgIconAI },
            { label: "Maintenance Workflow", icon: imgIconWrench },
            { label: "Documents & Records", icon: imgIconDoc },
            { label: "Security & Audit Logs", icon: imgIconLock },
            { label: "Appearance", icon: imgIconPalette },
            { label: "About SkyMaintain", icon: imgIconInfo },
        ],
        []
    );

    const [active, setActive] = useState<SettingsSection>("Account & Profile");
    const contentRef = useRef<HTMLDivElement | null>(null);

    const { selectedAircraft } = useAircraft();
    const aircraftRegistration = selectedAircraft?.registration ?? "N872LM";
    const aircraftModel = selectedAircraft?.model ?? "Airbus A320";
    const aircraftLastService = selectedAircraft?.lastService ?? "2026-01-15";

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
            contentRef.current.scrollIntoView({ block: "start" });
        }
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [active]);

    const [fullName, setFullName] = useState("John Mitchell");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("+1 (555) 123-4567");
    const [role] = useState("Fleet Manager");
    const [readOnly] = useState(true);

    const [twoFAEnabled, setTwoFAEnabled] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    const closeChangePasswordModal = useCallback(() => {
        setChangePasswordOpen(false);
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    }, []);

    // Aircraft & Fleet state
    const [flightHoursFormat, setFlightHoursFormat] = useState<"decimal" | "hhmm">("decimal");
    const [pressureUnit, setPressureUnit] = useState("PSI");
    const [temperatureUnit, setTemperatureUnit] = useState("Fahrenheit (°F)");
    const [maintenanceBasis, setMaintenanceBasis] = useState<
        "flight-hours" | "flight-cycles" | "calendar-time" | "combined"
    >("flight-hours");

    // Regulatory Compliance state
    const [regulatoryAuthority, setRegulatoryAuthority] = useState("FAA");
    const [trackADs, setTrackADs] = useState(true);
    const [trackSBs, setTrackSBs] = useState(true);
    const [trackLLPs, setTrackLLPs] = useState(true);
    const [warningThreshold, setWarningThreshold] = useState("50");
    const [criticalThreshold, setCriticalThreshold] = useState("10");
    const [mandatoryDocUpload, setMandatoryDocUpload] = useState(true);

    // Notifications & Alerts state
    const [alertCriticalAI, setAlertCriticalAI] = useState(true);
    const [alertMaintenance, setAlertMaintenance] = useState(true);
    const [alertRegulatoryDeadlines, setAlertRegulatoryDeadlines] = useState(true);
    const [alertDocExpiration, setAlertDocExpiration] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [alertSeverityFilter, setAlertSeverityFilter] = useState<
        "critical-only" | "critical-warnings" | "all"
    >("critical-warnings");

    // AI & Predictive Maintenance state
    const [aiAssistanceLevel, setAiAssistanceLevel] = useState<
        "conservative" | "balanced" | "aggressive"
    >("balanced");
    const [predictiveFailureAlerts, setPredictiveFailureAlerts] = useState(true);
    const [aiTaskPrioritization, setAiTaskPrioritization] = useState(true);
    const [aiMaintenanceRecommendations, setAiMaintenanceRecommendations] = useState(true);

    // Maintenance Workflow state
    const [signOffRule, setSignOffRule] = useState<
        "technician-only" | "technician-supervisor" | "dual-inspection"
    >("technician-supervisor");
    const [requireFindings, setRequireFindings] = useState(true);
    const [requireRectification, setRequireRectification] = useState(true);
    const [requireRefDocs, setRequireRefDocs] = useState(true);

    // Documents & Records state
    const [retentionPeriod, setRetentionPeriod] = useState("7");
    const [autoVersionControl, setAutoVersionControl] = useState(true);

    // Documents & Records - Live document statistics (AI-predicted data)
    const documentStatistics = useMemo(() => ({
        totalDocuments: 3247,
        maintenanceRecords: 1456,
        inspectionReports: 589,
        complianceDocuments: 412,
        technicalPublications: 234,
        certifications: 187,
        trainingRecords: 369,
        documentsThisMonth: 127,
        pendingApproval: 8,
        expiringIn30Days: 12,
        averageDocumentAge: "2.3 years",
        storageUsed: "24.7 GB",
        lastUpload: "15 mins ago",
        versionControlEnabled: 2891,
        averageVersions: 3.2,
    }), []);

    // AI Assistant recommendations for Documents & Records
    const aiDocumentRecommendations = useMemo(() => [
        {
            id: "DOC-001",
            type: "warning",
            title: "12 Documents Expiring Soon",
            description: "12 certifications and compliance documents are expiring within 30 days. Review and renew to maintain compliance.",
            confidence: 100,
            impact: "Prevent compliance gaps",
            actionType: "expiring-docs",
        },
        {
            id: "DOC-002",
            type: "optimization",
            title: "Enable 10-Year Retention for Certifications",
            description: "Your certifications category has high audit frequency. Recommend 10-year retention for regulatory protection.",
            confidence: 94,
            impact: "Enhanced audit readiness",
            actionType: "retention-policy",
        },
        {
            id: "DOC-003",
            type: "info",
            title: "Version Control Coverage Optimal",
            description: "89% of documents have version control enabled. This exceeds industry average of 72%.",
            confidence: 98,
            impact: "Current coverage is excellent",
        },
    ], []);

    // Toggle for showing document AI recommendations
    const [showDocumentsAI, setShowDocumentsAI] = useState(true);

    // Selected document categories for management
    const [selectedDocCategories, setSelectedDocCategories] = useState<string[]>([
        "Maintenance Records",
        "Inspection Reports",
        "Compliance Documents",
        "Technical Publications",
        "Certifications",
        "Training Records",
    ]);

    // Appearance Preferences state
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [dashboardDensity, setDashboardDensity] = useState<
        "compact" | "comfortable" | "spacious"
    >("comfortable");
    const [defaultLandingPage, setDefaultLandingPage] = useState("Dashboard");

    // Security & Audit Logs state
    const [sessionTimeout, setSessionTimeout] = useState("30");
    const [requireMFAForSensitive, setRequireMFAForSensitive] = useState(true);
    const [logAllActions, setLogAllActions] = useState(true);
    const [logDataExports, setLogDataExports] = useState(true);
    const [logLoginAttempts, setLogLoginAttempts] = useState(true);
    const [auditRetentionPeriod, setAuditRetentionPeriod] = useState("2");
    const [ipWhitelisting, setIpWhitelisting] = useState(false);

    // Security & Audit Logs - Live audit log statistics (matching Figma 6:4096)
    const auditLogCategories = useMemo(() => [
        {
            id: "login-history",
            name: "Login History",
            icon: "login",
            eventsLogged: 45,
            lastEvent: "2 hours ago",
        },
        {
            id: "maintenance-changes",
            name: "Maintenance Record Changes",
            icon: "wrench",
            eventsLogged: 128,
            lastEvent: "15 minutes ago",
        },
        {
            id: "document-uploads",
            name: "Document Uploads/Deletions",
            icon: "document",
            eventsLogged: 67,
            lastEvent: "1 hour ago",
        },
        {
            id: "compliance-actions",
            name: "Compliance Actions",
            icon: "shield",
            eventsLogged: 34,
            lastEvent: "3 hours ago",
        },
        {
            id: "settings-changes",
            name: "Settings Changes",
            icon: "settings",
            eventsLogged: 12,
            lastEvent: "Yesterday",
        },
    ], []);

    // Aircraft & Fleet - Live fleet statistics (AI-predicted data)
    const fleetStatistics = useMemo(() => ({
        totalAircraft: 12,
        activeAircraft: 10,
        averageFlightHours: 45892.5,
        averageFlightCycles: 28456,
        totalMaintenanceEvents: 847,
        upcomingMaintenance: 5,
        lastUpdated: new Date().toLocaleString(),
    }), []);

    // AI Assistant recommendations for Aircraft & Fleet
    const aiFleetRecommendations = useMemo(() => [
        {
            id: "REC-001",
            type: "optimization",
            title: "Recommended: Combined Maintenance Basis",
            description: "Based on your fleet's usage patterns (high cycles per hour ratio), switching to Combined (Hours + Cycles) tracking will provide more accurate maintenance scheduling.",
            confidence: 94,
            impact: "Reduce unplanned maintenance by ~18%",
        },
        {
            id: "REC-002",
            type: "preference",
            title: "Pressure Unit: PSI Recommended",
            description: "Your maintenance records primarily use PSI. Keeping this setting maintains consistency with historical data.",
            confidence: 98,
            impact: "Consistent reporting across fleet",
        },
        {
            id: "REC-003",
            type: "insight",
            title: "Flight Hours Format Analysis",
            description: "78% of your technicians prefer decimal format for calculations. Current setting aligns with team preference.",
            confidence: 87,
            impact: "Improved data entry accuracy",
        },
    ], []);

    // Show AI recommendation toggle
    const [showAIRecommendations, setShowAIRecommendations] = useState(true);

    // Regulatory Compliance - Live compliance statistics (AI-predicted data)
    const complianceStatistics = useMemo(() => ({
        totalADs: 24,
        pendingADs: 3,
        overduADs: 0,
        totalSBs: 47,
        pendingSBs: 8,
        totalLLPs: 156,
        criticalLLPs: 2,
        complianceRate: 98.5,
        nextDueItem: `AD 2024-15-08 - Landing Gear Inspection (${aircraftRegistration})`,
        nextDueHours: 45,
        lastAuditDate: "2026-01-15",
    }), [aircraftRegistration]);

    // AI Assistant recommendations for Regulatory Compliance
    const aiComplianceRecommendations = useMemo(() => [
        {
            id: "COMP-001",
            type: "warning",
            title: "Threshold Optimization Suggested",
            description: "Based on your fleet's flight patterns, increase Warning Threshold to 75 hours for better planning lead time.",
            confidence: 91,
            impact: "Improve maintenance scheduling by 15%",
            action: () => setWarningThreshold("75"),
        },
        {
            id: "COMP-002",
            type: "info",
            title: "FAA Compliance Aligned",
            description: "Your current settings are fully aligned with FAA Part 121 requirements. No changes needed.",
            confidence: 99,
            impact: "Full regulatory alignment",
        },
        {
            id: "COMP-003",
            type: "critical",
            title: "2 LLPs Approaching Limits",
            description: `Engine disk #2 (${aircraftRegistration}) and Landing Gear actuator (${aircraftRegistration}) are within 500 cycles of their limits.`,
            confidence: 100,
            impact: "Schedule replacement within 60 days",
        },
    ], [aircraftRegistration]);

    // Toggle for showing compliance AI recommendations
    const [showComplianceAI, setShowComplianceAI] = useState(true);

    // Notifications & Alerts - Live notification statistics (AI-predicted data)
    const notificationStatistics = useMemo(() => ({
        totalAlertsToday: 12,
        criticalAlerts: 2,
        warningAlerts: 5,
        infoAlerts: 5,
        alertsThisWeek: 47,
        alertsThisMonth: 156,
        averageResponseTime: "4.2 mins",
        acknowledgedRate: 98.7,
        unreadAlerts: 3,
        emailDeliveryRate: 99.8,
        lastAlertTime: "2 mins ago",
    }), []);

    // AI Assistant recommendations for Notifications & Alerts
    const aiNotificationRecommendations = useMemo(() => [
        {
            id: "NOTIF-001",
            type: "optimization",
            title: "Alert Consolidation Suggested",
            description: "You receive 12+ maintenance reminders daily. Enable smart grouping to reduce notification fatigue by 40%.",
            confidence: 89,
            impact: "Reduce notifications by 40%",
            actionType: "consolidation",
        },
        {
            id: "NOTIF-002",
            type: "warning",
            title: "Critical Alert Response Time",
            description: "Average response to critical alerts is 4.2 mins. Consider enabling SMS for faster acknowledgment.",
            confidence: 94,
            impact: "Faster critical alert response",
            actionType: "sms",
        },
        {
            id: "NOTIF-003",
            type: "info",
            title: "Optimal Severity Filter",
            description: "Based on your role (Fleet Manager), 'Critical + Warnings' filter provides best balance of awareness and productivity.",
            confidence: 96,
            impact: "Recommended: Current setting optimal",
            actionType: "severity",
        },
    ], []);

    // Toggle for showing notifications AI recommendations
    const [showNotificationsAI, setShowNotificationsAI] = useState(true);

    // SMS Alerts state (new delivery method)
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [smsPhoneNumber, setSmsPhoneNumber] = useState("+1 (555) 123-4567");

    // Push Notifications state (new delivery method)
    const [pushNotifications, setPushNotifications] = useState(true);

    // Quiet Hours state
    const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
    const [quietHoursStart, setQuietHoursStart] = useState("22:00");
    const [quietHoursEnd, setQuietHoursEnd] = useState("07:00");

    // AI & Predictive Maintenance - Live AI performance statistics
    const aiPerformanceStatistics = useMemo(() => ({
        predictionAccuracy: 94.2,
        totalPredictionsMade: 1247,
        truPositives: 1175,
        falsePositives: 72,
        costSavings: 2400000,
        avgLeadTime: "72 hours",
        componentsMonitored: 3456,
        activePredictions: 23,
        lastModelUpdate: "January 15, 2026",
        modelVersion: "SkyMaintain ML v2.1.0",
        trainingDataSize: "15 years",
        inferenceLatency: "45ms",
    }), []);

    // AI Assistant recommendations for AI Settings
    const aiSettingsRecommendations = useMemo(() => [
        {
            id: "AI-001",
            type: "optimization",
            title: "Enable Aggressive Mode for High-Risk Components",
            description: "Your fleet has 3 components with elevated failure risk. Aggressive mode would provide 48-hour earlier warnings.",
            confidence: 91,
            impact: "Earlier detection of 48+ hours",
            actionType: "aggressive-mode",
        },
        {
            id: "AI-002",
            type: "info",
            title: "Model Performance Optimal",
            description: "Current 94.2% accuracy is above industry benchmark (89%). No tuning needed.",
            confidence: 99,
            impact: "Performance above benchmark",
        },
        {
            id: "AI-003",
            type: "warning",
            title: "Consider Enabling Task Prioritization",
            description: "AI Task Prioritization can reduce maintenance backlog by 27% based on your current workload patterns.",
            confidence: 88,
            impact: "27% reduction in backlog",
            actionType: "enable-task-priority",
        },
    ], []);

    // Toggle for showing AI settings recommendations
    const [showAISettingsRecommendations, setShowAISettingsRecommendations] = useState(true);

    // Additional AI configuration states
    const [predictionHorizon, setPredictionHorizon] = useState("72");
    const [confidenceDisplayMode, setConfidenceDisplayMode] = useState<"percentage" | "level">("percentage");
    const [autoScheduleMaintenance, setAutoScheduleMaintenance] = useState(false);
    const [aiDataSharingConsent, setAiDataSharingConsent] = useState(true);

    // Maintenance Workflow - Live workflow statistics (AI-predicted data)
    const workflowStatistics = useMemo(() => ({
        totalOpenTasks: 47,
        tasksInProgress: 23,
        tasksInspected: 8,
        tasksClosed: 1247,
        averageCompletionTime: "4.2 hours",
        averageApprovalTime: "1.8 hours",
        supervisorApprovalRate: 94.6,
        dualInspectionRate: 12.3,
        documentComplianceRate: 98.2,
        findingsDocumented: 1189,
        lastTaskCompleted: "12 mins ago",
        overdueTasksCount: 3,
    }), []);

    // AI Assistant recommendations for Maintenance Workflow
    const aiWorkflowRecommendations = useMemo(() => [
        {
            id: "WF-001",
            type: "optimization",
            title: "Enable Dual Inspection for Critical Components",
            description: "Based on your fleet age (avg 8.5 years), enabling dual inspection for flight-critical systems reduces risk by 34%.",
            confidence: 92,
            impact: "34% risk reduction for critical systems",
            actionType: "dual-inspection",
        },
        {
            id: "WF-002",
            type: "warning",
            title: "3 Tasks Overdue for Sign-Off",
            description: "Tasks #1247, #1251, and #1256 have been pending supervisor approval for 24+ hours.",
            confidence: 100,
            impact: "Expedite supervisor approval",
            actionType: "overdue-alert",
        },
        {
            id: "WF-003",
            type: "info",
            title: "Optimal Documentation Rate",
            description: "Your 98.2% documentation compliance exceeds FAA minimum (95%). Technician + Supervisor workflow is working well.",
            confidence: 97,
            impact: "Current workflow is optimal",
        },
    ], []);

    // Toggle for showing workflow AI recommendations
    const [showWorkflowAI, setShowWorkflowAI] = useState(true);

    // Notification state
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    // Router for navigation
    const router = useRouter();

    // Show notification helper
    const showNotification = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Load settings from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedSettings = localStorage.getItem("skymaintain-settings");
            if (savedSettings) {
                try {
                    const settings = JSON.parse(savedSettings);
                    // Account & Profile
                    if (settings.fullName) setFullName(settings.fullName);
                    if (settings.email) setEmail(settings.email);
                    if (settings.phone) setPhone(settings.phone);
                    if (settings.twoFAEnabled !== undefined) setTwoFAEnabled(settings.twoFAEnabled);
                    // Aircraft & Fleet
                    if (settings.flightHoursFormat) setFlightHoursFormat(settings.flightHoursFormat);
                    if (settings.pressureUnit) setPressureUnit(settings.pressureUnit);
                    if (settings.temperatureUnit) setTemperatureUnit(settings.temperatureUnit);
                    if (settings.maintenanceBasis) setMaintenanceBasis(settings.maintenanceBasis);
                    // Regulatory
                    if (settings.regulatoryAuthority) setRegulatoryAuthority(settings.regulatoryAuthority);
                    if (settings.trackADs !== undefined) setTrackADs(settings.trackADs);
                    if (settings.trackSBs !== undefined) setTrackSBs(settings.trackSBs);
                    if (settings.trackLLPs !== undefined) setTrackLLPs(settings.trackLLPs);
                    if (settings.warningThreshold) setWarningThreshold(settings.warningThreshold);
                    if (settings.criticalThreshold) setCriticalThreshold(settings.criticalThreshold);
                    if (settings.mandatoryDocUpload !== undefined) setMandatoryDocUpload(settings.mandatoryDocUpload);
                    // Notifications
                    if (settings.alertCriticalAI !== undefined) setAlertCriticalAI(settings.alertCriticalAI);
                    if (settings.alertMaintenance !== undefined) setAlertMaintenance(settings.alertMaintenance);
                    if (settings.alertRegulatoryDeadlines !== undefined) setAlertRegulatoryDeadlines(settings.alertRegulatoryDeadlines);
                    if (settings.alertDocExpiration !== undefined) setAlertDocExpiration(settings.alertDocExpiration);
                    if (settings.emailAlerts !== undefined) setEmailAlerts(settings.emailAlerts);
                    if (settings.alertSeverityFilter) setAlertSeverityFilter(settings.alertSeverityFilter);
                    // AI
                    if (settings.aiAssistanceLevel) setAiAssistanceLevel(settings.aiAssistanceLevel);
                    if (settings.predictiveFailureAlerts !== undefined) setPredictiveFailureAlerts(settings.predictiveFailureAlerts);
                    if (settings.aiTaskPrioritization !== undefined) setAiTaskPrioritization(settings.aiTaskPrioritization);
                    if (settings.aiMaintenanceRecommendations !== undefined) setAiMaintenanceRecommendations(settings.aiMaintenanceRecommendations);
                    // Workflow
                    if (settings.signOffRule) setSignOffRule(settings.signOffRule);
                    if (settings.requireFindings !== undefined) setRequireFindings(settings.requireFindings);
                    if (settings.requireRectification !== undefined) setRequireRectification(settings.requireRectification);
                    if (settings.requireRefDocs !== undefined) setRequireRefDocs(settings.requireRefDocs);
                    // Documents
                    if (settings.retentionPeriod) setRetentionPeriod(settings.retentionPeriod);
                    if (settings.autoVersionControl !== undefined) setAutoVersionControl(settings.autoVersionControl);
                    // Appearance
                    if (settings.theme) setTheme(settings.theme);
                    if (settings.dashboardDensity) setDashboardDensity(settings.dashboardDensity);
                    if (settings.defaultLandingPage) setDefaultLandingPage(settings.defaultLandingPage);
                    // Security
                    if (settings.sessionTimeout) setSessionTimeout(settings.sessionTimeout);
                    if (settings.requireMFAForSensitive !== undefined) setRequireMFAForSensitive(settings.requireMFAForSensitive);
                    if (settings.logAllActions !== undefined) setLogAllActions(settings.logAllActions);
                    if (settings.logDataExports !== undefined) setLogDataExports(settings.logDataExports);
                    if (settings.logLoginAttempts !== undefined) setLogLoginAttempts(settings.logLoginAttempts);
                    if (settings.auditRetentionPeriod) setAuditRetentionPeriod(settings.auditRetentionPeriod);
                    if (settings.ipWhitelisting !== undefined) setIpWhitelisting(settings.ipWhitelisting);
                } catch {
                    // Invalid JSON, ignore
                }
            }
        }
    }, []);

    const landingPageOptions = [
        { value: "Dashboard", label: "Dashboard" },
        { value: "Predictive Alerts", label: "Predictive Alerts" },
        { value: "Maintenance Logs", label: "Maintenance Logs" },
        { value: "Documentation", label: "Documentation" },
    ];

    const retentionOptions = [
        { value: "1", label: "1 Year" },
        { value: "3", label: "3 Years" },
        { value: "5", label: "5 Years" },
        { value: "7", label: "7 Years (FAA Recommended)" },
        { value: "10", label: "10 Years" },
        { value: "permanent", label: "Permanent" },
    ];

    const regulatoryAuthorities = [
        // North America
        { value: "FAA", label: "🇺🇸 FAA - Federal Aviation Administration (United States)" },
        { value: "TCCA", label: "🇨🇦 TCCA - Transport Canada Civil Aviation (Canada)" },
        { value: "AFAC", label: "🇲🇽 AFAC - Agencia Federal de Aviación Civil (Mexico)" },
        // Europe
        { value: "EASA", label: "🇪🇺 EASA - European Union Aviation Safety Agency (EU)" },
        { value: "CAA-UK", label: "🇬🇧 CAA - Civil Aviation Authority (United Kingdom)" },
        { value: "DGAC-FR", label: "🇫🇷 DGAC - Direction Générale de l'Aviation Civile (France)" },
        { value: "LBA", label: "🇩🇪 LBA - Luftfahrt-Bundesamt (Germany)" },
        { value: "ENAC", label: "🇮🇹 ENAC - Ente Nazionale per l'Aviazione Civile (Italy)" },
        { value: "AESA", label: "🇪🇸 AESA - Agencia Estatal de Seguridad Aérea (Spain)" },
        { value: "FOCA", label: "🇨🇭 FOCA - Federal Office of Civil Aviation (Switzerland)" },
        { value: "CAA-NL", label: "🇳🇱 CAA - Civil Aviation Authority (Netherlands)" },
        { value: "CAA-NO", label: "🇳🇴 CAA - Civil Aviation Authority (Norway)" },
        { value: "CAA-SE", label: "🇸🇪 Transportstyrelsen (Sweden)" },
        { value: "IAA", label: "🇮🇪 IAA - Irish Aviation Authority (Ireland)" },
        { value: "CAA-PL", label: "🇵🇱 CAA - Civil Aviation Authority (Poland)" },
        { value: "SHGM", label: "🇹🇷 SHGM - Directorate General of Civil Aviation (Turkey)" },
        // Asia-Pacific
        { value: "CASA", label: "🇦🇺 CASA - Civil Aviation Safety Authority (Australia)" },
        { value: "CAA-NZ", label: "🇳🇿 CAA - Civil Aviation Authority (New Zealand)" },
        { value: "CAAC", label: "🇨🇳 CAAC - Civil Aviation Administration of China" },
        { value: "JCAB", label: "🇯🇵 JCAB - Japan Civil Aviation Bureau" },
        { value: "MOLIT", label: "🇰🇷 MOLIT - Ministry of Land, Infrastructure and Transport (South Korea)" },
        { value: "DGCA-IN", label: "🇮🇳 DGCA - Directorate General of Civil Aviation (India)" },
        { value: "CAAS", label: "🇸🇬 CAAS - Civil Aviation Authority of Singapore" },
        { value: "CAAM", label: "🇲🇾 CAAM - Civil Aviation Authority of Malaysia" },
        { value: "CAAP", label: "🇵🇭 CAAP - Civil Aviation Authority of the Philippines" },
        { value: "CAAT", label: "🇹🇭 CAAT - Civil Aviation Authority of Thailand" },
        { value: "DGCA-ID", label: "🇮🇩 DGCA - Directorate General of Civil Aviation (Indonesia)" },
        { value: "CAAV", label: "🇻🇳 CAAV - Civil Aviation Authority of Vietnam" },
        // Middle East
        { value: "GACA", label: "🇸🇦 GACA - General Authority of Civil Aviation (Saudi Arabia)" },
        { value: "GCAA", label: "🇦🇪 GCAA - General Civil Aviation Authority (UAE)" },
        { value: "QCAA", label: "🇶🇦 QCAA - Qatar Civil Aviation Authority" },
        { value: "CAAI", label: "🇮🇱 CAAI - Civil Aviation Authority of Israel" },
        // Africa
        { value: "ECAA-EG", label: "🇪🇬 ECAA - Egyptian Civil Aviation Authority" },
        { value: "SACAA", label: "🇿🇦 SACAA - South African Civil Aviation Authority" },
        { value: "KCAA", label: "🇰🇪 KCAA - Kenya Civil Aviation Authority" },
        { value: "NCAA", label: "🇳🇬 NCAA - Nigerian Civil Aviation Authority" },
        // South America
        { value: "ANAC-BR", label: "🇧🇷 ANAC - Agência Nacional de Aviação Civil (Brazil)" },
        { value: "ANAC-AR", label: "🇦🇷 ANAC - Administración Nacional de Aviación Civil (Argentina)" },
        { value: "DGAC-CL", label: "🇨🇱 DGAC - Dirección General de Aeronáutica Civil (Chile)" },
        { value: "UAEAC", label: "🇨🇴 UAEAC - Unidad Administrativa Especial de Aeronáutica Civil (Colombia)" },
        // Caribbean
        { value: "JCAA", label: "🇯🇲 JCAA - Jamaica Civil Aviation Authority" },
        { value: "BCAA", label: "🇧🇸 BCAA - Bahamas Civil Aviation Authority" },
        { value: "CAACI", label: "🇰🇾 CAACI - Civil Aviation Authority of the Cayman Islands" },
    ];

    const sessionTimeoutOptions = [
        { value: "15", label: "15 minutes" },
        { value: "30", label: "30 minutes (Recommended)" },
        { value: "60", label: "1 hour" },
        { value: "120", label: "2 hours" },
        { value: "480", label: "8 hours (Work day)" },
    ];

    // Save settings to localStorage
    const saveSettings = useCallback((sectionName: string) => {
        setSaving(true);
        const allSettings = {
            // Account & Profile
            fullName, email, phone, twoFAEnabled,
            // Aircraft & Fleet
            flightHoursFormat, pressureUnit, temperatureUnit, maintenanceBasis,
            // Regulatory
            regulatoryAuthority, trackADs, trackSBs, trackLLPs, warningThreshold, criticalThreshold, mandatoryDocUpload,
            // Notifications
            alertCriticalAI, alertMaintenance, alertRegulatoryDeadlines, alertDocExpiration, emailAlerts, alertSeverityFilter,
            // AI
            aiAssistanceLevel, predictiveFailureAlerts, aiTaskPrioritization, aiMaintenanceRecommendations,
            // Workflow
            signOffRule, requireFindings, requireRectification, requireRefDocs,
            // Documents
            retentionPeriod, autoVersionControl,
            // Appearance
            theme, dashboardDensity, defaultLandingPage,
            // Security
            sessionTimeout, requireMFAForSensitive, logAllActions, logDataExports, logLoginAttempts, auditRetentionPeriod, ipWhitelisting,
        };

        setTimeout(() => {
            try {
                localStorage.setItem("skymaintain-settings", JSON.stringify(allSettings));
                showNotification(`${sectionName} saved successfully!`, "success");
            } catch {
                showNotification("Failed to save settings. Please try again.", "error");
            } finally {
                setSaving(false);
            }
        }, 500);
    }, [
        fullName, email, phone, twoFAEnabled,
        flightHoursFormat, pressureUnit, temperatureUnit, maintenanceBasis,
        regulatoryAuthority, trackADs, trackSBs, trackLLPs, warningThreshold, criticalThreshold, mandatoryDocUpload,
        alertCriticalAI, alertMaintenance, alertRegulatoryDeadlines, alertDocExpiration, emailAlerts, alertSeverityFilter,
        aiAssistanceLevel, predictiveFailureAlerts, aiTaskPrioritization, aiMaintenanceRecommendations,
        signOffRule, requireFindings, requireRectification, requireRefDocs,
        retentionPeriod, autoVersionControl,
        theme, dashboardDensity, defaultLandingPage,
        sessionTimeout, requireMFAForSensitive, logAllActions, logDataExports, logLoginAttempts, auditRetentionPeriod, ipWhitelisting,
        showNotification
    ]);

    // Apply all AI recommendations for Aircraft & Fleet
    const applyAllAIRecommendations = useCallback(() => {
        setMaintenanceBasis("combined");
        setPressureUnit("PSI");
        setFlightHoursFormat("decimal");
        showNotification("All AI recommendations applied! Don't forget to save your changes.", "info");
    }, [showNotification]);

    // Reset Aircraft & Fleet to defaults
    const resetAircraftFleetDefaults = useCallback(() => {
        setFlightHoursFormat("decimal");
        setPressureUnit("PSI");
        setTemperatureUnit("Fahrenheit (°F)");
        setMaintenanceBasis("flight-hours");
        showNotification("Aircraft & Fleet settings reset to defaults.", "info");
    }, [showNotification]);

    async function handleChangePassword() {
        if (passwordSaving) return;
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!currentPassword.trim()) {
            setPasswordError("Enter your current password.");
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setPasswordSaving(true);
        try {
            await new Promise((r) => setTimeout(r, 600));
            setPasswordSuccess("Password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            window.setTimeout(() => {
                closeChangePasswordModal();
                setPasswordSuccess(null);
            }, 1200);
        } catch {
            setPasswordError("Unable to update password. Please try again.");
        } finally {
            setPasswordSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-6 relative">
            {/* Notification Toast */}
            {notification && (
                <div
                    className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg animate-in slide-in-from-top-2"
                    style={{
                        backgroundColor: notification.type === "success" ? "#dcfce7" : notification.type === "error" ? "#fee2e2" : "#dbeafe",
                        border: `1px solid ${notification.type === "success" ? "#86efac" : notification.type === "error" ? "#fca5a5" : "#93c5fd"}`,
                        color: notification.type === "success" ? "#166534" : notification.type === "error" ? "#b91c1c" : "#1d4ed8",
                    }}
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {notification.type === "success" ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : notification.type === "error" ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                    </svg>
                    <span className="text-sm font-medium">{notification.message}</span>
                    <button
                        type="button"
                        onClick={() => setNotification(null)}
                        className="ml-2 opacity-70 hover:opacity-100"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Header */}
            <h1 className="text-2xl font-normal" style={{ color: "#0a0a0a" }}>
                Settings
            </h1>

            {/* Settings panel */}
            <div className="flex gap-6">
                {/* Sidebar */}
                <aside
                    className="sticky top-6 h-fit w-64 shrink-0 self-start rounded-xl bg-white"
                    style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                >
                    <div className="p-4">
                        {/* Sidebar header */}
                        <div
                            className="flex items-center gap-2 pb-3"
                            style={{ borderBottom: "1px solid #e5e7eb" }}
                        >
                            <img src={imgIconSettings} alt="" className="h-5 w-5" />
                            <span className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                Settings
                            </span>
                        </div>

                        {/* Section list */}
                        <div className="mt-12 flex flex-col gap-1">
                            {sections.map((s) => {
                                const isActive = s.label === active;
                                return (
                                    <button
                                        key={s.label}
                                        type="button"
                                        onClick={() => setActive(s.label)}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm"
                                        style={{
                                            backgroundColor: isActive ? "#eff6ff" : "transparent",
                                            color: isActive ? "#1447e6" : "#364153",
                                        }}
                                    >
                                        <img src={s.icon} alt="" className="h-5 w-5" />
                                        <span className="flex-1">{s.label}</span>
                                        {isActive && (
                                            <img src={imgIconChevron} alt="" className="h-4 w-4" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <section
                    ref={contentRef}
                    className="flex-1 rounded-xl bg-white p-6"
                    style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                >
                    <ActiveAircraftBanner
                        aircraft={selectedAircraft}
                        fallback={{
                            registration: aircraftRegistration,
                            model: aircraftModel,
                            lastService: aircraftLastService,
                        }}
                    />
                    {active === "Account & Profile" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header */}
                            <div>
                                <h2
                                    className="text-2xl font-bold"
                                    style={{ color: "#101828" }}
                                >
                                    Account &amp; Profile
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: "#4a5565" }}>
                                    Manage your personal information and security settings
                                </p>
                            </div>

                            {/* Form fields */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-sm"
                                        style={{ color: "#0a0a0a" }}
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <img
                                            src={imgIconUserSmall}
                                            alt=""
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                        />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full rounded-lg py-2 pl-10 pr-3 text-sm outline-none"
                                            style={{
                                                backgroundColor: "#f3f3f5",
                                                color: "#0a0a0a",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-sm"
                                        style={{ color: "#0a0a0a" }}
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <img
                                            src={imgIconMail}
                                            alt=""
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                        />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-lg py-2 pl-10 pr-3 text-sm outline-none"
                                            style={{
                                                backgroundColor: "#f3f3f5",
                                                color: "#0a0a0a",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-sm"
                                        style={{ color: "#0a0a0a" }}
                                    >
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <img
                                            src={imgIconPhone}
                                            alt=""
                                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                        />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full rounded-lg py-2 pl-10 pr-3 text-sm outline-none"
                                            style={{
                                                backgroundColor: "#f3f3f5",
                                                color: "#0a0a0a",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* User Role */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-sm"
                                        style={{ color: "#0a0a0a" }}
                                    >
                                        User Role
                                    </label>
                                    <div
                                        className="flex items-center gap-2 rounded-lg px-3 py-2"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <img src={imgIconBadge} alt="" className="h-4 w-4" />
                                        <span className="flex-1 text-sm" style={{ color: "#0a0a0a" }}>
                                            {role}
                                        </span>
                                        {readOnly && (
                                            <span
                                                className="rounded-lg px-2 py-0.5 text-xs"
                                                style={{
                                                    backgroundColor: "#dbeafe",
                                                    color: "#1447e6",
                                                }}
                                            >
                                                Read-only
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Security section */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3
                                    className="text-lg font-bold"
                                    style={{ color: "#0a0a0a" }}
                                >
                                    Security
                                </h3>

                                {/* 2FA Toggle */}
                                <div
                                    className="flex items-center justify-between rounded-lg p-4"
                                    style={{
                                        backgroundColor: "#f9fafb",
                                        border: "1px solid #e5e7eb",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={imgIcon2FA} alt="" className="h-5 w-5" />
                                        <div>
                                            <div
                                                className="text-sm"
                                                style={{ color: "#0a0a0a" }}
                                            >
                                                Two-Factor Authentication
                                            </div>
                                            <div
                                                className="text-xs"
                                                style={{ color: "#4a5565" }}
                                            >
                                                Additional security for your account
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Toggle two-factor authentication"
                                        onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                                        className="relative h-6 w-11 rounded-full transition-colors"
                                        style={{
                                            backgroundColor: twoFAEnabled
                                                ? "#155dfc"
                                                : "#d1d5db",
                                        }}
                                    >
                                        <span
                                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                            style={{
                                                left: twoFAEnabled ? "22px" : "2px",
                                            }}
                                        />
                                    </button>
                                </div>

                                {/* Change Password button */}
                                <button
                                    type="button"
                                    onClick={() => setChangePasswordOpen(true)}
                                    className="w-fit rounded-lg px-4 py-2 text-sm hover:bg-slate-50"
                                    style={{
                                        border: "1px solid rgba(0,0,0,0.1)",
                                        color: "#0a0a0a",
                                    }}
                                >
                                    Change Password
                                </button>
                            </div>

                            {/* Save button */}
                            <div
                                className="flex justify-end pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => saveSettings("Account & Profile")}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    <img src={imgIconSave} alt="" className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    ) : active === "Aircraft & Fleet" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header */}
                            <div>
                                <h2
                                    className="text-2xl font-bold"
                                    style={{ color: "#101828" }}
                                >
                                    Aircraft &amp; Fleet Defaults
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: "#4a5565" }}>
                                    Configure default units and maintenance parameters
                                </p>
                            </div>

                            {/* AI Recommendations Panel */}
                            <div
                                className="rounded-xl p-4"
                                style={{
                                    background: "linear-gradient(135deg, rgba(152, 16, 250, 0.08) 0%, rgba(21, 93, 252, 0.08) 100%)",
                                    border: "1px solid rgba(152, 16, 250, 0.2)",
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{
                                                background: "linear-gradient(135deg, #9810fa 0%, #155dfc 100%)",
                                            }}
                                        >
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold" style={{ color: "#9810fa" }}>
                                                AI Assistant Recommendations
                                            </span>
                                            <p className="text-xs" style={{ color: "#6b7280" }}>
                                                Based on your fleet&apos;s usage patterns
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                                        className="text-xs px-3 py-1 rounded-lg"
                                        style={{
                                            backgroundColor: showAIRecommendations ? "rgba(152, 16, 250, 0.1)" : "transparent",
                                            color: "#9810fa",
                                            border: "1px solid rgba(152, 16, 250, 0.3)",
                                        }}
                                    >
                                        {showAIRecommendations ? "Hide" : "Show"} Insights
                                    </button>
                                </div>

                                {showAIRecommendations && (
                                    <div className="space-y-2">
                                        {aiFleetRecommendations.map((rec) => (
                                            <div
                                                key={rec.id}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-white"
                                                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
                                            >
                                                <div
                                                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                                    style={{
                                                        backgroundColor: rec.type === "optimization" ? "#dcfce7" : rec.type === "preference" ? "#dbeafe" : "#fef3c7",
                                                        color: rec.type === "optimization" ? "#166534" : rec.type === "preference" ? "#1d4ed8" : "#b45309",
                                                    }}
                                                >
                                                    {rec.type === "optimization" ? "✓" : rec.type === "preference" ? "★" : "i"}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium" style={{ color: "#0a0a0a" }}>
                                                            {rec.title}
                                                        </span>
                                                        <span
                                                            className="text-xs px-1.5 py-0.5 rounded"
                                                            style={{
                                                                backgroundColor: "rgba(152, 16, 250, 0.1)",
                                                                color: "#9810fa",
                                                            }}
                                                        >
                                                            {rec.confidence}% confidence
                                                        </span>
                                                    </div>
                                                    <p className="text-xs mt-1" style={{ color: "#4a5565" }}>
                                                        {rec.description}
                                                    </p>
                                                    <p className="text-xs mt-1" style={{ color: "#166534" }}>
                                                        💡 {rec.impact}
                                                    </p>
                                                </div>
                                                {rec.type === "optimization" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setMaintenanceBasis("combined")}
                                                        className="shrink-0 text-xs px-3 py-1.5 rounded-lg text-white"
                                                        style={{ backgroundColor: "#9810fa" }}
                                                    >
                                                        Apply
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Fleet Statistics Panel */}
                            <div
                                className="grid grid-cols-4 gap-4 p-4 rounded-xl"
                                style={{
                                    backgroundColor: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: "#155dfc" }}>
                                        {fleetStatistics.totalAircraft}
                                    </div>
                                    <div className="text-xs" style={{ color: "#6b7280" }}>Total Aircraft</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: "#16a34a" }}>
                                        {fleetStatistics.activeAircraft}
                                    </div>
                                    <div className="text-xs" style={{ color: "#6b7280" }}>Active</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: "#0a0a0a" }}>
                                        {fleetStatistics.averageFlightHours.toLocaleString()}
                                    </div>
                                    <div className="text-xs" style={{ color: "#6b7280" }}>Avg. Flight Hours</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
                                        {fleetStatistics.upcomingMaintenance}
                                    </div>
                                    <div className="text-xs" style={{ color: "#6b7280" }}>Upcoming Maintenance</div>
                                </div>
                            </div>

                            {/* Default Units section */}
                            <div className="flex flex-col gap-4">
                                <h3
                                    className="text-lg font-bold"
                                    style={{ color: "#0a0a0a" }}
                                >
                                    Default Units
                                </h3>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Flight Hours Format */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm"
                                            style={{ color: "#0a0a0a" }}
                                        >
                                            Flight Hours Format
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            {/* Decimal option */}
                                            <button
                                                type="button"
                                                onClick={() => setFlightHoursFormat("decimal")}
                                                className="flex items-center gap-3 rounded-lg px-3 py-3 text-left"
                                                style={{
                                                    border: `1px solid ${flightHoursFormat === "decimal" ? "#155dfc" : "#e5e7eb"}`,
                                                }}
                                            >
                                                <div
                                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                                    style={{
                                                        border: `2px solid ${flightHoursFormat === "decimal" ? "#155dfc" : "#d1d5dc"}`,
                                                    }}
                                                >
                                                    {flightHoursFormat === "decimal" && (
                                                        <div
                                                            className="h-2 w-2 rounded-full"
                                                            style={{ backgroundColor: "#155dfc" }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        Decimal (1234.5)
                                                    </div>
                                                    <div className="text-xs" style={{ color: "#4a5565" }}>
                                                        Industry standard
                                                    </div>
                                                </div>
                                            </button>

                                            {/* HH:MM option */}
                                            <button
                                                type="button"
                                                onClick={() => setFlightHoursFormat("hhmm")}
                                                className="flex items-center gap-3 rounded-lg px-3 py-3 text-left"
                                                style={{
                                                    border: `1px solid ${flightHoursFormat === "hhmm" ? "#155dfc" : "#e5e7eb"}`,
                                                }}
                                            >
                                                <div
                                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                                    style={{
                                                        border: `2px solid ${flightHoursFormat === "hhmm" ? "#155dfc" : "#d1d5dc"}`,
                                                    }}
                                                >
                                                    {flightHoursFormat === "hhmm" && (
                                                        <div
                                                            className="h-2 w-2 rounded-full"
                                                            style={{ backgroundColor: "#155dfc" }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        HH:MM (1234:30)
                                                    </div>
                                                    <div className="text-xs" style={{ color: "#4a5565" }}>
                                                        Time-based format
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pressure Unit */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm"
                                            style={{ color: "#0a0a0a" }}
                                        >
                                            Pressure Unit
                                        </label>
                                        <div className="relative">
                                            <img
                                                src={imgIconPressure}
                                                alt=""
                                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                            />
                                            <select
                                                value={pressureUnit}
                                                onChange={(e) => setPressureUnit(e.target.value)}
                                                className="w-full appearance-none rounded-lg py-2 pl-10 pr-3 text-sm outline-none"
                                                style={{
                                                    border: "1px solid #d1d5dc",
                                                    color: "#0a0a0a",
                                                    backgroundColor: "white",
                                                }}
                                            >
                                                <option value="PSI">PSI</option>
                                                <option value="Bar">Bar</option>
                                                <option value="kPa">kPa</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Temperature Unit */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm"
                                            style={{ color: "#0a0a0a" }}
                                        >
                                            Temperature Unit
                                        </label>
                                        <div className="relative">
                                            <img
                                                src={imgIconTemp}
                                                alt=""
                                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                            />
                                            <select
                                                value={temperatureUnit}
                                                onChange={(e) => setTemperatureUnit(e.target.value)}
                                                className="w-full appearance-none rounded-lg py-2 pl-10 pr-3 text-sm outline-none"
                                                style={{
                                                    border: "1px solid #d1d5dc",
                                                    color: "#0a0a0a",
                                                    backgroundColor: "white",
                                                }}
                                            >
                                                <option value="Fahrenheit (°F)">Fahrenheit (°F)</option>
                                                <option value="Celsius (°C)">Celsius (°C)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Maintenance Basis section */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3
                                    className="text-lg font-bold"
                                    style={{ color: "#0a0a0a" }}
                                >
                                    Maintenance Basis
                                </h3>

                                <div className="flex flex-col gap-2">
                                    {/* Flight Hours */}
                                    <button
                                        type="button"
                                        onClick={() => setMaintenanceBasis("flight-hours")}
                                        className="flex items-center gap-3 rounded-lg px-4 py-4 text-left"
                                        style={{
                                            border: `1px solid ${maintenanceBasis === "flight-hours" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${maintenanceBasis === "flight-hours" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {maintenanceBasis === "flight-hours" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Flight Hours
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Track by total flight time
                                            </div>
                                        </div>
                                        {maintenanceBasis === "flight-hours" && (
                                            <img
                                                src={imgIconFlightHours}
                                                alt=""
                                                className="h-5 w-5"
                                            />
                                        )}
                                    </button>

                                    {/* Flight Cycles */}
                                    <button
                                        type="button"
                                        onClick={() => setMaintenanceBasis("flight-cycles")}
                                        className="flex items-center gap-3 rounded-lg px-4 py-4 text-left"
                                        style={{
                                            border: `1px solid ${maintenanceBasis === "flight-cycles" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${maintenanceBasis === "flight-cycles" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {maintenanceBasis === "flight-cycles" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Flight Cycles
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Track by takeoff/landing cycles
                                            </div>
                                        </div>
                                    </button>

                                    {/* Calendar Time */}
                                    <button
                                        type="button"
                                        onClick={() => setMaintenanceBasis("calendar-time")}
                                        className="flex items-center gap-3 rounded-lg px-4 py-4 text-left"
                                        style={{
                                            border: `1px solid ${maintenanceBasis === "calendar-time" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${maintenanceBasis === "calendar-time" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {maintenanceBasis === "calendar-time" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Calendar Time
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Track by elapsed time
                                            </div>
                                        </div>
                                    </button>

                                    {/* Combined */}
                                    <button
                                        type="button"
                                        onClick={() => setMaintenanceBasis("combined")}
                                        className="flex items-center gap-3 rounded-lg px-4 py-4 text-left"
                                        style={{
                                            border: `1px solid ${maintenanceBasis === "combined" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${maintenanceBasis === "combined" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {maintenanceBasis === "combined" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Combined (Hours + Cycles)
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Whichever comes first
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div
                                className="flex items-center justify-between pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={applyAllAIRecommendations}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity"
                                        style={{
                                            background: "linear-gradient(135deg, #9810fa 0%, #155dfc 100%)",
                                            color: "white",
                                        }}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Apply AI Recommendations
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetAircraftFleetDefaults}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                        style={{
                                            border: "1px solid #e5e7eb",
                                            color: "#4a5565",
                                        }}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Reset to Defaults
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => saveSettings("Aircraft & Fleet")}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    <img src={imgIconSave} alt="" className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    ) : active === "Regulatory Compliance" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header */}
                            <div
                                className="flex gap-3 rounded-lg p-4"
                                style={{
                                    backgroundColor: "#eff6ff",
                                    border: "1.6px solid #bedbff",
                                }}
                            >
                                <img src={imgIconRegulatoryHeader} alt="" className="h-6 w-6" />
                                <div>
                                    <h2
                                        className="text-lg font-bold"
                                        style={{ color: "#1c398e" }}
                                    >
                                        ⭐ Regulatory Compliance Settings
                                    </h2>
                                    <p className="text-sm" style={{ color: "#1447e6" }}>
                                        Configure regulatory authority and compliance tracking parameters
                                    </p>
                                </div>
                            </div>

                            {/* Live Compliance Statistics */}
                            <div
                                className="grid grid-cols-4 gap-4 p-4 rounded-xl"
                                style={{
                                    backgroundColor: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: "#155dfc" }}>
                                        {complianceStatistics.complianceRate}%
                                    </div>
                                    <div className="text-xs" style={{ color: "#6b7280" }}>Compliance Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: complianceStatistics.pendingADs > 0 ? "#f59e0b" : "#16a34a" }}>
                                        {complianceStatistics.pendingADs}
                                    </div>
                                    <div className="text-xs" style={{ color: "#6b7280" }}>Pending ADs</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: complianceStatistics.pendingSBs > 0 ? "#f59e0b" : "#16a34a" }}>
                                        {complianceStatistics.pendingSBs}
                                    </div>
                                    <div className="text-xs" style={{ color: "#6b7280" }}>Pending SBs</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: complianceStatistics.criticalLLPs > 0 ? "#dc2626" : "#16a34a" }}>
                                        {complianceStatistics.criticalLLPs}
                                    </div>
                                    <div className="text-xs" style={{ color: "#6b7280" }}>Critical LLPs</div>
                                </div>
                            </div>

                            {/* AI Recommendations Panel */}
                            <div
                                className="rounded-xl p-4"
                                style={{
                                    background: "linear-gradient(135deg, rgba(152, 16, 250, 0.08) 0%, rgba(21, 93, 252, 0.08) 100%)",
                                    border: "1px solid rgba(152, 16, 250, 0.2)",
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{
                                                background: "linear-gradient(135deg, #9810fa 0%, #155dfc 100%)",
                                            }}
                                        >
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold" style={{ color: "#9810fa" }}>
                                                AI Compliance Insights
                                            </span>
                                            <p className="text-xs" style={{ color: "#6b7280" }}>
                                                Regulatory optimization recommendations
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowComplianceAI(!showComplianceAI)}
                                        className="text-xs px-3 py-1 rounded-lg"
                                        style={{
                                            backgroundColor: showComplianceAI ? "rgba(152, 16, 250, 0.1)" : "transparent",
                                            color: "#9810fa",
                                            border: "1px solid rgba(152, 16, 250, 0.3)",
                                        }}
                                    >
                                        {showComplianceAI ? "Hide" : "Show"} Insights
                                    </button>
                                </div>

                                {showComplianceAI && (
                                    <div className="space-y-2">
                                        {aiComplianceRecommendations.map((rec) => (
                                            <div
                                                key={rec.id}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-white"
                                                style={{ border: "1px solid rgba(0,0,0,0.05)" }}
                                            >
                                                <div
                                                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                                    style={{
                                                        backgroundColor: rec.type === "critical" ? "#fee2e2" : rec.type === "warning" ? "#fef3c7" : "#dbeafe",
                                                        color: rec.type === "critical" ? "#dc2626" : rec.type === "warning" ? "#b45309" : "#1d4ed8",
                                                    }}
                                                >
                                                    {rec.type === "critical" ? "!" : rec.type === "warning" ? "⚠" : "✓"}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium" style={{ color: "#0a0a0a" }}>
                                                            {rec.title}
                                                        </span>
                                                        <span
                                                            className="text-xs px-1.5 py-0.5 rounded"
                                                            style={{
                                                                backgroundColor: "rgba(152, 16, 250, 0.1)",
                                                                color: "#9810fa",
                                                            }}
                                                        >
                                                            {rec.confidence}% confidence
                                                        </span>
                                                    </div>
                                                    <p className="text-xs mt-1" style={{ color: "#4a5565" }}>
                                                        {rec.description}
                                                    </p>
                                                    <p className="text-xs mt-1" style={{ color: rec.type === "critical" ? "#dc2626" : "#166534" }}>
                                                        💡 {rec.impact}
                                                    </p>
                                                </div>
                                                {rec.action && (
                                                    <button
                                                        type="button"
                                                        onClick={rec.action}
                                                        className="shrink-0 text-xs px-3 py-1.5 rounded-lg text-white"
                                                        style={{ backgroundColor: "#9810fa" }}
                                                    >
                                                        Apply
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Primary Regulatory Authority */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-medium" style={{ color: "#0a0a0a" }}>
                                        Primary Regulatory Authority
                                    </label>
                                    <p className="text-xs" style={{ color: "#4a5565" }}>
                                        Select the primary aviation authority governing your operations
                                    </p>
                                </div>

                                <div className="relative">
                                    <select
                                        value={regulatoryAuthority}
                                        onChange={(e) => setRegulatoryAuthority(e.target.value)}
                                        className="w-full appearance-none rounded-lg py-3 pl-4 pr-10 text-sm outline-none"
                                        style={{
                                            border: "1px solid #d1d5dc",
                                            color: "#0a0a0a",
                                            backgroundColor: "white",
                                        }}
                                    >
                                        {regulatoryAuthorities.map((auth) => (
                                            <option key={auth.value} value={auth.value}>
                                                {auth.label}
                                            </option>
                                        ))}
                                    </select>
                                    <img
                                        src={imgIconDropdown}
                                        alt=""
                                        className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2"
                                    />
                                </div>

                                {/* Selected Authority info */}
                                <div
                                    className="flex items-center gap-3 rounded-lg p-3"
                                    style={{
                                        backgroundColor: "#eff6ff",
                                        border: "1px solid #bedbff",
                                    }}
                                >
                                    <img src={imgIconSelected} alt="" className="h-5 w-5" />
                                    <div>
                                        <div className="text-sm" style={{ color: "#1c398e" }}>
                                            Selected Authority
                                        </div>
                                        <div className="text-xs" style={{ color: "#1447e6" }}>
                                            {regulatoryAuthority} - All compliance standards will be aligned with this authority
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compliance Tracking */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Compliance Tracking
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {/* Airworthiness Directives */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconAD} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Airworthiness Directives (ADs)
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Track mandatory AD compliance
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setTrackADs(!trackADs)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: trackADs ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: trackADs ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Service Bulletins */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconSB} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Service Bulletins (SBs)
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Track manufacturer recommendations
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setTrackSBs(!trackSBs)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: trackSBs ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: trackSBs ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Life-Limited Parts */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconLLP} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Life-Limited Parts (LLPs)
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Track component life limits
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setTrackLLPs(!trackLLPs)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: trackLLPs ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: trackLLPs ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Compliance Alert Thresholds */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Compliance Alert Thresholds
                                </h3>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Warning Threshold */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Warning Threshold (Hours Before Due)
                                        </label>
                                        <input
                                            type="number"
                                            value={warningThreshold}
                                            onChange={(e) => setWarningThreshold(e.target.value)}
                                            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                                            style={{
                                                backgroundColor: "#f3f3f5",
                                                color: "#717182",
                                            }}
                                        />
                                        <p className="text-xs" style={{ color: "#4a5565" }}>
                                            Show warning alerts this many hours before due
                                        </p>
                                    </div>

                                    {/* Critical Threshold */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Critical Threshold (Hours Before Due)
                                        </label>
                                        <input
                                            type="number"
                                            value={criticalThreshold}
                                            onChange={(e) => setCriticalThreshold(e.target.value)}
                                            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                                            style={{
                                                backgroundColor: "#f3f3f5",
                                                color: "#717182",
                                            }}
                                        />
                                        <p className="text-xs" style={{ color: "#4a5565" }}>
                                            Show critical alerts this many hours before due
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Compliance Evidence Requirements */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Compliance Evidence Requirements
                                </h3>

                                <div
                                    className="flex items-center justify-between rounded-lg p-4"
                                    style={{
                                        backgroundColor: "#f9fafb",
                                        border: "1px solid #e5e7eb",
                                    }}
                                >
                                    <div>
                                        <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Mandatory Document Upload
                                        </div>
                                        <div className="text-xs" style={{ color: "#4a5565" }}>
                                            Require documentation for compliance actions
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setMandatoryDocUpload(!mandatoryDocUpload)}
                                        className="relative h-6 w-11 rounded-full transition-colors"
                                        style={{ backgroundColor: mandatoryDocUpload ? "#155dfc" : "#d1d5db" }}
                                    >
                                        <span
                                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                            style={{ left: mandatoryDocUpload ? "22px" : "2px" }}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Save button */}
                            <div
                                className="flex justify-end pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => saveSettings("Regulatory Compliance")}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    <img src={imgIconSaveRegulatory} alt="" className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Regulatory Settings"}
                                </button>
                            </div>
                        </div>
                    ) : active === "Notifications & Alerts" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header */}
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: "#101828" }}>
                                    Notifications &amp; Alerts
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: "#4a5565" }}>
                                    Configure how and when you receive alerts
                                </p>
                            </div>

                            {/* Live Notification Statistics */}
                            <div className="grid grid-cols-4 gap-3">
                                <div
                                    className="rounded-lg p-3 text-center"
                                    style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
                                >
                                    <div className="text-2xl font-bold" style={{ color: "#dc2626" }}>
                                        {notificationStatistics.criticalAlerts}
                                    </div>
                                    <div className="text-xs" style={{ color: "#dc2626" }}>
                                        Critical Today
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-3 text-center"
                                    style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
                                >
                                    <div className="text-2xl font-bold" style={{ color: "#d97706" }}>
                                        {notificationStatistics.warningAlerts}
                                    </div>
                                    <div className="text-xs" style={{ color: "#d97706" }}>
                                        Warnings Today
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-3 text-center"
                                    style={{ backgroundColor: "#dcfce7", border: "1px solid #bbf7d0" }}
                                >
                                    <div className="text-2xl font-bold" style={{ color: "#16a34a" }}>
                                        {notificationStatistics.acknowledgedRate}%
                                    </div>
                                    <div className="text-xs" style={{ color: "#16a34a" }}>
                                        Acknowledged
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-3 text-center"
                                    style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
                                >
                                    <div className="text-2xl font-bold" style={{ color: "#2563eb" }}>
                                        {notificationStatistics.averageResponseTime}
                                    </div>
                                    <div className="text-xs" style={{ color: "#2563eb" }}>
                                        Avg Response
                                    </div>
                                </div>
                            </div>

                            {/* AI Notification Insights Panel */}
                            <div
                                className="rounded-xl p-4"
                                style={{
                                    background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%)",
                                    border: "1.6px solid #e9d4ff",
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: "linear-gradient(135deg, #9810fa 0%, #155dfc 100%)" }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                            </svg>
                                        </div>
                                        <span className="font-bold text-sm" style={{ color: "#0a0a0a" }}>
                                            AI Notification Insights
                                        </span>
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs"
                                            style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                                        >
                                            {aiNotificationRecommendations.length} Recommendations
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowNotificationsAI(!showNotificationsAI)}
                                        className="text-xs px-2 py-1 rounded hover:bg-white/50 transition-colors"
                                        style={{ color: "#6b21a8" }}
                                    >
                                        {showNotificationsAI ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {showNotificationsAI && (
                                    <div className="space-y-2">
                                        {aiNotificationRecommendations.map((rec) => (
                                            <div
                                                key={rec.id}
                                                className="flex items-start justify-between gap-3 rounded-lg p-3 bg-white/80"
                                                style={{ border: "1px solid #e5e7eb" }}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <span className="text-sm">
                                                        {rec.type === "warning" ? "⚠️" : rec.type === "optimization" ? "⚡" : "ℹ️"}
                                                    </span>
                                                    <div>
                                                        <div className="text-sm font-medium" style={{ color: "#0a0a0a" }}>
                                                            {rec.title}
                                                        </div>
                                                        <div className="text-xs" style={{ color: "#4a5565" }}>
                                                            {rec.description}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span
                                                                className="text-xs px-1.5 py-0.5 rounded"
                                                                style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                                            >
                                                                {rec.confidence}% confidence
                                                            </span>
                                                            <span className="text-xs" style={{ color: "#16a34a" }}>
                                                                {rec.impact}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {rec.actionType && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (rec.actionType === "consolidation") {
                                                                setAlertMaintenance(true);
                                                                showNotification("Smart alert grouping enabled", "success");
                                                            } else if (rec.actionType === "sms") {
                                                                setSmsAlerts(true);
                                                                showNotification("SMS alerts enabled", "success");
                                                            } else if (rec.actionType === "severity") {
                                                                setAlertSeverityFilter("critical-warnings");
                                                                showNotification("Severity filter optimized", "success");
                                                            }
                                                        }}
                                                        className="shrink-0 text-xs px-2 py-1 rounded transition-colors"
                                                        style={{
                                                            backgroundColor: "#155dfc",
                                                            color: "white",
                                                        }}
                                                    >
                                                        Apply
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Alert Types */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Alert Types
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {/* Critical AI Alerts */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconCriticalAI} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Critical AI Alerts
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Predictive failure warnings
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAlertCriticalAI(!alertCriticalAI)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: alertCriticalAI ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: alertCriticalAI ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Upcoming Maintenance */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconMaintenance} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Upcoming Maintenance
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Scheduled maintenance reminders
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAlertMaintenance(!alertMaintenance)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: alertMaintenance ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: alertMaintenance ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Regulatory Deadlines */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconRegDeadlines} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Regulatory Deadlines
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    AD/SB compliance alerts
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAlertRegulatoryDeadlines(!alertRegulatoryDeadlines)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: alertRegulatoryDeadlines ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: alertRegulatoryDeadlines ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Document Expiration */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconDocExpiration} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Document Expiration
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Certificate and document alerts
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAlertDocExpiration(!alertDocExpiration)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: alertDocExpiration ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: alertDocExpiration ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Methods */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Delivery Methods
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {/* In-App Notifications */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconInApp} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    In-App Notifications
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Always enabled
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className="rounded-lg px-2 py-1 text-xs"
                                            style={{
                                                backgroundColor: "#dcfce7",
                                                color: "#008236",
                                            }}
                                        >
                                            Active
                                        </span>
                                    </div>

                                    {/* Email Alerts */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={imgIconEmailAlerts} alt="" className="h-5 w-5" />
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Email Alerts
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Receive alerts via email
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setEmailAlerts(!emailAlerts)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: emailAlerts ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: emailAlerts ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* SMS Alerts */}
                                    <div
                                        className="rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        SMS Alerts
                                                    </div>
                                                    <div className="text-xs" style={{ color: "#4a5565" }}>
                                                        Receive critical alerts via SMS
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSmsAlerts(!smsAlerts)}
                                                className="relative h-6 w-11 rounded-full transition-colors"
                                                style={{ backgroundColor: smsAlerts ? "#155dfc" : "#d1d5db" }}
                                            >
                                                <span
                                                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                    style={{ left: smsAlerts ? "22px" : "2px" }}
                                                />
                                            </button>
                                        </div>
                                        {smsAlerts && (
                                            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e5e7eb" }}>
                                                <label className="block text-xs mb-1" style={{ color: "#4a5565" }}>
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={smsPhoneNumber}
                                                    onChange={(e) => setSmsPhoneNumber(e.target.value)}
                                                    className="w-full rounded-lg px-3 py-2 text-sm"
                                                    style={{ border: "1px solid #e5e7eb" }}
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Push Notifications */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2">
                                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                                <path d="M12 18h.01" />
                                            </svg>
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Push Notifications
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Mobile app push notifications
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setPushNotifications(!pushNotifications)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: pushNotifications ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: pushNotifications ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quiet Hours */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                            Quiet Hours
                                        </h3>
                                        <p className="text-xs" style={{ color: "#4a5565" }}>
                                            Pause non-critical notifications during set hours
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
                                        className="relative h-6 w-11 rounded-full transition-colors"
                                        style={{ backgroundColor: quietHoursEnabled ? "#155dfc" : "#d1d5db" }}
                                    >
                                        <span
                                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                            style={{ left: quietHoursEnabled ? "22px" : "2px" }}
                                        />
                                    </button>
                                </div>
                                {quietHoursEnabled && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs mb-1" style={{ color: "#4a5565" }}>
                                                Start Time
                                            </label>
                                            <input
                                                type="time"
                                                value={quietHoursStart}
                                                onChange={(e) => setQuietHoursStart(e.target.value)}
                                                className="w-full rounded-lg px-3 py-2 text-sm"
                                                style={{ border: "1px solid #e5e7eb" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1" style={{ color: "#4a5565" }}>
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                value={quietHoursEnd}
                                                onChange={(e) => setQuietHoursEnd(e.target.value)}
                                                className="w-full rounded-lg px-3 py-2 text-sm"
                                                style={{ border: "1px solid #e5e7eb" }}
                                            />
                                        </div>
                                        <div className="col-span-2 text-xs" style={{ color: "#6b7280" }}>
                                            ⚠️ Critical safety alerts will still be delivered during quiet hours
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Alert Severity Filter */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Alert Severity Filter
                                </h3>

                                <div className="flex flex-col gap-2">
                                    {/* Critical Only */}
                                    <button
                                        type="button"
                                        onClick={() => setAlertSeverityFilter("critical-only")}
                                        className="flex items-center gap-3 rounded-lg px-4 py-4 text-left"
                                        style={{
                                            border: `1px solid ${alertSeverityFilter === "critical-only" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${alertSeverityFilter === "critical-only" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {alertSeverityFilter === "critical-only" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Critical Only
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Only show critical safety alerts
                                            </div>
                                        </div>
                                    </button>

                                    {/* Critical + Warnings */}
                                    <button
                                        type="button"
                                        onClick={() => setAlertSeverityFilter("critical-warnings")}
                                        className="flex items-center gap-3 rounded-lg px-4 py-4 text-left"
                                        style={{
                                            border: `1px solid ${alertSeverityFilter === "critical-warnings" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${alertSeverityFilter === "critical-warnings" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {alertSeverityFilter === "critical-warnings" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Critical + Warnings
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Show critical and warning alerts
                                            </div>
                                        </div>
                                        {alertSeverityFilter === "critical-warnings" && (
                                            <img src={imgIconCheckSelected} alt="" className="h-5 w-5" />
                                        )}
                                    </button>

                                    {/* All Alerts */}
                                    <button
                                        type="button"
                                        onClick={() => setAlertSeverityFilter("all")}
                                        className="flex items-center gap-3 rounded-lg px-4 py-4 text-left"
                                        style={{
                                            border: `1px solid ${alertSeverityFilter === "all" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${alertSeverityFilter === "all" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {alertSeverityFilter === "all" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                All Alerts
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Show all alerts including informational
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Save button */}
                            <div
                                className="flex justify-end pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => saveSettings("Notifications & Alerts")}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    <img src={imgIconSaveNotifications} alt="" className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Notification Settings"}
                                </button>
                            </div>
                        </div>
                    ) : active === "AI & Predictive Maintenance" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header */}
                            <div
                                className="flex items-start gap-4 rounded-lg p-4"
                                style={{
                                    backgroundColor: "#faf5ff",
                                    border: "1.6px solid #e9d4ff",
                                }}
                            >
                                <img src={imgIconAIHeader} alt="" className="h-6 w-6" />
                                <div>
                                    <h2 className="text-lg font-bold" style={{ color: "#59168b" }}>
                                        ⭐ AI &amp; Predictive Maintenance Settings
                                    </h2>
                                    <p className="mt-1 text-sm" style={{ color: "#8200db" }}>
                                        Configure AI assistance and prediction parameters
                                    </p>
                                </div>
                            </div>

                            {/* Live AI Performance Statistics */}
                            <div className="grid grid-cols-4 gap-3">
                                <div
                                    className="rounded-lg p-3 text-center"
                                    style={{ backgroundColor: "#dcfce7", border: "1px solid #bbf7d0" }}
                                >
                                    <div className="text-2xl font-bold" style={{ color: "#16a34a" }}>
                                        {aiPerformanceStatistics.predictionAccuracy}%
                                    </div>
                                    <div className="text-xs" style={{ color: "#16a34a" }}>
                                        Accuracy
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-3 text-center"
                                    style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
                                >
                                    <div className="text-2xl font-bold" style={{ color: "#2563eb" }}>
                                        {aiPerformanceStatistics.totalPredictionsMade.toLocaleString()}
                                    </div>
                                    <div className="text-xs" style={{ color: "#2563eb" }}>
                                        Predictions Made
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-3 text-center"
                                    style={{ backgroundColor: "#faf5ff", border: "1px solid #e9d4ff" }}
                                >
                                    <div className="text-2xl font-bold" style={{ color: "#9333ea" }}>
                                        ${(aiPerformanceStatistics.costSavings / 1000000).toFixed(1)}M
                                    </div>
                                    <div className="text-xs" style={{ color: "#9333ea" }}>
                                        Cost Savings
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-3 text-center"
                                    style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}
                                >
                                    <div className="text-2xl font-bold" style={{ color: "#d97706" }}>
                                        {aiPerformanceStatistics.activePredictions}
                                    </div>
                                    <div className="text-xs" style={{ color: "#d97706" }}>
                                        Active Alerts
                                    </div>
                                </div>
                            </div>

                            {/* AI Settings Recommendations Panel */}
                            <div
                                className="rounded-xl p-4"
                                style={{
                                    background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%)",
                                    border: "1.6px solid #e9d4ff",
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: "linear-gradient(135deg, #9810fa 0%, #155dfc 100%)" }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                                <path d="M12 17h.01" />
                                            </svg>
                                        </div>
                                        <span className="font-bold text-sm" style={{ color: "#0a0a0a" }}>
                                            AI Configuration Insights
                                        </span>
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs"
                                            style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                                        >
                                            {aiSettingsRecommendations.length} Suggestions
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAISettingsRecommendations(!showAISettingsRecommendations)}
                                        className="text-xs px-2 py-1 rounded hover:bg-white/50 transition-colors"
                                        style={{ color: "#6b21a8" }}
                                    >
                                        {showAISettingsRecommendations ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {showAISettingsRecommendations && (
                                    <div className="space-y-2">
                                        {aiSettingsRecommendations.map((rec) => (
                                            <div
                                                key={rec.id}
                                                className="flex items-start justify-between gap-3 rounded-lg p-3 bg-white/80"
                                                style={{ border: "1px solid #e5e7eb" }}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <span className="text-sm">
                                                        {rec.type === "warning" ? "⚠️" : rec.type === "optimization" ? "⚡" : "ℹ️"}
                                                    </span>
                                                    <div>
                                                        <div className="text-sm font-medium" style={{ color: "#0a0a0a" }}>
                                                            {rec.title}
                                                        </div>
                                                        <div className="text-xs" style={{ color: "#4a5565" }}>
                                                            {rec.description}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span
                                                                className="text-xs px-1.5 py-0.5 rounded"
                                                                style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                                            >
                                                                {rec.confidence}% confidence
                                                            </span>
                                                            <span className="text-xs" style={{ color: "#16a34a" }}>
                                                                {rec.impact}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {rec.actionType && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (rec.actionType === "aggressive-mode") {
                                                                setAiAssistanceLevel("aggressive");
                                                                showNotification("Switched to Aggressive AI mode", "success");
                                                            } else if (rec.actionType === "enable-task-priority") {
                                                                setAiTaskPrioritization(true);
                                                                showNotification("AI Task Prioritization enabled", "success");
                                                            }
                                                        }}
                                                        className="shrink-0 text-xs px-2 py-1 rounded transition-colors"
                                                        style={{
                                                            backgroundColor: "#155dfc",
                                                            color: "white",
                                                        }}
                                                    >
                                                        Apply
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* AI Assistance Level */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                        AI Assistance Level
                                    </h3>

                                    <div className="flex flex-col gap-3">
                                        {/* Conservative */}
                                        <button
                                            type="button"
                                            onClick={() => setAiAssistanceLevel("conservative")}
                                            className="flex items-center gap-4 rounded-lg p-4 text-left"
                                            style={{
                                                border: `1.6px solid ${aiAssistanceLevel === "conservative" ? "#155dfc" : "#e5e7eb"}`,
                                            }}
                                        >
                                            <div
                                                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                                style={{
                                                    border: `2px solid ${aiAssistanceLevel === "conservative" ? "#155dfc" : "#d1d5dc"}`,
                                                }}
                                            >
                                                {aiAssistanceLevel === "conservative" && (
                                                    <div
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: "#155dfc" }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        Conservative
                                                    </span>
                                                    <span
                                                        className="rounded-lg px-2 py-0.5 text-xs"
                                                        style={{
                                                            backgroundColor: "#f3f4f6",
                                                            color: "#364153",
                                                        }}
                                                    >
                                                        95%+
                                                    </span>
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Regulation-first, fewer predictions, higher confidence threshold
                                                </div>
                                            </div>
                                        </button>

                                        {/* Balanced (Recommended) */}
                                        <button
                                            type="button"
                                            onClick={() => setAiAssistanceLevel("balanced")}
                                            className="flex items-center gap-4 rounded-lg p-4 text-left"
                                            style={{
                                                border: `1.6px solid ${aiAssistanceLevel === "balanced" ? "#155dfc" : "#e5e7eb"}`,
                                            }}
                                        >
                                            <div
                                                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                                style={{
                                                    border: `2px solid ${aiAssistanceLevel === "balanced" ? "#155dfc" : "#d1d5dc"}`,
                                                }}
                                            >
                                                {aiAssistanceLevel === "balanced" && (
                                                    <div
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: "#155dfc" }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        Balanced (Recommended)
                                                    </span>
                                                    <span
                                                        className="rounded-lg px-2 py-0.5 text-xs"
                                                        style={{
                                                            backgroundColor: "#f3f4f6",
                                                            color: "#364153",
                                                        }}
                                                    >
                                                        85%+
                                                    </span>
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Optimal mix of compliance and predictive insights
                                                </div>
                                            </div>
                                            {aiAssistanceLevel === "balanced" && (
                                                <img src={imgIconAICheck} alt="" className="h-5 w-5" />
                                            )}
                                        </button>

                                        {/* Aggressive */}
                                        <button
                                            type="button"
                                            onClick={() => setAiAssistanceLevel("aggressive")}
                                            className="flex items-center gap-4 rounded-lg p-4 text-left"
                                            style={{
                                                border: `1.6px solid ${aiAssistanceLevel === "aggressive" ? "#155dfc" : "#e5e7eb"}`,
                                            }}
                                        >
                                            <div
                                                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                                style={{
                                                    border: `2px solid ${aiAssistanceLevel === "aggressive" ? "#155dfc" : "#d1d5dc"}`,
                                                }}
                                            >
                                                {aiAssistanceLevel === "aggressive" && (
                                                    <div
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: "#155dfc" }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        Aggressive
                                                    </span>
                                                    <span
                                                        className="rounded-lg px-2 py-0.5 text-xs"
                                                        style={{
                                                            backgroundColor: "#f3f4f6",
                                                            color: "#364153",
                                                        }}
                                                    >
                                                        75%+
                                                    </span>
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    More early predictions, lower confidence threshold
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* AI Features */}
                                <div
                                    className="flex flex-col gap-4 pt-4"
                                    style={{ borderTop: "1px solid #e5e7eb" }}
                                >
                                    <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                        AI Features
                                    </h3>

                                    <div className="flex flex-col gap-3">
                                        {/* Predictive Failure Alerts */}
                                        <div
                                            className="flex items-center justify-between rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={imgIconPredictiveFailure} alt="" className="h-5 w-5" />
                                                <div>
                                                    <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        Predictive Failure Alerts
                                                    </div>
                                                    <div className="text-xs" style={{ color: "#4a5565" }}>
                                                        AI-driven component failure predictions
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPredictiveFailureAlerts(!predictiveFailureAlerts)}
                                                className="relative h-6 w-11 rounded-full transition-colors"
                                                style={{ backgroundColor: predictiveFailureAlerts ? "#155dfc" : "#d1d5db" }}
                                            >
                                                <span
                                                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                    style={{ left: predictiveFailureAlerts ? "22px" : "2px" }}
                                                />
                                            </button>
                                        </div>

                                        {/* AI Task Prioritization */}
                                        <div
                                            className="flex items-center justify-between rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={imgIconTaskPriority} alt="" className="h-5 w-5" />
                                                <div>
                                                    <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        AI Task Prioritization
                                                    </div>
                                                    <div className="text-xs" style={{ color: "#4a5565" }}>
                                                        Automatic priority ranking of maintenance tasks
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAiTaskPrioritization(!aiTaskPrioritization)}
                                                className="relative h-6 w-11 rounded-full transition-colors"
                                                style={{ backgroundColor: aiTaskPrioritization ? "#155dfc" : "#d1d5db" }}
                                            >
                                                <span
                                                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                    style={{ left: aiTaskPrioritization ? "22px" : "2px" }}
                                                />
                                            </button>
                                        </div>

                                        {/* AI Maintenance Recommendations */}
                                        <div
                                            className="flex items-center justify-between rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={imgIconAIRecommendations} alt="" className="h-5 w-5" />
                                                <div>
                                                    <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        AI Maintenance Recommendations
                                                    </div>
                                                    <div className="text-xs" style={{ color: "#4a5565" }}>
                                                        Intelligent maintenance scheduling suggestions
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAiMaintenanceRecommendations(!aiMaintenanceRecommendations)}
                                                className="relative h-6 w-11 rounded-full transition-colors"
                                                style={{ backgroundColor: aiMaintenanceRecommendations ? "#155dfc" : "#d1d5db" }}
                                            >
                                                <span
                                                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                    style={{ left: aiMaintenanceRecommendations ? "22px" : "2px" }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced AI Configuration */}
                                <div
                                    className="flex flex-col gap-4 pt-4"
                                    style={{ borderTop: "1px solid #e5e7eb" }}
                                >
                                    <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                        Advanced Configuration
                                    </h3>

                                    <div className="flex flex-col gap-3">
                                        {/* Prediction Horizon */}
                                        <div
                                            className="flex items-center justify-between rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Prediction Horizon
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    How far ahead AI should predict failures
                                                </div>
                                            </div>
                                            <select
                                                value={predictionHorizon}
                                                onChange={(e) => setPredictionHorizon(e.target.value)}
                                                className="rounded-lg px-3 py-2 text-sm"
                                                style={{ border: "1px solid #e5e7eb" }}
                                            >
                                                <option value="24">24 hours</option>
                                                <option value="48">48 hours</option>
                                                <option value="72">72 hours (Default)</option>
                                                <option value="168">1 week</option>
                                                <option value="720">30 days</option>
                                            </select>
                                        </div>

                                        {/* Confidence Display Mode */}
                                        <div
                                            className="flex items-center justify-between rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Confidence Display Mode
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    How confidence levels are shown in alerts
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setConfidenceDisplayMode("percentage")}
                                                    className="px-3 py-1.5 rounded text-xs transition-colors"
                                                    style={{
                                                        backgroundColor: confidenceDisplayMode === "percentage" ? "#155dfc" : "#f3f4f6",
                                                        color: confidenceDisplayMode === "percentage" ? "white" : "#364153",
                                                    }}
                                                >
                                                    Percentage
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfidenceDisplayMode("level")}
                                                    className="px-3 py-1.5 rounded text-xs transition-colors"
                                                    style={{
                                                        backgroundColor: confidenceDisplayMode === "level" ? "#155dfc" : "#f3f4f6",
                                                        color: confidenceDisplayMode === "level" ? "white" : "#364153",
                                                    }}
                                                >
                                                    Level (High/Med/Low)
                                                </button>
                                            </div>
                                        </div>

                                        {/* Auto-Schedule Maintenance */}
                                        <div
                                            className="flex items-center justify-between rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Auto-Schedule Maintenance
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Automatically create tasks for high-confidence predictions
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAutoScheduleMaintenance(!autoScheduleMaintenance)}
                                                className="relative h-6 w-11 rounded-full transition-colors"
                                                style={{ backgroundColor: autoScheduleMaintenance ? "#155dfc" : "#d1d5db" }}
                                            >
                                                <span
                                                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                    style={{ left: autoScheduleMaintenance ? "22px" : "2px" }}
                                                />
                                            </button>
                                        </div>

                                        {/* AI Data Sharing */}
                                        <div
                                            className="flex items-center justify-between rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    AI Model Improvement
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Share anonymized data to improve prediction accuracy
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAiDataSharingConsent(!aiDataSharingConsent)}
                                                className="relative h-6 w-11 rounded-full transition-colors"
                                                style={{ backgroundColor: aiDataSharingConsent ? "#155dfc" : "#d1d5db" }}
                                            >
                                                <span
                                                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                    style={{ left: aiDataSharingConsent ? "22px" : "2px" }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Model Information */}
                                <div
                                    className="flex flex-col gap-4 pt-4"
                                    style={{ borderTop: "1px solid #e5e7eb" }}
                                >
                                    <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                        Model Information
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            className="flex flex-col gap-1 rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                AI Model Version
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: "#0a0a0a" }}>
                                                {aiPerformanceStatistics.modelVersion}
                                            </div>
                                        </div>
                                        <div
                                            className="flex flex-col gap-1 rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Last Updated
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: "#0a0a0a" }}>
                                                {aiPerformanceStatistics.lastModelUpdate}
                                            </div>
                                        </div>
                                        <div
                                            className="flex flex-col gap-1 rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Training Data
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: "#0a0a0a" }}>
                                                {aiPerformanceStatistics.trainingDataSize}
                                            </div>
                                        </div>
                                        <div
                                            className="flex flex-col gap-1 rounded-lg p-4"
                                            style={{
                                                backgroundColor: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Inference Latency
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: "#0a0a0a" }}>
                                                {aiPerformanceStatistics.inferenceLatency}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save button */}
                                <div
                                    className="flex justify-end pt-4"
                                    style={{ borderTop: "1px solid #e5e7eb" }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => saveSettings("AI & Predictive Maintenance")}
                                        disabled={saving}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 transition-opacity"
                                        style={{ backgroundColor: "#155dfc" }}
                                    >
                                        <img src={imgIconSaveAI} alt="" className="h-4 w-4" />
                                        {saving ? "Saving..." : "Save AI Settings"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : active === "Maintenance Workflow" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header */}
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: "#101828" }}>
                                    Maintenance Workflow Settings
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: "#4a5565" }}>
                                    Configure task approval and documentation requirements
                                </p>
                            </div>

                            {/* Live Workflow Statistics */}
                            <div className="grid grid-cols-4 gap-4">
                                <div
                                    className="flex flex-col gap-1 rounded-lg p-4"
                                    style={{ backgroundColor: "#fef9c2", border: "1px solid #fde047" }}
                                >
                                    <div className="text-xs font-medium" style={{ color: "#a65f00" }}>
                                        Open Tasks
                                    </div>
                                    <div className="text-xl font-bold" style={{ color: "#854d0e" }}>
                                        {workflowStatistics.totalOpenTasks}
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col gap-1 rounded-lg p-4"
                                    style={{ backgroundColor: "#dbeafe", border: "1px solid #93c5fd" }}
                                >
                                    <div className="text-xs font-medium" style={{ color: "#1447e6" }}>
                                        In Progress
                                    </div>
                                    <div className="text-xl font-bold" style={{ color: "#1e40af" }}>
                                        {workflowStatistics.tasksInProgress}
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col gap-1 rounded-lg p-4"
                                    style={{ backgroundColor: "#dcfce7", border: "1px solid #86efac" }}
                                >
                                    <div className="text-xs font-medium" style={{ color: "#008236" }}>
                                        Approval Rate
                                    </div>
                                    <div className="text-xl font-bold" style={{ color: "#166534" }}>
                                        {workflowStatistics.supervisorApprovalRate}%
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col gap-1 rounded-lg p-4"
                                    style={{ backgroundColor: workflowStatistics.overdueTasksCount > 0 ? "#fee2e2" : "#f9fafb", border: `1px solid ${workflowStatistics.overdueTasksCount > 0 ? "#fca5a5" : "#e5e7eb"}` }}
                                >
                                    <div className="text-xs font-medium" style={{ color: workflowStatistics.overdueTasksCount > 0 ? "#dc2626" : "#4a5565" }}>
                                        Overdue Tasks
                                    </div>
                                    <div className="text-xl font-bold" style={{ color: workflowStatistics.overdueTasksCount > 0 ? "#b91c1c" : "#0a0a0a" }}>
                                        {workflowStatistics.overdueTasksCount}
                                    </div>
                                </div>
                            </div>

                            {/* AI Workflow Insights Panel */}
                            {showWorkflowAI && (
                                <div
                                    className="rounded-xl p-4"
                                    style={{
                                        background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white text-lg">🔧</span>
                                            <span className="text-white font-bold">AI Workflow Insights</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowWorkflowAI(false)}
                                            className="text-white/70 hover:text-white text-sm"
                                        >
                                            Hide
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {aiWorkflowRecommendations.map((rec) => (
                                            <div
                                                key={rec.id}
                                                className="flex items-center justify-between rounded-lg p-3"
                                                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white text-sm font-medium">{rec.title}</span>
                                                        <span
                                                            className="text-xs px-1.5 py-0.5 rounded"
                                                            style={{
                                                                backgroundColor:
                                                                    rec.type === "optimization" ? "#22c55e" :
                                                                        rec.type === "warning" ? "#f59e0b" : "#3b82f6",
                                                                color: "white",
                                                            }}
                                                        >
                                                            {rec.confidence}%
                                                        </span>
                                                    </div>
                                                    <div className="text-white/70 text-xs mt-1">{rec.description}</div>
                                                </div>
                                                {rec.actionType && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (rec.actionType === "dual-inspection") {
                                                                setSignOffRule("dual-inspection");
                                                                showNotification("Dual Inspection mode enabled for all tasks");
                                                            } else if (rec.actionType === "overdue-alert") {
                                                                showNotification("Overdue tasks flagged for immediate supervisor review", "info");
                                                            }
                                                        }}
                                                        className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-white"
                                                        style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                                                    >
                                                        Apply
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!showWorkflowAI && (
                                <button
                                    type="button"
                                    onClick={() => setShowWorkflowAI(true)}
                                    className="flex items-center gap-2 text-sm"
                                    style={{ color: "#155dfc" }}
                                >
                                    <span>🔧</span>
                                    <span>Show AI Workflow Insights</span>
                                </button>
                            )}

                            {/* Maintenance Sign-Off Rules */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Maintenance Sign-Off Rules
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {/* Technician Only */}
                                    <button
                                        type="button"
                                        onClick={() => setSignOffRule("technician-only")}
                                        className="flex items-center gap-3 rounded-lg p-4 text-left"
                                        style={{
                                            border: `1px solid ${signOffRule === "technician-only" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${signOffRule === "technician-only" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {signOffRule === "technician-only" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Technician Only
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Single sign-off by technician
                                            </div>
                                        </div>
                                    </button>

                                    {/* Technician + Supervisor */}
                                    <button
                                        type="button"
                                        onClick={() => setSignOffRule("technician-supervisor")}
                                        className="flex items-center gap-3 rounded-lg p-4 text-left"
                                        style={{
                                            border: `1px solid ${signOffRule === "technician-supervisor" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${signOffRule === "technician-supervisor" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {signOffRule === "technician-supervisor" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Technician + Supervisor
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Requires supervisor approval
                                            </div>
                                        </div>
                                        {signOffRule === "technician-supervisor" && (
                                            <img src={imgIconWorkflowCheck} alt="" className="h-5 w-5" />
                                        )}
                                    </button>

                                    {/* Dual Inspection Required */}
                                    <button
                                        type="button"
                                        onClick={() => setSignOffRule("dual-inspection")}
                                        className="flex items-center gap-3 rounded-lg p-4 text-left"
                                        style={{
                                            border: `1px solid ${signOffRule === "dual-inspection" ? "#155dfc" : "#e5e7eb"}`,
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{
                                                border: `2px solid ${signOffRule === "dual-inspection" ? "#155dfc" : "#d1d5dc"}`,
                                            }}
                                        >
                                            {signOffRule === "dual-inspection" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Dual Inspection Required
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Two independent inspections required
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Mandatory Fields for Task Closure */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Mandatory Fields for Task Closure
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {/* Findings Description */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div>
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Findings Description
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Require detailed findings documentation
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setRequireFindings(!requireFindings)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: requireFindings ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: requireFindings ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Rectification Actions */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div>
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Rectification Actions
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Require description of corrective actions
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setRequireRectification(!requireRectification)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: requireRectification ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: requireRectification ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Reference Documents */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div>
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Reference Documents
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Require reference to manuals/procedures
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setRequireRefDocs(!requireRefDocs)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: requireRefDocs ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: requireRefDocs ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Task Status Lifecycle */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Task Status Lifecycle
                                </h3>

                                <div
                                    className="flex flex-col gap-3 rounded-lg p-4"
                                    style={{
                                        backgroundColor: "#f9fafb",
                                        border: "1px solid #e5e7eb",
                                    }}
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className="rounded-lg px-2 py-1 text-xs"
                                            style={{
                                                backgroundColor: "#e5e7eb",
                                                color: "#364153",
                                            }}
                                        >
                                            Open
                                        </span>
                                        <img src={imgIconArrowRight} alt="" className="h-4 w-4" />
                                        <span
                                            className="rounded-lg px-2 py-1 text-xs"
                                            style={{
                                                backgroundColor: "#dbeafe",
                                                color: "#1447e6",
                                            }}
                                        >
                                            In Progress
                                        </span>
                                        <img src={imgIconArrowRight} alt="" className="h-4 w-4" />
                                        <span
                                            className="rounded-lg px-2 py-1 text-xs"
                                            style={{
                                                backgroundColor: "#fef9c2",
                                                color: "#a65f00",
                                            }}
                                        >
                                            Inspected
                                        </span>
                                        <img src={imgIconArrowRight} alt="" className="h-4 w-4" />
                                        <span
                                            className="rounded-lg px-2 py-1 text-xs"
                                            style={{
                                                backgroundColor: "#dcfce7",
                                                color: "#008236",
                                            }}
                                        >
                                            Closed
                                        </span>
                                    </div>
                                    <div className="text-xs" style={{ color: "#4a5565" }}>
                                        Standard Part 145 workflow progression
                                    </div>
                                </div>
                            </div>

                            {/* Save button */}
                            <div
                                className="flex justify-end pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => saveSettings("Maintenance Workflow")}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    <img src={imgIconSaveWorkflow} alt="" className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Workflow Settings"}
                                </button>
                            </div>
                        </div>
                    ) : active === "Documents & Records" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header */}
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: "#101828" }}>
                                    Documents &amp; Records Settings
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: "#4a5565" }}>
                                    Configure document management and retention policies
                                </p>
                            </div>

                            {/* Live Document Statistics */}
                            <div className="grid grid-cols-4 gap-3">
                                <div
                                    className="flex flex-col gap-1 rounded-lg p-3"
                                    style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
                                >
                                    <div className="text-xs font-medium" style={{ color: "#1d4ed8" }}>
                                        Total Documents
                                    </div>
                                    <div className="text-xl font-bold" style={{ color: "#1e40af" }}>
                                        {documentStatistics.totalDocuments.toLocaleString()}
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col gap-1 rounded-lg p-3"
                                    style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
                                >
                                    <div className="text-xs font-medium" style={{ color: "#166534" }}>
                                        Added This Month
                                    </div>
                                    <div className="text-xl font-bold" style={{ color: "#15803d" }}>
                                        {documentStatistics.documentsThisMonth}
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col gap-1 rounded-lg p-3"
                                    style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}
                                >
                                    <div className="text-xs font-medium" style={{ color: "#92400e" }}>
                                        Pending Approval
                                    </div>
                                    <div className="text-xl font-bold" style={{ color: "#b45309" }}>
                                        {documentStatistics.pendingApproval}
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col gap-1 rounded-lg p-3"
                                    style={{ backgroundColor: documentStatistics.expiringIn30Days > 0 ? "#fee2e2" : "#f9fafb", border: `1px solid ${documentStatistics.expiringIn30Days > 0 ? "#fca5a5" : "#e5e7eb"}` }}
                                >
                                    <div className="text-xs font-medium" style={{ color: documentStatistics.expiringIn30Days > 0 ? "#dc2626" : "#4a5565" }}>
                                        Expiring (30 days)
                                    </div>
                                    <div className="text-xl font-bold" style={{ color: documentStatistics.expiringIn30Days > 0 ? "#b91c1c" : "#0a0a0a" }}>
                                        {documentStatistics.expiringIn30Days}
                                    </div>
                                </div>
                            </div>

                            {/* AI Document Insights Panel */}
                            {showDocumentsAI && aiDocumentRecommendations.length > 0 && (
                                <div
                                    className="rounded-lg p-4"
                                    style={{
                                        background: "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)",
                                        border: "1px solid #c4b5fd",
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <img src={imgIconAI} alt="" className="h-5 w-5" />
                                            <span className="text-sm font-bold" style={{ color: "#5b21b6" }}>
                                                AI Document Insights
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowDocumentsAI(false)}
                                            className="text-xs px-2 py-1 rounded hover:bg-white/50 transition-colors"
                                            style={{ color: "#6d28d9" }}
                                        >
                                            Hide
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {aiDocumentRecommendations.map((rec) => (
                                            <div
                                                key={rec.id}
                                                className="flex items-start gap-3 rounded-lg p-3 bg-white/80"
                                            >
                                                <div
                                                    className="h-2 w-2 rounded-full mt-1.5 shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            rec.type === "warning" ? "#f59e0b" :
                                                                rec.type === "optimization" ? "#3b82f6" :
                                                                    rec.type === "critical" ? "#ef4444" : "#22c55e",
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium" style={{ color: "#0a0a0a" }}>
                                                        {rec.title}
                                                    </div>
                                                    <div className="text-xs mt-0.5" style={{ color: "#4a5565" }}>
                                                        {rec.description}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs" style={{ color: "#6d28d9" }}>
                                                            {rec.confidence}% confidence
                                                        </span>
                                                        <span className="text-xs" style={{ color: "#059669" }}>
                                                            • {rec.impact}
                                                        </span>
                                                    </div>
                                                </div>
                                                {rec.actionType && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (rec.actionType === "retention-policy") {
                                                                setRetentionPeriod("10");
                                                                showNotification("Retention policy updated to 10 years for Certifications");
                                                            } else if (rec.actionType === "expiring-docs") {
                                                                router.push("/app/docs?filter=expiring");
                                                            }
                                                        }}
                                                        className="shrink-0 px-3 py-1 rounded-md text-xs font-medium text-white hover:opacity-90 transition-opacity"
                                                        style={{ backgroundColor: "#6d28d9" }}
                                                    >
                                                        {rec.actionType === "expiring-docs" ? "View" : "Apply"}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Show AI toggle if hidden */}
                            {!showDocumentsAI && (
                                <button
                                    type="button"
                                    onClick={() => setShowDocumentsAI(true)}
                                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors w-fit"
                                    style={{ color: "#6d28d9", border: "1px solid #c4b5fd" }}
                                >
                                    <img src={imgIconAI} alt="" className="h-4 w-4" />
                                    Show AI Document Insights
                                </button>
                            )}

                            {/* Document Categories */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Document Categories
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { name: "Maintenance Records", icon: imgIconMaintRecords, count: documentStatistics.maintenanceRecords },
                                        { name: "Inspection Reports", icon: imgIconInspReports, count: documentStatistics.inspectionReports },
                                        { name: "Compliance Documents", icon: imgIconComplianceDocs, count: documentStatistics.complianceDocuments },
                                        { name: "Technical Publications", icon: imgIconTechPubs, count: documentStatistics.technicalPublications },
                                        { name: "Certifications", icon: imgIconCertifications, count: documentStatistics.certifications },
                                        { name: "Training Records", icon: imgIconTrainingRecords, count: documentStatistics.trainingRecords },
                                    ].map((cat) => (
                                        <button
                                            key={cat.name}
                                            type="button"
                                            onClick={() => {
                                                if (selectedDocCategories.includes(cat.name)) {
                                                    setSelectedDocCategories(selectedDocCategories.filter(c => c !== cat.name));
                                                } else {
                                                    setSelectedDocCategories([...selectedDocCategories, cat.name]);
                                                }
                                            }}
                                            className="flex items-center gap-3 rounded-lg p-3 transition-all hover:shadow-md"
                                            style={{
                                                backgroundColor: selectedDocCategories.includes(cat.name) ? "#eff6ff" : "#f9fafb",
                                                border: selectedDocCategories.includes(cat.name) ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                                            }}
                                        >
                                            <img src={cat.icon} alt="" className="h-5 w-5" />
                                            <div className="flex-1 text-left">
                                                <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e7eb", color: "#374151" }}>
                                                {cat.count.toLocaleString()}
                                            </span>
                                            {selectedDocCategories.includes(cat.name) && (
                                                <svg className="h-4 w-4" style={{ color: "#3b82f6" }} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Retention Policy */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Retention Policy
                                </h3>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm" style={{ color: "#0a0a0a" }}>
                                        Minimum Retention Period (Years)
                                    </label>
                                    <select
                                        value={retentionPeriod}
                                        onChange={(e) => setRetentionPeriod(e.target.value)}
                                        className="w-64 rounded-lg px-3 py-2 text-sm"
                                        style={{
                                            border: "1px solid #d1d5dc",
                                            backgroundColor: "#fff",
                                            color: "#0a0a0a",
                                        }}
                                    >
                                        {retentionOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs" style={{ color: "#4a5565" }}>
                                        FAA requires maintenance records to be retained for at least 1 year after aircraft is sold
                                    </p>
                                </div>

                                {/* Storage usage indicator */}
                                <div
                                    className="flex items-center justify-between rounded-lg p-3"
                                    style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#dbeafe" }}>
                                            <svg className="h-4 w-4" style={{ color: "#2563eb" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Storage Used
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                {documentStatistics.storageUsed} of 100 GB
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#e5e7eb" }}>
                                        <div className="h-full rounded-full" style={{ width: "24.7%", backgroundColor: "#3b82f6" }} />
                                    </div>
                                </div>
                            </div>

                            {/* Version Control */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Version Control
                                </h3>

                                <div
                                    className="flex items-center justify-between rounded-lg p-4"
                                    style={{
                                        backgroundColor: "#f9fafb",
                                        border: "1px solid #e5e7eb",
                                    }}
                                >
                                    <div>
                                        <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Automatic Version Control
                                        </div>
                                        <div className="text-xs" style={{ color: "#4a5565" }}>
                                            Automatically create new version when document is updated
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAutoVersionControl(!autoVersionControl)}
                                        className="relative h-6 w-11 rounded-full transition-colors"
                                        style={{ backgroundColor: autoVersionControl ? "#155dfc" : "#d1d5db" }}
                                    >
                                        <span
                                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                            style={{ left: autoVersionControl ? "22px" : "2px" }}
                                        />
                                    </button>
                                </div>

                                {/* Version statistics */}
                                {autoVersionControl && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div
                                            className="flex items-center gap-3 rounded-lg p-3"
                                            style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
                                        >
                                            <div className="text-sm" style={{ color: "#166534" }}>
                                                Documents with versioning
                                            </div>
                                            <div className="ml-auto text-sm font-bold" style={{ color: "#15803d" }}>
                                                {documentStatistics.versionControlEnabled.toLocaleString()}
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center gap-3 rounded-lg p-3"
                                            style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                                        >
                                            <div className="text-sm" style={{ color: "#4a5565" }}>
                                                Avg. versions per doc
                                            </div>
                                            <div className="ml-auto text-sm font-bold" style={{ color: "#0a0a0a" }}>
                                                {documentStatistics.averageVersions}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Save button */}
                            <div
                                className="flex justify-end pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => saveSettings("Documents & Records")}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    <img src={imgIconSaveDocs} alt="" className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Document Settings"}
                                </button>
                            </div>
                        </div>
                    ) : active === "Appearance" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header */}
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: "#101828" }}>
                                    Appearance Preferences
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: "#4a5565" }}>
                                    Customize your user interface experience
                                </p>
                            </div>

                            {/* Theme */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Theme
                                </h3>

                                <div className="flex gap-3">
                                    {/* Light Mode */}
                                    <button
                                        type="button"
                                        onClick={() => setTheme("light")}
                                        className="flex flex-1 items-center gap-3 rounded-lg px-4 py-4"
                                        style={{
                                            border: theme === "light" ? "2px solid #155dfc" : "2px solid #e5e7eb",
                                            backgroundColor: theme === "light" ? "#eff6ff" : "white",
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 items-center justify-center rounded-full"
                                            style={{
                                                border: theme === "light" ? "2px solid #155dfc" : "2px solid #d1d5db",
                                            }}
                                        >
                                            {theme === "light" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col items-start">
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Light Mode
                                            </span>
                                            <span className="text-xs" style={{ color: "#4a5565" }}>
                                                Classic light interface
                                            </span>
                                        </div>
                                        <img src={imgIconLightMode} alt="" className="h-5 w-5" />
                                    </button>

                                    {/* Dark Mode (Coming Soon) */}
                                    <div
                                        className="flex flex-1 cursor-not-allowed items-center gap-3 rounded-lg px-4 py-4 opacity-50"
                                        style={{
                                            border: "2px solid #e5e7eb",
                                            backgroundColor: "white",
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 items-center justify-center rounded-full"
                                            style={{ border: "2px solid #d1d5db" }}
                                        />
                                        <div className="flex flex-1 flex-col items-start">
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Dark Mode
                                            </span>
                                            <span className="text-xs" style={{ color: "#4a5565" }}>
                                                Coming soon
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Density */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Dashboard Density
                                </h3>

                                <div className="flex flex-col gap-2">
                                    {/* Compact */}
                                    <button
                                        type="button"
                                        onClick={() => setDashboardDensity("compact")}
                                        className="flex items-center gap-3 rounded-lg p-4"
                                        style={{
                                            border:
                                                dashboardDensity === "compact"
                                                    ? "1px solid #155dfc"
                                                    : "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 items-center justify-center rounded-full"
                                            style={{
                                                border:
                                                    dashboardDensity === "compact"
                                                        ? "2px solid #155dfc"
                                                        : "2px solid #d1d5db",
                                            }}
                                        >
                                            {dashboardDensity === "compact" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col items-start">
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Compact
                                            </span>
                                            <span className="text-xs" style={{ color: "#4a5565" }}>
                                                More information, less spacing
                                            </span>
                                        </div>
                                    </button>

                                    {/* Comfortable */}
                                    <button
                                        type="button"
                                        onClick={() => setDashboardDensity("comfortable")}
                                        className="flex items-center gap-3 rounded-lg p-4"
                                        style={{
                                            border:
                                                dashboardDensity === "comfortable"
                                                    ? "1px solid #155dfc"
                                                    : "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 items-center justify-center rounded-full"
                                            style={{
                                                border:
                                                    dashboardDensity === "comfortable"
                                                        ? "2px solid #155dfc"
                                                        : "2px solid #d1d5db",
                                            }}
                                        >
                                            {dashboardDensity === "comfortable" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col items-start">
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Comfortable
                                            </span>
                                            <span className="text-xs" style={{ color: "#4a5565" }}>
                                                Balanced layout (recommended)
                                            </span>
                                        </div>
                                        {dashboardDensity === "comfortable" && (
                                            <img src={imgIconComfortableCheck} alt="" className="h-5 w-5" />
                                        )}
                                    </button>

                                    {/* Spacious */}
                                    <button
                                        type="button"
                                        onClick={() => setDashboardDensity("spacious")}
                                        className="flex items-center gap-3 rounded-lg p-4"
                                        style={{
                                            border:
                                                dashboardDensity === "spacious"
                                                    ? "1px solid #155dfc"
                                                    : "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div
                                            className="flex h-4 w-4 items-center justify-center rounded-full"
                                            style={{
                                                border:
                                                    dashboardDensity === "spacious"
                                                        ? "2px solid #155dfc"
                                                        : "2px solid #d1d5db",
                                            }}
                                        >
                                            {dashboardDensity === "spacious" && (
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "#155dfc" }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col items-start">
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Spacious
                                            </span>
                                            <span className="text-xs" style={{ color: "#4a5565" }}>
                                                More spacing, easier scanning
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Default Landing Page */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Default Landing Page
                                </h3>

                                <div className="flex flex-col gap-2">
                                    <select
                                        value={defaultLandingPage}
                                        onChange={(e) => setDefaultLandingPage(e.target.value)}
                                        className="w-64 appearance-none rounded-lg px-4 py-2 text-sm"
                                        style={{
                                            border: "1px solid #d1d5dc",
                                            color: "#0a0a0a",
                                            backgroundColor: "white",
                                        }}
                                    >
                                        {landingPageOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs" style={{ color: "#4a5565" }}>
                                        Page shown immediately after login
                                    </p>
                                </div>
                            </div>

                            {/* Save button */}
                            <div
                                className="flex justify-end pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => saveSettings("Appearance")}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    <img src={imgIconSaveAppearance} alt="" className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Appearance Settings"}
                                </button>
                            </div>
                        </div>
                    ) : active === "About SkyMaintain" ? (
                        <div className="flex flex-col gap-6">
                            {/* Hero section with logo and branding - Figma 6:4843 */}
                            <div className="flex flex-col items-center" style={{ paddingTop: "32px" }}>
                                {/* App logo - 80x80 blue gradient with airplane icon */}
                                <div
                                    className="flex items-center justify-center rounded-2xl shadow-lg"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                    }}
                                >
                                    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                    </svg>
                                </div>

                                {/* App name */}
                                <h2
                                    className="mt-6 text-center font-bold"
                                    style={{ color: "#101828", fontSize: "30px", lineHeight: "36px" }}
                                >
                                    SkyMaintain
                                </h2>

                                {/* Tagline */}
                                <p
                                    className="mt-4 max-w-md text-center text-sm"
                                    style={{ color: "#4a5565", lineHeight: "20px" }}
                                >
                                    A Regulatory-Compliant Architecture for AI-Assisted Aircraft Maintenance Decision Support
                                </p>

                                {/* Version badge */}
                                <span
                                    className="mt-6 rounded-lg px-4 py-2 text-sm text-white"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    Version 1.0
                                </span>
                            </div>

                            {/* Info cards row */}
                            <div className="flex gap-6 mt-6">
                                {/* AI Model Information card */}
                                <div
                                    className="flex flex-1 flex-col gap-10 rounded-xl bg-white"
                                    style={{ border: "1px solid rgba(0,0,0,0.1)", padding: "24px" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="10" fill="#ede9fe" />
                                            <path d="M10 5C7.24 5 5 7.24 5 10s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c.83 0 1.5.67 1.5 1.5 0 .66-.42 1.21-1 1.41V11.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5V9.5c0-.28.22-.5.5-.5.83 0 1.5-.67 1.5-1.5S10.83 6 10 6s-1.5.67-1.5 1.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5C7.5 6.12 8.62 5 10 5zm0 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="#7c3aed" />
                                        </svg>
                                        <span className="font-bold" style={{ color: "#0a0a0a", fontSize: "16px" }}>
                                            AI Model Information
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-1">
                                            <span className="text-sm" style={{ color: "#4a5565" }}>
                                                Model Version:
                                            </span>
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                SkyMaintain ML v2.1.0
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="text-sm" style={{ color: "#4a5565" }}>
                                                Training Dataset:
                                            </span>
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                10M+ Flight Hours
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm" style={{ color: "#4a5565" }}>
                                                Last Updated:
                                            </span>
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                January 15, 2026
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Regulatory Scope card */}
                                <div
                                    className="flex flex-1 flex-col gap-10 rounded-xl bg-white"
                                    style={{ border: "1px solid rgba(0,0,0,0.1)", padding: "24px" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="10" fill="#e2e8f0" />
                                            <path d="M13 5H7a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V6a1 1 0 00-1-1zm-1 8H8v-1h4v1zm0-2H8v-1h4v1zm0-2H8V8h4v1z" fill="#475569" />
                                        </svg>
                                        <span className="font-bold" style={{ color: "#0a0a0a", fontSize: "16px" }}>
                                            Regulatory Scope
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm" style={{ color: "#4a5565" }}>
                                                FAA Compliance:
                                            </span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                                                <circle cx="10" cy="10" r="10" fill="#dcfce7" />
                                                <path d="M8.5 12.5l-2-2 .71-.71L8.5 11.09l4.29-4.3.71.71-5 5z" fill="#166534" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm" style={{ color: "#4a5565" }}>
                                                EASA Certified:
                                            </span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                                                <circle cx="10" cy="10" r="10" fill="#dcfce7" />
                                                <path d="M8.5 12.5l-2-2 .71-.71L8.5 11.09l4.29-4.3.71.71-5 5z" fill="#166534" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm" style={{ color: "#4a5565" }}>
                                                ISO 9001:2015:
                                            </span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                                                <circle cx="10" cy="10" r="10" fill="#dcfce7" />
                                                <path d="M8.5 12.5l-2-2 .71-.71L8.5 11.09l4.29-4.3.71.71-5 5z" fill="#166534" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Disclaimer card */}
                            <div
                                className="flex flex-col gap-9 rounded-xl"
                                style={{
                                    background: "linear-gradient(to right, #eff6ff 0%, #faf5ff 100%)",
                                    border: "2px solid #bedbff",
                                    padding: "24px",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 2L2 18h16L10 2z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
                                        <path d="M10 8v4M10 14h.01" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span className="font-bold" style={{ color: "#0a0a0a", fontSize: "16px" }}>
                                        Important Disclaimer
                                    </span>
                                </div>
                                <p
                                    className="text-sm"
                                    style={{ color: "#364153", lineHeight: "22.75px" }}
                                >
                                    SkyMaintain is a decision support system designed to assist qualified aviation maintenance professionals. All AI predictions and recommendations must be reviewed and approved by certified personnel. This system does not replace regulatory requirements or the judgment of experienced maintenance engineers. Always consult applicable regulations, manufacturer documentation, and approved procedures.
                                </p>
                            </div>

                            {/* Support & Resources */}
                            <div
                                className="flex flex-col gap-4 pt-6"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="font-bold" style={{ color: "#0a0a0a", fontSize: "16px" }}>
                                    Support &amp; Resources
                                </h3>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.open("mailto:support@skymaintain.com?subject=SkyMaintain%20Support%20Request", "_blank");
                                            showNotification("Opening email client for support...", "info");
                                        }}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                                        style={{
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            backgroundColor: "white",
                                            color: "#0a0a0a",
                                        }}
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                            <rect x="1" y="3" width="14" height="10" rx="1" stroke="#364153" strokeWidth="1.5" fill="none" />
                                            <path d="M1 4l7 5 7-5" stroke="#364153" strokeWidth="1.5" fill="none" />
                                        </svg>
                                        Contact Support
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.push("/app/docs");
                                            showNotification("Navigating to Documentation...", "info");
                                        }}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                                        style={{
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            backgroundColor: "white",
                                            color: "#0a0a0a",
                                        }}
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 2h7l4 4v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="#364153" strokeWidth="1.5" fill="none" />
                                            <path d="M10 2v4h4" stroke="#364153" strokeWidth="1.5" fill="none" />
                                            <path d="M5 9h6M5 12h4" stroke="#364153" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Documentation
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.push("/terms");
                                            showNotification("Navigating to Terms & Privacy...", "info");
                                        }}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                                        style={{
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            backgroundColor: "white",
                                            color: "#0a0a0a",
                                        }}
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                            <path d="M8 1l6 2v5c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V3l6-2z" stroke="#364153" strokeWidth="1.5" fill="none" />
                                            <path d="M6 8l2 2 3-3" stroke="#364153" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Terms &amp; Privacy
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div
                                className="flex flex-col items-center pt-6 text-center"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <p className="text-sm" style={{ color: "#4a5565" }}>
                                    © 2026 SkyMaintain. All Rights Reserved.
                                </p>
                                <p className="text-sm" style={{ color: "#4a5565" }}>
                                    SkyMaintain is a product of EncycloAMTs LLC.
                                </p>
                                <p className="text-sm" style={{ color: "#4a5565" }}>
                                    Built with precision for aviation maintenance excellence.
                                </p>
                            </div>
                        </div>
                    ) : active === "Security & Audit Logs" ? (
                        <div className="flex flex-col gap-6">
                            {/* Section header - matching Figma 6:4096 */}
                            <div className="flex flex-col gap-2">
                                <h2 className="text-2xl font-bold" style={{ color: "#101828" }}>
                                    Security &amp; Audit Logs
                                </h2>
                                <p className="text-sm" style={{ color: "#4a5565" }}>
                                    Manage security settings and view system activity
                                </p>
                            </div>

                            {/* Session Security */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Session Security
                                </h3>

                                <div
                                    className="flex flex-col gap-3 rounded-lg p-4"
                                    style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
                                >
                                    {/* Session Timeout */}
                                    <div className="flex items-start gap-3">
                                        <svg className="h-5 w-5 mt-0.5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="flex-1">
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                Session Timeout (minutes)
                                            </div>
                                            <div className="text-xs mt-1" style={{ color: "#4a5565" }}>
                                                Automatically lock inactive sessions to protect sensitive data.
                                            </div>
                                            <select
                                                value={sessionTimeout}
                                                onChange={(e) => setSessionTimeout(e.target.value)}
                                                className="mt-3 w-44 rounded-lg px-3 py-2 text-sm"
                                                style={{
                                                    border: "1px solid #d1d5dc",
                                                    backgroundColor: "white",
                                                    color: "#0a0a0a",
                                                }}
                                            >
                                                {sessionTimeoutOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Compliance info */}
                                    <div
                                        className="flex items-start gap-3 pt-3"
                                        style={{ borderTop: "1px solid #e5e7eb" }}
                                    >
                                        <svg className="h-4 w-4 mt-0.5 text-[#4a5565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs" style={{ color: "#4a5565" }}>
                                            Users will receive a 60-second warning before automatic lock. This feature aligns with airline IT policies and ISO 27001 requirements.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Audit Logs */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Audit Logs
                                </h3>

                                {/* Compliance info banner */}
                                <div
                                    className="flex items-start gap-3 rounded-lg p-4"
                                    style={{ backgroundColor: "#eff6ff", border: "1px solid #bedbff" }}
                                >
                                    <svg className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#1447e6" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm" style={{ color: "#1447e6" }}>
                                        Audit logs are automatically maintained for regulatory compliance and are immutable once created.
                                    </p>
                                </div>

                                {/* Audit log categories */}
                                <div className="flex flex-col gap-3">
                                    {auditLogCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => {
                                                router.push(`/app/admin-panel?tab=audit&category=${category.id}`);
                                                showNotification(`Opening ${category.name} audit logs...`, "info");
                                            }}
                                            className="flex items-center justify-between rounded-lg p-4 hover:shadow-md transition-shadow"
                                            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {category.icon === "login" && (
                                                    <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                )}
                                                {category.icon === "wrench" && (
                                                    <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                )}
                                                {category.icon === "document" && (
                                                    <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                )}
                                                {category.icon === "shield" && (
                                                    <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                )}
                                                {category.icon === "settings" && (
                                                    <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                    </svg>
                                                )}
                                                <div className="text-left">
                                                    <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                        {category.name}
                                                    </div>
                                                    <div className="text-xs" style={{ color: "#4a5565" }}>
                                                        {category.eventsLogged} events logged
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Last event
                                                </div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    {category.lastEvent}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* View Full Audit Trail button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        router.push("/app/admin-panel?tab=audit");
                                        showNotification("Opening full audit trail...", "info");
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                    style={{ border: "1px solid rgba(0,0,0,0.1)", color: "#0a0a0a" }}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Full Audit Trail
                                </button>
                            </div>
                        </div>
                    ) : (
                        <PlaceholderPanel title={active} />
                    )}
                </section>
                {
                    changePasswordOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#0a0a0a]">Change Password</h2>
                                        <p className="mt-1 text-sm text-[#4a5565]">
                                            Update your password to keep your account secure.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeChangePasswordModal}
                                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <label className="flex flex-col gap-1 text-sm text-slate-700">
                                        Current Password
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-14 text-sm text-slate-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-600 hover:text-slate-900"
                                                aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                                                aria-pressed={showCurrentPassword}
                                            >
                                                {showCurrentPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-1 text-sm text-slate-700">
                                        New Password
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-14 text-sm text-slate-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-600 hover:text-slate-900"
                                                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                                                aria-pressed={showNewPassword}
                                            >
                                                {showNewPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-1 text-sm text-slate-700">
                                        Confirm New Password
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-14 text-sm text-slate-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-600 hover:text-slate-900"
                                                aria-label={showConfirmPassword ? "Hide confirm new password" : "Show confirm new password"}
                                                aria-pressed={showConfirmPassword}
                                            >
                                                {showConfirmPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </label>

                                    {passwordError ? (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                            {passwordError}
                                        </div>
                                    ) : null}
                                    {passwordSuccess ? (
                                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                                            {passwordSuccess}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="mt-5 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeChangePasswordModal}
                                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleChangePassword}
                                        disabled={passwordSaving}
                                        className="rounded-lg bg-[#155dfc] px-4 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
                                    >
                                        {passwordSaving ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
}

function ActiveAircraftBanner({
    aircraft,
    fallback,
}: {
    aircraft: Aircraft | null;
    fallback: Pick<Aircraft, "registration" | "model" | "lastService">;
}) {
    const active = aircraft ?? fallback;
    return (
        <div
            className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl px-4 py-3"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}
        >
            <div className="flex items-center gap-3">
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#e0e7ff", color: "#1d4ed8" }}
                >
                    ✈
                </div>
                <div>
                    <div className="text-xs" style={{ color: "#64748b" }}>
                        Active Aircraft
                    </div>
                    <div className="text-sm font-semibold" style={{ color: "#0a0a0a" }}>
                        {active.registration} · {active.model}
                    </div>
                </div>
            </div>
            <div className="text-xs" style={{ color: "#64748b" }}>
                Last service: <span style={{ color: "#0a0a0a", fontWeight: 600 }}>{active.lastService ?? "—"}</span>
            </div>
        </div>
    );
}

function PlaceholderPanel({ title }: { title: string }) {
    return (
        <div>
            <h2 className="text-2xl font-bold" style={{ color: "#101828" }}>
                {title}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#4a5565" }}>
                This section is stubbed for now. We&apos;ll wire it to backend settings and
                policy controls as endpoints become available.
            </p>

            <div
                className="mt-5 rounded-lg p-4 text-sm"
                style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    color: "#4a5565",
                }}
            >
                Placeholder content for <span className="font-semibold">{title}</span>.
            </div>
        </div>
    );
}

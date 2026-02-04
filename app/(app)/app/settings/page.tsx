/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

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

// About SkyMaintain assets (node 6:4843)
const imgIconAppLogo = makeLetterIcon("SM", "#dbeafe", "#1d4ed8");
const imgIconAIModelInfo = makeLetterIcon("AI", "#ede9fe", "#6d28d9");
const imgIconRegulatoryScope = makeLetterIcon("RS", "#e2e8f0", "#475569");
const imgIconComplianceCheck = makeLetterIcon("✓", "#dcfce7", "#166534");
const imgIconDisclaimer = makeLetterIcon("!", "#fee2e2", "#b91c1c");
const imgIconContactSupport = makeLetterIcon("CS", "#e2e8f0", "#475569");
const imgIconDocsLink = makeLetterIcon("DL", "#e2e8f0", "#475569");
const imgIconTermsPrivacy = makeLetterIcon("TP", "#e2e8f0", "#475569");

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

    const [fullName, setFullName] = useState("John Mitchell");
    const [email, setEmail] = useState("manager@skywings.com");
    const [phone, setPhone] = useState("+1 (555) 123-4567");
    const [role] = useState("Fleet Manager");
    const [readOnly] = useState(true);

    const [twoFAEnabled, setTwoFAEnabled] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

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
    const [showAuditLogs, setShowAuditLogs] = useState(false);

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

    // AI Mechanic recommendations for Aircraft & Fleet
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

    // Sample audit logs
    const auditLogs = useMemo(() => [
        { id: "LOG-001", timestamp: "2026-02-03 09:45:22", user: "manager@skywings.com", action: "Login", details: "Successful login from IP 192.168.1.100", severity: "info" },
        { id: "LOG-002", timestamp: "2026-02-03 09:32:15", user: "admin@skywings.com", action: "Settings Changed", details: "Modified regulatory authority from EASA to FAA", severity: "warning" },
        { id: "LOG-003", timestamp: "2026-02-03 08:15:00", user: "technician@skywings.com", action: "Data Export", details: "Exported maintenance logs for N123AB", severity: "info" },
        { id: "LOG-004", timestamp: "2026-02-02 17:22:45", user: "manager@skywings.com", action: "Document Upload", details: "Uploaded AD compliance certificate", severity: "info" },
        { id: "LOG-005", timestamp: "2026-02-02 14:10:33", user: "unknown", action: "Login Failed", details: "Failed login attempt from IP 45.33.22.11", severity: "critical" },
    ], []);

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
        { value: "FAA", label: "🇺🇸 FAA - Federal Aviation Administration (United States)" },
        { value: "EASA", label: "🇪🇺 EASA - European Union Aviation Safety Agency (EU)" },
        { value: "TCCA", label: "🇨🇦 TCCA - Transport Canada Civil Aviation (Canada)" },
        { value: "CAA-UK", label: "🇬🇧 CAA - Civil Aviation Authority (United Kingdom)" },
        { value: "CASA", label: "🇦🇺 CASA - Civil Aviation Safety Authority (Australia)" },
        { value: "JCAB", label: "🇯🇵 JCAB - Japan Civil Aviation Bureau" },
        { value: "DGCA-IN", label: "🇮🇳 DGCA - Directorate General of Civil Aviation (India)" },
        { value: "CAAC", label: "🇨🇳 CAAC - Civil Aviation Administration of China" },
    ];

    const sessionTimeoutOptions = [
        { value: "15", label: "15 minutes" },
        { value: "30", label: "30 minutes (Recommended)" },
        { value: "60", label: "1 hour" },
        { value: "120", label: "2 hours" },
        { value: "480", label: "8 hours (Work day)" },
    ];

    const auditRetentionOptions = [
        { value: "1", label: "1 Year" },
        { value: "2", label: "2 Years (Recommended)" },
        { value: "5", label: "5 Years" },
        { value: "7", label: "7 Years (FAA Minimum)" },
        { value: "permanent", label: "Permanent" },
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
                setChangePasswordOpen(false);
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
                    className="flex-1 rounded-xl bg-white p-6"
                    style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                >
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
                                                AI Mechanic Recommendations
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
                                </div>
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

                            {/* Model Information */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Model Information
                                </h3>

                                <div className="flex gap-4">
                                    <div
                                        className="flex flex-1 flex-col gap-1 rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="text-xs" style={{ color: "#4a5565" }}>
                                            AI Model Version
                                        </div>
                                        <div className="text-sm font-bold" style={{ color: "#0a0a0a" }}>
                                            SkyMaintain ML v2.1.0
                                        </div>
                                    </div>
                                    <div
                                        className="flex flex-1 flex-col gap-1 rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="text-xs" style={{ color: "#4a5565" }}>
                                            Last Updated
                                        </div>
                                        <div className="text-sm font-bold" style={{ color: "#0a0a0a" }}>
                                            January 15, 2026
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

                            {/* Document Categories */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Document Categories
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <div
                                        className="flex items-center gap-3 rounded-lg p-3"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <img src={imgIconMaintRecords} alt="" className="h-5 w-5" />
                                        <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Maintenance Records
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-3 rounded-lg p-3"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <img src={imgIconInspReports} alt="" className="h-5 w-5" />
                                        <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Inspection Reports
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-3 rounded-lg p-3"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <img src={imgIconComplianceDocs} alt="" className="h-5 w-5" />
                                        <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Compliance Documents
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-3 rounded-lg p-3"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <img src={imgIconTechPubs} alt="" className="h-5 w-5" />
                                        <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Technical Publications
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-3 rounded-lg p-3"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <img src={imgIconCertifications} alt="" className="h-5 w-5" />
                                        <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Certifications
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-3 rounded-lg p-3"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <img src={imgIconTrainingRecords} alt="" className="h-5 w-5" />
                                        <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Training Records
                                        </span>
                                    </div>
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
                            {/* Hero section with logo and branding */}
                            <div className="flex flex-col items-center pb-6">
                                {/* App logo */}
                                <div
                                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
                                    style={{
                                        background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)",
                                    }}
                                >
                                    <img src={imgIconAppLogo} alt="" className="h-12 w-12" />
                                </div>

                                {/* App name */}
                                <h2
                                    className="text-center text-3xl font-bold"
                                    style={{ color: "#101828" }}
                                >
                                    SkyMaintain
                                </h2>

                                {/* Tagline */}
                                <p
                                    className="mt-2 max-w-md text-center text-sm"
                                    style={{ color: "#4a5565" }}
                                >
                                    A Regulatory-Compliant Architecture for AI-Assisted Aircraft
                                    Maintenance Decision Support
                                </p>

                                {/* Version badge */}
                                <span
                                    className="mt-4 rounded-lg px-4 py-2 text-sm text-white"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    Version 1.0
                                </span>
                            </div>

                            {/* Info cards row */}
                            <div className="flex gap-6">
                                {/* AI Model Information card */}
                                <div
                                    className="flex flex-1 flex-col gap-6 rounded-xl p-6"
                                    style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <img src={imgIconAIModelInfo} alt="" className="h-5 w-5" />
                                        <span className="font-bold" style={{ color: "#0a0a0a" }}>
                                            AI Model Information
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-wrap gap-1">
                                            <span
                                                className="text-sm"
                                                style={{ color: "#4a5565" }}
                                            >
                                                Model Version:
                                            </span>
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                SkyMaintain ML v2.1.0
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            <span
                                                className="text-sm"
                                                style={{ color: "#4a5565" }}
                                            >
                                                Training Dataset:
                                            </span>
                                            <span className="text-sm" style={{ color: "#0a0a0a" }}>
                                                10M+ Flight Hours
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span
                                                className="text-sm"
                                                style={{ color: "#4a5565" }}
                                            >
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
                                    className="flex flex-1 flex-col gap-6 rounded-xl p-6"
                                    style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <img src={imgIconRegulatoryScope} alt="" className="h-5 w-5" />
                                        <span className="font-bold" style={{ color: "#0a0a0a" }}>
                                            Regulatory Scope
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-sm"
                                                style={{ color: "#4a5565" }}
                                            >
                                                FAA Compliance:
                                            </span>
                                            <img
                                                src={imgIconComplianceCheck}
                                                alt=""
                                                className="h-5 w-5"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-sm"
                                                style={{ color: "#4a5565" }}
                                            >
                                                EASA Certified:
                                            </span>
                                            <img
                                                src={imgIconComplianceCheck}
                                                alt=""
                                                className="h-5 w-5"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-sm"
                                                style={{ color: "#4a5565" }}
                                            >
                                                ISO 9001:2015:
                                            </span>
                                            <img
                                                src={imgIconComplianceCheck}
                                                alt=""
                                                className="h-5 w-5"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Disclaimer card */}
                            <div
                                className="flex flex-col gap-6 rounded-xl p-6"
                                style={{
                                    background:
                                        "linear-gradient(to right, #eff6ff 0%, #faf5ff 100%)",
                                    border: "2px solid #bedbff",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <img src={imgIconDisclaimer} alt="" className="h-5 w-5" />
                                    <span className="font-bold" style={{ color: "#0a0a0a" }}>
                                        Important Disclaimer
                                    </span>
                                </div>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: "#364153" }}
                                >
                                    SkyMaintain is a decision support system designed to assist
                                    qualified aviation maintenance professionals. All AI predictions
                                    and recommendations must be reviewed and approved by certified
                                    personnel. This system does not replace regulatory requirements
                                    or the judgment of experienced maintenance engineers. Always
                                    consult applicable regulations, manufacturer documentation, and
                                    approved procedures.
                                </p>
                            </div>

                            {/* Support & Resources */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="font-bold" style={{ color: "#0a0a0a" }}>
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
                                        <img
                                            src={imgIconContactSupport}
                                            alt=""
                                            className="h-4 w-4"
                                        />
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
                                        <img src={imgIconDocsLink} alt="" className="h-4 w-4" />
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
                                        <img src={imgIconTermsPrivacy} alt="" className="h-4 w-4" />
                                        Terms &amp; Privacy
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div
                                className="flex flex-col items-center pt-4 text-center"
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
                            {/* Section header */}
                            <div
                                className="flex gap-3 rounded-lg p-4"
                                style={{
                                    backgroundColor: "#fef3c7",
                                    border: "1.6px solid #fcd34d",
                                }}
                            >
                                <svg className="h-6 w-6 text-[#b45309]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <div>
                                    <h2
                                        className="text-lg font-bold"
                                        style={{ color: "#92400e" }}
                                    >
                                        🔒 Security &amp; Audit Logs
                                    </h2>
                                    <p className="text-sm" style={{ color: "#b45309" }}>
                                        Configure security policies and review system audit trails
                                    </p>
                                </div>
                            </div>

                            {/* Session Security */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Session Security
                                </h3>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Session Timeout */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm" style={{ color: "#0a0a0a" }}>
                                            Session Timeout
                                        </label>
                                        <select
                                            value={sessionTimeout}
                                            onChange={(e) => setSessionTimeout(e.target.value)}
                                            className="w-full appearance-none rounded-lg px-3 py-2 text-sm outline-none"
                                            style={{
                                                border: "1px solid #d1d5dc",
                                                color: "#0a0a0a",
                                                backgroundColor: "white",
                                            }}
                                        >
                                            {sessionTimeoutOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs" style={{ color: "#4a5565" }}>
                                            Automatically log out after period of inactivity
                                        </p>
                                    </div>

                                    {/* MFA for Sensitive Operations */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Require MFA for Sensitive Actions
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Re-verify identity for critical operations
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setRequireMFAForSensitive(!requireMFAForSensitive)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: requireMFAForSensitive ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: requireMFAForSensitive ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* IP Restrictions */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Access Restrictions
                                </h3>

                                <div
                                    className="flex items-center justify-between rounded-lg p-4"
                                    style={{
                                        backgroundColor: "#f9fafb",
                                        border: "1px solid #e5e7eb",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        <div>
                                            <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                IP Whitelisting
                                            </div>
                                            <div className="text-xs" style={{ color: "#4a5565" }}>
                                                Restrict access to approved IP addresses only
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIpWhitelisting(!ipWhitelisting);
                                            if (!ipWhitelisting) {
                                                showNotification("IP Whitelisting enabled. Configure allowed IPs in Admin Panel.", "info");
                                            }
                                        }}
                                        className="relative h-6 w-11 rounded-full transition-colors"
                                        style={{ backgroundColor: ipWhitelisting ? "#155dfc" : "#d1d5db" }}
                                    >
                                        <span
                                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                            style={{ left: ipWhitelisting ? "22px" : "2px" }}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Audit Logging */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Audit Logging
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {/* Log All User Actions */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Log All User Actions
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Record all user interactions for audit trail
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setLogAllActions(!logAllActions)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: logAllActions ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: logAllActions ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Log Data Exports */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Log Data Exports
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Track all data export activities
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setLogDataExports(!logDataExports)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: logDataExports ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: logDataExports ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>

                                    {/* Log Login Attempts */}
                                    <div
                                        className="flex items-center justify-between rounded-lg p-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <div>
                                                <div className="text-sm" style={{ color: "#0a0a0a" }}>
                                                    Log Login Attempts
                                                </div>
                                                <div className="text-xs" style={{ color: "#4a5565" }}>
                                                    Record successful and failed login attempts
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setLogLoginAttempts(!logLoginAttempts)}
                                            className="relative h-6 w-11 rounded-full transition-colors"
                                            style={{ backgroundColor: logLoginAttempts ? "#155dfc" : "#d1d5db" }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                                style={{ left: logLoginAttempts ? "22px" : "2px" }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Audit Log Retention */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                    Audit Log Retention
                                </h3>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm" style={{ color: "#0a0a0a" }}>
                                        Retention Period
                                    </label>
                                    <select
                                        value={auditRetentionPeriod}
                                        onChange={(e) => setAuditRetentionPeriod(e.target.value)}
                                        className="w-64 appearance-none rounded-lg px-3 py-2 text-sm outline-none"
                                        style={{
                                            border: "1px solid #d1d5dc",
                                            color: "#0a0a0a",
                                            backgroundColor: "white",
                                        }}
                                    >
                                        {auditRetentionOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs" style={{ color: "#4a5565" }}>
                                        FAA requires maintenance records retention for minimum 7 years
                                    </p>
                                </div>
                            </div>

                            {/* Recent Audit Logs */}
                            <div
                                className="flex flex-col gap-4 pt-4"
                                style={{ borderTop: "1px solid #e5e7eb" }}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold" style={{ color: "#0a0a0a" }}>
                                        Recent Audit Logs
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowAuditLogs(!showAuditLogs)}
                                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
                                        style={{
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            color: "#155dfc",
                                        }}
                                    >
                                        {showAuditLogs ? "Hide Logs" : "View Logs"}
                                        <svg
                                            className={`h-4 w-4 transition-transform ${showAuditLogs ? "rotate-180" : ""}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {showAuditLogs && (
                                    <div className="overflow-hidden rounded-lg" style={{ border: "1px solid #e5e7eb" }}>
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr style={{ backgroundColor: "#f9fafb" }}>
                                                    <th className="px-4 py-2 text-left font-medium" style={{ color: "#4a5565" }}>Timestamp</th>
                                                    <th className="px-4 py-2 text-left font-medium" style={{ color: "#4a5565" }}>User</th>
                                                    <th className="px-4 py-2 text-left font-medium" style={{ color: "#4a5565" }}>Action</th>
                                                    <th className="px-4 py-2 text-left font-medium" style={{ color: "#4a5565" }}>Details</th>
                                                    <th className="px-4 py-2 text-left font-medium" style={{ color: "#4a5565" }}>Severity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {auditLogs.map((log) => (
                                                    <tr key={log.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                                                        <td className="px-4 py-2" style={{ color: "#0a0a0a" }}>{log.timestamp}</td>
                                                        <td className="px-4 py-2" style={{ color: "#0a0a0a" }}>{log.user}</td>
                                                        <td className="px-4 py-2" style={{ color: "#0a0a0a" }}>{log.action}</td>
                                                        <td className="px-4 py-2 max-w-[200px] truncate" style={{ color: "#4a5565" }}>{log.details}</td>
                                                        <td className="px-4 py-2">
                                                            <span
                                                                className="rounded-lg px-2 py-1 text-xs"
                                                                style={{
                                                                    backgroundColor: log.severity === "critical" ? "#fee2e2" : log.severity === "warning" ? "#fef3c7" : "#dcfce7",
                                                                    color: log.severity === "critical" ? "#b91c1c" : log.severity === "warning" ? "#b45309" : "#166534",
                                                                }}
                                                            >
                                                                {log.severity}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="flex justify-between items-center px-4 py-3" style={{ backgroundColor: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                                            <span className="text-xs" style={{ color: "#4a5565" }}>Showing 5 most recent logs</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    router.push("/app/admin-panel");
                                                    showNotification("Navigating to Admin Panel for full audit logs...", "info");
                                                }}
                                                className="text-sm"
                                                style={{ color: "#155dfc" }}
                                            >
                                                View All in Admin Panel →
                                            </button>
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
                                    onClick={() => saveSettings("Security & Audit Logs")}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white"
                                    style={{ backgroundColor: "#155dfc" }}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {saving ? "Saving..." : "Save Security Settings"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <PlaceholderPanel title={active} />
                    )}
                </section>
                {changePasswordOpen && (
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
                                    onClick={() => setChangePasswordOpen(false)}
                                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="mt-4 space-y-3">
                                <label className="flex flex-col gap-1 text-sm text-slate-700">
                                    Current Password
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm text-slate-700">
                                    New Password
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm text-slate-700">
                                    Confirm New Password
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                                    />
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
                                    onClick={() => setChangePasswordOpen(false)}
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
                )}
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

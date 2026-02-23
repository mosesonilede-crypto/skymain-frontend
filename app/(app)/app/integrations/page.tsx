"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
    Key, Trash2, Copy, Check, RefreshCw, Database, Upload,
    Link2, AlertTriangle, ChevronDown, ChevronUp, Shield,
    Zap, Clock, CheckCircle2, XCircle, ArrowRight,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

interface ApiKey {
    id: string;
    label: string;
    key_prefix: string;
    allowed_tables: string[];
    is_active: boolean;
    created_by: string;
    created_at: string;
    last_used_at: string | null;
    revoked_at: string | null;
}

interface LogEntry {
    id: string;
    source: string;
    target_table: string;
    record_count: number;
    records_created: number;
    records_updated: number;
    records_failed: number;
    status: string;
    initiated_by: string | null;
    created_at: string;
    duration_ms: number | null;
}

// ─── Tier Badge Component ───────────────────────────────────────

function TierBadge({ tier, active }: { tier: number; active: boolean }) {
    const colors = active
        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
        : "bg-zinc-100 text-zinc-500 border-zinc-300";
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
            Tier {tier} {active ? "• Active" : ""}
        </span>
    );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function IntegrationsPage() {
    useAuth(); // ensure authenticated

    // API Keys
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [keysLoading, setKeysLoading] = useState(true);
    const [newKeyLabel, setNewKeyLabel] = useState("");
    const [newKeyTables, setNewKeyTables] = useState<string[]>([]);
    const [creatingKey, setCreatingKey] = useState(false);
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState(false);

    // Ingestion Log
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const [logLoading, setLogLoading] = useState(true);
    const [logTotal, setLogTotal] = useState(0);

    // UI state
    const [expandedSection, setExpandedSection] = useState<string>("tier2");
    const [showKeyForm, setShowKeyForm] = useState(false);

    // ── Fetch API keys ──────────────────────────────────────────
    const fetchKeys = useCallback(async () => {
        setKeysLoading(true);
        try {
            const res = await fetch("/api/v1/api-keys");
            if (res.ok) {
                const data = await res.json();
                setKeys(data.keys || []);
            }
        } catch { /* ignore */ }
        setKeysLoading(false);
    }, []);

    // ── Fetch ingestion log ─────────────────────────────────────
    const fetchLog = useCallback(async () => {
        setLogLoading(true);
        try {
            const res = await fetch("/api/v1/ingestion-log?limit=20");
            if (res.ok) {
                const data = await res.json();
                setLogEntries(data.entries || []);
                setLogTotal(data.total || 0);
            }
        } catch { /* ignore */ }
        setLogLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            // Fetch keys
            try {
                const res = await fetch("/api/v1/api-keys");
                if (res.ok && !cancelled) {
                    const data = await res.json();
                    setKeys(data.keys || []);
                }
            } catch { /* ignore */ }
            if (!cancelled) setKeysLoading(false);

            // Fetch log
            try {
                const res = await fetch("/api/v1/ingestion-log?limit=20");
                if (res.ok && !cancelled) {
                    const data = await res.json();
                    setLogEntries(data.entries || []);
                    setLogTotal(data.total || 0);
                }
            } catch { /* ignore */ }
            if (!cancelled) setLogLoading(false);
        })();
        return () => { cancelled = true; };
    }, []);

    // ── Create API key ──────────────────────────────────────────
    const createKey = async () => {
        if (!newKeyLabel.trim()) return;
        setCreatingKey(true);
        try {
            const res = await fetch("/api/v1/api-keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    label: newKeyLabel.trim(),
                    allowed_tables: newKeyTables.length > 0 ? newKeyTables : undefined,
                }),
            });
            const data = await res.json();
            if (res.ok && data.key) {
                setRevealedKey(data.key);
                setNewKeyLabel("");
                setNewKeyTables([]);
                setShowKeyForm(false);
                fetchKeys();
            } else {
                alert(data.error || "Failed to create key");
            }
        } catch {
            alert("Failed to create API key");
        }
        setCreatingKey(false);
    };

    // ── Revoke API key ──────────────────────────────────────────
    const revokeKey = async (keyId: string, label: string) => {
        if (!confirm(`Revoke API key "${label}"? This cannot be undone. Any systems using this key will stop working.`)) return;
        try {
            const res = await fetch("/api/v1/api-keys", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key_id: keyId }),
            });
            if (res.ok) {
                fetchKeys();
            }
        } catch { /* ignore */ }
    };

    // ── Copy to clipboard ───────────────────────────────────────
    const copyKey = async (key: string) => {
        await navigator.clipboard.writeText(key);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const toggleTable = (table: string) => {
        setNewKeyTables((prev) =>
            prev.includes(table) ? prev.filter((t) => t !== table) : [...prev, table]
        );
    };

    const allTables = ["component_life", "system_inspections", "discrepancy_reports", "aircraft"];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* ─── Header ──────────────────────────────────── */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Data Integration Hub
                </h1>
                <p className="text-zinc-500 mt-1">
                    Manage how data flows into SkyMaintain — from manual CSV uploads to automated API pipelines.
                </p>
            </div>

            {/* ─── Tier Overview Cards ─────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tier 1 */}
                <div className="border rounded-xl p-5 bg-white dark:bg-zinc-900 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold text-zinc-900 dark:text-white">CSV Import</span>
                        </div>
                        <TierBadge tier={1} active={true} />
                    </div>
                    <p className="text-sm text-zinc-500 mb-4">
                        Manual file upload by admin. Best for initial data load and periodic updates from CMMS exports.
                    </p>
                    <a
                        href="/app/data-import"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        Go to Data Import <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                {/* Tier 2 */}
                <div className="border-2 border-emerald-500 rounded-xl p-5 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-700 ring-2 ring-emerald-200 dark:ring-emerald-800">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-emerald-600" />
                            <span className="font-semibold text-zinc-900 dark:text-white">API Pipeline</span>
                        </div>
                        <TierBadge tier={2} active={true} />
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        Programmatic REST API for automated data push. Generate API keys and let your systems push data directly.
                    </p>
                    <button
                        onClick={() => setExpandedSection(expandedSection === "tier2" ? "" : "tier2")}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                        Manage API Keys {expandedSection === "tier2" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                </div>

                {/* Tier 3 */}
                <div className="border rounded-xl p-5 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Link2 className="h-5 w-5 text-zinc-400" />
                            <span className="font-semibold text-zinc-900 dark:text-white">CMMS / ERP Connectors</span>
                        </div>
                        <TierBadge tier={3} active={false} />
                    </div>
                    <p className="text-sm text-zinc-500 mb-3">
                        Direct connectors to AMOS, SAP PM, CAMP Systems, and more. Bi-directional sync with your maintenance ecosystem.
                    </p>
                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                        <Shield className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800 dark:text-amber-300">
                            <strong>Partnership Required:</strong> Tier 3 connectors must be activated in partnership with the aircraft operator and SkyMaintain. Contact us to start the process.
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Tier 2: API Key Management ─────────────── */}
            {expandedSection === "tier2" && (
                <div className="border rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-700 overflow-hidden">
                    <div className="p-5 border-b dark:border-zinc-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Key className="h-5 w-5" /> API Keys
                                </h2>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Generate API keys for your systems to push data to SkyMaintain programmatically.
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowKeyForm(!showKeyForm); setRevealedKey(null); }}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                            >
                                + New API Key
                            </button>
                        </div>
                    </div>

                    {/* New key revealed */}
                    {revealedKey && (
                        <div className="p-5 bg-emerald-50 dark:bg-emerald-950 border-b dark:border-zinc-700">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-medium text-emerald-900 dark:text-emerald-200">
                                        API key created! Save it now — it won&apos;t be shown again.
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <code className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border rounded font-mono text-sm text-zinc-900 dark:text-zinc-100 select-all">
                                            {revealedKey}
                                        </code>
                                        <button
                                            onClick={() => copyKey(revealedKey)}
                                            className="px-3 py-2 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                            title="Copy to clipboard"
                                        >
                                            {copiedKey ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setRevealedKey(null)}
                                        className="mt-2 text-xs text-zinc-500 hover:text-zinc-700"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create form */}
                    {showKeyForm && !revealedKey && (
                        <div className="p-5 bg-zinc-50 dark:bg-zinc-800 border-b dark:border-zinc-700 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Key Label
                                </label>
                                <input
                                    type="text"
                                    value={newKeyLabel}
                                    onChange={(e) => setNewKeyLabel(e.target.value)}
                                    placeholder='e.g. "Production CMMS Push", "Test Environment"'
                                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-zinc-900 dark:border-zinc-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Table Permissions <span className="text-zinc-400">(empty = all tables)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allTables.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => toggleTable(t)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                                newKeyTables.includes(t)
                                                    ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                                                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={createKey}
                                    disabled={!newKeyLabel.trim() || creatingKey}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
                                >
                                    {creatingKey ? "Creating…" : "Generate Key"}
                                </button>
                                <button
                                    onClick={() => setShowKeyForm(false)}
                                    className="px-4 py-2 border rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Keys list */}
                    <div className="divide-y dark:divide-zinc-700">
                        {keysLoading ? (
                            <div className="p-8 text-center text-zinc-500">Loading API keys…</div>
                        ) : keys.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500">
                                <Key className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                <p>No API keys yet. Create one to start pushing data programmatically.</p>
                            </div>
                        ) : (
                            keys.map((k) => (
                                <div key={k.id} className="p-4 flex items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium text-sm ${k.is_active ? "text-zinc-900 dark:text-white" : "text-zinc-400 line-through"}`}>
                                                {k.label}
                                            </span>
                                            {!k.is_active && (
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Revoked</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                                            <code>{k.key_prefix}…</code>
                                            <span>Created {new Date(k.created_at).toLocaleDateString()}</span>
                                            {k.last_used_at && (
                                                <span>Last used {new Date(k.last_used_at).toLocaleDateString()}</span>
                                            )}
                                            {k.allowed_tables.length > 0 && (
                                                <span className="text-zinc-500">{k.allowed_tables.join(", ")}</span>
                                            )}
                                        </div>
                                    </div>
                                    {k.is_active && (
                                        <button
                                            onClick={() => revokeKey(k.id, k.label)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
                                            title="Revoke key"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* API Usage Guide */}
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-800 border-t dark:border-zinc-700">
                        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Quick Start Guide</h3>
                        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <div>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">1. Push a single record:</p>
                                <pre className="mt-1 p-3 bg-zinc-900 text-green-400 rounded-lg overflow-x-auto text-xs">
{`curl -X POST ${typeof window !== "undefined" ? window.location.origin : "https://www.skymaintain.ai"}/api/v1/ingestion/component_life \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_live_your_key_here" \\
  -d '{
    "aircraft_registration": "5N-FGT",
    "component_name": "Engine #1 - Fan Disk",
    "serial_number": "ENG-FD-001",
    "current_hours": 12500,
    "limit_hours": 25000
  }'`}
                                </pre>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">2. Push a batch:</p>
                                <pre className="mt-1 p-3 bg-zinc-900 text-green-400 rounded-lg overflow-x-auto text-xs">
{`curl -X POST ${typeof window !== "undefined" ? window.location.origin : "https://www.skymaintain.ai"}/api/v1/ingestion/system_inspections \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_live_your_key_here" \\
  -d '{ "records": [
    { "aircraft_registration": "5N-FGT", "system_name": "Engine", "status": "On Track" },
    { "aircraft_registration": "5N-FGT", "system_name": "Hydraulic", "status": "Due Soon" }
  ] }'`}
                                </pre>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">3. View table schema:</p>
                                <pre className="mt-1 p-3 bg-zinc-900 text-green-400 rounded-lg overflow-x-auto text-xs">
{`curl ${typeof window !== "undefined" ? window.location.origin : "https://www.skymaintain.ai"}/api/v1/ingestion/component_life`}
                                </pre>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2">
                                Supports all tables: <code className="text-zinc-600 dark:text-zinc-400">component_life</code>, <code className="text-zinc-600 dark:text-zinc-400">system_inspections</code>, <code className="text-zinc-600 dark:text-zinc-400">discrepancy_reports</code>, <code className="text-zinc-600 dark:text-zinc-400">aircraft</code>.
                                Max 500 records per batch. Rate limited to 120 requests/minute.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Tier 3: Connector Provision ────────────── */}
            {expandedSection === "tier3" && (
                <div className="border rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-700 overflow-hidden">
                    <div className="p-5 border-b dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Link2 className="h-5 w-5" /> CMMS / ERP Connectors
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 rounded-xl border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                                    Operator Partnership Required
                                </h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                                    Tier 3 direct connectors require a formal partnership agreement between the aircraft operator and SkyMaintain.
                                    This ensures data integrity, security standards, and proper authorization for bi-directional system access.
                                </p>
                                <ul className="mt-3 space-y-1 text-sm text-amber-800 dark:text-amber-300">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Operator signs data sharing agreement</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> SkyMaintain configures connector with operator IT</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Validation testing in sandbox environment</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Go-live with monitoring and SLA</li>
                                </ul>
                            </div>
                        </div>

                        <h3 className="font-semibold text-zinc-900 dark:text-white">Available Connector Types</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { type: "cmms", name: "CMMS", desc: "AMOS, CAMP Systems, Ramco, TRAX", icon: <Database className="h-5 w-5" /> },
                                { type: "erp", name: "ERP", desc: "SAP PM, Oracle EAM, IFS", icon: <Database className="h-5 w-5" /> },
                                { type: "flight_ops", name: "Flight Operations", desc: "AIMS, Jeppesen, FlightAware", icon: <Zap className="h-5 w-5" /> },
                                { type: "acms", name: "ACMS / Health Monitoring", desc: "AIRMAN, eFAST, Real-time sensor data", icon: <Zap className="h-5 w-5" /> },
                                { type: "manuals", name: "Technical Publications", desc: "IPC, AMM, SB browser integration", icon: <Database className="h-5 w-5" /> },
                                { type: "iot", name: "IoT / Sensor Platform", desc: "Azure IoT Hub, AWS IoT Core, Custom MQTT", icon: <Zap className="h-5 w-5" /> },
                            ].map((c) => (
                                <div key={c.type} className="flex items-center gap-3 p-4 border rounded-lg dark:border-zinc-700">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                                        {c.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-zinc-900 dark:text-white">{c.name}</p>
                                        <p className="text-xs text-zinc-500">{c.desc}</p>
                                    </div>
                                    <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                        Requires Partnership
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t dark:border-zinc-700">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                To initiate a Tier 3 connector partnership, contact{" "}
                                <a href="mailto:integrations@skymaintain.ai" className="text-blue-600 hover:underline">
                                    integrations@skymaintain.ai
                                </a>{" "}
                                with your organisation name and the connector type you need.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toggle Tier 3 section ────────────────────── */}
            {expandedSection !== "tier3" && (
                <button
                    onClick={() => setExpandedSection("tier3")}
                    className="w-full text-left p-4 border rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-zinc-400" />
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            Tier 3: CMMS / ERP Connectors
                        </span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Partnership Required</span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-zinc-400" />
                </button>
            )}

            {/* ─── Ingestion Activity Log ─────────────────── */}
            <div className="border rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-700 overflow-hidden">
                <div className="p-5 border-b dark:border-zinc-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Clock className="h-5 w-5" /> Ingestion Activity
                        </h2>
                        <p className="text-sm text-zinc-500 mt-0.5">
                            {logTotal} total ingestion events across all tiers
                        </p>
                    </div>
                    <button
                        onClick={fetchLog}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 text-zinc-500 ${logLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {logLoading ? (
                    <div className="p-8 text-center text-zinc-500">Loading activity log…</div>
                ) : logEntries.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p>No ingestion events yet. Import data via CSV or API to see activity here.</p>
                    </div>
                ) : (
                    <div className="divide-y dark:divide-zinc-700">
                        {logEntries.map((entry) => (
                            <div key={entry.id} className="p-4 flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${
                                    entry.status === "success"
                                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600"
                                        : entry.status === "partial"
                                        ? "bg-amber-100 dark:bg-amber-950 text-amber-600"
                                        : "bg-red-100 dark:bg-red-950 text-red-600"
                                }`}>
                                    {entry.status === "success" ? <CheckCircle2 className="h-4 w-4" /> :
                                     entry.status === "partial" ? <AlertTriangle className="h-4 w-4" /> :
                                     <XCircle className="h-4 w-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                            {entry.target_table}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            entry.source === "csv_import"
                                                ? "bg-blue-100 text-blue-700"
                                                : entry.source === "api_push"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-purple-100 text-purple-700"
                                        }`}>
                                            {entry.source === "csv_import" ? "CSV" :
                                             entry.source === "api_push" ? "API" : "Connector"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-400">
                                        <span>{entry.record_count} records</span>
                                        {entry.records_created > 0 && <span className="text-emerald-500">+{entry.records_created} created</span>}
                                        {entry.records_updated > 0 && <span className="text-blue-500">{entry.records_updated} updated</span>}
                                        {entry.records_failed > 0 && <span className="text-red-500">{entry.records_failed} failed</span>}
                                        {entry.duration_ms != null && <span>{entry.duration_ms}ms</span>}
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-400">
                                    {new Date(entry.created_at).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

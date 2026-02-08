/**
 * Session Timeout Manager
 * 
 * Monitors user activity and automatically logs out after the configured
 * period of inactivity. Works with the session timeout setting from Settings.
 */

"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

// Storage keys
const SESSION_TIMEOUT_KEY = "skymaintain-settings";
const LAST_ACTIVITY_KEY = "skymaintain-last-activity";

// Default timeout in minutes
const DEFAULT_TIMEOUT_MINUTES = 30;

// Warning before logout (60 seconds)
const WARNING_BEFORE_LOGOUT_MS = 60 * 1000;

// Activity check interval (10 seconds)
const CHECK_INTERVAL_MS = 10 * 1000;

/**
 * Get the configured session timeout from settings
 */
function getSessionTimeoutMinutes(): number {
    if (typeof window === "undefined") return DEFAULT_TIMEOUT_MINUTES;

    try {
        const settingsStr = localStorage.getItem(SESSION_TIMEOUT_KEY);
        if (settingsStr) {
            const settings = JSON.parse(settingsStr);
            const timeout = parseInt(settings.sessionTimeout, 10);
            if (!isNaN(timeout) && timeout > 0) {
                return timeout;
            }
        }
    } catch (e) {
        console.error("Failed to parse session timeout settings", e);
    }

    return DEFAULT_TIMEOUT_MINUTES;
}

/**
 * Update last activity timestamp
 */
function updateLastActivity(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

/**
 * Get last activity timestamp
 */
function getLastActivity(): number {
    if (typeof window === "undefined") return Date.now();

    const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (stored) {
        const timestamp = parseInt(stored, 10);
        if (!isNaN(timestamp)) {
            return timestamp;
        }
    }

    // If no stored activity, set current time
    updateLastActivity();
    return Date.now();
}

/**
 * Clear session data on logout
 */
export function clearSessionData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LAST_ACTIVITY_KEY);
}

interface SessionTimeoutState {
    isWarningVisible: boolean;
    remainingSeconds: number;
    extendSession: () => void;
}

/**
 * Hook to manage session timeout
 */
export function useSessionTimeout(): SessionTimeoutState {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isWarningVisible, setIsWarningVisible] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(60);
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const warningIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Extend session by updating last activity
    const extendSession = useCallback(() => {
        updateLastActivity();
        setIsWarningVisible(false);
        setRemainingSeconds(60);
    }, []);

    // Handle logout due to timeout
    const handleTimeoutLogout = useCallback(() => {
        setIsWarningVisible(false);
        clearSessionData();
        logout();
        router.push("/?session=expired");
    }, [logout, router]);

    // Activity event handler
    const handleActivity = useCallback(() => {
        if (!isWarningVisible) {
            updateLastActivity();
        }
    }, [isWarningVisible]);

    // Check session timeout
    const checkTimeout = useCallback(() => {
        if (!isAuthenticated) return;

        const timeoutMinutes = getSessionTimeoutMinutes();
        const timeoutMs = timeoutMinutes * 60 * 1000;
        const lastActivity = getLastActivity();
        const now = Date.now();
        const elapsed = now - lastActivity;
        const remaining = timeoutMs - elapsed;

        if (remaining <= 0) {
            // Session expired - logout immediately
            handleTimeoutLogout();
        } else if (remaining <= WARNING_BEFORE_LOGOUT_MS) {
            // Show warning
            setIsWarningVisible(true);
            setRemainingSeconds(Math.ceil(remaining / 1000));
        } else {
            setIsWarningVisible(false);
        }
    }, [isAuthenticated, handleTimeoutLogout]);

    // Set up activity listeners
    useEffect(() => {
        if (!isAuthenticated || typeof window === "undefined") return;

        // Activity events to track
        const events = [
            "mousedown",
            "mousemove",
            "keydown",
            "scroll",
            "touchstart",
            "click",
            "focus",
        ];

        // Throttle activity updates to prevent excessive writes
        let lastUpdate = 0;
        const throttledActivity = () => {
            const now = Date.now();
            if (now - lastUpdate > 1000) { // Max 1 update per second
                lastUpdate = now;
                handleActivity();
            }
        };

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, throttledActivity, { passive: true });
        });

        // Also listen for visibility change (when user switches tabs)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkTimeout();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Initialize last activity if not set
        if (!localStorage.getItem(LAST_ACTIVITY_KEY)) {
            updateLastActivity();
        }

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, throttledActivity);
            });
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isAuthenticated, handleActivity, checkTimeout]);

    // Set up timeout check interval
    useEffect(() => {
        if (!isAuthenticated) {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }
            return;
        }

        // Defer initial check to avoid setState during render
        const initialCheckTimeout = setTimeout(() => {
            checkTimeout();
        }, 100);

        // Set up periodic check
        checkIntervalRef.current = setInterval(checkTimeout, CHECK_INTERVAL_MS);

        return () => {
            clearTimeout(initialCheckTimeout);
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }
        };
    }, [isAuthenticated, checkTimeout]);

    // Countdown timer when warning is visible
    useEffect(() => {
        if (!isWarningVisible) {
            if (warningIntervalRef.current) {
                clearInterval(warningIntervalRef.current);
                warningIntervalRef.current = null;
            }
            return;
        }

        warningIntervalRef.current = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    handleTimeoutLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (warningIntervalRef.current) {
                clearInterval(warningIntervalRef.current);
                warningIntervalRef.current = null;
            }
        };
    }, [isWarningVisible, handleTimeoutLogout]);

    return {
        isWarningVisible,
        remainingSeconds,
        extendSession,
    };
}

/**
 * Session Timeout Warning Modal Component
 */
export function SessionTimeoutWarning({
    isVisible,
    remainingSeconds,
    onExtend,
}: {
    isVisible: boolean;
    remainingSeconds: number;
    onExtend: () => void;
}) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                    {/* Warning Icon */}
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h2 className="mb-2 text-xl font-semibold text-slate-900">
                        Session Expiring Soon
                    </h2>

                    <p className="mb-4 text-sm text-slate-600">
                        Your session will expire due to inactivity. You will be automatically logged out in:
                    </p>

                    {/* Countdown */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <span className="text-3xl font-bold text-red-600">
                            {remainingSeconds}
                        </span>
                    </div>

                    <p className="mb-6 text-xs text-slate-500">
                        Click the button below to continue your session.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex w-full gap-3">
                        <button
                            type="button"
                            onClick={onExtend}
                            className="flex-1 rounded-lg bg-gradient-to-r from-[#155dfc] to-[#1447e6] px-4 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                        >
                            Continue Session
                        </button>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        This security feature protects your sensitive aviation data.
                    </p>
                </div>
            </div>
        </div>
    );
}

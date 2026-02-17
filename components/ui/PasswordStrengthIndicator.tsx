"use client";

import React, { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
    password: string;
    showGuidelines?: boolean;
}

interface PasswordCheck {
    label: string;
    passed: boolean;
}

export function calculatePasswordStrength(password: string): {
    score: number;
    level: "weak" | "moderate" | "strong";
    checks: PasswordCheck[];
} {
    const checks: PasswordCheck[] = [
        {
            label: "At least 8 characters",
            passed: password.length >= 8,
        },
        {
            label: "Contains uppercase letter (A-Z)",
            passed: /[A-Z]/.test(password),
        },
        {
            label: "Contains lowercase letter (a-z)",
            passed: /[a-z]/.test(password),
        },
        {
            label: "Contains number (0-9)",
            passed: /[0-9]/.test(password),
        },
        {
            label: "Contains special character (!@#$%^&*)",
            passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = passedCount;

    let level: "weak" | "moderate" | "strong";
    if (passedCount <= 2) {
        level = "weak";
    } else if (passedCount <= 4) {
        level = "moderate";
    } else {
        level = "strong";
    }

    return { score, level, checks };
}

export function PasswordStrengthIndicator({
    password,
    showGuidelines = true,
}: PasswordStrengthIndicatorProps) {
    const { level, checks } = useMemo(
        () => calculatePasswordStrength(password),
        [password]
    );

    if (!password) {
        return showGuidelines ? (
            <div className="mt-2 text-xs text-gray-500">
                <p className="font-medium mb-1">Password requirements:</p>
                <ul className="list-disc list-inside space-y-0.5">
                    <li>At least 8 characters</li>
                    <li>Uppercase letter (A-Z)</li>
                    <li>Lowercase letter (a-z)</li>
                    <li>Number (0-9)</li>
                    <li>Special character (!@#$%^&*)</li>
                </ul>
            </div>
        ) : null;
    }

    const levelColors = {
        weak: {
            bar: "bg-red-500",
            text: "text-red-600",
            label: "Weak",
        },
        moderate: {
            bar: "bg-yellow-500",
            text: "text-yellow-600",
            label: "Moderate",
        },
        strong: {
            bar: "bg-green-500",
            text: "text-green-600",
            label: "Strong",
        },
    };

    const { bar, text, label } = levelColors[level];

    // Calculate width percentage based on checks passed
    const passedCount = checks.filter((c) => c.passed).length;
    const widthPercent = (passedCount / checks.length) * 100;

    return (
        <div className="mt-2 space-y-2">
            {/* Strength bar */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${bar}`}
                        style={{ width: `${widthPercent}%` }}
                    />
                </div>
                <span className={`text-xs font-medium ${text}`}>{label}</span>
            </div>

            {/* Requirements checklist */}
            {showGuidelines && (
                <ul className="text-xs space-y-0.5">
                    {checks.map((check, index) => (
                        <li
                            key={index}
                            className={`flex items-center gap-1.5 ${check.passed ? "text-green-600" : "text-gray-500"
                                }`}
                        >
                            {check.passed ? (
                                <svg
                                    className="w-3 h-3 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-3 h-3 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <circle cx="10" cy="10" r="3" />
                                </svg>
                            )}
                            <span>{check.label}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

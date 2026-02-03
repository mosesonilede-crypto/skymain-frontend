"use client";

import { useEffect, useState } from "react";
import type { ToastProps } from "@/src/types";

export default function Toast({
    message,
    type = "info",
    duration = 3000,
    onClose,
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const colors = {
        success: "bg-green-50 border-green-500 text-green-800",
        error: "bg-red-50 border-red-500 text-red-800",
        info: "bg-blue-50 border-blue-500 text-blue-800",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    };

    const icons = {
        success: "✓",
        error: "✗",
        info: "ℹ",
        warning: "⚠",
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg border-l-4 shadow-lg ${colors[type]} animate-slide-in`}
        >
            <div className="flex items-start">
                <span className="text-lg mr-3">{icons[type]}</span>
                <p className="text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

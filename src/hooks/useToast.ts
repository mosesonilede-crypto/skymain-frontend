// src/hooks/useToast.ts
"use client";

import { useState, useCallback } from "react";
import type { ToastType } from "@/src/types";

interface ToastState {
    show: boolean;
    message: string;
    type: ToastType;
}

export function useToast() {
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    });

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        setToast({ show: true, message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, []);

    return {
        toast,
        showToast,
        hideToast,
        success: useCallback((message: string) => showToast(message, "success"), [showToast]),
        error: useCallback((message: string) => showToast(message, "error"), [showToast]),
        info: useCallback((message: string) => showToast(message, "info"), [showToast]),
        warning: useCallback((message: string) => showToast(message, "warning"), [showToast]),
    };
}

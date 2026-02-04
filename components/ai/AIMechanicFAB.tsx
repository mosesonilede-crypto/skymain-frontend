"use client";

import { useState } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export default function AIMechanicFAB({
    className,
    bottomOffset = 84,
    rightOffset = 24,
}: {
    className?: string;
    bottomOffset?: number;
    rightOffset?: number;
}) {
    const [active, setActive] = useState(false);

    return (
        <div
            className={cx("fixed z-[61]", className)}
            style={{
                right: `${Math.max(rightOffset, 16)}px`,
                bottom: `${bottomOffset}px`
            }}
        >
            <button
                type="button"
                className={cx(
                    "inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg transition-all duration-200",
                    active
                        ? "bg-slate-900 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 active:scale-95"
                )}
                onClick={() => setActive((v) => !v)}
                title="SkyMaintain AI Mechanic's Assistant"
                aria-label="Open SkyMaintain AI Mechanic's Assistant"
            >
                <span aria-hidden="true">⚙️</span>
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">AI</span>
            </button>
        </div>
    );
}

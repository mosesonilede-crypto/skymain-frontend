"use client";

import { useState } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export default function AIMechanicFAB({
    className,
    bottomOffset = 84,
    rightOffset = 24,
    onClick,
}: {
    className?: string;
    bottomOffset?: number;
    rightOffset?: number;
    onClick?: () => void;
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
                onClick={() => {
                    setActive((v) => !v);
                    if (onClick) onClick();
                }}
                title="SkyMaintain AI Assistant"
                aria-label="Open SkyMaintain AI Assistant"
            >
                <span aria-hidden="true" className="flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C9.238 3 7 5.238 7 8v1H5.5A2.5 2.5 0 0 0 3 11.5v5A2.5 2.5 0 0 0 5.5 19H18.5A2.5 2.5 0 0 0 21 16.5v-5A2.5 2.5 0 0 0 18.5 9H17V8c0-2.762-2.238-5-5-5Z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="9" cy="13.5" r="1.2" fill="currentColor" />
                        <circle cx="15" cy="13.5" r="1.2" fill="currentColor" />
                        <path d="M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </span>
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">AI</span>
            </button>
        </div>
    );
}

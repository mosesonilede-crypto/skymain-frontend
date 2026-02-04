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
            style={{ right: `${rightOffset}px`, bottom: `${bottomOffset}px` }}
        >
            <button
                type="button"
                className={cx(
                    "inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg",
                    active
                        ? "bg-slate-900 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-500"
                )}
                onClick={() => setActive((v) => !v)}
                title="SkyMaintain AI Mechanic's Assistant"
                aria-label="SkyMaintain AI Mechanic's Assistant"
            >
                <span aria-hidden="true">⚙️</span>
                AI Assistant
            </button>
        </div>
    );
}

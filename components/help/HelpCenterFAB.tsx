"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
    ASK_COMMUNITY,
    CONTACT_SUPPORT,
    HELP_CENTER,
    KEYBOARD_LAYOUT,
    LANGUAGE,
    RELEASE_NOTES,
    REPORT_ABUSE,
    SUPPORT_FORUM,
    YOUTUBE,
} from "@/lib/routes";

type Item = {
    label: string;
    href: string;
    newTab?: boolean;
};

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function useEscapeClose(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);
}

function useOutsideClickClose(
    isOpen: boolean,
    anchorRef: React.RefObject<HTMLElement | null>,
    panelRef: React.RefObject<HTMLElement | null>,
    onClose: () => void
) {
    useEffect(() => {
        if (!isOpen) return;

        const onPointerDown = (e: PointerEvent) => {
            const t = e.target as Node | null;
            const anchor = anchorRef.current;
            const panel = panelRef.current;
            if (!t || !anchor || !panel) return;

            if (anchor.contains(t)) return;
            if (panel.contains(t)) return;

            onClose();
        };

        window.addEventListener("pointerdown", onPointerDown, { capture: true });
        return () => window.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
    }, [isOpen, anchorRef, panelRef, onClose]);
}

function MenuLink({ item, onAnyAction }: { item: Item; onAnyAction: () => void }) {
    const cls =
        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30";

    return (
        <Link
            href={item.href}
            className={cls}
            onClick={onAnyAction}
            {...(item.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
            {item.label}
        </Link>
    );
}

export default function HelpCenterFAB({
    className,
    bottomOffset = 24,
    rightOffset = 24,
}: {
    className?: string;
    bottomOffset?: number;
    rightOffset?: number;
}) {
    const [open, setOpen] = useState(false);
    const btnId = useId();
    const panelId = useMemo(() => `help-panel-${btnId}`, [btnId]);

    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const close = () => setOpen(false);
    const toggle = () => setOpen((v) => !v);

    useEscapeClose(open, close);
    useOutsideClickClose(open, anchorRef, panelRef, close);

    const primary: Item[] = [
        { label: "Help Center", href: HELP_CENTER },
        { label: "Support Forum", href: SUPPORT_FORUM },
        { label: "YouTube videos", href: YOUTUBE },
        { label: "Release notes", href: RELEASE_NOTES },
        { label: "Legal summary", href: "/terms" },
    ];

    const community: Item[] = [
        { label: "Ask the community", href: ASK_COMMUNITY },
        { label: "Contact support", href: CONTACT_SUPPORT },
        { label: "Report abuse", href: REPORT_ABUSE },
    ];

    const settings: Item[] = [
        { label: "Change keyboard layout…", href: KEYBOARD_LAYOUT },
        { label: "Change language…", href: LANGUAGE },
    ];

    return (
        <div
            className={cx("fixed z-[60]", className)}
            style={{ right: `${rightOffset}px`, bottom: `${bottomOffset}px` }}
            aria-label="Help Center"
        >
            {open ? (
                <div
                    ref={panelRef}
                    id={panelId}
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby={`${panelId}-title`}
                    className="mb-3 w-[260px] rounded-2xl bg-slate-950 p-3 shadow-xl ring-1 ring-white/10"
                >
                    <div id={`${panelId}-title`} className="sr-only">
                        Help Center
                    </div>

                    <div className="space-y-1">
                        {primary.map((item) => (
                            <MenuLink key={item.label} item={item} onAnyAction={close} />
                        ))}
                    </div>

                    <div className="my-2 h-px bg-white/10" />

                    <div className="space-y-1">
                        {community.map((item) => (
                            <MenuLink key={item.label} item={item} onAnyAction={close} />
                        ))}
                    </div>

                    <div className="my-2 h-px bg-white/10" />

                    <div className="space-y-1">
                        {settings.map((item) => (
                            <MenuLink key={item.label} item={item} onAnyAction={close} />
                        ))}
                    </div>
                </div>
            ) : null}

            <button
                ref={anchorRef}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={toggle}
                className={cx(
                    "h-11 w-11 rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-slate-200",
                    "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
                )}
                title="Help"
            >
                <span className="sr-only">Help</span>
                <span aria-hidden="true" className="text-lg font-bold">
                    ?
                </span>
            </button>
        </div>
    );
}

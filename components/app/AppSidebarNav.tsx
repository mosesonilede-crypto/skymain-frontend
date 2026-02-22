"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type AppNavItem = {
    href?: string;
    onClick?: () => void;
    label: string;
    icon: ReactNode;
    tall?: boolean;
    badgeLabel?: string;
    disabled?: boolean;
    disabledReason?: string;
};

export default function AppSidebarNav({ items, onNavigate }: { items: AppNavItem[]; onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2 pl-4 pr-8 pt-4">
            {items.map((item, index) => {
                const isActive = item.href ? pathname === item.href : false;
                const className = `flex gap-3 rounded-[10px] pl-4 pr-3 text-[16px] ${isActive ? "bg-[#eff6ff] text-[#1447e6]" : "text-[#364153]"
                    } ${item.tall ? "h-[72px] items-center" : "h-[48px] items-center"} ${item.disabled ? "opacity-55 cursor-not-allowed" : ""}`;
                const content = (
                    <>
                        <span className="flex h-5 w-5 items-center justify-center">
                            {item.icon}
                        </span>
                        <span className={item.tall ? "leading-6" : ""}>{item.label}</span>
                        {item.badgeLabel ? (
                            <span className="ml-auto inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                                {item.badgeLabel}
                            </span>
                        ) : null}
                    </>
                );

                if (!item.href) {
                    return (
                        <button
                            key={`${item.label}-${index}`}
                            type="button"
                            disabled={item.disabled}
                            title={item.disabledReason}
                            onClick={() => {
                                if (item.disabled) return;
                                item.onClick?.();
                                onNavigate?.();
                            }}
                            className={className}
                        >
                            {content}
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.disabled ? "#" : item.href}
                        aria-disabled={item.disabled ? "true" : undefined}
                        title={item.disabledReason}
                        onClick={(event) => {
                            if (item.disabled) {
                                event.preventDefault();
                                return;
                            }
                            onNavigate?.();
                        }}
                        className={className}
                    >
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type AppNavItem = {
    href: string;
    label: string;
    icon: ReactNode;
    tall?: boolean;
};

export default function AppSidebarNav({ items, onNavigate }: { items: AppNavItem[]; onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2 pl-4 pr-8 pt-4">
            {items.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={`flex gap-3 rounded-[10px] pl-4 pr-3 text-[16px] ${isActive ? "bg-[#eff6ff] text-[#1447e6]" : "text-[#364153]"
                            } ${item.tall ? "h-[72px] items-center" : "h-[48px] items-center"}`}
                    >
                        <span className="flex h-5 w-5 items-center justify-center">
                            {item.icon}
                        </span>
                        <span className={item.tall ? "leading-6" : ""}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

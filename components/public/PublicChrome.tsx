/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PublicHeader from "@/components/public/PublicHeader";

const footerIcon = "https://www.figma.com/api/mcp/asset/031aef08-7a5b-463c-adda-e9b5a01e356d";

export default function PublicChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideChrome = pathname === "/get-started";

    return (
        <div className="min-h-dvh bg-white text-slate-900">
            {hideChrome ? null : <PublicHeader />}

            <main>{children}</main>

            {hideChrome ? null : (
                <footer className="bg-slate-900">
                    <div className="mx-auto flex max-w-[1084px] flex-col items-center gap-4 px-8 py-10 text-center">
                        <div className="flex items-center gap-2">
                            <img src={footerIcon} alt="" className="h-8 w-8" />
                            <span className="text-2xl font-bold text-white">SkyMaintain</span>
                        </div>
                        <p className="text-base text-slate-300">
                            Enterprise AI for regulated aircraft maintenance operations.
                        </p>
                        <p className="text-sm text-slate-400">Built for compliance. Designed for accountability.</p>
                    </div>
                    <div className="border-t border-slate-800">
                        <div className="mx-auto flex max-w-[1084px] flex-col items-center gap-6 px-8 py-8 text-sm text-slate-400 md:flex-row md:justify-center">
                            <Link href="/platform" className="hover:text-slate-200">
                                Platform
                            </Link>
                            <Link href="/platform-features" className="hover:text-slate-200">
                                Platform Features
                            </Link>
                            <Link href="/enterprise" className="hover:text-slate-200">
                                Enterprise
                            </Link>
                            <Link href="/privacy" className="hover:text-slate-200">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-slate-200">
                                Terms of Service
                            </Link>
                            <Link href="/compliance" className="hover:text-slate-200">
                                Compliance
                            </Link>
                            <Link href="/security" className="hover:text-slate-200">
                                Security
                            </Link>
                            <Link href="/contact" className="hover:text-slate-200">
                                Contact
                            </Link>
                        </div>
                        <div className="pb-8 text-center text-xs text-slate-500">
                            © 2026 SkyMaintain. All rights reserved.
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

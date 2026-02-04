/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const logoImage = "https://www.figma.com/api/mcp/asset/c03d14cf-e548-404a-a66c-76e7da02cc37";

export default function PublicChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideChrome = pathname === "/get-started" || pathname === "/";

    return (
        <div className="min-h-dvh bg-white text-slate-900">
            {hideChrome ? null : (
                <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex max-w-[1148px] items-center justify-between px-8 py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <img src={logoImage} alt="" className="h-8 w-12 object-cover" />
                            <span className="text-xl font-bold text-slate-900">SkyMaintain</span>
                        </Link>

                        <nav className="hidden items-center gap-6 md:flex">
                            <Link href="/platform-features" className="text-base text-slate-600 hover:text-slate-900">
                                Platform
                            </Link>
                            <Link href="/compliance" className="text-base text-slate-600 hover:text-slate-900">
                                Compliance
                            </Link>
                            <Link href="/security" className="text-base text-slate-600 hover:text-slate-900">
                                Security
                            </Link>
                            <Link href="/contact" className="text-base text-slate-600 hover:text-slate-900">
                                Contact
                            </Link>
                            <Link href="/signin" className="text-sm text-slate-600 hover:text-slate-900">
                                Sign In
                            </Link>
                            <Link
                                href="/contact?intent=demo"
                                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                            >
                                Request Demo
                            </Link>
                        </nav>
                    </div>
                </header>
            )}

            <main>{children}</main>

            {hideChrome ? null : (
                <footer className="bg-slate-900">
                    <div className="mx-auto flex max-w-[1084px] flex-col items-center gap-4 px-8 py-10 text-center">
                        <div className="flex items-center gap-2">
                            <img src={logoImage} alt="" className="h-8 w-12 object-cover" />
                            <span className="text-2xl font-bold text-white">SkyMaintain</span>
                        </div>
                        <p className="text-base text-slate-300">
                            Enterprise AI for regulated aircraft maintenance operations.
                        </p>
                        <p className="text-sm text-slate-400">Built for compliance. Designed for accountability.</p>
                    </div>
                    <div className="border-t border-slate-800">
                        <div className="mx-auto flex max-w-[1084px] flex-col items-center gap-6 px-8 py-8 text-sm text-slate-400 md:flex-row md:justify-center">
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


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane } from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";

export default function PublicChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideChrome = pathname === "/get-started" || pathname === "/partnerships";

    return (
        <div className="min-h-dvh bg-white text-slate-900">
            {hideChrome ? null : <PublicHeader />}

            <main>{children}</main>

            {hideChrome ? null : (
                <footer className="bg-[#101828] py-12">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#155dfc]">
                                        <Plane className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-white">SkyMaintain</span>
                                </div>
                                <p className="mt-4 text-sm text-[#99a1af]">
                                    AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-4 font-bold text-white">Product</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/platform-features" className="text-[#d1d5dc] hover:text-white">Features</Link></li>
                                    <li><Link href="/pricing" className="text-[#d1d5dc] hover:text-white">Pricing</Link></li>
                                    <li><Link href="/security" className="text-[#d1d5dc] hover:text-white">Security</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 font-bold text-white">Company</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/about" className="text-[#d1d5dc] hover:text-white">About Us</Link></li>
                                    <li><Link href="/careers" className="text-[#d1d5dc] hover:text-white">Careers</Link></li>
                                    <li><Link href="/contact" className="text-[#d1d5dc] hover:text-white">Contact</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 font-bold text-white">Legal</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/privacy" className="text-[#d1d5dc] hover:text-white">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="text-[#d1d5dc] hover:text-white">Terms of Service</Link></li>
                                    <li><Link href="/compliance" className="text-[#d1d5dc] hover:text-white">Compliance</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-[#1e2939] pt-8 text-center">
                            <p className="text-sm text-[#d1d5dc]">
                                © 2026 <span className="text-[#51a2ff]">SkyMaintain</span>. All Rights Reserved.
                            </p>
                            <p className="mt-2 text-xs text-[#6a7282]">
                                SkyMaintain is a product of EncycloAMTs LLC.
                            </p>
                            <p className="mt-1 text-xs text-[#6a7282]">
                                A Regulatory-Compliant Architecture for AI-Assisted Aircraft Maintenance Decision Support
                            </p>
                            <p className="mt-4 text-xs text-[#6a7282]">
                                <strong>Partner Disclosure:</strong> SkyMaintain displays sponsored partner content. Sponsorship does not influence AI responses, maintenance recommendations, or compliance assessments.
                            </p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

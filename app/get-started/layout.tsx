import type { Metadata } from "next";
import PublicHeader from "@/components/public/PublicHeader";

export const metadata: Metadata = {
    title: "Get Started | SkyMaintain",
    description: "Start your free trial with SkyMaintain - Enterprise AI for regulated aircraft maintenance operations.",
};

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-white text-slate-900">
            <PublicHeader />
            <main>{children}</main>
        </div>
    );
}

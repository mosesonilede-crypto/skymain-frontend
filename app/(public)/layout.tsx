import type { Metadata } from "next";
import PublicChrome from "@/components/public/PublicChrome";

export const metadata: Metadata = {
    title: "SkyMaintain",
    description: "Enterprise AI for regulated aircraft maintenance operations.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <PublicChrome>{children}</PublicChrome>
    );
}

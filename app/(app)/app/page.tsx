import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SkyMaintain — App",
};

export default function AppEntryPage() {
    // Redirect to dashboard as the default landing page within the app
    redirect("/app/dashboard");
}

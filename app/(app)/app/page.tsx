import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SkyMaintain — App",
};

export default function AppEntryPage() {
    // Redirect to welcome as the first page after authentication
    redirect("/app/welcome");
}

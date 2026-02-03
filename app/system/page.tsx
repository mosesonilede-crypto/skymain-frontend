// app/system/page.tsx
import { getMe } from "@/src/lib/api";
import { redirect } from "next/navigation";
import SystemClient from "./SystemClient";

export default async function SystemPage() {
    try {
        const user = await getMe();

        // Only admin can access system monitoring
        if (user.role !== "admin") {
            redirect("/dashboard");
        }

        return <SystemClient user={user} />;
    } catch {
        redirect("/login");
    }
}

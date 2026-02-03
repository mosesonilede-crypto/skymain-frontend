import { redirect } from "next/navigation";
import { getMe } from "@/src/lib/api";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
    try {
        const user = await getMe();

        // Only admins can access this page
        if (user.role !== "admin") {
            redirect("/dashboard");
        }

        return <AdminClient user={user} />;
    } catch (error) {
        redirect("/login");
    }
}

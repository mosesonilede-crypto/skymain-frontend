import { redirect } from "next/navigation";
import { getMe } from "@/src/lib/api";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    try {
        const user = await getMe();
        return <ProfileClient user={user} />;
    } catch (error) {
        redirect("/login");
    }
}

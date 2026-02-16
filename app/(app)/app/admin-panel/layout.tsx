import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRoles={["admin", "super_admin"]} redirectTo="/app/welcome">
            {children}
        </ProtectedRoute>
    );
}

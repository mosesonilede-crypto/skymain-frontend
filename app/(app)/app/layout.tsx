import AppShellClient from "@/components/app/AppShellClient";
import { AircraftProvider } from "@/lib/AircraftContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AircraftProvider>
            <AppShellClient>{children}</AppShellClient>
        </AircraftProvider>
    );
}

import AppShellClient from "@/components/app/AppShellClient";
import { AircraftProvider } from "@/lib/AircraftContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppStateProvider } from "@/lib/AppStateContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const dataMode = (process.env.NEXT_PUBLIC_DATA_MODE || "live").toLowerCase();
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();

    if ((dataMode === "live" || dataMode === "hybrid") && !apiBaseUrl) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
                <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-xl font-semibold">SkyMaintain setup required</h1>
                    <p className="mt-3 text-sm text-slate-600">
                        Live endpoints are not configured. Set `NEXT_PUBLIC_API_BASE_URL` and redeploy to
                        enable app access.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <AircraftProvider>
                <AppStateProvider>
                    <AppShellClient>{children}</AppShellClient>
                </AppStateProvider>
            </AircraftProvider>
        </ProtectedRoute>
    );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SkyMaintain — App",
};

export default function AppEntryZeroStatePage() {
    return (
        <main className="min-h-[calc(100vh-0px)] px-6 py-10">
            <div className="mx-auto w-full max-w-5xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        SkyMaintain v1.0
                    </h1>

                    <p className="mt-3 text-base text-slate-600">
                        Select an option from the left sidebar to view your aircraft maintenance data securely.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 h-9 w-9 rounded-lg bg-white shadow-sm ring-1 ring-slate-200" />
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Secure by Default</div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Sensitive data is hidden until explicitly requested.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 h-9 w-9 rounded-lg bg-white shadow-sm ring-1 ring-slate-200" />
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">View on Demand</div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Access operational information only when you need it.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900">Session context</div>
                        <div className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                            <div>
                                <span className="font-medium text-slate-800">Tenant:</span>{" "}
                                SkyWings Airlines
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Role:</span>{" "}
                                Fleet Manager
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Privacy:</span>{" "}
                                Secure-by-default mode
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Build:</span>{" "}
                                v1.0
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

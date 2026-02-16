"use client";

import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body>
                <div style={{
                    display: "flex",
                    minHeight: "100vh",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    padding: "24px",
                    textAlign: "center",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                }}>
                    <div style={{ maxWidth: "400px" }}>
                        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                            Critical Error
                        </h1>
                        <p style={{ marginTop: "12px", color: "#64748b" }}>
                            A critical error occurred. Please refresh the page or try again later.
                        </p>

                        {error.digest && (
                            <p style={{ marginTop: "8px", fontSize: "12px", color: "#94a3b8" }}>
                                Error ID: {error.digest}
                            </p>
                        )}

                        <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center" }}>
                            <button
                                onClick={reset}
                                style={{
                                    backgroundColor: "#2563eb",
                                    color: "#fff",
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    border: "none",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Try Again
                            </button>
                            <Link
                                href="/"
                                style={{
                                    backgroundColor: "#fff",
                                    color: "#334155",
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                }}
                            >
                                Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}

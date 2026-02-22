function getDataMode(): "mock" | "live" | "hybrid" {
    const mode = (process.env.NEXT_PUBLIC_DATA_MODE || "live").toLowerCase().trim();
    if (mode === "mock" || mode === "hybrid") return mode;
    return "live";
}

export function allowMockFallback(): boolean {
    const mode = getDataMode();
    if (mode === "mock") return true;
    if (mode === "live") return false;

    const flag = (process.env.ALLOW_MOCK_FALLBACK || "").toLowerCase().trim();
    return flag === "true";
}

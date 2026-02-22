export function allowMockFallback(): boolean {
    const flag = (process.env.ALLOW_MOCK_FALLBACK || "").toLowerCase().trim();
    if (flag === "true") return true;
    return process.env.NODE_ENV !== "production";
}

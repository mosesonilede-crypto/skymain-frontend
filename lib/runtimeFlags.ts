export function allowMockFallback(): boolean {
    const flag = (process.env.ALLOW_MOCK_FALLBACK || "").toLowerCase().trim();
    return flag === "true";
}

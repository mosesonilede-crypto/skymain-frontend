export function allowMockFallback(): boolean {
    if (process.env.NODE_ENV === "production") return false;
    const flag = (process.env.ALLOW_MOCK_FALLBACK || "").toLowerCase().trim();
    return flag === "true";
}

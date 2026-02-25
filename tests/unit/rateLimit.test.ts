import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests within limit", () => {
    const result = checkRateLimit("test-user", RATE_LIMITS.api);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
  });

  it("blocks when limit exceeded", () => {
    const config = { windowMs: 60000, maxRequests: 3 };
    checkRateLimit("user-a", config);
    checkRateLimit("user-a", config);
    checkRateLimit("user-a", config);
    const result = checkRateLimit("user-a", config);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    const config = { windowMs: 1000, maxRequests: 1 };
    checkRateLimit("user-b", config);
    const blocked = checkRateLimit("user-b", config);
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(1100);
    const afterReset = checkRateLimit("user-b", config);
    expect(afterReset.allowed).toBe(true);
  });

  it("generates correct rate limit headers", () => {
    const result = checkRateLimit("user-c", RATE_LIMITS.auth);
    const headers = getRateLimitHeaders(result, RATE_LIMITS.auth);
    expect(headers["X-RateLimit-Limit"]).toBe("10");
    expect(Number(headers["X-RateLimit-Remaining"])).toBe(9);
  });
});

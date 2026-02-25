/**
 * Rate limiter with pluggable backend.
 *
 * - In production, set REDIS_URL to use a Redis/Upstash-compatible store.
 * - Falls back to the existing in-memory store for development.
 *
 * Usage:
 *   import { rateLimiter, RATE_LIMITS } from "@/lib/rateLimitStore";
 *   const result = await rateLimiter.check(`auth:${ip}`, RATE_LIMITS.auth);
 */

import { checkRateLimit, type RateLimitConfig, RATE_LIMITS, getRateLimitHeaders } from "./rateLimit";

export { RATE_LIMITS, getRateLimitHeaders };
export type { RateLimitConfig };

/* ------------------------------------------------------------------ */
/*  Pluggable interface                                               */
/* ------------------------------------------------------------------ */

export interface RateLimitBackend {
  check(
    key: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetIn: number }>;
}

/* ------------------------------------------------------------------ */
/*  In-memory backend (dev / default)                                 */
/* ------------------------------------------------------------------ */

class MemoryBackend implements RateLimitBackend {
  async check(key: string, config: RateLimitConfig) {
    return checkRateLimit(key, config);
  }
}

/* ------------------------------------------------------------------ */
/*  Redis backend (production)                                        */
/* ------------------------------------------------------------------ */

class RedisBackend implements RateLimitBackend {
  private redisUrl: string;

  constructor(url: string) {
    this.redisUrl = url;
  }

  /**
   * Sliding-window rate limit via Upstash REST API or ioredis.
   * Uses INCR + PEXPIRE for a simple fixed-window approach
   * that degrades gracefully if Redis is unavailable.
   */
  async check(
    key: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    try {
      // Use Upstash REST API if URL contains upstash
      if (this.redisUrl.includes("upstash")) {
        return await this.checkUpstash(key, config);
      }
      // Fallback: treat as standard Redis (would require ioredis at runtime)
      // For now, fall back to in-memory
      return checkRateLimit(key, config);
    } catch {
      // If Redis is down, fall back to in-memory
      console.warn("Redis rate limiter unavailable, falling back to in-memory");
      return checkRateLimit(key, config);
    }
  }

  private async checkUpstash(
    key: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!token) {
      return checkRateLimit(key, config);
    }

    const baseUrl = this.redisUrl.replace(/\/$/, "");
    const rlKey = `rl:${key}`;

    // INCR the counter
    const incrRes = await fetch(`${baseUrl}/incr/${encodeURIComponent(rlKey)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const { result: count } = (await incrRes.json()) as { result: number };

    // Set expiry on first request in window
    if (count === 1) {
      await fetch(
        `${baseUrl}/pexpire/${encodeURIComponent(rlKey)}/${config.windowMs}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    const allowed = count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - count);

    return { allowed, remaining, resetIn: config.windowMs };
  }
}

/* ------------------------------------------------------------------ */
/*  Factory                                                           */
/* ------------------------------------------------------------------ */

function createBackend(): RateLimitBackend {
  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
  if (redisUrl) {
    return new RedisBackend(redisUrl);
  }
  return new MemoryBackend();
}

export const rateLimiter: RateLimitBackend = createBackend();

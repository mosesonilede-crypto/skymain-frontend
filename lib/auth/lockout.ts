/**
 * Account lockout protection.
 *
 * Tracks failed login attempts and temporarily locks accounts
 * after too many consecutive failures (progressive lockout).
 *
 * Usage:
 *   import { accountLockout } from "@/lib/auth/lockout";
 *   const check = accountLockout.check(email);
 *   if (!check.allowed) return Response.json({ error: check.message }, { status: 429 });
 *   // ... attempt login ...
 *   if (loginFailed) accountLockout.recordFailure(email);
 *   if (loginSuccess) accountLockout.reset(email);
 */

type LockoutEntry = {
  failures: number;
  lastFailure: number;
  lockedUntil: number;
};

const store = new Map<string, LockoutEntry>();

// Progressive lockout durations (in ms)
const LOCKOUT_TIERS = [
  { threshold: 3, durationMs: 30_000 },       // 3 failures → 30s lockout
  { threshold: 5, durationMs: 120_000 },      // 5 failures → 2m lockout
  { threshold: 8, durationMs: 600_000 },      // 8 failures → 10m lockout
  { threshold: 12, durationMs: 3_600_000 },   // 12 failures → 1h lockout
  { threshold: 20, durationMs: 86_400_000 },  // 20 failures → 24h lockout
];

const MAX_FAILURE_TRACKING = 24 * 60 * 60 * 1000; // Reset tracking after 24h of no failures

function getLockoutDuration(failures: number): number {
  let duration = 0;
  for (const tier of LOCKOUT_TIERS) {
    if (failures >= tier.threshold) {
      duration = tier.durationMs;
    }
  }
  return duration;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.lastFailure > MAX_FAILURE_TRACKING) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const accountLockout = {
  /**
   * Check if a login attempt is allowed for the given identifier.
   */
  check(identifier: string): { allowed: boolean; message?: string; retryAfterMs?: number } {
    const entry = store.get(identifier.toLowerCase());
    if (!entry) return { allowed: true };

    const now = Date.now();

    // Check if currently locked
    if (entry.lockedUntil > now) {
      const retryAfterMs = entry.lockedUntil - now;
      return {
        allowed: false,
        message: `Account temporarily locked. Try again in ${Math.ceil(retryAfterMs / 1000)} seconds.`,
        retryAfterMs,
      };
    }

    return { allowed: true };
  },

  /**
   * Record a failed login attempt and apply progressive lockout if threshold reached.
   */
  recordFailure(identifier: string): void {
    const key = identifier.toLowerCase();
    const existing = store.get(key);
    const now = Date.now();

    const entry: LockoutEntry = existing
      ? { failures: existing.failures + 1, lastFailure: now, lockedUntil: existing.lockedUntil }
      : { failures: 1, lastFailure: now, lockedUntil: 0 };

    const lockoutDuration = getLockoutDuration(entry.failures);
    if (lockoutDuration > 0) {
      entry.lockedUntil = now + lockoutDuration;
    }

    store.set(key, entry);
  },

  /**
   * Reset lockout state after successful login.
   */
  reset(identifier: string): void {
    store.delete(identifier.toLowerCase());
  },

  /**
   * Get current failure count (for monitoring/admin).
   */
  getFailureCount(identifier: string): number {
    return store.get(identifier.toLowerCase())?.failures || 0;
  },
};

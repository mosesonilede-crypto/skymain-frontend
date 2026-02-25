/**
 * Error tracking service abstraction.
 *
 * Currently uses Sentry. To switch providers, only this file needs to change.
 *
 * Setup:
 *   1. npm install @sentry/nextjs
 *   2. Set NEXT_PUBLIC_SENTRY_DSN and SENTRY_AUTH_TOKEN in env
 *   3. Run `npx @sentry/wizard@latest -i nextjs` for full instrumentation
 *
 * Until Sentry SDK is installed, this module provides a no-op fallback
 * that logs to console, so the rest of the app can call it safely.
 */

type ErrorContext = {
    userId?: string;
    orgName?: string;
    role?: string;
    [key: string]: unknown;
};

let _sentryModule: typeof import("@sentry/nextjs") | null = null;

async function getSentry() {
    if (_sentryModule) return _sentryModule;
    try {
        _sentryModule = await import("@sentry/nextjs");
        return _sentryModule;
    } catch {
        return null; // Sentry not installed yet
    }
}

/**
 * Capture an exception and send it to the error tracking service.
 */
export async function captureException(
    error: unknown,
    context?: ErrorContext
): Promise<void> {
    // Always log locally
    console.error("[ErrorTracker]", error, context);

    const sentry = await getSentry();
    if (sentry) {
        if (context) {
            sentry.withScope((scope) => {
                if (context.userId) scope.setUser({ id: context.userId, email: context.userId });
                if (context.orgName) scope.setTag("org", context.orgName);
                if (context.role) scope.setTag("role", context.role);
                for (const [k, v] of Object.entries(context)) {
                    if (!["userId", "orgName", "role"].includes(k)) {
                        scope.setExtra(k, v);
                    }
                }
                sentry.captureException(error);
            });
        } else {
            sentry.captureException(error);
        }
    }
}

/**
 * Capture a message (non-error event).
 */
export async function captureMessage(
    message: string,
    level: "info" | "warning" | "error" = "info",
    context?: ErrorContext
): Promise<void> {
    const sentry = await getSentry();
    if (sentry) {
        sentry.withScope((scope) => {
            if (context?.userId) scope.setUser({ id: context.userId });
            if (context?.orgName) scope.setTag("org", context.orgName);
            scope.setLevel(level);
            sentry.captureMessage(message);
        });
    } else {
        const logFn = level === "error" ? console.error : level === "warning" ? console.warn : console.info;
        logFn(`[ErrorTracker] ${message}`, context);
    }
}

/**
 * Set the current user context for all subsequent error reports.
 */
export async function setUserContext(user: {
    id: string;
    email?: string;
    orgName?: string;
    role?: string;
}): Promise<void> {
    const sentry = await getSentry();
    if (sentry) {
        sentry.setUser({ id: user.id, email: user.email });
        if (user.orgName) sentry.setTag("org", user.orgName);
        if (user.role) sentry.setTag("role", user.role);
    }
}

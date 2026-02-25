/**
 * Structured JSON logger for server-side code.
 *
 * All log output is JSON for easy parsing by log aggregators (Datadog, Logtail, etc.).
 * Replaces unstructured console.log/error in API routes.
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info("Aircraft created", { orgName: "acme", aircraftId: "123" });
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[CURRENT_LEVEL];
}

type LogContext = Record<string, unknown>;

function emit(level: LogLevel, message: string, context?: LogContext) {
  if (!shouldLog(level)) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: "skymaintain",
    environment: process.env.NODE_ENV || "development",
    ...context,
  };

  const json = JSON.stringify(entry);

  switch (level) {
    case "error":
      console.error(json);
      break;
    case "warn":
      console.warn(json);
      break;
    default:
      console.log(json);
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => emit("debug", message, context),
  info: (message: string, context?: LogContext) => emit("info", message, context),
  warn: (message: string, context?: LogContext) => emit("warn", message, context),
  error: (message: string, context?: LogContext) => emit("error", message, context),

  /** Create a child logger with bound context (e.g., requestId, orgName) */
  child(boundContext: LogContext) {
    return {
      debug: (msg: string, ctx?: LogContext) => emit("debug", msg, { ...boundContext, ...ctx }),
      info: (msg: string, ctx?: LogContext) => emit("info", msg, { ...boundContext, ...ctx }),
      warn: (msg: string, ctx?: LogContext) => emit("warn", msg, { ...boundContext, ...ctx }),
      error: (msg: string, ctx?: LogContext) => emit("error", msg, { ...boundContext, ...ctx }),
    };
  },
};

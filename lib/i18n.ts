/**
 * Lightweight i18n foundation.
 *
 * Provides a `t()` translation function using JSON locale dictionaries.
 * Supports interpolation via {{ key }} placeholders.
 *
 * Usage:
 *   import { t, setLocale } from "@/lib/i18n";
 *   setLocale("fr");
 *   t("aircraft.limitReached", { current: 5, max: 5 });
 */

type LocaleDictionary = Record<string, string>;

const dictionaries: Record<string, LocaleDictionary> = {
  en: {
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.unauthorized": "You are not authorized to perform this action",
    "common.notFound": "Not found",

    // Auth
    "auth.loginSuccess": "Logged in successfully",
    "auth.logoutSuccess": "Logged out",
    "auth.sessionExpired": "Your session has expired. Please log in again.",
    "auth.invalidCredentials": "Invalid email or password",

    // Aircraft
    "aircraft.created": "Aircraft registered successfully",
    "aircraft.updated": "Aircraft updated",
    "aircraft.deleted": "Aircraft removed",
    "aircraft.limitReached":
      "Aircraft limit reached for your plan ({{current}}/{{max}}). Upgrade to add more.",

    // Notifications
    "notifications.markAllRead": "All notifications marked as read",
    "notifications.empty": "No notifications",

    // GDPR
    "gdpr.exportStarted": "Your data export is being prepared",
    "gdpr.erasureComplete": "Your personal data has been erased",

    // Errors
    "error.generic": "Something went wrong. Please try again.",
    "error.network": "Network error. Check your connection.",
    "error.rateLimit": "Too many requests. Please wait {{seconds}} seconds.",
  },
};

let currentLocale = "en";

export function setLocale(locale: string) {
  currentLocale = locale;
}

export function getLocale(): string {
  return currentLocale;
}

export function addDictionary(locale: string, dict: LocaleDictionary) {
  dictionaries[locale] = { ...dictionaries[locale], ...dict };
}

/**
 * Translate a key with optional interpolation.
 * Falls back to English, then returns the key itself if not found.
 */
export function t(
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[currentLocale] || dictionaries.en;
  let value = dict[key] || dictionaries.en?.[key] || key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
    }
  }

  return value;
}

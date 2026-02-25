"use client";

import { useTheme } from "@/lib/ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";

/**
 * Theme toggle button for navigation/header.
 * Cycles through: Light → Dark → System
 */
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const next = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const label =
    theme === "system"
      ? `System (${resolvedTheme})`
      : theme === "dark"
        ? "Dark"
        : "Light";

  return (
    <button
      onClick={next}
      className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      title={`Theme: ${label}`}
      aria-label={`Switch theme. Current: ${label}`}
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : theme === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Monitor className="h-5 w-5" />
      )}
    </button>
  );
}

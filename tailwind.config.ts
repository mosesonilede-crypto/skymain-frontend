import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx,js,jsx}",
        "./components/**/*.{ts,tsx,js,jsx}",
        "./lib/**/*.{ts,tsx,js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                "bg": {
                    "default": "var(--color-bg-default)",
                    "surface": "var(--color-bg-surface)"
                },
                "brand": {
                    "primary": "var(--color-brand-primary)"
                },
                "text": {
                    "muted": "var(--color-text-muted)",
                    "primary": "var(--color-text-primary)"
                }
            },
            spacing: {
                "0": "var(--space-0)",
                "1": "var(--space-1)",
                "2": "var(--space-2)",
                "3": "var(--space-3)",
                "4": "var(--space-4)",
                "5": "var(--space-5)",
                "6": "var(--space-6)"
            },
            borderRadius: {
                "lg": "var(--radius-lg)",
                "md": "var(--radius-md)",
                "sm": "var(--radius-sm)",
                "xl": "var(--radius-xl)"
            },
            fontFamily: { sans: ["Inter", "sans-serif"] },
            fontSize: {
                "2xl": "var(--type-size-2xl)",
                "3xl": "var(--type-size-3xl)",
                "base": "var(--type-size-base)",
                "lg": "var(--type-size-lg)",
                "sm": "var(--type-size-sm)",
                "xl": "var(--type-size-xl)",
                "xs": "var(--type-size-xs)"
            },
            fontWeight: {
                "bold": 700,
                "medium": 500,
                "regular": 400,
                "semibold": 600
            },
            lineHeight: {
                "normal": 1.5,
                "tight": 1.2
            }
        }
    },
    plugins: [],
};

export default config;

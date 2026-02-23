/**
 * Environment validation for production deployment
 * Import this in layout.tsx to validate on startup
 */

type EnvRequirement = {
    name: string;
    required: boolean;
    requiredInProduction?: boolean;
    validate?: (value: string) => boolean;
};

const ENV_REQUIREMENTS: EnvRequirement[] = [
    // Critical for 2FA
    { name: "TWO_FA_SECRET", required: true, validate: (v) => v.length >= 32 },

    // Integration connectors (required for production use-ready deployments)
    { name: "SKYMAINTAIN_CMMS_BASE_URL", required: false, requiredInProduction: true },
    { name: "SKYMAINTAIN_ERP_BASE_URL", required: false, requiredInProduction: true },
    { name: "SKYMAINTAIN_FLIGHT_OPS_BASE_URL", required: false, requiredInProduction: true },
    { name: "SKYMAINTAIN_ACMS_BASE_URL", required: false, requiredInProduction: true },
    { name: "SKYMAINTAIN_MANUALS_BASE_URL", required: false, requiredInProduction: true },
    { name: "SKYMAINTAIN_INTEGRATION_API_KEY", required: false, requiredInProduction: true },
    {
        name: "SKYMAINTAIN_INTEGRATION_TIMEOUT_MS",
        required: false,
        requiredInProduction: true,
        validate: (v) => Number.isFinite(Number(v)) && Number(v) > 0,
    },

    // Email delivery
    { name: "SMTP_HOST", required: false },
    { name: "SMTP_PORT", required: false },
    { name: "SMTP_USER", required: false },
    { name: "SMTP_PASS", required: false },
    { name: "SMTP_FROM", required: false },

    // Data mode
    { name: "NEXT_PUBLIC_DATA_MODE", required: false },

    // API base URL (for live mode)
    { name: "NEXT_PUBLIC_API_BASE_URL", required: false },

    // Stripe billing (required in live/hybrid mode; checked below)
    { name: "STRIPE_SECRET_KEY", required: false, validate: (v) => v.startsWith("sk_") },
    { name: "STRIPE_PRICE_STARTER_MONTHLY", required: false, validate: (v) => v.startsWith("price_") },
    { name: "STRIPE_PRICE_STARTER_YEARLY", required: false, validate: (v) => v.startsWith("price_") },
    { name: "STRIPE_PRICE_PROFESSIONAL_MONTHLY", required: false, validate: (v) => v.startsWith("price_") },
    { name: "STRIPE_PRICE_PROFESSIONAL_YEARLY", required: false, validate: (v) => v.startsWith("price_") },
    { name: "STRIPE_PRICE_ENTERPRISE_MONTHLY", required: false, validate: (v) => v.startsWith("price_") },
    { name: "STRIPE_PRICE_ENTERPRISE_YEARLY", required: false, validate: (v) => v.startsWith("price_") },
];

export function validateEnvironment(): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const isProduction = process.env.NODE_ENV === "production";
    const dataMode = (process.env.NEXT_PUBLIC_DATA_MODE || "live").toLowerCase();

    for (const req of ENV_REQUIREMENTS) {
        const value = process.env[req.name];

        const isRequired = req.required || (req.requiredInProduction && isProduction);
        if (isRequired && !value) {
            errors.push(`Missing required: ${req.name}`);
        } else if (!value && isProduction) {
            warnings.push(`Recommended: ${req.name}`);
        } else if (value && req.validate && !req.validate(value)) {
            errors.push(`Invalid value for ${req.name}`);
        }
    }

    // Live mode specific checks
    if (dataMode === "live" || dataMode === "hybrid") {
        if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) {
            errors.push("SMTP configuration required for live mode");
        }
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
            errors.push("NEXT_PUBLIC_API_BASE_URL is required for live mode");
        }
        // Stripe billing checks for live/hybrid modes
        if (!process.env.STRIPE_SECRET_KEY) {
            warnings.push("STRIPE_SECRET_KEY missing — billing features will return mock data");
        }
        const priceVars = [
            "STRIPE_PRICE_STARTER_MONTHLY", "STRIPE_PRICE_STARTER_YEARLY",
            "STRIPE_PRICE_PROFESSIONAL_MONTHLY", "STRIPE_PRICE_PROFESSIONAL_YEARLY",
            "STRIPE_PRICE_ENTERPRISE_MONTHLY", "STRIPE_PRICE_ENTERPRISE_YEARLY",
        ];
        const missingPrices = priceVars.filter((v) => !process.env[v]);
        if (missingPrices.length > 0) {
            warnings.push(`Missing Stripe price IDs: ${missingPrices.join(", ")}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

// Log validation results on module load (server-side only)
if (typeof window === "undefined") {
    const result = validateEnvironment();

    if (result.errors.length > 0) {
        console.error("❌ Environment validation errors:");
        result.errors.forEach(e => console.error(`   - ${e}`));
    }

    if (result.warnings.length > 0 && process.env.NODE_ENV === "production") {
        console.warn("⚠️  Environment warnings:");
        result.warnings.forEach(w => console.warn(`   - ${w}`));
    }

    if (result.valid && result.warnings.length === 0) {
        console.info("Environment validation passed");
    }
}

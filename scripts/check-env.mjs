#!/usr/bin/env node

const PREVIEW_REQUIRED = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DATA_MODE",
  "NEXT_PUBLIC_ALLOW_MOCK_FALLBACK",
  "TWO_FA_SECRET",
];

const PRODUCTION_REQUIRED = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_DATA_MODE",
  "NEXT_PUBLIC_ALLOW_MOCK_FALLBACK",
  "TWO_FA_SECRET",
  "SKYMAINTAIN_CMMS_BASE_URL",
  "SKYMAINTAIN_ERP_BASE_URL",
  "SKYMAINTAIN_FLIGHT_OPS_BASE_URL",
  "SKYMAINTAIN_ACMS_BASE_URL",
  "SKYMAINTAIN_MANUALS_BASE_URL",
  "SKYMAINTAIN_INTEGRATION_API_KEY",
  "SKYMAINTAIN_INTEGRATION_TIMEOUT_MS",
];

const STRIPE_REQUIRED = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_STARTER_MONTHLY",
  "STRIPE_PRICE_STARTER_YEARLY",
  "STRIPE_PRICE_PROFESSIONAL_MONTHLY",
  "STRIPE_PRICE_PROFESSIONAL_YEARLY",
  "STRIPE_PRICE_ENTERPRISE_MONTHLY",
  "STRIPE_PRICE_ENTERPRISE_YEARLY",
];

const EMAIL_RECOMMENDED = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
];

function parseTarget() {
  const arg = process.argv.find((a) => a.startsWith("--target="));
  if (arg) {
    const value = arg.split("=")[1]?.trim().toLowerCase();
    if (value === "preview" || value === "production") return value;
  }

  const vercelEnv = (process.env.VERCEL_ENV || "").toLowerCase();
  if (vercelEnv === "preview" || vercelEnv === "production") return vercelEnv;

  return "preview";
}

function present(name) {
  return Boolean((process.env[name] || "").trim());
}

function missing(keys) {
  return keys.filter((k) => !present(k));
}

function printList(title, values, symbol) {
  if (values.length === 0) return;
  console.log(`\n${title}`);
  values.forEach((v) => console.log(`  ${symbol} ${v}`));
}

function main() {
  const target = parseTarget();
  const required = target === "production" ? PRODUCTION_REQUIRED : PREVIEW_REQUIRED;

  const missingRequired = missing(required);
  const missingStripe = missing(STRIPE_REQUIRED);
  const missingEmail = missing(EMAIL_RECOMMENDED);

  console.log(`SkyMaintain env audit (${target})`);

  if (missingRequired.length === 0) {
    console.log("\n✅ Required variables: OK");
  } else {
    printList("❌ Missing required variables:", missingRequired, "-");
  }

  if (missingStripe.length === 0) {
    console.log("\n✅ Stripe variables: OK");
  } else {
    printList("⚠️ Missing Stripe variables (required for live billing):", missingStripe, "-");
  }

  if (missingEmail.length === 0) {
    console.log("\n✅ Email variables: OK");
  } else {
    printList("ℹ️ Missing email variables (recommended for notifications):", missingEmail, "-");
  }

  if (missingRequired.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log("\nEnvironment audit passed.");
}

main();

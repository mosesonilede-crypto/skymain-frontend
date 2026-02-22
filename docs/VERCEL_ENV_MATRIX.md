# Vercel Environment Matrix

This matrix is the source of truth for Vercel Project Settings → Environment Variables.

## 1) Required in **Preview**

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<preview-domain>.vercel.app` | Used for canonical/redirect metadata. |
| `NEXT_PUBLIC_DATA_MODE` | `hybrid` | Recommended default for preview stability. |
| `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK` | `true` | Enables fallback behavior where supported. |
| `TWO_FA_SECRET` | `your-32+char-secret` | Must be at least 32 characters. |

## 2) Required in **Production**

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://app.skymaintain.ai` | Public app URL. |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.skymaintain.ai` | Backend base URL for live data paths. |
| `NEXT_PUBLIC_DATA_MODE` | `live` (or `hybrid`) | Use `hybrid` during staged rollout, then `live`. |
| `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK` | `false` | Keep `false` in strict live production. |
| `TWO_FA_SECRET` | `your-32+char-secret` | Must be at least 32 characters. |

## 3) Production Integration Readiness (Required by validation)

| Variable | Example |
|---|---|
| `SKYMAINTAIN_CMMS_BASE_URL` | `https://cmms.yourdomain.com` |
| `SKYMAINTAIN_ERP_BASE_URL` | `https://erp.yourdomain.com` |
| `SKYMAINTAIN_FLIGHT_OPS_BASE_URL` | `https://ops.yourdomain.com` |
| `SKYMAINTAIN_ACMS_BASE_URL` | `https://api.skymaintain.ai/v1/acms` |
| `SKYMAINTAIN_MANUALS_BASE_URL` | `https://manuals.yourdomain.com` |
| `SKYMAINTAIN_INTEGRATION_API_KEY` | `replace-with-secure-key` |
| `SKYMAINTAIN_INTEGRATION_TIMEOUT_MS` | `5000` |

## 4) Stripe (Required for live billing)

| Variable | Example |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PRICE_STARTER_MONTHLY` | `price_...` |
| `STRIPE_PRICE_STARTER_YEARLY` | `price_...` |
| `STRIPE_PRICE_PROFESSIONAL_MONTHLY` | `price_...` |
| `STRIPE_PRICE_PROFESSIONAL_YEARLY` | `price_...` |
| `STRIPE_PRICE_ENTERPRISE_MONTHLY` | `price_...` |
| `STRIPE_PRICE_ENTERPRISE_YEARLY` | `price_...` |

## 5) Email (Recommended for live notifications)

| Variable | Example |
|---|---|
| `SMTP_HOST` | `smtp.sendgrid.net` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `apikey` |
| `SMTP_PASS` | `your-smtp-password` |
| `SMTP_FROM` | `noreply@skymaintain.ai` |

## 6) Suggested rollout profile

### Preview
- `NEXT_PUBLIC_DATA_MODE=hybrid`
- `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK=true`
- Use test Stripe keys (`sk_test_...`, test `price_...`).

### Production (phase 1)
- `NEXT_PUBLIC_DATA_MODE=hybrid`
- `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK=false`
- Configure all required integration + 2FA variables.

### Production (phase 2, strict)
- `NEXT_PUBLIC_DATA_MODE=live`
- `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK=false`
- Keep all integrations and billing fully configured.

## 7) Fast validation after setting vars

1. Trigger Vercel redeploy with cache clear.
2. Confirm build output has no env hard-fail exceptions.
3. Check these routes load successfully:
   - `/terms`
   - `/compliance`
   - `/pricing`
   - `/app/subscription-billing`
4. Verify billing API route:
   - `/api/billing`

### Optional local preflight command

Run from `skymain-frontend` before deploying:

- Preview profile: `npm run check:env -- --target=preview`
- Production profile: `npm run check:env -- --target=production`

The command exits with non-zero status only when required variables are missing.

## 8) Security notes

- Never place secrets in `NEXT_PUBLIC_*` unless they are intentionally public.
- Keep `STRIPE_SECRET_KEY`, `TWO_FA_SECRET`, and integration API keys in server-side env vars only.
- Rotate secrets immediately if they were exposed in logs or screenshots.

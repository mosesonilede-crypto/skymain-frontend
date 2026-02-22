# Deployment Setup Guide

For a copy/paste-ready variable list by environment, see `docs/VERCEL_ENV_MATRIX.md`.

## Architecture
- **Frontend**: Next.js deployed to Vercel via GitHub Actions
- **Backend**: Python FastAPI on Namecheap
- **Protection**: Cloudflare reverse proxy + CDN in front of Vercel
- **Domain**: Points to Cloudflare nameservers (Cloudflare → Vercel)

## GitHub Actions Deployment

Your repository is configured to automatically deploy to Vercel on pushes to `main`.

### Prerequisites

1. **Vercel Account** (https://vercel.com)
   - Create a new project for this repo
   - Get these values from your Vercel account:
     - `VERCEL_TOKEN`: Personal access token
     - `VERCEL_ORG_ID`: Organization/team ID
     - `VERCEL_PROJECT_ID`: Project ID

2. **GitHub Repository Secrets**
   - Go to: Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN` - Your Vercel personal access token
     - `VERCEL_ORG_ID` - Your Vercel organization ID
     - `VERCEL_PROJECT_ID` - Your Vercel project ID
   - `NEXT_PUBLIC_API_BASE_URL` - Your backend API URL (e.g., `https://api.yourdomain.com`)

### Setup Steps

1. **Create Vercel Project**
   ```bash
   # Option A: Via Vercel Dashboard
   # Go to https://vercel.com/new and import your GitHub repo
   
   # Option B: Via Vercel CLI
   npm i -g vercel
   vercel link
   ```

2. **Get Vercel Credentials**
   ```bash
   # Get your personal access token
   # https://vercel.com/account/tokens
   
   # Get your org/project IDs
   # https://vercel.com/[your-team]/[project-name]/settings
   ```

3. **Configure GitHub Secrets**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add all 4 secrets from above

4. **Deploy**
   ```bash
   # Just push to main!
   git push origin main
   
   # Watch the deployment:
   # GitHub Actions → Design Contract & Deploy → deploy job
   ```

### Cloudflare Configuration

1. **Point Domain to Cloudflare**
   - In Cloudflare dashboard, add your domain
   - Update nameservers at Namecheap to point to Cloudflare

2. **Configure DNS in Cloudflare**
   - Add CNAME record pointing to your Vercel deployment
   - Cloudflare will show you the exact CNAME value to use
   - Enable Cloudflare proxy (orange cloud icon)

3. **SSL/TLS**
   - Cloudflare: Use "Flexible" or "Full" SSL mode
   - Vercel handles the actual HTTPS

### Environment Variables

- **`NEXT_PUBLIC_API_BASE_URL`**: Backend base URL used by frontend and API routes
   - Example: `https://api.yourdomain.com`
- **`NEXT_PUBLIC_DATA_MODE`**: `live`, `hybrid`, or `mock`
   - Recommended for production: `hybrid` until all backend dependencies are live
- **`NEXT_PUBLIC_ALLOW_MOCK_FALLBACK`**: `true` or `false`
   - Used only with hybrid/mock behavior

### Vercel Production Checklist

Set these in **Vercel → Project Settings → Environment Variables**:

**Required to avoid runtime/setup failures**
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `TWO_FA_SECRET` (32+ characters)

**Required for production integration readiness (validation gate)**
- `SKYMAINTAIN_CMMS_BASE_URL`
- `SKYMAINTAIN_ERP_BASE_URL`
- `SKYMAINTAIN_FLIGHT_OPS_BASE_URL`
- `SKYMAINTAIN_ACMS_BASE_URL`
- `SKYMAINTAIN_MANUALS_BASE_URL`
- `SKYMAINTAIN_INTEGRATION_API_KEY`
- `SKYMAINTAIN_INTEGRATION_TIMEOUT_MS`

**Recommended for live email**
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

### Stripe Billing Environment Variables

Set these in **Vercel → Settings → Environment Variables** for billing to work:

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys → Secret key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → Signing secret (optional, for frontend webhook) |
| `STRIPE_PRICE_STARTER_MONTHLY` | Price ID for Starter monthly plan |
| `STRIPE_PRICE_STARTER_YEARLY` | Price ID for Starter yearly plan |
| `STRIPE_PRICE_PROFESSIONAL_MONTHLY` | Price ID for Professional monthly plan |
| `STRIPE_PRICE_PROFESSIONAL_YEARLY` | Price ID for Professional yearly plan |
| `STRIPE_PRICE_ENTERPRISE_MONTHLY` | Price ID for Enterprise monthly plan |
| `STRIPE_PRICE_ENTERPRISE_YEARLY` | Price ID for Enterprise yearly plan |
| `NEXT_PUBLIC_SITE_URL` | Frontend base URL for Stripe checkout redirects (e.g., `https://app.skymaintain.ai`) |

> **Note**: See `.env.example` for a template with all required variables.

### API Routes

The frontend has these API routes (in `/app/api/`):
- `/api/alerts/[aircraftReg]`
- `/api/dashboard/[aircraftReg]`
- `/api/reports/[aircraftReg]`
- `/api/logs/[aircraftReg]`
- `/api/insights/[aircraftReg]`
- `/api/compliance/[aircraftReg]`

These are **Vercel serverless functions** that can be called by the frontend. If you want them to call your Python backend, update them to proxy requests to `NEXT_PUBLIC_API_BASE_URL`.

### Monitoring

1. **GitHub Actions**: Check deployment status at `Actions` tab
2. **Vercel**: Monitor deployments at https://vercel.com/dashboards
3. **Cloudflare**: Check DNS resolution and caching at Cloudflare dashboard

### Troubleshooting

**Deployment fails in GitHub Actions**
- Check if all 4 secrets are set correctly
- Verify project IDs are correct
- Check GitHub Actions logs for error messages

**Site is down/not accessible**
- Check Cloudflare DNS settings
- Verify CNAME points to Vercel URL
- Check if Cloudflare proxy is enabled (orange cloud)
- Verify SSL/TLS settings in Cloudflare

**API calls failing**
- Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify Namecheap backend is running
- Check CORS headers if backend is on different domain
- Use browser DevTools to see API response errors

### Rollback

If a deployment breaks:
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or manually rollback in Vercel dashboard
# Go to Deployments → select previous version → click "Promote to Production"
```

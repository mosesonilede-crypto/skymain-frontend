# Flow Contract v1

## A. Public routes (unauthenticated)

Base public layout: app/(public)/layout.tsx  
Global: Help Center FAB (bottom-right) should appear on all public pages.

### Primary public pages

/ → Landing (enterprise marketing)

/platform-features

/pricing

/contact

/careers

/privacy

/terms

/compliance

/security

/security-data-protection

/regulatory-compliance-automation

/about

### Other public flow pages

/get-started

/signin

/2fa

### Public click-to-click contract

From any public page:

- Help Center FAB exists
- “Contact support” → /contact?intent=support (topic/ref optional)
- “Legal summary” → /terms

From Landing /:

Nav/CTAs:

- “Request Demo” → /contact?intent=demo
- “Request Pricing” / “Pricing CTAs” → /contact?intent=pricing

Footer links:

- Privacy → /privacy
- Terms → /terms
- Compliance → /compliance
- Security → /security
- Contact → /contact

From Pricing /pricing:

- Any “Request Pricing” CTA → /contact?intent=pricing

From Any Support CTA:

- Must funnel to /contact?intent=support (single intake window)

## B. Authenticated routes (application shell)

Authenticated shell layout: app/(app)/app/layout.tsx  
Global on app pages: Help Center FAB + AI Assistant FAB (no overlap)

### App entry

/app → post-login “App Home” / zero-state / app landing

### Core modules (from your inventory)

/app/dashboard

/app/docs

/app/admin-panel

/app/subscription-billing

### Operational modules

/app/alerts

/app/logs

/app/reports

/app/insights

/app/compliance

### Settings subtree

/app/settings

/app/settings/about

/app/settings/appearance

/app/settings/aircraft-fleet

/app/settings/documents-records

/app/settings/maintenance-workflow

/app/settings/notifications-alerts

/app/settings/ai-predictive-maintenance

/app/settings/regulatory-compliance

/app/settings/security-audit-logs

### App click-to-click contract

From any app page:

- Help Center FAB exists
- AI Assistant FAB exists

From /app:

- Left nav click targets should route to the module pages above (dashboard/docs/alerts/logs/reports/insights/compliance/settings/admin-panel/subscription-billing), and each destination should render without 404.

## C. Known determinism risks (must be fixed for perfect guarantees)

Your inventory contains collisions / duplicates, e.g.:

- app/page.tsx and app/(public)/page.tsx both map to /
- app/terms/page.tsx and app/(public)/terms/page.tsx both map to /terms
- app/privacy/page.tsx and app/(public)/privacy/page.tsx both map to /privacy
- app/compliance/page.tsx and app/(public)/compliance/page.tsx both map to /compliance
- Two app trees: app/app/* and app/(app)/app/*

The Playwright suite below helps expose these issues and enforce the intended flow.

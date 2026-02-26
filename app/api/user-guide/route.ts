/**
 * GET  /api/user-guide — Fetch the current user guide content (public)
 * PUT  /api/user-guide — Update the user guide (super_admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";
const GUIDE_TABLE = "user_guide";
const GUIDE_ID = "main";

type SessionPayload = { email: string; orgName: string; role: string; exp: number };

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

/** Default user guide content — used when no saved guide exists */
function getDefaultGuide(): { id: string; title: string; sections: GuideSection[]; updated_at: string; updated_by: string } {
    return {
        id: GUIDE_ID,
        title: "SkyMaintain User Guide",
        updated_at: new Date().toISOString(),
        updated_by: "system",
        sections: DEFAULT_SECTIONS,
    };
}

interface GuideSection {
    id: string;
    title: string;
    content: string;
    order: number;
}

const DEFAULT_SECTIONS: GuideSection[] = [
    {
        id: "getting-started",
        title: "1. Getting Started",
        order: 1,
        content: `## Welcome to SkyMaintain

SkyMaintain is a regulatory-grade aircraft maintenance management platform designed for MRO organizations, airlines, and aviation maintenance teams.

### Creating Your Account

1. Visit **skymaintain.ai** and click **"Start Free Trial"**
2. Fill in your details:
   - **Full Name** — your name as it appears in official records
   - **Organization Name** — your company or MRO organization
   - **Email** — your work email (used for all communications)
   - **Password** — minimum 8 characters, must include uppercase, lowercase, and a number
3. Accept the Terms of Service and Privacy Policy
4. Click **"Create Account"**
5. Check your email for a **verification link** — click it to activate your account

### Signing In

1. Go to **skymaintain.ai/signin**
2. Enter your **email**, **organization name**, and **password**
3. If your organization has a license code, enter it in the **License Code** field
4. Check **"Remember me"** to stay signed in across sessions
5. Click **"Sign In"**

### Two-Factor Authentication (2FA)

If 2FA is enabled for your organization, you'll be prompted to enter a 6-digit code sent to your email after signing in. This adds an extra layer of security to your account.

### Forgot Your Password?

1. Click **"Forgot password?"** on the sign-in page
2. Enter your registered email address
3. Check your email for a **password reset link**
4. Set a new password using the strength indicator as a guide`,
    },
    {
        id: "dashboard",
        title: "2. Dashboard",
        order: 2,
        content: `## Dashboard Overview

The Dashboard is your central command center, providing a real-time snapshot of your fleet's health and operational status.

### Key Performance Indicators (KPIs)

At the top, you'll see stat cards showing:
- **Critical Items** — issues requiring immediate attention
- **Scheduled Maintenance** — upcoming maintenance tasks
- **Fleet Health** — overall operational status percentage

### KPI Distribution Chart

A donut chart visualizes the distribution of your KPIs, helping you quickly identify areas that need focus.

### System Health

A color-coded bar chart shows the health of critical systems:
- 🟢 **Operational** — system running normally
- 🟡 **Degraded** — system operating with reduced capacity
- 🔴 **Critical** — system requires immediate attention

### Maintenance Countdown

A bar chart showing days remaining until the next scheduled maintenance for each aircraft, helping you plan ahead.

### Scheduled Maintenance List

A detailed list of upcoming maintenance items with:
- Aircraft identifier
- Maintenance type
- Days remaining
- Due date

### Recent Tasks & Critical Alerts

At the bottom, you'll find your latest completed/in-progress tasks and any critical alerts requiring attention.`,
    },
    {
        id: "aircraft-fleet",
        title: "3. Aircraft Fleet Management",
        order: 3,
        content: `## Managing Your Aircraft Fleet

The **Aircraft Fleet** page lets you register, view, and manage all aircraft in your organization.

### Viewing Your Fleet

Aircraft are displayed as cards showing:
- **Registration** (e.g., N12345)
- **Type** (e.g., Boeing 737-800)
- **Status** — Active, Grounded, In Maintenance, or Storage
- **Location**, **Flight Hours**, **Cycles**, **Serial Number**

### Registering a New Aircraft

1. Click **"+ Register Aircraft"**
2. Fill in the required fields:
   - **Registration** — the aircraft's registration number
   - **Aircraft Type** — model designation
   - **Serial Number** — manufacturer's serial number
   - **Location** — current base location
3. Click **"Register"**

### Fleet Statistics

Stat cards at the top summarize:
- Total aircraft by status (active, grounded, in maintenance, storage)

### Fleet Analytics

Navigate to **Fleet Analytics** for deeper insights:
- **Fleet by Status** — pie chart showing the distribution
- **Fleet by Type** — bar chart of aircraft types in your fleet
- **Upcoming Maintenance** — timeline showing overdue + scheduled items
- **Work Orders by Status** — pie chart of work order states`,
    },
    {
        id: "work-orders",
        title: "4. Work Orders",
        order: 4,
        content: `## Work Order Management

Work Orders are the backbone of your maintenance operations. Use them to track, assign, and complete maintenance tasks.

### Viewing Work Orders

- **Status filter tabs** let you quickly filter: All, Draft, Open, In Progress, Completed, Cancelled
- **Stat cards** show counts for Total, Draft, In Progress, and Completed orders

### Creating a Work Order

1. Click **"+ New Work Order"**
2. Fill in the details:
   - **Title** — brief description of the work required
   - **Description** — detailed instructions
   - **Priority** — Routine, Urgent, AOG (Aircraft on Ground), or Critical
   - **Category** — Scheduled, Unscheduled, or Modification
   - **Assigned To** — the technician or team responsible
   - **Estimated Hours** — expected duration
   - **Due Date** — deadline for completion
3. Click **"Create Work Order"**

### Updating Work Order Status

Use the inline status dropdown on any work order to transition it through the lifecycle:
- **Draft** → **Open** → **In Progress** → **Completed**
- **Cancelled** can be set from any state

### Priority Levels

| Priority | Color | Meaning |
|----------|-------|---------|
| Routine | Gray | Standard scheduled work |
| Urgent | Amber | Needs attention soon |
| AOG | Red | Aircraft grounded — highest urgency |
| Critical | Red (bold) | Safety-critical issue |`,
    },
    {
        id: "maintenance-modules",
        title: "5. Maintenance Modules",
        order: 5,
        content: `## Maintenance Modules

SkyMaintain provides specialized modules for every aspect of aircraft maintenance management.

### Maintenance Calendar

A full month-view calendar showing all scheduled maintenance events, color-coded by type:
- 🔵 **Maintenance** — routine maintenance events
- 🟡 **Inspection** — scheduled inspections
- 🟣 **Work Order** — linked work orders
- 🔴 **Certificate Expiry** — expiring certifications

Use the **◄ ►** arrows to navigate between months. Click any event for details.

### Maintenance Events

Track individual maintenance events with:
- Event type (scheduled, unscheduled, AOG, inspection)
- Aircraft registration
- ATA chapter reference
- Start/end dates
- Status and sign-off

### Job Cards

Create and manage job cards for specific maintenance tasks:
- Link to work orders and engineering orders
- Track labor hours and parts used
- Record sign-offs and inspections

### Maintenance Programs

Define recurring maintenance programs aligned with the aircraft manufacturer's maintenance planning document (MPD):
- Program type (MSG-3, hard time, on-condition, condition monitored)
- Interval definitions (hours, cycles, calendar)
- Applicability and effectivity

### Maintenance Intelligence

AI-powered maintenance recommendations based on fleet data, reliability trends, and regulatory requirements. Available on Professional and Enterprise plans.`,
    },
    {
        id: "engineering-compliance",
        title: "6. Engineering & Compliance",
        order: 6,
        content: `## Engineering Orders & Compliance

### Engineering Orders

Manage Airworthiness Directives (ADs), Service Bulletins (SBs), and other engineering orders:
- Track compliance status per aircraft
- Record effectivity and implementation dates
- Link to related work orders

### Regulatory Compliance

*(Professional / Enterprise only)*

A comprehensive compliance dashboard showing:
- AD compliance status across your fleet
- SB implementation tracking
- Certificate and license expiry monitoring
- Regulatory authority tracking (EASA, FAA, TCCA, etc.)

### Findings & NRCs (Non-Routine Cards)

Document and track findings discovered during maintenance:
- Categorize by severity and ATA chapter
- Link to corrective work orders
- Track resolution status

### MEL Deferrals (Minimum Equipment List)

Manage MEL deferred items:
- Track open and extended deferrals
- Monitor rectification deadlines
- Alert on overdue items

### Decision Events

An audit trail of all maintenance decisions made on the platform:
- Decision disposition (No Action, Monitor, Schedule, Comply, Work Order)
- Authority tracking — who authorized the decision
- Policy compliance verification
- Override rationale documentation`,
    },
    {
        id: "fleet-operations",
        title: "7. Fleet Operations",
        order: 7,
        content: `## Fleet Operations

### Parts Inventory

Manage your parts and materials inventory:
- Track stock levels, reorder points, and locations
- Monitor low-stock alerts
- Record part movements and consumption

### Shop Visits

Track engine and component shop visits:
- Record shop visit details, scope, and findings
- Monitor turnaround times
- Link to warranty claims

### Tools & Calibration

Manage your tooling and calibration schedule:
- Track tool locations and assignments
- Monitor calibration due dates
- Alert on overdue calibrations

### Warranty Claims

Submit and track warranty claims:
- Link claims to parts and shop visits
- Track claim status and resolution
- Monitor financial impact

### Reliability

Monitor fleet reliability metrics:
- Event tracking (PIREPs, MAREPs, SDRs, delays, cancellations)
- Alert rate monitoring vs thresholds
- Event type distribution charts
- Trend analysis

### Predictive Alerts

AI-powered predictive maintenance alerts:
- Component failure predictions
- Trend-based health monitoring
- Recommended actions with confidence levels`,
    },
    {
        id: "people-training",
        title: "8. People & Training",
        order: 8,
        content: `## People & Training

### Staff Training

Manage and track staff training records:
- Training courses and certifications
- Expiry tracking and renewal reminders
- Competency records

### License Management

Track staff licenses and certifications:
- Current license details (plan, status, billing cycle, expiry)
- License history and renewal records
- Status monitoring (active, expired, suspended)

### User Management (Admin Panel)

The Admin Panel is available to administrators and super admins:
- **Add Users** — invite team members to your organization
- **Assign Roles** — Viewer, Technician, Engineer, Admin, Super Admin
- **Manage Status** — activate or deactivate user accounts
- **Edit Profiles** — update user details and role assignments

### Roles & Permissions

| Role | Access Level |
|------|-------------|
| Viewer | Read-only access to all data |
| Technician | Can create/update work orders, log maintenance |
| Engineer | Full maintenance data access, engineering orders |
| Admin | User management, organization settings, integrations |
| Super Admin | All permissions + billing + user guide editing |`,
    },
    {
        id: "documents-data",
        title: "9. Documents & Data",
        order: 9,
        content: `## Documents & Data Management

### Document Control

Manage controlled documents:
- Upload, version, and distribute documents
- Track acknowledgment and read receipts
- Maintain document revision history

### Data Import

*(Admin only)*

Import data from external systems:
- CSV and JSON file uploads
- Field mapping and validation
- Preview before confirming import

### Data Export / GDPR

Export your organization's data:
1. Select the **data table** to export (Aircraft, Audit Log, Decision Events, User Profiles)
2. Choose the **format** (CSV or JSON)
3. Click **"Export"** to download

This feature supports **GDPR Article 20** (Right to Data Portability) — you can export all your data at any time.

### Ingestion Contracts

*(Professional / Enterprise only)*

Configure API-based data ingestion:
- Define data contracts and schemas
- Monitor ingestion pipelines
- Validate incoming data against contracts

### Integrations

*(Admin only)*

Connect SkyMaintain to external systems:
- ACMS (Aircraft Condition Monitoring System) connector
- CMMS integration
- ERP system links
- Flight operations data feeds`,
    },
    {
        id: "ai-features",
        title: "10. AI & Intelligence Features",
        order: 10,
        content: `## AI & Intelligence Features

### AI Insights

*(Professional / Enterprise only)*

SkyMaintain's AI engine provides:
- **Deterministic Reasoning** — rule-based decisions anchored in regulatory requirements
- **Policy-Aligned Recommendations** — suggestions that respect your approved maintenance policies
- **Source-Anchored Traceability** — every recommendation links back to its data source

### Maintenance Intelligence

*(Professional / Enterprise only)*

Advanced analytics and predictions:
- Component lifecycle analysis
- Reliability trend forecasting
- Cost optimization recommendations
- Proactive maintenance scheduling

### AI Assistant

The **AI Assistant** button (bottom-right corner) provides contextual help:
- Ask questions about your fleet data
- Get explanations of maintenance recommendations
- Navigate to relevant sections of the platform

### Reports

*(Professional / Enterprise only)*

Generate comprehensive reports:
- Fleet status reports
- Compliance summaries
- Maintenance forecasts
- Custom date-range analytics`,
    },
    {
        id: "account-settings",
        title: "11. Account & Settings",
        order: 11,
        content: `## Account & Settings

### Edit Profile

Click your **avatar** at the bottom of the sidebar to open the profile panel:
- **Change Photo** — upload a professional profile picture (JPEG, PNG, GIF, or WebP, max 5 MB)
- **Full Name** — your display name across the platform
- **Phone** — contact number
- **Country** — your location
- **Organization** — read-only, set during registration
- **Role** — read-only, assigned by your admin

### Settings

The Settings page provides:
- **Notification preferences** — configure email and in-app alerts
- **Display preferences** — theme and layout options
- **Session management** — view active sessions
- **Security** — enable/manage 2FA

### Subscription & Billing

Manage your subscription:
- **View current plan** (Starter, Professional, Enterprise)
- **Upgrade/downgrade** your plan
- **Billing history** and invoices
- **Payment method** management

### Plan Comparison

| Feature | Starter | Professional | Enterprise |
|---------|---------|-------------|------------|
| Aircraft Fleet Management | ✅ | ✅ | ✅ |
| Work Orders & Job Cards | ✅ | ✅ | ✅ |
| Parts Inventory | ✅ | ✅ | ✅ |
| Maintenance Calendar | ✅ | ✅ | ✅ |
| AI Insights & Reports | ❌ | ✅ | ✅ |
| Regulatory Compliance | ❌ | ✅ | ✅ |
| API & Ingestion Contracts | ❌ | ✅ | ✅ |
| Predictive Alerts | ❌ | ❌ | ✅ |
| Dedicated Support | ❌ | ❌ | ✅ |
| Custom Integrations | ❌ | ❌ | ✅ |`,
    },
    {
        id: "tips-best-practices",
        title: "12. Tips & Best Practices",
        order: 12,
        content: `## Tips & Best Practices

### Getting the Most from SkyMaintain

1. **Keep your fleet data current** — regularly update aircraft hours, cycles, and status to ensure accurate analytics and predictions
2. **Use work orders for everything** — even small tasks benefit from tracking for audit and compliance purposes
3. **Set up calibration reminders** — never miss a tool calibration deadline
4. **Review reliability trends weekly** — catch emerging issues before they become costly
5. **Export data regularly** — maintain offline backups of your critical maintenance records

### Keyboard Shortcuts

- **Esc** — close any open modal or panel
- **Tab** — navigate between form fields
- **Enter** — submit forms and confirm actions

### Getting Help

- **AI Assistant** — click the purple button in the bottom-right corner
- **Documentation** — accessible from the sidebar under "Documentation"
- **Contact Support** — visit skymaintain.ai/contact
- **Email** — support@skymaintain.ai

### Regulatory Compliance Tips

- Document all maintenance decisions using **Decision Events**
- Use the **audit trail** to demonstrate compliance during inspections
- Keep **engineering orders** up to date with latest ADs and SBs
- Monitor **MEL deferrals** daily to avoid exceedances`,
    },
];

/**
 * GET /api/user-guide — returns guide content (public, no auth required)
 */
export async function GET() {
    if (!supabaseServer) {
        return NextResponse.json(getDefaultGuide());
    }

    try {
        const { data, error } = await supabaseServer
            .from(GUIDE_TABLE)
            .select("*")
            .eq("id", GUIDE_ID)
            .single();

        if (error || !data) {
            return NextResponse.json(getDefaultGuide());
        }

        return NextResponse.json({
            id: data.id,
            title: data.title || "SkyMaintain User Guide",
            sections: data.sections || DEFAULT_SECTIONS,
            updated_at: data.updated_at,
            updated_by: data.updated_by,
        });
    } catch {
        return NextResponse.json(getDefaultGuide());
    }
}

/**
 * PUT /api/user-guide — update guide (super_admin only)
 */
export async function PUT(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "super_admin") {
        return NextResponse.json({ error: "Only super admins can edit the user guide" }, { status: 403 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await req.json();
    const { title, sections } = body;

    if (!sections || !Array.isArray(sections)) {
        return NextResponse.json({ error: "sections array is required" }, { status: 400 });
    }

    try {
        // Upsert — insert if not exists, update if exists
        const { data, error } = await supabaseServer
            .from(GUIDE_TABLE)
            .upsert({
                id: GUIDE_ID,
                title: title || "SkyMaintain User Guide",
                sections,
                updated_at: new Date().toISOString(),
                updated_by: session.email,
            })
            .select()
            .single();

        if (error) {
            console.error("[user-guide] Save error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            id: data.id,
            title: data.title,
            sections: data.sections,
            updated_at: data.updated_at,
            updated_by: data.updated_by,
        });
    } catch (e) {
        console.error("[user-guide] Save error:", e);
        return NextResponse.json({ error: "Failed to save guide" }, { status: 500 });
    }
}

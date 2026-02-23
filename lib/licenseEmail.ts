/**
 * License Code Email Delivery
 *
 * Generates and sends a branded email containing the subscriber's
 * unique license key after successful payment.
 */

import { sendEmail, type EmailMessage } from "@/lib/email";
import { PLAN_DISPLAY_NAMES, type LicensePlan, type BillingInterval } from "@/lib/license";

export type LicenseEmailData = {
    email: string;
    name?: string;
    orgName?: string;
    licenseKey: string;
    plan: LicensePlan;
    billingInterval: BillingInterval;
    expiresAt: string; // ISO date string
};

export function generateLicenseEmail(data: LicenseEmailData): EmailMessage {
    const { email, name, licenseKey, plan, billingInterval, expiresAt, orgName } = data;
    const displayName = name || email.split("@")[0];
    const planName = PLAN_DISPLAY_NAMES[plan] || "SkyMaintain";
    const renewalLabel = billingInterval === "yearly" ? "annually" : "monthly";
    const expiryDate = new Date(expiresAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const subject = `Your SkyMaintain ${planName} License Key`;

    const text = `
Your SkyMaintain License Key
=============================

Hi ${displayName},

Thank you for subscribing to SkyMaintain ${planName} Plan! Your unique license key is ready.

LICENSE KEY
${licenseKey}

LICENSE DETAILS
- Plan: ${planName}
- Organization: ${orgName || "Your Organization"}
- Billing: Renews ${renewalLabel}
- Valid Until: ${expiryDate}
- Status: Active

IMPORTANT
- Keep this license key confidential. It is tied to your subscription.
- Enter this code in the License Code field when signing in to activate your plan.
- Your license will automatically renew with your subscription.
- If your subscription lapses, the license will be suspended.

GETTING STARTED
1. Sign in at https://www.skymaintain.ai/signin
2. Enter your license key in the "License Code" field
3. Access your full ${planName} features

NEED HELP?
- Documentation: https://www.skymaintain.ai/docs
- Contact Support: support@skymaintain.ai

Best regards,
The SkyMaintain Team
`.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your SkyMaintain License Key</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Your License Key</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">SkyMaintain ${planName} Plan</p>
        </div>

        <!-- Body -->
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 24px 0;">
                Hi ${displayName},
            </p>
            <p style="font-size: 16px; color: #334155; margin: 0 0 24px 0;">
                Thank you for subscribing! Your unique license key has been generated and is ready for use.
            </p>

            <!-- License Key Box -->
            <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 24px; margin: 0 0 24px 0; text-align: center;">
                <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #065f46; margin: 0 0 12px 0;">
                    YOUR LICENSE KEY
                </div>
                <div style="font-size: 24px; font-weight: 700; font-family: 'Courier New', Courier, monospace; color: #14532d; letter-spacing: 2px; word-break: break-all;">
                    ${licenseKey}
                </div>
                <div style="font-size: 12px; color: #059669; margin-top: 12px;">
                    Keep this key confidential — it is tied to your subscription
                </div>
            </div>

            <!-- License Details -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
                <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">License Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Plan:</td>
                        <td style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${planName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Organization:</td>
                        <td style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${orgName || "Your Organization"}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Renewal:</td>
                        <td style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 600;">Renews ${renewalLabel}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Valid Until:</td>
                        <td style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${expiryDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Status:</td>
                        <td style="padding: 6px 0; color: #059669; font-size: 14px; font-weight: 600;">✓ Active</td>
                    </tr>
                </table>
            </div>

            <!-- Instructions -->
            <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">How to Activate</h3>
            <ol style="margin: 0 0 24px 0; padding: 0 0 0 20px; color: #475569;">
                <li style="margin-bottom: 8px;">Sign in at <a href="https://www.skymaintain.ai/signin" style="color: #155dfc;">skymaintain.ai/signin</a></li>
                <li style="margin-bottom: 8px;">Enter the license key above in the <strong>"License Code"</strong> field</li>
                <li style="margin-bottom: 8px;">Your ${planName} features will be unlocked immediately</li>
            </ol>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="https://www.skymaintain.ai/signin" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px;">
                    Sign In &amp; Activate
                </a>
            </div>

            <!-- Warning -->
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 0 0 24px 0;">
                <p style="font-size: 13px; color: #92400e; margin: 0;">
                    <strong>Important:</strong> Your license automatically renews with your subscription. If payment fails or you cancel, the license will be suspended. To reactivate, update your payment method in the billing portal.
                </p>
            </div>

            <!-- Help -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
                <p style="font-size: 14px; color: #64748b; margin: 0;">
                    Need help? Contact us at <a href="mailto:support@skymaintain.ai" style="color: #155dfc;">support@skymaintain.ai</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} SkyMaintain. All rights reserved.</p>
            <p style="margin: 0;">AI-Powered Aircraft Maintenance Intelligence</p>
        </div>
    </div>
</body>
</html>
`.trim();

    return {
        to: email,
        subject,
        text,
        html,
    };
}

export async function sendLicenseEmail(data: LicenseEmailData): Promise<{ success: boolean; error?: string }> {
    const message = generateLicenseEmail(data);
    return sendEmail(message);
}

import nodemailer from "nodemailer";

export type EmailConfig = {
    host: string;
    port: number;
    secure: boolean;
    from: string;
    replyTo?: string;
    auth?: {
        user: string;
        pass: string;
    };
};

export type EmailMessage = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

function getEmailConfig(): EmailConfig | null {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const from = process.env.SMTP_FROM;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const replyTo = process.env.SMTP_REPLY_TO;

    if (!host || !from) {
        return null;
    }

    return {
        host,
        port,
        secure: port === 465,
        from: from.includes("<") ? from : `SkyMaintain <${from}>`,
        replyTo,
        auth: user && pass ? { user, pass } : undefined,
    };
}

export async function sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const config = getEmailConfig();

    if (!config) {
        console.warn("Email not configured. Missing SMTP_HOST or SMTP_FROM.");
        return { success: false, error: "Email not configured" };
    }

    try {
        const transport = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
        });

        await transport.verify();

        const result = await transport.sendMail({
            from: config.from,
            replyTo: config.replyTo,
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html,
        });

        return {
            success: true,
            messageId: result.messageId,
        };
    } catch (error) {
        console.error("Failed to send email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export type WelcomeEmailData = {
    email: string;
    name?: string;
    orgName?: string;
    subscriptionType: "trial" | "starter" | "professional" | "enterprise";
    trialExpiresAt?: string;
};

export function generateWelcomeEmail(data: WelcomeEmailData): EmailMessage {
    const { email, name, orgName, subscriptionType, trialExpiresAt } = data;

    const displayName = name || email.split("@")[0];
    const isTrial = subscriptionType === "trial";

    const trialExpiryDate = trialExpiresAt
        ? new Date(trialExpiresAt).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        : "14 days from now";

    const planNames: Record<string, string> = {
        trial: "14-Day Free Trial",
        starter: "Starter Plan",
        professional: "Professional Plan",
        enterprise: "Enterprise Plan",
    };

    const planName = planNames[subscriptionType] || "SkyMaintain Subscription";

    const subject = isTrial
        ? `Welcome to SkyMaintain - Your 14-Day Trial Has Started!`
        : `Welcome to SkyMaintain - Your ${planName} is Active!`;

    const text = isTrial
        ? `
Welcome to SkyMaintain, ${displayName}!

Your 14-day free trial has started. Here's what you need to know:

TRIAL DETAILS
- Plan: ${planName}
- Organization: ${orgName || "Your Organization"}
- Trial Expires: ${trialExpiryDate}

WHAT YOU CAN DO
- Access AI-powered maintenance predictions
- Generate regulatory compliance documentation
- Use our aircraft maintenance manuals database
- Get predictive alerts for your fleet

GETTING STARTED
1. Sign in at https://www.skymaintain.ai/signin
2. Complete your profile setup
3. Add your aircraft to get started
4. Explore the AI Assistant for maintenance insights

NEED HELP?
- Documentation: https://www.skymaintain.ai/docs
- Contact Support: support@skymaintain.ai

UPGRADE YOUR PLAN
To continue after your trial, visit our pricing page:
https://www.skymaintain.ai/pricing

Thank you for choosing SkyMaintain for your aviation maintenance intelligence needs.

Best regards,
The SkyMaintain Team
`
        : `
Welcome to SkyMaintain, ${displayName}!

Thank you for subscribing to ${planName}. Your account is now active.

SUBSCRIPTION DETAILS
- Plan: ${planName}
- Organization: ${orgName || "Your Organization"}
- Status: Active

WHAT'S INCLUDED
- AI-powered maintenance predictions
- Full regulatory compliance documentation
- Complete aircraft maintenance manuals database
- Predictive alerts and fleet health monitoring
- Priority support

GETTING STARTED
1. Sign in at https://www.skymaintain.ai/signin
2. Complete your profile setup
3. Add your aircraft to get started
4. Explore the AI Assistant for maintenance insights

NEED HELP?
- Documentation: https://www.skymaintain.ai/docs
- Contact Support: support@skymaintain.ai
- Manage Subscription: https://www.skymaintain.ai/app/settings

Thank you for choosing SkyMaintain for your aviation maintenance intelligence needs.

Best regards,
The SkyMaintain Team
`;

    const html = isTrial
        ? `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SkyMaintain</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #155dfc 0%, #1447e6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to SkyMaintain</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Your 14-Day Free Trial Has Started!</p>
        </div>
        
        <!-- Body -->
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 24px 0;">
                Hi ${displayName},
            </p>
            <p style="font-size: 16px; color: #334155; margin: 0 0 24px 0;">
                Thank you for starting your free trial with SkyMaintain. You now have full access to our AI-powered aircraft maintenance intelligence platform.
            </p>
            
            <!-- Trial Info Box -->
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
                <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">Trial Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; color: #78716c; font-size: 14px;">Plan:</td>
                        <td style="padding: 4px 0; color: #1c1917; font-size: 14px; font-weight: 600;">${planName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #78716c; font-size: 14px;">Organization:</td>
                        <td style="padding: 4px 0; color: #1c1917; font-size: 14px; font-weight: 600;">${orgName || "Your Organization"}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #78716c; font-size: 14px;">Trial Expires:</td>
                        <td style="padding: 4px 0; color: #1c1917; font-size: 14px; font-weight: 600;">${trialExpiryDate}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Features -->
            <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">What You Can Do</h3>
            <ul style="margin: 0 0 24px 0; padding: 0 0 0 20px; color: #475569;">
                <li style="margin-bottom: 8px;">Access AI-powered maintenance predictions</li>
                <li style="margin-bottom: 8px;">Generate regulatory compliance documentation</li>
                <li style="margin-bottom: 8px;">Use our aircraft maintenance manuals database</li>
                <li style="margin-bottom: 8px;">Get predictive alerts for your fleet</li>
            </ul>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="https://www.skymaintain.ai/signin" style="display: inline-block; background: linear-gradient(135deg, #155dfc 0%, #1447e6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px;">
                    Get Started
                </a>
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
            <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} SkyMaintain. All rights reserved.</p>
            <p style="margin: 0;">AI-Powered Aircraft Maintenance Intelligence</p>
        </div>
    </div>
</body>
</html>
`
        : `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SkyMaintain</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to SkyMaintain</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Your ${planName} is Now Active!</p>
        </div>
        
        <!-- Body -->
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 24px 0;">
                Hi ${displayName},
            </p>
            <p style="font-size: 16px; color: #334155; margin: 0 0 24px 0;">
                Thank you for subscribing to SkyMaintain! Your ${planName} is now active and you have full access to our AI-powered aircraft maintenance intelligence platform.
            </p>
            
            <!-- Subscription Info Box -->
            <div style="background: #d1fae5; border: 1px solid #34d399; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
                <h3 style="color: #065f46; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">Subscription Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; color: #047857; font-size: 14px;">Plan:</td>
                        <td style="padding: 4px 0; color: #064e3b; font-size: 14px; font-weight: 600;">${planName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #047857; font-size: 14px;">Organization:</td>
                        <td style="padding: 4px 0; color: #064e3b; font-size: 14px; font-weight: 600;">${orgName || "Your Organization"}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #047857; font-size: 14px;">Status:</td>
                        <td style="padding: 4px 0; color: #064e3b; font-size: 14px; font-weight: 600;">✓ Active</td>
                    </tr>
                </table>
            </div>
            
            <!-- Features -->
            <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">What's Included</h3>
            <ul style="margin: 0 0 24px 0; padding: 0 0 0 20px; color: #475569;">
                <li style="margin-bottom: 8px;">AI-powered maintenance predictions</li>
                <li style="margin-bottom: 8px;">Full regulatory compliance documentation</li>
                <li style="margin-bottom: 8px;">Complete aircraft maintenance manuals database</li>
                <li style="margin-bottom: 8px;">Predictive alerts and fleet health monitoring</li>
                <li style="margin-bottom: 8px;">Priority support</li>
            </ul>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="https://www.skymaintain.ai/signin" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px;">
                    Go to Dashboard
                </a>
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
            <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} SkyMaintain. All rights reserved.</p>
            <p style="margin: 0;">AI-Powered Aircraft Maintenance Intelligence</p>
        </div>
    </div>
</body>
</html>
`;

    return {
        to: email,
        subject,
        text: text.trim(),
        html: html.trim(),
    };
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<{ success: boolean; error?: string }> {
    const message = generateWelcomeEmail(data);
    return sendEmail(message);
}

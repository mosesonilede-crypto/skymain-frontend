import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from "@/lib/rateLimit";

type ContactCard = {
    title: string;
    description: string;
    email: string;
};

type ContactDoc = {
    badge: string;
    headline: string;
    subhead: string;
    cards: ContactCard[];
    cta_band: {
        headline: string;
        primary: { label: string; href: string };
        secondary: { label: string; href: string };
    };
};

type ContactFormPayload = {
    intent: string;
    name: string;
    email: string;
    organization?: string;
    subject: string;
    message: string;
};

// Email configuration - in production, use environment variables
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@skymaintain.ai';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@skymaintain.ai';
const PARTNERSHIPS_EMAIL = process.env.PARTNERSHIPS_EMAIL || 'partnerships@skymaintain.ai';

const CONTACT_DOC: ContactDoc = {
    badge: "Contact Us",
    headline: "Contact SkyMaintain",
    subhead: "We'd love to hear from you.",
    cards: [
        {
            title: "General Inquiries",
            description: "Questions about SkyMaintain or general information",
            email: CONTACT_EMAIL,
        },
        {
            title: "Support",
            description: "Technical support and customer assistance",
            email: SUPPORT_EMAIL,
        },
        {
            title: "Business & Partnerships",
            description: "Partnership opportunities and business inquiries",
            email: PARTNERSHIPS_EMAIL,
        },
    ],
    cta_band: {
        headline: "Ready to get started?",
        primary: { label: "Request a Demo", href: "/contact?intent=demo" },
        secondary: { label: "Contact Us", href: "/contact?intent=general" },
    },
};

export async function GET() {
    return NextResponse.json(
        { ok: true, data: CONTACT_DOC },
        {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        }
    );
}

function getRecipientEmail(intent: string): string {
    switch (intent) {
        case 'support':
            return SUPPORT_EMAIL;
        case 'partnerships':
            return PARTNERSHIPS_EMAIL;
        case 'demo':
        case 'pricing':
            return CONTACT_EMAIL;
        default:
            return CONTACT_EMAIL;
    }
}

async function sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    replyTo: string
): Promise<void> {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'noreply@skymaintain.ai';

    // If SMTP is configured, send real email
    if (host && user && pass) {
        const { createTransport } = await import("nodemailer");
        const transport = createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });

        await transport.sendMail({
            from,
            to,
            replyTo,
            subject,
            html: htmlBody,
        });

        console.info("Contact form email sent successfully");
        return;
    }

    // Fallback: warn when SMTP not configured
    console.warn("CONTACT FORM: SMTP not configured — message not delivered");
}

export async function POST(request: NextRequest) {
    // Rate limit by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const rateCheck = checkRateLimit(`contact:${ip}`, RATE_LIMITS.contact);

    if (!rateCheck.allowed) {
        return NextResponse.json(
            { ok: false, error: "Too many requests. Please try again later." },
            { status: 429, headers: getRateLimitHeaders(rateCheck, RATE_LIMITS.contact) }
        );
    }

    try {
        const payload: ContactFormPayload = await request.json();

        // Validate required fields
        if (!payload.name?.trim() || !payload.email?.trim() || !payload.subject?.trim() || !payload.message?.trim()) {
            return NextResponse.json(
                { ok: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            return NextResponse.json(
                { ok: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const recipientEmail = getRecipientEmail(payload.intent);

        // Build HTML email body
        const htmlBody = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; line-height: 1.6;">
                <h2 style="color: #111827; margin-bottom: 20px;">New Contact Form Submission</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 150px; background-color: #f9fafb;">Request Type:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(payload.intent)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">Name:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(payload.name)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">Email:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td>
                    </tr>
                    ${payload.organization
                ? `<tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">Organization:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(payload.organization)}</td>
                    </tr>`
                : ''
            }
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">Subject:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(payload.subject)}</td>
                    </tr>
                </table>

                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #111827;">Message:</h3>
                    <p style="white-space: pre-wrap; word-break: break-word;">${escapeHtml(payload.message)}</p>
                </div>

                <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 12px; color: #6b7280;">
                    <p>This email was sent from the SkyMaintain contact form.</p>
                    <p>Reply-To: <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
                </div>
            </div>
        `;

        // Send email via your email service
        await sendEmail(
            recipientEmail,
            `[SkyMaintain] ${escapeHtml(payload.subject)}`,
            htmlBody,
            payload.email
        );

        // Also send confirmation to user
        const confirmationHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; line-height: 1.6;">
                <h2 style="color: #111827; margin-bottom: 20px;">We've received your request</h2>
                
                <p>Hi ${escapeHtml(payload.name)},</p>
                
                <p>Thank you for contacting SkyMaintain. We've received your ${escapeHtml(payload.intent)} request and will review it shortly.</p>
                
                <p><strong>What you submitted:</strong></p>
                <ul style="color: #4b5563;">
                    <li><strong>Type:</strong> ${escapeHtml(payload.intent)}</li>
                    <li><strong>Subject:</strong> ${escapeHtml(payload.subject)}</li>
                    ${payload.organization ? `<li><strong>Organization:</strong> ${escapeHtml(payload.organization)}</li>` : ''}
                </ul>
                
                <p>We typically respond within 24-48 hours during business hours. If your request is time-sensitive, please reach out to <a href="mailto:support@skymaintain.ai">support@skymaintain.ai</a> directly.</p>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 12px; color: #6b7280;">
                    <p>Best regards,<br/>The SkyMaintain Team</p>
                </div>
            </div>
        `;

        await sendEmail(
            payload.email,
            'Re: Your SkyMaintain Contact Request',
            confirmationHtml,
            CONTACT_EMAIL
        );

        return NextResponse.json(
            { ok: true, data: { received: true } },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form submission error:', error);
        return NextResponse.json(
            { ok: false, error: 'Failed to process contact request' },
            { status: 500 }
        );
    }
}

function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

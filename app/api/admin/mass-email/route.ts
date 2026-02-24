import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { requireSuperAdminSession } from "@/lib/auth/guards";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabaseAdmin() {
    if (!supabaseUrl || !supabaseServiceKey) {
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

// Fallback: Fetch all users from Supabase Auth admin API
async function listAllAuthUsers(): Promise<Array<{ email: string; full_name?: string; subscription_status?: string; trial_expires_at?: string }>> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const allUsers: User[] = [];
    const perPage = 200;
    const maxPages = 50;

    try {
        for (let page = 1; page <= maxPages; page += 1) {
            const { data, error } = await supabase.auth.admin.listUsers({
                page,
                perPage,
            });
            if (error) throw error;

            const users = data?.users || [];
            allUsers.push(...users);

            if (users.length < perPage) break;
        }

        // Map auth users to the expected format
        return allUsers
            .filter((u) => u.email)
            .map((u) => {
                const metadata = (u.user_metadata || {}) as Record<string, unknown>;
                return {
                    email: u.email!,
                    full_name: (metadata.full_name as string) || (metadata.name as string) || undefined,
                    subscription_status: (metadata.subscription_status as string) || undefined,
                    trial_expires_at: (metadata.trial_expires_at as string) || undefined,
                };
            });
    } catch (error) {
        console.error("Error listing auth users:", error);
        return [];
    }
}

export type AnnouncementType = "announcement" | "update" | "maintenance" | "security" | "newsletter";

export type MassEmailRequest = {
    subject: string;
    body: string;
    type: AnnouncementType;
    targetAudience: "all" | "active" | "trial" | "paid";
};

function generateAnnouncementEmail(
    subject: string,
    body: string,
    type: AnnouncementType,
    recipientName?: string
): { html: string; text: string } {
    const displayName = recipientName || "Valued User";

    const typeLabels: Record<AnnouncementType, { label: string; color: string }> = {
        announcement: { label: "Announcement", color: "#3b82f6" },
        update: { label: "Platform Update", color: "#22c55e" },
        maintenance: { label: "Scheduled Maintenance", color: "#f59e0b" },
        security: { label: "Security Notice", color: "#ef4444" },
        newsletter: { label: "Newsletter", color: "#8b5cf6" },
    };

    const { label, color } = typeLabels[type];

    // Convert body text to HTML paragraphs
    const bodyHtml = body
        .split("\n\n")
        .map((para) => `<p style="margin: 0 0 16px 0; line-height: 1.6;">${para.replace(/\n/g, "<br>")}</p>`)
        .join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; text-align: center;">
                            <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://app.skymaintain.ai'}/brand/SkyMaintain_logo.png" alt="SkyMaintain" width="160" style="display: block; margin: 0 auto 16px auto; height: auto; max-height: 44px;" />
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">SkyMaintain</h1>
                        </td>
                    </tr>
                    
                    <!-- Type Badge -->
                    <tr>
                        <td style="padding: 24px 40px 0;">
                            <span style="display: inline-block; background-color: ${color}; color: #ffffff; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">${label}</span>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 24px 40px 40px;">
                            <p style="margin: 0 0 24px 0; font-size: 16px; color: #475569;">Hello ${displayName},</p>
                            
                            <div style="font-size: 15px; color: #334155;">
                                ${bodyHtml}
                            </div>
                            
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                            
                            <p style="margin: 0; font-size: 14px; color: #64748b;">
                                Best regards,<br>
                                <strong style="color: #1e293b;">The SkyMaintain Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f1f5f9; padding: 24px 40px; text-align: center;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
                                This email was sent to you as a registered user of SkyMaintain.
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                                © ${new Date().getFullYear()} SkyMaintain. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const text = `
${label.toUpperCase()}

${subject}

Hello ${displayName},

${body}

Best regards,
The SkyMaintain Team

---
This email was sent to you as a registered user of SkyMaintain.
© ${new Date().getFullYear()} SkyMaintain. All rights reserved.
`.trim();

    return { html, text };
}

export async function POST(request: NextRequest) {
    // Super Admin role check
    const authResult = requireSuperAdminSession(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const body = await request.json();
        const { subject, body: messageBody, type, targetAudience } = body as MassEmailRequest;

        // Validate required fields
        if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
            return NextResponse.json({ error: "Subject is required" }, { status: 400 });
        }

        if (!messageBody || typeof messageBody !== "string" || messageBody.trim().length === 0) {
            return NextResponse.json({ error: "Message body is required" }, { status: 400 });
        }

        if (!type || !["announcement", "update", "maintenance", "security", "newsletter"].includes(type)) {
            return NextResponse.json({ error: "Invalid announcement type" }, { status: 400 });
        }

        if (!targetAudience || !["all", "active", "trial", "paid"].includes(targetAudience)) {
            return NextResponse.json({ error: "Invalid target audience" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        if (!supabase) {
            return NextResponse.json(
                { error: "Server configuration error: Supabase not configured" },
                { status: 500 }
            );
        }

        // Try to fetch users from user_profiles table first, fallback to Auth users
        let users: Array<{ email: string; full_name?: string | null; subscription_status?: string | null; trial_expires_at?: string | null }> = [];

        try {
            // First try user_profiles table
            let query = supabase
                .from("user_profiles")
                .select("id, email, full_name, subscription_status, trial_expires_at")
                .not("email", "is", null);

            if (targetAudience === "active") {
                const now = new Date().toISOString();
                query = query.or(`subscription_status.eq.active,trial_expires_at.gt.${now}`);
            } else if (targetAudience === "trial") {
                const now = new Date().toISOString();
                query = query
                    .is("subscription_status", null)
                    .gt("trial_expires_at", now);
            } else if (targetAudience === "paid") {
                query = query.eq("subscription_status", "active");
            }

            const { data: profileUsers, error: fetchError } = await query;

            if (!fetchError && profileUsers && profileUsers.length > 0) {
                users = profileUsers.filter((u) => u.email).map((u) => ({
                    email: u.email!,
                    full_name: u.full_name,
                    subscription_status: u.subscription_status,
                    trial_expires_at: u.trial_expires_at,
                }));
            } else {
                // Fallback to Auth users
                console.warn("Falling back to Auth users for mass email");
                const authUsers = await listAllAuthUsers();

                // Filter by audience if needed
                if (targetAudience === "all") {
                    users = authUsers;
                } else if (targetAudience === "active") {
                    const now = new Date();
                    users = authUsers.filter((u) =>
                        u.subscription_status === "active" ||
                        (u.trial_expires_at && new Date(u.trial_expires_at) > now)
                    );
                } else if (targetAudience === "trial") {
                    const now = new Date();
                    users = authUsers.filter((u) =>
                        !u.subscription_status &&
                        u.trial_expires_at &&
                        new Date(u.trial_expires_at) > now
                    );
                } else if (targetAudience === "paid") {
                    users = authUsers.filter((u) => u.subscription_status === "active");
                }
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            // Try auth fallback as last resort
            const authUsers = await listAllAuthUsers();
            if (authUsers.length > 0) {
                users = authUsers;
            } else {
                return NextResponse.json(
                    { error: "Failed to fetch users from database" },
                    { status: 500 }
                );
            }
        }

        if (!users || users.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No users found matching the target audience",
                sentCount: 0,
                failedCount: 0,
            });
        }

        // Send emails in batches to avoid overwhelming the SMTP server
        const BATCH_SIZE = 10;
        const BATCH_DELAY = 1000; // 1 second between batches

        let sentCount = 0;
        let failedCount = 0;
        const errors: string[] = [];

        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            const batch = users.slice(i, i + BATCH_SIZE);

            const results = await Promise.all(
                batch.map(async (user) => {
                    try {
                        const { html, text } = generateAnnouncementEmail(
                            subject.trim(),
                            messageBody.trim(),
                            type,
                            user.full_name || undefined
                        );

                        const result = await sendEmail({
                            to: user.email,
                            subject: subject.trim(),
                            html,
                            text,
                        });

                        return result;
                    } catch (error) {
                        return {
                            success: false,
                            error: error instanceof Error ? error.message : "Unknown error",
                        };
                    }
                })
            );

            results.forEach((result, index) => {
                if (result.success) {
                    sentCount++;
                } else {
                    failedCount++;
                    errors.push(`${batch[index].email}: ${result.error}`);
                }
            });

            // Wait between batches (except for the last batch)
            if (i + BATCH_SIZE < users.length) {
                await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
            }
        }

        return NextResponse.json({
            success: true,
            message: `Mass email sent successfully`,
            sentCount,
            failedCount,
            totalTargeted: users.length,
            errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Limit error details
        });
    } catch (error) {
        console.error("Mass email error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

// GET endpoint to preview email count
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const targetAudience = searchParams.get("audience") || "all";

        if (!["all", "active", "trial", "paid"].includes(targetAudience)) {
            return NextResponse.json({ error: "Invalid target audience" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        if (!supabase) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        let count = 0;

        try {
            // Try user_profiles table first
            let query = supabase
                .from("user_profiles")
                .select("id", { count: "exact", head: true })
                .not("email", "is", null);

            if (targetAudience === "active") {
                const now = new Date().toISOString();
                query = query.or(`subscription_status.eq.active,trial_expires_at.gt.${now}`);
            } else if (targetAudience === "trial") {
                const now = new Date().toISOString();
                query = query
                    .is("subscription_status", null)
                    .gt("trial_expires_at", now);
            } else if (targetAudience === "paid") {
                query = query.eq("subscription_status", "active");
            }

            const { count: profileCount, error } = await query;

            if (!error && profileCount !== null) {
                count = profileCount;
            } else {
                // Fallback to Auth users
                console.warn("Falling back to Auth users for count");
                const authUsers = await listAllAuthUsers();

                if (targetAudience === "all") {
                    count = authUsers.length;
                } else if (targetAudience === "active") {
                    const now = new Date();
                    count = authUsers.filter((u) =>
                        u.subscription_status === "active" ||
                        (u.trial_expires_at && new Date(u.trial_expires_at) > now)
                    ).length;
                } else if (targetAudience === "trial") {
                    const now = new Date();
                    count = authUsers.filter((u) =>
                        !u.subscription_status &&
                        u.trial_expires_at &&
                        new Date(u.trial_expires_at) > now
                    ).length;
                } else if (targetAudience === "paid") {
                    count = authUsers.filter((u) => u.subscription_status === "active").length;
                }
            }
        } catch (error) {
            console.error("Error counting users from profiles:", error);
            // Try auth fallback
            const authUsers = await listAllAuthUsers();
            count = authUsers.length;
        }

        return NextResponse.json({
            audience: targetAudience,
            count,
        });
    } catch (error) {
        console.error("Count users error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

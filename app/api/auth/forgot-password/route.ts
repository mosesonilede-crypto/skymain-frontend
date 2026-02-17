import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublicSiteUrl } from "@/lib/siteUrl";

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase().trim();

        const supabase = getSupabaseAdmin();
        if (!supabase) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Get the site URL for the redirect
        const siteUrl = getPublicSiteUrl();
        const redirectTo = `${siteUrl}/reset-password`;

        // Send password reset email via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(emailLower, {
            redirectTo,
        });

        if (error) {
            console.error("Password reset error:", error);
            // Don't reveal if email exists or not for security
            return NextResponse.json({
                success: true,
                message: "If an account exists with this email, you will receive a password reset link.",
            });
        }

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, you will receive a password reset link.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

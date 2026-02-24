import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

/**
 * POST /api/settings/change-password
 * Verifies current password, then updates to new password via Supabase Admin API.
 */
export async function POST(req: NextRequest) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = verifyPayload<SessionPayload>(token);
    if (!session || session.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    let body: { currentPassword?: string; newPassword?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
        return NextResponse.json(
            { error: "Both currentPassword and newPassword are required" },
            { status: 400 }
        );
    }

    if (newPassword.length < 8) {
        return NextResponse.json(
            { error: "New password must be at least 8 characters" },
            { status: 400 }
        );
    }

    if (!supabaseServer) {
        return NextResponse.json(
            { error: "Authentication service unavailable" },
            { status: 503 }
        );
    }

    try {
        // Step 1: Verify current password by attempting sign-in
        const { error: signInError } = await supabaseServer.auth.signInWithPassword({
            email: session.email,
            password: currentPassword,
        });

        if (signInError) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 }
            );
        }

        // Step 2: Find user by email via admin API
        const { data: userList, error: listError } = await supabaseServer.auth.admin.listUsers();
        if (listError) {
            console.error("Admin listUsers error:", listError);
            return NextResponse.json(
                { error: "Unable to verify account" },
                { status: 500 }
            );
        }

        const user = userList?.users?.find(
            (u) => u.email?.toLowerCase() === session.email.toLowerCase()
        );
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Step 3: Update password via admin API (bypasses RLS)
        const { error: updateError } = await supabaseServer.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        );

        if (updateError) {
            console.error("Password update error:", updateError);
            return NextResponse.json(
                { error: "Failed to update password. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "Password updated successfully" });
    } catch (e) {
        console.error("Change password error:", e);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

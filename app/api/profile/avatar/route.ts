/**
 * POST /api/profile/avatar  — Upload a profile picture to Supabase Storage
 * DELETE /api/profile/avatar — Remove the current profile picture
 *
 * Accepts multipart/form-data with a single "file" field.
 * Stores in Supabase Storage bucket "avatars" under the user's email hash.
 * Updates user_profiles.avatar_url with the public URL.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { supabaseServer } from "@/lib/supabaseServer";
import crypto from "crypto";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";
const BUCKET = "avatars";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

type SessionPayload = {
    email: string;
    role?: string;
    exp: number;
};

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

function emailHash(email: string): string {
    return crypto.createHash("sha256").update(email.toLowerCase().trim()).digest("hex").slice(0, 16);
}

// POST: Upload avatar
export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session?.email) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.map(t => t.split("/")[1]).join(", ")}` },
                { status: 400 }
            );
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
                { status: 400 }
            );
        }

        const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
        const hash = emailHash(session.email);
        const storagePath = `${hash}/avatar.${ext}`;

        // Read file as buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Ensure the storage bucket exists (auto-create if needed)
        const { data: buckets } = await supabaseServer.storage.listBuckets();
        if (!buckets?.find((b) => b.name === BUCKET)) {
            const { error: createErr } = await supabaseServer.storage.createBucket(BUCKET, {
                public: true,
                fileSizeLimit: MAX_FILE_SIZE,
                allowedMimeTypes: ALLOWED_TYPES,
            });
            if (createErr) {
                console.error("Bucket creation error:", createErr);
                return NextResponse.json({ error: "Storage setup failed" }, { status: 500 });
            }
        }

        // Delete any existing avatar files for this user (different extensions)
        try {
            const { data: existingFiles } = await supabaseServer.storage
                .from(BUCKET)
                .list(hash);
            if (existingFiles && existingFiles.length > 0) {
                const filesToDelete = existingFiles.map(f => `${hash}/${f.name}`);
                await supabaseServer.storage.from(BUCKET).remove(filesToDelete);
            }
        } catch {
            // Non-critical — old files may linger
        }

        // Upload new avatar
        const { error: uploadError } = await supabaseServer.storage
            .from(BUCKET)
            .upload(storagePath, buffer, {
                contentType: file.type,
                upsert: true,
                cacheControl: "3600",
            });

        if (uploadError) {
            console.error("Avatar upload error:", uploadError);
            return NextResponse.json(
                { error: `Upload failed: ${uploadError.message}` },
                { status: 500 },
            );
        }

        // Get public URL
        const { data: publicUrlData } = supabaseServer.storage
            .from(BUCKET)
            .getPublicUrl(storagePath);

        const avatarUrl = publicUrlData?.publicUrl || "";

        if (!avatarUrl) {
            return NextResponse.json({ error: "Failed to generate avatar URL" }, { status: 500 });
        }

        // Update user_profiles.avatar_url
        const { error: updateError } = await supabaseServer
            .from("user_profiles")
            .update({ avatar_url: avatarUrl })
            .eq("email", session.email);

        if (updateError) {
            console.error("Profile avatar_url update error:", updateError);
            // Avatar uploaded but DB update failed — still return the URL
        }

        return NextResponse.json({ avatar_url: avatarUrl });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE: Remove avatar
export async function DELETE(req: NextRequest) {
    const session = getSession(req);
    if (!session?.email) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    try {
        const hash = emailHash(session.email);

        // List and delete all avatar files for this user
        const { data: existingFiles } = await supabaseServer.storage
            .from(BUCKET)
            .list(hash);

        if (existingFiles && existingFiles.length > 0) {
            const filesToDelete = existingFiles.map(f => `${hash}/${f.name}`);
            await supabaseServer.storage.from(BUCKET).remove(filesToDelete);
        }

        // Clear avatar_url in user_profiles
        await supabaseServer
            .from("user_profiles")
            .update({ avatar_url: "" })
            .eq("email", session.email);

        return NextResponse.json({ avatar_url: "" });
    } catch (error) {
        console.error("Avatar delete error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifyPayload } from "@/lib/twoFactor";
import { normalizeRole } from "@/lib/auth/roles";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

type DemoVideoConfig = {
    source: "upload";
    videoUrl: string;
    fileName: string;
    mimeType: string;
    updatedAt: string;
    updatedBy: string;
};

const SESSION_COOKIE = "sm_session";
const MAX_VIDEO_BYTES = 250 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
]);
const DEMO_STORAGE_BUCKET = process.env.SKYMAINTAIN_DEMO_VIDEO_BUCKET || "demo-media";
const DEMO_VIDEO_PREFIX = "demo-videos";
const DEMO_CONFIG_PATH = `${DEMO_VIDEO_PREFIX}/current.json`;
const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "demo");
const PRIVATE_CONFIG_DIR = path.join(process.cwd(), ".runtime-data");
const CONFIG_PATH = path.join(PRIVATE_CONFIG_DIR, "demo-video.json");

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

async function readConfig(): Promise<DemoVideoConfig | null> {
    if (supabaseServer) {
        try {
            const { data, error } = await supabaseServer.storage
                .from(DEMO_STORAGE_BUCKET)
                .download(DEMO_CONFIG_PATH);

            if (!error && data) {
                const raw = await data.text();
                const parsed = JSON.parse(raw) as Partial<DemoVideoConfig>;
                if (
                    parsed.source === "upload" &&
                    typeof parsed.videoUrl === "string" &&
                    typeof parsed.fileName === "string" &&
                    typeof parsed.mimeType === "string" &&
                    typeof parsed.updatedAt === "string" &&
                    typeof parsed.updatedBy === "string"
                ) {
                    return parsed as DemoVideoConfig;
                }
            }
        } catch {
            // Fall through to local fallback.
        }
    }

    try {
        const raw = await fs.readFile(CONFIG_PATH, "utf8");
        const parsed = JSON.parse(raw) as Partial<DemoVideoConfig>;
        if (
            parsed.source === "upload" &&
            typeof parsed.videoUrl === "string" &&
            typeof parsed.fileName === "string" &&
            typeof parsed.mimeType === "string" &&
            typeof parsed.updatedAt === "string" &&
            typeof parsed.updatedBy === "string"
        ) {
            return parsed as DemoVideoConfig;
        }
        return null;
    } catch {
        return null;
    }
}

async function writeConfig(config: DemoVideoConfig): Promise<void> {
    if (supabaseServer) {
        const payload = JSON.stringify(config, null, 2);
        const { error } = await supabaseServer.storage
            .from(DEMO_STORAGE_BUCKET)
            .upload(DEMO_CONFIG_PATH, Buffer.from(payload), {
                contentType: "application/json",
                upsert: true,
            });

        if (error) {
            throw new Error(error.message || "Failed to persist demo config in storage");
        }

        return;
    }

    await fs.mkdir(PRIVATE_CONFIG_DIR, { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}

async function deleteOldUploadedVideos(exceptName: string): Promise<void> {
    if (supabaseServer) {
        try {
            const { data } = await supabaseServer.storage
                .from(DEMO_STORAGE_BUCKET)
                .list(DEMO_VIDEO_PREFIX, { limit: 100, sortBy: { column: "name", order: "asc" } });

            const stalePaths = (data || [])
                .map((entry) => entry.name)
                .filter((name) => name && name !== exceptName && name !== "current.json")
                .map((name) => `${DEMO_VIDEO_PREFIX}/${name}`);

            if (stalePaths.length > 0) {
                await supabaseServer.storage.from(DEMO_STORAGE_BUCKET).remove(stalePaths);
            }
        } catch {
            // Best effort cleanup only.
        }
        return;
    }

    try {
        const files = await fs.readdir(PUBLIC_UPLOAD_DIR);
        await Promise.all(
            files
                .filter((fileName) => fileName !== exceptName)
                .map((fileName) => fs.unlink(path.join(PUBLIC_UPLOAD_DIR, fileName)).catch(() => undefined))
        );
    } catch {
        // Directory may not exist yet.
    }
}

function requireSuperAdmin(req: NextRequest): SessionPayload | NextResponse {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return session;
}

function extensionFromMime(mimeType: string): string {
    if (mimeType === "video/mp4") return "mp4";
    if (mimeType === "video/webm") return "webm";
    if (mimeType === "video/ogg") return "ogv";
    if (mimeType === "video/quicktime") return "mov";
    return "mp4";
}

export async function GET() {
    const config = await readConfig();
    if (!config) {
        return NextResponse.json({ source: "youtube", youtubeVideoId: "oMcy-bTjvJ0" });
    }

    return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
    const sessionOrResponse = requireSuperAdmin(req);
    if (sessionOrResponse instanceof NextResponse) return sessionOrResponse;

    try {
        const form = await req.formData();
        const uploaded = form.get("video");

        if (!(uploaded instanceof File)) {
            return NextResponse.json({ error: "Video file is required" }, { status: 400 });
        }

        if (!ALLOWED_MIME_TYPES.has(uploaded.type)) {
            return NextResponse.json({ error: "Unsupported video format" }, { status: 400 });
        }

        if (uploaded.size > MAX_VIDEO_BYTES) {
            return NextResponse.json({ error: "Video must be 250MB or smaller" }, { status: 400 });
        }

        const ext = extensionFromMime(uploaded.type);
        const safeBaseName = uploaded.name
            .replace(/\.[^/.]+$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9-_]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") || "demo-video";
        const targetName = `${safeBaseName}-${Date.now()}.${ext}`;
        const targetPath = `${DEMO_VIDEO_PREFIX}/${targetName}`;

        const arrayBuffer = await uploaded.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        let videoUrl = `/uploads/demo/${targetName}`;

        if (supabaseServer) {
            const { error: uploadError } = await supabaseServer.storage
                .from(DEMO_STORAGE_BUCKET)
                .upload(targetPath, fileBuffer, {
                    contentType: uploaded.type,
                    upsert: true,
                });

            if (uploadError) {
                return NextResponse.json({ error: uploadError.message || "Failed to upload demo video" }, { status: 500 });
            }

            const { data: publicData } = supabaseServer.storage
                .from(DEMO_STORAGE_BUCKET)
                .getPublicUrl(targetPath);

            if (!publicData?.publicUrl) {
                return NextResponse.json({ error: "Failed to resolve uploaded video URL" }, { status: 500 });
            }

            videoUrl = publicData.publicUrl;
        } else {
            await fs.mkdir(PUBLIC_UPLOAD_DIR, { recursive: true });
            const outputPath = path.join(PUBLIC_UPLOAD_DIR, targetName);
            await fs.writeFile(outputPath, fileBuffer);
        }

        await deleteOldUploadedVideos(targetName);

        const config: DemoVideoConfig = {
            source: "upload",
            videoUrl,
            fileName: uploaded.name,
            mimeType: uploaded.type,
            updatedAt: new Date().toISOString(),
            updatedBy: sessionOrResponse.email,
        };

        await writeConfig(config);

        return NextResponse.json(config);
    } catch (error) {
        console.error("Demo video upload failed:", error);
        return NextResponse.json({ error: "Failed to upload demo video" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const sessionOrResponse = requireSuperAdmin(req);
    if (sessionOrResponse instanceof NextResponse) return sessionOrResponse;

    try {
        const config = await readConfig();
        if (config?.videoUrl) {
            if (supabaseServer) {
                const normalizedPath = config.videoUrl.startsWith("http")
                    ? new URL(config.videoUrl).pathname
                    : config.videoUrl;
                const fileName = path.basename(normalizedPath);
                await supabaseServer.storage
                    .from(DEMO_STORAGE_BUCKET)
                    .remove([`${DEMO_VIDEO_PREFIX}/${fileName}`])
                    .catch(() => undefined);
            } else {
                const fileName = path.basename(config.videoUrl);
                await fs.unlink(path.join(PUBLIC_UPLOAD_DIR, fileName)).catch(() => undefined);
            }
        }

        if (supabaseServer) {
            await supabaseServer.storage
                .from(DEMO_STORAGE_BUCKET)
                .remove([DEMO_CONFIG_PATH])
                .catch(() => undefined);
        } else {
            await fs.unlink(CONFIG_PATH).catch(() => undefined);
        }

        return NextResponse.json({ source: "youtube", youtubeVideoId: "oMcy-bTjvJ0" });
    } catch (error) {
        console.error("Demo video reset failed:", error);
        return NextResponse.json({ error: "Failed to reset demo video" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
    storagePath?: string;
    storageProvider?: "supabase" | "s3" | "local";
    fileName: string;
    mimeType: string;
    updatedAt: string;
    updatedBy: string;
};

type StorageProvider = "supabase" | "s3" | "local";

type DemoVideoS3InitRequest = {
    action: "init-upload";
    fileName: string;
    mimeType: string;
    fileSize: number;
};

type DemoVideoS3FinalizeRequest = {
    action: "finalize-upload";
    targetPath: string;
    fileName: string;
    mimeType: string;
};

const SESSION_COOKIE = "sm_session";
const MAX_VIDEO_MB = Math.max(1, Number(process.env.SKYMAINTAIN_DEMO_VIDEO_MAX_MB || "50") || 50);
const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
]);
const DEMO_STORAGE_BUCKET = process.env.SKYMAINTAIN_DEMO_VIDEO_BUCKET || "demo-media";
const DEMO_VIDEO_PREFIX = "demo-videos";
const DEMO_CONFIG_PATH = `${DEMO_VIDEO_PREFIX}/current.json`;
const DEMO_SIGNED_URL_TTL_SECONDS = 60 * 60;
const DEMO_VIDEO_PROVIDER_PREFERRED = (process.env.SKYMAINTAIN_DEMO_VIDEO_PROVIDER || "supabase").toLowerCase();

const S3_ENDPOINT = process.env.SKYMAINTAIN_DEMO_VIDEO_S3_ENDPOINT;
const S3_REGION = process.env.SKYMAINTAIN_DEMO_VIDEO_S3_REGION || "auto";
const S3_BUCKET = process.env.SKYMAINTAIN_DEMO_VIDEO_S3_BUCKET || DEMO_STORAGE_BUCKET;
const S3_ACCESS_KEY_ID = process.env.SKYMAINTAIN_DEMO_VIDEO_S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.SKYMAINTAIN_DEMO_VIDEO_S3_SECRET_ACCESS_KEY;
const S3_FORCE_PATH_STYLE = (process.env.SKYMAINTAIN_DEMO_VIDEO_S3_FORCE_PATH_STYLE || "false").toLowerCase() === "true";
const S3_PUBLIC_BASE_URL = (process.env.SKYMAINTAIN_DEMO_VIDEO_S3_PUBLIC_BASE_URL || "").replace(/\/$/, "");
const S3_SIGNED_URL_TTL_SECONDS = Math.max(
    60,
    Number(process.env.SKYMAINTAIN_DEMO_VIDEO_S3_SIGNED_URL_TTL_SECONDS || DEMO_SIGNED_URL_TTL_SECONDS) || DEMO_SIGNED_URL_TTL_SECONDS
);

const hasS3Credentials = Boolean(S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY);
const s3Client = hasS3Credentials
    ? new S3Client({
        region: S3_REGION,
        endpoint: S3_ENDPOINT,
        forcePathStyle: S3_FORCE_PATH_STYLE,
        credentials: {
            accessKeyId: S3_ACCESS_KEY_ID as string,
            secretAccessKey: S3_SECRET_ACCESS_KEY as string,
        },
    })
    : null;

function resolveStorageProvider(): StorageProvider {
    if (DEMO_VIDEO_PROVIDER_PREFERRED === "s3" && s3Client) return "s3";
    if (DEMO_VIDEO_PROVIDER_PREFERRED === "local") return "local";
    if (DEMO_VIDEO_PROVIDER_PREFERRED === "supabase" && supabaseServer) return "supabase";
    if (s3Client) return "s3";
    if (supabaseServer) return "supabase";
    return "local";
}

const ACTIVE_STORAGE_PROVIDER = resolveStorageProvider();
const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "demo");
const PRIVATE_CONFIG_DIR = path.join(process.cwd(), ".runtime-data");
const CONFIG_PATH = path.join(PRIVATE_CONFIG_DIR, "demo-video.json");

async function ensureS3Bucket(): Promise<void> {
    if (ACTIVE_STORAGE_PROVIDER !== "s3" || !s3Client) return;

    try {
        await s3Client.send(new ListObjectsV2Command({ Bucket: S3_BUCKET, MaxKeys: 1 }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown S3 error";
        throw new Error(`S3 demo video bucket is not accessible: ${message}`);
    }
}

async function ensureDemoBucket(): Promise<void> {
    if (ACTIVE_STORAGE_PROVIDER !== "supabase" || !supabaseServer) return;

    try {
        const { data, error } = await supabaseServer.storage.listBuckets();
        if (!error && data?.some((bucket) => bucket.name === DEMO_STORAGE_BUCKET)) {
            return;
        }
    } catch {
        // Continue and try create below.
    }

    const { error: createError } = await supabaseServer.storage.createBucket(DEMO_STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: `${MAX_VIDEO_BYTES}`,
        allowedMimeTypes: [...ALLOWED_MIME_TYPES],
    });

    if (createError && !/already exists|duplicate/i.test(createError.message || "")) {
        throw new Error(createError.message || "Failed to initialize demo media bucket");
    }
}

async function resolvePlayableUrl(config: DemoVideoConfig): Promise<string> {
    if (!config.storagePath) return config.videoUrl;

    if ((config.storageProvider === "s3" || ACTIVE_STORAGE_PROVIDER === "s3") && s3Client) {
        if (S3_PUBLIC_BASE_URL) {
            return `${S3_PUBLIC_BASE_URL}/${config.storagePath}`;
        }

        try {
            return await getSignedUrl(
                s3Client,
                new GetObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: config.storagePath,
                }),
                { expiresIn: S3_SIGNED_URL_TTL_SECONDS }
            );
        } catch {
            return config.videoUrl;
        }
    }

    if (!supabaseServer) return config.videoUrl;

    const { data, error } = await supabaseServer.storage
        .from(DEMO_STORAGE_BUCKET)
        .createSignedUrl(config.storagePath, DEMO_SIGNED_URL_TTL_SECONDS);

    if (!error && data?.signedUrl) {
        return data.signedUrl;
    }

    return config.videoUrl;
}

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

async function readConfig(): Promise<DemoVideoConfig | null> {
    if (ACTIVE_STORAGE_PROVIDER === "s3" && s3Client) {
        try {
            await ensureS3Bucket();
            const response = await s3Client.send(
                new GetObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: DEMO_CONFIG_PATH,
                })
            );

            const raw = await response.Body?.transformToString();
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<DemoVideoConfig>;
                if (
                    parsed.source === "upload" &&
                    typeof parsed.videoUrl === "string" &&
                    typeof parsed.fileName === "string" &&
                    typeof parsed.mimeType === "string" &&
                    typeof parsed.updatedAt === "string" &&
                    typeof parsed.updatedBy === "string"
                ) {
                    const resolved = parsed as DemoVideoConfig;
                    resolved.storageProvider = resolved.storageProvider || "s3";
                    resolved.videoUrl = await resolvePlayableUrl(resolved);
                    return resolved;
                }
            }
        } catch {
            // Fall through to local fallback.
        }
    }

    if (ACTIVE_STORAGE_PROVIDER === "supabase" && supabaseServer) {
        try {
            await ensureDemoBucket();
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
                    const resolved = parsed as DemoVideoConfig;
                    resolved.storageProvider = resolved.storageProvider || "supabase";
                    resolved.videoUrl = await resolvePlayableUrl(resolved);
                    return resolved;
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
    if (ACTIVE_STORAGE_PROVIDER === "s3" && s3Client) {
        await ensureS3Bucket();
        const payload = JSON.stringify(config, null, 2);
        await s3Client.send(
            new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: DEMO_CONFIG_PATH,
                Body: Buffer.from(payload),
                ContentType: "application/json",
            })
        );
        return;
    }

    if (ACTIVE_STORAGE_PROVIDER === "supabase" && supabaseServer) {
        await ensureDemoBucket();
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
    if (ACTIVE_STORAGE_PROVIDER === "s3" && s3Client) {
        const exceptPath = `${DEMO_VIDEO_PREFIX}/${exceptName}`;
        try {
            await ensureS3Bucket();
            const listed = await s3Client.send(
                new ListObjectsV2Command({
                    Bucket: S3_BUCKET,
                    Prefix: `${DEMO_VIDEO_PREFIX}/`,
                    MaxKeys: 100,
                })
            );

            const staleKeys = (listed.Contents || [])
                .map((entry) => entry.Key)
                .filter((key): key is string => Boolean(key))
                .filter((key) => key !== exceptPath && key !== DEMO_CONFIG_PATH);

            await Promise.all(
                staleKeys.map((key) =>
                    s3Client.send(
                        new DeleteObjectCommand({
                            Bucket: S3_BUCKET,
                            Key: key,
                        })
                    )
                )
            );
        } catch {
            // Best effort cleanup only.
        }
        return;
    }

    if (ACTIVE_STORAGE_PROVIDER === "supabase" && supabaseServer) {
        try {
            await ensureDemoBucket();
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

function buildTargetName(fileName: string, mimeType: string): string {
    const ext = extensionFromMime(mimeType);
    const safeBaseName = fileName
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "demo-video";
    return `${safeBaseName}-${Date.now()}.${ext}`;
}

async function buildS3PlaybackUrl(targetPath: string): Promise<string> {
    if (!s3Client) {
        throw new Error("S3 client not configured");
    }

    if (S3_PUBLIC_BASE_URL) {
        return `${S3_PUBLIC_BASE_URL}/${targetPath}`;
    }

    return getSignedUrl(
        s3Client,
        new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: targetPath,
        }),
        { expiresIn: S3_SIGNED_URL_TTL_SECONDS }
    );
}

async function handleS3DirectUpload(req: NextRequest, session: SessionPayload): Promise<NextResponse> {
    if (!s3Client || ACTIVE_STORAGE_PROVIDER !== "s3") {
        return NextResponse.json({ error: "Direct upload is only available when S3 storage provider is active" }, { status: 400 });
    }

    const payload = (await req.json()) as DemoVideoS3InitRequest | DemoVideoS3FinalizeRequest;

    if (payload.action === "init-upload") {
        if (typeof payload.fileName !== "string" || typeof payload.mimeType !== "string" || typeof payload.fileSize !== "number") {
            return NextResponse.json({ error: "Invalid upload metadata" }, { status: 400 });
        }

        if (!ALLOWED_MIME_TYPES.has(payload.mimeType)) {
            return NextResponse.json({ error: "Unsupported video format" }, { status: 400 });
        }

        if (payload.fileSize > MAX_VIDEO_BYTES) {
            return NextResponse.json({ error: `Video must be ${MAX_VIDEO_MB}MB or smaller` }, { status: 400 });
        }

        const targetName = buildTargetName(payload.fileName, payload.mimeType);
        const targetPath = `${DEMO_VIDEO_PREFIX}/${targetName}`;

        await ensureS3Bucket();

        const uploadUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: targetPath,
                ContentType: payload.mimeType,
            }),
            { expiresIn: S3_SIGNED_URL_TTL_SECONDS }
        );

        return NextResponse.json({
            source: "upload",
            mode: "direct",
            uploadUrl,
            targetPath,
            expiresIn: S3_SIGNED_URL_TTL_SECONDS,
            fileName: payload.fileName,
            mimeType: payload.mimeType,
        });
    }

    if (payload.action === "finalize-upload") {
        if (typeof payload.targetPath !== "string" || typeof payload.fileName !== "string" || typeof payload.mimeType !== "string") {
            return NextResponse.json({ error: "Invalid finalize payload" }, { status: 400 });
        }

        if (!payload.targetPath.startsWith(`${DEMO_VIDEO_PREFIX}/`)) {
            return NextResponse.json({ error: "Invalid upload target path" }, { status: 400 });
        }

        if (!ALLOWED_MIME_TYPES.has(payload.mimeType)) {
            return NextResponse.json({ error: "Unsupported video format" }, { status: 400 });
        }

        await ensureS3Bucket();

        const headResult = await s3Client.send(
            new HeadObjectCommand({
                Bucket: S3_BUCKET,
                Key: payload.targetPath,
            })
        );

        const uploadedBytes = Number(headResult.ContentLength || 0);
        if (!uploadedBytes) {
            return NextResponse.json({ error: "Uploaded file could not be verified" }, { status: 400 });
        }

        if (uploadedBytes > MAX_VIDEO_BYTES) {
            return NextResponse.json({ error: `Video must be ${MAX_VIDEO_MB}MB or smaller` }, { status: 400 });
        }

        const targetName = path.basename(payload.targetPath);
        await deleteOldUploadedVideos(targetName);

        const videoUrl = await buildS3PlaybackUrl(payload.targetPath);

        const config: DemoVideoConfig = {
            source: "upload",
            videoUrl,
            storagePath: payload.targetPath,
            storageProvider: "s3",
            fileName: payload.fileName,
            mimeType: payload.mimeType,
            updatedAt: new Date().toISOString(),
            updatedBy: session.email,
        };

        await writeConfig(config);

        return NextResponse.json(config);
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
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
        const contentType = req.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            return await handleS3DirectUpload(req, sessionOrResponse);
        }

        const form = await req.formData();
        const uploaded = form.get("video");

        if (!(uploaded instanceof File)) {
            return NextResponse.json({ error: "Video file is required" }, { status: 400 });
        }

        if (!ALLOWED_MIME_TYPES.has(uploaded.type)) {
            return NextResponse.json({ error: "Unsupported video format" }, { status: 400 });
        }

        if (uploaded.size > MAX_VIDEO_BYTES) {
            return NextResponse.json({ error: `Video must be ${MAX_VIDEO_MB}MB or smaller` }, { status: 400 });
        }

        const targetName = buildTargetName(uploaded.name, uploaded.type);
        const targetPath = `${DEMO_VIDEO_PREFIX}/${targetName}`;

        const arrayBuffer = await uploaded.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        let videoUrl = `/uploads/demo/${targetName}`;

        if (ACTIVE_STORAGE_PROVIDER === "s3" && s3Client) {
            await ensureS3Bucket();
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: targetPath,
                    Body: fileBuffer,
                    ContentType: uploaded.type,
                })
            );

            if (S3_PUBLIC_BASE_URL) {
                videoUrl = `${S3_PUBLIC_BASE_URL}/${targetPath}`;
            } else {
                videoUrl = await getSignedUrl(
                    s3Client,
                    new GetObjectCommand({
                        Bucket: S3_BUCKET,
                        Key: targetPath,
                    }),
                    { expiresIn: S3_SIGNED_URL_TTL_SECONDS }
                );
            }
        } else if (ACTIVE_STORAGE_PROVIDER === "supabase" && supabaseServer) {
            await ensureDemoBucket();
            const { error: uploadError } = await supabaseServer.storage
                .from(DEMO_STORAGE_BUCKET)
                .upload(targetPath, fileBuffer, {
                    contentType: uploaded.type,
                    upsert: true,
                });

            if (uploadError) {
                return NextResponse.json({ error: uploadError.message || "Failed to upload demo video" }, { status: 500 });
            }

            const { data: signedData, error: signedError } = await supabaseServer.storage
                .from(DEMO_STORAGE_BUCKET)
                .createSignedUrl(targetPath, DEMO_SIGNED_URL_TTL_SECONDS);

            if (signedError || !signedData?.signedUrl) {
                return NextResponse.json({ error: signedError?.message || "Failed to resolve uploaded video URL" }, { status: 500 });
            }

            videoUrl = signedData.signedUrl;
        } else {
            await fs.mkdir(PUBLIC_UPLOAD_DIR, { recursive: true });
            const outputPath = path.join(PUBLIC_UPLOAD_DIR, targetName);
            await fs.writeFile(outputPath, fileBuffer);
        }

        await deleteOldUploadedVideos(targetName);

        const config: DemoVideoConfig = {
            source: "upload",
            videoUrl,
            storagePath: ACTIVE_STORAGE_PROVIDER === "local" ? undefined : targetPath,
            storageProvider: ACTIVE_STORAGE_PROVIDER,
            fileName: uploaded.name,
            mimeType: uploaded.type,
            updatedAt: new Date().toISOString(),
            updatedBy: sessionOrResponse.email,
        };

        await writeConfig(config);

        return NextResponse.json(config);
    } catch (error) {
        console.error("Demo video upload failed:", error);
        const message = error instanceof Error && error.message ? error.message : "Failed to upload demo video";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const sessionOrResponse = requireSuperAdmin(req);
    if (sessionOrResponse instanceof NextResponse) return sessionOrResponse;

    try {
        const config = await readConfig();
        if (config) {
            if ((config.storageProvider === "s3" || ACTIVE_STORAGE_PROVIDER === "s3") && s3Client) {
                await ensureS3Bucket();
                if (config.storagePath) {
                    await s3Client
                        .send(
                            new DeleteObjectCommand({
                                Bucket: S3_BUCKET,
                                Key: config.storagePath,
                            })
                        )
                        .catch(() => undefined);
                }
            } else if (ACTIVE_STORAGE_PROVIDER === "supabase" && supabaseServer) {
                await ensureDemoBucket();
                if (config.storagePath) {
                    await supabaseServer.storage
                        .from(DEMO_STORAGE_BUCKET)
                        .remove([config.storagePath])
                        .catch(() => undefined);
                }
            } else {
                const fileName = path.basename(config.videoUrl);
                await fs.unlink(path.join(PUBLIC_UPLOAD_DIR, fileName)).catch(() => undefined);
            }
        }

        if (ACTIVE_STORAGE_PROVIDER === "s3" && s3Client) {
            await s3Client
                .send(
                    new DeleteObjectCommand({
                        Bucket: S3_BUCKET,
                        Key: DEMO_CONFIG_PATH,
                    })
                )
                .catch(() => undefined);
        } else if (ACTIVE_STORAGE_PROVIDER === "supabase" && supabaseServer) {
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

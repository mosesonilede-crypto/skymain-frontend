import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";
type SessionPayload = { email: string; orgName: string; role: string; exp: number };

function getSession(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyPayload<SessionPayload>(token);
  if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

/**
 * GET /api/documents?path=folder/file.pdf
 *
 * Lists org-scoped documents or generates a signed URL for viewing.
 * Documents are stored under: documents/{org_name}/...
 */
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseServer) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const url = new URL(req.url);
  const filePath = url.searchParams.get("path");
  const prefix = url.searchParams.get("prefix") || "";

  // If a specific file is requested, generate a signed URL
  if (filePath) {
    const fullPath = `${session.orgName}/${filePath}`;
    const { data, error } = await supabaseServer.storage
      .from("documents")
      .createSignedUrl(fullPath, 3600); // 1 hour expiry

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({
      fileName: filePath.split("/").pop(),
      signedUrl: data.signedUrl,
      expiresIn: 3600,
    });
  }

  // Otherwise, list documents in the org's folder
  const listPath = prefix
    ? `${session.orgName}/${prefix}`
    : session.orgName;

  const { data: files, error } = await supabaseServer.storage
    .from("documents")
    .list(listPath, {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const documents = (files || []).map((f) => ({
    name: f.name,
    id: f.id,
    size: f.metadata?.size,
    mimeType: f.metadata?.mimetype,
    createdAt: f.created_at,
    updatedAt: f.updated_at,
    isFolder: !f.metadata?.mimetype,
  }));

  return NextResponse.json({ documents, prefix: prefix || "/" });
}

/**
 * POST /api/documents — Upload a document
 * Expects multipart/form-data with 'file' field and optional 'folder' field.
 */
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseServer) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uploadPath = folder
    ? `${session.orgName}/${folder}/${sanitizedName}`
    : `${session.orgName}/${sanitizedName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabaseServer.storage
    .from("documents")
    .upload(uploadPath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { path: data.path, fileName: sanitizedName },
    { status: 201 }
  );
}

/**
 * DELETE /api/documents?path=folder/file.pdf
 */
export async function DELETE(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseServer) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const url = new URL(req.url);
  const filePath = url.searchParams.get("path");
  if (!filePath) return NextResponse.json({ error: "path is required" }, { status: 400 });

  const fullPath = `${session.orgName}/${filePath}`;
  const { error } = await supabaseServer.storage.from("documents").remove([fullPath]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, deleted: filePath });
}

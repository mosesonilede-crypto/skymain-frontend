import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function mustGetApiBase(): string {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set in .env.local");
  }
  return API_BASE.replace(/\/+$/, "");
}

async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const apiBase = mustGetApiBase();

  // Preserve query string
  const url = new URL(req.url);
  const target = `${apiBase}/${path.join("/")}${url.search}`;

  // Clone headers; drop hop-by-hop headers
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  // Forward the request body for non-GET/HEAD
  const method = req.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(target, {
    method,
    headers,
    body,
    // Ensure cookies are forwarded from browser -> Next -> backend
    credentials: "include",
    redirect: "manual",
  });

  // Pass through Set-Cookie so backend sessions work
  const resHeaders = new Headers(upstream.headers);

  // IMPORTANT: some platforms restrict set-cookie forwarding;
  // in local dev this works fine.
  const data = await upstream.arrayBuffer();

  return new NextResponse(data, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

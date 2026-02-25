import { NextRequest, NextResponse } from "next/server";
import { getAllAuthorities, getAuthority, getAuthoritiesByRegion, getRegions } from "@/lib/regulatoryAuthorities";

/**
 * GET /api/compliance/authorities
 * Query params:
 *   ?code=FAA — Get a specific authority
 *   ?region=Europe — Filter by region
 *   (none) — Returns all authorities
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const region = url.searchParams.get("region");

  if (code) {
    const authority = getAuthority(code);
    if (!authority) {
      return NextResponse.json({ error: `Unknown authority: ${code}` }, { status: 404 });
    }
    return NextResponse.json({ authority });
  }

  if (region) {
    const authorities = getAuthoritiesByRegion(region);
    return NextResponse.json({ authorities, region });
  }

  return NextResponse.json({
    authorities: getAllAuthorities(),
    regions: getRegions(),
  });
}

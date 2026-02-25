import { describe, it, expect } from "vitest";
import { normalizeTier, getEntitlementsForTier } from "@/lib/entitlements";

describe("entitlements", () => {
  describe("normalizeTier", () => {
    it("returns starter for empty/null input", () => {
      expect(normalizeTier()).toBe("starter");
      expect(normalizeTier(null)).toBe("starter");
      expect(normalizeTier("")).toBe("starter");
    });

    it("normalizes professional variants", () => {
      expect(normalizeTier("Professional")).toBe("professional");
      expect(normalizeTier("pro")).toBe("professional");
      expect(normalizeTier("  PROFESSIONAL  ")).toBe("professional");
    });

    it("normalizes enterprise", () => {
      expect(normalizeTier("Enterprise")).toBe("enterprise");
      expect(normalizeTier("ENTERPRISE")).toBe("enterprise");
    });

    it("defaults unknown to starter", () => {
      expect(normalizeTier("unknown")).toBe("starter");
      expect(normalizeTier("free")).toBe("starter");
    });
  });

  describe("getEntitlementsForTier", () => {
    it("returns starter limits by default", () => {
      const e = getEntitlementsForTier();
      expect(e.tier).toBe("starter");
      expect(e.limits.max_aircraft).toBe(5);
      expect(e.limits.max_team_members).toBe(5);
    });

    it("returns professional entitlements", () => {
      const e = getEntitlementsForTier("professional");
      expect(e.tier).toBe("professional");
      expect(e.features.advanced_ai_insights).toBe(true);
      expect(e.limits.max_aircraft).toBe(25);
    });

    it("returns enterprise with unlimited resources", () => {
      const e = getEntitlementsForTier("enterprise");
      expect(e.limits.max_aircraft).toBeNull();
      expect(e.limits.max_storage_gb).toBeNull();
      expect(e.features.dedicated_support_24_7).toBe(true);
    });
  });
});

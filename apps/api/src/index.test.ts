import { describe, expect, it, vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.FACILITATOR_URL = "http://localhost:8080/api/v1/plugins/x402/call";
process.env.NETWORK = "stellar:testnet";

vi.mock("@x402/core/server", () => ({
  HTTPFacilitatorClient: class MockFacilitatorClient {},
}));

vi.mock("@x402/stellar/exact/server", () => ({
  ExactStellarScheme: class MockExactStellarScheme {},
}));

vi.mock("@x402/express", () => ({
  paymentMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => next(),
  x402ResourceServer: class MockResourceServer {
    register() {
      return {};
    }
  },
}));

const {
  listPartners,
  getPartnerReadiness,
  getRailSummary,
  getComplianceQuote,
  getTokenizedAccessMap,
  getSupportedEndpoints,
} = await import("./index");

describe("Institutional API services", () => {
  it("lists partners from the institutional catalog", () => {
    const partners = listPartners();

    expect(partners.length).toBeGreaterThan(0);
    expect(partners.some((partner: { slug: string }) => partner.slug === "moneygram")).toBe(true);
  });

  it("filters partners by asset", () => {
    const partners = listPartners({ asset: "PYUSD" });

    expect(partners).toHaveLength(1);
    expect(partners[0].slug).toBe("paypal");
  });

  it("returns readiness for known partners", () => {
    const readiness = getPartnerReadiness("moneygram");

    expect(readiness?.partner).toBe("MoneyGram");
    expect(readiness?.readinessScore).toBeGreaterThan(80);
    expect(readiness?.adoptionStage).toBe("pilot-now");
  });

  it("returns null for unknown partners", () => {
    expect(getPartnerReadiness("unknown")).toBeNull();
  });

  it("builds a compliance quote based on transfer amount", () => {
    const quote = getComplianceQuote({ institution: "U.S. Bank", transferAmount: 125000 });

    expect(quote.workloadTier).toBe("enhanced-review");
    expect(quote.quotedChecks).toContain("sanctions");
  });

  it("returns monetizable rail and endpoint metadata", () => {
    const rails = getRailSummary();
    const assets = getTokenizedAccessMap();
    const endpoints = getSupportedEndpoints();

    expect(rails.some((entry: { partner: string }) => entry.partner === "MoneyGram")).toBe(true);
    expect(assets.some((entry: { asset: string }) => entry.asset === "PYUSD")).toBe(true);
    expect(endpoints.some((entry: { path: string }) => entry.path === "/api/partners")).toBe(true);
  });
});

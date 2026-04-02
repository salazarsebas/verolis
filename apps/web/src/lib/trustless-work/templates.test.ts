import { describe, expect, it } from "vitest";
import { buildInstitutionalEscrowBlueprint, listInstitutionalEscrowBlueprints } from "@/lib/trustless-work/templates";

describe("Trustless Work escrow templates", () => {
  it("builds a blueprint for a known partner", () => {
    const blueprint = buildInstitutionalEscrowBlueprint("moneygram");

    expect(blueprint?.partnerName).toBe("MoneyGram");
    expect(blueprint?.phases).toHaveLength(4);
    expect(blueprint?.settlementAsset).toBe("USDC");
  });

  it("returns null for unknown partners", () => {
    expect(buildInstitutionalEscrowBlueprint("unknown")).toBeNull();
  });

  it("lists blueprints for institutional partners", () => {
    const blueprints = listInstitutionalEscrowBlueprints();

    expect(blueprints.length).toBeGreaterThan(5);
    expect(blueprints.some((blueprint) => blueprint.partnerSlug === "us-bank")).toBe(true);
  });
});

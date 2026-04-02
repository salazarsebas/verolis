import { describe, expect, it } from "vitest";
import { buildInstitutionalEscrowBlueprint } from "@/lib/trustless-work/templates";
import {
  buildInitializeMultiReleaseEscrowPayload,
  createDefaultRoleSet,
  getNetworkPassphrase,
} from "@/lib/trustless-work/payloads";

describe("Trustless Work payload builders", () => {
  it("builds an initialize escrow payload from a blueprint", () => {
    const blueprint = buildInstitutionalEscrowBlueprint("moneygram");
    if (!blueprint) {
      throw new Error("Expected blueprint");
    }

    const payload = buildInitializeMultiReleaseEscrowPayload(blueprint, {
      signer: "SIGNER_ADDRESS",
      engagementId: "eng-moneygram-pilot",
      trustlineAddress: "TRUSTLINE_ADDRESS",
      roles: createDefaultRoleSet("MG"),
    });

    expect(payload.title).toBe(blueprint.title);
    expect(payload.amount).toBe(22000);
    expect(payload.milestones).toHaveLength(4);
    expect(payload.milestones[0].receiver).toBe("MG_RECEIVER");
  });

  it("returns the correct Stellar network passphrase", () => {
    expect(getNetworkPassphrase("testnet")).toContain("Test");
    expect(getNetworkPassphrase("mainnet")).toContain("Public");
  });
});

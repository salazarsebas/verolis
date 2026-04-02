import { institutionalPartners } from "@verolis/institutional-domain";
import type { InstitutionalEscrowBlueprint } from "./types";

const defaultMilestoneWeights = [0.2, 0.3, 0.25, 0.25];

function buildMilestones(totalAmount: number, labels: string[]) {
  return labels.map((description, index) => ({
    description,
    amount: Math.round(totalAmount * defaultMilestoneWeights[index] * 100) / 100,
    receiver: "SERVICE_PROVIDER_ADDRESS",
  }));
}

export function buildInstitutionalEscrowBlueprint(partnerSlug: string): InstitutionalEscrowBlueprint | null {
  const partner = institutionalPartners.find((entry) => entry.slug === partnerSlug);
  if (!partner) {
    return null;
  }

  const blueprintMap: Record<string, Omit<InstitutionalEscrowBlueprint, "partnerSlug" | "partnerName">> = {
    paypal: {
      title: "PayPal PYUSD treasury pilot",
      description: "Escrow for merchant settlement and PYUSD payout API rollout.",
      totalAmount: 15000,
      settlementAsset: "PYUSD",
      phases: buildMilestones(15000, [
        "Merchant settlement discovery and scope sign-off",
        "Sandbox payout orchestration integrated on testnet",
        "Operational controls and release approval validation",
        "Production readiness review and launch handoff",
      ]),
      rationale: [
        "Pair x402 for per-request API monetization with escrowed implementation fees.",
        "Protect both merchant platform and integration vendor during rollout.",
      ],
    },
    visa: {
      title: "Visa routing intelligence integration",
      description: "Milestone escrow for routing, liquidity and settlement intelligence rollout.",
      totalAmount: 18000,
      settlementAsset: "USDC",
      phases: buildMilestones(18000, [
        "Cross-border routing requirements finalized",
        "Liquidity and treasury APIs connected in sandbox",
        "Issuer approval and compliance review completed",
        "Operational deployment package delivered",
      ]),
      rationale: [
        "High-value infrastructure work benefits from milestone-based release rather than one-shot payment.",
      ],
    },
    wirex: {
      title: "Wirex EURC payout and FX pilot",
      description: "Escrow for wallet payout, FX quoting and treasury rebalancing setup.",
      totalAmount: 12000,
      settlementAsset: "EURC",
      phases: buildMilestones(12000, [
        "Corridor and FX discovery completed",
        "Wallet payout and balance intelligence APIs integrated",
        "Release approvals and treasury rebalancing validation",
        "Launch documentation and support transfer",
      ]),
      rationale: [
        "Useful when the platform needs phased vendor accountability for cross-border rollout.",
      ],
    },
    moneygram: {
      title: "MoneyGram corridor activation pilot",
      description: "Escrow for corridor lookup, quote and cash-out API integration.",
      totalAmount: 22000,
      settlementAsset: "USDC",
      phases: buildMilestones(22000, [
        "Priority corridors and payout rules confirmed",
        "Cash-out quote and remittance tracking endpoints integrated",
        "Operations sign-off and dispute handling workflow tested",
        "Pilot corridor activated with reporting pack delivered",
      ]),
      rationale: [
        "Strongest fit for escrow because corridor rollout usually happens in staged operational gates.",
      ],
    },
    "franklin-templeton": {
      title: "Franklin Templeton treasury access rollout",
      description: "Escrow for NAV, eligibility and subscription workflow delivery.",
      totalAmount: 25000,
      settlementAsset: "Tokenized Treasuries",
      phases: buildMilestones(25000, [
        "Eligibility and product-access model approved",
        "NAV and treasury data endpoints integrated",
        "Institutional review and controls validated",
        "Production delivery and reporting accepted",
      ]),
      rationale: [
        "Tokenized treasury integrations typically require explicit acceptance milestones.",
      ],
    },
    "us-bank": {
      title: "U.S. Bank compliance workflow deployment",
      description: "Escrow for KYC, sanctions and approval flow integration.",
      totalAmount: 28000,
      settlementAsset: "USDC",
      phases: buildMilestones(28000, [
        "Policy model and risk controls approved",
        "Compliance quote and screening workflows integrated",
        "Release signer and dispute resolver operations tested",
        "Audit package and production readiness delivered",
      ]),
      rationale: [
        "Best institutional candidate for Trustless Work because release and dispute roles are operationally meaningful.",
      ],
    },
    airtm: {
      title: "AirTM payroll disbursement pilot",
      description: "Escrow for payroll quote, treasury sync and payout validation rollout.",
      totalAmount: 14000,
      settlementAsset: "USDC",
      phases: buildMilestones(14000, [
        "Payroll corridors and treasury flows scoped",
        "Payout validation APIs connected on testnet",
        "Operational release and approval workflow validated",
        "Launch and employer onboarding package delivered",
      ]),
      rationale: [
        "Lets platform and integrator share rollout risk while x402 monetizes the APIs afterwards.",
      ],
    },
  };

  const blueprint = blueprintMap[partnerSlug];
  if (!blueprint) {
    return null;
  }

  return {
    partnerSlug,
    partnerName: partner.name,
    ...blueprint,
  };
}

export function listInstitutionalEscrowBlueprints() {
  return institutionalPartners
    .map((partner) => buildInstitutionalEscrowBlueprint(partner.slug))
    .filter((value): value is InstitutionalEscrowBlueprint => value !== null);
}

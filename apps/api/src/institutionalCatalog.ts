export interface InstitutionalPartnerRecord {
  slug: string;
  name: string;
  category: "wallet" | "card-network" | "remittance" | "asset-manager" | "bank" | "fintech";
  stellarRelationship: string;
  opportunity: string;
  readinessScore: number;
  primaryAsset: "USDC" | "PYUSD" | "EURC" | "XLM" | "Tokenized Treasuries";
  rails: string[];
  x402Services: string[];
}

export const institutionalCatalog: InstitutionalPartnerRecord[] = [
  {
    slug: "paypal",
    name: "PayPal",
    category: "wallet",
    stellarRelationship: "PYUSD and merchant distribution strategy align with request-priced treasury APIs.",
    opportunity: "Merchant settlement, payout orchestration and agent checkout services.",
    readinessScore: 86,
    primaryAsset: "PYUSD",
    rails: ["merchant-settlement", "wallet-payouts", "stablecoin-treasury"],
    x402Services: ["merchant quote API", "settlement status API", "payout orchestration API"],
  },
  {
    slug: "visa",
    name: "Visa",
    category: "card-network",
    stellarRelationship: "Card-linked treasury and cross-border routing APIs fit x402 well.",
    opportunity: "Routing intelligence, settlement checks and issuer treasury services.",
    readinessScore: 81,
    primaryAsset: "USDC",
    rails: ["card-settlement", "cross-border-liquidity", "issuer-treasury"],
    x402Services: ["routing quote API", "issuer compliance API", "settlement webhooks"],
  },
  {
    slug: "wirex",
    name: "Wirex",
    category: "fintech",
    stellarRelationship: "Wallet and multi-currency card operations fit pay-per-request APIs.",
    opportunity: "FX quote, wallet payout and rebalancing services.",
    readinessScore: 78,
    primaryAsset: "EURC",
    rails: ["consumer-cards", "fx-rebalancing", "wallet-offramp"],
    x402Services: ["FX quote API", "wallet payout API", "balance intelligence API"],
  },
  {
    slug: "moneygram",
    name: "MoneyGram",
    category: "remittance",
    stellarRelationship: "Cash-in and cash-out rails are a direct institutional distribution path on Stellar.",
    opportunity: "Corridor discovery, payout quotes and remittance tracking.",
    readinessScore: 91,
    primaryAsset: "USDC",
    rails: ["cash-in", "cash-out", "remittance-corridors"],
    x402Services: ["corridor lookup API", "cash-out quote API", "remittance tracking API"],
  },
  {
    slug: "franklin-templeton",
    name: "Franklin Templeton",
    category: "asset-manager",
    stellarRelationship: "Tokenized treasury products support premium data and workflow APIs.",
    opportunity: "Fund NAV, eligibility and subscription flows.",
    readinessScore: 84,
    primaryAsset: "Tokenized Treasuries",
    rails: ["fund-subscription", "nav-data", "treasury-allocation"],
    x402Services: ["NAV API", "eligibility API", "subscription workflow API"],
  },
  {
    slug: "us-bank",
    name: "U.S. Bank",
    category: "bank",
    stellarRelationship: "Bank-grade policy enforcement and payment approvals fit gated APIs.",
    opportunity: "KYC, sanctions, payment approvals and treasury workflows.",
    readinessScore: 74,
    primaryAsset: "USDC",
    rails: ["bank-treasury", "approval-workflows", "compliance-screening"],
    x402Services: ["policy decision API", "enhanced due diligence API", "approval workflow API"],
  },
  {
    slug: "airtm",
    name: "AirTM",
    category: "fintech",
    stellarRelationship: "Cross-border payroll and balance orchestration are strong x402 use cases.",
    opportunity: "Payroll quotes, treasury synchronization and payout validation.",
    readinessScore: 79,
    primaryAsset: "USDC",
    rails: ["payroll", "wallet-disbursement", "corridor-validation"],
    x402Services: ["payroll quote API", "payout validation API", "treasury sync API"],
  },
];

export const paymentRequirements = {
  "GET /api/partners": {
    accepts: [{ scheme: "exact" as const, price: "$0.02", network: "stellar:testnet" as const }],
    description: "Institutional partner discovery for Stellar x402 adoption",
    mimeType: "application/json",
  },
  "GET /api/partners/:slug/readiness": {
    accepts: [{ scheme: "exact" as const, price: "$0.03", network: "stellar:testnet" as const }],
    description: "Institutional readiness scoring and adoption gaps",
    mimeType: "application/json",
  },
  "GET /api/rails": {
    accepts: [{ scheme: "exact" as const, price: "$0.015", network: "stellar:testnet" as const }],
    description: "Payment rail intelligence for Stellar partner institutions",
    mimeType: "application/json",
  },
  "POST /api/compliance/screening-quote": {
    accepts: [{ scheme: "exact" as const, price: "$0.05", network: "stellar:testnet" as const }],
    description: "Compliance quote for policy-heavy institutional flows",
    mimeType: "application/json",
  },
  "GET /api/assets/tokenized-access": {
    accepts: [{ scheme: "exact" as const, price: "$0.04", network: "stellar:testnet" as const }],
    description: "Tokenized treasury and stablecoin access map",
    mimeType: "application/json",
  },
};

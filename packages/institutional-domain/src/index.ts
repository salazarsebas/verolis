export type InstitutionalCategory =
  | "wallet"
  | "card-network"
  | "remittance"
  | "asset-manager"
  | "bank"
  | "fintech";

export type InstitutionalAsset = "USDC" | "PYUSD" | "EURC" | "XLM" | "Tokenized Treasuries";

export interface InstitutionalPartner {
  slug: string;
  name: string;
  category: InstitutionalCategory;
  stellarRelationship: string;
  opportunity: string;
  readinessScore: number;
  primaryAsset: InstitutionalAsset;
  rails: string[];
  x402Services: string[];
  notes: string[];
}

export interface MonetizedCapability {
  name: string;
  description: string;
  endpoint: string;
  price: string;
}

export interface PaymentRequirement {
  accepts: Array<{
    scheme: "exact";
    price: string;
    network: "stellar:testnet";
  }>;
  description: string;
  mimeType: "application/json";
}

export const institutionalPartners: InstitutionalPartner[] = [
  {
    slug: "paypal",
    name: "PayPal",
    category: "wallet",
    stellarRelationship: "PYUSD and merchant distribution strategy make Stellar-compatible micropayments commercially relevant.",
    opportunity: "Merchant APIs that charge per request for treasury, settlement and payout operations.",
    readinessScore: 86,
    primaryAsset: "PYUSD",
    rails: ["merchant-settlement", "wallet-payouts", "stablecoin-treasury"],
    x402Services: ["merchant quote API", "settlement status API", "payout orchestration API"],
    notes: ["Best fit for merchant and agent checkout flows.", "Needs auth-entry wallet support for browser-native x402."],
  },
  {
    slug: "visa",
    name: "Visa",
    category: "card-network",
    stellarRelationship: "Card-linked settlement and treasury APIs align with programmable per-call billing.",
    opportunity: "Charge for routing intelligence, liquidity quotes and cross-border settlement checks.",
    readinessScore: 81,
    primaryAsset: "USDC",
    rails: ["card-settlement", "cross-border-liquidity", "issuer-treasury"],
    x402Services: ["routing quote API", "issuer compliance API", "settlement webhooks"],
    notes: ["Stronger as infrastructure intelligence than as a direct wallet flow."],
  },
  {
    slug: "wirex",
    name: "Wirex",
    category: "fintech",
    stellarRelationship: "Multi-currency card and wallet operations map well to on-demand quote and payout APIs.",
    opportunity: "Monetize FX quotes, treasury rebalancing and cross-border payout requests.",
    readinessScore: 78,
    primaryAsset: "EURC",
    rails: ["consumer-cards", "fx-rebalancing", "wallet-offramp"],
    x402Services: ["FX quote API", "wallet payout API", "balance intelligence API"],
    notes: ["Good candidate for EURC-denominated request pricing."],
  },
  {
    slug: "moneygram",
    name: "MoneyGram",
    category: "remittance",
    stellarRelationship: "Cash-in/cash-out access is one of the clearest real-world rails in the Stellar ecosystem.",
    opportunity: "Charge for corridor discovery, payout eligibility and settlement status APIs.",
    readinessScore: 91,
    primaryAsset: "USDC",
    rails: ["cash-in", "cash-out", "remittance-corridors"],
    x402Services: ["corridor lookup API", "cash-out quote API", "remittance tracking API"],
    notes: ["Highest near-term adoption narrative for institutional partner APIs."],
  },
  {
    slug: "franklin-templeton",
    name: "Franklin Templeton",
    category: "asset-manager",
    stellarRelationship: "Tokenized treasury products align with paid access to holdings, NAV and subscription workflows.",
    opportunity: "Monetize access to fund data, treasury allocations and eligibility checks.",
    readinessScore: 84,
    primaryAsset: "Tokenized Treasuries",
    rails: ["fund-subscription", "nav-data", "treasury-allocation"],
    x402Services: ["NAV API", "eligibility API", "subscription workflow API"],
    notes: ["Best packaged as premium institutional data endpoints, not consumer UI."],
  },
  {
    slug: "us-bank",
    name: "U.S. Bank",
    category: "bank",
    stellarRelationship: "Bank treasury controls and compliance-heavy workflows fit x402-gated operational APIs.",
    opportunity: "Monetize KYC, screening and payment-approval workflows with programmable policy checks.",
    readinessScore: 74,
    primaryAsset: "USDC",
    rails: ["bank-treasury", "approval-workflows", "compliance-screening"],
    x402Services: ["policy decision API", "enhanced due diligence API", "approval workflow API"],
    notes: ["Requires strongest controls, audit trails and approval logic."],
  },
  {
    slug: "airtm",
    name: "AirTM",
    category: "fintech",
    stellarRelationship: "Payroll and cross-border balance operations match per-request settlement APIs.",
    opportunity: "Charge for payout orchestration, employer treasury actions and corridor validation.",
    readinessScore: 79,
    primaryAsset: "USDC",
    rails: ["payroll", "wallet-disbursement", "corridor-validation"],
    x402Services: ["payroll quote API", "payout validation API", "treasury sync API"],
    notes: ["Good fit for LatAm-focused institution and payroll workflows."],
  },
];

export const monetizedCapabilities: MonetizedCapability[] = [
  {
    name: "Partner discovery",
    description: "Identify which Stellar partner is best aligned to a given institutional use case.",
    endpoint: "/api/partners",
    price: "$0.02",
  },
  {
    name: "Readiness scoring",
    description: "Score operational readiness for x402 adoption per institution.",
    endpoint: "/api/partners/:slug/readiness",
    price: "$0.03",
  },
  {
    name: "Rail intelligence",
    description: "Return corridor, settlement and asset rails by institution.",
    endpoint: "/api/rails",
    price: "$0.015",
  },
  {
    name: "Compliance quoting",
    description: "Quote compliance workload for high-trust institutional flows.",
    endpoint: "/api/compliance/screening-quote",
    price: "$0.05",
  },
  {
    name: "Tokenized asset access",
    description: "Expose institutional product availability for treasury and fund workflows.",
    endpoint: "/api/assets/tokenized-access",
    price: "$0.04",
  },
];

export const paymentRequirements: Record<string, PaymentRequirement> = {
  "GET /api/partners": {
    accepts: [{ scheme: "exact", price: "$0.02", network: "stellar:testnet" }],
    description: "Institutional partner discovery for Stellar x402 adoption",
    mimeType: "application/json",
  },
  "GET /api/partners/:slug/readiness": {
    accepts: [{ scheme: "exact", price: "$0.03", network: "stellar:testnet" }],
    description: "Institutional readiness scoring and adoption gaps",
    mimeType: "application/json",
  },
  "GET /api/rails": {
    accepts: [{ scheme: "exact", price: "$0.015", network: "stellar:testnet" }],
    description: "Payment rail intelligence for Stellar partner institutions",
    mimeType: "application/json",
  },
  "POST /api/compliance/screening-quote": {
    accepts: [{ scheme: "exact", price: "$0.05", network: "stellar:testnet" }],
    description: "Compliance quote for policy-heavy institutional flows",
    mimeType: "application/json",
  },
  "GET /api/assets/tokenized-access": {
    accepts: [{ scheme: "exact", price: "$0.04", network: "stellar:testnet" }],
    description: "Tokenized treasury and stablecoin access map",
    mimeType: "application/json",
  },
};

export const institutionalCatalog = institutionalPartners.map(({ notes: _notes, ...partner }) => partner);

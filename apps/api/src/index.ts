import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { institutionalCatalog, paymentRequirements } from "./institutionalCatalog";

dotenv.config();

const PORT = Number(process.env.API_PORT || process.env.PORT || 4021);
const stellarAddress = process.env.STELLAR_ADDRESS;
const facilitatorUrl = process.env.FACILITATOR_URL;
const relayerApiKey = process.env.RELAYER_API_KEY || "test-api-key";
const network = process.env.NETWORK || "stellar:testnet";

if (!facilitatorUrl) {
  console.error("FACILITATOR_URL is required");
  process.exit(1);
}

const facilitatorClient = new HTTPFacilitatorClient({
  url: facilitatorUrl,
  createAuthHeaders: async () => ({
    verify: { Authorization: `Bearer ${relayerApiKey}` },
    settle: { Authorization: `Bearer ${relayerApiKey}` },
    supported: { Authorization: `Bearer ${relayerApiKey}` },
  }),
});

const resolvedPaymentRequirements = Object.fromEntries(
  Object.entries(paymentRequirements).map(([route, config]) => [
    route,
    {
      ...config,
      accepts: config.accepts.map((accept) => ({
        ...accept,
        network,
        payTo: stellarAddress || "UNCONFIGURED_STELLAR_ADDRESS",
      })),
    },
  ])
);

export function listPartners(filters?: { category?: string; asset?: string }) {
  return institutionalCatalog.filter((partner) => {
    if (filters?.category && partner.category !== filters.category) {
      return false;
    }
    if (filters?.asset && partner.primaryAsset !== filters.asset) {
      return false;
    }
    return true;
  });
}

export function getPartnerReadiness(slug: string) {
  const partner = institutionalCatalog.find((entry) => entry.slug === slug);
  if (!partner) {
    return null;
  }

  const adoptionStage =
    partner.readinessScore >= 85 ? "pilot-now" :
    partner.readinessScore >= 78 ? "design-partnership" :
    "compliance-first";

  return {
    partner: partner.name,
    slug: partner.slug,
    readinessScore: partner.readinessScore,
    adoptionStage,
    asset: partner.primaryAsset,
    recommendedServices: partner.x402Services,
    gaps: [
      "Wallets must support Soroban auth-entry signing for production browser flows.",
      "Settlement, compliance and analytics should be exposed as independently priced APIs.",
      "Institution-specific audit logging is required before mainnet onboarding.",
    ],
    nextActions: [
      "Start with a high-value read endpoint priced with x402.",
      "Add policy and settlement webhooks behind the same institutional account.",
      "Graduate to write endpoints after facilitator settlement is validated on testnet.",
    ],
  };
}

export function getRailSummary() {
  return institutionalCatalog.map((partner) => ({
    partner: partner.name,
    rails: partner.rails,
    asset: partner.primaryAsset,
    monetizedServices: partner.x402Services.length,
  }));
}

export function getComplianceQuote(input?: {
  institution?: string;
  jurisdiction?: string;
  transferAmount?: number;
}) {
  const institution = input?.institution || "unspecified";
  const jurisdiction = input?.jurisdiction || "multi-region";
  const transferAmount = Number(input?.transferAmount || 0);
  const workloadTier =
    transferAmount >= 100000 ? "enhanced-review" :
    transferAmount >= 10000 ? "standard-review" :
    "light-review";

  return {
    institution,
    jurisdiction,
    workloadTier,
    quotedChecks: ["kyc", "sanctions", "pep", "source-of-funds"],
    estimatedReviewMinutes: workloadTier === "enhanced-review" ? 45 : workloadTier === "standard-review" ? 20 : 8,
    policyHooks: ["freeze", "manual-approval", "audit-log"],
    network,
  };
}

export function getTokenizedAccessMap() {
  return [
    {
      asset: "USDC",
      bestFit: ["MoneyGram", "Visa", "U.S. Bank", "AirTM"],
      useCases: ["cross-border payouts", "treasury settlement", "request-priced APIs"],
    },
    {
      asset: "PYUSD",
      bestFit: ["PayPal"],
      useCases: ["merchant settlement", "agent checkout", "wallet payout APIs"],
    },
    {
      asset: "EURC",
      bestFit: ["Wirex"],
      useCases: ["FX routing", "euro treasury operations", "cross-border card liquidity"],
    },
    {
      asset: "Tokenized Treasuries",
      bestFit: ["Franklin Templeton"],
      useCases: ["NAV access", "eligibility workflows", "portfolio automation"],
    },
  ];
}

export function getSupportedEndpoints() {
  return Object.entries(resolvedPaymentRequirements).map(([key, value]) => {
    const [method, ...pathParts] = key.split(" ");
    return {
      method,
      path: pathParts.join(" "),
      price: value.accepts[0].price,
      assetAssumption: value.accepts[0].payTo,
      description: value.description,
    };
  });
}

export function createApp() {
  const app = express();

  app.use(
    paymentMiddleware(
      resolvedPaymentRequirements,
      new x402ResourceServer(facilitatorClient).register(network, new ExactStellarScheme())
    )
  );

  app.use(cors());
  app.use(express.json());

  app.get("/api/partners", (req, res) => {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const asset = typeof req.query.asset === "string" ? req.query.asset : undefined;

    const partners = listPartners({ category, asset });

    res.json({
      objective: "Find institutional Stellar partners that can monetize infrastructure through x402.",
      total: partners.length,
      filters: { category: category || null, asset: asset || null },
      partners,
    });
  });

  app.get("/api/partners/:slug/readiness", (req, res) => {
    const readiness = getPartnerReadiness(req.params.slug);
    if (!readiness) {
      return res.status(404).json({ error: "Partner not found" });
    }
    return res.json(readiness);
  });

  app.get("/api/rails", (_req, res) => {
    res.json({
      network,
      settlementModel: "Per-request payment using x402 on Stellar.",
      rails: getRailSummary(),
    });
  });

  app.post("/api/compliance/screening-quote", (req, res) => {
    res.json(getComplianceQuote(req.body));
  });

  app.get("/api/assets/tokenized-access", (_req, res) => {
    res.json({
      thesis: "Institutional adoption improves when tokenized treasuries, stablecoins and payout rails share the same payment primitive.",
      assets: getTokenizedAccessMap(),
    });
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "healthy",
      service: "stellar-x402-api",
      network,
      facilitator: facilitatorUrl,
      institutions: institutionalCatalog.length,
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/supported", (_req, res) => {
    res.json({
      network,
      scheme: "exact",
      payToConfigured: Boolean(stellarAddress),
      endpoints: getSupportedEndpoints(),
    });
  });

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err.status === 402) {
      return res.status(402).json({
        error: "Payment Required",
        message: "A valid x402 payment is required to access this institutional resource.",
        paymentRequired: err.paymentRequired,
      });
    }

    console.error("API error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    });
  });

  return app;
}

const app = createApp();

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`stellar-x402-api listening on port ${PORT}`);
  });
}

export default app;

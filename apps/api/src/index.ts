import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4021;

const stellarAddress = process.env.STELLAR_ADDRESS;
const facilitatorUrl = process.env.FACILITATOR_URL;
const relayerApiKey = process.env.RELAYER_API_KEY || "test-api-key";

if (!facilitatorUrl) {
  console.error("❌ FACILITATOR_URL is required");
  process.exit(1);
}

// Create facilitator client for payment verification and settlement
const facilitatorClient = new HTTPFacilitatorClient({
  url: facilitatorUrl,
  createAuthHeaders: async () => ({
    verify: { Authorization: `Bearer ${relayerApiKey}` },
    settle: { Authorization: `Bearer ${relayerApiKey}` },
    supported: { Authorization: `Bearer ${relayerApiKey}` },
  }),
});

// Define payment requirements for different endpoints
const paymentRequirements = {
  "GET /api/weather": {
    accepts: [
      {
        scheme: "exact" as const,
        price: "$0.001",
        network: "stellar:testnet" as const,
        payTo: stellarAddress || "GEXAMPLE Stellar Address",
      },
    ],
    description: "Real-time weather data API",
    mimeType: "application/json",
  },
  "GET /api/market-data": {
    accepts: [
      {
        scheme: "exact" as const,
        price: "$0.01",
        network: "stellar:testnet" as const,
        payTo: stellarAddress || "GEXAMPLE Stellar Address",
      },
    ],
    description: "Financial market data feed",
    mimeType: "application/json",
  },
  "GET /api/kyc-verify": {
    accepts: [
      {
        scheme: "exact" as const,
        price: "$0.50",
        network: "stellar:testnet" as const,
        payTo: stellarAddress || "GEXAMPLE Stellar Address",
      },
    ],
    description: "KYC verification service",
    mimeType: "application/json",
  },
  "POST /api/payment-process": {
    accepts: [
      {
        scheme: "exact" as const,
        price: "$0.10",
        network: "stellar:testnet" as const,
        payTo: stellarAddress || "GEXAMPLE Stellar Address",
      },
    ],
    description: "Payment processing service",
    mimeType: "application/json",
  },
};

// Apply x402 payment middleware
app.use(
  paymentMiddleware(
    paymentRequirements,
    new x402ResourceServer(facilitatorClient).register(
      "stellar:testnet",
      new ExactStellarScheme()
    )
  )
);

app.use(cors());
app.use(express.json());

// API Routes (protected by x402 middleware)

/**
 * Weather Data Endpoint
 * Example: Real-time weather data for institutional trading algorithms
 */
app.get("/api/weather", (req, res) => {
  res.json({
    report: {
      location: "New York, NY",
      weather: "sunny",
      temperature: 70,
      humidity: 45,
      windSpeed: 12,
      timestamp: new Date().toISOString(),
    },
    metadata: {
      source: "National Weather Service",
      reliability: "high",
    },
  });
});

/**
 * Market Data Endpoint
 * Example: Financial market data for institutional clients
 */
app.get("/api/market-data", (req, res) => {
  res.json({
    symbols: [
      {
        symbol: "AAPL",
        price: 175.50,
        change: 2.35,
        changePercent: 1.36,
        volume: 52000000,
      },
      {
        symbol: "GOOGL",
        price: 142.80,
        change: -0.95,
        changePercent: -0.66,
        volume: 28000000,
      },
      {
        symbol: "XLM",
        price: 0.125,
        change: 0.008,
        changePercent: 6.84,
        volume: 180000000,
      },
    ],
    timestamp: new Date().toISOString(),
    source: "Stellar Market Data",
  });
});

/**
 * KYC Verification Endpoint
 * Example: Identity verification for compliance (U.S. Bank, PayPal integrations)
 */
app.get("/api/kyc-verify", (req, res) => {
  res.json({
    status: "verified",
    verificationId: `kyc-${Date.now()}`,
    level: "enhanced",
    checks: {
      identity: "passed",
      address: "passed",
      sanctions: "cleared",
      pep: "cleared",
    },
    timestamp: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
});

/**
 * Payment Processing Endpoint
 * Example: Process cross-border payments (MoneyGram, AirTM use case)
 */
app.post("/api/payment-process", (req, res) => {
  const { amount, currency, destination } = req.body;
  
  res.json({
    transactionId: `txn-${Date.now()}`,
    status: "completed",
    details: {
      amount: amount || 100,
      currency: currency || "USDC",
      destination: destination || "GEXAMPLE",
      fee: 0.001,
      network: "stellar",
      settlementTime: "< 5 seconds",
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Health Check Endpoint (no payment required)
 */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "stellar-x402-api",
    network: process.env.NETWORK || "stellar:testnet",
    facilitator: facilitatorUrl,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Supported Payment Methods Endpoint (no payment required)
 * Returns x402 payment requirements for all endpoints
 */
app.get("/api/supported", (req, res) => {
  res.json({
    network: "stellar:testnet",
    scheme: "exact",
    assets: [
      {
        code: "USDC",
        issuer: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
        name: "USD Coin",
      },
      {
        code: "PYUSD",
        issuer: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
        name: "PayPal USD",
      },
    ],
    endpoints: Object.keys(paymentRequirements).map((key) => {
      const [method, path] = key.split(" ");
      const req = paymentRequirements[key as keyof typeof paymentRequirements];
      return {
        method,
        path,
        price: req.accepts[0].price,
        description: req.description,
      };
    }),
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  
  // Handle x402 payment errors
  if (err.status === 402) {
    return res.status(402).json({
      error: "Payment Required",
      message: "A valid x402 payment is required to access this resource",
      paymentRequired: err.paymentRequired,
    });
  }
  
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           Stellar x402 Institutional Payment API          ║
╠═══════════════════════════════════════════════════════════╣
║  Server running at http://localhost:${PORT}                    ║
║  Network: ${process.env.NETWORK || "stellar:testnet"}                            
║  Facilitator: ${facilitatorUrl}             
║                                                           ║
║  Endpoints:                                               ║
║  - GET  /health          (free)                           ║
║  - GET  /api/supported   (free)                           ║
║  - GET  /api/weather     ($0.001)                         ║
║  - GET  /api/market-data ($0.01)                          ║
║  - GET  /api/kyc-verify  ($0.50)                          ║
║  - POST /api/payment-process ($0.10)                      ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

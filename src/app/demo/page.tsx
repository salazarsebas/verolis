"use client";

import { ResourceAccess } from "@/components/paywall/resource-access";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4021";

const endpoints = [
  {
    endpoint: "/api/weather",
    method: "GET" as const,
    requirements: {
      scheme: "exact",
      price: "$0.001",
      network: "stellar:testnet",
      payTo: "GEXAMPLE Stellar Address",
    },
    description: "Real-time weather data for institutional trading algorithms",
  },
  {
    endpoint: "/api/market-data",
    method: "GET" as const,
    requirements: {
      scheme: "exact",
      price: "$0.01",
      network: "stellar:testnet",
      payTo: "GEXAMPLE Stellar Address",
    },
    description: "Financial market data feed with real-time pricing",
  },
  {
    endpoint: "/api/kyc-verify",
    method: "GET" as const,
    requirements: {
      scheme: "exact",
      price: "$0.50",
      network: "stellar:testnet",
      payTo: "GEXAMPLE Stellar Address",
    },
    description: "KYC verification service for compliance (U.S. Bank, PayPal)",
  },
  {
    endpoint: "/api/payment-process",
    method: "POST" as const,
    requirements: {
      scheme: "exact",
      price: "$0.10",
      network: "stellar:testnet",
      payTo: "GEXAMPLE Stellar Address",
    },
    description: "Cross-border payment processing (MoneyGram, AirTM)",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">x402 Payment Demo</h1>
              <p className="text-sm text-muted-foreground">
                Experience autonomous payments on Stellar
              </p>
            </div>
            <Badge variant="outline">Stellar Testnet</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <h2 className="font-semibold mb-2">How it Works</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Connect your Freighter wallet (or compatible Stellar wallet)</li>
            <li>Select an API endpoint to access</li>
            <li>Pay with USDC on Stellar (testnet)</li>
            <li>Access the resource instantly (&lt;5 second settlement)</li>
          </ol>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>⚡</span>
            <span>Powered by x402 Protocol + OpenZeppelin Relayer</span>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Available Endpoints</h2>
          <div className="grid gap-6">
            {endpoints.map((ep) => (
              <ResourceAccess
                key={ep.endpoint}
                endpoint={ep.endpoint}
                method={ep.method}
                requirements={ep.requirements}
                description={ep.description}
                apiUrl={API_URL}
              />
            ))}
          </div>
        </div>

        {/* Integration Guide */}
        <div className="mt-12 p-6 rounded-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-xl font-bold mb-4">Integration Guide</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Install x402 SDK</h3>
              <pre className="p-3 rounded-lg bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                <code>npm install @x402/express @x402/stellar @x402/core</code>
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Add Payment Middleware</h3>
              <pre className="p-3 rounded-lg bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                <code>{`app.use(
  paymentMiddleware(
    {
      "GET /api/weather": {
        accepts: [{ scheme: "exact", price: "$0.001", network: "stellar:testnet" }],
        description: "Weather data",
      },
    },
    facilitatorClient
  )
);`}</code>
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Configure OpenZeppelin Relayer</h3>
              <pre className="p-3 rounded-lg bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                <code>{`// config.json
{
  "plugins": [{
    "id": "x402",
    "config": {
      "networks": [{
        "network": "stellar:testnet",
        "relayer_id": "stellar-testnet",
        "assets": ["CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"]
      }]
    }
  }]
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

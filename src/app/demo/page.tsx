"use client";

import { Badge } from "@/components/ui/badge";
import { ResourceAccess } from "@/components/paywall/resource-access";
import { institutionalPartners, monetizedCapabilities } from "@/lib/institutional/partners";
import { getBrowserX402SupportState } from "@/lib/x402/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4021";
const payTo = process.env.NEXT_PUBLIC_STELLAR_PAY_TO || "UNCONFIGURED_STELLAR_ADDRESS";
const browserSupport = getBrowserX402SupportState();

const endpoints = [
  {
    endpoint: "/api/partners",
    method: "GET" as const,
    requirements: { scheme: "exact", price: "$0.02", network: "stellar:testnet", payTo },
    description: "Discover which Stellar-linked institutions are strongest candidates for x402 adoption.",
  },
  {
    endpoint: "/api/partners/moneygram/readiness",
    method: "GET" as const,
    requirements: { scheme: "exact", price: "$0.03", network: "stellar:testnet", payTo },
    description: "Readiness scoring for a specific institutional partner.",
  },
  {
    endpoint: "/api/rails",
    method: "GET" as const,
    requirements: { scheme: "exact", price: "$0.015", network: "stellar:testnet", payTo },
    description: "Map payment rails, settlement surfaces and monetizable infrastructure paths.",
  },
  {
    endpoint: "/api/assets/tokenized-access",
    method: "GET" as const,
    requirements: { scheme: "exact", price: "$0.04", network: "stellar:testnet", payTo },
    description: "Access stablecoin and tokenized treasury packaging for institutional workflows.",
  },
  {
    endpoint: "/api/compliance/screening-quote",
    method: "POST" as const,
    requirements: { scheme: "exact", price: "$0.05", network: "stellar:testnet", payTo },
    description: "Quote compliance workload for policy-heavy institutions and bank-grade flows.",
    body: { institution: "U.S. Bank", jurisdiction: "US", transferAmount: 125000 },
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Institutional x402 Demo</h1>
              <p className="text-sm text-slate-500">
                Request-priced intelligence for Stellar partners, rails and tokenized assets
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/trustless-work"><Button variant="outline">Escrow Layer</Button></Link>
              <Badge variant="outline">Stellar Testnet</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-10 px-4 py-8">
        <section className="rounded-3xl border border-lime-200 bg-lime-50 p-6">
          <h2 className="text-lg font-semibold">What this demo is proving</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            Instead of generic demo endpoints, the API now exposes institutional workflows that can be monetized through
            `x402`: partner discovery, readiness scoring, payment rail intelligence, compliance quoting and tokenized
            treasury access.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {monetizedCapabilities.map((capability) => (
              <div key={capability.endpoint} className="rounded-2xl border border-lime-200 bg-white p-4">
                <p className="font-semibold">{capability.name}</p>
                <p className="mt-2 text-sm text-slate-600">{capability.price}</p>
                <p className="mt-3 font-mono text-xs text-slate-500">{capability.endpoint}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
            Browser flow status: {browserSupport.mode}. {browserSupport.limitation}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Paid endpoints</h2>
          <div className="mt-5 grid gap-6">
            {endpoints.map((ep) => (
              <ResourceAccess
                key={ep.endpoint}
                endpoint={ep.endpoint}
                method={ep.method}
                requirements={ep.requirements}
                description={ep.description}
                apiUrl={API_URL}
                requestBody={ep.body}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Institution coverage</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {institutionalPartners.map((partner) => (
              <div key={partner.slug} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{partner.name}</h3>
                  <span className="text-sm font-medium text-lime-700">{partner.readinessScore}/100</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{partner.opportunity}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{partner.primaryAsset}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

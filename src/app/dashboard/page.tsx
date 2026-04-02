"use client";

import { DashboardStats, RecentTransactions, EndpointMetrics } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { institutionalPartners, monetizedCapabilities } from "@/lib/institutional/partners";
import { getInstitutionalEscrowStatuses } from "@/lib/trustless-work/status";
import Link from "next/link";
import { Download, RefreshCw, Settings } from "lucide-react";

const averageReadiness = Math.round(
  institutionalPartners.reduce((sum, partner) => sum + partner.readinessScore, 0) / institutionalPartners.length
);

const endpointMetrics = monetizedCapabilities.map((capability, index) => ({
  path: capability.endpoint,
  requests: 220 + index * 130,
  revenue: capability.price,
  avgResponseTime: `${70 + index * 20}ms`,
}));

const recentTransactions = institutionalPartners.slice(0, 4).map((partner, index) => ({
  id: `txn-${partner.slug}`,
  timestamp: new Date(Date.now() - index * 15 * 60 * 1000).toISOString(),
  endpoint: monetizedCapabilities[index % monetizedCapabilities.length].endpoint,
  amount: monetizedCapabilities[index % monetizedCapabilities.length].price,
  status: index === 2 ? "pending" as const : "completed" as const,
  network: "stellar:testnet",
  asset: partner.primaryAsset,
  from: partner.name,
  transactionHash: `sim-${partner.slug}-${index}`,
}));

const escrowStatuses = getInstitutionalEscrowStatuses().slice(0, 4);

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-semibold">Adoption Console</h1>
            <p className="text-sm text-slate-500">
              Track institutional readiness, monetized endpoints and Stellar partner coverage
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden md:inline-flex">Stellar Testnet</Badge>
            <Link href="/trustless-work"><Button variant="outline">Escrow Layer</Button></Link>
            <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-8">
        <section>
          <DashboardStats
            totalRevenue="$0.155"
            totalTransactions={institutionalPartners.length * monetizedCapabilities.length}
            averageTransactionValue="$0.031"
            activeUsers={institutionalPartners.length}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <RecentTransactions transactions={recentTransactions} />
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Readiness snapshot</h2>
            <p className="mt-1 text-sm text-slate-500">Average institutional readiness: {averageReadiness}/100</p>
            <div className="mt-5 space-y-3">
              {institutionalPartners.map((partner) => (
                <div key={partner.slug} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{partner.name}</p>
                      <p className="text-sm text-slate-500">{partner.primaryAsset}</p>
                    </div>
                    <Badge variant="outline">{partner.readinessScore}/100</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <EndpointMetrics endpoints={endpointMetrics} />
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Operational thesis</h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
              <p>Start with read-heavy APIs for discovery, corridor intelligence and eligibility checks.</p>
              <p>Use smart-account policies and compliance hooks before exposing write endpoints for settlement.</p>
              <p>Focus first on MoneyGram, PayPal and Franklin Templeton, where the business narrative is clearest.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Escrow operations</h2>
              <p className="text-sm text-slate-500">Trustless Work milestones for institutional pilots</p>
            </div>
            <Link href="/trustless-work"><Button variant="outline">View escrow flows</Button></Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {escrowStatuses.map((escrow) => (
              <div key={escrow.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{escrow.partner}</p>
                  <Badge variant="outline">{formatEscrowStatus(escrow.status)}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-500">{escrow.asset}</p>
                <p className="mt-4 text-sm leading-6 text-slate-700">{escrow.currentMilestone}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>${escrow.amount.toLocaleString()}</span>
                  <span>{escrow.milestonesCompleted}/{escrow.totalMilestones} milestones</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function formatEscrowStatus(status: string) {
  switch (status) {
    case "scoping":
      return "Scoping";
    case "funded":
      return "Funded";
    case "in_review":
      return "In review";
    case "ready_to_release":
      return "Ready to release";
    default:
      return status;
  }
}

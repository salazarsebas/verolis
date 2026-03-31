"use client";

import { DashboardStats, RecentTransactions, EndpointMetrics } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Settings } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Monitor payments, revenue, and API usage
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden md:inline-flex">
                Stellar Testnet
              </Badge>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <section>
          <DashboardStats
            totalRevenue="$1,234.56"
            totalTransactions={12847}
            averageTransactionValue="$0.096"
            activeUsers={342}
          />
        </section>

        {/* Charts and Metrics */}
        <section className="grid gap-6 md:grid-cols-2">
          <RecentTransactions />
          <EndpointMetrics />
        </section>

        {/* Quick Actions */}
        <section className="p-6 rounded-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              Generate API Key
            </Button>
            <Button variant="outline">
              Configure Webhooks
            </Button>
            <Button variant="outline">
              View Settlement Reports
            </Button>
            <Button variant="outline">
              Manage Smart Accounts
            </Button>
          </div>
        </section>

        {/* Integration Status */}
        <section className="p-6 rounded-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-lg font-bold mb-4">Integration Status</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <StatusCard
              title="OpenZeppelin Relayer"
              status="Connected"
              statusType="success"
              endpoint="http://localhost:8080"
            />
            <StatusCard
              title="x402 Facilitator"
              status="Active"
              statusType="success"
              endpoint="/api/v1/plugins/x402"
            />
            <StatusCard
              title="Stellar Network"
              status="Testnet"
              statusType="info"
              endpoint="horizon-testnet.stellar.org"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatusCard({
  title,
  status,
  statusType,
  endpoint,
}: {
  title: string;
  status: string;
  statusType: "success" | "info" | "warning" | "error";
  endpoint: string;
}) {
  const statusColors = {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{title}</span>
        <Badge className={statusColors[statusType]}>{status}</Badge>
      </div>
      <p className="text-xs text-muted-foreground font-mono">{endpoint}</p>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Activity, Wallet, Clock, CheckCircle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({ title, value, description, icon, trend, trendUp }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3 w-3 mr-1 ${trendUp ? '' : 'rotate-180'}`} />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  totalRevenue?: string;
  totalTransactions?: number;
  averageTransactionValue?: string;
  activeUsers?: number;
}

export function DashboardStats({ 
  totalRevenue = "$0.00", 
  totalTransactions = 0, 
  averageTransactionValue = "$0.00",
  activeUsers = 0 
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={totalRevenue}
        description="From x402 payments"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend="+20.1% from last month"
        trendUp={true}
      />
      <StatsCard
        title="Transactions"
        value={totalTransactions.toLocaleString()}
        description="Total payments processed"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        trend="+180.1% from last month"
        trendUp={true}
      />
      <StatsCard
        title="Avg Transaction"
        value={averageTransactionValue}
        description="Average payment value"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Active Users"
        value={activeUsers.toLocaleString()}
        description="Unique wallets connected"
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        trend="+19% from last month"
        trendUp={true}
      />
    </div>
  );
}

interface Transaction {
  id: string;
  timestamp: string;
  endpoint: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  network: string;
  asset: string;
  from: string;
  transactionHash?: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export function RecentTransactions({ transactions = [] }: RecentTransactionsProps) {
  const defaultTransactions: Transaction[] = [
    {
      id: "txn-001",
      timestamp: new Date().toISOString(),
      endpoint: "/api/weather",
      amount: "$0.001",
      status: "completed",
      network: "stellar:testnet",
      asset: "USDC",
      from: "GABC...DEF1",
      transactionHash: "abc123...",
    },
    {
      id: "txn-002",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      endpoint: "/api/market-data",
      amount: "$0.01",
      status: "completed",
      network: "stellar:testnet",
      asset: "USDC",
      from: "GXYZ...789",
      transactionHash: "def456...",
    },
    {
      id: "txn-003",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      endpoint: "/api/kyc-verify",
      amount: "$0.50",
      status: "pending",
      network: "stellar:testnet",
      asset: "PYUSD",
      from: "G123...ABC",
    },
  ];

  const txns = transactions.length > 0 ? transactions : defaultTransactions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest x402 payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {txns.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  txn.status === "completed" 
                    ? "bg-green-100 dark:bg-green-900" 
                    : txn.status === "pending"
                    ? "bg-yellow-100 dark:bg-yellow-900"
                    : "bg-red-100 dark:bg-red-900"
                }`}>
                  {txn.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : txn.status === "pending" ? (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <Activity className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{txn.endpoint}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(txn.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{txn.amount}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {txn.asset}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {txn.network.split(":")[1]}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface EndpointMetricsProps {
  endpoints?: Array<{
    path: string;
    requests: number;
    revenue: string;
    avgResponseTime: string;
  }>;
}

export function EndpointMetrics({ endpoints = [] }: EndpointMetricsProps) {
  const defaultEndpoints = [
    { path: "/api/weather", requests: 1234, revenue: "$1.23", avgResponseTime: "45ms" },
    { path: "/api/market-data", requests: 567, revenue: "$5.67", avgResponseTime: "120ms" },
    { path: "/api/kyc-verify", requests: 89, revenue: "$44.50", avgResponseTime: "250ms" },
    { path: "/api/payment-process", requests: 234, revenue: "$23.40", avgResponseTime: "180ms" },
  ];

  const eps = endpoints.length > 0 ? endpoints : defaultEndpoints;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoint Metrics</CardTitle>
        <CardDescription>Performance and revenue by endpoint</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eps.map((endpoint) => (
            <div key={endpoint.path} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-mono font-medium">{endpoint.path}</p>
                <p className="text-xs text-muted-foreground">
                  {endpoint.requests.toLocaleString()} requests
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{endpoint.revenue}</p>
                <p className="text-xs text-muted-foreground">
                  {endpoint.avgResponseTime} avg
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

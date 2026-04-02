"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Shield, Key, DollarSign, Clock } from "lucide-react";

interface Signer {
  id: string;
  address: string;
  type: "ed25519" | "p256" | "secp256k1";
  weight: number;
}

interface Policy {
  id: string;
  type: "spending-limit" | "time-lock" | "multisig" | "allowlist";
  description: string;
  config: Record<string, string | number | boolean>;
}

interface SmartAccount {
  id: string;
  address: string;
  name: string;
  threshold: number;
  signers: Signer[];
  policies: Policy[];
  balance: string;
  asset: string;
}

export function SmartAccountManager() {
  const [accounts] = useState<SmartAccount[]>([
    {
      id: "1",
      address: "GABC123...DEF456",
      name: "Treasury Account",
      threshold: 2,
      signers: [
        { id: "1", address: "GABC...111", type: "ed25519", weight: 1 },
        { id: "2", address: "GDEF...222", type: "ed25519", weight: 1 },
        { id: "3", address: "GGHI...333", type: "ed25519", weight: 1 },
      ],
      policies: [
        {
          id: "1",
          type: "spending-limit",
          description: "Daily limit: $10,000",
          config: { limit: 10000, period: "daily" },
        },
        {
          id: "2",
          type: "spending-limit",
          description: "Per-transaction limit: $1,000",
          config: { limit: 1000, period: "transaction" },
        },
      ],
      balance: "125,430.50",
      asset: "USDC",
    },
    {
      id: "2",
      address: "GXYZ789...ABC123",
      name: "Operations Account",
      threshold: 1,
      signers: [
        { id: "4", address: "GJKL...444", type: "ed25519", weight: 1 },
      ],
      policies: [
        {
          id: "3",
          type: "spending-limit",
          description: "Daily limit: $5,000",
          config: { limit: 5000, period: "daily" },
        },
      ],
      balance: "45,200.00",
      asset: "USDC",
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case "spending-limit":
        return <DollarSign className="h-4 w-4" />;
      case "time-lock":
        return <Clock className="h-4 w-4" />;
      case "multisig":
        return <Shield className="h-4 w-4" />;
      case "allowlist":
        return <Key className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Smart Accounts</h2>
          <p className="text-muted-foreground">
            Manage institutional accounts with spending limits and multisig
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            render={(
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            )}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Smart Account</DialogTitle>
              <DialogDescription>
                Set up a new institutional smart account with custom policies
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Name</label>
                <Input placeholder="e.g., Treasury Account" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Signature Threshold</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Single signer)</SelectItem>
                    <SelectItem value="2">2-of-3 Multisig</SelectItem>
                    <SelectItem value="3">3-of-5 Multisig</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Initial Spending Limit</label>
                <Input type="number" placeholder="10000" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Create Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{account.name}</CardTitle>
                  <CardDescription className="font-mono">
                    {formatAddress(account.address)}
                  </CardDescription>
                </div>
                <Badge variant="outline">{account.asset}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Balance */}
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-2xl font-bold">{account.balance}</div>
                <p className="text-xs text-muted-foreground">Available Balance</p>
              </div>

              {/* Threshold */}
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Signature Threshold: {account.threshold}
                </span>
              </div>

              {/* Signers */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Signers ({account.signers.length})</span>
                </div>
                <div className="space-y-1">
                  {account.signers.map((signer) => (
                    <div
                      key={signer.id}
                      className="flex items-center justify-between text-sm p-2 rounded bg-gray-50 dark:bg-gray-900"
                    >
                      <span className="font-mono">{formatAddress(signer.address)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {signer.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Policies ({account.policies.length})</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {account.policies.map((policy) => (
                    <div
                      key={policy.id}
                      className="flex items-center gap-2 text-sm p-2 rounded bg-gray-50 dark:bg-gray-900"
                    >
                      {getPolicyIcon(policy.type)}
                      <span>{policy.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

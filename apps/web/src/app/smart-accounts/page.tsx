"use client";

import { SmartAccountManager } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Shield } from "lucide-react";

export default function SmartAccountsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Smart Accounts</h1>
              <p className="text-sm text-muted-foreground">
                Institutional accounts with programmable controls
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">OpenZeppelin Contracts</Badge>
              <Button variant="outline" size="icon">
                <BookOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="container mx-auto px-4 py-6">
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                OpenZeppelin Smart Account Contracts
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                These accounts use OpenZeppelin&apos;s audited Soroban contracts with composable authorization,
                spending limits, and multisig support. Perfect for institutional treasury management and
                compliance-controlled payments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        <SmartAccountManager />

        {/* Documentation Section */}
        <div className="mt-12 p-6 rounded-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-xl font-bold mb-4">Smart Account Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureItem
              title="Spending Limits"
              description="Set daily, weekly, or monthly spending limits per endpoint or counterparty. Automatically enforced on-chain."
              example="$10,000/day for API payments, $1,000/transaction"
            />
            <FeatureItem
              title="Multisig Approval"
              description="Require N-of-M signatures for transactions above threshold. Support for Ed25519, P256, and secp256k1 keys."
              example="2-of-3 for payments &gt;$5,000"
            />
            <FeatureItem
              title="Time Locks"
              description="Add delay periods for large transactions. Allows for review and cancellation before execution."
              example="24-hour delay for transactions &gt;$50,000"
            />
            <FeatureItem
              title="Compliance Hooks"
              description="Integrate KYC/AML checks, sanctions screening, and transaction freezing for regulated entities."
              example="Freeze/unwind for U.S. Bank compliance"
            />
            <FeatureItem
              title="Context Rules"
              description="Define scope-specific authorization rules. Different signers and policies for different operations."
              example="Deploy contracts: 2-of-3, API payments: 1-of-3"
            />
            <FeatureItem
              title="Multi-Asset Support"
              description="Hold and pay with USDC, PYUSD, EURC, and other Stellar assets. Automatic fee sponsorship."
              example="Pay fees in USDC instead of XLM"
            />
          </div>
        </div>

        {/* Integration Guide */}
        <div className="mt-8 p-6 rounded-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-xl font-bold mb-4">Deployment Guide</h2>
          <div className="space-y-4">
            <StepItem
              step={1}
              title="Configure Signers"
              description="Add the public keys of authorized signers. Choose from Ed25519 (Stellar native), P256 (Apple/TouchID), or secp256k1 (Ethereum)."
            />
            <StepItem
              step={2}
              title="Set Threshold"
              description="Define the signature threshold (e.g., 2-of-3). This determines how many signers must approve each transaction."
            />
            <StepItem
              step={3}
              title="Add Policies"
              description="Configure spending limits, time locks, and other constraints. Policies are enforced automatically on-chain."
            />
            <StepItem
              step={4}
              title="Deploy Account"
              description="Deploy the smart account contract to Stellar. Fund with XLM for rent reserves and USDC/PYUSD for payments."
            />
          </div>
        </div>

        {/* Resources */}
        <div className="mt-8 p-6 rounded-xl bg-white dark:bg-gray-800 border">
          <h2 className="text-xl font-bold mb-4">Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ResourceLink
              title="OpenZeppelin Docs"
              description="Smart account contract documentation"
              url="https://docs.openzeppelin.com/stellar-contracts/accounts/smart-account"
            />
            <ResourceLink
              title="Stellar Dev Docs"
              description="Soroban authorization guide"
              url="https://developers.stellar.org/docs/build/smart-contracts/soroban-auth"
            />
            <ResourceLink
              title="GitHub Repo"
              description="OpenZeppelin Stellar contracts source"
              url="https://github.com/OpenZeppelin/stellar-contracts"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureItem({
  title,
  description,
  example,
}: {
  title: string;
  description: string;
  example: string;
}) {
  return (
    <div className="p-4 rounded-lg border">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      <div className="p-2 rounded bg-gray-50 dark:bg-gray-900">
        <p className="text-xs font-mono text-blue-600">{example}</p>
      </div>
    </div>
  );
}

function StepItem({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function ResourceLink({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
    >
      <h3 className="font-semibold mb-1 text-blue-600">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </a>
  );
}

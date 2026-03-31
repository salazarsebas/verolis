import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Globe, Coins, Building2, Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">Stellar x402</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/demo" className="text-sm font-medium hover:text-blue-600">
              Demo
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/smart-accounts" className="text-sm font-medium hover:text-blue-600">
              Smart Accounts
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Launch App</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          Powered by x402 Protocol on Stellar
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Institutional Payments
          <br />
          <span className="text-blue-600">Reimagined for AI</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Enable autonomous AI agents and institutions to make programmatic, per-request payments
          without API keys, subscriptions, or billing infrastructure. Built on Stellar with &lt;5s settlement.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/demo">
            <Button size="lg" className="gap-2">
              Try Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Partners Section */}
      <section className="container mx-auto px-4 py-12 border-t">
        <p className="text-center text-sm text-gray-500 mb-8">
          Trusted by leading financial institutions and technology companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
          {["PayPal", "Visa", "MoneyGram", "Franklin Templeton", "U.S. Bank", "Mastercard"].map((partner) => (
            <div key={partner} className="text-xl font-semibold text-gray-400">
              {partner}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Built for Institutional Scale
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-blue-600" />}
            title="Instant Settlement"
            description="&lt;5 second settlement on Stellar with 99.99% uptime. Perfect for HTTP request cycles and real-time payments."
          />
          <FeatureCard
            icon={<Coins className="h-6 w-6 text-blue-600" />}
            title="Multi-Stablecoin"
            description="Support for USDC, PYUSD, EURC, and other native stablecoins. No wrapped tokens, no bridges."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-blue-600" />}
            title="OpenZeppelin Security"
            description="Audited smart account contracts and relayer infrastructure. Enterprise-grade security out of the box."
          />
          <FeatureCard
            icon={<Building2 className="h-6 w-6 text-blue-600" />}
            title="Institutional Controls"
            description="Spending limits, multisig approval, compliance hooks, and transaction freezing for regulated entities."
          />
          <FeatureCard
            icon={<Bot className="h-6 w-6 text-blue-600" />}
            title="AI Agent Ready"
            description="Autonomous payment discovery and execution. AI agents can pay for APIs without human intervention."
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-blue-600" />}
            title="Global Reach"
            description="Cross-border payments with 20-25% cost savings. Available in 170+ countries via MoneyGram integration."
          />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Use Cases
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <UseCaseCard
            title="API Micropayments"
            description="Charge $0.001 per API call instead of managing subscriptions. Perfect for weather data, market feeds, and AI inference."
            example="Weather API: $0.001/call → 1M calls = $1,000 revenue"
          />
          <UseCaseCard
            title="Cross-Border Remittance"
            description="Enable instant international payments with automatic currency conversion. 20-25% cost savings vs traditional providers."
            example="MoneyGram: Colombia → US, settled in USDC in &lt;5s"
          />
          <UseCaseCard
            title="KYC/Compliance Services"
            description="Pay-per-verification for identity checks, sanctions screening, and compliance workflows."
            example="KYC verification: $0.50/check with enhanced due diligence"
          />
          <UseCaseCard
            title="Tokenized Assets"
            description="Facilitate payments for access to tokenized treasuries, real estate, and other RWAs."
            example="Franklin Templeton: $580M+ in tokenized treasury access"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Payments?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Join leading institutions using x402 on Stellar for programmatic, autonomous payments.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-bold">Stellar x402</span>
              </div>
              <p className="text-sm text-gray-500">
                Institutional-grade x402 payment infrastructure on Stellar
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/demo" className="hover:text-blue-600">Demo</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
                <li><Link href="/smart-accounts" className="hover:text-blue-600">Smart Accounts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="https://developers.stellar.org/docs/build/apps/x402" className="hover:text-blue-600" target="_blank">Docs</a></li>
                <li><a href="https://x402.org" className="hover:text-blue-600" target="_blank">x402 Protocol</a></li>
                <li><a href="https://github.com/OpenZeppelin/relayer-plugin-x402-facilitator" className="hover:text-blue-600" target="_blank">OpenZeppelin</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>Built with OpenZeppelin Relayer, Soroban Smart Accounts, and the x402 Protocol</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function UseCaseCard({ title, description, example }: { title: string; description: string; example: string }) {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
        <p className="text-sm font-mono text-blue-600">{example}</p>
      </div>
    </div>
  );
}

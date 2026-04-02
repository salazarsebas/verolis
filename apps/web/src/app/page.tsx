import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Building2, ShieldCheck, Waves, WalletCards } from "lucide-react";
import { institutionalPartners, monetizedCapabilities } from "@verolis/institutional-domain";
import { Button } from "@/components/ui/button";

const featuredPartners = institutionalPartners.slice(0, 7);
const topPartners = [...institutionalPartners]
  .sort((left, right) => right.readinessScore - left.readinessScore)
  .slice(0, 3);

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfccb,_#ffffff_45%,_#f8fafc_100%)] text-slate-950">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-700">Verolis</p>
            <h1 className="text-xl font-semibold">Institutional x402 on Stellar</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/demo"><Button variant="outline">API Demo</Button></Link>
            <Link href="/trustless-work"><Button variant="outline">Escrow Layer</Button></Link>
            <Link href="/dashboard"><Button>Adoption Console</Button></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-14">
        <section className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-2 text-sm font-medium text-lime-900">
              <ShieldCheck className="h-4 w-4" />
              x402 as the payment primitive for institutional Stellar partnerships
            </div>
            <h2 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Monetize institutional payment intelligence, not just generic API calls.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              The project objective is now explicit: identify how PayPal, Visa, Wirex, MoneyGram, Franklin Templeton,
              U.S. Bank and AirTM can expose high-value Stellar services behind `x402`, then package those flows
              as request-priced APIs for treasury, remittance, compliance and tokenized assets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo">
                <Button size="lg" className="gap-2">
                  Explore paid endpoints
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/smart-accounts">
                <Button size="lg" variant="outline">Policy controls</Button>
              </Link>
              <Link href="/trustless-work">
                <Button size="lg" variant="outline">Trustless Work</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Highest readiness</p>
            <div className="mt-5 space-y-4">
              {topPartners.map((partner) => (
                <div key={partner.slug} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{partner.name}</h3>
                      <p className="text-sm text-slate-500">{partner.primaryAsset}</p>
                    </div>
                    <span className="rounded-full bg-lime-100 px-3 py-1 text-sm font-semibold text-lime-900">
                      {partner.readinessScore}/100
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{partner.opportunity}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <p className="text-center text-sm uppercase tracking-[0.24em] text-slate-500">Institution map</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {featuredPartners.map((partner) => (
              <div key={partner.slug} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">{partner.name}</span>
                  <span className="text-sm text-slate-500">{partner.primaryAsset}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{partner.stellarRelationship}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          <FocusCard
            icon={<Building2 className="h-5 w-5" />}
            title="Partner discovery"
            description="Use x402 to charge for institutional discovery APIs that show where Stellar alliances can be commercialized first."
          />
          <FocusCard
            icon={<Waves className="h-5 w-5" />}
            title="Rail intelligence"
            description="Package remittance corridors, treasury rails and payout routes as individually priced responses."
          />
          <FocusCard
            icon={<WalletCards className="h-5 w-5" />}
            title="Asset access"
            description="Expose USDC, PYUSD, EURC and tokenized treasury workflows through the same payment surface."
          />
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white">
          <div className="flex items-center gap-2 text-sm font-medium text-lime-300">
            <BadgeDollarSign className="h-4 w-4" />
            Monetized capabilities
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {monetizedCapabilities.map((capability) => (
              <div key={capability.endpoint} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">{capability.name}</h3>
                  <span className="rounded-full bg-lime-300 px-3 py-1 text-sm font-semibold text-slate-950">
                    {capability.price}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{capability.description}</p>
                <p className="mt-3 font-mono text-sm text-lime-200">{capability.endpoint}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FocusCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex rounded-full bg-slate-950 p-3 text-lime-300">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

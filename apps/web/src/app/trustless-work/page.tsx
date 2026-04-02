import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRightLeft, FileSignature, Landmark, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { listInstitutionalEscrowBlueprints } from "@/lib/trustless-work/templates";
import { TrustlessWorkClient } from "@/lib/trustless-work/client";
import {
  buildInitializeMultiReleaseEscrowPayload,
  createDefaultRoleSet,
} from "@/lib/trustless-work/payloads";

const blueprints = listInstitutionalEscrowBlueprints();
const client = new TrustlessWorkClient({
  network: "testnet",
  apiKey: process.env.NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY,
});
const examplePayload = buildInitializeMultiReleaseEscrowPayload(blueprints[0], {
  signer: "SIGNER_ADDRESS",
  engagementId: `eng-${blueprints[0].partnerSlug}-pilot`,
  trustlineAddress: "TRUSTLINE_ASSET_ADDRESS",
  roles: createDefaultRoleSet(blueprints[0].partnerSlug.toUpperCase()),
});

export default function TrustlessWorkPage() {
  const config = client.getConfig();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-semibold">Trustless Work Layer</h1>
            <p className="text-sm text-slate-500">
              Multi-release escrow for institutional pilots on top of x402 discovery and monetized APIs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Trustless Work</Badge>
            <Badge variant="outline">{config.hasApiKey ? "API key configured" : "Read-only mode"}</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-8">
        <section className="grid gap-6 lg:grid-cols-3">
          <InfoCard
            icon={<ArrowRightLeft className="h-5 w-5" />}
            title="After x402"
            description="Use x402 for partner discovery and request-priced APIs. Use Trustless Work when the institution moves into paid implementation."
          />
          <InfoCard
            icon={<FileSignature className="h-5 w-5" />}
            title="Milestone delivery"
            description="Break pilots into discovery, sandbox, compliance and launch phases with independent releases."
          />
          <InfoCard
            icon={<ShieldAlert className="h-5 w-5" />}
            title="Operational trust"
            description="Approver, release signer and dispute resolver roles fit regulated institutions much better than one-shot transfers."
          />
        </section>

        <section className="rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Institutional escrow templates</h2>
              <p className="text-sm text-slate-500">
                Pre-modeled multi-release pilots to combine API monetization and escrowed implementation work
              </p>
            </div>
            <Badge variant="outline">{config.baseUrl}</Badge>
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Institution</TableHead>
                  <TableHead>Escrow</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Milestones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blueprints.map((blueprint) => (
                  <TableRow key={blueprint.partnerSlug}>
                    <TableCell className="font-medium">{blueprint.partnerName}</TableCell>
                    <TableCell>{blueprint.title}</TableCell>
                    <TableCell>{blueprint.settlementAsset}</TableCell>
                    <TableCell>${blueprint.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{blueprint.phases.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-semibold">Deployment payload example</h2>
            <p className="mt-2 text-sm text-slate-500">
              This payload is generated directly from the institutional blueprint and is ready to send to the
              Trustless Work deployer before wallet signature.
            </p>
            <pre className="mt-5 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-lime-200">
              {JSON.stringify(examplePayload, null, 2)}
            </pre>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-semibold">Execution path</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <p>1. Build `InitializeMultiReleaseEscrowPayload` from the selected institutional blueprint.</p>
              <p>2. Call the Trustless Work deployer and receive an unsigned XDR.</p>
              <p>3. Sign the XDR with a compatible Stellar wallet using the correct network passphrase.</p>
              <p>4. Submit the signed transaction through `/helper/send-transaction`.</p>
              <p>5. Track milestone approvals, releases and disputes in the operational dashboard.</p>
            </div>
            <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
              This repo now includes the payload builder and wallet-signing executor scaffold. Live deployment still
              requires real addresses, funded trustlines and a wallet session in the browser.
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {blueprints.slice(0, 4).map((blueprint) => (
            <div key={blueprint.partnerSlug} className="rounded-3xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{blueprint.partnerName}</h3>
                  <p className="text-sm text-slate-500">{blueprint.title}</p>
                </div>
                <Badge variant="outline">{blueprint.settlementAsset}</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{blueprint.description}</p>
              <div className="mt-5 space-y-3">
                {blueprint.phases.map((phase, index) => (
                  <div key={phase.description} className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold">
                      {index + 1}. {phase.description}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">${phase.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-lime-200 bg-lime-50 p-6">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-lime-800" />
            <h2 className="text-xl font-semibold text-lime-950">Recommended combined flow</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p>1. Charge discovery and readiness endpoints through x402.</p>
            <p>2. When an institution decides to pilot, deploy a multi-release Trustless Work escrow.</p>
            <p>3. Use milestone approvals for sandbox, compliance and production sign-off.</p>
            <p>4. Keep the long-term operational APIs on x402 after implementation is complete.</p>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/demo"><Button>Back to x402 demo</Button></Link>
            <Link href="/dashboard"><Button variant="outline">Open adoption console</Button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="mb-4 inline-flex rounded-full bg-slate-950 p-3 text-lime-300">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

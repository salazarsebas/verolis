# Verolis: Institutional x402 on Stellar

Verolis is an institutional discovery and monetization layer built on Stellar.
Its goal is not to showcase generic paywalled APIs, but to identify where `x402`
can unlock real institutional adoption across partners linked to the Stellar ecosystem:

- PayPal
- Visa
- Wirex
- MoneyGram
- Franklin Templeton
- U.S. Bank
- AirTM

The current product thesis is:

1. Map institutional partners, rails, stablecoins and tokenized-asset workflows.
2. Package that intelligence as high-value request-priced APIs using `x402`.
3. Add smart-account controls, policy checks and facilitator-backed settlement.
4. Use Trustless Work escrows for milestone-based institutional pilots and implementation agreements.

## What Changed

The project has been refocused around institutional adoption instead of generic demo endpoints such as weather and market data.

New paid API surfaces:

- `GET /api/partners`
- `GET /api/partners/:slug/readiness`
- `GET /api/rails`
- `POST /api/compliance/screening-quote`
- `GET /api/assets/tokenized-access`

New escrow planning surface:

- `/trustless-work`

New Trustless Work building blocks:

- `src/lib/trustless-work/payloads.ts`
- `src/lib/trustless-work/executor.ts`
- `src/lib/trustless-work/status.ts`

The frontend now mirrors that same domain:

- Landing page: institutional adoption thesis
- Demo: paid institutional endpoints
- Dashboard: readiness and monetization console

## Architecture

```text
Next.js frontend
  -> institutional discovery UI
  -> x402 demo paywall components
  -> adoption dashboard

Express API
  -> @x402/express middleware
  -> Stellar exact payment scheme
  -> institutional partner/readiness/rail endpoints

OpenZeppelin Relayer + x402 facilitator plugin
  -> verify / settle / supported flows

Stellar
  -> stablecoin rails
  -> auth-entry signing for production x402 flows
  -> smart-account policy enforcement
```

## Current Status

What is implemented:

- Institutional partner catalog for the target organizations
- Paid endpoints aligned with partner discovery and adoption analysis
- OpenZeppelin relayer/facilitator configuration
- Smart-account UX for policy-oriented treasury controls
- Trustless Work escrow blueprints for multi-release institutional pilots
- Trustless Work REST client scaffolding for deploy, fund, approve, release and dispute flows
- Payload generation from institutional blueprints into deployable multi-release escrow requests
- Freighter-based executor scaffold to sign returned XDRs and send them through Trustless Work helpers

What remains roadmap:

- Production-grade browser `x402` flow with real Soroban auth-entry signing
- Live institution data feeds instead of curated internal scoring
- Mainnet asset configuration and partner-specific settlement paths
- Compliance provider integrations
- Signed XDR submission flow wired from browser wallets into Trustless Work transactions

Important:
The browser client is still a demo helper. Production Stellar `x402` requires a wallet/signer flow that can sign Soroban auth entries.

## Local Development

### Prerequisites

- Node.js 18+
- Docker
- A Stellar-compatible wallet for frontend demos

### Install

```bash
npm install
cd apps/api && npm install
```

### Environment

Create `.env` values for:

```bash
STELLAR_ADDRESS=...
FACILITATOR_URL=http://localhost:8080/api/v1/plugins/x402/call
RELAYER_API_KEY=...
NETWORK=stellar:testnet
NEXT_PUBLIC_API_URL=http://localhost:4021
NEXT_PUBLIC_STELLAR_PAY_TO=...
```

### Infrastructure

```bash
cd infra/docker
docker compose up -d
```

### App servers

```bash
# root
npm run dev

# api
cd apps/api
npm run dev
```

## Project Direction

The strongest near-term commercialization paths in this repo are:

- MoneyGram: corridor lookup, payout eligibility, cash-out quoting
- PayPal: PYUSD treasury and merchant APIs
- Franklin Templeton: tokenized treasury access and eligibility workflows
- Visa/Wirex: routing intelligence and treasury settlement APIs
- U.S. Bank: policy-heavy compliance and approval APIs
- AirTM: payroll and cross-border disbursement APIs

Trustless Work fits the second phase of those deals:

- `x402`: charge discovery, scoring and operational APIs per request
- Trustless Work: escrow implementation work by milestone

## References

Official and primary references used for the new direction:

- Stellar x402 docs: https://developers.stellar.org/docs/build/agentic-payments/x402
- Stellar x402 quickstart: https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide
- Stellar MPP docs: https://developers.stellar.org/docs/build/agentic-payments/mpp
- Stellar x402 monorepo: https://github.com/stellar/x402-stellar
- OpenZeppelin Stellar x402 facilitator guide: https://docs.openzeppelin.com/relayer/1.4.x/guides/stellar-x402-facilitator-guide
- Stellar signing guide: https://developers.stellar.org/docs/build/guides/transactions/signing-soroban-invocations
- Stellar Quickstart tooling: https://developers.stellar.org/docs/tools/quickstart

## Notes

- Prefer Stellar RPC-era tooling and current docs over older Horizon-first examples.
- Use `@x402/fetch` or the official Stellar x402 client patterns when wiring a real payer flow.
- Keep browser UX explicit about what is simulated versus what is facilitator-settled on-chain.

# Verolis

Verolis is an institutional commercialization layer for Stellar. It turns payment-rail intelligence, compliance workflows, and tokenized-asset access into request-priced APIs powered by `x402`.

This repository is not a generic crypto demo. It is a product thesis and technical foundation for selling institutional infrastructure:

- Discovery APIs for partner readiness and monetizable rails
- `x402`-gated premium endpoints on Stellar
- Smart-account controls for treasury and policy enforcement
- Trustless Work escrow flows for milestone-based implementation deals
- OpenZeppelin Relayer integration for facilitator-backed settlement

## Why This Matters

Most API monetization products stop at API keys and Stripe billing. Verolis takes a different position:

- Price infrastructure access per request, not per seat
- Remove invoice friction for machines, agents, and cross-border workflows
- Package institutional knowledge as a paid product
- Turn Stellar ecosystem distribution into something sellable to banks, fintechs, remittance players, and asset managers

The commercialization angle is the differentiator. A buyer should immediately understand where revenue comes from:

- MoneyGram: corridor lookup, cash-out quoting, remittance intelligence
- PayPal: PYUSD merchant treasury and settlement workflows
- Franklin Templeton: tokenized treasury access and eligibility APIs
- Visa and Wirex: routing, treasury, and payout orchestration intelligence
- U.S. Bank: policy-heavy compliance and approval workflows
- AirTM: payroll and cross-border disbursement APIs

## Product Surface

### Frontend

- Landing page with product positioning and institutional narrative
- Demo page that exercises paid endpoints
- Dashboard for readiness, endpoint metrics, and escrow operations
- Smart accounts page for treasury-control concepts
- Trustless Work page for milestone escrow packaging

### API

Paid endpoints:

- `GET /api/partners`
- `GET /api/partners/:slug/readiness`
- `GET /api/rails`
- `POST /api/compliance/screening-quote`
- `GET /api/assets/tokenized-access`

Operational endpoints:

- `GET /health`
- `GET /api/supported`

## Architecture

```text
Next.js app
  -> product narrative, dashboard, demo UX
  -> client-side x402 payment helpers

Express API
  -> institutional catalog and pricing model
  -> x402 middleware protection
  -> readiness, rails, compliance, tokenized asset endpoints

OpenZeppelin Relayer + x402 plugin
  -> facilitator-backed verification / settlement

Stellar
  -> testnet/mainnet settlement surface
  -> stablecoin and tokenized-asset flows
  -> Soroban smart-account policy enforcement
```

## Repository Layout

```text
apps/
  web/
    src/                Next.js routes, components, and app-side libraries
    public/             Static assets
  api/
    src/                Express API and institutional payment catalog

packages/
  institutional-domain/ Shared partner catalog, pricing, and domain types

platform/
  contracts/
    smart-account/      Soroban smart-account config
  relayer/
    plugins/x402/       Facilitator plugin setup
    config/             Relayer runtime configuration

infra/docker/           Local infrastructure orchestration
docs/                   Product, architecture, deployment, and integration docs
scripts/                Local bootstrap helpers
```

## Local Setup

### Prerequisites

- Bun 1.3+
- Docker with Docker Compose
- A Stellar-compatible wallet for browser demos

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Required variables:

- `STELLAR_ADDRESS`
- `FACILITATOR_URL`
- `RELAYER_API_KEY`
- `NETWORK`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STELLAR_PAY_TO`

### 3. Start infrastructure

```bash
cd infra/docker
docker compose up -d
```

### 4. Start the applications

```bash
# web
bun run dev

# api
bun run dev:api
```

### One-command bootstrap

```bash
./scripts/quickstart.sh
```

## Current Reality

What is solid today:

- Clear institutional positioning
- Paid endpoint model aligned to real buyer personas
- Frontend demo and dashboard flows
- API tests
- Shared institutional domain package consumed by web and API
- Relayer and Docker scaffolding
- Trustless Work payload and template helpers

What is still demo or placeholder territory:

- Browser-native production signing for Stellar `x402`
- Live partner, compliance, and market data integrations
- Production-grade shared package boundaries between web and API
- Mainnet-ready secrets, telemetry, and audit logging
- Real transactional analytics instead of mocked dashboard metrics

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Institutional Integration](./docs/INSTITUTIONAL_INTEGRATION.md)
- [Project Summary](./docs/PROJECT_SUMMARY.md)

## Positioning

Verolis should be presented as infrastructure for teams that want to monetize institutional financial workflows on Stellar without building custom billing rails first.

That means the pitch is not "a payment demo." The pitch is:

> sell premium financial infrastructure as APIs, settle access with `x402`, and expand from read-heavy intelligence products into policy-controlled institutional execution.

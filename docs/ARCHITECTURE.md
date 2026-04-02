# Verolis Architecture

## Executive View

Verolis combines product storytelling, request-priced API monetization, and Stellar-native settlement primitives in one repository. The platform is structured around four layers:

1. Experience layer: Next.js pages that explain the product, surface demos, and present institutional workflows.
2. Monetization layer: Express endpoints protected by `x402`.
3. Settlement layer: OpenZeppelin Relayer plus the `x402` facilitator plugin.
4. Execution layer: Stellar accounts, assets, and Soroban-compatible policy controls.

## Runtime Components

### Web App

Path: `apps/web/src/`

Responsibilities:

- Present Verolis as an institutional product
- Trigger paid endpoint flows from the browser
- Demonstrate trustless-work and smart-account concepts
- Surface mock metrics and readiness views for product demos

Key folders:

- `apps/web/src/app/`: page routes
- `apps/web/src/components/paywall/`: payment-gated UI
- `apps/web/src/components/dashboard/`: metrics and operator views
- `apps/web/src/lib/x402/`: browser helper utilities
- `apps/web/src/lib/trustless-work/`: escrow payloads and execution helpers
- `apps/web/src/lib/institutional/`: institutional services and domain helpers

### API

Path: `apps/api/src/`

Responsibilities:

- Define the institutional catalog and endpoint pricing
- Attach `paymentMiddleware(...)` to protected routes
- Return discovery, readiness, compliance, and tokenized-asset data
- Expose health and supported-endpoint metadata

Current limitation:

- The API uses curated in-repo data rather than live institutional or compliance providers.

### Shared Domain Package

Path: `packages/institutional-domain/`

Responsibilities:

- Centralize partner metadata, monetized capabilities, and payment requirement definitions
- Eliminate duplicated business-domain constants between the web app and API
- Provide a clean first step toward a real package-based monorepo

### Relayer

Path: `platform/relayer/`

Responsibilities:

- Bridge Verolis to OpenZeppelin Relayer runtime
- Support `verify`, `settle`, and `supported` facilitator actions
- Centralize network-specific settlement configuration

### Contracts

Path: `platform/contracts/smart-account/`

Responsibilities:

- Hold Soroban smart-account configuration artifacts
- Document policy-oriented account controls

Current limitation:

- Contract deployment and lifecycle management are not fully integrated into the web or API flows yet.

## Data Flow

### Paid API Request

1. A user or agent requests a protected Verolis endpoint.
2. The API returns `402 Payment Required` when no valid `x402` payment is attached.
3. The client builds a Stellar-compatible payment payload.
4. The facilitator verifies and settles through the relayer path.
5. The API serves the requested institutional data.

### Institutional Pilot Flow

1. A buyer uses paid read endpoints to evaluate partner readiness.
2. The commercial engagement moves into a milestone implementation deal.
3. Trustless Work payloads model the escrow and release structure.
4. Smart-account controls become relevant for treasury and approval workflows.

## Current Structural Gaps

- Web and API are colocated but not managed as a formal workspace package architecture.
- Institutional domain data is duplicated across surfaces instead of living in a shared package.
- Several screens still depend on static demo data rather than backed services.
- The repo mixes product code, infra, relayer, and contract assets without a stronger package boundary strategy.

## Recommended Next Structure

```text
apps/
  web/
    src/
    public/
  api/
    src/

packages/
  institutional-domain/

platform/
  contracts/
    smart-account/
  relayer/

docs/
infra/
scripts/
```

This structure already improves ownership and discoverability. The next worthwhile step would be extracting shared domain packages once the web and API boundaries stabilize.

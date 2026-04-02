# Institutional Integration Guide

## Purpose

This document explains how Verolis should be presented and integrated for different institutional buyer profiles. The goal is not to claim completed partnerships. The goal is to show where `x402`-priced infrastructure is commercially strongest.

## Integration Model

Verolis has a simple commercial ladder:

1. Sell read-heavy APIs first.
2. Use those APIs to prove operational value.
3. Expand into policy, settlement, and implementation workflows.
4. Package larger delivery engagements with Trustless Work escrow flows.

## Partner Profiles

### MoneyGram

Best pitch:

- corridor discovery
- payout eligibility
- cash-out quoting
- remittance status APIs

Why it works:

- clear Stellar ecosystem relevance
- obvious cross-border business case
- easy story for reducing friction in payout discovery

Best first endpoint:

- `GET /api/partners/moneygram/readiness`

### PayPal

Best pitch:

- PYUSD treasury workflows
- merchant settlement intelligence
- payout orchestration APIs

Why it works:

- strong stablecoin narrative
- clean fit for merchant and treasury tooling
- attractive to agentic commerce and API-first product teams

### Franklin Templeton

Best pitch:

- NAV access
- tokenized treasury eligibility
- subscription workflow intelligence

Why it works:

- premium data and eligibility flows support premium pricing
- buyer persona is closer to enterprise data product consumption

### Visa and Wirex

Best pitch:

- routing intelligence
- settlement readiness
- cross-border treasury operations
- payout orchestration

Why it works:

- card and treasury infrastructure naturally map to paid operational APIs

### U.S. Bank

Best pitch:

- compliance quoting
- approval workflows
- policy decisioning
- audit-heavy treasury controls

Why it works:

- high willingness to pay for risk-reducing infrastructure
- strong alignment with smart-account policy stories

### AirTM

Best pitch:

- payroll quoting
- corridor validation
- disbursement orchestration

Why it works:

- strong LatAm-friendly commercialization narrative
- payroll and cross-border operations are easy to explain to buyers

## Integration Conversation Template

Use this structure in demos, proposals, or buyer calls:

1. Identify the institutional workflow.
2. Explain why the workflow should be monetized per request.
3. Map the workflow to a Stellar-native settlement story.
4. Show how `x402` reduces billing overhead.
5. Introduce policy controls or escrow only after the read-heavy API story lands.

## Messaging Guidance

Lead with:

- premium infrastructure access
- machine-native settlement
- operational intelligence as a product
- request-priced monetization

Avoid leading with:

- generic blockchain claims
- speculative token messaging
- unfinished production promises

## What Buyers Will Ask

### Is this production-ready?

Current answer:

The architecture direction is credible, the demo is coherent, and the repo provides a strong prototype foundation. Some flows remain simulated or curated and should be positioned honestly as staged implementation work.

### What gets sold first?

Current answer:

Read-heavy APIs for partner discovery, readiness, routing, compliance quoting, and tokenized-asset access.

### What gets sold second?

Current answer:

Institution-specific integrations, policy controls, treasury workflows, and milestone-based implementation work using escrow structures.

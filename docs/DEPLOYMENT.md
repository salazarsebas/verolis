# Verolis Deployment Guide

## Scope

This guide covers the current deployment shape of Verolis:

- Next.js web app
- Express API
- OpenZeppelin Relayer with `x402` plugin
- Redis-backed relayer state

This is a practical deployment baseline, not a full production certification guide.

## Environments

### Local

Use local for:

- frontend and API development
- demo validation
- relayer plugin smoke testing

Stack:

- Next.js on `3000`
- API on `4021`
- Relayer on `8080`
- Redis on `6379`

### Production

Production should add:

- managed secrets
- HTTPS termination
- centralized logs
- health checks and alerting
- restricted network exposure
- wallet and signing operational controls

## Required Environment Variables

### Web

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STELLAR_PAY_TO`
- `NEXT_PUBLIC_WEBHOOK_URL` optional

### API

- `API_PORT` or `PORT`
- `STELLAR_ADDRESS`
- `FACILITATOR_URL`
- `RELAYER_API_KEY`
- `NETWORK`

### Relayer

- `KEYSTORE_PASSPHRASE`
- Redis connection details
- any network-specific facilitator configuration

## Local Deployment

### 1. Install dependencies

```bash
npm install
cd apps/api && npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Start infrastructure

```bash
cd infra/docker
docker compose up -d
```

### 4. Run applications

```bash
# terminal 1
npm run dev

# terminal 2
cd apps/api
npm run dev
```

## Container Topology

The current Docker Compose file provisions:

- `redis`
- `relayer`
- `api`

The web app currently runs outside Compose during development. For production, either add a dedicated web service image or deploy the Next.js app separately behind the same domain strategy.

## Recommended Production Shape

### Ingress

- Put a reverse proxy or managed load balancer in front
- Terminate TLS at the edge
- Route `/` to web and `/api` to the backend surface

### API Hardening

- Validate all env vars on startup
- Restrict CORS to known origins
- Add rate limits and request timeouts
- Emit structured logs with request IDs

### Relayer Hardening

- Keep signer material out of the repo
- Use managed secret storage
- Restrict plugin exposure to the minimum required routes
- Monitor settlement failures and replay conditions

### Operational Monitoring

- uptime checks for `/health`
- error-rate alerts for API and relayer
- payment failure dashboards
- wallet and settlement anomaly alerts

## What Is Missing Before True Production Readiness

- environment schema validation
- CI/CD deployment pipeline
- managed mainnet secret lifecycle
- real compliance provider integrations
- formal audit logging and retention strategy
- API schema docs generated from code

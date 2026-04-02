# API Server Dockerfile
FROM oven/bun:1.3.11-alpine

WORKDIR /app

# Install workspace dependencies
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY packages/institutional-domain/package.json packages/institutional-domain/package.json
RUN bun install --frozen-lockfile

# Copy source code and shared packages
COPY apps/api /app/apps/api
COPY packages /app/packages

WORKDIR /app/apps/api

# Build (tests are excluded via tsconfig)
RUN bun run build

EXPOSE 4021

CMD ["bun", "run", "start"]

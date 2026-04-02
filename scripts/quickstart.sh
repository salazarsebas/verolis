#!/bin/bash

# Stellar x402 Quick Start Script
# This script sets up and runs the Stellar x402 DApp locally

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║        Stellar x402 Institutional Payment DApp            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ All prerequisites met"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
cd "$PROJECT_ROOT"

if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Root and web dependencies installed"
else
    echo "✅ Root and web dependencies already installed"
fi

if [ ! -d "apps/api/node_modules" ]; then
    (cd "$PROJECT_ROOT/apps/api" && npm install)
    echo "✅ API dependencies installed"
else
    echo "✅ API dependencies already installed"
fi

# Copy environment file if not exists
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo "📝 Creating environment file..."
    cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
    echo "⚠️  Please update .env with your configuration"
    echo ""
fi

# Start infrastructure
echo "🚀 Starting infrastructure (Redis, Relayer, API)..."
cd "$PROJECT_ROOT/infra/docker"

# Check if containers are already running
if $COMPOSE_CMD ps | grep -q "Up"; then
    echo "⚠️  Infrastructure already running. Stopping first..."
    $COMPOSE_CMD down
fi

$COMPOSE_CMD up -d
echo "✅ Infrastructure started"
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Relayer is healthy"
else
  echo "⚠️  Relayer may not be ready yet. Check logs with: docker-compose logs -f"
fi

cd "$PROJECT_ROOT"

# Start frontend
echo ""
echo "🌐 Starting frontend development server..."
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  Server will be available at:                             ║"
echo "║  - Frontend: http://localhost:3000                        ║"
echo "║  - Demo: http://localhost:3000/demo                       ║"
echo "║  - Dashboard: http://localhost:3000/dashboard             ║"
echo "║  - API: http://localhost:4021                             ║"
echo "║                                                           ║"
echo "║  To stop all services:                                    ║"
echo "║  $ cd infra/docker && $COMPOSE_CMD down                   ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

npm run dev

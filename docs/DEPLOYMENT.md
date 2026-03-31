# Stellar x402 Deployment Guide

This guide covers deploying the Stellar x402 Institutional Payment DApp to production.

## Prerequisites

- Docker & Docker Compose
- Stellar mainnet account with XLM balance
- OpenZeppelin Relayer API key (for mainnet)
- Domain name for HTTPS (required for production)

## Phase 1: Infrastructure Setup

### 1.1 Configure Production Environment

Create `.env.production`:

```bash
# Production Environment Configuration

# Relayer Configuration
KEYSTORE_PASSPHRASE=<secure-passphrase>
RELAYER_API_KEY=<production-api-key>

# Stellar Mainnet
NETWORK=stellar:mainnet
STELLAR_ADDRESS=<your-mainnet-stellar-address>

# OpenZeppelin Channels Service (recommended for high throughput)
CHANNELS_API_KEY=<channels-api-key>
CHANNELS_FUND_ADDRESS=<channel-funding-address>

# Facilitator URLs (Mainnet)
FACILITATOR_URL=https://channels.openzeppelin.com/x402
CHANNELS_SERVICE_URL=https://channels.openzeppelin.com

# Supported Assets (Mainnet contract addresses)
USDC_ASSET=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
PYUSD_ASSET=KGZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
EURC_ASSET=HGZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN

# API Configuration
API_PORT=4021
FRONTEND_URL=https://your-domain.com

# Webhook for payment notifications
WEBHOOK_URL=https://your-domain.com/api/webhooks/payments

# Logging
LOG_LEVEL=warn
NODE_ENV=production
```

### 1.2 Update Relayer Configuration

Edit `relayer/config/config.json` for mainnet:

```json
{
  "relayers": [
    {
      "id": "stellar-mainnet",
      "name": "Stellar Mainnet Relayer",
      "network": "mainnet",
      "paused": false,
      "network_type": "stellar",
      "signer_id": "stellar-mainnet-signer",
      "policies": {
        "fee_payment_strategy": "relayer",
        "min_balance": 0,
        "max_transaction_value": "100000000000",
        "allowed_operations": [
          "payment",
          "pathPaymentStrictSend",
          "invokeHostFunction"
        ],
        "sponsored_transactions": true
      }
    }
  ],
  "signers": [
    {
      "id": "stellar-mainnet-signer",
      "type": "local",
      "network": "mainnet",
      "config": {
        "path": "keys/stellar-mainnet-signer.json",
        "passphrase": {
          "type": "env",
          "value": "KEYSTORE_PASSPHRASE"
        }
      }
    }
  ],
  "plugins": [
    {
      "id": "x402",
      "path": "plugins/x402/index.ts",
      "emit_logs": false,
      "emit_traces": false,
      "raw_response": true,
      "forward_logs": true,
      "allow_get_invocation": true,
      "timeout": 30,
      "config": {
        "networks": [
          {
            "network": "stellar:mainnet",
            "type": "stellar",
            "relayer_id": "stellar-mainnet",
            "assets": [
              "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
            ],
            "channel_service_api_url": "https://channels.openzeppelin.com",
            "channel_service_api_key": "${CHANNELS_API_KEY}",
            "channel_service_fund_relayer_address": "${CHANNELS_FUND_ADDRESS}"
          }
        ]
      }
    }
  ]
}
```

### 1.3 Generate Keystore

```bash
# Navigate to relayer config directory
cd relayer/config/keys

# Generate keystore for mainnet signer
# (Use Stellar Laboratory or CLI tools)
stellar keys generate --mainnet stellar-mainnet-signer

# Encrypt keystore with passphrase
stellar keys encrypt stellar-mainnet-signer
```

## Phase 2: Docker Deployment

### 2.1 Update Docker Compose for Production

Create `infra/docker/docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: stellar-x402-redis
    restart: always
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  relayer:
    build:
      context: ../../relayer
      dockerfile: Dockerfile
    container_name: stellar-x402-relayer
    restart: always
    environment:
      - DATABASE_URL=redis://redis:6379
      - API_PORT=8080
      - LOG_LEVEL=warn
      - METRICS_ENABLED=true
      - KEYSTORE_PASSPHRASE=${KEYSTORE_PASSPHRASE}
    ports:
      - "127.0.0.1:8080:8080"  # Bind to localhost only
    volumes:
      - ../../relayer/config/config.json:/app/config/config.json
      - ../../relayer/config/keys:/app/config/keys
    depends_on:
      redis:
        condition: service_healthy

  api:
    build:
      context: ../../apps/api
      dockerfile: Dockerfile
    container_name: stellar-x402-api
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=4021
      - STELLAR_ADDRESS=${STELLAR_ADDRESS}
      - FACILITATOR_URL=${FACILITATOR_URL}
      - RELAYER_API_KEY=${RELAYER_API_KEY}
      - NETWORK=${NETWORK}
      - WEBHOOK_URL=${WEBHOOK_URL}
    ports:
      - "127.0.0.1:4021:4021"  # Bind to localhost only
    depends_on:
      - relayer

  web:
    build:
      context: ../../stellar-x402
      dockerfile: Dockerfile
    container_name: stellar-x402-web
    restart: always
    environment:
      - NEXT_PUBLIC_API_URL=https://your-domain.com/api
      - NEXT_PUBLIC_FACILITATOR_URL=${FACILITATOR_URL}
      - NEXT_PUBLIC_NETWORK=${NETWORK}
    ports:
      - "3000:3000"
    depends_on:
      - api

  nginx:
    image: nginx:alpine
    container_name: stellar-x402-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api

volumes:
  redis_data:
```

### 2.2 Nginx Configuration

Create `infra/docker/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream web {
        server web:3000;
    }

    upstream api {
        server api:4021;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Frontend
        location / {
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API
        location /api {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check endpoint (public)
        location /health {
            proxy_pass http://api/health;
            access_log off;
        }
    }
}
```

## Phase 3: SSL Certificate

### 3.1 Obtain SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com

# Certificates will be at:
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem

# Copy to Docker volume
sudo mkdir -p infra/docker/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem infra/docker/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem infra/docker/ssl/
```

## Phase 4: Deploy

### 4.1 Start Production Services

```bash
cd infra/docker

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4.2 Verify Deployment

```bash
# Health check
curl https://your-domain.com/health

# Test API endpoint (should return 402 Payment Required)
curl https://your-domain.com/api/weather

# Check facilitator connection
curl -H "Authorization: Bearer $RELAYER_API_KEY" \
     https://your-domain.com/api/v1/plugins/x402/call/supported
```

## Phase 5: Smart Account Deployment

### 5.1 Install Soroban CLI

```bash
# Install Soroban CLI
cargo install soroban-cli

# Verify installation
soroban --version
```

### 5.2 Deploy Smart Account Contract

```bash
# Navigate to contracts directory
cd contracts/smart-account

# Build contract (if building from source)
soroban contract build

# Deploy to mainnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/smart_account.wasm \
  --source <your-source-account> \
  --network mainnet

# Initialize account with configuration
soroban contract invoke \
  --id <contract-id> \
  --source <your-source-account> \
  --network mainnet \
  -- \
  initialize \
  --threshold 2 \
  --signers '[{"key": "GABC...", "weight": 1}, ...]'
```

## Phase 6: Monitoring & Maintenance

### 6.1 Set Up Monitoring

```bash
# Enable Prometheus metrics in relayer config
# Metrics available at: http://localhost:9090/metrics

# Set up Grafana dashboard
docker run -d -p 3001:3000 grafana/grafana
```

### 6.2 Log Aggregation

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# Export logs for analysis
docker-compose -f docker-compose.prod.yml logs > logs.txt
```

### 6.3 Backup Strategy

```bash
# Backup Redis data
docker exec stellar-x402-redis redis-cli SAVE

# Backup keystores
cp -r relayer/config/keys /secure/backup/location

# Backup configuration
cp relayer/config/config.json /secure/backup/location
```

## Security Checklist

- [ ] Keystore files encrypted with strong passphrase
- [ ] Relayer not exposed to public internet (localhost only)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] API keys rotated regularly
- [ ] Firewall rules configured
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Compliance procedures documented
- [ ] Emergency freeze procedures tested

## Post-Deployment

1. **Test with small transactions** before going live
2. **Monitor first 24 hours** closely for any issues
3. **Set up alerts** for failed transactions and low balances
4. **Document runbooks** for common issues
5. **Train team** on compliance procedures

## Support

- **OpenZeppelin Docs**: https://docs.openzeppelin.com/relayer
- **Stellar Dev Discord**: https://discord.gg/stellar
- **x402 Protocol**: https://x402.org

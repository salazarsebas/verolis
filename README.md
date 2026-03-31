# Stellar x402 Institutional Payment DApp

A next-generation payment infrastructure for institutions and AI agents built on Stellar using the x402 protocol and OpenZeppelin's audited relayer framework.

## 🌟 Features

### For Institutions
- **Programmable Spending Limits**: Set daily/monthly budgets per API endpoint
- **Multi-Sig Approval**: Require N-of-M signatures for large payments
- **Compliance Hooks**: Freeze/unwind transactions for regulated entities
- **Multi-Currency Support**: USDC, PYUSD, EURC settlements
- **Real-Time Analytics**: Payment tracking and revenue reporting

### For Developers
- **One-Line Integration**: `paymentMiddleware()` for Express/Next.js
- **No API Keys**: Payment-based authentication via x402
- **Micropayment Support**: Sub-cent pricing enabled by Stellar's low fees
- **AI Agent Ready**: Autonomous payment discovery and execution
- **OpenZeppelin Security**: Audited contracts and relayer infrastructure

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│  - Paywall Components                                        │
│  - Dashboard & Analytics                                     │
│  - Smart Account Management                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               x402 Express Middleware                        │
│  - Payment verification                                      │
│  - /verify, /settle, /supported endpoints                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          OpenZeppelin Relayer + x402 Plugin                  │
│  - Payment facilitation                                      │
│  - Channel Service (high-throughput)                         │
│  - Stellar transaction submission                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Stellar Blockchain                          │
│  - Soroban Smart Accounts                                    │
│  - USDC/PYUSD/EURC stablecoins                               │
│  - <5 second settlement                                      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Freighter wallet (or compatible Stellar wallet)

### 1. Clone and Install

```bash
cd stellar-x402

# Install frontend dependencies
cd stellar-x402 && npm install

# Install API dependencies
cd apps/api && npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
# - STELLAR_ADDRESS: Your Stellar address to receive payments
# - RELAYER_API_KEY: API key for OpenZeppelin Relayer
# - NETWORK: stellar:testnet (or stellar:mainnet for production)
```

### 3. Start Infrastructure

```bash
# Start Redis, Relayer, and API server
cd infra/docker
docker-compose up -d
```

### 4. Run Development Servers

```bash
# Frontend (from stellar-x402 root)
npm run dev

# API Server (in another terminal)
cd apps/api && npm run dev
```

### 5. Access the DApp

- **Frontend**: http://localhost:3000
- **Demo**: http://localhost:3000/demo
- **Dashboard**: http://localhost:3000/dashboard
- **API**: http://localhost:4021

## 📁 Project Structure

```
stellar-x402/
├── apps/
│   ├── web/                    # Next.js frontend (in stellar-x402/)
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router pages
│   │   │   ├── components/     # React components
│   │   │   │   ├── paywall/    # x402 payment components
│   │   │   │   └── dashboard/  # Analytics & smart accounts
│   │   │   └── lib/            # Utilities and x402 client
│   │   └── package.json
│   └── api/                    # Express x402 middleware server
│       ├── src/
│       │   └── index.ts        # API server with payment middleware
│       └── package.json
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml  # Docker services orchestration
│   └── relayer/
│       ├── config/
│       │   └── config.json     # OpenZeppelin Relayer config
│       └── plugins/
│           └── x402/           # x402 Facilitator Plugin
├── relayer/                    # OpenZeppelin Relayer setup
└── docs/                       # Documentation
```

## 🔧 Configuration

### OpenZeppelin Relayer Config

Edit `relayer/config/config.json`:

```json
{
  "relayers": [
    {
      "id": "stellar-testnet",
      "name": "Stellar Testnet Relayer",
      "network": "testnet",
      "network_type": "stellar",
      "signer_id": "stellar-testnet-signer",
      "policies": {
        "fee_payment_strategy": "relayer",
        "sponsored_transactions": true
      }
    }
  ],
  "plugins": [
    {
      "id": "x402",
      "config": {
        "networks": [
          {
            "network": "stellar:testnet",
            "relayer_id": "stellar-testnet",
            "assets": ["CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"]
          }
        ]
      }
    }
  ]
}
```

### Payment Requirements

Configure in `apps/api/src/index.ts`:

```typescript
const paymentRequirements = {
  "GET /api/weather": {
    accepts: [
      {
        scheme: "exact",
        price: "$0.001",
        network: "stellar:testnet",
        payTo: stellarAddress,
      },
    ],
    description: "Real-time weather data API",
  },
  // Add more endpoints...
};
```

## 🎯 Use Cases

### 1. API Micropayments
Charge per request instead of managing subscriptions.

```
Weather API: $0.001/call → 1M calls = $1,000 revenue
No minimum commitment, no billing infrastructure
```

### 2. Cross-Border Remittance
Enable instant international payments (MoneyGram, AirTM).

```
Colombia → US settlement in <5 seconds
20-25% cost savings vs traditional providers
```

### 3. KYC/Compliance Services
Pay-per-verification for identity checks.

```
KYC verification: $0.50/check
Automated sanctions screening
```

### 4. Tokenized Assets
Facilitate payments for tokenized treasuries (Franklin Templeton).

```
$580M+ in tokenized treasury access
Institutional-grade settlement
```

## 🧪 Testing

### Test on Stellar Testnet

1. Get test XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator)
2. Connect Freighter wallet to testnet
3. Try the demo at http://localhost:3000/demo

### Run Tests

```bash
# Frontend tests
npm test

# API tests
cd apps/api && npm test
```

## 📚 Documentation

- [x402 Protocol](https://x402.org)
- [Stellar x402 Docs](https://developers.stellar.org/docs/build/apps/x402)
- [OpenZeppelin Relayer](https://docs.openzeppelin.com/relayer/1.4.x)
- [OpenZeppelin x402 Plugin](https://docs.openzeppelin.com/relayer/1.4.x/guides/stellar-x402-facilitator-guide)
- [Smart Account Contracts](https://docs.openzeppelin.com/stellar-contracts/accounts/smart-account)

## 🔐 Security

- **Relayer**: Deploy behind firewall/reverse proxy (not publicly exposed)
- **Keystore**: Secure keystore files with environment variable passphrases
- **Smart Accounts**: Use OpenZeppelin's audited Soroban contracts
- **Testing**: Always test on testnet before mainnet deployment

## 🌐 Institutional Partners

This DApp is designed for integrations with:

| Partner | Use Case |
|---------|----------|
| **PayPal** | PYUSD micropayments for merchant APIs |
| **Visa/Wirex** | USDC/EURC card settlement |
| **MoneyGram** | Cross-border remittance API payments |
| **Franklin Templeton** | Tokenized treasury fund access |
| **U.S. Bank** | Programmable stablecoin payments |
| **AirTM** | Payroll API micropayments |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **x402**: `@x402/express`, `@x402/next`, `@x402/stellar`
- **Relayer**: OpenZeppelin Relayer with x402 Facilitator Plugin
- **Smart Contracts**: OpenZeppelin Stellar Smart Account Contracts
- **Wallet**: Freighter, Albedo (browser extensions)
- **Network**: Stellar (Testnet → Mainnet)
- **Stablecoins**: USDC, PYUSD, EURC

## 📄 License

Apache-2.0

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📞 Support

- **Discord**: [Stellar Developer Discord](https://discord.gg/stellar)
- **GitHub**: Open an issue for bugs or feature requests
- **Docs**: Check the documentation for troubleshooting

---

Built with ❤️ using OpenZeppelin, Stellar, and the x402 Protocol

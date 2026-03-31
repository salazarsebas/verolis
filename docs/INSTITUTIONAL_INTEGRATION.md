# Institutional Integration Guide

This guide is for institutions looking to integrate Stellar x402 for programmatic payments.

## Table of Contents

1. [PayPal Integration](#paypal-integration)
2. [Visa/Wirex Integration](#visawirex-integration)
3. [MoneyGram Integration](#moneygram-integration)
4. [U.S. Bank Integration](#us-bank-integration)
5. [Franklin Templeton Integration](#franklin-templeton-integration)
6. [AirTM Integration](#airtm-integration)

---

## PayPal Integration

### Use Case
Enable PYUSD micropayments for merchant API access and working capital solutions.

### Configuration

```typescript
// Configure PYUSD asset
const PYUSD_CONFIG = {
  code: "PYUSD",
  issuer: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
  name: "PayPal USD",
};

// Payment requirements for merchant APIs
const paymentRequirements = {
  "GET /api/merchant/analytics": {
    accepts: [{
      scheme: "exact",
      price: "$0.01",
      network: "stellar:mainnet",
      payTo: YOUR_STELLAR_ADDRESS,
      asset: PYUSD_CONFIG,
    }],
    description: "Merchant analytics API",
  },
};
```

### Integration Steps

1. **Obtain PYUSD on Stellar**
   - Contact PayPal for institutional access
   - Set up PYUSD trustline on your Stellar account

2. **Configure Relayer**
   ```json
   {
     "plugins": [{
       "id": "x402",
       "config": {
         "networks": [{
           "network": "stellar:mainnet",
           "assets": [
             "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"
           ]
         }]
       }
     }]
   }
   ```

3. **Implement PayFi Features**
   - Instant payroll disbursements
   - Working capital advances
   - Merchant fee collection

### Compliance Considerations

- KYC/AML checks required for PayPal integration
- Transaction monitoring for suspicious activity
- Reporting for transactions >$10,000

---

## Visa/Wirex Integration

### Use Case
Enable USDC/EURC card settlement on Stellar for instant merchant payments.

### Configuration

```typescript
// Multi-currency support
const VISA_CONFIG = {
  USDC: {
    code: "USDC",
    issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
  },
  EURC: {
    code: "EURC",
    issuer: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
  },
};

// Card settlement endpoint
app.post("/api/visa/settle", async (req, res) => {
  const { cardTransaction, amount, currency } = req.body;
  
  // Convert card transaction to x402 payment
  const payment = {
    scheme: "exact",
    price: amount,
    network: "stellar:mainnet",
    payTo: MERCHANT_ADDRESS,
    asset: currency === "EUR" ? VISA_CONFIG.EURC : VISA_CONFIG.USDC,
  };
  
  // Process settlement
  const result = await processSettlement(payment);
  res.json(result);
});
```

### Integration Steps

1. **Visa Direct Integration**
   - Connect to Visa Direct API
   - Map card transactions to Stellar settlements

2. **Wirex Partnership**
   - Set up Wirex merchant account
   - Configure settlement addresses

3. **Real-Time Settlement**
   - Process settlements in <5 seconds
   - Handle currency conversion (USD/EUR)

### Benefits

- 24/7 settlement (vs. traditional T+2)
- Lower transaction costs
- Reduced counterparty risk

---

## MoneyGram Integration

### Use Case
Cross-border remittance API payments with 20-25% cost savings.

### Configuration

```typescript
// Remittance payment flow
const MONEYGRAM_CONFIG = {
  corridors: [
    { from: "US", to: "CO", asset: "USDC" },
    { from: "US", to: "MX", asset: "USDC" },
    { from: "EU", to: "PH", asset: "EURC" },
  ],
};

app.post("/api/remittance/send", async (req, res) => {
  const { sender, recipient, amount, corridor } = req.body;
  
  // Create x402 payment for remittance
  const payment = {
    scheme: "exact",
    price: amount,
    network: "stellar:mainnet",
    payTo: recipient.address,
    asset: corridor.asset,
  };
  
  // Process through MoneyGram on-ramp
  const result = await moneyGramOnRamp(payment);
  
  // Settle on Stellar
  const settlement = await settleOnStellar(payment);
  
  res.json({
    transactionId: settlement.hash,
    status: "completed",
    settlementTime: "< 5 seconds",
  });
});
```

### Integration Steps

1. **MoneyGram Partnership**
   - Contact MoneyGram for API access
   - Set up on/off-ramp integration

2. **Corridor Configuration**
   - Define supported corridors
   - Configure liquidity providers

3. **Compliance Setup**
   - Implement AML screening
   - Set up transaction monitoring

### Cost Savings Example

```
Traditional Remittance (US → Colombia):
- Transfer: $1,000
- Fee: $80 (8%)
- Exchange rate margin: $30
- Total cost: $110

Stellar x402 Remittance:
- Transfer: $1,000
- Fee: $0.00001 (network) + $20 (service)
- Exchange rate margin: $0 (market rate)
- Total cost: ~$20

Savings: $90 (90% reduction)
```

---

## U.S. Bank Integration

### Use Case
Programmable stablecoin issuance with compliance controls.

### Configuration

```typescript
// Compliance-enabled smart account
const USBANK_CONFIG = {
  complianceEnabled: true,
  features: {
    freeze: true,      // Freeze suspicious transactions
    clawback: true,    // Clawback for compliance
    kyc: true,         // KYC verification required
  },
};

// Smart account with compliance hooks
const smartAccount = {
  threshold: 2,
  signers: [
    { address: "USBANK_SIGNER_1", weight: 1 },
    { address: "USBANK_SIGNER_2", weight: 1 },
    { address: "COMPLIANCE_OFFICER", weight: 1 },
  ],
  policies: [
    {
      type: "spending-limit",
      config: { limit: 1000000, period: "daily" },
    },
    {
      type: "compliance-freeze",
      config: { enabled: true, authority: "COMPLIANCE_OFFICER" },
    },
    {
      type: "clawback",
      config: { enabled: true, authority: "USBANK_SIGNER_1" },
    },
  ],
};
```

### Integration Steps

1. **Custom Stablecoin Setup**
   - Deploy custom stablecoin contract on Stellar
   - Configure freeze/clawback capabilities

2. **Compliance Integration**
   - Connect to U.S. Bank compliance systems
   - Implement real-time screening

3. **Smart Account Deployment**
   - Deploy OpenZeppelin smart account
   - Configure signers and policies

### Regulatory Compliance

- **BSA/AML**: Bank Secrecy Act compliance
- **OFAC**: Sanctions screening
- **KYC**: Customer identification
- **CTR**: Currency transaction reports

---

## Franklin Templeton Integration

### Use Case
Tokenized treasury fund access payments for institutional investors.

### Configuration

```typescript
// Tokenized fund access
const FT_CONFIG = {
  fund: "BENJI",  // Franklin OnChain U.S. Government Money Fund
  minInvestment: 1,  // $1 minimum
  asset: "BENJI",
};

app.post("/api/fund/invest", async (req, res) => {
  const { investorId, amount } = req.body;
  
  // Verify investor accreditation
  const accredited = await verifyAccreditation(investorId);
  if (!accredited) {
    return res.status(403).json({ error: "Investor not accredited" });
  }
  
  // Create x402 payment for fund shares
  const payment = {
    scheme: "exact",
    price: amount,
    network: "stellar:mainnet",
    payTo: FT_FUND_ADDRESS,
    asset: "USDC",
  };
  
  // Mint fund shares
  const shares = await mintFundShares(investorId, amount);
  
  res.json({
    shares: shares,
    nav: await getCurrentNAV(),
    transactionHash: shares.hash,
  });
});
```

### Integration Steps

1. **Fund Access Setup**
   - Complete Franklin Templeton onboarding
   - Set up investor verification system

2. **Tokenization Integration**
   - Connect to BENJI token contract
   - Implement mint/burn mechanisms

3. **NAV Pricing**
   - Integrate with pricing oracle
   - Update NAV daily

### Institutional Features

- 24/7 subscription/redemption
- Instant settlement
- Transparent on-chain holdings
- Automated compliance

---

## AirTM Integration

### Use Case
Global payroll API micropayments with 20-25% cost savings.

### Configuration

```typescript
// Payroll batch processing
const AIRTEN_CONFIG = {
  countries: ["AR", "BR", "MX", "CO", "VE"],
  currencies: ["USDC", "local"],
  maxBatchSize: 1000,
};

app.post("/api/payroll/process", async (req, res) => {
  const { employerId, employees, period } = req.body;
  
  // Create batch payments
  const batchPayments = employees.map(emp => ({
    recipient: emp.address,
    amount: emp.salary,
    asset: "USDC",
    description: `Payroll ${period}`,
  }));
  
  // Process batch through x402
  const results = await processBatchPayments(batchPayments);
  
  // Save 20-25% vs traditional payroll
  const savings = calculateSavings(batchPayments);
  
  res.json({
    processed: results.length,
    totalAmount: batchPayments.reduce((sum, p) => sum + p.amount, 0),
    savings: savings,
    settlementTime: "< 5 seconds",
  });
});
```

### Integration Steps

1. **AirTM Partnership**
   - Set up AirTM business account
   - Configure payroll integration

2. **Batch Processing**
   - Implement batch payment API
   - Handle large employee counts

3. **Local Currency Conversion**
   - Integrate with local exchanges
   - Support fiat on/off-ramps

### Cost Comparison

```
Traditional Payroll (100 employees, $100k total):
- Processing fee: $500
- Wire fees: $2,500
- FX margin: $2,000
- Total: $5,000 (5%)

Stellar x402 Payroll:
- Network fees: $0.001
- Service fee: $1,000
- FX margin: $0 (market rate)
- Total: ~$1,000 (1%)

Savings: $4,000 (80% reduction)
```

---

## Common Integration Patterns

### 1. Payment Middleware Setup

```typescript
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

const facilitatorClient = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
  createAuthHeaders: async () => ({
    verify: { Authorization: `Bearer ${API_KEY}` },
    settle: { Authorization: `Bearer ${API_KEY}` },
  }),
});

app.use(
  paymentMiddleware(
    paymentRequirements,
    new x402ResourceServer(facilitatorClient)
      .register("stellar:mainnet", new ExactStellarScheme())
  )
);
```

### 2. Smart Account Configuration

```typescript
import { InstitutionalFeaturesManager } from "@/lib/institutional/features";

const institutionalFeatures = new InstitutionalFeaturesManager({
  complianceEnabled: true,
  multiAssetSupport: ["USDC", "PYUSD", "EURC"],
  batchSettlementEnabled: true,
  webhookUrl: process.env.WEBHOOK_URL,
});

// Pre-transaction compliance check
const { allowed, reason } = await institutionalFeatures.preTransactionCheck(
  userId,
  amount,
  asset
);

if (!allowed) {
  throw new Error(`Transaction blocked: ${reason}`);
}
```

### 3. Batch Settlement

```typescript
import { MultiAssetService } from "@/lib/institutional/features";

const multiAsset = new MultiAssetService();

// Process 1000 payments in parallel
const batchPayments = employees.map(emp => ({
  id: emp.id,
  recipient: emp.address,
  amount: emp.salary.toString(),
  asset: "USDC",
}));

const results = await multiAsset.processBatchPayments(batchPayments);
console.log(`Processed ${results.length} payments`);
```

---

## Support

For institutional integration support:

- **Technical**: integration@stellar.org
- **Partnerships**: partnerships@stellar.org
- **Compliance**: compliance@stellar.org

## Resources

- [Stellar Development Foundation](https://stellar.org)
- [OpenZeppelin Relayer Docs](https://docs.openzeppelin.com/relayer)
- [x402 Protocol](https://x402.org)
- [Stellar Developer Discord](https://discord.gg/stellar)

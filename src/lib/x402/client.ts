/**
 * x402 Client Utilities for Stellar
 * Browser demo helper for wallet connection and manual x402 request retries.
 */

import { connect, isConnected, disconnect } from "@stellar/freighter-api";

export interface PaymentRequirements {
  scheme: string;
  price: string;
  network: string;
  payTo: string;
}

export interface PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: {
    price: string;
    payTo: string;
    resource: string;
    description: string;
  };
  signature?: string;
  authEntries?: any[];
}

export interface X402Response {
  status: number;
  paymentRequired?: {
    accepts: PaymentRequirements[];
    description: string;
  };
  paymentResponse?: {
    scheme: string;
    network: string;
    transactionHash?: string;
  };
}

export function getBrowserX402SupportState() {
  return {
    mode: "demo",
    limitation:
      "Production Stellar x402 in the browser still needs wallet support for Soroban auth-entry signing.",
    recommendation:
      "Use @x402/fetch plus a wallet or signer that can approve auth entries before enabling mainnet flows.",
  };
}

/**
 * Connect to Freighter wallet
 */
export async function connectWallet(): Promise<string> {
  try {
    if (!await isConnected()) {
      const { address } = await connect();
      return address;
    }
    const { address } = await connect();
    return address;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw new Error("Wallet connection failed");
  }
}

/**
 * Disconnect from Freighter wallet
 */
export async function disconnectWallet(): Promise<void> {
  await disconnect();
}

/**
 * Parse price string to lumens
 */
export function parsePrice(price: string): string {
  // Remove $ sign and convert to numeric
  const numericPrice = parseFloat(price.replace("$", ""));
  // Convert to stroops (1 XLM = 10^7 stroops)
  return (numericPrice * 10000000).toString();
}

/**
 * Create x402 payment payload
 */
export function createPaymentPayload(
  requirements: PaymentRequirements,
  resource: string,
  description: string
): PaymentPayload {
  return {
    x402Version: 2,
    scheme: requirements.scheme,
    network: requirements.network,
    payload: {
      price: requirements.price,
      payTo: requirements.payTo,
      resource,
      description,
    },
  };
}

/**
 * Sign Soroban authorization entry for x402 payment
 */
export async function signPaymentAuthorization(
  payment: PaymentPayload,
  walletAddress: string
): Promise<PaymentPayload> {
  try {
    // Connect to Freighter if not already connected
    if (!await isConnected()) {
      await connect();
    }

    // Demo-only placeholder. Production x402 must sign the auth entry produced
    // by the exact Stellar payment flow using a compatible wallet.
    const authEntry = {
      address: walletAddress,
      nonce: Date.now().toString(),
      expiration: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      payload: payment.payload,
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(authEntry));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    return {
      ...payment,
      signature,
      authEntries: [authEntry],
    };
  } catch (error) {
    console.error("Failed to sign payment authorization:", error);
    throw error;
  }
}

/**
 * Create payment headers for x402 request
 */
export function createPaymentHeaders(payment: PaymentPayload): Record<string, string> {
  return {
    "x402-version": payment.x402Version.toString(),
    "x402-scheme": payment.scheme,
    "x402-network": payment.network,
    "x402-payload": Buffer.from(JSON.stringify(payment.payload)).toString("base64"),
    "x402-signature": payment.signature || "",
  };
}

/**
 * Make x402 payment request
 */
export async function makeX402Request(
  url: string,
  requirements: PaymentRequirements,
  options: RequestInit = {}
): Promise<Response> {
  try {
    if (!requirements.payTo || requirements.payTo === "UNCONFIGURED_STELLAR_ADDRESS") {
      throw new Error("Missing payTo configuration for Stellar x402 payments");
    }

    // First request without payment
    let response = await fetch(url, options);

    // If 402 Payment Required, create and attach payment
    if (response.status === 402) {
      const walletAddress = await connectWallet();
      const payment = createPaymentPayload(requirements, url, "Institutional x402 request");
      const signedPayment = await signPaymentAuthorization(payment, walletAddress);
      const headers = createPaymentHeaders(signedPayment);

      // Retry with payment
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...headers,
        },
      });
    }

    return response;
  } catch (error) {
    console.error("x402 request failed:", error);
    throw error;
  }
}

/**
 * Parse x402 response headers
 */
export function parseX402Response(response: Response): X402Response {
  const x402Version = response.headers.get("x402-version");
  const paymentRequired = response.headers.get("payment-required");
  const paymentResponse = response.headers.get("payment-response");

  const result: X402Response = {
    status: response.status,
  };

  if (response.status === 402 && paymentRequired) {
    try {
      result.paymentRequired = JSON.parse(Buffer.from(paymentRequired, "base64").toString());
    } catch (e) {
      console.error("Failed to parse payment-required header:", e);
    }
  }

  if (paymentResponse) {
    try {
      result.paymentResponse = JSON.parse(Buffer.from(paymentResponse, "base64").toString());
    } catch (e) {
      console.error("Failed to parse payment-response header:", e);
    }
  }

  return result;
}

/**
 * Get supported payment methods from facilitator
 */
export async function getSupportedPayments(facilitatorUrl: string): Promise<any> {
  try {
    const response = await fetch(`${facilitatorUrl}/supported`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to get supported payments:", error);
    return null;
  }
}

/**
 * Verify payment with facilitator
 */
export async function verifyPayment(
  facilitatorUrl: string,
  payment: PaymentPayload,
  apiKey: string
): Promise<any> {
  try {
    const response = await fetch(`${facilitatorUrl}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payment),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to verify payment:", error);
    return null;
  }
}

/**
 * Settle payment with facilitator
 */
export async function settlePayment(
  facilitatorUrl: string,
  payment: PaymentPayload,
  apiKey: string
): Promise<any> {
  try {
    const response = await fetch(`${facilitatorUrl}/settle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payment),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to settle payment:", error);
    return null;
  }
}
